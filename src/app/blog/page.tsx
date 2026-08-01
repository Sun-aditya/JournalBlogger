import Link from "next/link";

export default function BlogPage() {
  return <main className="blog-placeholder"><Link href="/" className="brand">Aditya</Link><p className="eyebrow">Engineering journal</p><h1>Build notes are coming soon.</h1><p>The full blog page is next. It will cover developer tools, backend systems, problem solving, and the projects I&apos;m building along the way.</p><Link href="/" className="outline-btn">Back home</Link></main>;
}
