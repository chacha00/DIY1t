import { Document, Page, Text, View, Image, StyleSheet, Svg, Rect } from "@react-pdf/renderer";
import type { Project, PatternPiece } from "@/types/database";

const styles = StyleSheet.create({
  page: { padding: 36, fontSize: 10, fontFamily: "Helvetica", color: "#0f172a" },
  header: { marginBottom: 16, borderBottom: "2pt solid #2186eb", paddingBottom: 12 },
  brand: { fontSize: 10, color: "#2186eb", fontWeight: 700, marginBottom: 4 },
  title: { fontSize: 20, fontWeight: 700 },
  metaRow: { flexDirection: "row", gap: 16, marginTop: 8 },
  metaItem: { fontSize: 9, color: "#64748b" },
  sectionTitle: { fontSize: 13, fontWeight: 700, marginTop: 18, marginBottom: 8, color: "#0f172a" },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  materialName: { fontSize: 10, fontWeight: 700 },
  materialQty: { fontSize: 9, color: "#64748b" },
  materialCost: { fontSize: 10, fontWeight: 700 },
  step: { marginBottom: 10, flexDirection: "row", gap: 8 },
  stepNumber: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#0d9488",
    color: "#ffffff",
    fontSize: 9,
    fontWeight: 700,
    textAlign: "center",
    paddingTop: 4,
  },
  stepText: { flex: 1 },
  stepTitle: { fontSize: 10, fontWeight: 700, marginBottom: 2 },
  stepDescription: { fontSize: 9, color: "#475569", lineHeight: 1.4 },
  toolPill: {
    fontSize: 8,
    backgroundColor: "#eff8ff",
    color: "#1267c4",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  toolRow: { flexDirection: "row", flexWrap: "wrap" },
  warning: { fontSize: 9, color: "#9a3412", marginBottom: 4 },
  footer: { position: "absolute", bottom: 24, left: 36, right: 36, fontSize: 8, color: "#94a3b8", textAlign: "center" },
  checkbox: { width: 9, height: 9, border: "1pt solid #94a3b8", marginRight: 6, marginTop: 1 },
  previewImage: { width: "100%", height: 220, objectFit: "cover", borderRadius: 8, marginBottom: 16 },
  patternGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  patternBox: { border: "1pt solid #2186eb", borderRadius: 4, padding: 6, width: 120, marginBottom: 4 },
  patternLabel: { fontSize: 8, fontWeight: 700, marginBottom: 2 },
  patternDim: { fontSize: 7, color: "#64748b" },
  patternNote: { fontSize: 7, color: "#9a3412", marginTop: 2 },
  measureRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 3, borderBottom: "0.5pt solid #f1f5f9" },
  measureLabel: { fontSize: 9, color: "#475569" },
  measureValue: { fontSize: 9, fontWeight: 700, color: "#0f172a" },
});

function formatCents(cents: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(2)}`;
}

function formatMinutes(minutes: number | null) {
  if (minutes == null) return "—";
  if (minutes < 60) return `${minutes} min`;
  return `${(minutes / 60).toFixed(1)} hrs`;
}

export function ProjectPdfDocument({ project, kind, previewImageUrl }: { project: Project; kind: "instructions" | "shopping_list"; previewImageUrl?: string | null }) {
  return (
    <Document title={project.title}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>DIY1T.com — See It. Build It. Make It Yourself.</Text>
          <Text style={styles.title}>{project.title}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>Difficulty: {project.difficulty}</Text>
            <Text style={styles.metaItem}>Time: {formatMinutes(project.estimated_time_minutes)}</Text>
            <Text style={styles.metaItem}>Cost: {formatCents(project.estimated_cost_cents)}</Text>
            {project.retail_price_cents != null && (
              <Text style={styles.metaItem}>Retail: {formatCents(project.retail_price_cents)}</Text>
            )}
          </View>
        </View>

        {previewImageUrl && (
          <Image src={previewImageUrl} style={styles.previewImage} />
        )}

        {project.measurements?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Measurements</Text>
            {project.measurements.map((m, i) => (
              <View key={i} style={styles.measureRow}>
                <Text style={styles.measureLabel}>{m.label}</Text>
                <Text style={styles.measureValue}>{m.value}</Text>
              </View>
            ))}
          </>
        )}

        {project.pattern_pieces?.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Pattern Pieces</Text>
            <View style={styles.patternGrid}>
              {project.pattern_pieces.map((piece: PatternPiece, i: number) => (
                <View key={i} style={styles.patternBox}>
                  <Svg width={100} height={50} viewBox="0 0 100 50">
                    <Rect x={2} y={2} width={96} height={46} fill="#dbeafe" stroke="#2186eb" strokeWidth={1} rx={2} />
                  </Svg>
                  <Text style={styles.patternLabel}>{piece.name}</Text>
                  <Text style={styles.patternDim}>
                    {piece.width_in}" × {piece.height_in}" · ×{piece.quantity}
                    {piece.shape && piece.shape !== "rectangle" ? ` (${piece.shape})` : ""}
                  </Text>
                  {piece.notes && <Text style={styles.patternNote}>📌 {piece.notes}</Text>}
                </View>
              ))}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Materials & Shopping List</Text>
        {project.materials.map((item, i) => (
          <View key={i} style={styles.row}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <View style={styles.checkbox} />
              <View>
                <Text style={styles.materialName}>{item.name}</Text>
                <Text style={styles.materialQty}>
                  {item.quantity} {item.unit ?? ""}
                </Text>
              </View>
            </View>
            <Text style={styles.materialCost}>{formatCents(item.cost_cents)}</Text>
          </View>
        ))}

        {kind === "instructions" && (
          <>
            <Text style={styles.sectionTitle}>Required Tools</Text>
            <View style={styles.toolRow}>
              {project.tools.map((tool, i) => (
                <Text key={i} style={styles.toolPill}>
                  {tool.name}
                  {!tool.required ? " (optional)" : ""}
                </Text>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
            {project.steps
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <View key={step.order} style={styles.step}>
                  <Text style={styles.stepNumber}>{step.order}</Text>
                  <View style={styles.stepText}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                </View>
              ))}

            {project.safety_warnings.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Safety Warnings</Text>
                {project.safety_warnings.map((warning, i) => (
                  <Text key={i} style={styles.warning}>
                    • {warning}
                  </Text>
                ))}
              </>
            )}
          </>
        )}

        <Text style={styles.footer} fixed>
          Generated by DIY1T.com — AI-generated DIY guides are original designs and never copy copyrighted patterns or branded products.
        </Text>
      </Page>
    </Document>
  );
}
