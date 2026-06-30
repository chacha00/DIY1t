import { ListChecks } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ProjectStep } from "@/types/database";

export function StepsList({ steps }: { steps: ProjectStep[] }) {
  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <ListChecks className="h-4.5 w-4.5 text-brand-teal-500" />
        Step-by-Step Instructions
      </h2>

      <ol className="mt-5 space-y-5">
        {steps
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((step) => (
            <li key={step.order} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal-50 text-sm font-bold text-brand-teal-600">
                {step.order}
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-500">{step.description}</p>
              </div>
            </li>
          ))}
      </ol>
    </Card>
  );
}
