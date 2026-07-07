import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { hreflangLinks, ogLocale, pickLang } from "@/lib/seo/head";
import type { Lang } from "@/i18n/dictionaries";

export const Route = createFileRoute("/$lang/about")({
  component: AboutPage,
  head: ({ params }) => {
    const lang = params.lang as Lang;
    const title = pickLang(lang, {
      en: "About E-SeoMax — Privacy-first algorithmic SEO",
      fr: "À propos d'E-SeoMax — SEO algorithmique respectueux de la vie privée",
      ar: "حول E-SeoMax — SEO خوارزمي يحترم الخصوصية",
    });
    const description = pickLang(lang, {
      en: "E-SeoMax is a boutique, trilingual SEO intelligence platform. Eight algorithmic tools that run in your browser — no APIs, no quotas, no data leaving your machine.",
      fr: "E-SeoMax est une plateforme SEO trilingue et pointue. Huit outils algorithmiques qui s'exécutent dans votre navigateur — sans API, sans quotas, sans données sortant de votre machine.",
      ar: "E-SeoMax منصّة ذكاء SEO ثلاثية اللغات. ثمانية أدوات خوارزمية تعمل داخل متصفحك — بدون واجهات، بدون حصص، بدون خروج بياناتك من جهازك.",
    });
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: `/${params.lang}/about` },
        { property: "og:type", content: "website" },
        { property: "og:locale", content: ogLocale(lang) },
      ],
      links: [
        { rel: "canonical", href: `/${params.lang}/about` },
        ...hreflangLinks("/about"),
      ],
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
