import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { TOOLS } from "@/lib/tools-catalog";

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
          .select("slug,lang,updated_at")
          .eq("status", "published");
        const langs = ["en", "fr", "ar"];
        const staticPaths = ["", "/tools", "/blog", "/about", "/contact"];
        const urls: string[] = [];
        for (const l of langs) {
          for (const p of staticPaths)
            urls.push(`<url><loc>${origin}/${l}${p}</loc><changefreq>weekly</changefreq></url>`);
          for (const t of TOOLS)
            urls.push(`<url><loc>${origin}/${l}/tools/${t.slug}</loc><changefreq>monthly</changefreq></url>`);
        }
        for (const r of (data as { slug: string; lang: string; updated_at: string }[]) || []) {
          urls.push(`<url><loc>${origin}/${r.lang}/blog/${r.slug}</loc><lastmod>${r.updated_at.slice(0, 10)}</lastmod></url>`);
        }
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>`;
        return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=3600" } });
      },
    },
  },
});

