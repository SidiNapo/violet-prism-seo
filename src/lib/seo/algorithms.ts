/**
 * Pure algorithmic helpers shared by the E-SeoMax tool suite.
 * No external APIs, no network. All computed locally.
 */
import type { Lang } from "@/i18n/dictionaries";

// ============= STOP WORDS (trilingual) =============
export const STOP_WORDS: Record<Lang, Set<string>> = {
  en: new Set(
    "a an and are as at be but by for from has have he her his i in is it its of on or she that the their there they this to was we were will with you your".split(
      " ",
    ),
  ),
  fr: new Set(
    "le la les un une des de du et à en dans pour par avec sur sous ce cette ces son sa ses est sont était sera je tu il elle nous vous ils elles que qui quoi plus moins ou où mais donc car ne pas".split(
      " ",
    ),
  ),
  ar: new Set(
    "من إلى عن على في هذا هذه ذلك تلك و أو ثم إذ إذا كان كانت هو هي نحن أنتم هم لكن أن إن ما لا لم لن قد كل بعض هناك".split(
      " ",
    ),
  ),
};

const AR_TASHKEEL = /[\u064B-\u0652\u0670\u0640]/g;
const AR_ALEF = /[\u0622\u0623\u0625]/g;
const AR_HAMZA = /[\u0621\u0624\u0626]/g;

export function normalizeArabic(t: string): string {
  return t
    .replace(AR_TASHKEEL, "")
    .replace(AR_ALEF, "\u0627")
    .replace(AR_HAMZA, "\u0627")
    .replace(/\u0629/g, "\u0647"); // ة → ه
}

export function tokenize(text: string, lang: Lang, opts: { stripAccents?: boolean } = {}): string[] {
  let t = (text || "").toLowerCase();
  if (lang === "ar") t = normalizeArabic(t);
  if (lang === "fr" && opts.stripAccents) {
    t = t.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  // Unicode letter class
  return t.match(/[\p{L}\p{N}][\p{L}\p{N}'-]*/gu) || [];
}

// ============= N-GRAMS + DENSITY =============
export type NGramRow = { term: string; count: number; density: number };
export function ngrams(tokens: string[], n: number, ignore: Set<string>): NGramRow[] {
  const filtered = tokens.filter((t) => !ignore.has(t));
  const total = filtered.length || 1;
  const map = new Map<string, number>();
  if (n === 1) {
    for (const t of filtered) map.set(t, (map.get(t) || 0) + 1);
  } else {
    for (let i = 0; i <= filtered.length - n; i++) {
      const gram = filtered.slice(i, i + n).join(" ");
      map.set(gram, (map.get(gram) || 0) + 1);
    }
  }
  return Array.from(map, ([term, count]) => ({
    term,
    count,
    density: (count / total) * 100,
  })).sort((a, b) => b.count - a.count);
}

// ============= SYLLABLES + READABILITY =============
function syllablesEn(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, "");
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const cleaned = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "").replace(/^y/, "");
  const groups = cleaned.match(/[aeiouy]{1,2}/g);
  return Math.max(1, groups ? groups.length : 1);
}
function syllablesFr(word: string): number {
  const w = word.toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüÿœæ]/g, "");
  if (!w) return 0;
  const groups = w.match(/[aeiouyàâäéèêëîïôöùûüÿœæ]+/g);
  return Math.max(1, groups ? groups.length : 1);
}
function syllablesAr(word: string): number {
  // Rough heuristic: count vowel letters + short vowels (already stripped) — fallback to length/3
  const w = normalizeArabic(word);
  const vowels = w.match(/[\u0627\u0648\u064A]/g);
  return Math.max(1, vowels ? vowels.length : Math.ceil(w.length / 3));
}

export function countSyllables(word: string, lang: Lang): number {
  return lang === "fr" ? syllablesFr(word) : lang === "ar" ? syllablesAr(word) : syllablesEn(word);
}

export function splitSentences(text: string): string[] {
  return (text.match(/[^.!?؟\n]+[.!?؟]?/g) || []).map((s) => s.trim()).filter(Boolean);
}

export type Readability = {
  words: number;
  sentences: number;
  syllables: number;
  avgSentLen: number;
  avgSylPerWord: number;
  fleschEase: number;
  gradeLevel: number;
  passiveCount: number;
  sentenceLengths: number[];
  label: string;
};

const PASSIVE_EN = /\b(is|are|was|were|be|been|being)\s+\w+ed\b/gi;
const PASSIVE_FR = /\b(est|sont|était|étaient|sera|seront|a\s+été|ont\s+été)\s+\w+é(?:e|s|es)?\b/gi;

