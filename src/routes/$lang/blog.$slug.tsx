import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { supabase } from "@/integrations/supabase/client";
import { extractHeadings, renderMarkdown } from "@/lib/markdown";
import { abs, hreflangFromSiblings, ogLocale, SITE_ORIGIN } from "@/lib/seo/head";
import type { Lang } from "@/i18n/dictionaries";

type Post = {
  id: string; slug: string; lang: string; title: string; excerpt: string; content: string;
  cover_image_url: string | null; meta_title: string | null; meta_description: string | null;
  keywords: string[]; author_name: string; published_at: string | null;
  updated_at: string; reading_minutes: number; translation_group: string;
};
type Sibling = { lang: string; slug: string };
type RelatedRow = { slug: string; title: string; excerpt: string; cover_image_url: string | null };

export const Route = createFileRoute("/$lang/blog/$slug")({
  component: BlogDetail,
  loader: async ({ params }) => {
    const { data: post } = await supabase
      .from("posts")
      .select("id,slug,lang,title,excerpt,content,cover_image_url,meta_title,meta_description,keywords,author_name,published_at,updated_at,reading_minutes,translation_group")
      .eq("slug", params.slug)
      .eq("lang", params.lang)
      .eq("status", "published")
      .maybeSingle();
    if (!post) throw notFound();

    const [{ data: siblingsData }, { data: relatedData }] = await Promise.all([
      supabase
        .from("posts")
        .select("lang,slug")
        .eq("translation_group", (post as Post).translation_group)
        .eq("status", "published"),
      // Related: same language, same status, share at least one keyword, exclude self.
      (post as Post).keywords && (post as Post).keywords.length
        ? supabase
            .from("posts")
            .select("slug,title,excerpt,cover_image_url")
            .eq("lang", params.lang)
            .eq("status", "published")
            .neq("id", (post as Post).id)
            .overlaps("keywords", (post as Post).keywords)
            .limit(3)
        : Promise.resolve({ data: [] as RelatedRow[] } as { data: RelatedRow[] }),
    ]);

    return {
      post: post as Post,
      siblings: (siblingsData as Sibling[]) || [],
      related: (relatedData as RelatedRow[]) || [],
    };
  },
  head: ({ params, loaderData }) => {
    const lang = params.lang as Lang;
    const post = loaderData?.post;
    const siblings = loaderData?.siblings ?? [];
    if (!post) {
      return {
        meta: [{ title: "Not found — E-SeoMax" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = post.meta_title || `${post.title} — E-SeoMax`;
    const description = (post.meta_description || post.excerpt || "").slice(0, 160);
    const url = abs(`/${params.lang}/blog/${params.slug}`);
    const image = post.cover_image_url || `${SITE_ORIGIN}/og-default.png`;
    const localeAlternates = siblings
      .filter((s) => s.lang !== lang)
      .map((s) => ({ property: "og:locale:alternate", content: ogLocale(s.lang as Lang) }));
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "og:locale", content: ogLocale(lang) },
        ...localeAlternates,
        { property: "og:image", content: image },
        { name: "twitter:image", content: image },
      ],
      links: [
        { rel: "canonical", href: url },
        ...hreflangFromSiblings("blog", siblings),
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description,
            author: { "@type": "Person", name: post.author_name },
            datePublished: post.published_at,
            dateModified: post.updated_at,
            image: [image],
            mainEntityOfPage: url,
            inLanguage: lang,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: abs(`/${lang}`) },
              { "@type": "ListItem", position: 2, name: "Journal", item: abs(`/${lang}/blog`) },
              { "@type": "ListItem", position: 3, name: post.title, item: url },
            ],
          }),
        },
      ],
    };
  },
  notFoundComponent: PostNotFound,
});

function PostNotFound() {
  const { lang, t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-32 text-center">
      <div className="font-display text-6xl gradient-text">404</div>
      <p className="mt-3 text-mist">{t.blog.empty}</p>
      <Link to={`/${lang}/blog`} className="mt-6 inline-block text-amethyst-glow">← {t.blog.back}</Link>
    </div>
  );
}

