import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";

export const Route = createFileRoute("/$lang/blog")({
  component: BlogPage,
  head: ({ params }) => ({
    meta: [{ title: "Blog — E-SeoMax" }, { property: "og:url", content: `/${params.lang}/blog` }],
    links: [{ rel: "canonical", href: `/${params.lang}/blog` }],
  }),
});

function BlogPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-5xl px-4 py-24 text-center">
      <h1 className="font-display text-5xl gradient-text">{t.nav.blog}</h1>
      <p className="mt-4 text-mist">{t.home.latestPostsEmpty}</p>
    </div>
  );
}
