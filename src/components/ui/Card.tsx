import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-3xl border border-slate-100 bg-white shadow-soft transition-all duration-300 hover:shadow-soft-lg hover:-translate-y-1",
        className
      )}
    >
      {children}
    </div>
  );
}

export function GlassCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("glass rounded-3xl shadow-soft-lg", className)}>
      {children}
    </div>
  );
}
