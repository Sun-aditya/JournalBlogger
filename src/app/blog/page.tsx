"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const articles = [
  { title: "Building RepoJet: a CLI that reads a repository first", category: "Developer tools", date: "August 1, 2026", excerpt: "A look at the thinking behind a Go CLI that scans repositories, detects project files, and helps prepare a codebase to run.", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=1500&q=85" },
  { title: "What I learned while designing BinMap", category: "Full stack", date: "July 21, 2026", excerpt: "Mapping public waste bins meant bringing together location data, an interactive map, authentication, and a practical admin workflow.", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1500&q=85" },
  { title: "Learning backend systems by building", category: "Backend", date: "July 8, 2026", excerpt: "Why I prefer learning databases, APIs, and system design through projects that have real constraints and moving parts.", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1500&q=85" },
  { title: "A practical routine for DSA with Java", category: "Problem solving", date: "June 28, 2026", excerpt: "The fundamentals I keep returning to while practicing arrays, hashing, binary search, recursion, and algorithmic problem solving.", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1500&q=85" }
];

const categories = ["All posts", "Developer tools", "Backend", "DevOps", "Full stack", "Problem solving"];

export default function BlogPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All posts");
  const filteredArticles = useMemo(() => articles.filter((article) => {
    const hasQuery = `${article.title} ${article.category} ${article.excerpt}`.toLowerCase().includes(query.toLowerCase());
    return hasQuery && (activeCategory === "All posts" || article.category === activeCategory);
  }), [query, activeCategory]);

  return <main className="journal-page">
    <header className="journal-header"><Link href="/" className="brand">Aditya</Link><nav aria-label="Main navigation"><Link href="/">Home</Link><Link className="active" href="/blog">Blog</Link><Link href="/#about">About</Link><Link href="/#contact">Contact</Link></nav></header>
    <div className="journal-intro"><p className="eyebrow">The engineering journal</p><h1>Things I&apos;m building,<br />learning, and debugging.</h1></div>
    <div className="journal-layout">
      <section className="article-feed" aria-label="Blog posts">
        {filteredArticles.length ? filteredArticles.map((article, index) => <article className="journal-card" style={{ animationDelay: `${index * 110}ms` }} key={article.title}>
          <div className="journal-image"><img src={article.image} alt="" /></div><p className="post-category">{article.category} <span>/</span> {article.date}</p><h2>{article.title}</h2><p>{article.excerpt}</p><button className="article-link">Read article <span>&rarr;</span></button>
        </article>) : <div className="empty-results"><p className="eyebrow">No match</p><h2>No posts found.</h2><button onClick={() => { setQuery(""); setActiveCategory("All posts"); }}>Clear filters</button></div>}
      </section>
      <aside className="journal-sidebar">
        <label className="search-label" htmlFor="post-search">Search the journal</label><div className="search-box"><input id="post-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search posts" /><span aria-hidden="true">⌕</span></div>
        <div className="sidebar-block"><h3>Recent Posts</h3>{articles.slice(0, 4).map((article) => <button onClick={() => { setQuery(article.title); setActiveCategory("All posts"); }} key={article.title}>{article.title}</button>)}</div>
        <div className="sidebar-block"><h3>Categories</h3>{categories.map((category) => <button className={activeCategory === category ? "selected" : ""} onClick={() => setActiveCategory(category)} key={category}>{category}</button>)}</div>
        <div className="sidebar-block sidebar-note"><p className="eyebrow">Currently exploring</p><p>Go, Java, backend systems, Docker, developer tooling, and open source.</p></div>
      </aside>
    </div>
    <footer className="journal-footer"><Link href="/" className="brand">Aditya</Link><p>Built with curiosity. &copy; 2026 Aditya Kumar Maurya</p><Link href="/#contact">Get in touch &rarr;</Link></footer>
  </main>;
}
