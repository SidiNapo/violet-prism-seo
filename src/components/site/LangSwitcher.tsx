import { Link, useLocation } from "@tanstack/react-router";
import { useI18n } from "@/i18n/context";
import { LANGS, type Lang } from "@/i18n/dictionaries";

const LABEL: Record<Lang, string> = { en: "EN", fr: "FR", ar: "ع" };

export function LangSwitcher() {
  const { lang } = useI18n();
  const location = useLocation();

  const buildHref = (target: Lang) => {
    const path = location.pathname.replace(/^\/(en|fr|ar)(?=\/|$)/, "") || "/";
    return `/${target}${path === "/" ? "" : path}` || `/${target}`;
  };

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full p-1 crystal-card"
      role="group"
      aria-label="Language"
    >
      {LANGS.map((l) => {
        const active = l === lang;
        return (
          <Link
            key={l}
            to={buildHref(l)}
            className={
              "px-3 py-1 rounded-full text-xs font-medium font-mono transition " +
              (active
                ? "gradient-violet text-white"
                : "text-mist hover:text-crystal-white")
            }
            style={{ color: active ? "white" : undefined }}
            aria-current={active ? "true" : undefined}
          >
            <span className={l === "ar" ? "font-arabic text-sm" : ""}>{LABEL[l]}</span>
          </Link>
        );
      })}
    </div>
  );
}
