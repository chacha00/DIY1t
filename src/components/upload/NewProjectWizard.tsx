"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Dropzone } from "@/components/upload/Dropzone";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Stage = "idle" | "uploading" | "generating";

export function NewProjectWizard({
  hasUnlimited = false,
  visionProduct,
  visionCategory,
}: {
  pets?: unknown[];
  hasUnlimited?: boolean;
  visionProduct?: string;
  visionCategory?: string;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  const [monthlyLimitHit, setMonthlyLimitHit] = useState(false);

  function handleFileSelected(f: File) {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

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
          buildType: visionCategory ?? "auto",
          budget: "any",
          skillLevel: "easy",
          preferredMaterials: "No preference",
          timeAvailable: "any",
          visionContext: visionProduct ? `User scanned a "${visionProduct}" with DIY Vision and wants to build it themselves.` : undefined,
        }),
      });
      const generateJson = await generateRes.json();
      if (!generateRes.ok) {
        if (generateRes.status === 402) setMonthlyLimitHit(true);
        throw new Error(generateJson.error ?? "Generation failed");
      }

      router.push(`/dashboard/projects/${generateJson.projectId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStage("idle");
    }
  }

  const isBusy = stage !== "idle";

  return (
    <div className="space-y-6">
      {visionProduct && (
        <div className="flex items-center gap-3 rounded-2xl bg-brand-blue-50 border border-brand-blue-100 px-4 py-3">
          <span className="text-xl">👁️</span>
          <div>
            <p className="text-sm font-semibold text-brand-blue-800">Building from DIY Vision scan</p>
            <p className="mt-0.5 text-xs text-brand-blue-600">
              Identified product: <strong>{visionProduct}</strong>. Now upload a photo to generate your full build plan.
            </p>
          </div>
        </div>
      )}
      <Card className="p-6">
        <h2 className="text-base font-bold text-slate-900">Upload a Photo</h2>
        <p className="mt-1 text-sm text-slate-500">
          Upload any photo — pet gear, furniture, clothing, decor. DIY Vision™ will identify what it is and generate a full DIY plan.
        </p>
        <div className="mt-5">
          <Dropzone onFileSelected={handleFileSelected} />
        </div>
      </Card>

      {isBusy && previewUrl && (
        <div className="flex items-center gap-4 rounded-2xl border border-brand-blue-100 bg-brand-blue-50 px-4 py-3">
          <img
            src={previewUrl}
            alt="Uploaded photo"
            className="h-16 w-16 rounded-xl object-cover shadow-soft shrink-0"
          />
          <div>
            <p className="text-sm font-semibold text-brand-blue-800">
              {stage === "uploading" ? "Uploading your photo…" : "AI is analyzing your photo…"}
            </p>
            <p className="mt-0.5 text-xs text-brand-blue-500">
              {stage === "generating" ? "This takes 20–40 seconds. Hang tight!" : "Almost there…"}
            </p>
          </div>
          <Loader2 className="ml-auto h-5 w-5 animate-spin text-brand-blue-400 shrink-0" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {monthlyLimitHit && !hasUnlimited && (
        <div className="flex items-center gap-2 rounded-2xl bg-brand-orange-50 px-4 py-3 text-sm font-medium text-brand-orange-600">
          <AlertCircle className="h-4 w-4 shrink-0" />
          You&apos;ve used all 3 free projects this month. Upgrade to DIY+ or Maker Pro for unlimited projects.
        </div>
      )}

      <Button onClick={handleGenerate} disabled={isBusy || (monthlyLimitHit && !hasUnlimited)} size="lg" className="w-full sm:w-auto">
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
