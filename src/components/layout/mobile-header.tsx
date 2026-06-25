import { Logo } from "@/components/brand/logo";
import { UserMenu } from "@/components/layout/user-menu";
import { MOCK_GAME, xpPct } from "@/lib/mock-game";

/**
 * Header mobile compacto (h-14) com identidade NúK + indicador de progressão
 * mockado (nível, mini-barra de XP, Nook Coins). Visível só abaixo de lg.
 * `pt-safe` (env(safe-area-inset-top)) evita colisão com o notch do iOS.
 * O indicador é UI mockada isolada (ver `@/lib/mock-game`).
 */
export function MobileHeader({
  user,
}: {
  user: { name?: string | null; username: string; image?: string | null };
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/5 bg-background/80 backdrop-blur-2xl pt-safe lg:hidden">
      <div className="flex h-14 items-center justify-between gap-2 px-3">
        <Logo />

        <div className="flex items-center gap-2">
          {/* Indicador de progressão — SOMENTE UI mockada */}
          <div
            className="flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.04] py-1 pl-1.5 pr-2.5 shadow-inner"
            aria-label={`Nível ${MOCK_GAME.level}, ${MOCK_GAME.xp} de ${MOCK_GAME.xpMax} XP, ${MOCK_GAME.coins} Nook Coins`}
          >
            <span className="grid h-5 w-5 place-items-center rounded-full bg-nuk-gradient text-[10px] font-bold text-white shadow-sm">
              {MOCK_GAME.level}
            </span>
            <div className="h-1 w-9 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-nuk-gradient"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <span className="h-3.5 w-px bg-white/10" />
            <span className="text-[11px] font-bold text-yellow-400 tabular-nums">
              🪙 {MOCK_GAME.coins}
            </span>
          </div>

          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
