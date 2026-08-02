import Link from "next/link";

type SiteHeaderProps = { current: "home" | "blog" };

export function SiteHeader({ current }: SiteHeaderProps) {
  return <header className="notes-header"><Link href="/" className="notes-brand">field<span>.notes</span></Link><nav aria-label="Main navigation"><Link className={current === "home" ? "active" : ""} href="/">Home</Link><Link className={current === "blog" ? "active" : ""} href="/blog">Blog</Link><a href="https://os-portfolio-livid.vercel.app/" target="_blank" rel="noreferrer">Portfolio ↗</a><Link href="/#about">About</Link><Link href="/#contact">Contact</Link></nav></header>;
}
