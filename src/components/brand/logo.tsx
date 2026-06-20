import Link from "next/link";

import { cn } from "@/lib/utils";

const SIZES = {
  sm: { box: "h-7 w-7 text-xs rounded-lg", text: "text-base tracking-[0.16em]" },
  md: { box: "h-8 w-8 text-sm rounded-lg", text: "text-lg tracking-[0.18em]" },
  lg: { box: "h-11 w-11 text-lg rounded-xl", text: "text-2xl tracking-[0.2em]" },
  xl: { box: "h-14 w-14 text-2xl rounded-2xl", text: "text-3xl tracking-[0.2em]" },
} as const;

export function Logo({
  className,
  href = "/",
  withWordmark = true,
  size = "md",
}: {
  className?: string;
  href?: string;
  withWordmark?: boolean;
  size?: keyof typeof SIZES;
}) {
  const s = SIZES[size];

  return (
    <Link
      href={href}
      className={cn("group flex items-center gap-2.5", className)}
      aria-label="NEXUS, início"
    >
      <span className="relative inline-grid place-items-center">
        {/* halo glow */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 rounded-xl bg-nexus-gradient opacity-50 blur-md transition-opacity duration-300 group-hover:opacity-90",
            s.box,
          )}
        />
        <span
          className={cn(
            "relative grid place-items-center overflow-hidden bg-[linear-gradient(135deg,hsl(258_100%_70%),hsl(217_100%_63%),hsl(188_87%_54%),hsl(258_100%_70%))] bg-[length:200%_auto] font-display font-black text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_4px_12px_-2px_hsl(258_100%_60%/0.6)] transition-[background-position] duration-700 group-hover:bg-[position:100%]",
            s.box,
          )}
        >
          N
          {/* sheen */}
          <span
            aria-hidden
            className="absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.45)_50%,transparent_70%)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full"
          />
        </span>
      </span>
      {withWordmark && (
        <span
          className={cn(
            "font-display font-bold text-foreground transition-colors",
            s.text,
          )}
        >
          NEXUS
        </span>
      )}
    </Link>
  );
}
