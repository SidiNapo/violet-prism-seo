import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { TOOLS, type ToolSlug } from "@/lib/tools-catalog";
import { SerpPreviewTool } from "@/components/tools/SerpPreviewTool";
import { KeywordDensityTool } from "@/components/tools/KeywordDensityTool";
import { PageAuditorTool } from "@/components/tools/PageAuditorTool";
import { ReadabilityTool } from "@/components/tools/ReadabilityTool";
import { MetaGeneratorTool } from "@/components/tools/MetaGeneratorTool";
import { RobotsSitemapTool } from "@/components/tools/RobotsSitemapTool";
import { AnchorAuditTool } from "@/components/tools/AnchorAuditTool";
import { KeywordIdeasTool } from "@/components/tools/KeywordIdeasTool";
import { dictionaries, type Lang } from "@/i18n/dictionaries";
import { ArrowRight } from "lucide-react";

const COMPONENTS: Record<ToolSlug, React.FC> = {
  "serp-preview": SerpPreviewTool,
  "keyword-density": KeywordDensityTool,
  "page-auditor": PageAuditorTool,
  readability: ReadabilityTool,
  "meta-generator": MetaGeneratorTool,
  "robots-sitemap": RobotsSitemapTool,
  "anchor-audit": AnchorAuditTool,
  "keyword-ideas": KeywordIdeasTool,
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
    return {
      meta: [
        { title },
        { name: "description", content: tagline },
        { property: "og:title", content: title },
        { property: "og:description", content: tagline },
        { property: "og:url", content: `/${params.lang}/tools/${params.slug}` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `/${params.lang}/tools/${params.slug}` }],
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
            url: `https://e-seomax.com/${params.lang}/tools/${params.slug}`,
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <div className="font-display text-5xl gradient-text">404</div>
      <p className="mt-3 text-mist">Unknown tool.</p>
    </div>
  ),
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

      <Tool />

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
