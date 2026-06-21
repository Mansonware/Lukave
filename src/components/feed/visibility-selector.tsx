"use client";

import { memo } from "react";
import { Globe, Lock, Users } from "lucide-react";

import { cn } from "@/lib/utils";

export type Visibility = "PUBLIC" | "FOLLOWERS" | "PRIVATE";

const VIS_OPTIONS: { value: Visibility; label: string; icon: typeof Globe }[] = [
  { value: "PUBLIC", label: "Público", icon: Globe },
  { value: "FOLLOWERS", label: "Seguidores", icon: Users },
  { value: "PRIVATE", label: "Só eu", icon: Lock },
];

interface VisibilitySelectorProps {
  value: Visibility;
  onChange: (v: Visibility) => void;
}

export const VisibilitySelector = memo(function VisibilitySelector({
  value,
  onChange,
}: VisibilitySelectorProps) {
  return (
    <div
      className="flex items-center gap-0.5 rounded-full bg-secondary/60 p-0.5"
      role="radiogroup"
      aria-label="Visibilidade da publicação"
    >
      {VIS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          onClick={() => onChange(opt.value)}
          title={opt.label}
          className={cn(
            "flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
            value === opt.value
              ? "bg-nexus-gradient text-white"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <opt.icon className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{opt.label}</span>
        </button>
      ))}
    </div>
  );
});
