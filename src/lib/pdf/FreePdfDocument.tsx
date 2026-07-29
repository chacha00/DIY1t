import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", backgroundColor: "#ffffff", padding: 0 },
  cover: { backgroundColor: "#1e40af", padding: 60, minHeight: "100%", justifyContent: "center" },
  coverTag: { fontSize: 10, color: "#93c5fd", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 },
  coverTitle: { fontSize: 36, fontFamily: "Helvetica-Bold", color: "#ffffff", lineHeight: 1.2, marginBottom: 12 },
  coverSub: { fontSize: 14, color: "#bfdbfe", lineHeight: 1.5, marginBottom: 40 },
  coverUrl: { fontSize: 11, color: "#60a5fa", borderTop: "1px solid #3b82f6", paddingTop: 16, marginTop: "auto" },
  body: { padding: "40 50" },
  sectionTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e40af", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 16, marginTop: 8 },
  projectCard: { marginBottom: 18, padding: "14 16", backgroundColor: "#f8fafc", borderRadius: 6, borderLeft: "3px solid #3b82f6" },
  projectNum: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#3b82f6", marginBottom: 3 },
  projectName: { fontSize: 12, fontFamily: "Helvetica-Bold", color: "#0f172a", marginBottom: 4 },
  projectDesc: { fontSize: 9, color: "#475569", lineHeight: 1.5, marginBottom: 6 },
  projectMeta: { flexDirection: "row", gap: 12 },
  metaItem: { fontSize: 8, color: "#64748b" },
  metaLabel: { fontFamily: "Helvetica-Bold" },
  tipBox: { backgroundColor: "#eff6ff", borderRadius: 6, padding: "14 16", marginTop: 8, marginBottom: 20 },
  tipTitle: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#1e40af", marginBottom: 6 },
  tipText: { fontSize: 9, color: "#1e3a8a", lineHeight: 1.5 },
  ctaBox: { backgroundColor: "#f97316", borderRadius: 8, padding: "20 24", margin: "20 0" },
  ctaTitle: { fontSize: 16, fontFamily: "Helvetica-Bold", color: "#ffffff", marginBottom: 6 },
  ctaText: { fontSize: 10, color: "#fff7ed", lineHeight: 1.5, marginBottom: 10 },
  ctaUrl: { fontSize: 10, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  footer: { position: "absolute", bottom: 24, left: 50, right: 50, flexDirection: "row", justifyContent: "space-between", borderTop: "1px solid #e2e8f0", paddingTop: 8 },
  footerText: { fontSize: 8, color: "#94a3b8" },
  twoCol: { flexDirection: "row", gap: 14 },
  col: { flex: 1 },
  pageNum: { fontSize: 8, color: "#94a3b8" },
});

