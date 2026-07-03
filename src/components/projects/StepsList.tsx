import { ListChecks, CheckCircle2, AlertTriangle, Lightbulb, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ProjectStep } from "@/types/database";

interface StepExt extends ProjectStep {
  quality_checkpoint?: string;
  common_mistake?: string;
  pro_tip?: string;
  time_minutes?: number;
}

export function StepsList({ steps }: { steps: ProjectStep[] }) {
  const sorted = (steps as StepExt[]).slice().sort((a, b) => a.order - b.order);

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <ListChecks className="h-4.5 w-4.5 text-brand-teal-500" />
        Step-by-Step Instructions
      </h2>

      <ol className="mt-5 space-y-6">
        {sorted.map((step) => (
          <li key={step.order} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-teal-50 text-sm font-bold text-brand-teal-600">
              {step.order}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-semibold text-slate-900">{step.title}</p>
                {step.time_minutes && (
                  <span className="flex shrink-0 items-center gap-1 text-xs text-slate-400">
                    <Clock className="h-3 w-3" />
                    {step.time_minutes} min
                  </span>
                )}
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{step.description}</p>

              {(step.quality_checkpoint || step.common_mistake || step.pro_tip) && (
                <div className="mt-3 space-y-2">
                  {step.quality_checkpoint && (
                    <div className="flex items-start gap-2 rounded-lg bg-brand-teal-50 px-3 py-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal-500" />
                      <p className="text-xs text-brand-teal-700">
                        <strong>Quality check:</strong> {step.quality_checkpoint}
                      </p>
                    </div>
                  )}
                  {step.common_mistake && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      <p className="text-xs text-red-700">
                        <strong>Common mistake:</strong> {step.common_mistake}
                      </p>
                    </div>
                  )}
                  {step.pro_tip && (
                    <div className="flex items-start gap-2 rounded-lg bg-brand-orange-50 px-3 py-2">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange-500" />
                      <p className="text-xs text-brand-orange-700">
                        <strong>Pro tip:</strong> {step.pro_tip}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}
