export type Lang = "en" | "fr" | "ar";
export const LANGS: Lang[] = ["en", "fr", "ar"];
export const DEFAULT_LANG: Lang = "en";
export const isLang = (v: string): v is Lang => (LANGS as string[]).includes(v);

export type Dict = {
  nav: {
    tools: string;
    blog: string;
    about: string;
    contact: string;
    pricing: string;
    admin: string;
  };
  cta: {
    exploreTools: string;
    readBlog: string;
    tryNow: string;
    getStarted: string;
  };
  home: {
    heroTitle: string;
    heroSubline: string;
    arsenalEyebrow: string;
    arsenalTitle: string;
    arsenalSubtitle: string;
    whyEyebrow: string;
    whyTitle: string;
    whyPrivate: { title: string; body: string };
    whyInstant: { title: string; body: string };
    whyUnlimited: { title: string; body: string };
    latestPostsTitle: string;
    latestPostsEmpty: string;
    liveWidgetTitle: string;
    liveWidgetTitlePlaceholder: string;
    liveWidgetDescPlaceholder: string;
    liveWidgetScore: string;
  };
  tools: Record<
    | "serp-preview"
    | "keyword-density"
    | "page-auditor"
    | "readability"
    | "meta-generator"
    | "robots-sitemap"
    | "anchor-audit"
    | "keyword-ideas",
    { name: string; tagline: string }
  >;
  toolsHub: { title: string; subtitle: string; badge: string; comingSoon: string };
  footer: {
    tagline: string;
    product: string;
    company: string;
    resources: string;
    rights: string;
  };
  common: {
    language: string;
    loading: string;
    notFoundTitle: string;
    notFoundBody: string;
    goHome: string;
    comingSoon: string;
  };
};

const en: Dict = {
  nav: { tools: "Tools", blog: "Blog", about: "About", contact: "Contact", pricing: "Pricing", admin: "Admin" },
  cta: { exploreTools: "Explore the Tools", readBlog: "Read the Blog", tryNow: "Try it now", getStarted: "Get started" },
  home: {
    heroTitle: "Rank Beyond Limits.",
    heroSubline:
      "A prism of eight algorithmic SEO tools. No third-party APIs. No rate limits. Your data never leaves the browser.",
    arsenalEyebrow: "The Arsenal",
    arsenalTitle: "Eight instruments. One crystalline system.",
    arsenalSubtitle:
      "Each tool computes real results locally — no dashboards to log into, no quotas, no waiting.",
    whyEyebrow: "Why algorithms, not APIs",
    whyTitle: "Built on math, not middlemen.",
    whyPrivate: { title: "Private", body: "Your data never leaves the browser. Zero telemetry, zero storage." },
    whyInstant: { title: "Instant", body: "Every result is computed in milliseconds. No rate limits, ever." },
    whyUnlimited: { title: "Unlimited", body: "Use every tool as often as you want. Free, forever." },
    latestPostsTitle: "From the journal",
    latestPostsEmpty: "First article coming soon.",
    liveWidgetTitle: "Live SERP analyzer",
    liveWidgetTitlePlaceholder: "Your page title…",
    liveWidgetDescPlaceholder: "Your meta description…",
    liveWidgetScore: "SEO score",
  },
  tools: {
    "serp-preview": { name: "SERP Preview", tagline: "Pixel-accurate Google preview & scoring." },
    "keyword-density": { name: "Keyword Density", tagline: "TF, n-grams and prominence in three languages." },
    "page-auditor": { name: "On-Page Auditor", tagline: "30+ real factors from raw HTML." },
    readability: { name: "Readability", tagline: "Flesch, Kandel-Moles and Arabic heuristics." },
    "meta-generator": { name: "Meta & OG", tagline: "Copy-ready <head> with validated JSON-LD." },
    "robots-sitemap": { name: "Robots & Sitemap", tagline: "Visual builder with live linting." },
    "anchor-audit": { name: "Anchor Audit", tagline: "Classify backlinks and score risk." },
    "keyword-ideas": { name: "Keyword Ideas", tagline: "Expansions, intent and clustering." },
  },
  toolsHub: {
    title: "The Arsenal",
    subtitle: "Eight algorithmic tools. Runs locally. No APIs.",
    badge: "no API • runs locally",
    comingSoon: "Wiring up — available shortly.",
  },
  footer: {
    tagline: "Premium SEO intelligence. Powered by algorithms.",
    product: "Product",
    company: "Company",
    resources: "Resources",
    rights: "All rights reserved.",
  },
  common: {
    language: "Language",
    loading: "Loading…",
    notFoundTitle: "404 — Off the grid",
    notFoundBody: "The page you are looking for shattered into cubes.",
    goHome: "Go home",
    comingSoon: "Coming soon",
  },
};

