import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "border-transparent bg-nexus-gradient text-white",
        gradient:
          "border-transparent bg-[linear-gradient(90deg,hsl(258_100%_70%),hsl(188_87%_54%),hsl(326_84%_67%),hsl(258_100%_70%))] bg-[length:200%_auto] text-white animate-gradient-shift",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "border-border text-foreground",
        success: "border-nexus-green/25 bg-nexus-green/15 text-nexus-green",
        info: "border-nexus-blue/25 bg-nexus-blue/15 text-nexus-blue",
        warning: "border-nexus-orange/25 bg-nexus-orange/15 text-nexus-orange",
        pink: "border-nexus-pink/25 bg-nexus-pink/15 text-nexus-pink",
        purple: "border-primary/25 bg-primary/15 text-primary",
        destructive:
          "border-destructive/25 bg-destructive/15 text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

const DOT_COLOR: Record<string, string> = {
  success: "bg-nexus-green",
  info: "bg-nexus-blue",
  warning: "bg-nexus-orange",
  pink: "bg-nexus-pink",
  purple: "bg-primary",
  destructive: "bg-destructive",
};

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
              DOT_COLOR[variant ?? ""] ?? "bg-white",
            )}
          />
          <span
            className={cn(
              "relative inline-flex h-1.5 w-1.5 rounded-full",
              DOT_COLOR[variant ?? ""] ?? "bg-white",
            )}
          />
        </span>
      )}
      {children}
    </div>
  );
}

export { Badge, badgeVariants };
