import Image from "next/image";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { Card } from "@/components/ui";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

async function getMember(id: string) {
  return db.user.findFirst({ where: { id, active: true }, select: { username: true, displayName: true, avatarUrl: true, bio: true, robloxName: true, rank: true, points: true, wins: true, losses: true, createdAt: true } });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const member = await getMember((await params).id);
  return member ? { title: member.displayName ?? member.username, description: member.bio ?? `${member.username} is a Bloodline member.` } : {};
}

export default async function MemberProfile({ params }: { params: Promise<{ id: string }> }) {
  const member = await getMember((await params).id);
  if (!member) notFound();
  return <main className="mx-auto max-w-4xl px-5 py-20"><p className="text-sm font-bold text-[#ef3340]">BLOODLINE MEMBER</p><div className="mt-4 flex flex-wrap items-center gap-5"><div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-white/10">{member.avatarUrl&&<Image src={member.avatarUrl} alt="" fill sizes="96px" className="object-cover"/>}</div><div><h1 className="text-4xl font-black">{member.displayName??member.username}</h1><p className="text-zinc-500">@{member.username} • {member.rank}</p></div></div><p className="mt-8 max-w-2xl text-lg leading-8 text-zinc-400">{member.bio||"This member has not added a bio yet."}</p>{member.robloxName&&<p className="mt-4 text-sm text-zinc-500">Roblox: <span className="text-zinc-300">{member.robloxName}</span></p>}<div className="mt-10 grid gap-4 md:grid-cols-3">{[[member.points,"Points"],[member.wins,"Wins"],[member.losses,"Losses"]].map(([value,label])=><Card key={label as string} className="p-6"><div className="text-3xl font-black">{value}</div><div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">{label}</div></Card>)}</div><p className="mt-8 text-sm text-zinc-500">Member since {member.createdAt.toLocaleDateString()}</p></main>;
}
