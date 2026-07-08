import { createFileRoute, redirect } from "@tanstack/react-router";

function negotiateLang(header: string | null): "en" | "fr" | "ar" {
  if (!header) return "en";
  const entries = header.split(",").map((raw) => {
    const [tagRaw, ...params] = raw.trim().split(";");
    const qParam = params.find((p) => p.trim().startsWith("q="));
    const q = qParam ? parseFloat(qParam.split("=")[1]) || 0 : 1;
    return { tag: tagRaw.toLowerCase(), q };
  }).sort((a, b) => b.q - a.q);
  for (const { tag } of entries) {
    if (tag.startsWith("ar")) return "ar";
    if (tag.startsWith("fr")) return "fr";
    if (tag.startsWith("en")) return "en";
  }
  return "en";
}

export const Route = createFileRoute("/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const lang = negotiateLang(request.headers.get("accept-language"));
        return new Response(null, {
          status: 308,
          headers: { location: `/${lang}`, vary: "Accept-Language" },
        });
      },
    },
  },
  // Client-side fallback for in-app navigations to "/"
  beforeLoad: () => {
    throw redirect({ to: "/$lang", params: { lang: "en" } });
  },
});
