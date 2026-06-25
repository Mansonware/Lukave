"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut, User as UserIcon, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import { MOCK_GAME, xpPct, missionPct } from "@/lib/mock-game";

export function UserMenu({
  user,
}: {
  user: { name?: string | null; username: string; image?: string | null };
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring">
        <Avatar className="h-9 w-9 nuk-ring">
          {user.image && <AvatarImage src={user.image} alt={user.username} />}
          <AvatarFallback>{getInitials(user.name ?? user.username)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-foreground">
              {user.name ?? user.username}
            </span>
            <span className="text-xs font-normal text-muted-foreground">@{user.username}</span>
          </div>
        </DropdownMenuLabel>

        {/* Painel de gamificação */}
        <div className="px-2 py-1.5 space-y-2">
          {/* Nível + Coins */}
          <div className="flex items-center justify-between rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 px-3 py-2 border border-white/5">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-bold text-foreground">Nível {MOCK_GAME.level}</span>
              <span className="text-[10px] text-muted-foreground font-medium">
                {MOCK_GAME.xp} / {MOCK_GAME.xpMax} XP
              </span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs font-bold text-yellow-400 flex items-center gap-1">
                <span className="text-[10px]">🪙</span> {MOCK_GAME.coins}
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">Nook Coins</span>
            </div>
          </div>

          {/* Barra de XP */}
          <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full bg-nuk-gradient rounded-full transition-all"
              style={{ width: `${xpPct}%` }}
            />
          </div>

          {/* Missão diária */}
          <div className="flex items-center justify-between rounded-xl bg-white/[0.03] px-3 py-2 border border-white/5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-orange-400">⚡ Missão diária</span>
              <span className="text-[10px] text-muted-foreground">{MOCK_GAME.mission.label}</span>
            </div>
            <div className="flex flex-col items-end gap-0.5">
              <span className="text-xs font-bold text-foreground">
                {MOCK_GAME.mission.done}/{MOCK_GAME.mission.total}
              </span>
              <span className="text-[10px] text-muted-foreground">{missionPct}%</span>
            </div>
          </div>

          {/* Barra de progresso da missão */}
          <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${missionPct}%`,
                background: "linear-gradient(90deg, #ff9657, #ef62b0)",
              }}
            />
          </div>
        </div>

        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={`/${user.username}`}>
            <UserIcon /> Meu perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings /> Configurações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut /> Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
