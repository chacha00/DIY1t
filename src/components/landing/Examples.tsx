import Image from "next/image";
import { Clock, DollarSign, ChevronRight, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

const EXAMPLES = [
  {
    label: "Dog Harness",
    product: "Store-bought step-in harness · $65 retail",
    result: "Padded Step-In Dog Harness",
    photoSrc: "/images/harness.jpg",
    photoAlt: "Dog wearing a step-in harness",
    finishedSrc: "/images/harness2.jpg",
    finishedAlt: "Dog wearing a handmade padded harness",
    patternColor: "border-brand-blue-300 bg-brand-blue-50",
    patternTextColor: "text-brand-blue-600",
    materials: ["1.5\" nylon webbing (2 yds)", "Side-release buckles ×2", "Fleece lining ¼ yd", "D-ring + thread"],
    time: "2.5 hrs",
    cost: "$14",
    retail: "$65",
    savings: "79%",
    pieces: [
      { label: "CHEST PANEL", sub: "Cut 2 on fold", dim: "11\" × 7\"", x: 5, y: 5, w: 90, h: 55 },
      { label: "BELLY STRAP", sub: "Cut 1", dim: "13\" × 3.5\"", x: 108, y: 5, w: 107, h: 30 },
      { label: "NECK STRAP", sub: "Cut 1", dim: "13\" × 2.5\"", x: 108, y: 45, w: 107, h: 25 },
    ],
  },
  {
    label: "Dog Bed",
    product: "Luxury orthopedic dog bed · $95 retail",
    result: "Memory Foam Bolster Dog Bed",
    photoSrc: "/images/bed.jpg",
    photoAlt: "Dog resting in a bolster bed",
    finishedSrc: "/images/bed2.jpg",
    finishedAlt: "Dog in a handmade bolster bed",
    patternColor: "border-brand-orange-300 bg-brand-orange-50",
    patternTextColor: "text-brand-orange-600",
    materials: ["Canvas fabric 1.5 yds", "Memory foam 3\" (24\"×36\")", "Polyfill bolster batting", "Heavy-duty zipper 36\""],
    time: "3 hrs",
    cost: "$28",
    retail: "$95",
    savings: "71%",
    pieces: [
      { label: "BED BASE", sub: "Cut 1", dim: "28\" × 40\"", x: 5, y: 5, w: 120, h: 55 },
      { label: "BOLSTER", sub: "Cut 4", dim: "8\" × 28\"", x: 138, y: 5, w: 77, h: 30 },
      { label: "ZIPPER FLAP", sub: "Cut 1", dim: "4\" × 28\"", x: 138, y: 45, w: 77, h: 25 },
    ],
  },
  {
    label: "Dog Sweater",
    product: "Cable-knit dog sweater · $42 retail",
    result: "Ribbed Knit Dog Pullover",
    photoSrc: "/images/sweater.jpg",
    photoAlt: "French bulldog in a striped sweater",
    finishedSrc: "/images/sweater2.jpg",
    finishedAlt: "Dog wearing a handmade knit sweater",
    patternColor: "border-brand-teal-300 bg-brand-teal-50",
    patternTextColor: "text-brand-teal-600",
    materials: ["Bulky wool yarn 200 yds", "US size 9 knitting needles", "Stitch markers ×4", "Tapestry needle"],
    time: "4 hrs",
    cost: "$12",
    retail: "$42",
    savings: "71%",
    pieces: [
      { label: "BODY", sub: "Knit 1", dim: "14\" × 10\"", x: 5, y: 5, w: 100, h: 55 },
      { label: "NECKBAND", sub: "Knit 1", dim: "12\" × 3\"", x: 118, y: 5, w: 97, h: 28 },
      { label: "LEG BAND", sub: "Knit 2", dim: "6\" × 2\"", x: 118, y: 43, w: 97, h: 27 },
    ],
  },
];

type Piece = { label: string; sub: string; dim: string; x: number; y: number; w: number; h: number };

function PatternPreview({ color, textColor, pieces }: { color: string; textColor: string; pieces: Piece[] }) {
  return (
    <div className={`rounded-2xl border-2 border-dashed p-4 ${color}`}>
      <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${textColor}`}>Pattern Pieces</p>
      <svg viewBox="0 0 220 100" className="w-full" xmlns="http://www.w3.org/2000/svg">
        {pieces.map((p) => (
          <g key={p.label}>
            <rect x={p.x} y={p.y} width={p.w} height={p.h} rx="5" fill="white" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className={textColor} />
            <text x={p.x + p.w / 2} y={p.y + p.h / 2 - 8} textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="600">{p.label}</text>
            <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 3} textAnchor="middle" fontSize="7" fill="#94a3b8">{p.sub}</text>
            <text x={p.x + p.w / 2} y={p.y + p.h / 2 + 12} textAnchor="middle" fontSize="7" fill="#94a3b8">{p.dim}</text>
          </g>
        ))}
        <text x="5" y="96" fontSize="6" fill="#94a3b8">* Seam allowance ⅝" · Print at 100%</text>
      </svg>
    </div>
  );
}

export function Examples() {
  return (
    <section id="examples" className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Real Results"
          title="Photo in. DIY plan out."
          description="Here's exactly what you get — real materials, real patterns, real savings."
        />

        <div className="mt-14 space-y-12">
          {EXAMPLES.map((ex, i) => (
            <div
              key={ex.result}
              className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft"
            >
              {/* Header */}
              <div className="border-b border-slate-100 bg-slate-50 px-6 py-3 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-700">{ex.label}</p>
                <p className="text-xs text-slate-400">{ex.product}</p>
              </div>

              {/* Three-column visual flow */}
              <div className="grid gap-0 lg:grid-cols-3">
                {/* 1. Original photo */}
                <div className="border-r border-slate-100 p-5">
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600">1</span>
                    You Upload
                  </p>
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                    <Image
                      src={ex.photoSrc}
                      alt={ex.photoAlt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <p className="mt-2 text-center text-xs text-slate-400">Any photo works — phone pics are fine</p>
                </div>

                {/* 2. AI pattern */}
                <div className="border-r border-slate-100 p-5">
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-blue-500 text-[10px] font-bold text-white">2</span>
                    AI Generates
                  </p>
                  <PatternPreview color={ex.patternColor} textColor={ex.patternTextColor} pieces={ex.pieces} />
                  <div className="mt-3 space-y-1.5">
                    {ex.materials.map((m) => (
                      <div key={m} className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal-400" />
                        {m}
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 flex gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{ex.time}</span>
                    <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{ex.cost} materials</span>
                  </div>
                </div>

                {/* 3. Finished + savings */}
                <div className="p-5">
                  <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-slate-400">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-teal-500 text-[10px] font-bold text-white">3</span>
                    You Build
                  </p>
                  <div className="relative overflow-hidden rounded-2xl aspect-[4/3]">
                    <Image
                      src={ex.finishedSrc}
                      alt={ex.finishedAlt}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div className="absolute bottom-2 right-2 rounded-full bg-brand-teal-500 px-2 py-1 text-xs font-bold text-white">
                      Saved {ex.savings}
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between rounded-xl bg-brand-teal-50 px-4 py-3">
                    <div>
                      <p className="text-xs text-slate-500">DIY cost</p>
                      <p className="text-lg font-extrabold text-brand-teal-700">{ex.cost}</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300" />
                    <div className="text-right">
                      <p className="text-xs text-slate-500">vs retail</p>
                      <p className="text-sm font-semibold text-slate-400 line-through">{ex.retail}</p>
                    </div>
                    <div className="rounded-lg bg-brand-teal-500 px-3 py-2 text-center text-white">
                      <p className="text-xs">Save</p>
                      <p className="text-lg font-extrabold">{ex.savings}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <LinkButton href="/register" size="lg">
            Generate My First Project Free
            <ChevronRight className="h-4 w-4" />
          </LinkButton>
        </div>
      </Container>
    </section>
  );
}
