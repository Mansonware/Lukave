"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { primaryNav } from "@/components/layout/nav-items";
import { cn } from "@/lib/utils";

export function MobileNav({ unreadCount = 0 }: { unreadCount?: number }) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/[0.06] bg-surface/70 backdrop-blur-2xl lg:hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-[linear-gradient(to_right,transparent,hsl(258_100%_70%/0.5),transparent)]"
      />
      <div className="mx-auto flex max-w-md items-center justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {primaryNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={cn(
                "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <span className="relative grid place-items-center">
                {active && (
                  <motion.span
                    layoutId="mobile-active-pill"
                    className="absolute -inset-x-3 -inset-y-1.5 -z-10 rounded-full bg-primary/10"
                    transition={{ type: "spring", stiffness: 450, damping: 35 }}
                  />
                )}
                <item.icon
                  className={cn(
                    "h-5 w-5 transition-transform",
                    active && "scale-110 stroke-[2.5] drop-shadow-[0_0_6px_hsl(258_100%_70%/0.6)]",
                  )}
                />
                {item.href === "/notifications" && unreadCount > 0 && (
                  <span className="absolute -right-2 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-nexus-gradient px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </span>
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
