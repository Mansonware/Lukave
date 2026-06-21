"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";
import { PenSquare } from "lucide-react";

export function Sidebar({
  unreadCount = 0,
}: {
  unreadCount?: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border px-4 py-5 lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1" aria-label="Navegação principal">
        {primaryNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-white/[0.06] text-foreground"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
              )}
            >
              <span className="relative">
                <item.icon className="h-5 w-5" />
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-nexus-gradient px-1 text-[10px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Button asChild className="mt-4 w-full">
        <Link href="/feed?compose=1">
          <PenSquare className="h-4 w-4" /> Publicar
        </Link>
      </Button>
    </aside>
  );
}
