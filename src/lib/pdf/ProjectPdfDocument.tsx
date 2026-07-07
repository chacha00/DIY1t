import {
  Document, Page, Text, View, Image, StyleSheet,
  Svg, Rect, Line, Polygon, G,
} from "@react-pdf/renderer";
import type { Project, PatternPiece } from "@/types/database";

const C = {
  navy: "#0f172a",
  blue: "#2186eb",
  teal: "#0d9488",
  orange: "#f97316",
  purple: "#7c3aed",
  red: "#dc2626",
  slate400: "#94a3b8",
  slate500: "#64748b",
  slate600: "#475569",
  slate800: "#1e293b",
  blueLight: "#dbeafe",
  tealLight: "#ccfbf1",
  orangeLight: "#fff7ed",
  redLight: "#fef2f2",
  grayBg: "#f8fafc",
  border: "#e2e8f0",
};

const PIECE_COLORS = [C.blue, C.teal, C.orange, C.purple, C.red, "#0891b2"];

const s = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: C.navy, backgroundColor: "#ffffff" },
  header: { marginBottom: 14, borderBottom: `2pt solid ${C.blue}`, paddingBottom: 10 },
  brand: { fontSize: 9, color: C.blue, fontWeight: 700, marginBottom: 3 },
  title: { fontSize: 19, fontWeight: 700 },
  metaRow: { flexDirection: "row", gap: 14, marginTop: 6 },
  metaItem: { fontSize: 8.5, color: C.slate500 },

  sec: { fontSize: 12, fontWeight: 700, marginTop: 16, marginBottom: 7, color: C.navy, borderBottom: `0.5pt solid ${C.border}`, paddingBottom: 3 },

  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
  materialName: { fontSize: 9.5, fontWeight: 700 },
  materialQty: { fontSize: 8.5, color: C.slate500, marginTop: 1 },
  materialCost: { fontSize: 10, fontWeight: 700, color: C.teal },
  checkbox: { width: 9, height: 9, border: `1pt solid ${C.slate400}`, marginRight: 6, marginTop: 1.5 },

  step: { marginBottom: 9, flexDirection: "row", gap: 8 },
  stepNum: { width: 17, height: 17, borderRadius: 9, backgroundColor: C.teal, color: "#fff", fontSize: 8.5, fontWeight: 700, textAlign: "center", paddingTop: 3.5 },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  stepDesc: { fontSize: 8.5, color: C.slate600, lineHeight: 1.45 },
  stepMeta: { fontSize: 8, color: C.slate400, marginTop: 2 },

  pill: { fontSize: 7.5, backgroundColor: C.blueLight, color: C.blue, paddingHorizontal: 5, paddingVertical: 2.5, borderRadius: 3, marginRight: 4, marginBottom: 4 },
  pillRow: { flexDirection: "row", flexWrap: "wrap" },

  warn: { fontSize: 8.5, color: "#9a3412", marginBottom: 3.5, paddingLeft: 6 },

  measureRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottom: `0.5pt solid ${C.grayBg}` },
  measureLabel: { fontSize: 8.5, color: C.slate500, flex: 1 },
  measureValue: { fontSize: 8.5, fontWeight: 700, color: C.navy },

  abbrevRow: { flexDirection: "row", gap: 4, marginBottom: 3 },
  abbrevTerm: { fontSize: 8.5, fontWeight: 700, color: C.blue, width: 50 },
  abbrevDef: { fontSize: 8.5, color: C.slate600, flex: 1 },

  sizeTable: { marginTop: 4 },
  sizeHeader: { flexDirection: "row", backgroundColor: C.navy, padding: "4pt 6pt" },
  sizeHeaderCell: { fontSize: 7.5, fontWeight: 700, color: "#ffffff", flex: 1 },
  sizeRow: { flexDirection: "row", padding: "3.5pt 6pt", borderBottom: `0.5pt solid ${C.border}` },
  sizeCell: { fontSize: 7.5, color: C.slate600, flex: 1 },
  sizeCellBold: { fontSize: 7.5, fontWeight: 700, color: C.navy, flex: 1 },

  fabricRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottom: `0.5pt solid ${C.grayBg}` },
  fabricComp: { fontSize: 8.5, flex: 2 },
  fabricYards: { fontSize: 8.5, fontWeight: 700, color: C.blue, flex: 1, textAlign: "right" },
  fabricNotes: { fontSize: 7.5, color: C.slate400, flex: 2, textAlign: "right" },

  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 6, marginBottom: 4 },
  checkBox: { width: 10, height: 10, border: `1pt solid ${C.slate400}`, marginTop: 1 },
  checkText: { fontSize: 8.5, color: C.slate600, flex: 1, lineHeight: 1.4 },

  tipItem: { fontSize: 8.5, color: C.slate600, marginBottom: 3.5, paddingLeft: 8, lineHeight: 1.4 },

  previewImage: { width: "100%", height: 200, objectFit: "cover", borderRadius: 6, marginBottom: 14 },
  footer: { position: "absolute", bottom: 20, left: 36, right: 36, fontSize: 7.5, color: C.slate400, textAlign: "center" },
});

