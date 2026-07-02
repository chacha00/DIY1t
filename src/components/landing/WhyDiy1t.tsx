import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";

const REASONS = [
  {
    emoji: "⏱️",
    title: "Saves hours of research",
    description: "Skip 3 hours of googling tutorials, watching videos, and hunting for dimensions. Get a complete plan in under a minute.",
  },
  {
    emoji: "🛒",
    title: "Organized shopping lists",
    description: "Every material listed with exact quantities, links to where to buy, and a total cost tally before you spend a cent.",
  },
  {
    emoji: "💰",
    title: "Estimates every cost upfront",
    description: "See DIY cost vs. retail price side by side. Know exactly how much you'll save before you start cutting.",
  },
  {
    emoji: "🖨️",
    title: "Printable guides & patterns",
    description: "Download a PDF with pattern pieces, measurements, and instructions. Print at home and take it to your worktable.",
  },
  {
    emoji: "📏",
    title: "Adapts to your pet's measurements",
    description: "Save your pet's neck, chest, back, and leg measurements. Every pattern auto-scales to their exact size — no guessing.",
  },
  {
    emoji: "📁",
    title: "All projects saved in one place",
    description: "Your project library keeps every plan organized. Find, share, and revisit projects anytime from any device.",
  },
  {
    emoji: "✨",
    title: "Instant design improvements",
    description: "One click to generate a cheaper, beginner-friendly, eco-friendly, or waterproof version of any project.",
  },
  {
    emoji: "🎨",
    title: "Original designs, not copies",
    description: "Every plan is an AI-generated original — not a reproduction of branded products — so it's safe to sell or share.",
  },
];

export function WhyDiy1t() {
  return (
    <section id="why" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why DIY1T?"
          title="Not just another AI chatbot"
          description="A generic AI assistant can describe how to make something. DIY1T gives you a complete, organized, printable plan built specifically for that item — in seconds."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS.map((r) => (
            <div
              key={r.title}
              className="rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <span className="mb-4 block text-3xl">{r.emoji}</span>
              <h3 className="text-sm font-bold text-slate-900">{r.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">{r.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
