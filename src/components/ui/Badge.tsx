import { cn } from "@/lib/cn";

const colors = {
  blue: "bg-brand-blue-50 text-brand-blue-700",
  teal: "bg-brand-teal-50 text-brand-teal-600",
  orange: "bg-brand-orange-50 text-brand-orange-600",
  slate: "bg-slate-100 text-slate-600",
};

export function Badge({
  children,
  color = "blue",
  className,
}: {
  children: React.ReactNode;
  color?: keyof typeof colors;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
        colors[color],
        className
      )}
    >
      {children}
    </span>
  );
}