function formatCents(cents: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}
function formatMinutes(minutes: number | null) {
  if (!minutes) return "—";
  return minutes < 60 ? `${minutes} min` : `${(minutes / 60).toFixed(1)} hrs`;
}

// ── Pattern piece SVG (scaled for PDF page) ──────────────────────────────────
function PatternPieceSvg({ piece, index }: { piece: PatternPiece; index: number }) {
  const color = PIECE_COLORS[index % PIECE_COLORS.length];
  const scale = 28; // PDF display scale: 28 pts per inch ≈ half-page size
  const sa = (piece.seam_allowance_in ?? 0.625) * scale;
  const pw = Math.min(piece.width_in * scale, 160);
  const ph = Math.min(piece.height_in * scale, 100);
  const totalW = pw + 2 * sa + 16;
  const totalH = ph + 2 * sa + 16;
  const ox = sa + 8;
  const oy = sa + 8;

  return (
    <Svg width={totalW} height={totalH} viewBox={`0 0 ${totalW} ${totalH}`}>
      {/* Seam allowance dashed outline */}
      <Rect x={ox - sa} y={oy - sa} width={pw + 2 * sa} height={ph + 2 * sa}
        fill="none" stroke={color} strokeWidth={0.5} strokeDasharray="3 2" opacity={0.4} rx={2} />
      {/* Piece fill */}
      <Rect x={ox} y={oy} width={pw} height={ph}
        fill="#f0f9ff" fillOpacity={0.5} stroke={color} strokeWidth={1.5} rx={2} />
      {/* Grain line */}
      <Line x1={ox + pw * 0.2} y1={oy + ph / 2} x2={ox + pw * 0.8} y2={oy + ph / 2}
        stroke="#64748b" strokeWidth={0.8} />
      <Polygon
        points={`${ox + pw * 0.8},${oy + ph / 2 - 3} ${ox + pw * 0.8 + 6},${oy + ph / 2} ${ox + pw * 0.8},${oy + ph / 2 + 3}`}
        fill="#64748b" />
      <Polygon
        points={`${ox + pw * 0.2},${oy + ph / 2 - 3} ${ox + pw * 0.2 - 6},${oy + ph / 2} ${ox + pw * 0.2},${oy + ph / 2 + 3}`}
        fill="#64748b" />
      {/* Fold edge */}
      {piece.fold_edge && piece.fold_edge !== "none" && (() => {
        const coords: Record<string, [number, number, number, number]> = {
          top:    [ox,      oy,      ox + pw, oy],
          bottom: [ox,      oy + ph, ox + pw, oy + ph],
          left:   [ox,      oy,      ox,      oy + ph],
          right:  [ox + pw, oy,      ox + pw, oy + ph],
        };
        const [x1, y1, x2, y2] = coords[piece.fold_edge] ?? [0, 0, 0, 0];
        return <Line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#dc2626" strokeWidth={2} strokeDasharray="6 3" />;
      })()}
      {/* Notches */}
      {(piece.notches ?? []).map((n, ni) => {
        const pct = n.position_pct / 100;
        let nx = 0, ny = 0;
        switch (n.edge) {
          case "top":    nx = ox + pw * pct; ny = oy;      break;
          case "bottom": nx = ox + pw * pct; ny = oy + ph; break;
          case "left":   nx = ox;            ny = oy + ph * pct; break;
          case "right":  nx = ox + pw;       ny = oy + ph * pct; break;
        }
        return <Polygon key={ni}
          points={`${nx - 3},${ny} ${nx + 3},${ny} ${nx},${ny - 7}`}
          fill={color} />;
      })}
    </Svg>
  );
}

