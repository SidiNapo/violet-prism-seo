import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { scoreSerp, TITLE_MAX_PX, DESC_MAX_PX } from "@/lib/seo/serp-score";
import { ScoreRing } from "@/components/site/ScoreRing";

export function SerpPreviewTool() {
  const { t, lang } = useI18n();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [keyword, setKeyword] = useState("");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const result = useMemo(
    () => scoreSerp({ title, description, keyword, lang }),
    [title, description, keyword, lang],
  );

  const loadExample = () => {
    setTitle(
      lang === "fr"
        ? "12 techniques SEO qui font vraiment classer en 2026"
        : lang === "ar"
          ? "12 تقنية SEO ترفع ترتيبك فعلاً في 2026"
          : "12 SEO Techniques That Actually Rank Pages in 2026",
    );
    setDescription(
      lang === "fr"
        ? "Un guide gratuit, direct et algorithmique. Zéro blabla, uniquement ce qui fonctionne."
        : lang === "ar"
          ? "دليل مجاني ومباشر بلا حشو. فقط ما ينجح فعلاً."
          : "A free, algorithmic guide. No fluff — only techniques that actually move the needle.",
    );
    setKeyword(lang === "fr" ? "seo 2026" : lang === "ar" ? "SEO 2026" : "seo 2026");
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="crystal-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">{t.ui.input}</h2>
          <button onClick={loadExample} className="text-xs font-mono text-amethyst-glow hover:underline">
            {t.ui.example}
          </button>
        </div>
        <Field label={t.ui.serp.titleLabel} value={title} onChange={setTitle} />
        <Field label={t.ui.serp.descLabel} value={description} onChange={setDescription} textarea />
        <Field label={t.ui.serp.keywordLabel} value={keyword} onChange={setKeyword} />

        <div className="space-y-2 pt-2">
          <MeterRow label={t.ui.serp.titleLabel} value={result.titlePx} max={TITLE_MAX_PX} unit="px" />
          <MeterRow label={t.ui.serp.descLabel} value={result.descPx} max={DESC_MAX_PX} unit="px" />
        </div>
      </div>

      <div className="space-y-6">
        <div className="crystal-card p-6 flex items-center gap-6">
          <ScoreRing score={result.score} size={120} />
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-mist">{t.ui.score}</div>
            <div className="font-display text-4xl gradient-text">{result.score}/100</div>
          </div>
        </div>

        <div className="crystal-card p-6">
          <div className="flex gap-1 mb-4 p-1 rounded-full bg-void/60 w-fit">
            {(["desktop", "mobile"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDevice(d)}
                className={
                  "px-3 py-1 text-xs rounded-full transition " +
                  (device === d ? "gradient-violet text-white" : "text-mist")
                }
              >
                {t.ui.serp[d]}
              </button>
            ))}
          </div>
          <SerpMock title={title} description={description} device={device} />
        </div>

        <div className="crystal-card p-6">
          <h3 className="font-display text-lg mb-3">{t.ui.results}</h3>
          <ul className="space-y-2 text-sm">
            {result.breakdown.map((b) => (
              <li key={b.label} className="flex items-center gap-3">
                <span className={"h-2 w-2 rounded-full " + (b.ok ? "bg-success-mint" : "bg-danger-rose")} />
                <span className="flex-1">{b.label}</span>
                <span className="font-mono text-xs text-mist">{b.value}/{b.max}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea }: { label: string; value: string; onChange: (v: string) => void; textarea?: boolean }) {
  const Component = textarea ? "textarea" : "input";
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest text-mist font-mono mb-1">{label}</div>
      <Component
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
        className="w-full rounded-lg bg-void/60 border border-border px-3 py-2 text-sm outline-none focus:border-amethyst-glow"
        rows={textarea ? 3 : undefined}
      />
    </label>
  );
}
function MeterRow({ label, value, max, unit }: { label: string; value: number; max: number; unit: string }) {
  const pct = Math.min(100, (value / max) * 100);
  const ok = value > 0 && value <= max;
  return (
    <div>
      <div className="flex justify-between text-xs font-mono text-mist">
        <span>{label}</span>
        <span>{value}{unit} / {max}{unit}</span>
      </div>
      <div className="h-1.5 rounded-full bg-void/60 mt-1 overflow-hidden">
        <div className="h-full transition-all" style={{ width: pct + "%", background: ok ? "hsl(160 70% 55%)" : "hsl(350 85% 62%)" }} />
      </div>
    </div>
  );
}
function SerpMock({ title, description, device }: { title: string; description: string; device: "desktop" | "mobile" }) {
  const w = device === "desktop" ? "max-w-xl" : "max-w-xs";
  return (
    <div className={"bg-white text-black p-4 rounded-md " + w}>
      <div className="text-xs text-[#5f6368]">example.com › page</div>
      <div className="text-[#1a0dab] text-lg leading-tight line-clamp-1" style={{ fontFamily: "Arial, sans-serif" }}>
        {title || "Your page title"}
      </div>
      <div className="text-sm text-[#4d5156] mt-1 line-clamp-2" style={{ fontFamily: "Arial, sans-serif" }}>
        {description || "Your meta description will appear here."}
      </div>
    </div>
  );
}
