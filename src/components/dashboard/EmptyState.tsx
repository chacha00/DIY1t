import { type LucideIcon } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";

export function EmptyState({
  icon: Icon,
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-6 py-12 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50">
        <Icon className="h-6 w-6 text-slate-400" />
      </span>
      <p className="mt-4 text-sm font-semibold text-slate-700">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-slate-400">{description}</p>
      {ctaLabel && ctaHref && (
        <LinkButton href={ctaHref} size="sm" className="mt-5">
          {ctaLabel}
        </LinkButton>
      )}
    </div>
  );
}
