import type { PatternPieceOpening } from "@/types/database";

const CURVE_FACTORS: Record<string, [number, number]> = {
  shallow: [0.35, 0.65],
  standard: [0.25, 0.75],
  deep: [0.15, 0.85],
};

type Edge = "top" | "right" | "bottom" | "left";

/**
 * Builds an SVG path `d` string for a pattern piece's solid outline: a rectangle
 * whose edges are replaced by an inward curve wherever an opening is specified
 * (armholes, neck holes, leg holes). Pure function — no DOM/Node APIs — usable
 * from browser JSX, react-pdf <Path>, and raw SVG string templates alike.
 *
 * Always render the result with fillRule="evenodd" (or fill-rule for raw SVG
 * strings) so "center" openings punch a true hole regardless of winding direction.
 *
 * scaleX/scaleY are passed separately (not a single `scale`) because some call
 * sites clamp the drawn pixel size for very small or oversized pieces — passing
 * the *effective* per-axis scale keeps opening geometry consistent with however
 * big the rectangle is actually drawn.
 */
export function buildPieceOutlineD(
  widthIn: number,
  heightIn: number,
  scaleX: number,
  scaleY: number,
  ox: number,
  oy: number,
  openings: PatternPieceOpening[] = []
): string {
  const pw = widthIn * scaleX;
  const ph = heightIn * scaleY;

  const edgeOpenings = (edge: Edge) =>
    (openings ?? []).filter((o) => o.edge === edge);

  // Emits "L ... C ..." segments replacing the flat part of one edge with dips
  // for each opening, walking the edge in the direction given by walkIncreasing.
  function edgeSegment(
    opens: PatternPieceOpening[],
    edgeLen: number,
    axisIsX: boolean, // true: position varies along x (top/bottom edges)
    fixedCoord: number, // the constant coordinate along this edge (oy for top/bottom, ox/ox+pw for left/right)
    originCoord: number, // absolute coordinate corresponding to position_pct = 0
    walkIncreasing: boolean, // true if traversing this edge in the same direction position_pct increases
    depthAxisIsX: boolean, // true: the dip moves along x (left/right edges)
    depthSign: 1 | -1 // direction of "into the piece" along the depth axis
  ): string {
    const sorted = [...opens].sort((a, b) =>
      walkIncreasing
        ? (a.position_pct ?? 50) - (b.position_pct ?? 50)
        : (b.position_pct ?? 50) - (a.position_pct ?? 50)
    );

    let d = "";
    for (const o of sorted) {
      const half = (o.width_in * (axisIsX ? scaleX : scaleY)) / 2;
      const center = ((o.position_pct ?? 50) / 100) * edgeLen;
      const t0 = Math.max(0, center - half);
      const t1 = Math.min(edgeLen, center + half);
      const depth = o.depth_in * (depthAxisIsX ? scaleX : scaleY) * depthSign;
      const [f1, f2] = CURVE_FACTORS[o.curve ?? "standard"];

      const first = walkIncreasing ? t0 : t1;
      const last = walkIncreasing ? t1 : t0;
      const span = last - first;
      const p = (t: number) => originCoord + t;

      if (axisIsX) {
        const cx1 = p(first + span * f1);
        const cx2 = p(first + span * f2);
        d += ` L ${p(first)},${fixedCoord}`;
        d += ` C ${cx1},${fixedCoord + depth} ${cx2},${fixedCoord + depth} ${p(last)},${fixedCoord}`;
      } else {
        const cy1 = p(first + span * f1);
        const cy2 = p(first + span * f2);
        d += ` L ${fixedCoord},${p(first)}`;
        d += ` C ${fixedCoord + depth},${cy1} ${fixedCoord + depth},${cy2} ${fixedCoord},${p(last)}`;
      }
    }
    return d;
  }

  let d = `M ${ox},${oy}`; // start top-left, walk clockwise: TL -> TR -> BR -> BL -> Z

  // top edge: TL -> TR; travel = increasing x = same direction as position_pct; dip = +y (down, into piece)
  d += edgeSegment(edgeOpenings("top"), pw, true, oy, ox, true, false, 1);
  d += ` L ${ox + pw},${oy}`;

  // right edge: TR -> BR; travel = increasing y = same direction as position_pct; dip = -x (left, into piece)
  d += edgeSegment(edgeOpenings("right"), ph, false, ox + pw, oy, true, true, -1);
  d += ` L ${ox + pw},${oy + ph}`;

  // bottom edge: BR -> BL; travel = decreasing x = opposite of position_pct direction; dip = -y (up, into piece)
  d += edgeSegment(edgeOpenings("bottom"), pw, true, oy + ph, ox, false, false, -1);
  d += ` L ${ox},${oy + ph}`;

  // left edge: BL -> TL; travel = decreasing y = opposite of position_pct direction; dip = +x (right, into piece)
  d += edgeSegment(edgeOpenings("left"), ph, false, ox, oy, false, true, 1);
  d += ` L ${ox},${oy} Z`;

  // Center (enclosed) openings — separate closed ellipse sub-path via two arcs.
  // With fillRule="evenodd" on the caller's path, this renders as a true hole.
  for (const o of (openings ?? []).filter((x) => x.edge === "center")) {
    const cx = ox + pw / 2;
    const cy = oy + ph / 2;
    const rx = (o.width_in * scaleX) / 2;
    const ry = (o.depth_in * scaleY) / 2;
    d += ` M ${cx - rx},${cy}`;
    d += ` A ${rx},${ry} 0 1 0 ${cx + rx},${cy}`;
    d += ` A ${rx},${ry} 0 1 0 ${cx - rx},${cy}`;
    d += ` Z`;
  }

  return d;
}