function BlogDetail() {
  const { lang, slug } = Route.useParams();
  const { post, siblings, related } = Route.useLoaderData();
  const { t } = useI18n();
  const html = useMemo(() => renderMarkdown(post.content), [post.content]);
  const toc = useMemo(() => extractHeadings(post.content).filter((h) => h.level >= 2 && h.level <= 3), [post.content]);
  const [copied, setCopied] = useState(false);

  // Client-side per-session debounce so view counts aren't spammed on refresh.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `eseomax:viewed:${lang}:${slug}`;
    try {
      if (sessionStorage.getItem(key)) return;
      sessionStorage.setItem(key, "1");
    } catch {
      /* ignore quota errors */
    }
    supabase.rpc("increment_post_views", { _slug: slug, _lang: lang }).then(
      () => {},
      () => {},
    );
  }, [slug, lang]);

  const shareUrl = abs(`/${lang}/blog/${slug}`);
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const otherLangs = siblings.filter((s) => s.lang !== lang);

  return (
    <article className="mx-auto max-w-6xl px-4 py-16">
      <Link to={`/${lang}/blog`} className="text-xs font-mono uppercase tracking-widest text-amethyst-glow">← {t.blog.back}</Link>
      <div className="mt-4 grid gap-12 lg:grid-cols-[minmax(0,1fr)_240px]">
        <div>
          <h1 className="font-display text-4xl md:text-6xl gradient-text text-balance">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-mist font-mono">
            <span>{t.blog.by} {post.author_name}</span>
            <span>·</span>
            <span>{post.reading_minutes} {t.blog.readingTime}</span>
            {post.published_at && <><span>·</span><span>{new Date(post.published_at).toISOString().slice(0, 10)}</span></>}
          </div>

          {otherLangs.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-mono">
              <span className="text-mist uppercase tracking-widest">{t.common.language}:</span>
              {otherLangs.map((s) => (
                <Link
                  key={s.lang}
                  to={`/${s.lang}/blog/${s.slug}`}
                  hrefLang={s.lang}
                  className="rounded-full border border-border px-3 py-1 text-amethyst-glow hover:border-amethyst-glow"
                >
                  {s.lang.toUpperCase()}
                </Link>
              ))}
            </div>
          )}

          {post.cover_image_url && (
            <img
              src={post.cover_image_url}
              alt={post.title}
              width={1200}
              height={675}
              className="mt-8 w-full rounded-2xl aspect-video object-cover"
            />
          )}

          <div
            className="mt-10 space-y-5 text-crystal-white/90 leading-relaxed"
            style={{ fontSize: "1.05rem" }}
            dangerouslySetInnerHTML={{ __html: html }}
          />

          <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-border/40 pt-6">
            <span className="text-xs font-mono uppercase tracking-widest text-mist">{t.blog.share}:</span>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
              target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-border px-3 py-1 text-xs hover:border-amethyst-glow"
            >X</a>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-border px-3 py-1 text-xs hover:border-amethyst-glow"
            >LinkedIn</a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank" rel="noopener noreferrer"
              className="rounded-full border border-border px-3 py-1 text-xs hover:border-amethyst-glow"
            >Facebook</a>
            <button
              type="button"
              onClick={copyLink}
              className="rounded-full border border-border px-3 py-1 text-xs hover:border-amethyst-glow"
            >
              {copied ? t.blog.shareCopied : t.blog.shareCopy}
            </button>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-2xl mb-6">{t.blog.related}</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {related.map((r) => (
                  <Link key={r.slug} to={`/${lang}/blog/${r.slug}`} className="crystal-card crystal-card-hover p-5 block">
                    {r.cover_image_url && (
                      <img src={r.cover_image_url} alt={r.title} loading="lazy" width={400} height={200} className="w-full h-32 object-cover rounded-lg mb-3" />
                    )}
                    <div className="font-display text-lg">{r.title}</div>
                    <p className="mt-1 text-sm text-mist line-clamp-2">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {toc.length > 1 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="text-xs font-mono uppercase tracking-widest text-amethyst-glow mb-3">{t.blog.toc}</div>
              <nav>
                <ul className="space-y-2 text-sm">
                  {toc.map((h) => (
                    <li key={h.id} className={h.level === 3 ? "ms-4" : ""}>
                      <a href={`#${h.id}`} className="text-mist hover:text-amethyst-glow transition line-clamp-2">
                        {h.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
