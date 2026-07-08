import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { MiniSerpAnalyzer } from "@/components/site/MiniSerpAnalyzer";
import { MagneticButton } from "@/components/site/MagneticButton";
import { TOOLS } from "@/lib/tools-catalog";
import { abs, hreflangLinks, ogLocale, SITE_ORIGIN } from "@/lib/seo/head";
import { dictionaries, type Lang } from "@/i18n/dictionaries";
import { supabase } from "@/integrations/supabase/client";
import { ArrowRight, ShieldCheck, Zap, Infinity as InfinityIcon } from "lucide-react";

type LatestPost = {
  id: string; slug: string; title: string; excerpt: string;
  cover_image_url: string | null; reading_minutes: number; published_at: string | null;
};

export const Route = createFileRoute("/$lang/")({
  component: Home,
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("posts")
      .select("id,slug,title,excerpt,cover_image_url,reading_minutes,published_at")
      .eq("lang", params.lang)
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(3);
    return { latest: (data as LatestPost[]) || [] };
  },
  head: ({ params }) => {
    const lang = (["en", "fr", "ar"].includes(params.lang) ? params.lang : "en") as Lang;
    const d = dictionaries[lang];
    const title = d.home.metaTitle;
    const description = d.home.metaDescription;
    const url = abs(`/${params.lang}`);
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:locale", content: ogLocale(lang) },
        { property: "og:image", content: `${SITE_ORIGIN}/og-default.png` },
        { name: "twitter:image", content: `${SITE_ORIGIN}/og-default.png` },
      ],
      links: [
        { rel: "canonical", href: url },
        ...hreflangLinks(""),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "E-SeoMax",
            url,
            inLanguage: lang,
            description,
          }),
        },
      ],
    };
  },
});



function Home() {
  const { t, lang } = useI18n();
  const { latest } = Route.useLoaderData() as { latest: LatestPost[] };

  return (
    <div className="relative">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-12 md:pt-20 pb-24 grid gap-10 md:gap-16 md:grid-cols-2 items-center">
          <div className="animate-fade-rise">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-void/50 px-3 py-1 text-[11px] font-mono uppercase tracking-widest text-amethyst-glow">
              <span className="h-1.5 w-1.5 rounded-full bg-amethyst-glow" /> Violet Prism · v0.1
            </span>
            <h1 className="mt-6 font-display text-5xl md:text-7xl leading-[1.02] text-balance">
              <span className="gradient-text">{t.home.heroTitle}</span>
            </h1>
            <p className="mt-6 max-w-xl text-mist text-lg text-balance">
              {t.home.heroSubline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <MagneticButton to={`/${lang}/tools`}>
                {t.cta.exploreTools} <ArrowRight className="h-4 w-4" />
              </MagneticButton>
              <MagneticButton to={`/${lang}/blog`} variant="ghost">
                {t.cta.readBlog}
              </MagneticButton>
            </div>
          </div>

          <div className="animate-fade-rise" style={{ animationDelay: "160ms" }}>
            <MiniSerpAnalyzer />
          </div>
        </div>
      </section>

      {/* ARSENAL */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-amethyst-glow font-mono">
              {t.home.arsenalEyebrow}
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl text-balance">
              {t.home.arsenalTitle}
            </h2>
            <p className="mt-4 text-mist text-balance">{t.home.arsenalSubtitle}</p>
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TOOLS.map(({ slug, icon: Icon }) => {
              const meta = t.tools[slug];
              return (
                <Link
                  key={slug}
                  to={`/${lang}/tools/${slug}`}
                  className="crystal-card crystal-card-hover p-5 group"
                >
                  <div
                    className="grid h-11 w-11 place-items-center rounded-xl mb-4"
                    style={{
                      background:
                        "linear-gradient(135deg, hsl(265 85% 58% / 0.25), hsl(275 100% 78% / 0.15))",
                      border: "1px solid hsl(275 100% 78% / 0.25)",
                    }}
                  >
                    <Icon className="h-5 w-5 text-amethyst-glow" />
                  </div>
                  <div className="font-display text-lg">{meta.name}</div>
                  <p className="mt-1 text-sm text-mist">{meta.tagline}</p>
                  <div className="mt-4 flex items-center text-xs font-mono uppercase tracking-widest text-mist group-hover:text-amethyst-glow transition">
                    {t.cta.tryNow} <ArrowRight className="ms-1 h-3.5 w-3.5" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="max-w-2xl">
            <div className="text-xs uppercase tracking-widest text-amethyst-glow font-mono">
              {t.home.whyEyebrow}
            </div>
            <h2 className="mt-3 font-display text-3xl md:text-5xl text-balance">
              {t.home.whyTitle}
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, k: "whyPrivate" as const },
              { icon: Zap, k: "whyInstant" as const },
              { icon: InfinityIcon, k: "whyUnlimited" as const },
            ].map(({ icon: Icon, k }, i) => (
              <div key={k} className="relative pl-5">
                <span
                  aria-hidden
                  className="absolute left-0 top-0 h-full w-px"
                  style={{
                    background:
                      "linear-gradient(180deg, transparent, hsl(275 100% 78% / 0.6), transparent)",
                  }}
                />
                <div
                  className="grid h-10 w-10 place-items-center rounded-lg mb-4"
                  style={{
                    background: "hsl(275 100% 78% / 0.1)",
                    border: "1px solid hsl(275 100% 78% / 0.2)",
                  }}
                >
                  <Icon className="h-5 w-5 text-amethyst-glow" />
                </div>
                <div className="font-display text-2xl">{t.home[k].title}</div>
                <p className="mt-2 text-mist">{t.home[k].body}</p>
                <div className="mt-3 font-mono text-[11px] text-mist opacity-60">0{i + 1}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST POSTS placeholder */}
      <section className="relative py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between mb-8">
            <h2 className="font-display text-3xl md:text-4xl">{t.home.latestPostsTitle}</h2>
            <Link to={`/${lang}/blog`} className="text-sm text-amethyst-glow hover:underline">
              {t.nav.blog} →
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="crystal-card p-6 min-h-52 flex items-end">
                <div className="text-sm text-mist">{t.home.latestPostsEmpty}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
