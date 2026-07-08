import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { generateIdeas, classifyIntent, clusterKeywords } from "@/lib/seo/algorithms";
import { Download } from "lucide-react";

export function KeywordIdeasTool() {
  const { t, lang } = useI18n();
  const [seed, setSeed] = useState("");
  const [ideas, setIdeas] = useState<string[]>([]);

  const clusters = useMemo(() => (ideas.length ? clusterKeywords(ideas) : []), [ideas]);

  const run = () => setIdeas(generateIdeas(seed, lang));

  const exportCsv = () => {
    const rows = ideas.map((k) => [k, classifyIntent(k, lang)].map(csvCell).join(","));
    const csv = "keyword,intent\n" + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "keyword-ideas.csv";
    a.click();
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="crystal-card p-6 space-y-4">
        <h2 className="font-display text-xl">{t.ui.input}</h2>
        <input value={seed} onChange={(e) => setSeed(e.target.value)} placeholder={t.ui.ideas.seedLabel} className="w-full rounded bg-void/60 border border-border px-3 py-2" />
        <button onClick={run} className="w-full gradient-violet text-white rounded-full py-2 text-sm">{t.ui.ideas.generate}</button>
        {ideas.length > 0 && (
          <button onClick={exportCsv} className="w-full flex items-center justify-center gap-2 border border-border rounded-full py-2 text-sm hover:border-amethyst-glow">
            <Download className="h-4 w-4" /> {t.ui.ideas.export} ({ideas.length})
          </button>
        )}
      </div>
      <div className="space-y-4">
        {clusters.length === 0 ? (
          <div className="crystal-card p-6 text-mist text-sm">{t.ui.ideas.empty}</div>
        ) : (
          clusters.slice(0, 12).map((c) => (
            <div key={c.name} className="crystal-card p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display text-lg gradient-text">{c.name}</div>
                <div className="text-xs text-mist font-mono">{c.items.length}</div>
              </div>
              <ul className="grid gap-1 sm:grid-cols-2 text-sm">
                {c.items.map((k) => {
                  const intent = classifyIntent(k, lang);
                  return (
                    <li key={k} className="flex justify-between items-center gap-2 py-1 border-b border-border/30">
                      <span className="truncate font-mono text-xs">{k}</span>
                      <span className="text-[10px] font-mono uppercase text-amethyst-glow">{t.ui.ideas[intent]}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
function csvCell(s: string) {
  return `"${s.replace(/"/g, '""')}"`;
}