const fr: Dict = {
  nav: { tools: "Outils", blog: "Blog", about: "À propos", contact: "Contact", pricing: "Tarifs", admin: "Admin" },
  cta: { exploreTools: "Découvrir les outils", readBlog: "Lire le blog", tryNow: "Essayer maintenant", getStarted: "Commencer" },
  home: {
    heroTitle: "Classez au-delà des limites.",
    heroSubline:
      "Un prisme de huit outils SEO algorithmiques. Sans API tierces. Sans limites. Vos données ne quittent jamais le navigateur.",
    arsenalEyebrow: "L'Arsenal",
    arsenalTitle: "Huit instruments. Un système cristallin.",
    arsenalSubtitle:
      "Chaque outil calcule des résultats réels localement — pas de tableau de bord, pas de quota, aucune attente.",
    whyEyebrow: "Pourquoi des algorithmes, pas des API",
    whyTitle: "Bâti sur les maths, pas des intermédiaires.",
    whyPrivate: { title: "Privé", body: "Vos données ne quittent jamais le navigateur. Zéro télémétrie, zéro stockage." },
    whyInstant: { title: "Instantané", body: "Chaque résultat est calculé en millisecondes. Aucune limite de débit." },
    whyUnlimited: { title: "Illimité", body: "Utilisez chaque outil autant que vous voulez. Gratuit, à vie." },
    latestPostsTitle: "Du journal",
    latestPostsEmpty: "Premier article bientôt.",
    liveWidgetTitle: "Analyseur SERP en direct",
    liveWidgetTitlePlaceholder: "Le titre de votre page…",
    liveWidgetDescPlaceholder: "Votre méta-description…",
    liveWidgetScore: "Score SEO",
  },
  tools: {
    "serp-preview": { name: "Aperçu SERP", tagline: "Aperçu Google au pixel près et notation." },
    "keyword-density": { name: "Densité de mots-clés", tagline: "TF, n-grams et proéminence trilingues." },
    "page-auditor": { name: "Audit On-Page", tagline: "30+ facteurs réels depuis le HTML brut." },
    readability: { name: "Lisibilité", tagline: "Flesch, Kandel-Moles et heuristiques arabes." },
    "meta-generator": { name: "Meta & OG", tagline: "<head> prêt à copier avec JSON-LD validé." },
    "robots-sitemap": { name: "Robots & Sitemap", tagline: "Constructeur visuel avec linting en direct." },
    "anchor-audit": { name: "Audit d'ancres", tagline: "Classez les backlinks et notez le risque." },
    "keyword-ideas": { name: "Idées de mots-clés", tagline: "Expansions, intention et clustering." },
  },
  toolsHub: {
    title: "L'Arsenal",
    subtitle: "Huit outils algorithmiques. Exécution locale. Sans API.",
    badge: "sans API • local",
    comingSoon: "En cours d'assemblage — disponible sous peu.",
  },
  footer: {
    tagline: "Intelligence SEO premium. Alimentée par des algorithmes.",
    product: "Produit",
    company: "Entreprise",
    resources: "Ressources",
    rights: "Tous droits réservés.",
  },
  common: {
    language: "Langue",
    loading: "Chargement…",
    notFoundTitle: "404 — Hors grille",
    notFoundBody: "La page recherchée s'est brisée en cubes.",
    goHome: "Retour à l'accueil",
    comingSoon: "Bientôt disponible",
  },
};

