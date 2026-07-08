export type Lang = "en" | "fr" | "ar";
export const LANGS: Lang[] = ["en", "fr", "ar"];
export const DEFAULT_LANG: Lang = "en";
export const isLang = (v: string): v is Lang => (LANGS as string[]).includes(v);

export type Dict = {
  nav: { tools: string; blog: string; about: string; contact: string; admin: string };
  cta: { exploreTools: string; readBlog: string; tryNow: string; getStarted: string };
  home: {
    heroTitle: string; heroSubline: string;
    arsenalEyebrow: string; arsenalTitle: string; arsenalSubtitle: string;
    whyEyebrow: string; whyTitle: string;
    whyPrivate: { title: string; body: string };
    whyInstant: { title: string; body: string };
    whyUnlimited: { title: string; body: string };
    latestPostsTitle: string; latestPostsEmpty: string;
    liveWidgetTitle: string; liveWidgetTitlePlaceholder: string; liveWidgetDescPlaceholder: string; liveWidgetScore: string;
  };
  tools: Record<
    | "serp-preview" | "keyword-density" | "page-auditor" | "readability"
    | "meta-generator" | "robots-sitemap" | "anchor-audit" | "keyword-ideas",
    { name: string; tagline: string }
  >;
  toolsHub: {
    title: string; subtitle: string; badge: string; comingSoon: string;
    searchPlaceholder: string; all: string;
    category: { "on-page": string; content: string; technical: string; "off-page": string };
  };
  ui: {
    input: string; results: string; howItWorks: string; copy: string; copied: string;
    clear: string; analyze: string; related: string; score: string; example: string;
    serp: { titleLabel: string; descLabel: string; keywordLabel: string; desktop: string; mobile: string; over: string; under: string; ok: string };
    density: { textLabel: string; unigrams: string; bigrams: string; trigrams: string; word: string; count: string; freq: string; totalWords: string; unique: string; over: string; stopWords: string };
    audit: { htmlLabel: string; critical: string; warning: string; passed: string; fix: string; runAudit: string; pasteHtml: string };
    readability: { textLabel: string; grade: string; ease: string; sentences: string; words: string; syllables: string; avgSentLen: string; passive: string };
    meta: { titleField: string; descField: string; urlField: string; imageField: string; typeField: string; siteName: string; author: string; snippet: string; jsonldValid: string; jsonldInvalid: string };
    robots: { addRule: string; agent: string; path: string; allow: string; disallow: string; sitemap: string; addUrl: string; urls: string; generate: string; lint: string };
    anchor: { pasteAnchors: string; hint: string; distribution: string; risk: string; recommendation: string; exact: string; partial: string; branded: string; naked: string; generic: string };
    ideas: { seedLabel: string; generate: string; intent: string; questions: string; modifiers: string; clusters: string; export: string; informational: string; navigational: string; commercial: string; transactional: string };
  };
  blog: {
    title: string; subtitle: string; readMore: string; readingTime: string; publishedOn: string;
    toc: string; share: string; related: string; empty: string; back: string; by: string;
    featured: string; shareCopy: string; shareCopied: string; breadcrumbHome: string;
  };
  admin: {
    title: string; signIn: string; signOut: string; email: string; password: string;
    overview: string; posts: string; newPost: string; totalPosts: string; published: string;
    drafts: string; views: string; slug: string; lang: string; excerpt: string; content: string;
    cover: string; metaTitle: string; metaDescription: string; keywords: string; status: string;
    save: string; publish: string; unpublish: string; delete: string; confirmDelete: string;
    edit: string; noPosts: string; loginFailed: string; forbidden: string;
  };
  footer: { tagline: string; product: string; company: string; resources: string; rights: string };
  common: { language: string; loading: string; notFoundTitle: string; notFoundBody: string; goHome: string; comingSoon: string };
};

