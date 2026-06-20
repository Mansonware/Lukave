"use client";

import * as React from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    gradient?: boolean;
  }
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      gradient = false,
      ...props
    },
    ref,
  ) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        gradient
          ? orientation === "horizontal"
            ? "h-px w-full bg-[linear-gradient(to_right,transparent,hsl(var(--border-strong)),transparent)]"
            : "h-full w-px bg-[linear-gradient(to_bottom,transparent,hsl(var(--border-strong)),transparent)]"
          : "bg-border",
        !gradient &&
          (orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"),
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
