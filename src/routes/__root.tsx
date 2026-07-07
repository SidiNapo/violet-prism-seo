import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <div className="font-display text-7xl gradient-text">404</div>
        <h1 className="mt-4 text-xl font-semibold">Off the grid</h1>
        <p className="mt-2 text-sm text-mist">This route shattered into cubes.</p>
        <div className="mt-6">
          <Link
            to="/en"
            className="inline-flex items-center justify-center rounded-full gradient-violet px-5 py-2 text-sm font-medium text-white"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-mist">Something went wrong. Try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full gradient-violet px-5 py-2 text-sm font-medium text-white"
          >
            Try again
          </button>
          <a
            href="/en"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-medium"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "E-SeoMax — Algorithmic SEO Intelligence" },
      {
        name: "description",
        content:
          "E-SeoMax is a premium, trilingual SEO intelligence platform. Eight algorithmic tools, real results, zero external APIs.",
      },
      { name: "author", content: "E-SeoMax" },
      { property: "og:title", content: "E-SeoMax — Algorithmic SEO Intelligence" },
      {
        property: "og:description",
        content: "Eight algorithmic SEO tools. No APIs. No limits. Your data stays in your browser.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "E-SeoMax" },
      { property: "og:url", content: "https://e-seomax.com" },
      { property: "og:locale", content: "en_US" },
      { property: "og:locale:alternate", content: "fr_FR" },
      { property: "og:locale:alternate", content: "ar" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@eseomax" },
      { name: "theme-color", content: "#0a0014" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://api.fontshare.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&f[]=satoshi@300,400,500,700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@300;400;500;700&family=JetBrains+Mono:wght@400;500;700&display=swap",
      },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "E-SeoMax",
          url: "https://e-seomax.com",
          logo: "https://e-seomax.com/favicon.ico",
          sameAs: [],
          description: "Algorithmic SEO intelligence platform with 8 tools running fully in-browser.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "E-SeoMax",
          url: "https://e-seomax.com",
          inLanguage: ["en", "fr", "ar"],
        }),
      },
      {
        children:
          "try{document.documentElement.classList.add('dark')}catch(e){}",
      },
    ],
    scripts: [
      {
        children:
          "try{document.documentElement.classList.add('dark')}catch(e){}",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
