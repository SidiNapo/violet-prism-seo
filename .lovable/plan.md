## E-SeoMax — Build Plan

Massive scope. I'll ship it in the three phases you outlined, in order, each phase landing as a working milestone before moving to the next. Nothing mocked.

---

### Phase 1 — Foundation, brand system, home (this phase)

**Design system (`src/styles.css`)**
- Convert tokens to HSL "Violet Prism" palette (void, deep-plum, royal, electric-violet, amethyst-glow, crystal-white, mist, success/warning/danger).
- Signature gradient, crystal-glass utility, aurora mesh background, score-ring conic utility, focus-ring in amethyst-glow.
- Fonts via `<link>` in `__root.tsx` head: Clash Display + Satoshi (Fontshare), IBM Plex Sans Arabic (Google), JetBrains Mono.
- Dark-only luxury interface. Restyle shadcn Button/Card/Input/Dialog through tokens.

**i18n**
- Context-based provider with `en.json` / `fr.json` / `ar.json` dictionaries (complete for every string used).
- Language-prefixed routes via TanStack file routing: `src/routes/$lang.tsx` layout + children (`index`, `tools`, `blog`, `about`, `contact`, `pricing`, `admin`). Root `/` redirects to detected/localStorage lang.
- `$lang` layout validates `en|fr|ar`, sets `<html lang dir>` (RTL for ar), swaps font family.
- Language switcher pill in navbar (EN / FR / ع), persists to localStorage, swaps route.

**Shell**
- Sticky glass navbar (shrinks on scroll, active-route amethyst dot).
- Footer with sitemap + language switcher.
- Prism-particles canvas layer (25–35 drifting cube outlines, `prefers-reduced-motion` aware).
- Aurora mesh fixed behind content.
- Custom 404 with CSS-cube shattered-crystal illustration.

**Home**
- Hero: Clash Display headline, subline, magnetic gradient CTA + ghost CTA, live mini SERP analyzer widget on the right (uses the Phase 2 SERP algorithm — score ring animates).
- "The Arsenal": 8 crystal-glass tool preview cards (lucide icons, gradient tint).
- "Why algorithms, not APIs": 3-column with animated dividers.
- Latest 3 posts from Supabase (skeleton while loading).
- Full responsive (375px baseline), keyboard-accessible.

**Signature moments (pick 2)**: faint violet cursor light-trail on hero only; 404 cubes reassemble into S monogram on hover.

---

### Phase 2 — The 8 tools (real algorithms, no external APIs)

Each at `/$lang/tools/$slug`, crystal-card layout, animated results, "How it works" accordion, 3 related-tool cards.

1. **serp-preview** — canvas `measureText` pixel-width for title (580px) / desc (990px), power-word lists EN/FR/AR, sentiment heuristic, number/date bonus, desktop + mobile SERP mock.
2. **keyword-density** — tokenizer with Arabic tashkeel strip + alef/hamza normalization, French accent option, 1/2/3-grams, TF, stop-word lists EN/FR/AR, recharts bar chart, prominence weighting, over-optimization flag.
3. **page-auditor** — DOMParser, 30+ factors (title/meta/H1/hierarchy/alt %/link ratio/canonical/og/twitter/viewport/lang/hreflang/JSON-LD/word count/text-HTML ratio/inline-style bloat/deprecated tags), categorized Critical/Warnings/Passed with copy-fix snippets.
4. **readability** — Flesch/Flesch-Kincaid (EN), Kandel-Moles (FR), custom AR heuristic (avg sentence len + rare-word ratio), passive detection, sentence-length histogram, transition ratio, per-sentence inline heatmap.
5. **meta-generator** — schema picker (Article/Product/LocalBusiness/FAQ) with per-type dynamic fields, JSON-LD validation, live Facebook + X card previews, hreflang trio, one-click copy.
6. **robots-sitemap** — visual rule builder with linting (`Disallow: /` warning, wildcard misuse); sitemap tab with XML gen, URL validation, 50k warning.
7. **anchor-audit** — classifier (exact/partial/branded/naked/generic, trilingual generic list), distribution vs benchmark, risk score, donut + gauge, rebalancing recs.
8. **keyword-ideas** — trilingual question patterns + modifier matrix + alphabet-soup + intent classifier; Jaccard clustering into named groups; CSV export.

**Tools hub** — filterable grid (category chips, live search), "no API • runs locally" badge on each card.

---

### Phase 3 — Blog + admin CMS + technical SEO

**Supabase (Lovable Cloud)**
- `posts` (id, slug, lang, title, excerpt, content, cover_image_url, meta_title, meta_description, keywords[], author_name, status, published_at, updated_at, reading_minutes, views, translation_group)
- `categories`, `post_categories`, `profiles` (role admin|editor), `site_settings`
- Storage bucket `blog-images` (public read)
- RLS: public SELECT only where `status='published'`; admin-only writes via `has_role()` security-definer + separate `user_roles` table (won't store role on profiles).
- Grants on public schema tables per current Data API rules.

**Public blog**
- `/$lang/blog` — featured wide crystal card + grid, category filter, pagination, active-lang only, skeletons.
- `/$lang/blog/$slug` — lazy cover, custom prose (not default Tailwind prose), auto ToC from headings (sticky on desktop), share buttons, prev/next, related-by-category, RPC view increment.
- Per-post `head()`: unique title/desc/canonical/og:image/Article JSON-LD/hreflang siblings via `translation_group`.

**Admin `/$lang/admin`**
- Email+password auth, admin-only via `_authenticated` layout + role check.
- Overview: stat cards + views-over-time area chart (recharts, gradient fill).
- Posts CRUD: table (lang flags, status pills, search, sort); editor with lang selector, slug auto-gen (Arabic transliteration + manual override), markdown editor with live preview, cover-image upload to Storage (drag-drop, client-side compression), SEO panel reusing Tool #1 pixel-width engine, keyword tags, draft/publish toggle, delete-with-confirm.
- Media library grid.
- Site settings.

**Technical SEO**
- Per-route `head()` on every page × language.
- Organization + WebSite JSON-LD on home; BreadcrumbList on tools and posts.
- `/sitemap.xml` via TanStack server route querying Supabase (published posts + static routes × 3 langs); `/robots.txt` pointing to it.
- Semantic HTML, single h1, alt text, aria-labels on icon buttons.
- Lazy routes, lazy images with width/height, font-display swap, preconnect.
- Cross-linking: tools ↔ posts by shared keywords.

**Polish**
- All three languages complete (no EN leak into FR/AR).
- RTL verified end-to-end.
- Every tool tested with real input.
- Empty states + written error states.

---

### Technical notes
- Stack stays TanStack Start (not react-router-dom, per template). Language prefix via `$lang` param layout; behavior identical to what you described.
- Meta via TanStack `head()` (not react-helmet-async — same outcome, correct for the stack).
- Lovable Cloud (Supabase-backed) enabled at start of Phase 3.
- All colors go through CSS tokens; no hex in components; every shadcn primitive gets a violet variant.

### Delivery order
1. Approve plan.
2. Phase 1 lands (foundation + home + 3 languages + shell).
3. Phase 2 lands (8 tools).
4. Phase 3 lands (Cloud enable, schema, blog, admin, sitemap, polish).

Reply "go" to start Phase 1, or tell me what to change.