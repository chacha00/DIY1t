import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

const OPTIONS = [
  { label: "💰 Make It Cheaper", desc: "Cut material costs 40%+ with smart substitutions" },
  { label: "🌱 Beginner Version", desc: "Fewer tools, simpler steps, forgiving materials" },
  { label: "💧 Waterproof Version", desc: "Coated fabrics, sealed seams, rust-proof hardware" },
  { label: "⬆️ Larger Size", desc: "Scaled up with updated pattern dimensions" },
  { label: "⬇️ Smaller Size", desc: "Scaled down for puppies, kittens, or small breeds" },
  { label: "♻️ Eco-Friendly", desc: "Organic, recycled, or sustainable materials only" },
  { label: "✨ Premium Version", desc: "Luxury materials for a boutique-quality result" },
  { label: "🔩 Extra Durable", desc: "Reinforced joins, heavy-duty hardware, lasting build" },
];

export function Customization() {
  return (
    <section className="bg-slate-50 py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="One Project, Many Versions"
              title="Customize any project instantly"
              description="Don't like something about the generated plan? One click creates a new version optimized exactly how you need it."
              align="left"
            />
            <div className="mt-8">
              <LinkButton href="/register" size="md">
                Try It Free
              </LinkButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {OPTIONS.map((opt) => (
              <div
                key={opt.label}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg"
              >
                <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                <p className="mt-1 text-xs text-slate-500">{opt.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
