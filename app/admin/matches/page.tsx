import { db } from "@/lib/db";
import { Card } from "@/components/ui";
import { reviewMatch } from "@/app/matches/actions";

export const dynamic = "force-dynamic";

export default async function AdminMatches() {
  const matches = await db.match.findMany({ orderBy: { createdAt: "desc" }, take: 100, include: { playerOne: true, playerTwo: true, winner: true, submitter: true } });
  return <div><h1 className="text-4xl font-black">Matches</h1><p className="mt-2 text-zinc-500">Review reported results before they affect the rankings.</p><div className="mt-8 grid gap-3">{matches.length===0?<Card className="p-8 text-zinc-400">No match reports yet.</Card>:matches.map(match=><Card key={match.id} className="flex flex-wrap items-center justify-between gap-4 p-5"><div><b>{match.winner?.displayName??match.winner?.username}</b><span className="mx-2 text-zinc-600">vs</span>{match.winner?.id===match.playerOneId?match.playerTwo.displayName??match.playerTwo.username:match.playerOne.displayName??match.playerOne.username}<div className="mt-1 text-xs text-zinc-500">{match.status} • submitted by {match.submitter.username} • {match.playedAt.toLocaleDateString()}</div></div>{match.status==="PENDING"&&<div className="flex gap-2"><form action={reviewMatch}><input type="hidden" name="id" value={match.id}/><input type="hidden" name="decision" value="APPROVED"/><button className="rounded-lg bg-emerald-500 px-3 py-2 text-xs font-bold text-black">Approve</button></form><form action={reviewMatch}><input type="hidden" name="id" value={match.id}/><input type="hidden" name="decision" value="REJECTED"/><button className="rounded-lg border border-red-400/30 px-3 py-2 text-xs font-bold text-red-300">Reject</button></form></div>}</Card>)}</div></div>;
}