export function readability(text: string, lang: Lang): Readability {
  const sentences = splitSentences(text);
  const tokens = tokenize(text, lang);
  const words = tokens.length || 1;
  const syllables = tokens.reduce((s, w) => s + countSyllables(w, lang), 0);
  const avgSentLen = words / (sentences.length || 1);
  const avgSylPerWord = syllables / words;

  let ease: number;
  let grade: number;
  if (lang === "fr") {
    // Kandel-Moles (French Flesch adaptation)
    ease = 207 - 1.015 * avgSentLen - 73.6 * avgSylPerWord;
    grade = 0.4 * (avgSentLen + 100 * (avgSylPerWord - 1));
  } else if (lang === "ar") {
    // Heuristic: shorter sentences + fewer long words = easier
    const longWords = tokens.filter((w) => w.length > 6).length;
    ease = Math.max(0, Math.min(100, 100 - avgSentLen * 2 - (longWords / words) * 100));
    grade = Math.max(1, avgSentLen / 3 + (longWords / words) * 10);
  } else {
    ease = 206.835 - 1.015 * avgSentLen - 84.6 * avgSylPerWord;
    grade = 0.39 * avgSentLen + 11.8 * avgSylPerWord - 15.59;
  }

  const passiveCount =
    lang === "fr"
      ? (text.match(PASSIVE_FR) || []).length
      : lang === "en"
        ? (text.match(PASSIVE_EN) || []).length
        : 0;

  const label =
    ease >= 80 ? "Very easy" : ease >= 60 ? "Standard" : ease >= 40 ? "Difficult" : "Very difficult";

  return {
    words,
    sentences: sentences.length,
    syllables,
    avgSentLen: +avgSentLen.toFixed(1),
    avgSylPerWord: +avgSylPerWord.toFixed(2),
    fleschEase: +Math.max(0, Math.min(100, ease)).toFixed(1),
    gradeLevel: +Math.max(0, grade).toFixed(1),
    passiveCount,
    sentenceLengths: sentences.map((s) => tokenize(s, lang).length),
    label,
  };
}

// ============= HTML AUDIT =============
export type AuditIssue = {
  id: string;
  severity: "critical" | "warning" | "passed";
  label: string;
  detail?: string;
  fix?: string;
};

