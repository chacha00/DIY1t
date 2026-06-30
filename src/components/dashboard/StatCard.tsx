import { type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = "blue",
}: {
  label: string;
  value: string;
  icon: LucideIcon;
  accent?: "blue" | "teal" | "orange";
}) {
  const accentClasses = {
    blue: "bg-brand-blue-50 text-brand-blue-600",
    teal: "bg-brand-teal-50 text-brand-teal-600",
    orange: "bg-brand-orange-50 text-brand-orange-600",
  }[accent];

  return (
    <Card className="flex items-center gap-4 p-5">
      <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl", accentClasses)}>
        <Icon className="h-5.5 w-5.5" />
      </span>
      <div className="min-w-0">
        <p className="truncate text-xl font-extrabold text-slate-900">{value}</p>
        <p className="truncate text-xs font-medium text-slate-400">{label}</p>
      </div>
    </Card>
  );
}
