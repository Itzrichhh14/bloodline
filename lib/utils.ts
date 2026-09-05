import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }
export function siteUrl(path="") { return `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}${path}`; }
export function slugify(input:string) { return input.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,""); }
export function inviteCode() { return crypto.randomUUID().replace(/-/g,"").slice(0,10).toUpperCase(); }
export function rankForPoints(points:number, ranks:{name:string;points:number}[]) { return [...ranks].sort((a,b)=>b.points-a.points).find(r=>points>=r.points)?.name ?? "Recruit"; }
