import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";

export const Route = createFileRoute("/$lang/contact")({
  component: ContactPage,
  head: ({ params }) => ({
    meta: [{ title: "Contact — E-SeoMax" }, { property: "og:url", content: `/${params.lang}/contact` }],
    links: [{ rel: "canonical", href: `/${params.lang}/contact` }],
  }),
});

function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-24">
      <h1 className="font-display text-5xl gradient-text">{t.nav.contact}</h1>
      <p className="mt-6 text-mist">hello@eseomax.app</p>
    </div>
  );
}
