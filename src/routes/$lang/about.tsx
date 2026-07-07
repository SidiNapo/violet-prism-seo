import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";

export const Route = createFileRoute("/$lang/about")({
  component: AboutPage,
  head: ({ params }) => ({
    meta: [{ title: "About — E-SeoMax" }, { property: "og:url", content: `/${params.lang}/about` }],
    links: [{ rel: "canonical", href: `/${params.lang}/about` }],
  }),
});

function AboutPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="font-display text-5xl gradient-text">{t.nav.about}</h1>
      <p className="mt-6 text-mist text-lg">{t.footer.tagline}</p>
    </div>
  );
}
