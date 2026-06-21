"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { primaryNav } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

export function MobileNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/85 backdrop-blur-xl lg:hidden" aria-label="Navegação principal">
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {primaryNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <span className="relative">
                <item.icon className={cn("h-5 w-5", active && "stroke-[2.5]")} />
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-nexus-gradient px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              {item.label}
              {active && (
                <span className="absolute -top-px h-0.5 w-8 rounded-full bg-nexus-gradient" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