export function auditHtml(html: string): AuditIssue[] {
  const issues: AuditIssue[] = [];
  if (typeof DOMParser === "undefined") return issues;
  const doc = new DOMParser().parseFromString(html, "text/html");

  const add = (
    id: string,
    ok: boolean,
    label: string,
    detail?: string,
    fix?: string,
    severity: "critical" | "warning" = "critical",
  ) => {
    issues.push({ id, severity: ok ? "passed" : severity, label, detail: ok ? undefined : detail, fix: ok ? undefined : fix });
  };

  const title = doc.querySelector("title")?.textContent?.trim() || "";
  add("title", title.length > 0 && title.length <= 65, "Title present (≤65 chars)", `Length: ${title.length}`, `<title>Your keyword-rich title</title>`);

  const desc = doc.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() || "";
  add("desc", desc.length >= 70 && desc.length <= 160, "Meta description (70–160 chars)", `Length: ${desc.length}`, `<meta name="description" content="…">`);

  const h1s = doc.querySelectorAll("h1");
  add("h1-single", h1s.length === 1, "Exactly one <h1>", `Found ${h1s.length}`, `Ensure a single <h1> on the page.`);
  add("h1-content", (h1s[0]?.textContent?.trim().length || 0) > 5, "H1 non-empty", h1s[0]?.textContent || "", "Fill the H1 with the page topic.");

  // Heading hierarchy
  const headings = Array.from(doc.querySelectorAll("h1,h2,h3,h4,h5,h6"));
  let hierOk = true;
  let prev = 0;
  for (const h of headings) {
    const lvl = +h.tagName[1];
    if (prev && lvl > prev + 1) { hierOk = false; break; }
    prev = lvl;
  }
  add("hier", hierOk, "Heading hierarchy is sequential", "A heading level was skipped.", "Never jump from H2 to H4.", "warning");

  const imgs = Array.from(doc.querySelectorAll("img"));
  const missingAlt = imgs.filter((i) => !i.getAttribute("alt")?.trim()).length;
  const altRatio = imgs.length ? (imgs.length - missingAlt) / imgs.length : 1;
  add("alt", altRatio >= 0.9, `Alt text on ≥90% images`, `${missingAlt}/${imgs.length} missing`, `<img … alt="describe the image">`, "warning");

  const links = Array.from(doc.querySelectorAll("a[href]"));
  const externals = links.filter((a) => /^https?:\/\//.test(a.getAttribute("href") || "") && !a.getAttribute("href")!.includes(location?.hostname || "###")).length;
  add("links", links.length >= 3, "At least 3 links", `${links.length} link(s)`, "Add contextual internal or external links.", "warning");
  add("links-ratio", externals <= links.length * 0.5, "External links ≤50%", `${externals} external / ${links.length}`, "Balance internal vs external.", "warning");

  const canonical = doc.querySelector('link[rel="canonical"]');
  add("canonical", !!canonical, "Canonical URL", "Missing <link rel=canonical>", `<link rel="canonical" href="https://…">`);

  const og = ["og:title", "og:description", "og:type", "og:image", "og:url"].filter((p) => doc.querySelector(`meta[property="${p}"]`));
  add("og", og.length >= 4, "Open Graph tags", `Found ${og.length}/5`, `<meta property="og:title" content="…">`, "warning");

  const tw = doc.querySelector('meta[name="twitter:card"]');
  add("tw", !!tw, "Twitter Card", "Missing twitter:card", `<meta name="twitter:card" content="summary_large_image">`, "warning");

  const viewport = doc.querySelector('meta[name="viewport"]');
  add("viewport", !!viewport, "Mobile viewport", "Missing viewport meta", `<meta name="viewport" content="width=device-width,initial-scale=1">`);

  const lang = doc.documentElement.getAttribute("lang");
  add("lang", !!lang, "html lang attribute", "Missing", `<html lang="en">`);

  const hreflangs = doc.querySelectorAll('link[rel="alternate"][hreflang]');
  add("hreflang", hreflangs.length >= 1, "hreflang alternates", `Found ${hreflangs.length}`, `<link rel="alternate" hreflang="fr" href="…">`, "warning");

  const jsonld = Array.from(doc.querySelectorAll('script[type="application/ld+json"]'));
  let jsonldOk = jsonld.length > 0;
  for (const s of jsonld) {
    try { JSON.parse(s.textContent || "{}"); } catch { jsonldOk = false; }
  }
  add("jsonld", jsonldOk, "Valid JSON-LD present", `Found ${jsonld.length}`, `<script type="application/ld+json">{…}</script>`, "warning");

  const bodyText = doc.body?.textContent?.replace(/\s+/g, " ").trim() || "";
  const wc = bodyText.split(" ").filter(Boolean).length;
  add("wc", wc >= 300, "Word count ≥300", `${wc} words`, "Expand the content — thin pages struggle to rank.", "warning");

  const htmlLen = html.length || 1;
  const textRatio = bodyText.length / htmlLen;
  add("ratio", textRatio >= 0.1, "Text-to-HTML ratio ≥10%", `${(textRatio * 100).toFixed(1)}%`, "Reduce markup bloat.", "warning");

  const inlineStyles = doc.querySelectorAll("[style]").length;
  add("inline-style", inlineStyles < 20, "Few inline styles (<20)", `${inlineStyles} elements`, "Move styles to a stylesheet.", "warning");

  const favicon = doc.querySelector('link[rel~="icon"]');
  add("favicon", !!favicon, "Favicon linked", "Missing favicon link", `<link rel="icon" href="/favicon.ico">`, "warning");

  const strongCount = doc.querySelectorAll("strong,b").length;
  add("emphasis", strongCount > 0 && strongCount < 30, "Semantic emphasis in moderation", `${strongCount} elements`, "Use <strong> sparingly.", "warning");

  const scriptCount = doc.querySelectorAll("script").length;
  add("scripts", scriptCount < 25, "Reasonable script count (<25)", `${scriptCount} scripts`, "Bundle or lazy-load scripts.", "warning");

  const deprecated = doc.querySelectorAll("center,font,marquee,blink").length;
  add("deprecated", deprecated === 0, "No deprecated HTML tags", `${deprecated} found`, "Remove <center>, <font>, etc.");

  const titleWords = tokenize(title, "en");
  const bodyWords = tokenize(bodyText, "en");
  const overlap = titleWords.filter((w) => bodyWords.includes(w)).length;
  add("kw-body", titleWords.length ? overlap / titleWords.length >= 0.5 : true, "Title keywords appear in body", `${overlap}/${titleWords.length}`, "Reinforce your title keywords in the body copy.", "warning");

  const uniqueLinks = new Set(links.map((a) => a.getAttribute("href"))).size;
  add("dup-links", uniqueLinks === links.length, "No duplicate link targets", `${links.length - uniqueLinks} duplicates`, "Deduplicate identical hrefs.", "warning");

  return issues;
}

// ============= ANCHOR CLASSIFIER =============
export type AnchorClass = "exact" | "partial" | "branded" | "naked" | "generic";
const GENERIC_ANCHORS: Record<Lang, string[]> = {
  en: ["click here", "read more", "learn more", "here", "this", "link", "website", "more"],
  fr: ["cliquez ici", "en savoir plus", "lire la suite", "ici", "ce lien", "lien", "site web", "plus"],
  ar: ["اضغط هنا", "اقرأ المزيد", "المزيد", "هنا", "الرابط", "الموقع", "التفاصيل"],
};
export function classifyAnchor(anchor: string, brand: string, keyword: string, lang: Lang): AnchorClass {
  const a = anchor.trim().toLowerCase();
  if (!a) return "generic";
  if (/^https?:\/\//i.test(a) || /^www\./i.test(a)) return "naked";
  const generics = GENERIC_ANCHORS[lang];
  if (generics.some((g) => a === g.toLowerCase())) return "generic";
  const b = brand.trim().toLowerCase();
  if (b && a.includes(b)) return "branded";
  const kw = keyword.trim().toLowerCase();
  if (kw) {
    if (a === kw) return "exact";
    if (kw.split(/\s+/).some((k) => k && a.includes(k))) return "partial";
  }
  return "generic";
}
// Healthy distribution benchmarks (Ahrefs-style)
export const ANCHOR_BENCHMARK: Record<AnchorClass, number> = {
  branded: 45,
  naked: 20,
  generic: 15,
  partial: 15,
  exact: 5,
};

// ============= KEYWORD IDEAS =============
export const QUESTION_STARTERS: Record<Lang, string[]> = {
  en: ["how", "what", "why", "when", "where", "who", "which", "is", "are", "can", "should", "does"],
  fr: ["comment", "quoi", "pourquoi", "quand", "où", "qui", "quel", "quelle", "est-ce que", "peut-on", "doit-on"],
  ar: ["كيف", "ما", "لماذا", "متى", "أين", "من", "أي", "هل", "أفضل", "طريقة"],
};
export const MODIFIERS: Record<Lang, string[]> = {
  en: ["best", "top", "cheap", "free", "guide", "tutorial", "review", "vs", "tips", "for beginners", "2026", "online", "near me"],
  fr: ["meilleur", "top", "pas cher", "gratuit", "guide", "tutoriel", "avis", "vs", "astuces", "débutant", "2026", "en ligne"],
  ar: ["أفضل", "الأعلى", "رخيص", "مجاني", "دليل", "شرح", "مراجعة", "مقابل", "نصائح", "للمبتدئين", "2026", "أونلاين"],
};

export type Intent = "informational" | "navigational" | "commercial" | "transactional";
export function classifyIntent(kw: string, lang: Lang): Intent {
  const k = kw.toLowerCase();
  const info = QUESTION_STARTERS[lang].concat(["guide", "tutorial", "دليل", "شرح", "comment"]);
  const nav = ["login", "site", "app", "download", "connexion", "تسجيل", "تحميل"];
  const commercial = ["best", "top", "review", "vs", "avis", "مراجعة", "أفضل"];
  const transactional = ["buy", "price", "cheap", "coupon", "acheter", "prix", "شراء", "سعر"];
  if (transactional.some((w) => k.includes(w))) return "transactional";
  if (commercial.some((w) => k.includes(w))) return "commercial";
  if (nav.some((w) => k.includes(w))) return "navigational";
  if (info.some((w) => k.startsWith(w + " ") || k === w)) return "informational";
  return "informational";
}

export function generateIdeas(seed: string, lang: Lang): string[] {
  const s = seed.trim();
  if (!s) return [];
  const set = new Set<string>();
  QUESTION_STARTERS[lang].forEach((q) => set.add(`${q} ${s}`.trim()));
  MODIFIERS[lang].forEach((m) => {
    set.add(`${m} ${s}`.trim());
    set.add(`${s} ${m}`.trim());
  });
  // alphabet soup
  const alpha = lang === "ar" ? "ابتثجحخدذرزسشصضطظعغفقكلمنهوي" : "abcdefghijklmnopqrstuvwxyz";
  for (const c of alpha) set.add(`${s} ${c}`);
  return Array.from(set);
}

// Simple Jaccard clustering
export function clusterKeywords(kws: string[], threshold = 0.34): { name: string; items: string[] }[] {
  const tokens = kws.map((k) => new Set(k.split(/\s+/)));
  const clusters: { name: string; items: string[]; sets: Set<string>[] }[] = [];
  kws.forEach((k, i) => {
    const t = tokens[i];
    let placed = false;
    for (const c of clusters) {
      const sim = c.sets.reduce((m, cs) => Math.max(m, jaccard(t, cs)), 0);
      if (sim >= threshold) {
        c.items.push(k);
        c.sets.push(t);
        placed = true;
        break;
      }
    }
    if (!placed) clusters.push({ name: k, items: [k], sets: [t] });
  });
  return clusters.map((c) => ({ name: c.name, items: c.items }));
}
function jaccard(a: Set<string>, b: Set<string>): number {
  let inter = 0;
  a.forEach((x) => b.has(x) && inter++);
  return inter / (a.size + b.size - inter || 1);
}
