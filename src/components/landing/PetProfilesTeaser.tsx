import { PawPrint, Ruler, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

const PETS = [
  { emoji: "🐶", name: "Buddy", breed: "Corgi Mix", chest: '22"', neck: '14"', back: '16"' },
  { emoji: "🐱", name: "Luna", breed: "Tabby Cat", chest: '14"', neck: '9"', back: '11"' },
  { emoji: "🐴", name: "Scout", breed: "Quarter Horse", chest: '72"', neck: '36"', back: '58"' },
];

const BENEFITS = [
  "Every pattern auto-scales to your pet's exact size",
  "No more guessing or measuring mid-project",
  "Save unlimited pets — dogs, cats, horses, small animals",
  "Pet measurements pass directly into AI generation",
  "Harnesses, sweaters, beds — all perfectly fitted",
];

export function PetProfilesTeaser() {
  return (
    <section className="py-20 sm:py-28">
      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="space-y-4">
            {PETS.map((pet) => (
              <div key={pet.name} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-soft">
                <span className="text-3xl">{pet.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">{pet.name} <span className="font-normal text-slate-400">· {pet.breed}</span></p>
                  <div className="mt-1.5 flex gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><Ruler className="h-3.5 w-3.5" />Chest {pet.chest}</span>
                    <span>Neck {pet.neck}</span>
                    <span>Back {pet.back}</span>
                  </div>
                </div>
                <div className="rounded-full bg-brand-teal-50 px-3 py-1.5 text-xs font-semibold text-brand-teal-600">
                  Auto-fit ✓
                </div>
              </div>
            ))}
            <div className="flex items-center gap-3 rounded-2xl border-2 border-dashed border-brand-blue-200 p-4 text-sm font-medium text-brand-blue-500">
              <PawPrint className="h-5 w-5" />
              + Add your pet
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-brand-orange-500">Pet Profiles</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Every project fits your pet perfectly
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              Save your pets' measurements once. Every harness, sweater, and bed pattern
              is automatically tailored to their exact neck, chest, back, and leg dimensions.
            </p>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-teal-500" />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <LinkButton href="/register" size="md">
                Create Your Pet Profiles Free
              </LinkButton>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
