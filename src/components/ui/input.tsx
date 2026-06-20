import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, rightIcon, error, ...props }, ref) => {
    const input = (
      <input
        type={type}
        aria-invalid={error || undefined}
        className={cn(
          "peer flex h-11 w-full rounded-xl border bg-white/[0.03] px-4 py-2 text-sm transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 focus-visible:border-primary/50 focus-visible:bg-white/[0.05] disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium",
          error
            ? "border-destructive/60 focus-visible:ring-destructive/60 animate-shake"
            : "border-input",
          icon && "pl-11",
          rightIcon && "pr-11",
          className,
        )}
        ref={ref}
        {...props}
      />
    );

    if (!icon && !rightIcon) return input;

    return (
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors peer-focus-visible:text-primary [&_svg]:size-4">
            {icon}
          </span>
        )}
        {input}
        {rightIcon && (
          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground [&_svg]:size-4">
            {rightIcon}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