const en: Dict = {
  nav: { tools: "Tools", blog: "Blog", about: "About", contact: "Contact", admin: "Admin" },
  cta: { exploreTools: "Explore the Tools", readBlog: "Read the Blog", tryNow: "Try it now", getStarted: "Get started" },
  home: {
    heroTitle: "Rank Beyond Limits.",
    heroSubline: "A prism of eight algorithmic SEO tools. No third-party APIs. No rate limits. Your data never leaves the browser.",
    arsenalEyebrow: "The Arsenal", arsenalTitle: "Eight instruments. One crystalline system.",
    arsenalSubtitle: "Each tool computes real results locally — no dashboards, no quotas, no waiting.",
    whyEyebrow: "Why algorithms, not APIs", whyTitle: "Built on math, not middlemen.",
    whyPrivate: { title: "Private", body: "Your data never leaves the browser. Zero telemetry." },
    whyInstant: { title: "Instant", body: "Every result is computed in milliseconds." },
    whyUnlimited: { title: "Unlimited", body: "Use every tool as often as you want. Free, forever." },
    latestPostsTitle: "From the journal", latestPostsEmpty: "First article coming soon.",
    liveWidgetTitle: "Live SERP analyzer", liveWidgetTitlePlaceholder: "Your page title…",
    liveWidgetDescPlaceholder: "Your meta description…", liveWidgetScore: "SEO score",
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
    title: "The Arsenal", subtitle: "Eight algorithmic tools. Runs locally. No APIs.",
    badge: "no API • runs locally", comingSoon: "Wiring up — available shortly.",
    searchPlaceholder: "Search tools…", all: "All",
    category: { "on-page": "On-page", content: "Content", technical: "Technical", "off-page": "Off-page" },
  },
  ui: {
    input: "Input", results: "Results", howItWorks: "How it works", copy: "Copy", copied: "Copied",
    clear: "Clear", analyze: "Analyze", related: "Related tools", score: "Score", example: "Load example",
    serp: { titleLabel: "Page title", descLabel: "Meta description", keywordLabel: "Focus keyword (optional)", desktop: "Desktop", mobile: "Mobile", over: "over limit", under: "under limit", ok: "within range" },
    density: { textLabel: "Paste your content", unigrams: "Unigrams", bigrams: "Bigrams", trigrams: "Trigrams", word: "Word", count: "Count", freq: "Density", totalWords: "Total words", unique: "Unique", over: "Over-optimization", stopWords: "Ignore stop words" },
    audit: { htmlLabel: "Paste full HTML", critical: "Critical", warning: "Warnings", passed: "Passed", fix: "Fix", runAudit: "Run audit", pasteHtml: "Paste HTML including <html>…</html>" },
    readability: { textLabel: "Paste your text", grade: "Grade level", ease: "Reading ease", sentences: "Sentences", words: "Words", syllables: "Syllables", avgSentLen: "Avg. sentence length", passive: "Passive constructions" },
    meta: { titleField: "Title", descField: "Description", urlField: "Canonical URL", imageField: "OG image URL", typeField: "Schema type", siteName: "Site name", author: "Author", snippet: "Copy-ready <head>", jsonldValid: "JSON-LD valid", jsonldInvalid: "JSON-LD invalid" },
    robots: { addRule: "Add rule", agent: "User-agent", path: "Path", allow: "Allow", disallow: "Disallow", sitemap: "Sitemap URL", addUrl: "Add URL", urls: "URLs", generate: "Generate", lint: "Warnings" },
    anchor: { pasteAnchors: "Paste anchor texts (one per line)", hint: "Optional brand name for classification", distribution: "Distribution", risk: "Risk score", recommendation: "Recommendation", exact: "Exact match", partial: "Partial match", branded: "Branded", naked: "Naked URL", generic: "Generic" },
    ideas: { seedLabel: "Seed keyword", generate: "Generate ideas", intent: "Intent", questions: "Questions", modifiers: "Modifiers", clusters: "Clusters", export: "Export CSV", informational: "Informational", navigational: "Navigational", commercial: "Commercial", transactional: "Transactional" },
  },
  blog: {
    title: "Journal", subtitle: "Long-form thinking on algorithmic SEO.",
    readMore: "Read more", readingTime: "min read", publishedOn: "Published on",
    toc: "Table of contents", share: "Share", related: "Related", empty: "First article coming soon.", back: "Back to journal", by: "by",
  },
  admin: {
    title: "Admin", signIn: "Sign in", signOut: "Sign out", email: "Email", password: "Password",
    overview: "Overview", posts: "Posts", newPost: "New post", totalPosts: "Total posts", published: "Published",
    drafts: "Drafts", views: "Views", slug: "Slug", lang: "Language", excerpt: "Excerpt", content: "Content (Markdown)",
    cover: "Cover image URL", metaTitle: "Meta title", metaDescription: "Meta description", keywords: "Keywords (comma-separated)",
    status: "Status", save: "Save", publish: "Publish", unpublish: "Unpublish", delete: "Delete",
    confirmDelete: "Delete this post permanently?", edit: "Edit", noPosts: "No posts yet — create your first.",
    loginFailed: "Login failed. Check credentials.", forbidden: "You are not an administrator.",
  },
  footer: { tagline: "Premium SEO intelligence. Powered by algorithms.", product: "Product", company: "Company", resources: "Resources", rights: "All rights reserved." },
  common: { language: "Language", loading: "Loading…", notFoundTitle: "404 — Off the grid", notFoundBody: "The page you are looking for shattered into cubes.", goHome: "Go home", comingSoon: "Coming soon" },
};

