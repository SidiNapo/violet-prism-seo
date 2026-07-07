import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";
import { supabase } from "@/integrations/supabase/client";
import { renderMarkdown } from "@/lib/markdown";

type Post = {
  id: string; slug: string; lang: string; title: string; excerpt: string; content: string;
  cover_image_url: string | null; meta_title: string | null; meta_description: string | null;
  keywords: string[]; author_name: string; published_at: string | null; reading_minutes: number;
};

export const Route = createFileRoute("/$lang/blog/$slug")({
  component: BlogDetail,
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("posts")
      .select("title,excerpt,cover_image_url,meta_title,meta_description,author_name,published_at,updated_at")
      .eq("slug", params.slug)
      .eq("lang", params.lang)
      .eq("status", "published")
      .maybeSingle();
    return { seo: data as {
      title: string; excerpt: string; cover_image_url: string | null;
      meta_title: string | null; meta_description: string | null;
      author_name: string; published_at: string | null; updated_at: string;
    } | null };
  },
  head: ({ params, loaderData }) => {
    const seo = loaderData?.seo;
    const title = seo?.meta_title || (seo?.title ? `${seo.title} — E-SeoMax` : `${params.slug} — E-SeoMax`);
    const description = (seo?.meta_description || seo?.excerpt || "Long-form thinking on algorithmic SEO from the E-SeoMax team.").slice(0, 160);
    const url = `https://e-seomax.com/${params.lang}/blog/${params.slug}`;
    const image = seo?.cover_image_url || undefined;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/${params.lang}/blog/${params.slug}` },
        ...(image ? [{ property: "og:image", content: image }, { name: "twitter:image", content: image }] : []),
      ],
      links: [{ rel: "canonical", href: `/${params.lang}/blog/${params.slug}` }],
      scripts: seo
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: seo.title,
                description,
                author: { "@type": "Person", name: seo.author_name },
                datePublished: seo.published_at,
                dateModified: seo.updated_at,
                image: image ? [image] : undefined,
                mainEntityOfPage: url,
                inLanguage: params.lang,
              }),
            },
          ]
        : [],
    };
  },
});


function BlogDetail() {
  const { slug, lang } = Route.useParams();
  const { t } = useI18n();
  const [post, setPost] = useState<Post | null | "missing">(null);
  const [html, setHtml] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.from("posts").select("*").eq("slug", slug).eq("lang", lang).eq("status", "published").maybeSingle();
      if (!alive) return;
      if (!data) { setPost("missing"); return; }
      setPost(data as Post);
      setHtml(renderMarkdown((data as Post).content));
      supabase.rpc("increment_post_views", { _slug: slug, _lang: lang });
    })();
    return () => { alive = false; };
  }, [slug, lang]);

  if (post === "missing") {
    return <div className="mx-auto max-w-3xl px-4 py-32 text-center">
      <div className="font-display text-6xl gradient-text">404</div>
      <p className="mt-3 text-mist">Post not found.</p>
      <Link to={`/${lang}/blog`} className="mt-6 inline-block text-amethyst-glow">← {t.blog.back}</Link>
    </div>;
  }
  if (!post) return <div className="mx-auto max-w-3xl px-4 py-16"><div className="crystal-card h-96 animate-pulse" /></div>;

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
      {post.cover_image_url && <img src={post.cover_image_url} alt="" className="mt-8 w-full rounded-2xl aspect-video object-cover" />}
      <div
        className="mt-10 space-y-5 text-crystal-white/90 leading-relaxed"
        style={{ fontSize: "1.05rem" }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </article>
  );
}
