import { createContext, useContext, useEffect, type ReactNode } from "react";
import { dictionaries, type Dict, type Lang } from "./dictionaries";

type Ctx = { lang: Lang; t: Dict; dir: "ltr" | "rtl" };

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const dir = lang === "ar" ? "rtl" : "ltr";

  // <html lang> and dir are set server-side by RootShell from the URL segment,
  // so we don't touch documentElement here (would cause a hydration mismatch).
  // Only persist the user's language choice for lang-switch UX.
  useEffect(() => {
    try {
      localStorage.setItem("eseomax:lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, t: dictionaries[lang], dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