const ar: Dict = {
  nav: { tools: "الأدوات", blog: "المدوّنة", about: "حول", contact: "تواصل", pricing: "الأسعار", admin: "الإدارة" },
  cta: { exploreTools: "اكتشف الأدوات", readBlog: "اقرأ المدوّنة", tryNow: "جرّبها الآن", getStarted: "ابدأ الآن" },
  home: {
    heroTitle: "تصدّر بلا حدود.",
    heroSubline:
      "منشور بلّوري من ثماني أدوات SEO خوارزمية. بلا واجهات خارجية. بلا حدود. بياناتك لا تغادر متصفّحك أبداً.",
    arsenalEyebrow: "الترسانة",
    arsenalTitle: "ثمانية أدوات. منظومة بلّورية واحدة.",
    arsenalSubtitle:
      "كل أداة تحسب نتائج حقيقية محلياً — بلا لوحات تحكم، بلا حصص، بلا انتظار.",
    whyEyebrow: "لماذا خوارزميات، لا واجهات",
    whyTitle: "مبنيّة على الرياضيات، لا على وسطاء.",
    whyPrivate: { title: "خصوصية", body: "بياناتك لا تغادر المتصفّح. صفر تتبّع، صفر تخزين." },
    whyInstant: { title: "فوريّة", body: "كل نتيجة تُحسب بالمللي ثانية. بلا حدود إطلاقاً." },
    whyUnlimited: { title: "لا محدودة", body: "استخدم كل أداة قدر ما تشاء. مجاناً، للأبد." },
    latestPostsTitle: "من اليوميّات",
    latestPostsEmpty: "أول مقال قريباً.",
    liveWidgetTitle: "محلّل SERP الحيّ",
    liveWidgetTitlePlaceholder: "عنوان صفحتك…",
    liveWidgetDescPlaceholder: "وصف الميتا…",
    liveWidgetScore: "نتيجة SEO",
  },
  tools: {
    "serp-preview": { name: "معاينة SERP", tagline: "معاينة قوقل بدقة البكسل مع تقييم." },
    "keyword-density": { name: "كثافة الكلمات", tagline: "TF و n-grams وبروز ثلاثي اللغات." },
    "page-auditor": { name: "مدقّق الصفحة", tagline: "أكثر من 30 عاملاً حقيقياً من HTML." },
    readability: { name: "قابلية القراءة", tagline: "Flesch وKandel-Moles وقواعد عربية." },
    "meta-generator": { name: "ميتا و OG", tagline: "<head> جاهز للنسخ مع JSON-LD مصادَق." },
    "robots-sitemap": { name: "Robots و Sitemap", tagline: "منشئ مرئي مع فحص حيّ." },
    "anchor-audit": { name: "تدقيق الروابط", tagline: "صنّف الروابط الخلفيّة وقِس المخاطر." },
    "keyword-ideas": { name: "أفكار كلمات", tagline: "توسيعات ونيّة وتجميع." },
  },
  toolsHub: {
    title: "الترسانة",
    subtitle: "ثمانية أدوات خوارزميّة. تعمل محلياً. بلا واجهات.",
    badge: "بلا واجهة • تعمل محلياً",
    comingSoon: "قيد التجهيز — متوفّرة قريباً.",
  },
  footer: {
    tagline: "ذكاء SEO فاخر. مدعوم بالخوارزميات.",
    product: "المنتج",
    company: "الشركة",
    resources: "موارد",
    rights: "جميع الحقوق محفوظة.",
  },
  common: {
    language: "اللغة",
    loading: "جارٍ التحميل…",
    notFoundTitle: "404 — خارج الشبكة",
    notFoundBody: "الصفحة التي تبحث عنها تحطّمت إلى مكعّبات.",
    goHome: "العودة للرئيسية",
    comingSoon: "قريباً",
  },
};

export const dictionaries: Record<Lang, Dict> = { en, fr, ar };
