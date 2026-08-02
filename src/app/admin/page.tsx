"use client";

import { FormEvent, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";

type Category = { id: string; name: string };
type PostSummary = { id: string; title: string; status: "draft" | "published"; updated_at: string };

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [posts, setPosts] = useState<PostSummary[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setLoading(false); });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("categories").select("id, name").order("name"),
      supabase.from("posts").select("id, title, status, updated_at").eq("author_id", user.id).order("updated_at", { ascending: false })
    ]).then(([categoryResult, postResult]) => {
      setCategories((categoryResult.data ?? []) as Category[]);
      setPosts((postResult.data ?? []) as PostSummary[]);
    });
  }, [user]);

  async function handleAuth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setMessage(""); setLoading(true);
    const result = mode === "sign-in" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (result.error) setMessage(result.error.message);
    else if (mode === "sign-up" && !result.data.session) setMessage("Check your email to confirm your account, then sign in.");
  }

  async function savePost(event: FormEvent<HTMLFormElement>, status: "draft" | "published") {
    event.preventDefault();
    if (!user) return;
    setSaving(true); setMessage("");
    const postSlug = slug || slugify(title);
    const result = await supabase.from("posts").insert({
      author_id: user.id, title, slug: postSlug, excerpt, content_text: content,
      content: { type: "doc", content: [] }, category_id: categoryId || null, status,
      published_at: status === "published" ? new Date().toISOString() : null
    }).select("id, title, status, updated_at").single();
    setSaving(false);
    if (result.error) return setMessage(result.error.message);
    setPosts((current) => [result.data as PostSummary, ...current]);
    setTitle(""); setSlug(""); setExcerpt(""); setContent(""); setCategoryId(""); setIsEditorOpen(false);
    setMessage(status === "published" ? "Post published." : "Draft saved.");
  }

  async function signOut() { await supabase.auth.signOut(); setPosts([]); }

  if (loading && !user) return <main className="admin-page"><p>Loading secure workspace…</p></main>;
  if (!user) return <main className="admin-page"><section className="auth-card"><a className="notes-brand" href="/">field<span>.notes</span></a><p className="notes-eyebrow">Private admin</p><h1>{mode === "sign-in" ? "Sign in to write." : "Create your author account."}</h1><p className="auth-copy">This space is for publishing your developer notes.</p><form onSubmit={handleAuth}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={6} required /></label>{message && <p className="auth-message">{message}</p>}<button className="admin-primary" disabled={loading}>{loading ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}</button></form><button className="admin-text-button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(""); }}>{mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}</button></section></main>;

  return <main className="admin-page"><section className="admin-shell"><div className="admin-top"><div><p className="notes-eyebrow">Private workspace</p><h1>Your build log.</h1><p>Signed in as {user.email}</p></div><button className="admin-text-button" onClick={signOut}>Sign out</button></div>{message && <p className="admin-notice">{message}</p>}<div className="admin-actions"><div><p className="notes-eyebrow">Posts</p><h2>{posts.length ? `${posts.length} entries` : "No entries yet"}</h2></div><button className="admin-primary admin-new-post" onClick={() => setIsEditorOpen(!isEditorOpen)}>{isEditorOpen ? "Close editor" : "New post"}</button></div>{isEditorOpen && <form className="post-editor" onSubmit={(event) => savePost(event, "draft")}><label>Title<input value={title} onChange={(event) => { setTitle(event.target.value); if (!slug) setSlug(slugify(event.target.value)); }} required /></label><label>URL slug<input value={slug} onChange={(event) => setSlug(slugify(event.target.value))} required /></label><label>Category<select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}><option value="">No category yet</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label>Short summary<textarea value={excerpt} onChange={(event) => setExcerpt(event.target.value)} rows={3} /></label><label>Post content<textarea value={content} onChange={(event) => setContent(event.target.value)} rows={13} placeholder="Write your post here. The rich editor and image uploads will be added next." required /></label><div className="editor-buttons"><button className="admin-text-button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save draft"}</button><button className="admin-primary" type="button" disabled={saving} onClick={(event) => savePost(event as unknown as FormEvent<HTMLFormElement>, "published")}>{saving ? "Publishing…" : "Publish now"}</button></div></form>}<div className="admin-post-list">{posts.map((post) => <article key={post.id}><span className={post.status}>{post.status}</span><div><h3>{post.title}</h3><p>Updated {new Date(post.updated_at).toLocaleDateString()}</p></div></article>)}</div></section></main>;
}
