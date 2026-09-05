"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { writeAudit } from "@/lib/admin";
import { rankForPoints } from "@/lib/utils";
import { formDataObject, matchSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function submitMatch(form: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.active === false) return;
  const parsed = matchSchema.safeParse(formDataObject(form, ["playerOneId", "playerTwoId", "winnerId", "mode", "note", "playedAt"]));
  if (!parsed.success) return;
  const { playerOneId, playerTwoId, winnerId, mode, note, playedAt } = parsed.data;
  const players = await db.user.findMany({ where: { id: { in: [playerOneId, playerTwoId] }, active: true }, select: { id: true } });
  if (players.length !== 2 || !players.some((player) => player.id === session.user.id)) return;
  await db.match.create({ data: { playerOneId, playerTwoId, winnerId, mode, note: note || null, playedAt, submitterId: session.user.id } });
  revalidatePath("/matches");
  revalidatePath("/admin/matches");
}

export async function reviewMatch(form: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN" || session.user.active === false) return;
  const id = String(form.get("id") ?? "");
  const decision = form.get("decision") === "APPROVED" ? "APPROVED" : "REJECTED";
  await db.$transaction(async (tx) => {
    const match = await tx.match.findUnique({ where: { id } });
    if (!match || match.status !== "PENDING") return;
    if (decision === "REJECTED") {
      await tx.match.update({ where: { id }, data: { status: "REJECTED" } });
      return;
    }
    const ranks = await tx.ranking.findMany({ select: { name: true, points: true } });
    const winner = await tx.user.update({ where: { id: match.winnerId! }, data: { wins: { increment: 1 }, points: { increment: 20 } } });
    const loserId = match.winnerId === match.playerOneId ? match.playerTwoId : match.playerOneId;
    const loser = await tx.user.update({ where: { id: loserId }, data: { losses: { increment: 1 }, points: { increment: 5 } } });
    await tx.user.update({ where: { id: winner.id }, data: { rank: rankForPoints(winner.points + 20, ranks) } });
    await tx.user.update({ where: { id: loser.id }, data: { rank: rankForPoints(loser.points + 5, ranks) } });
    await tx.match.update({ where: { id }, data: { status: "APPROVED" } });
  });
  await writeAudit(session.user.id, `MATCH_${decision}`, id);
  revalidatePath("/matches"); revalidatePath("/admin/matches"); revalidatePath("/members"); revalidatePath("/rankings");
}