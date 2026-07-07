import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/context";
import { supabase } from "@/integrations/supabase/client";
import type { Lang } from "@/i18n/dictionaries";

type Post = {
  id: string; slug: string; lang: string; title: string; excerpt: string; content: string;
  cover_image_url: string | null; meta_title: string | null; meta_description: string | null;
  keywords: string[]; status: string; views: number; published_at: string | null; reading_minutes: number;
};

export const Route = createFileRoute("/$lang/console/7k9m2p")({
  component: Admin,
  head: () => ({ meta: [{ title: "Admin — E-SeoMax" }, { name: "robots", content: "noindex" }] }),
});

function Admin() {
  const { t, lang } = useI18n();
  const [session, setSession] = useState<{ userId: string; email: string } | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setSession({ userId: data.session.user.id, email: data.session.user.email || "" });
        const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.session.user.id);
        setIsAdmin(!!roles?.some((r) => r.role === "admin"));
      } else {
        setSession(null); setIsAdmin(null);
      }
    };
    check();
    const { data: sub } = supabase.auth.onAuthStateChange(() => check());
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setErr(t.admin.loginFailed);
  };
  const signOut = async () => { await supabase.auth.signOut(); };

  if (!session) return (
    <div className="mx-auto max-w-md px-4 py-24">
      <div className="crystal-card p-8">
        <h1 className="font-display text-3xl gradient-text mb-6">{t.admin.title}</h1>
        <form onSubmit={signIn} className="space-y-4">
          <label className="block"><div className="text-xs font-mono uppercase tracking-widest text-mist mb-1">{t.admin.email}</div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full rounded bg-void/60 border border-border px-3 py-2 text-sm" />
          </label>
          <label className="block"><div className="text-xs font-mono uppercase tracking-widest text-mist mb-1">{t.admin.password}</div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full rounded bg-void/60 border border-border px-3 py-2 text-sm" />
          </label>
          {err && <div className="text-sm text-danger-rose">{err}</div>}
          <button type="submit" className="w-full gradient-violet text-white rounded-full py-2 text-sm font-medium">{t.admin.signIn}</button>
        </form>
      </div>
    </div>
  );

  if (isAdmin === null) return <div className="mx-auto max-w-md px-4 py-24 text-center text-mist">{t.common.loading}</div>;
  if (!isAdmin) return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <div className="crystal-card p-8">
        <h1 className="font-display text-2xl mb-3">{t.admin.forbidden}</h1>
        <p className="text-sm text-mist mb-4">Your user id: <code className="font-mono text-xs">{session.userId}</code></p>
        <p className="text-sm text-mist mb-4">Grant admin role by running: <code className="block mt-2 font-mono text-xs bg-void/70 p-2 rounded text-start">INSERT INTO user_roles(user_id, role) VALUES ('{session.userId}', 'admin');</code></p>
        <button onClick={signOut} className="mt-3 border border-border rounded-full px-4 py-1 text-sm">{t.admin.signOut}</button>
      </div>
    </div>
  );

  return <AdminDashboard email={session.email} signOut={signOut} defaultLang={lang} />;
}

