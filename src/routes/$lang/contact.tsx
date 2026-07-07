import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { hreflangLinks, ogLocale, pickLang } from "@/lib/seo/head";
import type { Lang } from "@/i18n/dictionaries";

export const Route = createFileRoute("/$lang/contact")({
  component: ContactPage,
  head: ({ params }) => {
    const lang = params.lang as Lang;
    const title = pickLang(lang, {
      en: "Contact E-SeoMax — Get in touch",
      fr: "Contact E-SeoMax — Écrivez-nous",
      ar: "تواصل مع E-SeoMax",
    });
    const description = pickLang(lang, {
      en: "Questions, partnerships, or feedback on the E-SeoMax algorithmic SEO suite? Reach the team directly at hello@eseomax.app.",
      fr: "Questions, partenariats ou retours sur la suite SEO algorithmique E-SeoMax ? Contactez l'équipe à hello@eseomax.app.",
      ar: "أسئلة، شراكات، أو ملاحظات حول مجموعة E-SeoMax الخوارزمية للـ SEO؟ تواصل مع الفريق عبر hello@eseomax.app.",
    });
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/${params.lang}/contact` },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: ogLocale(lang) },
      ],
      links: [
        { rel: "canonical", href: `/${params.lang}/contact` },
        ...hreflangLinks("/contact"),
      ],
    };
  },
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
