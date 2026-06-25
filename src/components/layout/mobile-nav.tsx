"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNav } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

import { Plus, User } from "lucide-react";

export function MobileNav({ unreadCount = 0, username }: { unreadCount?: number; username?: string }) {
  const pathname = usePathname();
  const navItems = primaryNav.filter((i) => i.href !== "/settings" && i.href !== "/messages");

  return (
    // pb-[env(safe-area-inset-bottom)] no nav externo: estende o fundo até cobrir a área do home indicator
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-background/60 backdrop-blur-2xl lg:hidden pb-[env(safe-area-inset-bottom)]"
    >
      {/* Glow top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {navItems.slice(0, 2).map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
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
                  <div className="h-10 w-10 rounded-full bg-primary/15 blur-md" />
                </div>
              )}

              <span className="relative z-10 flex flex-col items-center gap-1">
                <item.icon
                  className={cn("h-5 w-5 transition-all", active ? "stroke-[2.5] text-primary" : "stroke-2")}
                />
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-nuk-gradient px-1 text-[9px] font-bold text-white shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span>{item.label}</span>
              </span>
            </Link>
          );
        })}

        {/* Central FAB — 56px para target confortável */}
        <div className="relative flex h-full min-w-[44px] flex-1 items-center justify-center">
          <Link
            href="/feed?compose=1"
            className="absolute -top-5 flex h-14 w-14 items-center justify-center rounded-full bg-nuk-gradient text-white shadow-lg shadow-primary/30 transition-transform active:scale-90 ring-4 ring-background"
            aria-label="Criar publicação"
          >
            <Plus className="h-6 w-6 stroke-[2.5]" />
          </Link>
        </div>

        {/* Items right side: Notifications and Profile */}
        {[
          ...navItems.slice(2, 3), // Notifications
          ...(username ? [{ href: `/${username}`, label: "Perfil", icon: User }] : []),
        ].map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
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
                  <div className="h-10 w-10 rounded-full bg-primary/15 blur-md" />
                </div>
              )}

              <span className="relative z-10 flex flex-col items-center gap-1">
                <item.icon
                  className={cn("h-5 w-5 transition-all", active ? "stroke-[2.5] text-primary" : "stroke-2")}
                />
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-nuk-gradient px-1 text-[9px] font-bold text-white shadow-sm">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span>{item.label}</span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
