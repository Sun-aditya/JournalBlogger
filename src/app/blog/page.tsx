"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const articles = [
  { title: "Building RepoJet: a CLI that reads a repository first", tag: "devtools", date: "Aug 01, 2026", read: "6 min", excerpt: "A look at the thinking behind a Go CLI that scans repositories, detects project files, and helps prepare a codebase to run — before you touch a single line of setup docs.", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1500&q=85" },
  { title: "What I learned while designing BinMap", tag: "fullstack", date: "Jul 29, 2026", read: "4 min", excerpt: "Notes from bringing interactive maps, location data, Supabase, and a useful admin workflow into one project.", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=700&q=85" },
  { title: "Learning backend systems by building", tag: "backend", date: "Jul 24, 2026", read: "7 min", excerpt: "Auth, relational data modelling, and APIs — the parts of backend work tutorials often skip over.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=700&q=85" },
  { title: "Notes on Docker, Compose, and local environments", tag: "devops", date: "Jul 18, 2026", read: "5 min", excerpt: "What containerizing projects taught me about dependencies, repeatable setups, and software that travels well.", image: "https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=700&q=85" },
  { title: "A practical routine for DSA with Java", tag: "dsa", date: "Jul 12, 2026", read: "8 min", excerpt: "The pattern-recognition system I use for hard-level problems, and why tracing examples by hand still beats reading solutions.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=85" }
];
const filters = ["all", "devtools", "backend", "devops", "dsa"];

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const visible = useMemo(() => activeFilter === "all" ? articles : articles.filter((article) => article.tag === activeFilter), [activeFilter]);
  const [featured, ...remaining] = visible;
  return <main className="code-journal"><SiteHeader current="blog" /><div className="code-journal-inner"><section className="code-intro"><p className="code-kicker">The engineering journal</p><h1>Things I&apos;m building,<br />learning, and<br /><em>debugging.</em></h1><p>Notes from projects, DSA grinds, and everything in between — mostly written the same day it happened.</p></section><div className="filter-row" aria-label="Filter posts">{filters.map((filter) => <button key={filter} onClick={() => setActiveFilter(filter)} className={activeFilter === filter ? "active" : ""}>--{filter === "all" ? "all" : `tag=${filter}`}</button>)}</div>{featured ? <><article className="featured-entry" key={featured.title}><div className="featured-image"><img src={featured.image} alt="" /></div><div className="featured-copy"><span className="featured-badge">Featured</span><h2>{featured.title}</h2><p>{featured.excerpt}</p><div className="entry-meta"><time>{featured.date}</time><span>·</span><span>{featured.read} read</span><span>·</span><button>Read entry →</button></div></div></article><section className="compact-entries" aria-label="More blog posts">{remaining.map((article, index) => <article className="compact-entry" key={article.title}><span className="entry-number">{String(index + 2).padStart(2, "0")}</span><img src={article.image} alt="" /><div><h2>{article.title}</h2><p>{article.excerpt}</p><div className="entry-meta"><span className="tag-pill">{article.tag}</span><time>{article.date}</time><span>·</span><span>{article.read}</span></div></div></article>)}</section></> : <div className="no-entries"><p>No posts under this tag yet.</p><button onClick={() => setActiveFilter("all")}>--all</button></div>}</div><footer className="journal-footer"><Link href="/" className="notes-brand">field<span>.notes</span></Link><p>Built with curiosity. © 2026 Aditya Kumar Maurya</p><Link href="/#contact">Get in touch →</Link></footer></main>;
}
