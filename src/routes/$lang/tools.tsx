import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { TOOLS } from "@/lib/tools-catalog";

export const Route = createFileRoute("/$lang/tools")({
  component: ToolsHub,
  head: ({ params }) => ({
    meta: [
      { title: `Tools — E-SeoMax` },
      { property: "og:url", content: `/${params.lang}/tools` },
    ],
    links: [{ rel: "canonical", href: `/${params.lang}/tools` }],
  }),
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
