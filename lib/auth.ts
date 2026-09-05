import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { db } from "@/lib/db";

const adminIds = () => (process.env.ADMIN_DISCORD_IDS ?? "").split(",").map(x=>x.trim()).filter(Boolean);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET,
  providers: [Discord({ clientId: process.env.DISCORD_CLIENT_ID, clientSecret: process.env.DISCORD_CLIENT_SECRET })],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider !== "discord" || !account.providerAccountId) return false;
      const discordId = account.providerAccountId;
      const existing = await db.user.findUnique({ where: { discordId } });
      if (existing) {
        if (existing.active) await db.user.update({ where: { id: existing.id }, data: { lastLoginAt: new Date() } });
        return existing.active;
      }
      if (adminIds().includes(discordId)) {
        await db.user.create({ data: { discordId, username: String(profile?.username ?? profile?.global_name ?? `admin-${discordId}`), displayName: String(profile?.global_name ?? profile?.username ?? "Admin"), avatarUrl: profile?.image ? String(profile.image) : null, role: "ADMIN", lastLoginAt: new Date() } });
        return true;
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account?.providerAccountId) token.discordId = account.providerAccountId;
      if (token.discordId) {
        const u = await db.user.findUnique({ where:{discordId:String(token.discordId)}, select:{id:true,role:true,active:true,username:true,displayName:true,avatarUrl:true} });
        if (u) Object.assign(token,{userId:u.id,role:u.role,active:u.active,username:u.username,displayName:u.displayName,avatarUrl:u.avatarUrl});
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) Object.assign(session.user,{id:String(token.userId ?? ""),discordId:String(token.discordId ?? ""),role:token.role,active:token.active,username:token.username,displayName:token.displayName,avatarUrl:token.avatarUrl});
      return session;
    }
  },
  pages: { signIn: "/login" }
});
