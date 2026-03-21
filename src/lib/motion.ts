export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.24, ease: "easeOut" as const },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: "easeOut" as const },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.985 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.22, ease: "easeOut" as const },
};
