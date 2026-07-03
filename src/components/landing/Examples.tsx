import Image from "next/image";
import { Clock, DollarSign, ChevronRight, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

const EXAMPLES = [
  {
    label: "Dog Harness",
    product: "Store-bought step-in harness · $65 retail",
    result: "Padded Corgi Step-In Harness",
    photoSrc: "/images/harness.jpg",
    photoAlt: "Black dog wearing a blue harness",
    finishedSrc: "/images/harness2.jpg",
    finishedAlt: "Dog wearing a harness",
    patternColor: "border-brand-blue-300 bg-brand-blue-50",
    patternTextColor: "text-brand-blue-600",
    materials: ["1.5\" nylon webbing (2 yds)", "Side-release buckles ×2", "Fleece lining ¼ yd", "D-ring + thread"],
    time: "2.5 hrs",
    cost: "$14",
    retail: "$65",
    savings: "79%",
    step: "Cut two chest panels on fold, sew right sides together. Attach webbing through D-ring. Thread buckles at shoulders. Top-stitch all edges.",
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
    step: "Cut base 28\"×40\", four bolster strips 8\"×28\". Sew bolsters into tube, stuff. Attach to base. Install zipper on bottom for removable insert.",
  },
  {
    label: "Dog Sweater",
    product: "Cable-knit dog sweater · $42 retail",
    result: "Ribbed Knit Dog Pullover",
    photoSrc: "/images/sweater.jpg",
    photoAlt: "French bulldog in a black and gold hoodie sweater",
    finishedSrc: "/images/sweater2.jpg",
    finishedAlt: "Dog wearing a handmade knit sweater",
    patternColor: "border-brand-teal-300 bg-brand-teal-50",
    patternTextColor: "text-brand-teal-600",
    materials: ["Bulky wool yarn 200 yds", "US size 9 knitting needles", "Stitch markers ×4", "Tapestry needle"],
    time: "4 hrs",
    cost: "$12",
    retail: "$42",
    savings: "71%",
    step: "CO 44 sts. Work 2×2 rib for 3\". Inc to 56 sts for body. Work 6\" stockinette. Divide for leg holes, rejoin and work neck ribbing.",
  },
];

function PatternPreview({ color, textColor }: { color: string; textColor: string }) {
  return (
    <div className={`rounded-2xl border-2 border-dashed p-4 ${color}`}>
      <p className={`mb-2 text-xs font-bold uppercase tracking-widest ${textColor}`}>Pattern Pieces</p>
      <svg viewBox="0 0 220 100" className="w-full" xmlns="http://www.w3.org/2000/svg">
        <rect x="5" y="5" width="90" height="55" rx="6" fill="white" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className={textColor} />
        <text x="50" y="30" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="600">MAIN PANEL</text>
        <text x="50" y="42" textAnchor="middle" fontSize="7" fill="#94a3b8">Cut 2 on fold</text>
        <text x="50" y="52" textAnchor="middle" fontSize="7" fill="#94a3b8">11" × 7"</text>
        <rect x="108" y="5" width="107" height="30" rx="5" fill="white" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className={textColor}/>
        <text x="161" y="18" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="600">STRAP A</text>
        <text x="161" y="28" textAnchor="middle" fontSize="7" fill="#94a3b8">13" × 3.5"</text>
        <rect x="108" y="45" width="107" height="25" rx="5" fill="white" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" className={textColor}/>
        <text x="161" y="60" textAnchor="middle" fontSize="8" fill="#64748b" fontWeight="600">STRAP B</text>
        <text x="161" y="70" textAnchor="middle" fontSize="7" fill="#94a3b8">13" × 2.5"</text>
        <text x="5" y="92" fontSize="6" fill="#94a3b8">* Seam allowance ⅝" · Print at 100%</text>
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
                  <PatternPreview color={ex.patternColor} textColor={ex.patternTextColor} />
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
