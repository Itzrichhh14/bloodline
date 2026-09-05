"use server";

import { adminSession, writeAudit } from "@/lib/admin";
import { db } from "@/lib/db";
import { slugify } from "@/lib/utils";
import { formDataObject, newsSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

function refreshNews() {
  revalidatePath("/admin/news");
  revalidatePath("/news");
}

export async function saveNews(form: FormData) {
  const session = await adminSession();
  const parsed = newsSchema.safeParse(formDataObject(form, ["title", "excerpt", "content"]));
  if (!session || !parsed.success) return;
  const id = String(form.get("id") ?? "");
  const status = form.get("status") === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
  const data = { ...parsed.data, status, publishedAt: status === "PUBLISHED" ? new Date() : null } as const;
  const news = id ? await db.news.update({ where: { id }, data }) : await db.news.create({ data: { ...data, slug: `${slugify(parsed.data.title)}-${Date.now().toString(36)}`, authorId: session.user.id } });
  await writeAudit(session.user.id, id ? "NEWS_UPDATED" : "NEWS_CREATED", news.id, { status });
  refreshNews();
}

export async function deleteNews(form: FormData) {
  const session = await adminSession();
  if (!session) return;
  const id = String(form.get("id") ?? "");
  await db.news.delete({ where: { id } });
  await writeAudit(session.user.id, "NEWS_DELETED", id);
  refreshNews();
}
