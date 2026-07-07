import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { classifyAnchor, ANCHOR_BENCHMARK, type AnchorClass } from "@/lib/seo/algorithms";

const ORDER: AnchorClass[] = ["exact", "partial", "branded", "naked", "generic"];
const COLORS: Record<AnchorClass, string> = {
  exact: "hsl(350 85% 62%)",
  partial: "hsl(38 95% 60%)",
  branded: "hsl(265 85% 58%)",
  naked: "hsl(275 100% 78%)",
  generic: "hsl(160 70% 55%)",
};

export function AnchorAuditTool() {
  const { t, lang } = useI18n();
  const [text, setText] = useState("");
  const [brand, setBrand] = useState("");
  const [keyword, setKeyword] = useState("");

  const anchors = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const classes = useMemo(() => anchors.map((a) => classifyAnchor(a, brand, keyword, lang)), [anchors, brand, keyword, lang]);

  const dist: Record<AnchorClass, number> = { exact: 0, partial: 0, branded: 0, naked: 0, generic: 0 };
  classes.forEach((c) => (dist[c] += 1));
  const total = anchors.length || 1;

  // Risk: exact match anchors above 10% + very low branded < 20%
  const exactPct = (dist.exact / total) * 100;
  const brandedPct = (dist.branded / total) * 100;
  const risk = Math.min(100, Math.round(exactPct * 4 + Math.max(0, 30 - brandedPct) * 1.5));

  const recs: string[] = [];
  if (exactPct > 10) recs.push(`Exact-match at ${exactPct.toFixed(0)}% — spam signal. Aim below 10%.`);
  if (brandedPct < 20) recs.push(`Branded anchors at ${brandedPct.toFixed(0)}% — increase brand-name links.`);
  if ((dist.naked / total) * 100 < 10) recs.push(`Naked URLs low — add citation-style links.`);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="crystal-card p-6 space-y-3">
        <h2 className="font-display text-xl">{t.ui.input}</h2>
        <input value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="Brand name" className="w-full rounded bg-void/60 border border-border px-3 py-2 text-sm" />
        <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Focus keyword" className="w-full rounded bg-void/60 border border-border px-3 py-2 text-sm" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={16} placeholder={t.ui.anchor.pasteAnchors} className="w-full rounded bg-void/60 border border-border px-3 py-2 text-xs font-mono" />
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="crystal-card p-6 text-center">
            <div className="text-[10px] font-mono uppercase tracking-widest text-mist">{t.ui.anchor.risk}</div>
            <div className="font-display text-5xl mt-1" style={{ color: risk > 70 ? "hsl(350 85% 62%)" : risk > 40 ? "hsl(38 95% 60%)" : "hsl(160 70% 55%)" }}>{risk}</div>
          </div>
          <div className="crystal-card p-6">
            <div className="text-[10px] font-mono uppercase tracking-widest text-mist mb-2">{t.ui.anchor.distribution}</div>
            <div className="flex h-3 rounded-full overflow-hidden">
              {ORDER.map((c) => (
                <div key={c} title={c} style={{ background: COLORS[c], width: (dist[c] / total) * 100 + "%" }} />
              ))}
            </div>
            <div className="mt-3 space-y-1 text-xs">
              {ORDER.map((c) => (
                <div key={c} className="flex items-center justify-between">
                  <span className="flex items-center gap-2"><span className="h-2 w-2 rounded" style={{ background: COLORS[c] }} /> {t.ui.anchor[c]}</span>
                  <span className="font-mono">{((dist[c] / total) * 100).toFixed(0)}% <span className="text-mist">({ANCHOR_BENCHMARK[c]}%)</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
        {recs.length > 0 && (
          <div className="crystal-card p-5">
            <div className="text-xs font-mono uppercase tracking-widest text-amethyst-glow mb-2">{t.ui.anchor.recommendation}</div>
            <ul className="text-sm space-y-1">{recs.map((r, i) => <li key={i}>• {r}</li>)}</ul>
          </div>
        )}
        {anchors.length > 0 && (
          <div className="crystal-card p-5 max-h-64 overflow-y-auto">
            <ul className="text-xs font-mono space-y-1">
              {anchors.map((a, i) => (
                <li key={i} className="flex justify-between">
                  <span className="truncate">{a}</span>
                  <span style={{ color: COLORS[classes[i]] }}>{t.ui.anchor[classes[i]]}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
