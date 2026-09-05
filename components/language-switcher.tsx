"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher({ locale }: { locale: "en" | "es" }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function change(nextLocale: "en" | "es") {
    document.cookie = `bloodline-locale=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
    startTransition(() => router.refresh());
  }
  return <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/[.03] p-1 text-[10px] font-black uppercase tracking-widest" aria-label="Language"><button type="button" aria-pressed={locale === "es"} disabled={pending} onClick={() => change("es")} className={`rounded-md px-2 py-1 transition ${locale === "es" ? "bg-[#c8f451] text-[#081008]" : "text-zinc-500 hover:text-white"}`}>ES</button><button type="button" aria-pressed={locale === "en"} disabled={pending} onClick={() => change("en")} className={`rounded-md px-2 py-1 transition ${locale === "en" ? "bg-[#c8f451] text-[#081008]" : "text-zinc-500 hover:text-white"}`}>EN</button></div>;
}
