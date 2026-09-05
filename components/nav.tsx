import Link from "next/link";
import { auth } from "@/lib/auth";
import { getLocale, getTranslations } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";

export async function Nav() {
  const [session, locale] = await Promise.all([auth(), getLocale()]);
  const t = getTranslations(locale).nav;
  return <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08090d]/90 backdrop-blur-xl"><div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5"><Link href="/" className="group flex items-center gap-3"><span className="grid h-9 w-9 skew-x-[-8deg] place-items-center bg-[#ed3044] text-lg font-black text-white shadow-[4px_4px_0_#c8f451]">B</span><span className="font-black tracking-[.18em]">BLOODLINE</span></Link><nav className="hidden items-center gap-6 text-xs font-black uppercase tracking-wider text-zinc-400 lg:flex"><Link href="/about" className="hover:text-white">{t.about}</Link><Link href="/members" className="hover:text-white">{t.roster}</Link><Link href="/rankings" className="hover:text-white">{t.rankings}</Link><Link href="/matches" className="hover:text-white">{t.matches}</Link><Link href="/news" className="hover:text-white">{t.intel}</Link></nav><div className="flex items-center gap-2"><div className="hidden lg:block"><LanguageSwitcher locale={locale}/></div>{session?.user?.discordId?<Link href={session.user.role==="ADMIN"?"/admin":session.user.id?"/profile":"/register"} className="rounded-lg border border-white/15 px-3 py-2 text-xs font-black uppercase tracking-wide hover:border-[#c8f451]">{session.user.id?t.dashboard:t.finish}</Link>:<Link href="/login" className="hidden rounded-lg bg-[#c8f451] px-4 py-2 text-xs font-black uppercase tracking-wide text-[#081008] hover:bg-white sm:block">{t.join}</Link>}<MobileNav labels={t} locale={locale}/></div></div></header>;
}
