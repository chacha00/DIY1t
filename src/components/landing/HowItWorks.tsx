import { UploadCloud, Search, ListChecks, FileDown, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";

const STEPS = [
  {
    icon: UploadCloud,
    color: "bg-brand-blue-500",
    step: "1",
    title: "Upload a photo",
    description: "Snap or drag in any pet product — harness, bed, toy, sweater, leash, collar.",
  },
  {
    icon: Search,
    color: "bg-brand-teal-500",
    step: "2",
    title: "AI analyzes it",
    description: "Our vision AI examines construction, materials, dimensions, stitching, and hardware from your photo.",
  },
  {
    icon: ListChecks,
    color: "bg-brand-orange-500",
    step: "3",
    title: "Get your plan",
    description: "Receive a complete DIY guide: specific materials with quantities, cut pattern pieces with measurements, and step-by-step assembly instructions.",
  },
  {
    icon: FileDown,
    color: "bg-brand-blue-600",
    step: "4",
    title: "Download & build",
    description: "Print your PDF, shop the exact materials list, and build a custom version fitted perfectly to your pet.",
  },
  {
    icon: Sparkles,
    color: "bg-brand-teal-600",
    step: "5",
    title: "Improve & remix",
    description: "Generate cheaper, beginner-friendly, waterproof, or larger versions instantly — or add your pet's exact measurements for a perfect fit.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="From photo to finished plan in seconds"
        />

        <div className="mt-14 relative">
          {/* Connector line */}
          <div className="absolute left-7 top-8 bottom-8 w-0.5 bg-gradient-to-b from-brand-blue-200 via-brand-teal-200 to-brand-orange-200 hidden lg:block" />

          <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-5 lg:gap-6">
            {STEPS.map((step) => (
              <div key={step.step} className="relative flex gap-4 lg:flex-col lg:items-center lg:gap-3 lg:text-center">
                <span className={`relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${step.color} shadow-soft-lg`}>
                  <step.icon className="h-6 w-6 text-white" />
                </span>
                <div className="lg:px-2">
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Step {step.step}</p>
                  <h3 className="text-sm font-bold text-slate-900">{step.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
