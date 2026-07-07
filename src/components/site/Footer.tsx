import { Link } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { Logo } from "./Logo";
import { LangSwitcher } from "./LangSwitcher";

export function Footer() {
  const { lang, t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer className="relative z-10 mt-24 border-t border-border/60">
      <div className="mx-auto max-w-7xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-display text-lg">
              E-<span className="gradient-text">SeoMax</span>
            </span>
          </div>
          <p className="text-sm text-mist max-w-xs">{t.footer.tagline}</p>
          <div className="pt-2">
            <LangSwitcher />
          </div>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-mist mb-3">{t.footer.product}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to={`/${lang}/tools`} className="hover:text-amethyst-glow">{t.nav.tools}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-mist mb-3">{t.footer.company}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to={`/${lang}/about`} className="hover:text-amethyst-glow">{t.nav.about}</Link></li>
            <li><Link to={`/${lang}/contact`} className="hover:text-amethyst-glow">{t.nav.contact}</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs uppercase tracking-widest text-mist mb-3">{t.footer.resources}</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to={`/${lang}/blog`} className="hover:text-amethyst-glow">{t.nav.blog}</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto max-w-7xl px-4 py-4 text-xs text-mist flex flex-wrap gap-2 justify-between">
          <span>© {year} E-SeoMax. {t.footer.rights}</span>
          <span className="font-mono">v0.1 — Violet Prism</span>
        </div>
      </div>
    </footer>
  );
}
