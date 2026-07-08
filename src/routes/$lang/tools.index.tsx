import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { TOOLS } from "@/lib/tools-catalog";
import { abs, hreflangLinks, ogLocale, pickLang, SITE_ORIGIN } from "@/lib/seo/head";
import type { Lang } from "@/i18n/dictionaries";

export const Route = createFileRoute("/$lang/tools/")({
  component: ToolsHub,
  head: ({ params }) => {
    const lang = params.lang as Lang;
    const title = pickLang(lang, {
      en: "SEO Tools — E-SeoMax",
      fr: "Outils SEO — E-SeoMax",
      ar: "أدوات SEO — E-SeoMax",
    });
    const description = pickLang(lang, {
      en: "Eight algorithmic SEO tools running fully in your browser: SERP preview, keyword density, page auditor, readability, meta generator, robots & sitemap, anchor audit, and keyword ideas.",
      fr: "Huit outils SEO algorithmiques dans votre navigateur : aperçu SERP, densité de mots-clés, audit de page, lisibilité, générateur de meta, robots & sitemap, audit d'ancres et idées de mots-clés.",
      ar: "ثمانية أدوات SEO خوارزمية تعمل بالكامل في متصفحك: معاينة SERP، كثافة الكلمات، تدقيق الصفحة، قابلية القراءة، مولّد الوسوم، robots وsitemap، تدقيق الروابط، وأفكار الكلمات.",
    });
    const url = abs(`/${params.lang}/tools`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: ogLocale(lang) },
        { property: "og:image", content: `${SITE_ORIGIN}/og-default.png` },
        { name: "twitter:image", content: `${SITE_ORIGIN}/og-default.png` },
      ],
      links: [
        { rel: "canonical", href: url },
        ...hreflangLinks("/tools"),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: TOOLS.map((t, i) => ({
              "@type": "ListItem",
              position: i + 1,
              url: `${SITE_ORIGIN}/${params.lang}/tools/${t.slug}`,
              name: t.slug,
            })),
          }),
        },
      ],
    };
  },
});

function ToolsHub() {
  const { t, lang } = useI18n();
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl md:text-6xl gradient-text">{t.toolsHub.title}</h1>
        <p className="mt-4 text-mist">{t.toolsHub.subtitle}</p>
      </div>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map(({ slug, icon: Icon }) => {
          const meta = t.tools[slug];
          return (
            <Link
              key={slug}
              to={`/${lang}/tools/${slug}`}
              className="crystal-card crystal-card-hover p-6 block"
            >
              <div className="flex items-start justify-between">
                <div
                  className="grid h-11 w-11 place-items-center rounded-xl"
                  style={{
                    background:
                      "linear-gradient(135deg, hsl(265 85% 58% / 0.25), hsl(275 100% 78% / 0.15))",
                    border: "1px solid hsl(275 100% 78% / 0.25)",
                  }}
                >
                  <Icon className="h-5 w-5 text-amethyst-glow" />
                </div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-mist border border-border rounded-full px-2 py-1">
                  {t.toolsHub.badge}
                </span>
              </div>
              <div className="mt-4 font-display text-xl">{meta.name}</div>
              <p className="mt-1 text-sm text-mist">{meta.tagline}</p>
              <div className="mt-4 text-xs font-mono uppercase tracking-widest text-amethyst-glow">
                {t.cta.tryNow} →
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
