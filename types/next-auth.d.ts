import "next-auth";
declare module "next-auth" { interface Session { user: { id:string; discordId:string; role:"MEMBER"|"MODERATOR"|"ADMIN"; active:boolean; username:string; displayName?:string|null; avatarUrl?:string|null } & Session["user"] } }
declare module "next-auth/jwt" { interface JWT { discordId?:string; userId?:string; role?:string; active?:boolean; username?:string; displayName?:string|null; avatarUrl?:string|null } }
