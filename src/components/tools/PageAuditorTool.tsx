import { useState } from "react";
import { useI18n } from "@/i18n/context";
import { auditHtml, type AuditIssue } from "@/lib/seo/algorithms";

export function PageAuditorTool() {
  const { t } = useI18n();
  const [html, setHtml] = useState("");
  const [issues, setIssues] = useState<AuditIssue[]>([]);
  const [ran, setRan] = useState(false);

  const run = () => {
    setIssues(auditHtml(html));
    setRan(true);
  };

  const critical = issues.filter((i) => i.severity === "critical");
  const warning = issues.filter((i) => i.severity === "warning");
  const passed = issues.filter((i) => i.severity === "passed");

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
      <div className="crystal-card p-6 space-y-4">
        <h2 className="font-display text-xl">{t.ui.input}</h2>
        <textarea
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          rows={18}
          placeholder={t.ui.audit.pasteHtml}
          className="w-full rounded-lg bg-void/60 border border-border px-3 py-2 text-xs outline-none focus:border-amethyst-glow font-mono"
        />
        <button
          onClick={run}
          className="w-full gradient-violet text-white rounded-full py-2 text-sm font-medium hover:opacity-90"
        >
          {t.ui.audit.runAudit}
        </button>
      </div>

      <div className="space-y-4">
        {ran && (
          <div className="grid grid-cols-3 gap-3">
            <Pill label={t.ui.audit.critical} count={critical.length} color="danger" />
            <Pill label={t.ui.audit.warning} count={warning.length} color="warn" />
            <Pill label={t.ui.audit.passed} count={passed.length} color="ok" />
          </div>
        )}
        {ran &&
          [
            { list: critical, color: "danger", label: t.ui.audit.critical },
            { list: warning, color: "warn", label: t.ui.audit.warning },
            { list: passed, color: "ok", label: t.ui.audit.passed },
          ].map((g) =>
            g.list.length ? (
              <div key={g.label} className="crystal-card p-5">
                <div className="text-xs font-mono uppercase tracking-widest text-mist mb-3">{g.label}</div>
                <ul className="space-y-3">
                  {g.list.map((i) => (
                    <li key={i.id} className="border-l-2 pl-3" style={{ borderColor: color(g.color) }}>
                      <div className="text-sm font-medium">{i.label}</div>
                      {i.detail && <div className="text-xs text-mist mt-0.5">{i.detail}</div>}
                      {i.fix && (
                        <pre className="mt-2 text-[11px] bg-void/60 rounded p-2 overflow-x-auto font-mono">
                          <code>{i.fix}</code>
                        </pre>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null,
          )}
        {!ran && <div className="crystal-card p-6 text-mist text-sm">← {t.ui.audit.pasteHtml}</div>}
      </div>
    </div>
  );
}
function color(c: "danger" | "warn" | "ok") {
  return c === "danger" ? "hsl(350 85% 62%)" : c === "warn" ? "hsl(38 95% 60%)" : "hsl(160 70% 55%)";
}
function Pill({ label, count, color: c }: { label: string; count: number; color: "danger" | "warn" | "ok" }) {
  return (
    <div className="crystal-card p-4 text-center">
      <div className="text-[10px] font-mono uppercase tracking-widest text-mist">{label}</div>
      <div className="font-display text-3xl mt-1" style={{ color: color(c) }}>{count}</div>
    </div>
  );
}
