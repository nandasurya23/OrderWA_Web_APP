import { AnimatePresence, motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { scaleIn } from "@/lib/motion";

type OrderResultProps = {
  description: string;
  message: string | null;
  title: string;
};

export function OrderResult({
  description,
  message,
  title,
}: OrderResultProps) {
  return (
    <Card className="h-full rounded-[2rem]">
      <div className="flex h-full flex-col gap-6">
        <div className="space-y-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--foreground-muted)]">
            Hasil
          </p>
          <h2 className="text-3xl font-semibold leading-tight tracking-[-0.04em] text-[var(--foreground)]">
            {title}
          </h2>
          <p className="text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
            {description}
          </p>
        </div>

        <div className="flex-1 rounded-[1.6rem] border border-[var(--border)] bg-[linear-gradient(180deg,rgba(244,247,251,0.95)_0%,rgba(255,255,255,0.92)_100%)] p-5 text-sm leading-7 text-[var(--foreground)]">
          <AnimatePresence mode="wait">
            {message ? (
              <motion.pre
                key="result"
                initial={scaleIn.initial}
                animate={scaleIn.animate}
                exit={scaleIn.initial}
                transition={scaleIn.transition}
                className="m-0 whitespace-pre-wrap font-inherit"
              >
                {message}
              </motion.pre>
            ) : (
              <motion.p
                key="empty"
                initial={scaleIn.initial}
                animate={scaleIn.animate}
                exit={scaleIn.initial}
                transition={scaleIn.transition}
                className="text-[var(--foreground-muted)]"
              >
                Pesan order akan muncul di sini.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
