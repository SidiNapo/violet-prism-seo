import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";

export const Route = createFileRoute("/$lang/pricing")({
  component: PricingPage,
  head: ({ params }) => ({
    meta: [{ title: "Pricing — E-SeoMax" }, { property: "og:url", content: `/${params.lang}/pricing` }],
    links: [{ rel: "canonical", href: `/${params.lang}/pricing` }],
  }),
});

function PricingPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl gradient-text">{t.nav.pricing}</h1>
      <p className="mt-4 text-mist">{t.home.whyUnlimited.body}</p>
    </div>
  );
}
