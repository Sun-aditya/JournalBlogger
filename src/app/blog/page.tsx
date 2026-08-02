"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/lib/supabase/client";

type BlogPost = { id: string; title: string; slug: string; excerpt: string | null; content_text: string; cover_image_url: string | null; published_at: string; category: { name: string; slug: string } | null; isPlaceholder?: boolean };

const fallbackImages = [
  "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1500&q=85",
  "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85"
];

const demoPosts: BlogPost[] = [
  { id: "demo-binmap", title: "What I learned while designing BinMap", slug: "demo-binmap", excerpt: "Notes from bringing interactive maps, location data, Supabase, and a useful admin workflow into one project.", content_text: "", cover_image_url: null, published_at: "2026-07-29T00:00:00.000Z", category: { name: "Full Stack", slug: "full-stack" }, isPlaceholder: true },
  { id: "demo-backend", title: "Learning backend systems by building", slug: "demo-backend", excerpt: "Auth, relational data modelling, and APIs — the parts of backend work tutorials often skip over.", content_text: "", cover_image_url: null, published_at: "2026-07-24T00:00:00.000Z", category: { name: "Backend", slug: "backend" }, isPlaceholder: true },
  { id: "demo-devops", title: "Notes on Docker, Compose, and local environments", slug: "demo-devops", excerpt: "What containerizing projects taught me about dependencies, repeatable setups, and software that travels well.", content_text: "", cover_image_url: null, published_at: "2026-07-18T00:00:00.000Z", category: { name: "DevOps", slug: "devops" }, isPlaceholder: true },
  { id: "demo-dsa", title: "A practical routine for DSA with Java", slug: "demo-dsa", excerpt: "The pattern-recognition system I use for hard-level problems, and why tracing examples by hand still beats reading solutions.", content_text: "", cover_image_url: null, published_at: "2026-07-12T00:00:00.000Z", category: { name: "Problem Solving", slug: "problem-solving" }, isPlaceholder: true }
];

function formatDate(value: string) { return new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(value)); }
function readingTime(post: BlogPost) { return `${Math.max(1, Math.ceil(post.content_text.trim().split(/\s+/).filter(Boolean).length / 220))} min`; }

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [activeFilter, setActiveFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("posts").select("id, title, slug, excerpt, content_text, cover_image_url, published_at, category:categories(name, slug)").eq("status", "published").order("published_at", { ascending: false }).then(({ data, error }) => {
      if (!error) setPosts((data ?? []) as unknown as BlogPost[]);
      setLoading(false);
    });
  }, []);

  const displayPosts = useMemo(() => [...posts, ...demoPosts], [posts]);
  const filters = useMemo(() => ["all", ...Array.from(new Map(displayPosts.filter((post) => post.category).map((post) => [post.category!.slug, post.category!.name])).entries())], [displayPosts]);
  const visible = useMemo(() => activeFilter === "all" ? displayPosts : displayPosts.filter((post) => post.category?.slug === activeFilter), [activeFilter, displayPosts]);
  const [featured, ...remaining] = visible;

  return <main className="code-journal"><SiteHeader current="blog" /><div className="code-journal-inner"><section className="code-intro"><p className="code-kicker">The engineering journal</p><h1>Things I&apos;m building,<br />learning, and<br /><em>debugging.</em></h1><p>Notes from projects, DSA grinds, and everything in between — mostly written the same day it happened.</p></section><div className="filter-row" aria-label="Filter posts">{filters.map((filter) => { const value = Array.isArray(filter) ? filter[0] : filter; const label = Array.isArray(filter) ? filter[1] : "all"; return <button key={value} onClick={() => setActiveFilter(value)} className={activeFilter === value ? "active" : ""}>--{value === "all" ? "all" : `tag=${label.toLowerCase().replace(/\s+/g, "-")}`}</button>; })}</div>{loading ? <div className="no-entries"><p>Loading published notes…</p></div> : featured ? <><article className="featured-entry"><Link href={featured.isPlaceholder ? "/blog" : `/blog/${featured.slug}`} className="featured-image"><img src={featured.cover_image_url ?? fallbackImages[0]} alt="" /></Link><div className="featured-copy"><span className="featured-badge">{featured.isPlaceholder ? "Sample entry" : "Latest entry"}</span><h2><Link href={featured.isPlaceholder ? "/blog" : `/blog/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt || featured.content_text.slice(0, 230) || "A new note is on its way."}</p><div className="entry-meta"><time>{formatDate(featured.published_at)}</time><span>·</span><span>{readingTime(featured)} read</span><span>·</span><Link href={featured.isPlaceholder ? "/blog" : `/blog/${featured.slug}`}>{featured.isPlaceholder ? "Sample entry" : "Read entry →"}</Link></div></div></article><section className="compact-entries" aria-label="More blog posts">{remaining.map((post, index) => <article className="compact-entry" key={post.id}><span className="entry-number">{String(index + 2).padStart(2, "0")}</span><Link href={post.isPlaceholder ? "/blog" : `/blog/${post.slug}`}><img src={post.cover_image_url ?? fallbackImages[(index + 1) % fallbackImages.length]} alt="" /></Link><div><h2><Link href={post.isPlaceholder ? "/blog" : `/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt || post.content_text.slice(0, 170) || "A new note is on its way."}</p><div className="entry-meta"><span className="tag-pill">{post.category?.name || "Notes"}</span><time>{formatDate(post.published_at)}</time><span>·</span><span>{readingTime(post)}</span></div></div></article>)}</section></> : <div className="no-entries"><p>No published posts are available under this filter yet.</p>{activeFilter !== "all" && <button onClick={() => setActiveFilter("all")}>--all</button>}</div>}</div><footer className="journal-footer"><Link href="/" className="notes-brand">field<span>.notes</span></Link><p>Built with curiosity. © 2026 Aditya Kumar Maurya</p><Link href="/#contact">Get in touch →</Link></footer></main>;
}
