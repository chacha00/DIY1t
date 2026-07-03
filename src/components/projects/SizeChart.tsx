import { TableProperties } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { SizeChartRow } from "@/lib/openai";

export function SizeChart({ rows }: { rows: SizeChartRow[] }) {
  if (!rows?.length) return null;

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
        <TableProperties className="h-4.5 w-4.5 text-brand-blue-500" />
        Size Chart
      </h2>
      <p className="mt-1 text-xs text-slate-400">
        Find your pet's size using chest girth as the primary measurement. When between sizes, size up.
      </p>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
              <th className="px-4 py-3 text-left">Size</th>
              <th className="px-4 py-3 text-left">Breed Examples</th>
              <th className="px-4 py-3 text-center">Chest (in)</th>
              <th className="px-4 py-3 text-center">Neck (in)</th>
              <th className="px-4 py-3 text-center">Back (in)</th>
              <th className="px-4 py-3 text-center">Weight (lbs)</th>
              <th className="px-4 py-3 text-left">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {rows.map((row, i) => (
              <tr
                key={i}
                className={`transition-colors hover:bg-slate-50/50 ${
                  row.size_name === "Custom" ? "bg-brand-blue-50/40 font-medium" : ""
                }`}
              >
                <td className="px-4 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    row.size_name === "Custom"
                      ? "bg-brand-blue-100 text-brand-blue-700"
                      : "bg-slate-100 text-slate-700"
                  }`}>
                    {row.size_name}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">
                  {row.breed_examples.join(", ")}
                </td>
                <td className="px-4 py-3 text-center font-semibold text-slate-800">{row.chest_in}</td>
                <td className="px-4 py-3 text-center font-semibold text-slate-800">{row.neck_in}</td>
                <td className="px-4 py-3 text-center font-semibold text-slate-800">{row.back_in}</td>
                <td className="px-4 py-3 text-center text-slate-600">{row.weight_lbs}</td>
                <td className="px-4 py-3 text-xs text-slate-500">{row.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs text-slate-400">
        * Measurements are guidelines. Always measure your individual pet — breed standards vary widely. Add 1–2" ease to chest and neck measurements for comfort.
      </p>
    </Card>
  );
}
