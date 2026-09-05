import type { Metadata } from "next";
import "./globals.css";
import { Nav } from "@/components/nav";
import { getLocale } from "@/lib/i18n";
export const metadata: Metadata = { metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"), title:{default:"Bloodline — Time Bomb Duels Clan",template:"%s — Bloodline"}, description:"Bloodline is a competitive Roblox clan built around Time Bomb Duels.", openGraph:{title:"Bloodline — Time Bomb Duels Clan",description:"Competitive Roblox clan. Find members, rankings, news and Discord."}, robots:{index:true,follow:true} };
export default async function RootLayout({children}:{children:React.ReactNode}){const locale=await getLocale();return <html lang={locale}><body><Nav/>{children}</body></html>}
