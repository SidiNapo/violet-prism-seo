/**
 * Live SERP scoring algorithm — shared between the home widget and the
 * future full serp-preview tool. Pure functions, no side effects.
 */

import type { Lang } from "@/i18n/dictionaries";

const POWER_WORDS: Record<Lang, string[]> = {
  en: ["best", "guide", "free", "proven", "ultimate", "new", "how", "why", "top", "essential", "secret", "fast"],
  fr: ["meilleur", "guide", "gratuit", "prouvé", "ultime", "nouveau", "comment", "pourquoi", "top", "essentiel", "secret", "rapide"],
  ar: ["أفضل", "دليل", "مجاني", "مثبت", "الأمثل", "جديد", "كيف", "لماذا", "الأعلى", "أساسي", "سرّي", "سريع"],
};

/** Measure text pixel width via canvas (client-only). */
export function measureTextPx(text: string, font: string): number {
  if (typeof document === "undefined") return text.length * 7;
  const canvas =
    (measureTextPx as unknown as { _c?: HTMLCanvasElement })._c ||
    ((measureTextPx as unknown as { _c?: HTMLCanvasElement })._c = document.createElement("canvas"));
  const ctx = canvas.getContext("2d");
  if (!ctx) return text.length * 7;
  ctx.font = font;
  return Math.round(ctx.measureText(text).width);
}

export const TITLE_MAX_PX = 580;
export const DESC_MAX_PX = 990;
export const TITLE_FONT = "20px Arial, sans-serif";
export const DESC_FONT = "14px Arial, sans-serif";

export type SerpInput = { title: string; description: string; keyword?: string; lang: Lang };

export type SerpScore = {
  score: number; // 0-100
  titlePx: number;
  descPx: number;
  breakdown: { label: string; value: number; max: number; ok: boolean }[];
};

export function scoreSerp({ title, description, keyword, lang }: SerpInput): SerpScore {
  const titlePx = measureTextPx(title, TITLE_FONT);
  const descPx = measureTextPx(description, DESC_FONT);

  const powers = POWER_WORDS[lang];
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  const kw = (keyword || "").trim().toLowerCase();

  // Title length band (peaks near 480-560px)
  const titleLen =
    titlePx === 0
      ? 0
      : titlePx < 200
        ? Math.round((titlePx / 200) * 12)
        : titlePx <= TITLE_MAX_PX
          ? 20
          : Math.max(0, 20 - Math.round((titlePx - TITLE_MAX_PX) / 20));

  const descLen =
    descPx === 0
      ? 0
      : descPx < 300
        ? Math.round((descPx / 300) * 15)
        : descPx <= DESC_MAX_PX
          ? 20
          : Math.max(0, 20 - Math.round((descPx - DESC_MAX_PX) / 25));

  const kwTitle = kw && t.includes(kw) ? 15 : kw ? 0 : 10;
  const kwDesc = kw && d.includes(kw) ? 10 : kw ? 0 : 8;

  const powerHits = powers.filter((w) => t.includes(w.toLowerCase())).length;
  const powerScore = Math.min(15, powerHits * 5);

  const numberBonus = /\d/.test(title) ? 10 : 0;

  const emotional = /[!?]|:/g.test(title) ? 5 : 0;
  const notEmpty = title.length > 0 && description.length > 0 ? 5 : 0;

  const raw = titleLen + descLen + kwTitle + kwDesc + powerScore + numberBonus + emotional + notEmpty;
  const score = Math.max(0, Math.min(100, raw));

  return {
    score,
    titlePx,
    descPx,
    breakdown: [
      { label: "Title width", value: titleLen, max: 20, ok: titlePx > 0 && titlePx <= TITLE_MAX_PX },
      { label: "Description width", value: descLen, max: 20, ok: descPx > 0 && descPx <= DESC_MAX_PX },
      { label: "Keyword in title", value: kwTitle, max: 15, ok: !kw || t.includes(kw) },
      { label: "Keyword in description", value: kwDesc, max: 10, ok: !kw || d.includes(kw) },
      { label: "Power words", value: powerScore, max: 15, ok: powerHits > 0 },
      { label: "Numbers in title", value: numberBonus, max: 10, ok: numberBonus > 0 },
      { label: "Emotional punctuation", value: emotional, max: 5, ok: emotional > 0 },
    ],
  };
}
