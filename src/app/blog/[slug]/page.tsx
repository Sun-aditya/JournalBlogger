"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { supabase } from "@/lib/supabase/client";

type Post = { title: string; excerpt: string | null; content_text: string; cover_image_url: string | null; published_at: string; category: { name: string } | null };

export default function PostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!params.slug) return; supabase.from("posts").select("title, excerpt, content_text, cover_image_url, published_at, category:categories(name)").eq("slug", params.slug).eq("status", "published").single().then(({ data }) => { setPost(data as unknown as Post | null); setLoading(false); }); }, [params.slug]);
  if (loading) return <main className="code-journal"><SiteHeader current="blog" /><div className="post-reading">Loading entry…</div></main>;
  if (!post) return <main className="code-journal"><SiteHeader current="blog" /><div className="post-reading"><p className="code-kicker">Not found</p><h1>This entry isn&apos;t available.</h1><Link href="/blog">Back to the journal →</Link></div></main>;
  return <main className="code-journal"><SiteHeader current="blog" /><article className="post-reading"><p className="code-kicker">{post.category?.name || "Engineering notes"}</p><h1>{post.title}</h1><p className="post-date">{new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(new Date(post.published_at))}</p>{post.cover_image_url && <img className="post-cover" src={post.cover_image_url} alt="" />}{post.excerpt && <p className="post-excerpt">{post.excerpt}</p>}<div className="post-body">{post.content_text.split(/\n{2,}/).map((block, index) => { const image = block.trim().match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/); return image ? <figure className="post-inline-image" key={index}><img src={image[2]} alt={image[1]} /></figure> : <p key={index}>{block}</p>; })}</div><Link href="/blog" className="post-back">← Back to the journal</Link></article></main>;
}
