import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { useI18n } from "@/i18n/context";
import { supabase } from "@/integrations/supabase/client";
import { renderMarkdown } from "@/lib/markdown";
import { hreflangLinks, ogLocale } from "@/lib/seo/head";
import type { Lang } from "@/i18n/dictionaries";

type Post = {
  id: string; slug: string; lang: string; title: string; excerpt: string; content: string;
  cover_image_url: string | null; meta_title: string | null; meta_description: string | null;
  keywords: string[]; author_name: string; published_at: string | null;
  updated_at: string; reading_minutes: number;
};

export const Route = createFileRoute("/$lang/blog/$slug")({
  component: BlogDetail,
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("posts")
      .select("id,slug,lang,title,excerpt,content,cover_image_url,meta_title,meta_description,keywords,author_name,published_at,updated_at,reading_minutes")
      .eq("slug", params.slug)
      .eq("lang", params.lang)
      .eq("status", "published")
      .maybeSingle();
    if (!data) throw notFound();
    return { post: data as Post };
  },
  head: ({ params, loaderData }) => {
    const lang = params.lang as Lang;
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "Not found — E-SeoMax" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = post.meta_title || `${post.title} — E-SeoMax`;
    const description = (post.meta_description || post.excerpt || "").slice(0, 160);
    const path = `/${params.lang}/blog/${params.slug}`;
    const image = post.cover_image_url || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: path },
        { property: "og:locale", content: ogLocale(lang) },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [
        { rel: "canonical", href: path },
        ...hreflangLinks(`/blog/${params.slug}`),
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
            image: image ? [image] : undefined,
            mainEntityOfPage: path,
            inLanguage: lang,
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
  const { post } = Route.useLoaderData();
  const { t } = useI18n();
  const html = useMemo(() => renderMarkdown(post.content), [post.content]);

  useEffect(() => {
    // fire-and-forget view increment; do not block render
    supabase.rpc("increment_post_views", { _slug: slug, _lang: lang }).then(
      () => {},
      () => {},
    );
  }, [slug, lang]);

  return (
    <article className="mx-auto max-w-3xl px-4 py-16">
      <Link to={`/${lang}/blog`} className="text-xs font-mono uppercase tracking-widest text-amethyst-glow">← {t.blog.back}</Link>
      <h1 className="mt-4 font-display text-4xl md:text-6xl gradient-text text-balance">{post.title}</h1>
      <div className="mt-4 flex items-center gap-3 text-sm text-mist font-mono">
        <span>{t.blog.by} {post.author_name}</span>
        <span>·</span>
        <span>{post.reading_minutes} {t.blog.readingTime}</span>
        {post.published_at && <><span>·</span><span>{new Date(post.published_at).toISOString().slice(0, 10)}</span></>}
      </div>
      {post.cover_image_url && (
        <img
          src={post.cover_image_url}
          alt=""
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
    </article>
  );
}
