"use client";

import { Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  BUILD_TYPES,
  BUDGET_OPTIONS,
  SKILL_LEVELS,
  TIME_AVAILABLE_OPTIONS,
  MATERIAL_PREFERENCES,
} from "@/lib/constants/project-options";
import type { Pet } from "@/types/database";

export interface IntakeValues {
  buildType: string;
  budget: string;
  skillLevel: string;
  preferredMaterials: string;
  timeAvailable: string;
  petId: string;
}

export function ProjectIntakeForm({
  values,
  onChange,
  pets,
}: {
  values: IntakeValues;
  onChange: (values: IntakeValues) => void;
  pets: Pick<Pet, "id" | "name" | "species">[];
}) {
  function set<K extends keyof IntakeValues>(key: K, value: IntakeValues[K]) {
    onChange({ ...values, [key]: value });
  }

  const isPetRelated = ["Pet Outfit", "Harness", "Dog Bed", "Toy"].includes(values.buildType);

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div>
        <Label htmlFor="buildType">What would you like to build?</Label>
        <Select
          id="buildType"
          value={values.buildType}
          onChange={(e) => set("buildType", e.target.value)}
        >
          {BUILD_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </Select>
      </div>

      {isPetRelated && pets.length > 0 && (
        <div>
          <Label htmlFor="petId">For which pet? (optional)</Label>
          <Select id="petId" value={values.petId} onChange={(e) => set("petId", e.target.value)}>
            <option value="">No specific pet</option>
            {pets.map((pet) => (
              <option key={pet.id} value={pet.id}>
                {pet.name} ({pet.species})
              </option>
            ))}
          </Select>
        </div>
      )}

      <div>
        <Label htmlFor="budget">Budget</Label>
        <Select id="budget" value={values.budget} onChange={(e) => set("budget", e.target.value)}>
          {BUDGET_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="skillLevel">Skill Level</Label>
        <Select id="skillLevel" value={values.skillLevel} onChange={(e) => set("skillLevel", e.target.value)}>
          {SKILL_LEVELS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="timeAvailable">Time Available</Label>
        <Select
          id="timeAvailable"
          value={values.timeAvailable}
          onChange={(e) => set("timeAvailable", e.target.value)}
        >
          {TIME_AVAILABLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <Label htmlFor="preferredMaterials">Preferred Materials</Label>
        <Select
          id="preferredMaterials"
          value={values.preferredMaterials}
          onChange={(e) => set("preferredMaterials", e.target.value)}
        >
          {MATERIAL_PREFERENCES.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
