"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Dropzone } from "@/components/upload/Dropzone";
import { ProjectIntakeForm, type IntakeValues } from "@/components/upload/ProjectIntakeForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Pet } from "@/types/database";

const DEFAULT_VALUES: IntakeValues = {
  buildType: "Pet Outfit",
  budget: "25_50",
  skillLevel: "easy",
  preferredMaterials: "No preference",
  timeAvailable: "1_3h",
  petId: "",
};

type Stage = "idle" | "uploading" | "generating";

export function NewProjectWizard({
  pets,
  creditsRemaining,
}: {
  pets: Pick<Pet, "id" | "name" | "species">[];
  creditsRemaining: number;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [values, setValues] = useState<IntakeValues>(DEFAULT_VALUES);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);

  const noCredits = creditsRemaining <= 0;

  async function handleGenerate() {
    if (!file) {
      setError("Please upload a photo first.");
      return;
    }
    setError(null);

    try {
      setStage("uploading");
      const formData = new FormData();
      formData.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
      const uploadJson = await uploadRes.json();
      if (!uploadRes.ok) throw new Error(uploadJson.error ?? "Upload failed");

      setStage("generating");
      const generateRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageId: uploadJson.imageId,
          imageUrl: uploadJson.url,
          buildType: values.buildType,
          budget: values.budget,
          skillLevel: values.skillLevel,
          preferredMaterials: values.preferredMaterials,
          timeAvailable: values.timeAvailable,
          petId: values.petId || undefined,
        }),
      });
      const generateJson = await generateRes.json();
      if (!generateRes.ok) throw new Error(generateJson.error ?? "Generation failed");

      router.push(`/dashboard/projects/${generateJson.projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("idle");
    }
  }

  const isBusy = stage !== "idle";

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-base font-bold text-slate-900">1. Upload a Photo</h2>
        <p className="mt-1 text-sm text-slate-500">
          Almost anything works — furniture, pet gear, decor, clothing.
        </p>
        <div className="mt-5">
          <Dropzone onFileSelected={setFile} />
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-base font-bold text-slate-900">2. Tell Us About Your Project</h2>
        <div className="mt-5">
          <ProjectIntakeForm values={values} onChange={setValues} pets={pets} />
        </div>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {noCredits && (
        <div className="flex items-center gap-2 rounded-2xl bg-brand-orange-50 px-4 py-3 text-sm font-medium text-brand-orange-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          You&apos;re out of credits. Upgrade your plan or buy a credit pack to keep building.
        </div>
      )}

      <Button onClick={handleGenerate} disabled={isBusy || noCredits} size="lg" className="w-full sm:w-auto">
        {isBusy ? (
          <>
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
            {stage === "uploading" ? "Uploading photo…" : "Generating your DIY plan…"}
          </>
        ) : (
          <>
            <Sparkles className="h-4.5 w-4.5" />
            Generate DIY Project
          </>
        )}
      </Button>
    </div>
  );
}
