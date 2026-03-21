import { cn } from "@/lib/utils";

type SectionContainerProps = Readonly<{
  children: React.ReactNode;
  className?: string;
}>;

export function SectionContainer({
  children,
  className,
}: SectionContainerProps) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)}>
      {children}
    </div>
  );
}
