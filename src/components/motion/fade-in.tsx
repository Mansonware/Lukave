"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";

interface FadeInProps extends HTMLMotionProps<"div"> {
  delay?: number;
  y?: number;
}

export function FadeIn({ delay = 0, y = 16, children, ...props }: FadeInProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={
        shouldReduceMotion
          ? { duration: 0 }
          : { duration: 0.55, delay, ease: [0.21, 0.47, 0.32, 0.98] }
      }
      {...props}
    >
      {children}
    </motion.div>
  );
}
