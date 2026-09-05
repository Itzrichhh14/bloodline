"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { formDataObject, profileUpdateSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

export async function updateProfile(form: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.active === false) return;
  const parsed = profileUpdateSchema.safeParse(formDataObject(form, ["bio", "robloxName"]));
  if (!parsed.success) return;
  await db.user.update({ where: { id: session.user.id }, data: parsed.data });
  revalidatePath("/profile");
}
