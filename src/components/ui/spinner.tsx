import { cn } from "@/lib/utils";

const SIZES = {
  sm: "h-4 w-4 border-2",
  default: "h-6 w-6 border-2",
  lg: "h-9 w-9 border-[3px]",
} as const;

export function Spinner({
  className,
  size = "default",
}: {
  className?: string;
  size?: keyof typeof SIZES;
}) {
  return (
    <span
      role="status"
      aria-label="Carregando"
      className={cn("relative inline-grid place-items-center", className)}
    >
      <span
        className={cn(
          "animate-spin rounded-full border-primary/20 border-t-primary",
          SIZES[size],
        )}
      />
      <span
        className={cn(
          "absolute animate-spin-slow rounded-full border-transparent border-r-nexus-cyan",
          SIZES[size],
        )}
      />
    </span>
  );
}
