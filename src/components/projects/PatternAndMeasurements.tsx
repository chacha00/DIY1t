"use client";
import { Ruler, Scissors, AlertCircle, CheckCircle2, Printer } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { PatternPiece, ProjectMeasurement } from "@/types/database";
import { buildPieceOutlineD } from "@/lib/svg/pieceOutline";

/** Returns the SVG shape element(s) for the given piece at pixel size w×h with offset ox,oy */
function PieceShape({ piece, w, h, ox, oy, scaleX, scaleY }: {
  piece: PatternPiece; w: number; h: number; ox: number; oy: number; scaleX: number; scaleY: number;
}) {
  const fill = "#dbeafe"; const stroke = "#2186eb"; const sw = "1.5"; const dash = "4 2";
  const shape = (piece.shape ?? "rectangle").toLowerCase();

  if (shape === "circle" || shape === "ellipse") {
    return <ellipse cx={ox + w / 2} cy={oy + h / 2} rx={w / 2} ry={h / 2} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />;
  }
  if (shape === "square") {
    const s = Math.min(w, h);
    return <rect x={ox + (w - s) / 2} y={oy + (h - s) / 2} width={s} height={s} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />;
  }
  if (shape === "triangle") {
    const d = `M ${ox + w / 2},${oy} L ${ox + w},${oy + h} L ${ox},${oy + h} Z`;
    return <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />;
  }
  if (shape === "trapezoid") {
    const inset = w * 0.18;
    const d = `M ${ox + inset},${oy} L ${ox + w - inset},${oy} L ${ox + w},${oy + h} L ${ox},${oy + h} Z`;
    return <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />;
  }
  if (shape === "half-moon" || shape === "halfmoon" || shape === "half-circle" || shape === "halfcircle" || shape === "semicircle") {
    const d = `M ${ox},${oy + h} A ${w / 2},${h} 0 0 1 ${ox + w},${oy + h} Z`;
    return <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />;
  }
  if (shape === "curved") {
    const curve = h * 0.25;
    const d = `M ${ox},${oy} L ${ox + w},${oy} Q ${ox + w},${oy + h + curve} ${ox + w / 2},${oy + h + curve} Q ${ox},${oy + h + curve} ${ox},${oy} Z`;
    return <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} />;
  }
  // default: rectangle with openings
  const d = buildPieceOutlineD(piece.width_in, piece.height_in, scaleX, scaleY, ox, oy, piece.openings);
  return <path d={d} fill={fill} stroke={stroke} strokeWidth={sw} strokeDasharray={dash} fillRule="evenodd" />;
}

function PatternGrid({ piece }: { piece: PatternPiece }) {
  const MAX_W = 120;
  const MAX_H = 80;
  const scale = Math.min(MAX_W / piece.width_in, MAX_H / piece.height_in, 6);
  const w = Math.max(piece.width_in * scale, 20);
  const h = Math.max(piece.height_in * scale, 14);
  const ox = 4; const oy = 4;
  const scaleX = w / piece.width_in;
  const scaleY = h / piece.height_in;

  return (
    <div className="flex items-center justify-center rounded-xl bg-brand-blue-50 p-3" style={{ minHeight: 96 }}>
      <svg width={w + 8} height={h + 8} viewBox={`0 0 ${w + 8} ${h + 8}`}>
        <PieceShape piece={piece} w={w} h={h} ox={ox} oy={oy} scaleX={scaleX} scaleY={scaleY} />
        {/* fold-on-fold indicator */}
        {piece.fold_edge === "left" && <line x1={ox} y1={oy} x2={ox} y2={oy + h} stroke="#f97316" strokeWidth="2.5" />}
        {piece.fold_edge === "right" && <line x1={ox + w} y1={oy} x2={ox + w} y2={oy + h} stroke="#f97316" strokeWidth="2.5" />}
        {piece.fold_edge === "top" && <line x1={ox} y1={oy} x2={ox + w} y2={oy} stroke="#f97316" strokeWidth="2.5" />}
        {piece.fold_edge === "bottom" && <line x1={ox} y1={oy + h} x2={ox + w} y2={oy + h} stroke="#f97316" strokeWidth="2.5" />}
        <text x={(w + 8) / 2} y={(h + 8) / 2 - 3} textAnchor="middle" fontSize="8" fill="#1267c4" fontFamily="sans-serif" fontWeight="bold">
          {piece.width_in}"×{piece.height_in}"
        </text>
        {piece.seam_allowance_in && (
          <text x={(w + 8) / 2} y={(h + 8) / 2 + 7} textAnchor="middle" fontSize="6.5" fill="#64748b" fontFamily="sans-serif">
            SA: {piece.seam_allowance_in}"
          </text>
        )}
      </svg>
    </div>
  );
}

