import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/db";
import { Card } from "@/components/ui";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Roster", description: "Bloodline clan member roster." };
export const revalidate = 30;

export default async function Members() {
  const users = await db.user.findMany({ where: { active: true }, orderBy: [{ points: "desc" }, { username: "asc" }], select: { id: true, username: true, displayName: true, rank: true, points: true, wins: true, losses: true, avatarUrl: true } });
  return <main className="mx-auto max-w-7xl px-5 py-16 lg:py-24"><div className="flex flex-col justify-between gap-6 border-b border-white/10 pb-10 lg:flex-row lg:items-end"><div><p className="eyebrow">Bloodline / active roster</p><h1 className="mt-3 text-5xl font-black tracking-tight sm:text-7xl">The operators.</h1><p className="mt-5 max-w-xl text-zinc-400">Meet the players carrying the tag into every duel.</p></div><div className="text-sm font-black uppercase tracking-wider text-zinc-500"><span className="text-2xl text-white">{users.length}</span> active</div></div><div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{users.length===0?<Card className="p-8 text-zinc-400 sm:col-span-2 lg:col-span-3">The roster is being assembled. Join Discord to become part of Bloodline.</Card>:users.map((user,index)=><Link key={user.id} href={`/members/${user.id}`} className="group"><Card className="relative h-full overflow-hidden p-5 transition duration-200 group-hover:-translate-y-1 group-hover:border-[#c8f451]/50"><div className="absolute right-5 top-5 text-3xl font-black text-white/10">{String(index+1).padStart(2,"0")}</div><div className="flex items-center gap-4"><div className="relative h-14 w-14 overflow-hidden rounded-xl border border-white/10 bg-[#151a23]">{user.avatarUrl&&<Image src={user.avatarUrl} alt="" fill sizes="56px" className="object-cover"/>}</div><div className="min-w-0"><div className="truncate text-lg font-black">{user.displayName??user.username}</div><div className="text-xs text-zinc-500">@{user.username}</div></div></div><div className="mt-8 flex items-end justify-between border-t border-white/10 pt-4"><div><div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Tier</div><div className="mt-1 font-bold text-[#c8f451]">{user.rank}</div></div><div className="text-right"><div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Points</div><div className="mt-1 text-2xl font-black">{user.points}</div></div></div></Card></Link>)}</div></main>;
}
