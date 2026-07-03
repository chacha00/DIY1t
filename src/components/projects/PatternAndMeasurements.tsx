import { Ruler, Scissors, AlertCircle, CheckCircle2 } from "lucide-react";
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
        <text x={(w + 8) / 2} y={(h + 8) / 2 - 3} textAnchor="middle" fontSize="8" fill="#1267c4" fontFamily="sans-serif" fontWeight="bold">
          {piece.width_in}"×{piece.height_in}"
        </text>
        {(piece as PatternPieceExt).seam_allowance_in && (
          <text x={(w + 8) / 2} y={(h + 8) / 2 + 7} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="sans-serif">
            SA: {(piece as PatternPieceExt).seam_allowance_in}"
          </text>
        )}
      </svg>
    </div>
  );
}

// Extended type for new fields
interface PatternPieceExt extends PatternPiece {
  seam_allowance_in?: number;
  grain_direction?: string;
  assembly_note?: string;
}

interface MeasurementExt extends ProjectMeasurement {
  category?: string;
}

export function PatternAndMeasurements({
  patternPieces,
  measurements,
}: {
  patternPieces: PatternPiece[];
  measurements: ProjectMeasurement[];
}) {
  if (!patternPieces?.length && !measurements?.length) return null;

  // Group measurements by category
  const measurementsByCategory = (measurements as MeasurementExt[]).reduce<Record<string, MeasurementExt[]>>((acc, m) => {
    const cat = m.category ?? "other";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(m);
    return acc;
  }, {});

  const categoryLabels: Record<string, string> = {
    finished: "Finished Dimensions",
    pattern: "Pattern Piece Measurements",
    hardware: "Hardware Placement",
    fitting: "Fitting Measurements",
    seam: "Seam Allowances",
    adjustment: "Adjustment Range",
    other: "Additional Measurements",
  };

  // Include any categories the AI returned that aren't in the standard list
  const standardOrder = ["fitting", "finished", "pattern", "hardware", "seam", "adjustment", "other"];
  const extraCategories = Object.keys(measurementsByCategory).filter(c => !standardOrder.includes(c));
  const categoryOrder = [...standardOrder, ...extraCategories];

  return (
    <div className="space-y-6">
      {patternPieces?.length > 0 && (
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Scissors className="h-4.5 w-4.5 text-brand-blue-500" />
            Pattern Pieces
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Dimensions include seam allowance unless noted otherwise. Dashed outlines show cut lines.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {(patternPieces as PatternPieceExt[]).map((piece, i) => (
              <div key={i} className="rounded-2xl border border-slate-100 p-4">
                <div className="mb-3">
                  <PatternGrid piece={piece} />
                </div>
                <p className="text-sm font-bold text-slate-900">{piece.name}</p>
                <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span>Width: <strong className="text-slate-800">{piece.width_in}"</strong></span>
                  <span>Height: <strong className="text-slate-800">{piece.height_in}"</strong></span>
                  <span>Qty: <strong className="text-slate-800">×{piece.quantity}</strong></span>
                  {piece.seam_allowance_in && (
                    <span>Seam: <strong className="text-slate-800">{piece.seam_allowance_in}"</strong></span>
                  )}
                  {piece.shape && piece.shape !== "rectangle" && (
                    <span>Shape: <strong className="text-slate-800">{piece.shape}</strong></span>
                  )}
                  {piece.grain_direction && (
                    <span className="col-span-2">Grain: <strong className="text-slate-800">{piece.grain_direction}</strong></span>
                  )}
                </div>
                {piece.assembly_note && (
                  <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-brand-teal-50 px-2.5 py-1.5">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-brand-teal-500" />
                    <p className="text-xs text-brand-teal-700">{piece.assembly_note}</p>
                  </div>
                )}
                {piece.notes && (
                  <p className="mt-2 rounded-lg bg-brand-orange-50 px-2.5 py-1.5 text-xs text-brand-orange-700">
                    📌 {piece.notes}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
            <strong className="text-slate-600">Cutting tips:</strong> Press fabric before cutting. Use pattern weights or pins to secure pieces. Cut one layer at a time for accuracy. Mark all notches and drill holes before removing pattern.
          </div>
        </Card>
      )}

      {Object.keys(measurementsByCategory).length > 0 && (
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Ruler className="h-4.5 w-4.5 text-brand-teal-500" />
            Measurements
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            All measurements in inches unless noted. Add ease as specified per category.
          </p>

          <div className="mt-4 space-y-5">
            {categoryOrder
              .filter((cat) => measurementsByCategory[cat]?.length)
              .map((cat) => (
                <div key={cat}>
                  <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                    {categoryLabels[cat] ?? cat.replace(/_/g, " ")}
                  </p>
                  <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                    {measurementsByCategory[cat].map((m, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5">
                        <span className="text-sm text-slate-600">{m.label}</span>
                        <span className="text-sm font-bold text-slate-900">{m.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Measurement how-to */}
      <Card className="p-6 border-brand-blue-100 bg-brand-blue-50">
        <h3 className="flex items-center gap-2 text-sm font-bold text-brand-blue-800">
          <AlertCircle className="h-4 w-4" />
          How to Measure Your Pet
        </h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 text-xs text-brand-blue-700">
          {[
            { label: "Chest / Girth", tip: "Measure around the widest part of the chest, just behind the front legs. Add 1–2\" ease for comfort." },
            { label: "Neck", tip: "Measure loosely where a collar sits. Add 1\" ease. You should fit two fingers under the tape." },
            { label: "Back Length", tip: "Measure from the base of the neck (withers) to the base of the tail along the spine." },
            { label: "Leg Circumference", tip: "Measure around the thickest part of each front leg for harness leg openings." },
          ].map((item) => (
            <div key={item.label} className="rounded-lg bg-white/60 p-3">
              <p className="font-semibold text-brand-blue-800">{item.label}</p>
              <p className="mt-1">{item.tip}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
