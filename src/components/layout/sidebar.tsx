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
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-white/5 bg-background/50 backdrop-blur-3xl px-4 py-6 lg:flex">
      <div className="px-3 mb-6">
        <Logo />
      </div>

      <nav className="mt-4 flex flex-1 flex-col gap-2">
        {primaryNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-[15px] font-medium transition-all duration-300",
                active
                  ? "text-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-white/[0.04] hover:text-foreground",
              )}
            >
              {active && (
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border border-white/5 pointer-events-none" />
              )}
              {active && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-full" />
              )}
              <span className="relative z-10">
                <item.icon className={cn("h-5 w-5 transition-transform duration-300", active ? "stroke-[2.5]" : "stroke-2 group-hover:scale-110")} />
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-nuk-gradient px-1.5 text-[11px] font-bold text-white shadow-lg shadow-primary/20">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Button asChild className="mt-4 w-full rounded-2xl py-6 text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
        <Link href="/feed?compose=1">
          <PenSquare className="mr-2 h-5 w-5" /> Publicar
        </Link>
      </Button>
    </aside>
  );
}
