import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { supabase } from "@/integrations/supabase/client";
import { abs, hreflangLinks, ogLocale, pickLang, SITE_ORIGIN } from "@/lib/seo/head";
import type { Lang } from "@/i18n/dictionaries";

type PostRow = {
  id: string; slug: string; title: string; excerpt: string; cover_image_url: string | null;
  published_at: string | null; reading_minutes: number; author_name: string;
};

export const Route = createFileRoute("/$lang/blog")({
  component: BlogList,
  loader: async ({ params }) => {
    const { data } = await supabase
      .from("posts")
      .select("id,slug,title,excerpt,cover_image_url,published_at,reading_minutes,author_name")
      .eq("lang", params.lang)
      .eq("status", "published")
      .order("published_at", { ascending: false });
    return { posts: (data as PostRow[]) || [] };
  },
  head: ({ params }) => {
    const lang = params.lang as Lang;
    const title = pickLang(lang, {
      en: "Journal — E-SeoMax",
      fr: "Journal — E-SeoMax",
      ar: "المجلة — E-SeoMax",
    });
    const description = pickLang(lang, {
      en: "Long-form thinking on algorithmic SEO, on-page craft, and how search actually works — from the E-SeoMax team.",
      fr: "Réflexions approfondies sur le SEO algorithmique, l'artisanat on-page et le fonctionnement réel de la recherche — par l'équipe E-SeoMax.",
      ar: "مقالات مطوّلة حول SEO الخوارزمي وحرفة الصفحة وكيف يعمل البحث فعلياً — من فريق E-SeoMax.",
    });
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: `/${params.lang}/blog` },
        { property: "og:locale", content: ogLocale(lang) },
      ],
      links: [
        { rel: "canonical", href: `/${params.lang}/blog` },
        ...hreflangLinks("/blog"),
      ],
    };
  },
});

function BlogList() {
  const { t, lang } = useI18n();
  const { posts } = Route.useLoaderData() as { posts: PostRow[] };

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <div className="max-w-2xl mb-12">
        <h1 className="font-display text-5xl gradient-text">{t.blog.title}</h1>
        <p className="mt-3 text-mist">{t.blog.subtitle}</p>
      </div>

      {posts.length === 0 ? (
        <div className="crystal-card p-12 text-center text-mist">{t.blog.empty}</div>
      ) : (
        <>
          {posts[0] && (
            <Link to={`/${lang}/blog/${posts[0].slug}`} className="crystal-card crystal-card-hover block p-0 overflow-hidden mb-8">
              <div className="grid md:grid-cols-[1.2fr_1fr]">
                {posts[0].cover_image_url ? (
                  <img src={posts[0].cover_image_url} alt="" loading="lazy" width={800} height={450} className="w-full h-64 md:h-full object-cover" />
                ) : (
                  <div className="w-full h-64 md:h-full aurora-mesh" />
                )}
                <div className="p-8">
                  <div className="text-xs font-mono uppercase tracking-widest text-amethyst-glow">Featured</div>
                  <h2 className="font-display text-3xl mt-3">{posts[0].title}</h2>
                  <p className="mt-3 text-mist line-clamp-3">{posts[0].excerpt}</p>
                  <div className="mt-4 text-xs font-mono text-mist">{posts[0].reading_minutes} {t.blog.readingTime}</div>
                </div>
              </div>
            </Link>
          )}
          <div className="grid gap-4 md:grid-cols-3">
            {posts.slice(1).map((p) => (
              <Link key={p.id} to={`/${lang}/blog/${p.slug}`} className="crystal-card crystal-card-hover p-6 block">
                {p.cover_image_url && <img src={p.cover_image_url} alt="" loading="lazy" width={600} height={240} className="w-full h-40 object-cover rounded-lg mb-4" />}
                <div className="font-display text-xl">{p.title}</div>
                <p className="mt-2 text-sm text-mist line-clamp-2">{p.excerpt}</p>
                <div className="mt-3 text-xs font-mono text-mist">{p.reading_minutes} {t.blog.readingTime}</div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
