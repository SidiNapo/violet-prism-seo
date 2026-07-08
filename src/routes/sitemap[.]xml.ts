import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { TOOLS } from "@/lib/tools-catalog";

const LANGS = ["en", "fr", "ar"] as const;

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const host = new URL(request.url).host;
        const origin = host.includes("e-seomax.com") || host.includes("localhost")
          ? "https://e-seomax.com"
          : new URL(request.url).origin;

        const supabase = createClient(
          process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL!,
          process.env.SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY!,
        );
        const { data } = await supabase
          .from("posts")
          .select("slug,lang,updated_at,translation_group")
          .eq("status", "published");

        const posts = (data as { slug: string; lang: string; updated_at: string; translation_group: string }[]) || [];
        const latestPostUpdate = posts.reduce<string | null>((acc, r) => {
          const d = r.updated_at?.slice(0, 10);
          return !acc || (d && d > acc) ? d ?? acc : acc;
        }, null);
        const staticLastmod = latestPostUpdate || new Date().toISOString().slice(0, 10);

        // Group post siblings by translation_group for per-URL alternates.
        const groupBy = new Map<string, { lang: string; slug: string }[]>();
        for (const p of posts) {
          const arr = groupBy.get(p.translation_group) || [];
          arr.push({ lang: p.lang, slug: p.slug });
          groupBy.set(p.translation_group, arr);
        }

        const staticPaths = ["", "/tools", "/blog", "/about", "/contact"];
        const urls: string[] = [];

        // Static routes: same path exists in all langs → full xhtml:link alternates.
        for (const p of staticPaths) {
          for (const l of LANGS) {
            const loc = `${origin}/${l}${p}`;
            const alts = LANGS.map(
              (al) => `    <xhtml:link rel="alternate" hreflang="${al}" href="${origin}/${al}${p}" />`,
            ).join("\n");
            const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/en${p}" />`;
            urls.push(
              `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${staticLastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n${alts}\n${xDefault}\n  </url>`,
            );
          }
        }

        // Tool detail routes: same slug across langs.
        for (const t of TOOLS) {
          for (const l of LANGS) {
            const loc = `${origin}/${l}/tools/${t.slug}`;
            const alts = LANGS.map(
              (al) => `    <xhtml:link rel="alternate" hreflang="${al}" href="${origin}/${al}/tools/${t.slug}" />`,
            ).join("\n");
            const xDefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/en/tools/${t.slug}" />`;
            urls.push(
              `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${staticLastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n${alts}\n${xDefault}\n  </url>`,
            );
          }
        }

        // Blog posts: alternates only from actual sibling slugs per translation_group.
        for (const r of posts) {
          const siblings = groupBy.get(r.translation_group) || [];
          const alts = siblings
            .map((s) => `    <xhtml:link rel="alternate" hreflang="${s.lang}" href="${origin}/${s.lang}/blog/${s.slug}" />`)
            .join("\n");
          const enSib = siblings.find((s) => s.lang === "en");
          const xDefault = enSib
            ? `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${origin}/en/blog/${enSib.slug}" />`
            : "";
          urls.push(
            `  <url>\n    <loc>${origin}/${r.lang}/blog/${r.slug}</loc>\n    <lastmod>${r.updated_at.slice(0, 10)}</lastmod>\n${alts}${xDefault}\n  </url>`,
          );
        }

        const body =
          `<?xml version="1.0" encoding="UTF-8"?>\n` +
          `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
          urls.join("\n") +
          `\n</urlset>`;
        return new Response(body, {
          headers: {
            "content-type": "application/xml; charset=utf-8",
            "cache-control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