function AdminDashboard({ email, signOut, defaultLang }: { email: string; signOut: () => void; defaultLang: Lang }) {
  const { t } = useI18n();
  const nav = useNavigate();
  const [tab, setTab] = useState<"overview" | "posts" | "editor">("overview");
  const [posts, setPosts] = useState<Post[]>([]);
  const [editing, setEditing] = useState<Post | null>(null);

  const load = async () => {
    const { data } = await supabase.from("posts").select("*").order("updated_at", { ascending: false });
    setPosts((data as Post[]) || []);
  };
  useEffect(() => { load(); }, []);

  const totals = {
    total: posts.length,
    published: posts.filter((p) => p.status === "published").length,
    drafts: posts.filter((p) => p.status === "draft").length,
    views: posts.reduce((s, p) => s + p.views, 0),
  };

  const newPost = () => {
    setEditing({
      id: "", slug: "", lang: defaultLang, title: "", excerpt: "", content: "",
      cover_image_url: null, meta_title: null, meta_description: null,
      keywords: [], status: "draft", views: 0, published_at: null, reading_minutes: 1,
    });
    setTab("editor");
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl gradient-text">{t.admin.title}</h1>
        <div className="flex items-center gap-3 text-sm">
          <span className="text-mist">{email}</span>
          <button onClick={signOut} className="border border-border rounded-full px-3 py-1 text-xs">{t.admin.signOut}</button>
        </div>
      </div>

      <nav className="flex gap-1 mb-8 p-1 rounded-full bg-void/60 w-fit">
        {(["overview", "posts"] as const).map((v) => (
          <button key={v} onClick={() => setTab(v)} className={"px-4 py-1.5 text-sm rounded-full " + (tab === v ? "gradient-violet text-white" : "text-mist")}>
            {t.admin[v]}
          </button>
        ))}
        <button onClick={newPost} className="px-4 py-1.5 text-sm rounded-full text-amethyst-glow">+ {t.admin.newPost}</button>
      </nav>

      {tab === "overview" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Stat label={t.admin.totalPosts} value={totals.total} />
          <Stat label={t.admin.published} value={totals.published} />
          <Stat label={t.admin.drafts} value={totals.drafts} />
          <Stat label={t.admin.views} value={totals.views} accent />
        </div>
      )}

      {tab === "posts" && (
        <div className="crystal-card p-4">
          {posts.length === 0 ? (
            <div className="p-8 text-center text-mist">{t.admin.noPosts}</div>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-mist font-mono text-xs uppercase">
                <tr><th className="text-start py-2">{t.admin.slug}</th><th>{t.admin.lang}</th><th>{t.admin.status}</th><th>{t.admin.views}</th><th></th></tr>
              </thead>
              <tbody>
                {posts.map((p) => (
                  <tr key={p.id} className="border-t border-border/40">
                    <td className="py-2"><div className="font-medium">{p.title}</div><div className="text-xs text-mist font-mono">/{p.slug}</div></td>
                    <td className="text-center font-mono">{p.lang}</td>
                    <td className="text-center"><span className={"text-xs px-2 py-0.5 rounded-full " + (p.status === "published" ? "bg-success-mint/20 text-success-mint" : "bg-warning-amber/20 text-warning-amber")}>{p.status}</span></td>
                    <td className="text-center font-mono">{p.views}</td>
                    <td className="text-end"><button onClick={() => { setEditing(p); setTab("editor"); }} className="text-amethyst-glow text-xs">{t.admin.edit}</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "editor" && editing && (
        <PostEditor
          post={editing}
          onCancel={() => { setEditing(null); setTab("posts"); }}
          onSaved={async () => { await load(); setEditing(null); setTab("posts"); }}
        />
      )}
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="crystal-card p-5">
      <div className="text-[10px] font-mono uppercase tracking-widest text-mist">{label}</div>
      <div className={"font-display text-4xl mt-2 " + (accent ? "gradient-text" : "")}>{value}</div>
    </div>
  );
}

function PostEditor({ post, onCancel, onSaved }: { post: Post; onCancel: () => void; onSaved: () => void }) {
  const { t } = useI18n();
  const [p, setP] = useState(post);
  const [saving, setSaving] = useState(false);

  const set = (patch: Partial<Post>) => setP((old) => ({ ...old, ...patch }));

  const autoSlug = () => {
    const s = p.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
    set({ slug: s || p.slug });
  };

  const save = async (status?: "draft" | "published") => {
    setSaving(true);
    const reading = Math.max(1, Math.round(p.content.split(/\s+/).length / 220));
    const payload = {
      ...p,
      status: status || p.status,
      published_at: status === "published" && !p.published_at ? new Date().toISOString() : p.published_at,
      reading_minutes: reading,
    };
    if (!payload.slug) payload.slug = "post-" + Date.now();
    if (p.id) {
      await supabase.from("posts").update(payload).eq("id", p.id);
    } else {
      const { id: _drop, ...insertPayload } = payload;
      await supabase.from("posts").insert(insertPayload);
    }
    setSaving(false);
    onSaved();
  };

  const del = async () => {
    if (!p.id || !confirm(t.admin.confirmDelete)) return;
    await supabase.from("posts").delete().eq("id", p.id);
    onSaved();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <div className="crystal-card p-6 space-y-3">
        <div className="flex items-center gap-2">
          <button onClick={onCancel} className="text-xs text-mist">← Back</button>
          <span className="flex-1" />
          <select value={p.lang} onChange={(e) => set({ lang: e.target.value })} className="rounded bg-void/60 border border-border px-2 py-1 text-xs font-mono">
            <option value="en">EN</option><option value="fr">FR</option><option value="ar">AR</option>
          </select>
        </div>
        <F label="Title" v={p.title} on={(v) => set({ title: v })} onBlur={autoSlug} />
        <F label={t.admin.slug} v={p.slug} on={(v) => set({ slug: v })} mono />
        <F label={t.admin.excerpt} v={p.excerpt} on={(v) => set({ excerpt: v })} area rows={2} />
        <F label={t.admin.content} v={p.content} on={(v) => set({ content: v })} area rows={16} mono />
        <F label={t.admin.cover} v={p.cover_image_url || ""} on={(v) => set({ cover_image_url: v || null })} />
      </div>
      <div className="space-y-4">
        <div className="crystal-card p-6 space-y-3">
          <div className="text-xs font-mono uppercase tracking-widest text-mist">SEO</div>
          <F label={t.admin.metaTitle} v={p.meta_title || ""} on={(v) => set({ meta_title: v || null })} />
          <F label={t.admin.metaDescription} v={p.meta_description || ""} on={(v) => set({ meta_description: v || null })} area rows={3} />
          <F label={t.admin.keywords} v={p.keywords.join(", ")} on={(v) => set({ keywords: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
        </div>
        <div className="crystal-card p-6 space-y-2">
          <div className="text-xs font-mono uppercase tracking-widest text-mist">{t.admin.status}: <span className={p.status === "published" ? "text-success-mint" : "text-warning-amber"}>{p.status}</span></div>
          <button disabled={saving} onClick={() => save("draft")} className="w-full border border-border rounded-full py-2 text-sm">{t.admin.save}</button>
          <button disabled={saving} onClick={() => save("published")} className="w-full gradient-violet text-white rounded-full py-2 text-sm">{t.admin.publish}</button>
          {p.status === "published" && <button disabled={saving} onClick={() => save("draft")} className="w-full border border-border rounded-full py-2 text-sm">{t.admin.unpublish}</button>}
          {p.id && <button disabled={saving} onClick={del} className="w-full border border-danger-rose/40 text-danger-rose rounded-full py-2 text-sm">{t.admin.delete}</button>}
        </div>
      </div>
    </div>
  );
}
function F({ label, v, on, area, rows, mono, onBlur }: { label: string; v: string; on: (s: string) => void; area?: boolean; rows?: number; mono?: boolean; onBlur?: () => void }) {
  const C = area ? "textarea" : "input";
  return (
    <label className="block">
      <div className="text-xs uppercase tracking-widest text-mist font-mono mb-1">{label}</div>
      <C value={v} onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => on(e.target.value)} onBlur={onBlur} rows={rows}
        className={"w-full rounded-lg bg-void/60 border border-border px-3 py-2 text-sm outline-none focus:border-amethyst-glow " + (mono ? "font-mono" : "")} />
    </label>
  );
}
