import { Link, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";
import { LangSwitcher } from "./LangSwitcher";
import { Logo } from "./Logo";

export function Navbar() {
  const { lang, t } = useI18n();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = [
    { to: `/${lang}/tools`, label: t.nav.tools },
    { to: `/${lang}/blog`, label: t.nav.blog },
    { to: `/${lang}/about`, label: t.nav.about },
    { to: `/${lang}/contact`, label: t.nav.contact },
  ];

  return (
    <header
      className={
        "sticky top-0 z-40 w-full transition-all duration-300 " +
        (scrolled ? "py-2" : "py-4")
      }
    >
      <div className="mx-auto max-w-7xl px-4">
        <nav
          className={
            "crystal-card flex items-center justify-between gap-4 px-4 md:px-6 transition-all duration-300 " +
            (scrolled ? "py-2" : "py-3")
          }
        >
          <Link to={`/${lang}`} className="flex items-center gap-2">
            <Logo className="h-8 w-8" />
            <span className="font-display text-lg tracking-tight">
              E-<span className="gradient-text">SeoMax</span>
            </span>
          </Link>

          <ul className="hidden md:flex items-center gap-1">
            {items.map((it) => {
              const active = location.pathname === it.to || location.pathname.startsWith(it.to + "/");
              return (
                <li key={it.to} className="relative">
                  <Link
                    to={it.to}
                    className={
                      "px-3 py-2 rounded-md text-sm transition " +
                      (active ? "text-crystal-white" : "text-mist hover:text-crystal-white")
                    }
                    style={{
                      color: active ? "hsl(var(--crystal-white))" : undefined,
                    }}
                  >
                    {it.label}
                  </Link>
                  {active && (
                    <span
                      aria-hidden
                      className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-1 w-1 rounded-full"
                      style={{
                        background: "hsl(275 100% 78%)",
                        boxShadow: "0 0 10px hsl(275 100% 78%)",
                      }}
                    />
                  )}
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <LangSwitcher />
          </div>
        </nav>
      </div>
    </header>
  );
}
