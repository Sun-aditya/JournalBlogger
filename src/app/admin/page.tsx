"use client";

import { FormEvent, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserEmail(data.session?.user.email ?? null);
      setLoading(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUserEmail(session?.user.email ?? null));
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setLoading(true);
    const result = mode === "sign-in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (result.error) return setMessage(result.error.message);
    if (mode === "sign-up" && !result.data.session) setMessage("Check your email to confirm your account, then sign in.");
  }

  async function signOut() {
    await supabase.auth.signOut();
    setMessage("");
  }

  if (loading && !userEmail) return <main className="admin-page"><p>Loading secure workspace…</p></main>;

  if (userEmail) return <main className="admin-page"><section className="admin-shell"><div className="admin-top"><div><p className="notes-eyebrow">Private workspace</p><h1>Welcome back.</h1><p>Signed in as {userEmail}</p></div><button className="admin-text-button" onClick={signOut}>Sign out</button></div><div className="admin-empty"><p className="notes-eyebrow">Next up</p><h2>Write your first entry.</h2><p>The post editor and Cloudinary image upload workflow are the next pieces we&apos;ll add here.</p></div></section></main>;

  return <main className="admin-page"><section className="auth-card"><a className="notes-brand" href="/">field<span>.notes</span></a><p className="notes-eyebrow">Private admin</p><h1>{mode === "sign-in" ? "Sign in to write." : "Create your author account."}</h1><p className="auth-copy">This space is for publishing your developer notes. Use the email address you want associated with your site.</p><form onSubmit={handleSubmit}><label>Email<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required /></label><label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete={mode === "sign-in" ? "current-password" : "new-password"} minLength={6} required /></label>{message && <p className="auth-message">{message}</p>}<button className="admin-primary" disabled={loading}>{loading ? "Please wait…" : mode === "sign-in" ? "Sign in" : "Create account"}</button></form><button className="admin-text-button" onClick={() => { setMode(mode === "sign-in" ? "sign-up" : "sign-in"); setMessage(""); }}>{mode === "sign-in" ? "Need an account? Create one" : "Already have an account? Sign in"}</button></section></main>;
}
