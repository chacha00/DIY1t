import { Clock, DollarSign, Gauge } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

const EXAMPLES = [
  {
    title: "Modern Boho Dog Harness",
    category: "Pet Apparel",
    gradient: "from-brand-blue-100 to-brand-teal-50",
    emoji: "🐕",
    time: "2 hrs",
    cost: "$18",
    difficulty: "Easy",
    savings: "62% saved",
  },
  {
    title: "Floating Wall Shelf Set",
    category: "Home Decor",
    gradient: "from-brand-orange-100 to-brand-blue-50",
    emoji: "🪵",
    time: "4 hrs",
    cost: "$34",
    difficulty: "Medium",
    savings: "71% saved",
  },
  {
    title: "Quilted Pet Bed",
    category: "Pet Toys",
    gradient: "from-brand-teal-100 to-brand-orange-50",
    emoji: "🛏️",
    time: "3 hrs",
    cost: "$22",
    difficulty: "Easy",
    savings: "58% saved",
  },
];

export function Examples() {
  return (
    <section id="examples" className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="See It In Action"
          title="From photo to finished plan"
          description="Every project comes with full instructions, a materials list, and a savings breakdown."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((ex) => (
            <Card key={ex.title} className="overflow-hidden">
              <div
                className={`flex h-44 items-center justify-center bg-gradient-to-br ${ex.gradient} text-6xl`}
              >
                {ex.emoji}
              </div>
              <div className="p-6">
                <Badge color="blue">{ex.category}</Badge>
                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  {ex.title}
                </h3>

                <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-brand-blue-500" />
                    {ex.time}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <DollarSign className="h-4 w-4 text-brand-teal-500" />
                    {ex.cost}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Gauge className="h-4 w-4 text-brand-orange-500" />
                    {ex.difficulty}
                  </span>
                </div>

                <div className="mt-5 rounded-xl bg-brand-teal-50 px-3 py-2 text-center text-xs font-semibold text-brand-teal-600">
                  {ex.savings} vs. retail
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
}
