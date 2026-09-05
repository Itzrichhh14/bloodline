import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import type { Prisma } from "@prisma/client";

export async function adminSession() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN" || session.user.active !== true) return null;
  return session;
}

export async function writeAudit(userId: string, action: string, target?: string, metadata?: Record<string, unknown>) {
  await db.auditLog.create({ data: { userId, action, target, metadata: metadata as Prisma.InputJsonValue } });
}
