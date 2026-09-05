"use server";
import { db } from "@/lib/db";
import { adminSession, writeAudit } from "@/lib/admin";
import { rankForPoints } from "@/lib/utils";
import { formDataObject, userUpdateSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function updateUser(form: FormData) {
	const session = await adminSession();
	if (!session) return;
	const input = { ...formDataObject(form, ["id", "username", "role", "points", "wins", "losses"]), active: form.get("active") === "on" };
	const parsed = userUpdateSchema.safeParse(input);
	if (!parsed.success || parsed.data.id === session.user.id && (!parsed.data.active || parsed.data.role !== "ADMIN")) return;
	const ranks = await db.ranking.findMany({ select: { name: true, points: true } });
	const { id, ...data } = parsed.data;
	const user = await db.user.update({ where: { id }, data: { ...data, rank: rankForPoints(data.points, ranks) } });
	await writeAudit(session.user.id, "USER_UPDATED", user.id, { role: user.role, points: user.points, active: user.active });
	revalidatePath("/admin/users");
	revalidatePath("/members");
	revalidatePath("/rankings");
}
