import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { lazy, Suspense, type ComponentType } from "react";
import { useI18n } from "@/i18n/context";
import { TOOLS, type ToolSlug } from "@/lib/tools-catalog";
import { dictionaries, type Lang } from "@/i18n/dictionaries";
import { abs, hreflangLinks, ogLocale, SITE_ORIGIN } from "@/lib/seo/head";
import { ArrowRight } from "lucide-react";

const COMPONENTS: Record<ToolSlug, ComponentType> = {
  "serp-preview": lazy(() =>
    import("@/components/tools/SerpPreviewTool").then((m) => ({ default: m.SerpPreviewTool })),
  ),
  "keyword-density": lazy(() =>
    import("@/components/tools/KeywordDensityTool").then((m) => ({ default: m.KeywordDensityTool })),
  ),
  "page-auditor": lazy(() =>
    import("@/components/tools/PageAuditorTool").then((m) => ({ default: m.PageAuditorTool })),
  ),
  readability: lazy(() =>
    import("@/components/tools/ReadabilityTool").then((m) => ({ default: m.ReadabilityTool })),
  ),
  "meta-generator": lazy(() =>
    import("@/components/tools/MetaGeneratorTool").then((m) => ({ default: m.MetaGeneratorTool })),
  ),
  "robots-sitemap": lazy(() =>
    import("@/components/tools/RobotsSitemapTool").then((m) => ({ default: m.RobotsSitemapTool })),
  ),
  "anchor-audit": lazy(() =>
    import("@/components/tools/AnchorAuditTool").then((m) => ({ default: m.AnchorAuditTool })),
  ),
  "keyword-ideas": lazy(() =>
    import("@/components/tools/KeywordIdeasTool").then((m) => ({ default: m.KeywordIdeasTool })),
  ),
};

const SLUGS = TOOLS.map((t) => t.slug) as string[];

export const Route = createFileRoute("/$lang/tools/$slug")({
  beforeLoad: ({ params }) => {
    if (!SLUGS.includes(params.slug)) throw notFound();
  },
  component: ToolPage,
  head: ({ params }) => {
    const lang = (["en", "fr", "ar"].includes(params.lang) ? params.lang : "en") as Lang;
    const meta = dictionaries[lang].tools[params.slug as ToolSlug];

    const name = meta?.name ?? params.slug;
    const tagline = meta?.tagline ?? "";
    const title = `${name} — E-SeoMax`;
    const url = abs(`/${params.lang}/tools/${params.slug}`);
    return {
      meta: [
        { title },
        { name: "description", content: tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: tagline },
        { property: "og:url", content: url },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: ogLocale(lang) },
        { property: "og:image", content: `${SITE_ORIGIN}/og-default.png` },
        { name: "twitter:image", content: `${SITE_ORIGIN}/og-default.png` },
      ],
      links: [
        { rel: "canonical", href: url },
        ...hreflangLinks(`/tools/${params.slug}`),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name,
            description: tagline,
            applicationCategory: "SEOApplication",
            operatingSystem: "Any (web browser)",
            url,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => {
    const lang = (typeof window !== "undefined"
      ? (window.location.pathname.split("/")[1] as Lang)
      : "en");
    const l = (["en", "fr", "ar"].includes(lang) ? lang : "en") as Lang;
    const t = dictionaries[l].common;
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <div className="font-display text-5xl gradient-text">404</div>
        <p className="mt-3 text-mist">{t.unknownTool}</p>
      </div>
    );
  },
});


function ToolPage() {
  const { slug } = Route.useParams();
  const { t, lang } = useI18n();
  const Tool = COMPONENTS[slug as ToolSlug];
  const meta = t.tools[slug as ToolSlug];
  const related = TOOLS.filter((x) => x.slug !== slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <Link to={`/${lang}/tools`} className="text-xs uppercase tracking-widest text-amethyst-glow font-mono">
          ← {t.toolsHub.title}
        </Link>
        <h1 className="mt-3 font-display text-4xl md:text-5xl gradient-text">{meta.name}</h1>
        <p className="mt-3 text-mist max-w-2xl">{meta.tagline}</p>
        <div className="mt-3 inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-mist border border-border rounded-full px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success-mint" /> {t.toolsHub.badge}
        </div>
      </div>

      <Suspense fallback={<div className="crystal-card h-96 animate-pulse" />}>
        <Tool />
      </Suspense>

      <section className="mt-16">
        <div className="text-xs uppercase tracking-widest text-amethyst-glow font-mono mb-4">{t.ui.related}</div>
        <div className="grid gap-3 sm:grid-cols-3">
          {related.map(({ slug: s, icon: Icon }) => {
            const m = t.tools[s];
            return (
              <Link key={s} to={`/${lang}/tools/${s}`} className="crystal-card crystal-card-hover p-4 block">
                <div className="flex items-center gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "hsl(275 100% 78% / 0.12)", border: "1px solid hsl(275 100% 78% / 0.25)" }}>
                    <Icon className="h-4 w-4 text-amethyst-glow" />
                  </div>
                  <div>
                    <div className="font-display text-sm">{m.name}</div>
                    <div className="text-xs text-mist line-clamp-1">{m.tagline}</div>
                  </div>
                  <ArrowRight className="ms-auto h-4 w-4 text-mist" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
