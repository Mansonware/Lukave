/**
 * Cache Layer — Upstash Redis
 *
 * Camada de cache tipada para feed, trending e estatísticas.
 * Usa o mesmo Redis já configurado para rate limiting.
 * Degrada silenciosamente se UPSTASH_REDIS_REST_URL não estiver definido.
 *
 * Chaves de cache definidas:
 *   feed:home:{userId}    — feed paginado do usuário (30s TTL)
 *   trending:posts        — posts em alta (5min TTL)
 *   trending:videos       — vídeos em alta (5min TTL)
 *   post:stats:{postId}   — contadores de um post (60s TTL)
 */

import { Redis } from "@upstash/redis";

let _redis: Redis | null = null;

function getRedis(): Redis | null {
  if (_redis) return _redis;
  if (
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  ) {
    _redis = Redis.fromEnv();
  }
  return _redis;
}

export const CACHE_TTL = {
  FEED: 30,       // 30s — feed muda com frequência
  TRENDING: 300,  // 5min — trending é mais estável
  POST_STATS: 60, // 1min — likes/views/comentários
} as const;

// ── Tipos de chave permitidas ────────────────────────────────────

type FeedKey = `feed:home:${string}`;
type TrendingKey = "trending:posts" | "trending:videos";
type PostStatsKey = `post:stats:${string}`;
export type CacheKey = FeedKey | TrendingKey | PostStatsKey;

// ── Operações básicas ────────────────────────────────────────────

export async function cacheGet<T>(key: CacheKey): Promise<T | null> {
  const redis = getRedis();
  if (!redis) return null;
  try {
    return await redis.get<T>(key);
  } catch {
    return null;
  }
}

export async function cacheSet<T>(
  key: CacheKey,
  value: T,
  ttl: number = CACHE_TTL.FEED,
): Promise<void> {
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.set(key, value, { ex: ttl });
  } catch {
    // falha no Redis nunca deve bloquear o fluxo principal
  }
}

export async function cacheDelete(...keys: CacheKey[]): Promise<void> {
  const redis = getRedis();
  if (!redis || keys.length === 0) return;
  try {
    await redis.del(...keys);
  } catch {}
}

// ── Helpers de domínio ───────────────────────────────────────────

/** Invalida o feed de um usuário (chamado ao criar/deletar post). */
export async function invalidateFeed(userId: string): Promise<void> {
  await cacheDelete(`feed:home:${userId}`);
}

/** Invalida estatísticas de um post (chamado ao dar like/comentar). */
export async function invalidatePostStats(postId: string): Promise<void> {
  await cacheDelete(`post:stats:${postId}`);
}

/** Verifica se o Redis está disponível (útil para healthcheck). */
export function isCacheConfigured(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}