/** Opens a print-ready page with pattern pieces at true scale (96px = 1 inch) */
function printPatternPieces(pieces: PatternPiece[], title: string) {
  const PX_PER_IN = 96;
  const MARGIN = 48; // px margin around each piece on page
  const LABEL_H = 28;

  let svgContent = "";
  let y = MARGIN;
  const pageW = 8.5 * PX_PER_IN; // letter width

  for (const piece of pieces) {
    const w = piece.width_in * PX_PER_IN;
    const h = piece.height_in * PX_PER_IN;
    const ox = MARGIN;
    const oy = y + LABEL_H;
    const shape = (piece.shape ?? "rectangle").toLowerCase();

    let shapeEl = "";
    const styleStr = `fill="#dbeafe" stroke="#1e40af" stroke-width="1.5" stroke-dasharray="6 3"`;

    if (shape === "circle" || shape === "ellipse") {
      shapeEl = `<ellipse cx="${ox + w / 2}" cy="${oy + h / 2}" rx="${w / 2}" ry="${h / 2}" ${styleStr}/>`;
    } else if (shape === "triangle") {
      shapeEl = `<path d="M ${ox + w / 2},${oy} L ${ox + w},${oy + h} L ${ox},${oy + h} Z" ${styleStr}/>`;
    } else if (shape === "trapezoid") {
      const ins = w * 0.18;
      shapeEl = `<path d="M ${ox + ins},${oy} L ${ox + w - ins},${oy} L ${ox + w},${oy + h} L ${ox},${oy + h} Z" ${styleStr}/>`;
    } else if (shape.includes("half")) {
      shapeEl = `<path d="M ${ox},${oy + h} A ${w / 2},${h} 0 0 1 ${ox + w},${oy + h} Z" ${styleStr}/>`;
    } else {
      shapeEl = `<rect x="${ox}" y="${oy}" width="${w}" height="${h}" ${styleStr}/>`;
    }

    // Grain line arrow
    let grainEl = "";
    if (piece.grain_direction) {
      const gx1 = ox + w / 2; const gy1 = oy + h * 0.2;
      const gx2 = ox + w / 2; const gy2 = oy + h * 0.8;
      grainEl = `<line x1="${gx1}" y1="${gy1}" x2="${gx2}" y2="${gy2}" stroke="#1e40af" stroke-width="1.5" marker-end="url(#arrow)"/>`;
    }

    // Fold indicator
    let foldEl = "";
    if (piece.fold_edge && piece.fold_edge !== "none") {
      const fe = piece.fold_edge;
      const x1 = fe === "right" ? ox + w : ox; const y1 = fe === "bottom" ? oy + h : oy;
      const x2 = fe === "right" ? ox + w : (fe === "left" ? ox : ox + w); const y2 = fe === "bottom" ? oy + h : (fe === "top" ? oy : oy + h);
      foldEl = `<line x1="${fe === "top" || fe === "bottom" ? ox : x1}" y1="${fe === "left" || fe === "right" ? oy : y1}" x2="${fe === "top" || fe === "bottom" ? ox + w : x1}" y2="${fe === "left" || fe === "right" ? oy + h : y1}" stroke="#f97316" stroke-width="3"/>
        <text x="${fe === "left" || fe === "right" ? x1 + (fe === "left" ? -4 : 4) : ox + w / 2}" y="${fe === "top" || fe === "bottom" ? y1 - 4 : oy + h / 2}" font-size="10" fill="#f97316" font-family="sans-serif" text-anchor="${fe === "left" ? "end" : "middle"}">FOLD</text>`;
    }

    const label = `${piece.name.toUpperCase()} — Cut ${piece.quantity}${piece.cut_instruction ? " (" + piece.cut_instruction + ")" : ""}`;
    const saLabel = piece.seam_allowance_in ? ` | SA: ${piece.seam_allowance_in}"` : "";

    svgContent += `
      <text x="${MARGIN}" y="${y + 16}" font-size="13" font-weight="bold" fill="#0f172a" font-family="sans-serif">${label}</text>
      <text x="${MARGIN}" y="${y + LABEL_H - 2}" font-size="10" fill="#64748b" font-family="sans-serif">${piece.width_in}" W × ${piece.height_in}" H${saLabel}</text>
      ${shapeEl}${grainEl}${foldEl}
      <text x="${ox + w / 2}" y="${oy + h / 2}" text-anchor="middle" font-size="10" fill="#1e40af" font-family="sans-serif">${piece.width_in}" × ${piece.height_in}"</text>
    `;
    y += h + LABEL_H + MARGIN;
  }

  const totalH = y + MARGIN;
  const html = `<!DOCTYPE html>
<html><head><title>${title} — Pattern Pieces</title>
<style>
  @media print { body { margin: 0; } .no-print { display: none; } }
  body { font-family: sans-serif; background: #fff; margin: 0; padding: 16px; }
  .no-print { padding: 12px; background: #f1f5f9; border-radius: 8px; margin-bottom: 16px; font-size: 13px; }
  .no-print button { padding: 8px 20px; background: #2563eb; color: #fff; border: none; border-radius: 6px; cursor: pointer; font-size: 14px; margin-left: 12px; }
</style></head>
<body>
<div class="no-print">
  <strong>🖨️ Printing tips:</strong> Set paper size to Letter (8.5" × 11"). Scale: 100% (do not "fit to page"). Each 96 pixels = 1 inch.
  <button onclick="window.print()">Print Now</button>
</div>
<svg width="${pageW}" height="${totalH}" viewBox="0 0 ${pageW} ${totalH}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto">
      <path d="M0,0 L0,6 L6,3 Z" fill="#1e40af"/>
    </marker>
  </defs>
  <text x="${MARGIN}" y="28" font-size="18" font-weight="bold" fill="#0f172a" font-family="sans-serif">${title} — Pattern Pieces</text>
  <text x="${MARGIN}" y="46" font-size="11" fill="#64748b" font-family="sans-serif">Print at 100% scale. Verify 1" square before cutting.</text>
  <!-- 1" reference square -->
  <rect x="${pageW - MARGIN - 96}" y="16" width="96" height="96" fill="none" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3 2"/>
  <text x="${pageW - MARGIN - 48}" y="120" text-anchor="middle" font-size="9" fill="#94a3b8" font-family="sans-serif">1" × 1" check</text>
  <line x1="${MARGIN}" y1="60" x2="${pageW - MARGIN}" y2="60" stroke="#e2e8f0" stroke-width="1"/>
  ${svgContent}
</svg>
</body></html>`;

  const win = window.open("", "_blank");
  if (win) { win.document.write(html); win.document.close(); }
}

interface PatternPieceExt extends PatternPiece {
  assembly_note?: string;
}

interface MeasurementExt extends ProjectMeasurement {
  category?: "fitting" | "finished" | "pattern" | "hardware" | "seam" | "adjustment";
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
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
                <Scissors className="h-4.5 w-4.5 text-brand-blue-500" />
                Pattern Pieces
              </h2>
              <p className="mt-1 text-xs text-slate-400">
                Shapes shown to scale. Dashed outlines = cut lines. Orange edge = fold line.
              </p>
            </div>
            <button
              onClick={() => printPatternPieces(patternPieces, "Pattern")}
              className="flex shrink-0 items-center gap-1.5 rounded-xl border border-brand-blue-200 bg-brand-blue-50 px-3 py-1.5 text-xs font-semibold text-brand-blue-700 hover:bg-brand-blue-100 transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              Print Pattern
            </button>
          </div>

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
