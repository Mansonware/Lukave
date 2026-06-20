"use client";

import * as React from "react";
import {
  animate,
  useInView,
  useMotionValue,
  useTransform,
  motion,
} from "framer-motion";

import { formatCompactNumber } from "@/lib/utils";

export function CountUp({
  value,
  className,
  duration = 1.1,
}: {
  value: number;
  className?: string;
  duration?: number;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const mv = useMotionValue(0);
  const text = useTransform(mv, (v) => formatCompactNumber(Math.round(v)));

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(mv, value, {
      duration,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [inView, value, duration, mv]);

  return (
    <motion.span ref={ref} className={className}>
      {text}
    </motion.span>
  );
}
