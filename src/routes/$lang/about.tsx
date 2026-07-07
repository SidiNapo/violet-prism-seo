import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";

export const Route = createFileRoute("/$lang/about")({
  component: AboutPage,
  head: ({ params }) => {
    const title = "About E-SeoMax — Privacy-first algorithmic SEO";
    const description =
      "E-SeoMax is a boutique, trilingual SEO intelligence platform. Eight algorithmic tools that run in your browser — no APIs, no quotas, no data leaving your machine.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/${params.lang}/about` },
        { property: "og:type", content: "website" },
      ],
      links: [{ rel: "canonical", href: `/${params.lang}/about` }],
    };
  },
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
