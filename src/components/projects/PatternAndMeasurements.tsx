import { Ruler, Scissors } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { PatternPiece, ProjectMeasurement } from "@/types/database";

function PatternGrid({ piece }: { piece: PatternPiece }) {
  const MAX_W = 120;
  const MAX_H = 80;
  const scale = Math.min(MAX_W / piece.width_in, MAX_H / piece.height_in, 6);
  const w = Math.max(piece.width_in * scale, 20);
  const h = Math.max(piece.height_in * scale, 14);
  const isCircle = piece.shape === "circle";

  return (
    <div className="flex items-center justify-center rounded-xl bg-brand-blue-50 p-3" style={{ minHeight: 96 }}>
      <svg width={w + 8} height={h + 8} viewBox={`0 0 ${w + 8} ${h + 8}`}>
        {isCircle ? (
          <ellipse
            cx={(w + 8) / 2} cy={(h + 8) / 2}
            rx={w / 2} ry={h / 2}
            fill="#dbeafe" stroke="#2186eb" strokeWidth="1.5" strokeDasharray="4 2"
          />
        ) : (
          <rect
            x={4} y={4} width={w} height={h}
            fill="#dbeafe" stroke="#2186eb" strokeWidth="1.5" strokeDasharray="4 2"
            rx={2}
          />
        )}
        <text x={(w + 8) / 2} y={(h + 8) / 2 + 4} textAnchor="middle" fontSize="8" fill="#1267c4" fontFamily="sans-serif">
          {piece.width_in}"×{piece.height_in}"
        </text>
      </svg>
    </div>
  );
}

export function PatternAndMeasurements({
  patternPieces,
  measurements,
}: {
  patternPieces: PatternPiece[];
  measurements: ProjectMeasurement[];
}) {
  if (!patternPieces?.length && !measurements?.length) return null;

  return (
    <div className="space-y-6">
      {patternPieces?.length > 0 && (
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Scissors className="h-4.5 w-4.5 text-brand-blue-500" />
            Pattern Pieces
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Cut each piece from your chosen material. Dashed outlines show cut lines.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {patternPieces.map((piece, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 p-4">
                <div className="mb-3">
                  <PatternGrid piece={piece} />
                </div>
                <p className="text-sm font-bold text-slate-900">{piece.name}</p>
                <div className="mt-1 flex flex-wrap gap-x-4 gap-y-0.5 text-xs text-slate-500">
                  <span>W: <strong>{piece.width_in}"</strong></span>
                  <span>H: <strong>{piece.height_in}"</strong></span>
                  <span>Qty: <strong>×{piece.quantity}</strong></span>
                  {piece.shape && piece.shape !== "rectangle" && (
                    <span>Shape: <strong>{piece.shape}</strong></span>
                  )}
                </div>
                {piece.notes && (
                  <p className="mt-2 rounded-lg bg-brand-orange-50 px-2.5 py-1.5 text-xs text-brand-orange-700">
                    📌 {piece.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {measurements?.length > 0 && (
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Ruler className="h-4.5 w-4.5 text-brand-teal-500" />
            Measurements
          </h2>
          <div className="mt-4 divide-y divide-slate-100">
            {measurements.map((m, i) => (
              <div key={i} className="flex items-center justify-between py-2.5">
                <span className="text-sm text-slate-600">{m.label}</span>
                <span className="text-sm font-bold text-slate-900">{m.value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