const fr: Dict = {
  nav: { tools: "Outils", blog: "Blog", about: "À propos", contact: "Contact", admin: "Admin" },
  cta: { exploreTools: "Découvrir les outils", readBlog: "Lire le blog", tryNow: "Essayer", getStarted: "Commencer" },
  home: {
    heroTitle: "Classez au-delà des limites.",
    heroSubline: "Un prisme de huit outils SEO algorithmiques. Sans API tierces. Sans limites. Vos données ne quittent jamais le navigateur.",
    arsenalEyebrow: "L'Arsenal", arsenalTitle: "Huit instruments. Un système cristallin.",
    arsenalSubtitle: "Chaque outil calcule des résultats réels localement — pas de tableau de bord, pas de quota.",
    whyEyebrow: "Pourquoi des algorithmes", whyTitle: "Bâti sur les maths, pas sur des intermédiaires.",
    whyPrivate: { title: "Privé", body: "Vos données ne quittent jamais le navigateur." },
    whyInstant: { title: "Instantané", body: "Chaque résultat est calculé en millisecondes." },
    whyUnlimited: { title: "Illimité", body: "Utilisez chaque outil autant que vous voulez, gratuitement." },
    latestPostsTitle: "Du journal", latestPostsEmpty: "Premier article bientôt.",
    liveWidgetTitle: "Analyseur SERP en direct", liveWidgetTitlePlaceholder: "Le titre de votre page…",
    liveWidgetDescPlaceholder: "Votre méta-description…", liveWidgetScore: "Score SEO",
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
    title: "L'Arsenal", subtitle: "Huit outils algorithmiques. Exécution locale.",
    badge: "sans API • local", comingSoon: "Bientôt disponible.",
    searchPlaceholder: "Rechercher un outil…", all: "Tous",
    category: { "on-page": "On-page", content: "Contenu", technical: "Technique", "off-page": "Off-page" },
  },
  ui: {
    input: "Entrée", results: "Résultats", howItWorks: "Comment ça marche", copy: "Copier", copied: "Copié",
    clear: "Effacer", analyze: "Analyser", related: "Outils liés", score: "Score", example: "Exemple",
    serp: { titleLabel: "Titre de la page", descLabel: "Méta-description", keywordLabel: "Mot-clé (optionnel)", desktop: "Bureau", mobile: "Mobile", over: "trop long", under: "trop court", ok: "dans la plage" },
    density: { textLabel: "Collez votre contenu", unigrams: "Unigrammes", bigrams: "Bigrammes", trigrams: "Trigrammes", word: "Mot", count: "Occurrences", freq: "Densité", totalWords: "Total de mots", unique: "Uniques", over: "Sur-optimisation", stopWords: "Ignorer les mots vides" },
    audit: { htmlLabel: "Collez le HTML complet", critical: "Critique", warning: "Avertissements", passed: "Validés", fix: "Correction", runAudit: "Lancer l'audit", pasteHtml: "Collez le HTML incluant <html>…</html>" },
    readability: { textLabel: "Collez votre texte", grade: "Niveau scolaire", ease: "Facilité de lecture", sentences: "Phrases", words: "Mots", syllables: "Syllabes", avgSentLen: "Longueur moyenne", passive: "Voix passive" },
    meta: { titleField: "Titre", descField: "Description", urlField: "URL canonique", imageField: "Image OG", typeField: "Type Schema", siteName: "Nom du site", author: "Auteur", snippet: "<head> prêt à copier", jsonldValid: "JSON-LD valide", jsonldInvalid: "JSON-LD invalide" },
    robots: { addRule: "Ajouter", agent: "User-agent", path: "Chemin", allow: "Allow", disallow: "Disallow", sitemap: "URL du sitemap", addUrl: "Ajouter URL", urls: "URLs", generate: "Générer", lint: "Avertissements" },
    anchor: { pasteAnchors: "Collez les ancres (une par ligne)", hint: "Nom de marque (optionnel)", distribution: "Répartition", risk: "Score de risque", recommendation: "Recommandation", exact: "Exacte", partial: "Partielle", branded: "Marque", naked: "URL nue", generic: "Générique" },
    ideas: { seedLabel: "Mot-clé racine", generate: "Générer", intent: "Intention", questions: "Questions", modifiers: "Modificateurs", clusters: "Clusters", export: "Exporter CSV", informational: "Informationnel", navigational: "Navigationnel", commercial: "Commercial", transactional: "Transactionnel" },
  },
  blog: {
    title: "Journal", subtitle: "Réflexions longues sur le SEO algorithmique.",
    readMore: "Lire", readingTime: "min de lecture", publishedOn: "Publié le",
    toc: "Sommaire", share: "Partager", related: "Similaires", empty: "Premier article bientôt.", back: "Retour au journal", by: "par",
  },
  admin: {
    title: "Admin", signIn: "Se connecter", signOut: "Déconnexion", email: "Email", password: "Mot de passe",
    overview: "Vue d'ensemble", posts: "Articles", newPost: "Nouvel article", totalPosts: "Total", published: "Publiés",
    drafts: "Brouillons", views: "Vues", slug: "Slug", lang: "Langue", excerpt: "Extrait", content: "Contenu (Markdown)",
    cover: "URL image de couverture", metaTitle: "Meta titre", metaDescription: "Meta description", keywords: "Mots-clés",
    status: "Statut", save: "Enregistrer", publish: "Publier", unpublish: "Dépublier", delete: "Supprimer",
    confirmDelete: "Supprimer cet article ?", edit: "Éditer", noPosts: "Aucun article — créez le premier.",
    loginFailed: "Connexion échouée.", forbidden: "Vous n'êtes pas administrateur.",
  },
  footer: { tagline: "Intelligence SEO premium. Alimentée par des algorithmes.", product: "Produit", company: "Entreprise", resources: "Ressources", rights: "Tous droits réservés." },
  common: { language: "Langue", loading: "Chargement…", notFoundTitle: "404 — Hors grille", notFoundBody: "La page recherchée s'est brisée en cubes.", goHome: "Accueil", comingSoon: "Bientôt" },
};

