import { test, expect, type Page } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturePath = path.resolve(__dirname, "../fixtures/samples.v1.json");
const fixtures = JSON.parse(fs.readFileSync(fixturePath, "utf-8")) as Fixtures;

type ToolSample = {
  route: string;
  inputs: Record<string, string>;
  click?: string;
  expect: string[];
  snapshot: string;
};
type Fixtures = {
  version: number;
  tools: Record<string, ToolSample>;
};

const snapshotsDir = path.resolve(__dirname, "__snapshots__");
const artifactsDir = path.resolve(__dirname, "../../test-results/tools");
fs.mkdirSync(snapshotsDir, { recursive: true });
fs.mkdirSync(artifactsDir, { recursive: true });

/**
 * Per-tool driver: knows how to translate fixture `inputs` into UI interactions.
 * Keeps the fixture pure data and the interactions co-located with the tools.
 */
const DRIVERS: Record<string, (page: Page, s: ToolSample) => Promise<void>> = {
  "serp-preview": async (page, s) => {
    const inputs = page.locator("input");
    const textarea = page.locator("textarea").first();
    await inputs.nth(0).fill(s.inputs.title);
    await textarea.fill(s.inputs.description);
    await inputs.nth(1).fill(s.inputs.keyword);
  },
  "keyword-density": async (page, s) => {
    await page.locator("textarea").first().fill(s.inputs.text);
  },
  "page-auditor": async (page, s) => {
    await page.locator("textarea").first().fill(s.inputs.html);
  },
  readability: async (page, s) => {
    await page.locator("textarea").first().fill(s.inputs.text);
  },
  "meta-generator": async (page, s) => {
    const inputs = page.locator("input");
    const textarea = page.locator("textarea").first();
    await inputs.nth(0).fill(s.inputs.title);
    await textarea.fill(s.inputs.description);
    await inputs.nth(1).fill(s.inputs.url);
    await inputs.nth(2).fill(s.inputs.image);
    await inputs.nth(3).fill(s.inputs.site);
    await inputs.nth(4).fill(s.inputs.author);
  },
  "robots-sitemap": async () => {
    /* default state already renders robots.txt */
  },
  "anchor-audit": async (page, s) => {
    const inputs = page.locator("input");
    await inputs.nth(0).fill(s.inputs.brand);
    await inputs.nth(1).fill(s.inputs.keyword);
    await page.locator("textarea").first().fill(s.inputs.text);
  },
  "keyword-ideas": async (page, s) => {
    await page.locator("input").first().fill(s.inputs.seed);
  },
};

/**
 * DOM snapshot: strip volatile bits (inline styles animating, aria-live values)
 * so we assert *structure*, not pixel-perfect state.
 */
async function captureDomSnapshot(page: Page): Promise<string> {
  return page.evaluate(() => {
    const root = document.querySelector("main") ?? document.body;
    const clone = root.cloneNode(true) as HTMLElement;
    clone.querySelectorAll("[style]").forEach((el) => el.removeAttribute("style"));
    clone.querySelectorAll("script,style,svg").forEach((el) => el.remove());
    // Normalize whitespace-heavy text nodes
    return clone.innerHTML.replace(/\s+/g, " ").trim();
  });
}

test.describe(`8-tool e2e suite (fixtures v${fixtures.version})`, () => {
  for (const [slug, sample] of Object.entries(fixtures.tools)) {
    test(`tool: ${slug}`, async ({ page }, testInfo) => {
      const consoleErrors: string[] = [];
      page.on("pageerror", (e) => consoleErrors.push(String(e)));
      page.on("console", (msg) => {
        if (msg.type() === "error") consoleErrors.push(msg.text());
      });

      await page.goto(sample.route, { waitUntil: "domcontentloaded" });
      await expect(page.locator("h1")).toBeVisible();

      const driver = DRIVERS[slug];
      if (!driver) throw new Error(`No driver registered for tool "${slug}"`);
      await driver(page, sample);

      if (sample.click) {
        await page.getByRole("button", { name: sample.click, exact: false }).first().click();
      }

      // Debounce React state → DOM
      await page.waitForTimeout(400);

      // Content assertions
      for (const needle of sample.expect) {
        await expect(page.locator("main, body").first()).toContainText(needle, {
          ignoreCase: true,
        });
      }

      // Guard against silent empty renders
      const bodyText = (await page.locator("body").innerText()).trim();
      expect(bodyText.length, `Empty render for ${slug}`).toBeGreaterThan(500);

      // Screenshot artifact
      const shotPath = path.join(artifactsDir, `${slug}.png`);
      await page.screenshot({ path: shotPath });
      await testInfo.attach(`${slug}-screenshot`, {
        path: shotPath,
        contentType: "image/png",
      });

      // DOM snapshot — asserts stable structural markers rather than byte-equality
      const dom = await captureDomSnapshot(page);
      const snapPath = path.join(snapshotsDir, sample.snapshot);
      await testInfo.attach(`${slug}-dom`, {
        body: dom,
        contentType: "text/html",
      });
      if (process.env.UPDATE_SNAPSHOTS === "1" || !fs.existsSync(snapPath)) {
        fs.writeFileSync(snapPath, dom);
      } else {
        const prev = fs.readFileSync(snapPath, "utf-8");
        // Structural check: each expected needle + every h1/h2 heading text
        // must still be present in the new DOM. Full-text diff would be too
        // brittle across React re-orderings.
        const headings = Array.from(prev.matchAll(/<h[12][^>]*>([^<]+)<\/h[12]>/g))
          .map((m) => m[1].trim())
          .filter(Boolean);
        for (const h of headings) {
          expect(dom, `Missing heading "${h}" after change`).toContain(h);
        }
      }

      expect(consoleErrors, `Runtime errors on ${slug}: ${consoleErrors.join(" | ")}`).toEqual([]);
    });
  }
});
