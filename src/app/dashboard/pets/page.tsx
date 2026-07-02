import { createClient } from "@/lib/supabase/server";
import { AddPetForm } from "@/components/pets/AddPetForm";
import { PetCard } from "@/components/pets/PetCard";
import type { Pet } from "@/types/database";

export default async function PetsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<Pet[]>();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Pet Profiles</h1>
        <p className="mt-1 text-sm text-slate-500">
          Save your pets' measurements so projects are tailored to their exact size.
        </p>
      </div>

      <AddPetForm />

      {pets && pets.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      )}
    </div>
  );
}
