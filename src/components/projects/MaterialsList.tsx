import { Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { MaterialLineItem } from "@/types/database";

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export function MaterialsList({ materials }: { materials: MaterialLineItem[] }) {
  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <Package className="h-4.5 w-4.5 text-brand-blue-500" />
        Materials & Shopping List
      </h2>

      <div className="mt-4 divide-y divide-slate-100">
        {materials.map((item, i) => (
          <div key={i} className="flex items-start justify-between gap-4 py-3">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-400"
              />
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-400">
                  {item.quantity} {item.unit ?? ""}
                </p>
                {item.alt_options && item.alt_options.length > 0 && (
                  <p className="mt-1 text-xs text-slate-400">
                    Alternatives:{" "}
                    {item.alt_options.map((alt, j) => (
                      <span key={j}>
                        {alt.label} ({formatCents(alt.cost_cents)})
                        {j < item.alt_options!.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </p>
                )}
              </div>
            </div>
            <span className="shrink-0 text-sm font-semibold text-slate-700">
              {formatCents(item.cost_cents)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
