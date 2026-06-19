import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** "há 3 min", "há 2 d" — distância relativa em pt-BR. */
export function formatTimeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNowStrict(d, { addSuffix: true, locale: ptBR });
}

/** Formata números de forma compacta (1.2k, 3.4M). */
export function formatCompactNumber(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

/** Formata um valor em centavos como moeda BRL. */
export function formatCurrency(cents: number, currency = "BRL"): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(cents / 100);
}

/** Gera um slug/username válido a partir de um texto. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Deriva um username a partir do e-mail/nome, garantindo caracteres válidos. */
export function deriveUsername(seed: string): string {
  const base = seed
    .split("@")[0]
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9_]+/g, "")
    .slice(0, 20);
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || "user"}_${suffix}`;
}

/** Extrai hashtags (#tag) de um texto. */
export function extractHashtags(text: string): string[] {
  const matches = text.match(/#([\p{L}0-9_]{2,40})/gu) ?? [];
  return Array.from(
    new Set(matches.map((m) => m.slice(1).toLowerCase())),
  ).slice(0, 10);
}

export function getInitials(name?: string | null): string {
  if (!name) return "N";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}

export function absoluteUrl(path: string): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.AUTH_URL ??
    "http://localhost:3000";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
