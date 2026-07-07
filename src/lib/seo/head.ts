import type { Lang } from "@/i18n/dictionaries";

export const SITE_ORIGIN = "https://e-seomax.com";
export const SEO_LANGS: Lang[] = ["en", "fr", "ar"];

/**
 * Build hreflang alternate links for a given path (the part AFTER /$lang).
 * Pass "" for a lang root, "/blog", "/tools/serp-preview", etc.
 */
export function hreflangLinks(pathAfterLang: string) {
  const tail = pathAfterLang && !pathAfterLang.startsWith("/") ? `/${pathAfterLang}` : pathAfterLang;
  const links = SEO_LANGS.map((l) => ({
    rel: "alternate",
    hreflang: l,
    href: `${SITE_ORIGIN}/${l}${tail}`,
  }));
  links.push({
    rel: "alternate",
    hreflang: "x-default",
    href: `${SITE_ORIGIN}/en${tail}`,
  });
  return links;
}

export function ogLocale(lang: Lang): string {
  return lang === "fr" ? "fr_FR" : lang === "ar" ? "ar_AR" : "en_US";
}

export function pickLang<T>(lang: Lang, values: { en: T; fr: T; ar: T }): T {
  return lang === "fr" ? values.fr : lang === "ar" ? values.ar : values.en;
}

export function htmlDir(lang: Lang): "ltr" | "rtl" {
  return lang === "ar" ? "rtl" : "ltr";
}

export function isValidLang(v: string | undefined): v is Lang {
  return v === "en" || v === "fr" || v === "ar";
}
