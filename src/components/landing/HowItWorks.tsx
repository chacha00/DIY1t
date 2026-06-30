import { UploadCloud, Sparkles, FileDown } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload a Photo",
    description:
      "Snap or drag in a picture of almost anything — a chair, a harness, a wall shelf.",
    color: "bg-brand-blue-500",
  },
  {
    icon: Sparkles,
    title: "AI Generates Your Plan",
    description:
      "Get materials, costs, tools, step-by-step instructions, and a preview image in seconds.",
    color: "bg-brand-teal-500",
  },
  {
    icon: FileDown,
    title: "Build & Save",
    description:
      "Download a printable PDF, shop your materials list, and start building today.",
    color: "bg-brand-orange-500",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Simple Process"
          title="Three steps from photo to project"
        />

        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-soft-lg">
                <span
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${step.color}`}
                >
                  <step.icon className="h-7 w-7 text-white" />
                </span>
              </div>
              <span className="mt-4 inline-block text-xs font-bold uppercase tracking-widest text-slate-300">
                Step {i + 1}
              </span>
              <h3 className="mt-2 text-lg font-bold text-slate-900">
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
