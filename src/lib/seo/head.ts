import type { Lang } from "@/i18n/dictionaries";

export const SITE_ORIGIN = "https://e-seomax.com";
export const SEO_LANGS: Lang[] = ["en", "fr", "ar"];

/** Absolute URL for a site-relative path (or return as-is if already absolute). */
export function abs(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const p = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${SITE_ORIGIN}${p}`;
}

/**
 * Build hreflang alternate links for a given path (the part AFTER /$lang).
 * Use ONLY for routes whose paths match 1:1 across languages
 * (home, /about, /contact, /tools, /tools/$slug, /blog list).
 * For blog posts, build from real per-language sibling slugs — see hreflangFromSiblings.
 */
export function hreflangLinks(pathAfterLang: string) {
  const tail = pathAfterLang && !pathAfterLang.startsWith("/") ? `/${pathAfterLang}` : pathAfterLang;
  const links: { rel: string; hrefLang: string; href: string }[] = SEO_LANGS.map((l) => ({
    rel: "alternate",
    hrefLang: l,
    href: `${SITE_ORIGIN}/${l}${tail}`,
  }));
  links.push({
    rel: "alternate",
    hrefLang: "x-default",
    href: `${SITE_ORIGIN}/en${tail}`,
  });
  return links;
}

/**
 * Build hreflang links from a real set of translated siblings.
 * `siblings` is a list of { lang, slug } for published sibling posts (INCLUDING the current one).
 * Emits alternates only for languages that actually have a sibling; x-default → English sibling if present.
 */
export function hreflangFromSiblings(
  pathPrefix: "blog",
  siblings: { lang: string; slug: string }[],
) {
  const links: { rel: string; hrefLang: string; href: string }[] = [];
  for (const s of siblings) {
    links.push({
      rel: "alternate",
      hrefLang: s.lang,
      href: `${SITE_ORIGIN}/${s.lang}/${pathPrefix}/${s.slug}`,
    });
  }
  const en = siblings.find((s) => s.lang === "en");
  if (en) {
    links.push({
      rel: "alternate",
      hrefLang: "x-default",
      href: `${SITE_ORIGIN}/en/${pathPrefix}/${en.slug}`,
    });
  }
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
