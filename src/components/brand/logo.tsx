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
      aria-label="Lukave, início"
    >
      <span className="grid h-8 w-8 place-items-center rounded-xl border border-primary/50 bg-gradient-to-br from-primary to-accent text-sm font-black text-white shadow-lg shadow-primary/20">
        L
      </span>
      {withWordmark && (
        <span className="font-display text-lg font-bold tracking-[0.14em]">
          LUKAVE
        </span>
      )}
    </Link>
  );
}
