"use client";

import type { HTMLMotionProps } from "framer-motion";
import { motion } from "framer-motion";

type StaggerContainerProps = HTMLMotionProps<"div">;

export function StaggerContainer({
  children,
  ...props
}: StaggerContainerProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.08,
          },
        },
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