const ar: Dict = {
  nav: { tools: "الأدوات", blog: "المدوّنة", about: "حول", contact: "تواصل", admin: "الإدارة" },
  cta: { exploreTools: "اكتشف الأدوات", readBlog: "اقرأ المدوّنة", tryNow: "جرّبها", getStarted: "ابدأ" },
  home: {
    heroTitle: "تصدّر بلا حدود.",
    heroSubline: "منشور بلّوري من ثماني أدوات SEO خوارزمية. بلا واجهات خارجية. بلا حدود. بياناتك لا تغادر متصفّحك.",
    arsenalEyebrow: "الترسانة", arsenalTitle: "ثمانية أدوات. منظومة بلّورية واحدة.",
    arsenalSubtitle: "كل أداة تحسب نتائج حقيقية محلياً — بلا لوحات، بلا حصص.",
    whyEyebrow: "لماذا خوارزميات لا واجهات", whyTitle: "مبنيّة على الرياضيات، لا على وسطاء.",
    whyPrivate: { title: "خصوصية", body: "بياناتك لا تغادر المتصفّح. صفر تتبّع." },
    whyInstant: { title: "فوريّة", body: "كل نتيجة تُحسب بالمللي ثانية." },
    whyUnlimited: { title: "لا محدودة", body: "استخدم كل أداة قدر ما تشاء. مجاناً." },
    latestPostsTitle: "من اليوميّات", latestPostsEmpty: "أول مقال قريباً.",
    liveWidgetTitle: "محلّل SERP الحيّ", liveWidgetTitlePlaceholder: "عنوان صفحتك…",
    liveWidgetDescPlaceholder: "وصف الميتا…", liveWidgetScore: "نتيجة SEO",
  },
  tools: {
    "serp-preview": { name: "معاينة SERP", tagline: "معاينة قوقل بدقة البكسل مع تقييم." },
    "keyword-density": { name: "كثافة الكلمات", tagline: "TF و n-grams وبروز ثلاثي اللغات." },
    "page-auditor": { name: "مدقّق الصفحة", tagline: "أكثر من 30 عاملاً حقيقياً." },
    readability: { name: "قابلية القراءة", tagline: "Flesch وKandel-Moles وقواعد عربية." },
    "meta-generator": { name: "ميتا و OG", tagline: "<head> جاهز للنسخ مع JSON-LD." },
    "robots-sitemap": { name: "Robots و Sitemap", tagline: "منشئ مرئي مع فحص حيّ." },
    "anchor-audit": { name: "تدقيق الروابط", tagline: "صنّف الروابط وقِس المخاطر." },
    "keyword-ideas": { name: "أفكار كلمات", tagline: "توسيعات ونيّة وتجميع." },
  },
  toolsHub: {
    title: "الترسانة", subtitle: "ثمانية أدوات خوارزميّة. تعمل محلياً.",
    badge: "بلا واجهة • محلياً", comingSoon: "قريباً.",
    searchPlaceholder: "ابحث عن أداة…", all: "الكل",
    category: { "on-page": "على الصفحة", content: "المحتوى", technical: "تقني", "off-page": "خارج الصفحة" },
  },
  ui: {
    input: "المدخلات", results: "النتائج", howItWorks: "كيف تعمل", copy: "نسخ", copied: "تم النسخ",
    clear: "مسح", analyze: "تحليل", related: "أدوات مرتبطة", score: "النتيجة", example: "تحميل مثال",
    serp: { titleLabel: "عنوان الصفحة", descLabel: "وصف الميتا", keywordLabel: "الكلمة المفتاحية (اختياري)", desktop: "سطح المكتب", mobile: "الجوّال", over: "تجاوز الحد", under: "أقل من الحد", ok: "ضمن النطاق" },
    density: { textLabel: "الصق المحتوى", unigrams: "أحاديّة", bigrams: "ثنائيّة", trigrams: "ثلاثيّة", word: "الكلمة", count: "التكرار", freq: "الكثافة", totalWords: "إجمالي الكلمات", unique: "فريدة", over: "إفراط في التحسين", stopWords: "تجاهل الكلمات الشائعة" },
    audit: { htmlLabel: "الصق كامل HTML", critical: "حرجة", warning: "تحذيرات", passed: "ناجحة", fix: "الحل", runAudit: "شغّل التدقيق", pasteHtml: "الصق HTML كاملاً" },
    readability: { textLabel: "الصق النص", grade: "المستوى", ease: "سهولة القراءة", sentences: "الجمل", words: "الكلمات", syllables: "المقاطع", avgSentLen: "متوسط طول الجملة", passive: "المبني للمجهول" },
    meta: { titleField: "العنوان", descField: "الوصف", urlField: "الرابط الأساسي", imageField: "صورة OG", typeField: "نوع Schema", siteName: "اسم الموقع", author: "المؤلف", snippet: "<head> جاهز للنسخ", jsonldValid: "JSON-LD صالح", jsonldInvalid: "JSON-LD غير صالح" },
    robots: { addRule: "إضافة", agent: "User-agent", path: "المسار", allow: "Allow", disallow: "Disallow", sitemap: "رابط Sitemap", addUrl: "إضافة رابط", urls: "الروابط", generate: "توليد", lint: "تحذيرات" },
    anchor: { pasteAnchors: "الصق النصوص (واحد لكل سطر)", hint: "اسم العلامة (اختياري)", distribution: "التوزيع", risk: "درجة الخطر", recommendation: "توصية", exact: "مطابق", partial: "جزئي", branded: "علامة", naked: "رابط عاري", generic: "عام" },
    ideas: { seedLabel: "الكلمة الجذر", generate: "توليد الأفكار", intent: "النيّة", questions: "أسئلة", modifiers: "معدّلات", clusters: "مجموعات", export: "تصدير CSV", informational: "معلوماتي", navigational: "تنقّلي", commercial: "تجاري", transactional: "معاملات" },
  },
  blog: {
    title: "اليوميّات", subtitle: "أفكار مطوّلة حول SEO الخوارزمي.",
    readMore: "اقرأ", readingTime: "دقيقة", publishedOn: "نُشر في",
    toc: "الفهرس", share: "شارك", related: "مرتبطة", empty: "أول مقال قريباً.", back: "عودة", by: "بواسطة",
  },
  admin: {
    title: "الإدارة", signIn: "دخول", signOut: "خروج", email: "البريد", password: "كلمة السر",
    overview: "نظرة عامة", posts: "المقالات", newPost: "مقال جديد", totalPosts: "المجموع", published: "منشورة",
    drafts: "مسودّات", views: "المشاهدات", slug: "المعرّف", lang: "اللغة", excerpt: "المقتطف", content: "المحتوى (Markdown)",
    cover: "رابط صورة الغلاف", metaTitle: "ميتا العنوان", metaDescription: "ميتا الوصف", keywords: "كلمات مفتاحية",
    status: "الحالة", save: "حفظ", publish: "نشر", unpublish: "إلغاء النشر", delete: "حذف",
    confirmDelete: "حذف هذا المقال نهائياً؟", edit: "تحرير", noPosts: "لا توجد مقالات بعد.",
    loginFailed: "فشل الدخول.", forbidden: "لست مسؤولاً.",
  },
  footer: { tagline: "ذكاء SEO فاخر مدعوم بالخوارزميات.", product: "المنتج", company: "الشركة", resources: "موارد", rights: "جميع الحقوق محفوظة." },
  common: { language: "اللغة", loading: "جارٍ التحميل…", notFoundTitle: "404 — خارج الشبكة", notFoundBody: "الصفحة تحطّمت إلى مكعّبات.", goHome: "الرئيسية", comingSoon: "قريباً" },
};

export const dictionaries: Record<Lang, Dict> = { en, fr, ar };
