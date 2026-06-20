import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-nexus-gradient text-white shadow-lg shadow-primary/25 hover:shadow-glow-purple hover:-translate-y-0.5",
        gradient:
          "bg-[linear-gradient(90deg,hsl(258_100%_70%),hsl(217_100%_63%),hsl(188_87%_54%),hsl(258_100%_70%))] bg-[length:200%_auto] text-white shadow-lg shadow-primary/25 hover:bg-[position:100%] hover:-translate-y-0.5 hover:shadow-glow-purple",
        glow: "bg-primary text-primary-foreground shadow-[0_0_20px_-4px_hsl(258_100%_70%/0.7)] hover:shadow-[0_0_32px_-2px_hsl(258_100%_70%/0.9)] hover:-translate-y-0.5",
        glass:
          "glass text-foreground hover:bg-white/[0.08] hover:border-white/15 hover:-translate-y-0.5",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:-translate-y-0.5",
        outline:
          "border border-border bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 hover:-translate-y-0.5",
        "outline-glow":
          "border border-primary/40 bg-primary/[0.04] text-foreground hover:border-primary/70 hover:bg-primary/[0.08] hover:shadow-glow-purple hover:-translate-y-0.5",
        ghost: "hover:bg-white/[0.06]",
        destructive:
          "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:bg-destructive/90 hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-xl px-7 text-base",
        xl: "h-14 rounded-2xl px-9 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-9 w-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

const SHEEN_VARIANTS = new Set(["default", "gradient", "glow", "destructive"]);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    const showSheen = SHEEN_VARIANTS.has(variant ?? "default") && !asChild;

    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, className }))}
          ref={ref}
          {...props}
        >
          {children}
        </Comp>
      );
    }

    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size, className }),
          showSheen && "overflow-hidden",
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {showSheen && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.25)_50%,transparent_70%)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-full"
          />
        )}
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
