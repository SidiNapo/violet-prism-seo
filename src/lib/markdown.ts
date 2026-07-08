/**
 * Tiny, safe-enough markdown renderer. Handles headings, paragraphs,
 * bold, italic, inline code, code blocks, lists, and links.
 * HTML in source is escaped before rules apply so <script> etc. can't inject.
 * Link protocols are strictly allow-listed to prevent javascript:/data: XSS.
 */
function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Allow http/https, mailto, root-relative (/…) and same-page fragments (#…).
// Reject javascript:, data:, vbscript:, file:, etc.
function isSafeHref(raw: string): boolean {
  const trimmed = raw.trim().replace(/&#x?\d+;?/gi, ""); // strip HTML numeric entities
  return /^(https?:|mailto:|\/|#)/i.test(trimmed);
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "section";
}

export type HeadingItem = { id: string; text: string; level: number };

export function extractHeadings(src: string): HeadingItem[] {
  if (!src) return [];
  const out: HeadingItem[] = [];
  const used = new Map<string, number>();
  for (const raw of src.split("\n")) {
    const h = raw.match(/^(#{1,6})\s+(.*)$/);
    if (!h) continue;
    const level = h[1].length;
    const text = h[2].trim();
    let id = slugifyHeading(text);
    const n = used.get(id) ?? 0;
    used.set(id, n + 1);
    if (n > 0) id = `${id}-${n}`;
    out.push({ id, text, level });
  }
  return out;
}

export function renderMarkdown(src: string): string {
  if (!src) return "";
  const lines = esc(src).split("\n");
  const out: string[] = [];
  let inCode = false;
  let listBuf: string[] = [];
  const used = new Map<string, number>();
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
      const rawText = h[2];
      let id = slugifyHeading(rawText);
      const n = used.get(id) ?? 0;
      used.set(id, n + 1);
      if (n > 0) id = `${id}-${n}`;
      const cls = lvl === 1 ? "font-display text-4xl mt-10 mb-4 gradient-text"
        : lvl === 2 ? "font-display text-3xl mt-8 mb-3"
        : lvl === 3 ? "font-display text-2xl mt-6 mb-2"
        : "font-display text-xl mt-4 mb-2";
      out.push(`<h${lvl} id="${id}" class="${cls}">${inline(rawText)}</h${lvl}>`);
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
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, href: string) => {
      if (!isSafeHref(href)) return label; // strip unsafe protocol -> plain text
      const isExternal = /^https?:/i.test(href.trim());
      const extra = isExternal ? ' target="_blank" rel="noopener noreferrer"' : "";
      return `<a href="${href}" class="text-amethyst-glow underline"${extra}>${label}</a>`;
    });
}
