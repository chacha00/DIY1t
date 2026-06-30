import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";

const CATEGORIES = [
  { emoji: "🐶", label: "Pet Apparel", color: "bg-brand-blue-50" },
  { emoji: "🦴", label: "Pet Toys", color: "bg-brand-orange-50" },
  { emoji: "🏠", label: "Home Decor", color: "bg-brand-teal-50" },
  { emoji: "🪑", label: "Furniture", color: "bg-brand-blue-50" },
  { emoji: "👕", label: "Clothing", color: "bg-brand-orange-50" },
  { emoji: "🧸", label: "Kids Crafts", color: "bg-brand-teal-50" },
  { emoji: "🎄", label: "Holiday Projects", color: "bg-brand-blue-50" },
  { emoji: "🎨", label: "Crafts", color: "bg-brand-orange-50" },
  { emoji: "🧵", label: "Sewing", color: "bg-brand-teal-50" },
  { emoji: "🪚", label: "Woodworking", color: "bg-brand-blue-50" },
  { emoji: "🐱", label: "Cat Accessories", color: "bg-brand-orange-50" },
  { emoji: "🐴", label: "Horse Accessories", color: "bg-brand-teal-50" },
];

export function Categories() {
  return (
    <section id="categories" className="py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Build almost anything"
          description="From pet apparel to furniture, DIY1T turns inspiration from any category into a buildable project."
        />

        <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.label}
              href="#"
              className="group flex flex-col items-center gap-3 rounded-3xl border border-slate-100 bg-white p-6 text-center shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg"
            >
              <span
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl ${cat.color} transition-transform duration-300 group-hover:scale-110`}
              >
                {cat.emoji}
              </span>
              <span className="text-sm font-semibold text-slate-700">
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </Container>
    </section>
  );
}
