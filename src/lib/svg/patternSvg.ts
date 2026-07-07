import type { PatternPiece } from "@/types/database";

const PPI = 72; // points per inch — standard PDF/print resolution
const MARGIN = 40; // px margin around piece
const LABEL_AREA = 72; // px below piece for text labels

const PIECE_COLORS = ["#2186eb", "#0d9488", "#f97316", "#7c3aed", "#dc2626", "#0891b2"];

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function fmt(inches: number): string {
  const frac = inches % 1;
  const whole = Math.floor(inches);
  if (frac === 0) return `${whole}"`;
  if (Math.abs(frac - 0.625) < 0.01) return whole > 0 ? `${whole}⅝"` : `⅝"`;
  if (Math.abs(frac - 0.5) < 0.01) return whole > 0 ? `${whole}½"` : `½"`;
  if (Math.abs(frac - 0.25) < 0.01) return whole > 0 ? `${whole}¼"` : `¼"`;
  if (Math.abs(frac - 0.75) < 0.01) return whole > 0 ? `${whole}¾"` : `¾"`;
  return `${inches}"`;
}

/**
 * Generates a print-ready SVG for a single pattern piece.
 * At 72 units/inch, SVG dimensions match real print dimensions at 100% scale.
 * A 1" calibration square is included on piece index 0.
 */
