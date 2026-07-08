import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { Copy, Check, Trash2, Plus } from "lucide-react";

type Rule = { agent: string; kind: "Allow" | "Disallow"; path: string };

export function RobotsSitemapTool() {
  const { t } = useI18n();
  const [tab, setTab] = useState<"robots" | "sitemap">("robots");
  const [rules, setRules] = useState<Rule[]>([{ agent: "*", kind: "Disallow", path: "/admin" }]);
  const [sitemapUrl, setSitemapUrl] = useState("https://example.com/sitemap.xml");
  const [urls, setUrls] = useState<string[]>(["https://example.com/"]);
  const [copied, setCopied] = useState(false);

  const robotsTxt = useMemo(() => {
    const grouped = new Map<string, Rule[]>();
    for (const r of rules) {
      const key = r.agent.trim() || "*";
      grouped.set(key, [...(grouped.get(key) || []), r]);
    }
    let out = "";
    for (const [agent, list] of grouped) {
      out += `User-agent: ${agent}\n`;
      for (const r of list) out += `${r.kind}: ${r.path.trim() || "/"}\n`;
      out += "\n";
    }
    if (sitemapUrl.trim()) out += `Sitemap: ${sitemapUrl.trim()}\n`;
    return out.trim();
  }, [rules, sitemapUrl]);

  const warnings = useMemo(() => {
    const w: string[] = [];
    for (const r of rules) {
      if (r.kind === "Disallow" && r.path.trim() === "/") w.push(`${t.ui.robots.warnBlocksSite} "${r.agent}"`);
      if (r.path.includes("*") && !r.path.startsWith("/")) w.push(`${t.ui.robots.warnWildcard}: "${r.path}"`);
      if (!r.path.startsWith("/")) w.push(`${t.ui.robots.warnNotAbsolute}: "${r.path}"`);
    }
    return w;
  }, [rules, t.ui.robots]);

  const sitemapXml = useMemo(() => {
    const items = urls
      .map((u) => u.trim())
      .filter((u) => /^https?:\/\//.test(u))
      .map((u) => `  <url><loc>${u}</loc><lastmod>${new Date().toISOString().slice(0, 10)}</lastmod></url>`)
      .join("\n");
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</urlset>`;
  }, [urls]);

  const invalidUrls = urls.filter((u) => u.trim() && !/^https?:\/\//.test(u.trim())).length;

  const copy = async (s: string) => {
    await navigator.clipboard.writeText(s);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div>
      <div className="flex gap-1 mb-6 p-1 rounded-full bg-void/60 w-fit">
        {(["robots", "sitemap"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setTab(v)}
            className={"px-4 py-1.5 text-sm rounded-full transition " + (tab === v ? "gradient-violet text-white" : "text-mist")}
          >
            {v === "robots" ? "robots.txt" : "sitemap.xml"}
          </button>
        ))}
      </div>

      {tab === "robots" ? (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="crystal-card p-6 space-y-3">
            <h2 className="font-display text-xl">{t.ui.input}</h2>
            {rules.map((r, i) => (
              <div key={i} className="grid grid-cols-[100px_100px_1fr_auto] gap-2">
                <input value={r.agent} onChange={(e) => update(i, { agent: e.target.value })} className="rounded bg-void/60 border border-border px-2 py-1 text-xs font-mono" />
                <select value={r.kind} onChange={(e) => update(i, { kind: e.target.value as "Allow" | "Disallow" })} className="rounded bg-void/60 border border-border px-2 py-1 text-xs font-mono">
                  <option>Allow</option><option>Disallow</option>
                </select>
                <input value={r.path} onChange={(e) => update(i, { path: e.target.value })} className="rounded bg-void/60 border border-border px-2 py-1 text-xs font-mono" />
                <button onClick={() => setRules(rules.filter((_, j) => j !== i))} className="text-mist hover:text-danger-rose"><Trash2 className="h-4 w-4" /></button>
              </div>
            ))}
            <button onClick={() => setRules([...rules, { agent: "*", kind: "Disallow", path: "/" }])} className="flex items-center gap-1 text-xs text-amethyst-glow"><Plus className="h-3 w-3" />{t.ui.robots.addRule}</button>
            <div className="pt-3">
              <div className="text-xs uppercase tracking-widest text-mist font-mono mb-1">{t.ui.robots.sitemap}</div>
              <input value={sitemapUrl} onChange={(e) => setSitemapUrl(e.target.value)} className="w-full rounded bg-void/60 border border-border px-2 py-1 text-xs font-mono" />
            </div>
          </div>
          <div className="space-y-4">
            <div className="crystal-card p-6">
              <div className="flex justify-between mb-3">
                <h3 className="font-display text-lg">robots.txt</h3>
                <button onClick={() => copy(robotsTxt)} className="text-xs flex items-center gap-1 border border-border rounded-full px-3 py-1 hover:border-amethyst-glow">{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{copied ? t.ui.copied : t.ui.copy}</button>
              </div>
              <pre className="bg-void/70 rounded p-3 text-xs font-mono overflow-x-auto"><code>{robotsTxt}</code></pre>
            </div>
            {warnings.length > 0 && (
              <div className="crystal-card p-5 border border-warning-amber/40">
                <div className="text-xs font-mono uppercase tracking-widest text-warning-amber mb-2">{t.ui.robots.lint}</div>
                <ul className="text-sm space-y-1">
                  {warnings.map((w, i) => <li key={i} className="text-mist">• {w}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="crystal-card p-6 space-y-3">
            <h2 className="font-display text-xl">{t.ui.robots.urls}</h2>
            <textarea
              value={urls.join("\n")}
              onChange={(e) => setUrls(e.target.value.split("\n"))}
              rows={14}
              className="w-full rounded bg-void/60 border border-border px-2 py-1 text-xs font-mono"
              placeholder="https://example.com/page"
            />
            <div className="text-xs text-mist">{urls.filter((u) => u.trim()).length} {t.ui.robots.urlsCount}{invalidUrls > 0 && ` — ${invalidUrls} ${t.ui.robots.invalidCount}`}{urls.length > 50000 && ` — ${t.ui.robots.overLimit}`}</div>
          </div>
          <div className="crystal-card p-6">
            <div className="flex justify-between mb-3">
              <h3 className="font-display text-lg">sitemap.xml</h3>
              <button onClick={() => copy(sitemapXml)} className="text-xs flex items-center gap-1 border border-border rounded-full px-3 py-1 hover:border-amethyst-glow">{copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}{copied ? t.ui.copied : t.ui.copy}</button>
            </div>
            <pre className="bg-void/70 rounded p-3 text-[11px] font-mono overflow-x-auto max-h-96 overflow-y-auto"><code>{sitemapXml}</code></pre>
          </div>
        </div>
      )}
    </div>
  );

  function update(i: number, patch: Partial<Rule>) {
    setRules(rules.map((r, j) => (i === j ? { ...r, ...patch } : r)));
  }
}