// ── Main document ─────────────────────────────────────────────────────────────
export function ProjectPdfDocument({
  project,
  kind,
  previewImageUrl,
}: {
  project: Project;
  kind: "instructions" | "shopping_list";
  previewImageUrl?: string | null;
}) {
  const pp = project.pattern_pieces ?? [];
  const hasSewing = pp.length > 0;

  return (
    <Document title={project.title}>
      {/* ── PAGE 1: Cover + Materials ── */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.brand}>DIY1T.com — See It. Build It. Make It Yourself.</Text>
          <Text style={s.title}>{project.title}</Text>
          <View style={s.metaRow}>
            <Text style={s.metaItem}>Difficulty: {project.difficulty}</Text>
            <Text style={s.metaItem}>Time: {formatMinutes(project.estimated_time_minutes)}</Text>
            <Text style={s.metaItem}>DIY Cost: {formatCents(project.estimated_cost_cents)}</Text>
            {project.retail_price_cents != null && (
              <Text style={s.metaItem}>Retail: {formatCents(project.retail_price_cents)}</Text>
            )}
            {project.money_saved_cents != null && (
              <Text style={[s.metaItem, { color: C.teal, fontWeight: 700 }]}>
                You Save: {formatCents(project.money_saved_cents)}
              </Text>
            )}
          </View>
        </View>

        {previewImageUrl && <Image src={previewImageUrl} style={s.previewImage} />}

        {project.assembly_overview && (
          <>
            <Text style={s.sec}>Overview</Text>
            <Text style={{ fontSize: 9.5, color: C.slate600, lineHeight: 1.5, marginBottom: 4 }}>
              {project.assembly_overview}
            </Text>
          </>
        )}

        {/* Fabric Requirements */}
        {(project as any).fabric_requirements?.length > 0 && (
          <>
            <Text style={s.sec}>Fabric Requirements</Text>
            <View style={{ flexDirection: "row", backgroundColor: C.grayBg, padding: "4pt 6pt" }}>
              <Text style={{ fontSize: 7.5, fontWeight: 700, flex: 2 }}>Component</Text>
              <Text style={{ fontSize: 7.5, fontWeight: 700, flex: 1, textAlign: "right" }}>Amount</Text>
              <Text style={{ fontSize: 7.5, fontWeight: 700, flex: 2, textAlign: "right" }}>Notes</Text>
            </View>
            {(project as any).fabric_requirements.map((fr: any, i: number) => (
              <View key={i} style={s.fabricRow}>
                <Text style={s.fabricComp}>{fr.component}</Text>
                <Text style={s.fabricYards}>{fr.yards}</Text>
                <Text style={s.fabricNotes}>{fr.notes ?? ""}</Text>
              </View>
            ))}
          </>
        )}

        {/* Abbreviations */}
        {(project as any).abbreviations?.length > 0 && (
          <>
            <Text style={s.sec}>Abbreviations</Text>
            <View style={s.pillRow}>
              {(project as any).abbreviations.map((ab: any, i: number) => (
                <View key={i} style={s.abbrevRow}>
                  <Text style={s.abbrevTerm}>{ab.term}</Text>
                  <Text style={s.abbrevDef}>{ab.definition}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Materials */}
        <Text style={s.sec}>Materials &amp; Shopping List</Text>
        {project.materials.map((item, i) => (
          <View key={i} style={s.row}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <View style={s.checkbox} />
              <View>
                <Text style={s.materialName}>{item.name}</Text>
                <Text style={s.materialQty}>{item.quantity}{item.unit ? ` ${item.unit}` : ""}</Text>
              </View>
            </View>
            <Text style={s.materialCost}>{formatCents(item.cost_cents)}</Text>
          </View>
        ))}

        {/* Tools */}
        {kind === "instructions" && project.tools?.length > 0 && (
          <>
            <Text style={s.sec}>Required Tools</Text>
            <View style={s.pillRow}>
              {project.tools.map((tool, i) => (
                <Text key={i} style={s.pill}>{tool.name}{!tool.required ? " (optional)" : ""}</Text>
              ))}
            </View>
          </>
        )}

        <Text style={s.footer} fixed>
          Generated by DIY1T.com — AI-generated original pattern — not a copy of any commercial product · diy1t.com
        </Text>
      </Page>

      {/* ── PAGE 2: Pattern Pieces + Measurements ── */}
      {(hasSewing || (project.measurements?.length ?? 0) > 0 || (project as any).size_chart?.length > 0) && (
        <Page size="A4" style={s.page}>
          {hasSewing && (
            <>
              <Text style={s.sec}>Pattern Pieces</Text>
              <Text style={{ fontSize: 8, color: C.slate400, marginBottom: 8 }}>
                Download SVG files from diy1t.com/dashboard for printable full-size pattern pieces.
                Seam allowances are included. Dashed line = seam allowance outline. Red dashed = cut on fold.
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {pp.map((piece: PatternPiece, i: number) => (
                  <View key={i} style={{ width: "47%", marginBottom: 10 }}>
                    <PatternPieceSvg piece={piece} index={i} />
                    <Text style={{ fontSize: 8.5, fontWeight: 700, marginTop: 4 }}>{piece.name}</Text>
                    <Text style={{ fontSize: 7.5, color: PIECE_COLORS[i % PIECE_COLORS.length] }}>
                      {piece.cut_instruction ?? `Cut ${piece.quantity}`}
                    </Text>
                    <Text style={{ fontSize: 7.5, color: C.slate500 }}>
                      {piece.width_in}" × {piece.height_in}"
                      {piece.seam_allowance_in != null ? `  ·  SA: ${piece.seam_allowance_in}"` : ""}
                    </Text>
                    {piece.grain_direction && (
                      <Text style={{ fontSize: 7, color: C.slate400 }}>{piece.grain_direction}</Text>
                    )}
                    {piece.notes && (
                      <Text style={{ fontSize: 7, color: "#9a3412", marginTop: 2 }}>{piece.notes}</Text>
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {project.measurements?.length > 0 && (
            <>
              <Text style={s.sec}>Measurements</Text>
              {project.measurements.map((m, i) => (
                <View key={i} style={s.measureRow}>
                  <Text style={s.measureLabel}>{m.label}</Text>
                  <Text style={s.measureValue}>{m.value}</Text>
                </View>
              ))}
            </>
          )}

          {/* Size Chart */}
          {(project as any).size_chart?.length > 0 && (
            <>
              <Text style={s.sec}>Size Chart</Text>
              <View style={s.sizeTable}>
                <View style={s.sizeHeader}>
                  {["Size", "Chest", "Neck", "Back", "Weight", "Breeds / Notes"].map(h => (
                    <Text key={h} style={s.sizeHeaderCell}>{h}</Text>
                  ))}
                </View>
                {(project as any).size_chart.map((row: any, i: number) => (
                  <View key={i} style={[s.sizeRow, i % 2 === 0 ? { backgroundColor: C.grayBg } : {}]}>
                    <Text style={s.sizeCellBold}>{row.size_name}</Text>
                    <Text style={s.sizeCell}>{row.chest_in}"</Text>
                    <Text style={s.sizeCell}>{row.neck_in}"</Text>
                    <Text style={s.sizeCell}>{row.back_in}"</Text>
                    <Text style={s.sizeCell}>{row.weight_lbs} lbs</Text>
                    <Text style={s.sizeCell}>
                      {Array.isArray(row.breed_examples) ? row.breed_examples.join(", ") : ""}
                      {row.notes ? ` · ${row.notes}` : ""}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}

          <Text style={s.footer} fixed>
            Generated by DIY1T.com — diy1t.com
          </Text>
        </Page>
      )}

      {/* ── PAGE 3: Step-by-Step Instructions ── */}
      {kind === "instructions" && (
        <Page size="A4" style={s.page}>
          <Text style={s.sec}>Step-by-Step Instructions</Text>
          {project.steps
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <View key={step.order} style={s.step}>
                <Text style={s.stepNum}>{step.order}</Text>
                <View style={s.stepText}>
                  <Text style={s.stepTitle}>{step.title}</Text>
                  <Text style={s.stepDesc}>{step.description}</Text>
                  {step.quality_checkpoint && (
                    <Text style={[s.stepMeta, { color: C.teal }]}>✓ {step.quality_checkpoint}</Text>
                  )}
                  {step.pro_tip && (
                    <Text style={[s.stepMeta, { color: C.blue }]}>💡 {step.pro_tip}</Text>
                  )}
                  {(step as any).technique_note && (
                    <Text style={[s.stepMeta, { color: C.orange }]}>🧵 {(step as any).technique_note}</Text>
                  )}
                  {step.common_mistake && (
                    <Text style={[s.stepMeta, { color: "#9a3412" }]}>⚠ {step.common_mistake}</Text>
                  )}
                </View>
              </View>
            ))}

          {/* Beginner Tips */}
          {(project as any).beginner_tips?.length > 0 && (
            <>
              <Text style={s.sec}>Beginner Tips</Text>
              {(project as any).beginner_tips.map((tip: string, i: number) => (
                <Text key={i} style={s.tipItem}>• {tip}</Text>
              ))}
            </>
          )}

          {/* Safety Warnings */}
          {project.safety_warnings?.length > 0 && (
            <>
              <Text style={s.sec}>Safety Warnings</Text>
              {project.safety_warnings.map((w, i) => (
                <Text key={i} style={s.warn}>• {w}</Text>
              ))}
            </>
          )}

          {/* Fit Checklist */}
          {(project as any).fit_checklist?.length > 0 && (
            <>
              <Text style={s.sec}>Final Fit Checklist</Text>
              {(project as any).fit_checklist.map((item: string, i: number) => (
                <View key={i} style={s.checkRow}>
                  <View style={s.checkBox} />
                  <Text style={s.checkText}>{item}</Text>
                </View>
              ))}
            </>
          )}

          <Text style={s.footer} fixed>
            Generated by DIY1T.com — AI-generated original pattern — not a copy of any commercial product · diy1t.com
          </Text>
        </Page>
      )}
    </Document>
  );
}
