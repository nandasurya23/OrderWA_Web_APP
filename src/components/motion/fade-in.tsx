"use client";

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";

import { fadeInUp } from "@/lib/motion";

type FadeInProps = HTMLMotionProps<"div">;

export function FadeIn({ children, ...props }: FadeInProps) {
  return (
    <motion.div
      initial={fadeInUp.initial}
      whileInView={fadeInUp.animate}
      viewport={{ once: true, amount: 0.2 }}
      transition={fadeInUp.transition}
      {...props}
    >
      {children}
    </motion.div>
  );
}