const PROJECTS = [
  { name: "Padded Step-In Harness", desc: "A comfortable, adjustable harness with fleece lining and quick-release buckles. Perfect for everyday walks.", cost: "$12–18", time: "2.5 hrs", skill: "Beginner" },
  { name: "Orthopedic Bolster Dog Bed", desc: "Memory foam base with canvas cover and washable fleece lining bolsters. Your dog will never want to leave.", cost: "$25–35", time: "3 hrs", skill: "Beginner" },
  { name: "Cable-Knit Dog Sweater", desc: "A cozy ribbed pullover knit in bulky yarn with a belly flap and adjustable neck. Great for small breeds.", cost: "$10–15", time: "4 hrs", skill: "Intermediate" },
  { name: "Waterproof Rain Jacket", desc: "Ripstop nylon shell with fleece lining, velcro closures, and a D-ring opening for harness access.", cost: "$18–22", time: "3 hrs", skill: "Intermediate" },
  { name: "Reflective Safety Collar", desc: "Heavy-duty nylon webbing with reflective stitching, a quick-release buckle, and a sewn ID tag loop.", cost: "$5–8", time: "45 min", skill: "Beginner" },
  { name: "Rope Tug Toy", desc: "Braided cotton rope toy in three-strand design with knotted ends. Machine washable and dryer safe.", cost: "$2–4", time: "20 min", skill: "Beginner" },
  { name: "Snuffle Mat", desc: "Fleece strips tied through a rubber sink mat create a foraging puzzle that slows fast eaters and provides enrichment.", cost: "$8–12", time: "1.5 hrs", skill: "Beginner" },
  { name: "Travel Water Bottle & Bowl", desc: "Upcycled squeeze bottle fitted with a custom silicone-lined foldable bowl. No more stopping at the car.", cost: "$6–10", time: "30 min", skill: "Beginner" },
  { name: "No-Pull Training Vest", desc: "A front-clip padded vest harness that redirects pulling without pressure on the trachea.", cost: "$16–24", time: "3 hrs", skill: "Intermediate" },
  { name: "Elevated Food Station", desc: "Cedar plywood with two stainless steel bowl cutouts on adjustable-height legs. Reduces bloat and joint strain.", cost: "$20–30", time: "2 hrs", skill: "Beginner" },
  { name: "Fleece Tug & Toss Ball", desc: "Fleece strips braided around a rubber ball core. Satisfies tugging, chasing, and chewing in one toy.", cost: "$3–5", time: "30 min", skill: "Beginner" },
  { name: "Dog Bandana (Snap Closure)", desc: "Reversible cotton bandana with a sewn snap closure — slips over the collar or fastens directly.", cost: "$2–4", time: "20 min", skill: "Beginner" },
  { name: "Calming Anxiety Wrap", desc: "Stretchy jersey fabric wrap that applies gentle constant pressure. Similar to Thundershirt but custom-fitted.", cost: "$8–12", time: "1 hr", skill: "Beginner" },
  { name: "Treat Pouch & Belt Clip", desc: "Canvas pouch with magnetic closure, interior liner, and carabiner clip. Holds up to a cup of kibble.", cost: "$6–9", time: "1 hr", skill: "Beginner" },
  { name: "Car Seat Cover & Hammock", desc: "Waterproof oxford fabric car seat protector with door flap hammock design and headrest attachment straps.", cost: "$22–30", time: "2.5 hrs", skill: "Intermediate" },
  { name: "Backyard Agility Tunnel", desc: "PVC pipe frame with ripstop fabric tunnel, collapsible for storage. Diameter adjustable for any breed.", cost: "$30–40", time: "2 hrs", skill: "Beginner" },
  { name: "Slow-Feeder Insert", desc: "Silicone food-safe dividers fitted to any standard bowl that create maze-like channels to slow eating.", cost: "$4–6", time: "45 min", skill: "Beginner" },
  { name: "Waterproof Paw Balm", desc: "Beeswax, coconut oil, and shea butter balm in a DIY tin. Protects pads in winter salt and summer heat.", cost: "$5–8", time: "30 min", skill: "Beginner" },
  { name: "Fleece Cave Bed", desc: "Fleece sleeping bag with an open-top hood that dogs can crawl into. Machine washable and self-heating.", cost: "$12–16", time: "1.5 hrs", skill: "Beginner" },
  { name: "Mounted Wall Leash Hook", desc: "Cedar wood plaque with three stainless steel S-hooks, routed nameplate, and keyhole wall mount.", cost: "$10–14", time: "1 hr", skill: "Beginner" },
  { name: "Knotted Rope Collar", desc: "Paracord rope collar with a sliding knot closure. Adjustable and lightweight — great for puppies.", cost: "$3–5", time: "30 min", skill: "Beginner" },
  { name: "Paddling Pool Toy Basket", desc: "Cedar slatted crate with rope handles and a chalkboard label. Corrals toys, balls, and chews.", cost: "$15–20", time: "1.5 hrs", skill: "Beginner" },
  { name: "Crinkle Plush Squeaky Toy", desc: "Fleece outer with crinkle film and squeaker insert. Minimal stuffing for dogs who destuff toys.", cost: "$3–5", time: "30 min", skill: "Beginner" },
  { name: "DIY Grooming Arm & Table", desc: "PVC-frame grooming arm with noose and clamp that attaches to any table. Saves $200+ vs retail.", cost: "$18–24", time: "1 hr", skill: "Beginner" },
  { name: "Reversible Holiday Vest", desc: "Two-sided quilted vest with snap closures — festive fabric one side, solid the other. Fits any season.", cost: "$12–16", time: "2 hrs", skill: "Intermediate" },
];

