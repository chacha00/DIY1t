import { Clock, DollarSign, ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

const EXAMPLES = [
  {
    emoji: "🦮",
    product: "Store-bought step-in harness",
    result: "Padded Corgi Step-In Harness",
    materials: ["1.5\" nylon webbing (2 yds)", "1\" side-release buckles ×2", "1\" D-ring ×1", "Fleece lining fabric (¼ yd)", "Thread"],
    time: "2.5 hrs",
    cost: "$14",
    retail: "$38",
    savings: "63%",
    step: "Cut two chest panels on fold, interface one, sew right sides together. Attach webbing straps through D-ring. Thread buckles at shoulders. Top-stitch all edges.",
    gradient: "from-brand-blue-100 to-brand-teal-50",
  },
  {
    emoji: "🛏️",
    product: "Luxury orthopedic dog bed",
    result: "Memory Foam Bolster Dog Bed",
    materials: ["Canvas fabric (1.5 yds)", "Memory foam 3\" (24\"×36\")", "Polyfill bolster batting", "Heavy-duty zipper 36\"", "Thread"],
    time: "3 hrs",
    cost: "$28",
    retail: "$95",
    savings: "71%",
    step: "Cut base 28\"×40\", four bolster strips 8\"×28\". Sew bolsters into tube, stuff. Attach to base perimeter. Install zipper on bottom seam for removable insert.",
    gradient: "from-brand-orange-100 to-brand-blue-50",
  },
  {
    emoji: "🧶",
    product: "Cable-knit dog sweater",
    result: "Ribbed Knit Dog Pullover",
    materials: ["Bulky wool yarn (200 yds)", "US size 9 knitting needles", "Stitch markers ×4", "Tapestry needle"],
    time: "4 hrs",
    cost: "$12",
    retail: "$42",
    savings: "71%",
    step: "CO 44 sts. Work 2×2 rib for 3\". Inc to 56 sts for body. Work 6\" stockinette. Divide for leg holes: 14 sts each side, BO center 28. Rejoin and work neck.",
    gradient: "from-brand-teal-100 to-brand-orange-50",
  },
];

export function Examples() {
  return (
    <section id="examples" className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Real Results"
          title="Photo in. DIY plan out."
          description="Here's exactly what you get — real materials, real steps, real savings."
        />

        <div className="mt-14 space-y-8">
          {EXAMPLES.map((ex, i) => (
            <div
              key={ex.result}
              className={`grid items-start gap-6 rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-soft-lg lg:grid-cols-4 ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}
            >
              {/* Photo placeholder */}
              <div className={`flex h-44 items-center justify-center rounded-2xl bg-gradient-to-br ${ex.gradient} text-6xl lg:h-full lg:min-h-[180px]`}>
                {ex.emoji}
              </div>

              {/* Materials */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Materials List</p>
                <ul className="space-y-1.5">
                  {ex.materials.map((m) => (
                    <li key={m} className="flex items-center gap-2 text-sm text-slate-600">
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal-400" />
                      {m}
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{ex.time}</span>
                  <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" />{ex.cost} materials</span>
                </div>
              </div>

              {/* Key step */}
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">Sample Step</p>
                <p className="text-sm leading-relaxed text-slate-600">{ex.step}</p>
              </div>

              {/* Savings */}
              <div className="flex flex-col items-center justify-center rounded-2xl bg-brand-teal-50 p-5 text-center">
                <p className="text-3xl font-extrabold text-brand-teal-600">{ex.savings}</p>
                <p className="text-xs font-semibold text-brand-teal-600">saved</p>
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <p>DIY: <strong className="text-slate-700">{ex.cost}</strong></p>
                  <p>Retail: <s>{ex.retail}</s></p>
                </div>
                <p className="mt-3 text-xs font-semibold text-brand-teal-700">{ex.result}</p>
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
