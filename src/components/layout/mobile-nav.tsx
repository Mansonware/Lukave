"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNav } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

export function MobileNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/5 bg-background/60 backdrop-blur-2xl lg:hidden">
      {/* Glow top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {primaryNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "relative flex h-full flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium transition-all duration-200 active:scale-95",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground/80",
              )}
            >
              {active && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="h-10 w-10 rounded-full bg-primary/15 blur-md" />
                </div>
              )}
              
              <span className="relative z-10 flex flex-col items-center gap-1">
                <item.icon className={cn("h-5 w-5 transition-all", active ? "stroke-[2.5] text-primary" : "stroke-2")} />
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-nexus-gradient px-1 text-[9px] font-bold text-white shadow-sm">
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
