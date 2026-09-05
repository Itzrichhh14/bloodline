import Link from "next/link";
import { db } from "@/lib/db";
import { Card } from "@/components/ui";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Intel", description: "Official Bloodline clan news and announcements." };
export const revalidate = 60;

export default async function News() {
  const posts = await db.news.findMany({ where: { status: "PUBLISHED" }, orderBy: { publishedAt: "desc" }, include: { author: { select: { username: true } } } });
  return <main className="mx-auto max-w-7xl px-5 py-16 lg:py-24"><div className="border-b border-white/10 pb-10"><p className="eyebrow">Clan transmission / newsroom</p><h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">Intel feed.</h1><p className="mt-5 max-w-xl text-zinc-400">Announcements, match reports and signals from inside the clan.</p></div><div className="mt-10 grid gap-3 lg:grid-cols-3">{posts.length===0?<Card className="p-8 lg:col-span-3"><h2 className="text-xl font-bold">Newsroom ready</h2><p className="mt-2 text-zinc-400">The first dispatch will appear here.</p></Card>:posts.map((post,index)=><Link key={post.id} href={`/news/${post.slug}`} className={index===0?"lg:col-span-2":""}><Card className="group h-full min-h-64 p-6 transition hover:-translate-y-1 hover:border-[#ed3044]/50"><div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-500"><span>Dispatch 0{index+1}</span><span>{post.publishedAt?.toLocaleDateString()}</span></div><div className="flex h-full flex-col justify-end pt-20"><h2 className={`${index===0?"text-4xl":"text-2xl"} font-black leading-tight group-hover:text-[#c8f451]`}>{post.title}</h2><p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400">{post.excerpt}</p><div className="mt-6 text-xs font-bold uppercase tracking-widest text-zinc-500">Filed by @{post.author.username}</div></div></Card></Link>)}</div></main>;
}
