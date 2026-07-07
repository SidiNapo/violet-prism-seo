import { createFileRoute, Outlet, notFound } from "@tanstack/react-router";
import { I18nProvider } from "@/i18n/context";
import { isLang } from "@/i18n/dictionaries";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { PrismParticles } from "@/components/site/PrismParticles";
import { AuroraMesh } from "@/components/site/AuroraMesh";

export const Route = createFileRoute("/$lang")({
  beforeLoad: ({ params }) => {
    if (!isLang(params.lang)) throw notFound();
  },
  component: LangLayout,
  notFoundComponent: () => (
    <div className="min-h-screen grid place-items-center px-4 text-center">
      <div>
        <div className="font-display text-6xl gradient-text">404</div>
        <p className="mt-3 text-mist">Route shattered.</p>
      </div>
    </div>
  ),
});

function LangLayout() {
  const { lang } = Route.useParams();
  if (!isLang(lang)) return null;
  return (
    <I18nProvider lang={lang}>
      <div className="relative min-h-screen isolate">
        <AuroraMesh />
        <PrismParticles />
        <div className="relative z-10 flex min-h-screen flex-col">
          <Navbar />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </div>
    </I18nProvider>
  );
}
