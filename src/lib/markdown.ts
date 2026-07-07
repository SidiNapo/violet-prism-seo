/**
 * Tiny, safe-enough markdown renderer. Handles headings, paragraphs,
 * bold, italic, inline code, code blocks, lists, and links.
 * HTML in source is escaped before rules apply so <script> etc. can't inject.
 */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
export function renderMarkdown(src: string): string {
  if (!src) return "";
  const lines = esc(src).split("\n");
  const out: string[] = [];
  let inCode = false;
  let listBuf: string[] = [];
  const flushList = () => { if (listBuf.length) { out.push("<ul class='list-disc ms-6 space-y-1'>" + listBuf.join("") + "</ul>"); listBuf = []; } };
  for (const raw of lines) {
    if (raw.trim().startsWith("```")) {
      flushList();
      if (!inCode) { out.push("<pre class='bg-void/70 rounded-lg p-4 overflow-x-auto text-xs font-mono'><code>"); inCode = true; }
      else { out.push("</code></pre>"); inCode = false; }
      continue;
    }
    if (inCode) { out.push(raw + "\n"); continue; }

    const h = raw.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushList();
      const lvl = h[1].length;
      const cls = lvl === 1 ? "font-display text-4xl mt-10 mb-4 gradient-text"
        : lvl === 2 ? "font-display text-3xl mt-8 mb-3"
        : lvl === 3 ? "font-display text-2xl mt-6 mb-2"
        : "font-display text-xl mt-4 mb-2";
      out.push(`<h${lvl} class="${cls}">${inline(h[2])}</h${lvl}>`);
      continue;
    }
    const li = raw.match(/^\s*[-*]\s+(.*)$/);
    if (li) { listBuf.push(`<li>${inline(li[1])}</li>`); continue; }
    if (!raw.trim()) { flushList(); continue; }
    flushList();
    out.push(`<p>${inline(raw)}</p>`);
  }
  flushList();
  if (inCode) out.push("</code></pre>");
  return out.join("\n");
}
function inline(s: string): string {
  return s
    .replace(/`([^`]+)`/g, '<code class="bg-void/60 px-1 rounded text-amethyst-glow font-mono text-[0.9em]">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-amethyst-glow underline">$1</a>');
}
