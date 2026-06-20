"use client";

import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

interface Orb {
  className: string;
  duration: number;
  delay?: number;
}

const ORBS: Orb[] = [
  {
    className:
      "left-[-10%] top-[-5%] h-[34rem] w-[34rem] bg-[radial-gradient(circle,hsl(258_100%_65%/0.35),transparent_65%)]",
    duration: 18,
  },
  {
    className:
      "right-[-8%] top-[15%] h-[28rem] w-[28rem] bg-[radial-gradient(circle,hsl(188_87%_54%/0.28),transparent_65%)]",
    duration: 22,
    delay: 2,
  },
  {
    className:
      "bottom-[-10%] left-[25%] h-[30rem] w-[30rem] bg-[radial-gradient(circle,hsl(326_84%_67%/0.22),transparent_65%)]",
    duration: 26,
    delay: 1,
  },
];

export function AnimatedBackground({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "intense";
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-background",
        className,
      )}
    >
      {/* grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-60" />

      {/* orbes flutuantes */}
      {ORBS.map((orb, i) => (
        <motion.div
          key={i}
          className={cn(
            "absolute rounded-full blur-3xl",
            variant === "intense" ? "opacity-90" : "opacity-70",
            orb.className,
          )}
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -25, 20, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay ?? 0,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* vinheta para foco no conteúdo */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.6)_100%)]" />
    </div>
  );
}
