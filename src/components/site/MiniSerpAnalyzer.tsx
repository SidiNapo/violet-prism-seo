import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { scoreSerp, TITLE_MAX_PX, DESC_MAX_PX } from "@/lib/seo/serp-score";
import { ScoreRing } from "./ScoreRing";

export function MiniSerpAnalyzer() {
  const { t, lang } = useI18n();
  const [title, setTitle] = useState(t.home.exampleTitle);
  const [description, setDescription] = useState(t.home.exampleDesc);

  const result = useMemo(() => scoreSerp({ title, description, lang }), [title, description, lang]);

  const titleBar = Math.min(100, (result.titlePx / TITLE_MAX_PX) * 100);
  const descBar = Math.min(100, (result.descPx / DESC_MAX_PX) * 100);
  const titleOk = result.titlePx > 0 && result.titlePx <= TITLE_MAX_PX;
  const descOk = result.descPx > 0 && result.descPx <= DESC_MAX_PX;

  return (
    <div className="crystal-card crystal-card-hover p-6 md:p-7 w-full max-w-md mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-mist">{t.home.liveWidgetTitle}</div>
          <div className="font-display text-xl mt-1">SERP × Live</div>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest text-success-mint bg-success-mint/10 border border-success-mint/30">
          <span className="h-1.5 w-1.5 rounded-full bg-success-mint animate-pulse" />
          {t.home.liveWidgetLive}
        </span>
      </div>

      <div className="space-y-3">
        <label className="block">
          <span className="text-xs text-mist">Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t.home.liveWidgetTitlePlaceholder}
            className="mt-1 w-full rounded-lg bg-void/60 border border-border px-3 py-2 text-sm outline-none focus:border-amethyst-glow/60"
          />
          <div className="h-1 mt-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${titleBar}%`,
                background: titleOk ? "hsl(160 70% 55%)" : "hsl(350 85% 62%)",
              }}
            />
          </div>
          <div className="mt-1 text-[11px] font-mono text-mist flex justify-between">
            <span>{result.titlePx}px</span><span>/ {TITLE_MAX_PX}px</span>
          </div>
        </label>

        <label className="block">
          <span className="text-xs text-mist">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.home.liveWidgetDescPlaceholder}
            rows={3}
            className="mt-1 w-full rounded-lg bg-void/60 border border-border px-3 py-2 text-sm outline-none focus:border-amethyst-glow/60 resize-none"
          />
          <div className="h-1 mt-2 rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${descBar}%`,
                background: descOk ? "hsl(160 70% 55%)" : "hsl(350 85% 62%)",
              }}
            />
          </div>
          <div className="mt-1 text-[11px] font-mono text-mist flex justify-between">
            <span>{result.descPx}px</span><span>/ {DESC_MAX_PX}px</span>
          </div>
        </label>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <ScoreRing score={result.score} label={t.home.liveWidgetScore} size={150} />
      </div>
    </div>
  );
}
