"use client";

import Link from "next/link";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/language-switcher";

type Labels = { about: string; roster: string; rankings: string; matches: string; intel: string; menu: string };

export function MobileNav({ labels, locale }: { labels: Labels; locale: "en" | "es" }) {
  const [open, setOpen] = useState(false);
  const links = [["/about", labels.about], ["/members", labels.roster], ["/rankings", labels.rankings], ["/matches", labels.matches], ["/news", labels.intel]];
  return <div className="lg:hidden"><div className="flex items-center gap-2"><LanguageSwitcher locale={locale}/><button type="button" aria-expanded={open} aria-label={labels.menu} onClick={() => setOpen(!open)} className="grid h-9 w-9 place-items-center rounded-lg border border-white/15 text-zinc-300 hover:border-[#c8f451] hover:text-white"><span className="sr-only">{labels.menu}</span><span className="grid gap-1">{[0,1,2].map(line=><i key={line} className={`block h-0.5 w-4 bg-current transition ${open && line===0 ? "translate-y-1.5 rotate-45" : ""} ${open && line===2 ? "-translate-y-1.5 -rotate-45" : ""} ${open && line===1 ? "opacity-0" : ""}`}/>)}</span></button></div>{open&&<nav className="absolute inset-x-0 top-full border-b border-white/10 bg-[#0b0d12]/[.98] p-4 shadow-2xl"><div className="mx-auto grid max-w-7xl gap-1">{links.map(([href,label])=><Link key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-black uppercase tracking-wider text-zinc-300 hover:bg-white/10 hover:text-[#c8f451]">{label}</Link>)}</div></nav>}</div>;
}
