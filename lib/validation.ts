import { z } from "zod";

export const userUpdateSchema = z.object({
  id: z.string().min(1),
  username: z.string().trim().min(2).max(32),
  role: z.enum(["MEMBER", "MODERATOR", "ADMIN"]),
  points: z.coerce.number().int().min(0).max(1_000_000),
  wins: z.coerce.number().int().min(0).max(1_000_000),
  losses: z.coerce.number().int().min(0).max(1_000_000),
  active: z.boolean(),
});

export const rankingUpdateSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(2).max(40),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).max(50),
  points: z.coerce.number().int().min(0).max(1_000_000),
});

export const profileUpdateSchema = z.object({
  bio: z.string().trim().max(280),
  robloxName: z.string().trim().max(32),
});

export const newsSchema = z.object({
  title: z.string().trim().min(3).max(120),
  excerpt: z.string().trim().min(10).max(240),
  content: z.string().trim().min(20).max(20_000),
});

export const matchSchema = z.object({
  playerOneId: z.string().min(1),
  playerTwoId: z.string().min(1),
  winnerId: z.string().min(1),
  mode: z.string().trim().min(2).max(40),
  note: z.string().trim().max(280),
  playedAt: z.coerce.date(),
}).refine((value) => value.playerOneId !== value.playerTwoId, { message: "Players must be different" })
  .refine((value) => value.winnerId === value.playerOneId || value.winnerId === value.playerTwoId, { message: "Winner must be a player" });

export function formDataObject(form: FormData, keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, form.get(key) ?? ""]));
}
