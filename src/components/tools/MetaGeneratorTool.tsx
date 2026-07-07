import { useMemo, useState } from "react";
import { useI18n } from "@/i18n/context";
import { Copy, Check } from "lucide-react";

const SCHEMA_TYPES = ["Article", "Product", "LocalBusiness", "FAQPage"] as const;
type SchemaType = (typeof SCHEMA_TYPES)[number];

export function MetaGeneratorTool() {
  const { t } = useI18n();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [url, setUrl] = useState("");
  const [image, setImage] = useState("");
  const [site, setSite] = useState("E-SeoMax");
  const [author, setAuthor] = useState("");
  const [schema, setSchema] = useState<SchemaType>("Article");
  const [copied, setCopied] = useState(false);

  const jsonld = useMemo(() => {
    const base: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": schema,
      name: title,
      description: desc,
      url,
    };
    if (image) base.image = image;
    if (schema === "Article") {
      base.headline = title;
      if (author) base.author = { "@type": "Person", name: author };
    }
    if (schema === "Product") base.brand = { "@type": "Brand", name: site };
    return JSON.stringify(base, null, 2);
  }, [schema, title, desc, url, image, site, author]);

  const jsonldValid = useMemo(() => {
    try { JSON.parse(jsonld); return true; } catch { return false; }
  }, [jsonld]);

  const snippet = useMemo(() => {
    const lines = [
      `<title>${esc(title)}</title>`,
      `<meta name="description" content="${esc(desc)}">`,
      url && `<link rel="canonical" href="${esc(url)}">`,
      `<meta property="og:title" content="${esc(title)}">`,
      `<meta property="og:description" content="${esc(desc)}">`,
      `<meta property="og:type" content="website">`,
      url && `<meta property="og:url" content="${esc(url)}">`,
      image && `<meta property="og:image" content="${esc(image)}">`,
      `<meta property="og:site_name" content="${esc(site)}">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${esc(title)}">`,
      `<meta name="twitter:description" content="${esc(desc)}">`,
      image && `<meta name="twitter:image" content="${esc(image)}">`,
      `<script type="application/ld+json">\n${jsonld}\n</script>`,
    ].filter(Boolean).join("\n");
    return lines;
  }, [title, desc, url, image, site, jsonld]);

  const copy = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="crystal-card p-6 space-y-3">
        <h2 className="font-display text-xl">{t.ui.input}</h2>
        <F label={t.ui.meta.titleField} v={title} on={setTitle} />
        <F label={t.ui.meta.descField} v={desc} on={setDesc} area />
        <F label={t.ui.meta.urlField} v={url} on={setUrl} />
        <F label={t.ui.meta.imageField} v={image} on={setImage} />
        <F label={t.ui.meta.siteName} v={site} on={setSite} />
        <F label={t.ui.meta.author} v={author} on={setAuthor} />
        <div>
          <div className="text-xs uppercase tracking-widest text-mist font-mono mb-1">{t.ui.meta.typeField}</div>
          <div className="flex gap-1 flex-wrap">
            {SCHEMA_TYPES.map((s) => (
              <button
                key={s}
                onClick={() => setSchema(s)}
                className={"px-3 py-1 text-xs rounded-full font-mono " + (schema === s ? "gradient-violet text-white" : "border border-border text-mist")}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="crystal-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display text-lg">{t.ui.meta.snippet}</h3>
            <button onClick={copy} className="flex items-center gap-2 text-xs border border-border rounded-full px-3 py-1 hover:border-amethyst-glow">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} {copied ? t.ui.copied : t.ui.copy}
            </button>
          </div>
          <pre className="text-[11px] bg-void/70 rounded p-3 overflow-x-auto font-mono max-h-96 overflow-y-auto"><code>{snippet}</code></pre>
          <div className="mt-2 text-xs">
            <span className={jsonldValid ? "text-success-mint" : "text-danger-rose"}>
              ● {jsonldValid ? t.ui.meta.jsonldValid : t.ui.meta.jsonldInvalid}
            </span>
          </div>
        </div>
        <div className="crystal-card p-6">
          <div className="text-xs font-mono uppercase tracking-widest text-mist mb-2">Facebook</div>
          <div className="bg-[#242526] rounded overflow-hidden text-white">
            {image && <img src={image} alt="" className="w-full h-40 object-cover" />}
            <div className="p-3">
              <div className="text-[10px] uppercase text-gray-400">{url || "example.com"}</div>
              <div className="text-sm font-semibold line-clamp-2">{title || "Your title"}</div>
              <div className="text-xs text-gray-400 line-clamp-2 mt-0.5">{desc || "Your description"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function F({ label, v, on, area }: { label: string; v: string; on: (s: string) => void; area?: boolean }) {
  const C = area ? "textarea" : "input";
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest text-mist font-mono mb-1">{label}</div>
      <C
        value={v}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => on(e.target.value)}
        rows={area ? 3 : undefined}
        className="w-full rounded-lg bg-void/60 border border-border px-3 py-2 text-sm outline-none focus:border-amethyst-glow"
      />
    </label>
  );
}
function esc(s: string) {
  return s.replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
