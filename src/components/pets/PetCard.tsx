"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { deletePet } from "@/app/dashboard/pets/actions";
import type { Pet } from "@/types/database";

const SPECIES_EMOJI: Record<string, string> = {
  dog: "🐶", cat: "🐱", horse: "🐴", small_animal: "🐹", bird: "🐦", other: "🐾",
};

function Measurement({ label, value }: { label: string; value: number | null }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between py-1.5 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-semibold text-slate-800">{value}"</span>
    </div>
  );
}

export function PetCard({ pet }: { pet: Pet }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal-50 text-2xl">
            {SPECIES_EMOJI[pet.species] ?? "🐾"}
          </span>
          <div>
            <p className="text-base font-bold text-slate-900">{pet.name}</p>
            <p className="text-xs text-slate-400">
              {pet.breed ? `${pet.breed} · ` : ""}{pet.species}
              {pet.gender ? ` · ${pet.gender}` : ""}
              {pet.age_years ? ` · ${pet.age_years}yr` : ""}
              {pet.weight_lbs ? ` · ${pet.weight_lbs}lbs` : ""}
            </p>
          </div>
        </div>
        <button
          onClick={() => startTransition(() => deletePet(pet.id))}
          disabled={isPending}
          className="rounded-full p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-400 disabled:opacity-50"
          aria-label="Delete pet"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {(pet.neck_measurement_in || pet.chest_measurement_in || pet.back_length_in || pet.leg_length_in) && (
        <div className="mt-4 divide-y divide-slate-100 rounded-2xl bg-slate-50 px-4">
          <Measurement label="Neck" value={pet.neck_measurement_in} />
          <Measurement label="Chest" value={pet.chest_measurement_in} />
          <Measurement label="Back length" value={pet.back_length_in} />
          <Measurement label="Leg length" value={pet.leg_length_in} />
        </div>
      )}

      {pet.special_needs && (
        <p className="mt-3 rounded-xl bg-brand-orange-50 px-3 py-2 text-xs text-brand-orange-700">
          ⚡ {pet.special_needs}
        </p>
      )}
      {pet.notes && (
        <p className="mt-2 text-xs text-slate-400">{pet.notes}</p>
      )}
    </Card>
  );
}
