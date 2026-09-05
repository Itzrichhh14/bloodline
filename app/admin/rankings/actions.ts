"use server";
import { db } from "@/lib/db";
import { adminSession, writeAudit } from "@/lib/admin";
import { formDataObject, rankingUpdateSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function saveRank(form: FormData) {
	const session = await adminSession();
	const parsed = rankingUpdateSchema.safeParse(formDataObject(form, ["id", "name", "slug", "points"]));
	if (!session || !parsed.success) return;
	const { id, ...data } = parsed.data;
	const rank = await db.ranking.update({ where: { id }, data });
	const ranks = await db.ranking.findMany({ orderBy: { points: "desc" } });
	for (const [index, tier] of ranks.entries()) await db.ranking.update({ where: { id: tier.id }, data: { tier: ranks.length - index } });
	const users = await db.user.findMany({ select: { id: true, points: true }, where: { active: true } });
	for (const user of users) {
		const current = ranks.find((item) => user.points >= item.points)?.name ?? "Recruit";
		await db.user.update({ where: { id: user.id }, data: { rank: current } });
	}
	await writeAudit(session.user.id, "RANK_UPDATED", rank.id, { name: rank.name, points: rank.points });
	revalidatePath("/admin/rankings"); revalidatePath("/members"); revalidatePath("/rankings");
}
