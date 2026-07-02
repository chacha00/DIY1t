import { Check, X, Minus } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";

const rows = [
  { feature: "Organized materials list with quantities", diy1t: "always", ai: "sometimes" },
  { feature: "Exact cost estimates per material", diy1t: "always", ai: "rarely" },
  { feature: "Total project cost vs. retail comparison", diy1t: "always", ai: "no" },
  { feature: "Printable PDF with pattern pieces", diy1t: "always", ai: "no" },
  { feature: "Cut dimensions in inches", diy1t: "always", ai: "sometimes" },
  { feature: "Saved to your project library", diy1t: "always", ai: "no" },
  { feature: "Custom pet measurement integration", diy1t: "always", ai: "sometimes" },
  { feature: "Project history & versioning", diy1t: "always", ai: "no" },
  { feature: "One-click design improvements", diy1t: "always", ai: "no" },
  { feature: "Shopping links for every material", diy1t: "always", ai: "no" },
];

function Cell({ value }: { value: "always" | "sometimes" | "rarely" | "no" }) {
  if (value === "always") return <span className="flex items-center justify-center gap-1 text-brand-teal-600 text-sm font-semibold"><Check className="h-4 w-4" /> Always</span>;
  if (value === "sometimes") return <span className="flex items-center justify-center gap-1 text-brand-orange-500 text-sm"><Minus className="h-4 w-4" /> Sometimes</span>;
  if (value === "rarely") return <span className="flex items-center justify-center gap-1 text-slate-400 text-sm"><Minus className="h-4 w-4" /> Rarely</span>;
  return <span className="flex items-center justify-center gap-1 text-slate-300 text-sm"><X className="h-4 w-4" /> No</span>;
}

export function ComparisonTable() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How We Compare"
          title="DIY1T vs. asking an AI chatbot"
          description="ChatGPT and Claude can answer questions. DIY1T gives you a complete, organized plan you can print and build from immediately."
        />

        <div className="mt-14 overflow-x-auto rounded-3xl border border-slate-100 shadow-soft">
          <table className="w-full min-w-[540px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Feature</th>
                <th className="px-6 py-4 text-center">
                  <span className="inline-block rounded-full bg-brand-blue-600 px-4 py-1.5 text-sm font-bold text-white">DIY1T</span>
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-slate-400">Generic AI Chat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 bg-white">
              {rows.map((row) => (
                <tr key={row.feature} className="transition-colors hover:bg-slate-50/50">
                  <td className="px-6 py-3.5 text-sm text-slate-600">{row.feature}</td>
                  <td className="px-6 py-3.5 text-center"><Cell value={row.diy1t as "always"} /></td>
                  <td className="px-6 py-3.5 text-center"><Cell value={row.ai as "sometimes"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </section>
  );
}
