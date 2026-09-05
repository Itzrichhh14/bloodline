import { cookies } from "next/headers";

export type Locale = "en" | "es";

export const translations = {
  en: {
    nav: { about: "About", roster: "Roster", rankings: "Rankings", matches: "Matches", intel: "Intel", join: "Join clan", dashboard: "Dashboard", finish: "Finish profile", menu: "Menu" },
    home: { eyebrow: "Roblox / Time Bomb Duels / Season 01", titleOne: "NO SAFE", titleTwo: "PLAYS.", intro: "Bloodline is a competitive clan built for players who turn pressure into performance. Enter the roster, climb the tiers and leave a mark.", enter: "Enter the clan", matchLog: "View match log", active: "active members", top: "top points", recent: "recent verified", live: "Live intel", activeSeason: "Season active", threat: "Current threat level", pulse: "The season is moving fast. Every verified duel changes the board.", recentMatches: "Recent matches", board: "Open board", hierarchy: "The hierarchy", pace: "Who is setting the pace?", leaderboard: "Full leaderboard", verified: "Verified activity", clashes: "Recent clashes.", noRumours: "No rumours. No inflated stats. Only results reviewed by the Bloodline admin team.", results: "See every result", transmission: "Clan transmission", intel: "Latest intel.", newsroom: "Open newsroom", move: "Your move", pressure: "Pressure makes the roster.", join: "Join Bloodline" },
    common: { verified: "Verified", defeated: "defeated", season: "Season 01" },
  },
  es: {
    nav: { about: "Clan", roster: "Roster", rankings: "Rankings", matches: "Partidas", intel: "Noticias", join: "Unirse al clan", dashboard: "Panel", finish: "Completar perfil", menu: "Menú" },
    home: { eyebrow: "Roblox / Time Bomb Duels / Temporada 01", titleOne: "NINGUNA", titleTwo: "JUGADA ES SEGURA.", intro: "Bloodline es un clan competitivo para jugadores que convierten la presión en rendimiento. Entra al roster, sube de rango y deja huella.", enter: "Entrar al clan", matchLog: "Ver partidas", active: "miembros activos", top: "puntos máximos", recent: "partidas verificadas", live: "Intel en directo", activeSeason: "Temporada activa", threat: "Nivel de amenaza", pulse: "La temporada avanza rápido. Cada duelo verificado cambia el tablero.", recentMatches: "Partidas recientes", board: "Abrir tablero", hierarchy: "La jerarquía", pace: "¿Quién está marcando el ritmo?", leaderboard: "Ranking completo", verified: "Actividad verificada", clashes: "Choques recientes.", noRumours: "Sin rumores. Sin estadísticas infladas. Solo resultados revisados por el equipo de administración.", results: "Ver todos los resultados", transmission: "Transmisión del clan", intel: "Últimas noticias.", newsroom: "Abrir newsroom", move: "Tu movimiento", pressure: "La presión forja el roster.", join: "Unirse a Bloodline" },
    common: { verified: "Verificado", defeated: "derrotó a", season: "Temporada 01" },
  },
} as const;

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get("bloodline-locale")?.value;
  return value === "es" ? "es" : "en";
}

export function getTranslations(locale: Locale) {
  return translations[locale];
}
