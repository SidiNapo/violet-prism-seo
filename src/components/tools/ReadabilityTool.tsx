import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { readability, splitSentences, tokenize } from "@/lib/seo/algorithms";

export function ReadabilityTool() {
  const { t, lang } = useI18n();
  const [text, setText] = useState("");
  const r = useMemo(() => readability(text, lang), [text, lang]);
  const sentences = useMemo(() => splitSentences(text), [text]);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="crystal-card p-6 space-y-4">
        <h2 className="font-display text-xl">{t.ui.input}</h2>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={18}
          placeholder={t.ui.readability.textLabel}
          className="w-full rounded-lg bg-void/60 border border-border px-3 py-2 text-sm outline-none focus:border-amethyst-glow"
        />
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Stat label={t.ui.readability.ease} value={r.fleschEase} accent />
          <Stat label={t.ui.readability.grade} value={r.gradeLevel} />
          <Stat label={t.ui.readability.words} value={r.words} />
          <Stat label={t.ui.readability.sentences} value={r.sentences} />
        </div>
        <div className="crystal-card p-5 space-y-2 text-sm">
          <Row k={t.ui.readability.avgSentLen} v={r.avgSentLen.toString()} />
          <Row k={t.ui.readability.syllables} v={r.syllables.toString()} />
          <Row k={t.ui.readability.passive} v={r.passiveCount.toString()} />
          <Row k={t.ui.score} v={r.label} />
        </div>
        <div className="crystal-card p-5">
          <div className="text-xs font-mono uppercase tracking-widest text-mist mb-3">Sentence heatmap</div>
          <div className="space-y-1 max-h-96 overflow-y-auto">
            {sentences.map((s, i) => {
              const len = tokenize(s, lang).length;
              const heat = Math.min(1, len / 30);
              return (
                <div
                  key={i}
                  className="text-sm px-2 py-1 rounded"
                  style={{ background: `hsl(${350 - 190 * (1 - heat)} 80% 60% / ${0.1 + heat * 0.35})` }}
                >
                  <span className="font-mono text-[10px] text-mist me-2">{len}w</span>
                  {s}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
function Stat({ label, value, accent }: { label: string; value: string | number; accent?: boolean }) {
  return (
    <div className="crystal-card p-4">
      <div className="text-[10px] font-mono uppercase tracking-widest text-mist">{label}</div>
      <div className={"font-display text-2xl mt-1 " + (accent ? "gradient-text" : "")}>{value}</div>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between border-b border-border/40 py-1">
      <span className="text-mist">{k}</span>
      <span className="font-mono">{v}</span>
    </div>
  );
}
