import { createContext, useContext, useEffect, type ReactNode } from "react";
import { dictionaries, type Dict, type Lang } from "./dictionaries";

type Ctx = { lang: Lang; t: Dict; dir: "ltr" | "rtl" };

const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    try {
      localStorage.setItem("eseomax:lang", lang);
    } catch {
      /* ignore */
    }
  }, [lang, dir]);

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
