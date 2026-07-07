import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { tokenize, ngrams, STOP_WORDS } from "@/lib/seo/algorithms";

export function KeywordDensityTool() {
  const { t, lang } = useI18n();
  const [text, setText] = useState("");
  const [ignoreStop, setIgnoreStop] = useState(true);
  const [n, setN] = useState<1 | 2 | 3>(1);

  const tokens = useMemo(() => tokenize(text, lang, { stripAccents: lang === "fr" }), [text, lang]);
  const rows = useMemo(() => {
    const ignore = ignoreStop ? STOP_WORDS[lang] : new Set<string>();
    return ngrams(tokens, n, ignore).slice(0, 30);
  }, [tokens, n, ignoreStop, lang]);

  const total = tokens.length;
  const unique = new Set(tokens).size;
  const maxDensity = rows[0]?.density || 0;
  const overOpt = maxDensity > 4;

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="crystal-card p-6 space-y-4">
        <h2 className="font-display text-xl">{t.ui.input}</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={16}
          placeholder={t.ui.density.textLabel}
          className="w-full rounded-lg bg-void/60 border border-border px-3 py-2 text-sm outline-none focus:border-amethyst-glow font-mono"
        />
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 p-1 rounded-full bg-void/60">
            {([1, 2, 3] as const).map((v) => (
              <button
                key={v}
                onClick={() => setN(v)}
                className={
                  "px-3 py-1 text-xs rounded-full font-mono transition " +
                  (n === v ? "gradient-violet text-white" : "text-mist")
                }
              >
                {v === 1 ? t.ui.density.unigrams : v === 2 ? t.ui.density.bigrams : t.ui.density.trigrams}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-2 text-xs text-mist">
            <input type="checkbox" checked={ignoreStop} onChange={(e) => setIgnoreStop(e.target.checked)} />
            {t.ui.density.stopWords}
          </label>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <Stat label={t.ui.density.totalWords} value={total} />
          <Stat label={t.ui.density.unique} value={unique} />
          <Stat label={t.ui.density.over} value={maxDensity.toFixed(1) + "%"} tone={overOpt ? "danger" : "ok"} />
        </div>

        <div className="crystal-card p-6">
          <h3 className="font-display text-lg mb-3">{t.ui.results}</h3>
          {rows.length === 0 ? (
            <p className="text-sm text-mist">—</p>
          ) : (
            <ul className="space-y-2">
              {rows.map((r) => (
                <li key={r.term} className="grid grid-cols-[1fr_auto_auto_120px] items-center gap-3 text-sm">
                  <span className="truncate font-mono">{r.term}</span>
                  <span className="text-mist text-xs">×{r.count}</span>
                  <span className="text-xs w-14 text-end font-mono">{r.density.toFixed(2)}%</span>
                  <div className="h-1.5 bg-void/60 rounded-full overflow-hidden">
                    <div className="h-full gradient-violet" style={{ width: Math.min(100, (r.density / (maxDensity || 1)) * 100) + "%" }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
function Stat({ label, value, tone }: { label: string; value: string | number; tone?: "ok" | "danger" }) {
  return (
    <div className="crystal-card p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-mist">{label}</div>
      <div className={"font-display text-2xl mt-1 " + (tone === "danger" ? "text-danger-rose" : "gradient-text")}>{value}</div>
    </div>
  );
}
