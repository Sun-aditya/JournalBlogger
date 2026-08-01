"use client";

import Link from "next/link";

const posts = [
  { title: "Building RepoJet", category: "Developer tools", image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?auto=format&fit=crop&w=900&q=85" },
  { title: "Notes on backend systems", category: "Engineering", image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=85" },
  { title: "Learning through problem solving", category: "DSA", image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=85" },
  { title: "Making BinMap", category: "Full stack", image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=900&q=85" }
];

function Arrow() { return <span aria-hidden="true" className="arrow">&rarr;</span>; }

export default function Home() {
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <main>
      <section className="hero" id="home">
        <nav className="nav" aria-label="Main navigation">
          <button className="brand" onClick={() => scrollTo("home")} aria-label="Back to home">Aditya</button>
          <div className="navlinks"><button onClick={() => scrollTo("home")}>Home</button><Link href="/blog">Blog</Link><button onClick={() => scrollTo("about")}>About</button><button onClick={() => scrollTo("contact")}>Contact</button></div>
        </nav>
        <div className="hero-copy reveal"><p className="eyebrow light">Software engineering notes</p><h1>Hi, I&apos;m <em>Aditya</em>.<br />I build things to<br />understand them.</h1></div>
        <p className="hero-note reveal-delay">Developer tools, backend systems, and the problems that make software more interesting.</p>
        <div className="hero-portrait"><img src="https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=1200&q=90" alt="Laptop on a developer's desk" /></div>
      </section>

      <section className="latest section" id="latest">
        <div className="section-heading"><div><p className="eyebrow">Build log</p><h2>Latest Blog Posts</h2></div><Link href="/blog" className="text-link">View all <Arrow /></Link></div>
        <div className="post-grid">{posts.map((post) => <Link href="/blog" className="post-card" key={post.title}><div className="post-image"><img src={post.image} alt="" /></div><p className="post-category">{post.category}</p><h3>{post.title}</h3><p className="post-summary">Notes from projects, systems I&apos;m exploring, and lessons from building.</p><span className="read-more">Read more <Arrow /></span></Link>)}</div>
      </section>

      <section className="about section" id="about">
        <div className="about-content"><p className="eyebrow">About me</p><h2>I&apos;m a Computer Science student who likes figuring out how software works.</h2><p className="body-copy">I&apos;m Aditya Kumar Maurya, studying Computer Science Engineering at Chitkara University. I learn by building: from Go CLI tools that inspect repositories to full-stack applications with maps, databases, and authentication. Right now, I&apos;m focused on Java, DSA, Go, backend engineering, Docker, and developer experience.</p><button className="outline-btn" onClick={() => scrollTo("contact")}>Let&apos;s connect</button></div>
        <div className="about-photo"><img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=90" alt="Developer working at a laptop" /></div>
      </section>

      <section className="social section" aria-label="Online profiles"><p className="eyebrow">Find me online</p>{["GitHub", "LinkedIn", "LeetCode"].map((item, index) => <a href="#" onClick={(e) => e.preventDefault()} key={item}><span>0{index + 1}</span><strong>{item}</strong><small>Visit <Arrow /></small></a>)}</section>
      <section className="contact" id="contact"><div className="contact-inner"><div><p className="eyebrow light">Let&apos;s talk</p><h2>Have an idea to build?</h2><p>I&apos;m always interested in thoughtful conversations about software, developer tools, and interesting engineering problems.</p></div><a className="white-btn" href="mailto:hello@example.com">Get in touch <Arrow /></a></div></section>
      <footer><span className="brand">Aditya</span><div><button onClick={() => scrollTo("home")}>Home</button><Link href="/blog">Blog</Link><button onClick={() => scrollTo("about")}>About</button><button onClick={() => scrollTo("contact")}>Contact</button></div><p>&copy; 2026 Aditya Kumar Maurya</p></footer>
    </main>
  );
}
