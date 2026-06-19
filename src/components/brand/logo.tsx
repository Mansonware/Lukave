import Link from "next/link";

import { cn } from "@/lib/utils";

export function Logo({
  className,
  href = "/",
  withWordmark = true,
}: {
  className?: string;
  href?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn("flex items-center gap-2.5", className)}
      aria-label="NEXUS, início"
    >
      <span className="grid h-8 w-8 place-items-center rounded-lg border border-primary/60 bg-nexus-gradient/20 bg-gradient-to-br from-primary/40 to-accent/10 text-sm font-bold text-white shadow-[inset_0_0_12px_rgba(145,101,255,0.35)]">
        N
      </span>
      {withWordmark && (
        <span className="font-display text-lg font-bold tracking-[0.18em]">
          NEXUS
        </span>
      )}
    </Link>
  );
}
