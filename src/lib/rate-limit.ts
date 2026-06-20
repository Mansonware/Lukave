import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let redis: Redis | null = null;
if (
  process.env.UPSTASH_REDIS_REST_URL &&
  process.env.UPSTASH_REDIS_REST_TOKEN
) {
  redis = Redis.fromEnv();
}

function makeLimiter(requests: number, window: `${number} ${"s" | "m" | "h" | "d"}`, prefix: string) {
  if (!redis) return null;
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requests, window),
    prefix,
  });
}

export const limiters = {
  createPost: makeLimiter(5, "1 m", "nexus:rl:post"),
  toggleLike: makeLimiter(30, "1 m", "nexus:rl:like"),
  toggleFollow: makeLimiter(10, "1 m", "nexus:rl:follow"),
};

export async function rateLimit(
  limiter: Ratelimit | null,
  userId: string,
): Promise<{ ok: false; error: string } | { ok: true }> {
  if (!limiter) return { ok: true };
  const { success } = await limiter.limit(userId);
  if (!success) return { ok: false, error: "Muitas requisições. Tente novamente em instantes." };
  return { ok: true };
}
