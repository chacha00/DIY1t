import { Package, ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { MaterialLineItem } from "@/types/database";

const AFFILIATE_TAG = "diy1t-20";

function formatCents(cents: number | null | undefined) {
  if (cents == null || isNaN(cents) || cents === 0) return null;
  return `$${(cents / 100).toFixed(2)}`;
}

function amazonUrl(query: string) {
  return `https://www.amazon.com/s?k=${encodeURIComponent(query)}&tag=${AFFILIATE_TAG}`;
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
            <div className="flex items-start gap-3 flex-1">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-400"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                    <p className="text-xs text-slate-400">
                      {item.quantity} {item.unit ?? ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {formatCents(item.cost_cents) && (
                      <span className="text-sm font-semibold text-slate-700">
                        {formatCents(item.cost_cents)}
                      </span>
                    )}
                    <a
                      href={amazonUrl(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-brand-orange-50 px-2.5 py-1 text-xs font-semibold text-brand-orange-600 hover:bg-brand-orange-100 transition-colors"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Buy
                    </a>
                  </div>
                </div>
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
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-slate-400">
        * Shopping links go to Amazon. DIY1T may earn a small commission at no extra cost to you.
      </p>
    </Card>
  );
}