export function generatePatternSvg(piece: PatternPiece, pieceIndex: number): string {
  const sa = (piece.seam_allowance_in ?? 0.625) * PPI;
  const pw = piece.width_in * PPI;  // piece width in points
  const ph = piece.height_in * PPI; // piece height in points

  const ox = MARGIN + sa; // piece origin x (inside seam allowance margin)
  const oy = MARGIN + sa + 28; // piece origin y (28 = header height)

  const testSquareH = pieceIndex === 0 ? PPI + 28 : 0;
  const svgW = pw + 2 * sa + 2 * MARGIN;
  const svgH = ph + 2 * sa + oy + LABEL_AREA + testSquareH;

  const color = PIECE_COLORS[pieceIndex % PIECE_COLORS.length];

  // ── Seam allowance outline (dashed) ──
  const saDash = `
    <rect x="${ox - sa}" y="${oy - sa}" width="${pw + 2 * sa}" height="${ph + 2 * sa}"
      fill="none" stroke="${esc(color)}" stroke-width="0.75" stroke-dasharray="5 3" opacity="0.45" rx="2"/>`;

  // ── Main piece rectangle ──
  const pieceRect = `
    <rect x="${ox}" y="${oy}" width="${pw}" height="${ph}"
      fill="#f0f9ff" fill-opacity="0.6" stroke="${esc(color)}" stroke-width="2" rx="3"/>`;

  // ── Grain line (horizontal arrow through center) ──
  const glY = oy + ph / 2;
  const glX1 = ox + pw * 0.15;
  const glX2 = ox + pw * 0.85;
  const grainLabel = esc(piece.grain_direction ?? "straight grain");
  const grainLine = `
    <line x1="${glX1}" y1="${glY}" x2="${glX2}" y2="${glY}" stroke="#475569" stroke-width="1.2"/>
    <polygon points="${glX2},${glY - 5} ${glX2 + 10},${glY} ${glX2},${glY + 5}" fill="#475569"/>
    <polygon points="${glX1},${glY - 5} ${glX1 - 10},${glY} ${glX1},${glY + 5}" fill="#475569"/>
    <text x="${(glX1 + glX2) / 2}" y="${glY - 9}" text-anchor="middle"
      font-size="9" fill="#475569" font-family="Helvetica, Arial, sans-serif">${grainLabel}</text>`;

  // ── Fold edge indicator ──
  let foldEdge = "";
  if (piece.fold_edge && piece.fold_edge !== "none") {
    let x1 = ox, y1 = oy, x2 = ox, y2 = oy;
    switch (piece.fold_edge) {
      case "top":    x1 = ox;      y1 = oy;      x2 = ox + pw; y2 = oy;      break;
      case "bottom": x1 = ox;      y1 = oy + ph; x2 = ox + pw; y2 = oy + ph; break;
      case "left":   x1 = ox;      y1 = oy;      x2 = ox;      y2 = oy + ph; break;
      case "right":  x1 = ox + pw; y1 = oy;      x2 = ox + pw; y2 = oy + ph; break;
    }
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const isVert = piece.fold_edge === "left" || piece.fold_edge === "right";
    foldEdge = `
      <line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="10 5"/>
      <text x="${midX + (isVert ? 10 : 0)}" y="${midY + (isVert ? 0 : -10)}"
        text-anchor="${isVert ? "start" : "middle"}" dominant-baseline="${isVert ? "middle" : "auto"}"
        font-size="9" font-weight="bold" fill="#dc2626" font-family="Helvetica, Arial, sans-serif">FOLD</text>`;
  }

  // ── Notch marks ──
  let notches = "";
  for (const notch of piece.notches ?? []) {
    const pct = notch.position_pct / 100;
    let nx = 0, ny = 0, angle = 0;
    switch (notch.edge) {
      case "top":    nx = ox + pw * pct; ny = oy;      angle = 0;   break;
      case "bottom": nx = ox + pw * pct; ny = oy + ph; angle = 180; break;
      case "left":   nx = ox;            ny = oy + ph * pct; angle = 270; break;
      case "right":  nx = ox + pw;       ny = oy + ph * pct; angle = 90;  break;
    }
    notches += `<polygon points="-5,0 5,0 0,-10"
      transform="translate(${nx},${ny}) rotate(${angle})"
      fill="${esc(color)}" stroke="white" stroke-width="0.5"/>`;
  }

  // ── 1-inch calibration square (first piece only) ──
  let testSquare = "";
  if (pieceIndex === 0) {
    const tsX = svgW - MARGIN - PPI;
    const tsY = svgH - LABEL_AREA - testSquareH + 8;
    testSquare = `
      <rect x="${tsX}" y="${tsY}" width="${PPI}" height="${PPI}"
        fill="none" stroke="#94a3b8" stroke-width="1"/>
      <text x="${tsX + PPI / 2}" y="${tsY - 6}" text-anchor="middle"
        font-size="8" fill="#94a3b8" font-family="Helvetica, Arial, sans-serif">1 in calibration square</text>
      <text x="${tsX + PPI / 2}" y="${tsY + PPI + 14}" text-anchor="middle"
        font-size="8" fill="#94a3b8" font-family="Helvetica, Arial, sans-serif">Print at 100% — do not scale to fit</text>`;
  }

  // ── Labels ──
  const labelY = oy + ph + sa + 16;
  const dimIn = `${fmt(piece.width_in)} × ${fmt(piece.height_in)}`;
  const dimCm = `${(piece.width_in * 2.54).toFixed(1)} × ${(piece.height_in * 2.54).toFixed(1)} cm`;
  const cutLabel = esc(piece.cut_instruction ?? `Cut ${piece.quantity}`);
  const saLabel = `Seam allowance: ${fmt(piece.seam_allowance_in ?? 0.625)} included`;

  const labels = `
    <text x="${ox + pw / 2}" y="${labelY}" text-anchor="middle"
      font-size="13" font-weight="bold" fill="#0f172a" font-family="Helvetica, Arial, sans-serif">${esc(piece.name)}</text>
    <text x="${ox + pw / 2}" y="${labelY + 17}" text-anchor="middle"
      font-size="11" fill="${esc(color)}" font-family="Helvetica, Arial, sans-serif">${cutLabel}</text>
    <text x="${ox + pw / 2}" y="${labelY + 31}" text-anchor="middle"
      font-size="10" fill="#64748b" font-family="Helvetica, Arial, sans-serif">${esc(dimIn)}  (${esc(dimCm)})</text>
    <text x="${ox + pw / 2}" y="${labelY + 44}" text-anchor="middle"
      font-size="9" fill="#94a3b8" font-family="Helvetica, Arial, sans-serif">${esc(saLabel)}</text>
    ${piece.notes ? `<text x="${ox + pw / 2}" y="${labelY + 57}" text-anchor="middle"
      font-size="9" fill="#9a3412" font-family="Helvetica, Arial, sans-serif">${esc(piece.notes)}</text>` : ""}`;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
  <title>${esc(piece.name)} — DIY1T Pattern Piece</title>
  <desc>Print at 100% scale. Seam allowance ${fmt(piece.seam_allowance_in ?? 0.625)} is included inside the outer dashed line.</desc>

  <rect width="${svgW}" height="${svgH}" fill="#ffffff"/>

  <!-- Header -->
  <text x="${MARGIN}" y="20" font-size="11" font-weight="bold" fill="#0f172a" font-family="Helvetica, Arial, sans-serif">DIY1T.com</text>
  <text x="${svgW - MARGIN}" y="20" text-anchor="end" font-size="9" fill="#94a3b8" font-family="Helvetica, Arial, sans-serif">Piece ${pieceIndex + 1} of pattern set</text>

  ${saDash}
  ${pieceRect}
  ${grainLine}
  ${foldEdge}
  ${notches}
  ${labels}
  ${testSquare}

  <!-- Footer -->
  <text x="${svgW / 2}" y="${svgH - 6}" text-anchor="middle"
    font-size="7" fill="#cbd5e1" font-family="Helvetica, Arial, sans-serif">
    Generated by DIY1T.com — original AI-generated pattern — not a copy of any commercial product
  </text>
</svg>`;
}

/** Returns all pattern pieces as SVG strings for a project */
export function generateAllPatternSvgs(pieces: PatternPiece[]): string[] {
  return pieces.map((piece, i) => generatePatternSvg(piece, i));
}
