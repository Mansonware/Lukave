/**
 * MOCK de gamificação — SOMENTE UI.
 *
 * Estes valores são fixos e existem apenas para dar feedback visual de
 * progressão (nível, XP, Nook Coins, missão diária) enquanto o backend de
 * gamificação não existe. Não há persistência nem lógica de regras aqui.
 *
 * Para tornar real numa sprint futura: criar uma query Prisma por userId e
 * substituir o consumo de `MOCK_GAME` nos componentes que o importam
 * (MobileHeader, UserMenu).
 */
export const MOCK_GAME = {
  level: 5,
  xp: 450,
  xpMax: 1000,
  coins: 120,
  mission: { label: "3 publicações hoje", done: 2, total: 3 },
} as const;

export const xpPct = Math.round((MOCK_GAME.xp / MOCK_GAME.xpMax) * 100);
export const missionPct = Math.round(
  (MOCK_GAME.mission.done / MOCK_GAME.mission.total) * 100,
);
