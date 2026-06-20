"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { Logo } from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { primaryNav } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";
import { PenSquare } from "lucide-react";

export function Sidebar({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border-subtle bg-surface/40 px-4 py-5 backdrop-blur-xl lg:flex">
      {/* gradiente sutil na borda direita */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-px bg-[linear-gradient(to_bottom,transparent,hsl(258_100%_70%/0.4),transparent)]"
      />

      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {primaryNav.map((item, i) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                href={item.href}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]",
                )}
              >
                {active && (
                  <>
                    <motion.span
                      layoutId="sidebar-active"
                      className="absolute inset-0 -z-10 rounded-xl border border-primary/20 bg-primary/[0.08] shadow-glow-purple"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                    <motion.span
                      layoutId="sidebar-active-bar"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-nexus-gradient"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  </>
                )}
                <span className="relative">
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-all duration-200 group-hover:scale-110",
                      active && "text-primary drop-shadow-[0_0_6px_hsl(258_100%_70%/0.6)]",
                    )}
                  />
                  {item.href === "/notifications" && unreadCount > 0 && (
                    <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-nexus-gradient px-1 text-[10px] font-bold text-white shadow-glow-purple">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </span>
                {item.label}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      <Button asChild variant="gradient" className="mt-4 w-full">
        <Link href="/feed?compose=1">
          <PenSquare className="h-4 w-4" /> Publicar
        </Link>
      </Button>
    </aside>
  );
}