export function FreePdfDocument(): React.ReactElement {
  return (
    <Document title="Top 25 Dog DIY Projects — DIY1T" author="DIY1T" subject="Free DIY guide for pet owners">
      {/* Cover page */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.cover}>
          <Text style={styles.coverTag}>Free Guide from DIY1T.com</Text>
          <Text style={styles.coverTitle}>Top 25 Dog{"\n"}DIY Projects</Text>
          <Text style={styles.coverSub}>
            Save up to 80% vs retail prices. Every project includes materials, estimated cost,
            build time, and skill level — so you can pick the perfect one and start today.
          </Text>
          <View style={styles.tipBox}>
            <Text style={styles.tipTitle}>💡 How to use this guide</Text>
            <Text style={styles.tipText}>
              Each project shows you the key details up front. When you're ready to build, visit
              DIY1T.com, upload a photo of any pet product, and our AI generates a complete
              step-by-step plan with patterns, measurements, and a shopping list — customized
              to your pet's exact size.
            </Text>
          </View>
          <Text style={styles.coverUrl}>diy1t.com · Start free — no credit card required</Text>
        </View>
      </Page>

      {/* Projects pages */}
      <Page size="LETTER" style={styles.page}>
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Projects 1–12 · Wearables, Beds & Basics</Text>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              {PROJECTS.slice(0, 6).map((p, i) => (
                <View key={i} style={styles.projectCard}>
                  <Text style={styles.projectNum}>#{i + 1}</Text>
                  <Text style={styles.projectName}>{p.name}</Text>
                  <Text style={styles.projectDesc}>{p.desc}</Text>
                  <View style={styles.projectMeta}>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Cost: </Text>{p.cost}</Text>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Time: </Text>{p.time}</Text>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Skill: </Text>{p.skill}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.col}>
              {PROJECTS.slice(6, 12).map((p, i) => (
                <View key={i} style={styles.projectCard}>
                  <Text style={styles.projectNum}>#{i + 7}</Text>
                  <Text style={styles.projectName}>{p.name}</Text>
                  <Text style={styles.projectDesc}>{p.desc}</Text>
                  <View style={styles.projectMeta}>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Cost: </Text>{p.cost}</Text>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Time: </Text>{p.time}</Text>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Skill: </Text>{p.skill}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>DIY1T.com · Top 25 Dog DIY Projects</Text>
          <Text style={styles.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>

      <Page size="LETTER" style={styles.page}>
        <View style={styles.body}>
          <Text style={styles.sectionTitle}>Projects 13–25 · Toys, Accessories & Home</Text>
          <View style={styles.twoCol}>
            <View style={styles.col}>
              {PROJECTS.slice(12, 19).map((p, i) => (
                <View key={i} style={styles.projectCard}>
                  <Text style={styles.projectNum}>#{i + 13}</Text>
                  <Text style={styles.projectName}>{p.name}</Text>
                  <Text style={styles.projectDesc}>{p.desc}</Text>
                  <View style={styles.projectMeta}>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Cost: </Text>{p.cost}</Text>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Time: </Text>{p.time}</Text>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Skill: </Text>{p.skill}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.col}>
              {PROJECTS.slice(19, 25).map((p, i) => (
                <View key={i} style={styles.projectCard}>
                  <Text style={styles.projectNum}>#{i + 20}</Text>
                  <Text style={styles.projectName}>{p.name}</Text>
                  <Text style={styles.projectDesc}>{p.desc}</Text>
                  <View style={styles.projectMeta}>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Cost: </Text>{p.cost}</Text>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Time: </Text>{p.time}</Text>
                    <Text style={styles.metaItem}><Text style={styles.metaLabel}>Skill: </Text>{p.skill}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.ctaBox}>
                <Text style={styles.ctaTitle}>Ready to build one?</Text>
                <Text style={styles.ctaText}>
                  Upload any pet product photo and get a complete AI-generated plan with
                  patterns, measurements, and a shopping list — free to try.
                </Text>
                <Text style={styles.ctaUrl}>→ diy1t.com/register</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>DIY1T.com · Top 25 Dog DIY Projects</Text>
          <Text style={styles.pageNum} render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`} />
        </View>
      </Page>
    </Document>
  );
}
