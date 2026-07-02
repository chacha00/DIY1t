"use client";

import { useState } from "react";
import { ChevronDown, PawPrint } from "lucide-react";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { addPet } from "@/app/dashboard/pets/actions";

const SPECIES = ["dog", "cat", "horse", "small_animal", "bird", "other"] as const;

export function AddPetForm() {
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-brand-blue-200 bg-brand-blue-50/30 py-10 text-sm font-semibold text-brand-blue-600 transition-colors hover:bg-brand-blue-50"
      >
        <PawPrint className="h-5 w-5" />
        Add a Pet Profile
      </button>
    );
  }

  return (
    <div className="rounded-3xl border border-brand-blue-200 bg-white p-6 shadow-soft">
      <h2 className="mb-5 text-base font-bold text-slate-900">New Pet Profile</h2>
      <form action={addPet} className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name">Pet Name *</Label>
            <Input id="name" name="name" required placeholder="Buddy" />
          </div>
          <div>
            <Label htmlFor="species">Species *</Label>
            <Select id="species" name="species" defaultValue="dog">
              {SPECIES.map((s) => (
                <option key={s} value={s}>{s[0].toUpperCase() + s.slice(1).replace("_", " ")}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="breed">Breed</Label>
            <Input id="breed" name="breed" placeholder="Golden Retriever" />
          </div>
          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select id="gender" name="gender">
              <option value="">Unknown</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="weight_lbs">Weight (lbs)</Label>
            <Input id="weight_lbs" name="weight_lbs" type="number" step="0.1" placeholder="65" />
          </div>
          <div>
            <Label htmlFor="age_years">Age (years)</Label>
            <Input id="age_years" name="age_years" type="number" step="0.5" placeholder="3" />
          </div>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-slate-700">Measurements (inches)</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="neck_measurement_in">Neck circumference</Label>
              <Input id="neck_measurement_in" name="neck_measurement_in" type="number" step="0.25" placeholder='14"' />
            </div>
            <div>
              <Label htmlFor="chest_measurement_in">Chest circumference</Label>
              <Input id="chest_measurement_in" name="chest_measurement_in" type="number" step="0.25" placeholder='22"' />
            </div>
            <div>
              <Label htmlFor="back_length_in">Back length</Label>
              <Input id="back_length_in" name="back_length_in" type="number" step="0.25" placeholder='18"' />
            </div>
            <div>
              <Label htmlFor="leg_length_in">Leg length</Label>
              <Input id="leg_length_in" name="leg_length_in" type="number" step="0.25" placeholder='12"' />
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="special_needs">Special Needs</Label>
          <Input id="special_needs" name="special_needs" placeholder="e.g. Three legs, arthritis, anxious" />
        </div>
        <div>
          <Label htmlFor="notes">Notes</Label>
          <Input id="notes" name="notes" placeholder="Any other details helpful for patterns" />
        </div>

        <div className="flex gap-3">
          <Button type="submit">Save Pet</Button>
          <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
