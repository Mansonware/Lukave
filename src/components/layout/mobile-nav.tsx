"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus } from "lucide-react";

import { primaryNav } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

const NAV_LEFT = ["/feed", "/explore"];
const NAV_RIGHT = ["/notifications", "/messages"];

export function MobileNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();
  const leftItems = primaryNav.filter((i) => NAV_LEFT.includes(i.href));
  const rightItems = primaryNav.filter((i) => NAV_RIGHT.includes(i.href));

  const renderItem = (item: (typeof primaryNav)[number]) => {
    const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-label={item.label}
        className={cn(
          "relative flex h-full min-w-[44px] flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all duration-200 active:scale-95",
          active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
        )}
      >
        {active && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-10 w-10 rounded-full bg-primary/20 blur-lg" />
          </div>
        )}
        <span className="relative z-10 flex flex-col items-center gap-1">
          <item.icon
            className={cn(
              "h-5 w-5 transition-all duration-300",
              active ? "stroke-[2.5] text-primary -translate-y-0.5" : "stroke-2",
            )}
          />
          {item.href === "/notifications" && unreadCount > 0 && (
            <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-nexus-gradient px-1 text-[9px] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
          <span>{item.label}</span>
        </span>
      </Link>
    );
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-background/60 pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl lg:hidden">
      {/* Linha de brilho no topo */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="flex h-16 items-center justify-around px-4">
        {leftItems.map(renderItem)}

        {/* FAB central — abre compositor de post */}
        <div className="relative flex h-full min-w-[44px] flex-1 items-center justify-center">
          <Link
            href="/feed?compose=1"
            aria-label="Criar publicação"
            className="group/fab absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-nexus-gradient text-white shadow-[0_8px_28px_-4px_rgba(145,101,255,0.6)] ring-4 ring-background transition-all duration-300 active:scale-90"
          >
            <Plus className="h-6 w-6 stroke-[2.5] transition-transform duration-300 group-hover/fab:rotate-90" />
          </Link>
        </div>

        {rightItems.map(renderItem)}
      </div>
    </nav>
  );
}
