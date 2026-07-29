"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Loader2, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { BUILD_TYPES, BUDGET_OPTIONS, SKILL_LEVELS, TIME_AVAILABLE_OPTIONS } from "@/lib/constants/project-options";
import type { Pet } from "@/types/database";

const MAX_FILES = 5;

interface UploadedImage {
  file: File;
  preview: string;
  imageId?: string;
  imageUrl?: string;
  uploadError?: string;
  uploading?: boolean;
}

interface BatchResult {
  imageId: string;
  projectId?: string;
  error?: string;
}

export function BatchGenerateWizard({ pets }: { pets: Pick<Pet, "id" | "name" | "species">[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [buildType, setBuildType] = useState(BUILD_TYPES[0] as string);
  const [budget, setBudget] = useState(BUDGET_OPTIONS[0].value as string);
  const [skillLevel, setSkillLevel] = useState(SKILL_LEVELS[0].value as string);
  const [timeAvailable, setTimeAvailable] = useState(TIME_AVAILABLE_OPTIONS[0].value as string);
  const [preferredMaterials, setPreferredMaterials] = useState("");
  const [petId, setPetId] = useState("");
  const [generating, setGenerating] = useState(false);
  const [results, setResults] = useState<BatchResult[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFiles(files: FileList) {
    const remaining = MAX_FILES - images.length;
    const toAdd = Array.from(files).slice(0, remaining);
    const newImages: UploadedImage[] = toAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      uploading: true,
    }));
    setImages(prev => [...prev, ...newImages]);

    // Upload each image immediately
    newImages.forEach(async (img, localIdx) => {
      const globalIdx = images.length + localIdx;
      const fd = new FormData();
      fd.append("file", img.file);
      try {
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Upload failed");
        setImages(prev => prev.map((p, i) =>
          i === globalIdx ? { ...p, uploading: false, imageId: json.imageId, imageUrl: json.url } : p
        ));
      } catch (err) {
        setImages(prev => prev.map((p, i) =>
          i === globalIdx ? { ...p, uploading: false, uploadError: err instanceof Error ? err.message : "Upload failed" } : p
        ));
      }
    });
  }

  function removeImage(idx: number) {
    setImages(prev => {
      const copy = [...prev];
      URL.revokeObjectURL(copy[idx].preview);
      copy.splice(idx, 1);
      return copy;
    });
  }

  async function handleGenerate() {
    const ready = images.filter(img => img.imageId && img.imageUrl && !img.uploadError);
    if (ready.length === 0) {
      setError("No images ready. Wait for uploads to finish.");
      return;
    }

    setGenerating(true);
    setError(null);
    setResults(null);

    try {
      const res = await fetch("/api/generate/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          images: ready.map(img => ({ imageId: img.imageId, imageUrl: img.imageUrl })),
          buildType,
          budget,
          skillLevel,
          preferredMaterials,
          timeAvailable,
          petId: petId || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Batch generation failed");
      setResults(json.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  }

  const allUploaded = images.length > 0 && images.every(img => !img.uploading);
  const hasErrors = images.some(img => img.uploadError);

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center hover:border-brand-blue-400 hover:bg-brand-blue-50 transition-colors"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={e => e.preventDefault()}
        onDrop={e => { e.preventDefault(); handleFiles(e.dataTransfer.files); }}
      >
        <Upload className="mx-auto h-10 w-10 text-slate-300" />
        <p className="mt-3 text-sm font-semibold text-slate-600">
          Drop up to {MAX_FILES} photos here, or click to browse
        </p>
        <p className="mt-1 text-xs text-slate-400">JPG, PNG, HEIC — max 15 MB each</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={e => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {/* Image preview grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.preview} alt="" className="h-full w-full object-cover" />
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-blue-500" />
                </div>
              )}
              {img.uploadError && (
                <div className="absolute inset-0 flex items-center justify-center bg-red-50/80">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
              )}
              {!img.uploading && !img.uploadError && (
                <div className="absolute top-1 left-1">
                  <CheckCircle className="h-4 w-4 text-emerald-500 drop-shadow" />
                </div>
              )}
              <button
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 rounded-full bg-white/80 p-0.5 text-slate-500 hover:bg-white hover:text-red-500 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {images.length < MAX_FILES && (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex items-center justify-center text-slate-400 hover:border-brand-blue-400 hover:text-brand-blue-400 transition-colors"
            >
              <Upload className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Options */}
      <Card className="p-6 space-y-4">
        <h2 className="text-sm font-bold text-slate-700">Project Settings</h2>
        <p className="text-xs text-slate-400">These settings apply to all {images.length || ""} projects in this batch.</p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold text-slate-600">Build Type</label>
            <select
              value={buildType}
              onChange={e => setBuildType(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {BUILD_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Budget</label>
            <select
              value={budget}
              onChange={e => setBudget(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {BUDGET_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Skill Level</label>
            <select
              value={skillLevel}
              onChange={e => setSkillLevel(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {SKILL_LEVELS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600">Time Available</label>
            <select
              value={timeAvailable}
              onChange={e => setTimeAvailable(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            >
              {TIME_AVAILABLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {pets.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-600">Pet (optional)</label>
              <select
                value={petId}
                onChange={e => setPetId(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="">No pet selected</option>
                {pets.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-600">Material Preference</label>
            <input
              type="text"
              value={preferredMaterials}
              onChange={e => setPreferredMaterials(e.target.value)}
              placeholder="e.g. Cordura nylon, eco-friendly"
              className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
            />
          </div>
        </div>
      </Card>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {hasErrors && (
        <p className="text-xs text-amber-600">Some images failed to upload and will be skipped.</p>
      )}

      <Button
        variant="primary"
        size="lg"
        onClick={handleGenerate}
        disabled={generating || images.length === 0 || !allUploaded}
        className="w-full"
      >
        {generating ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating {images.filter(i => i.imageId).length} projects…
          </>
        ) : (
          <>
            Generate {images.filter(i => i.imageId).length || images.length} Projects
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>

      {/* Results */}
      {results && (
        <Card className="p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-700">
            Batch Complete — {results.filter(r => r.projectId).length} of {results.length} succeeded
          </h2>
          <div className="space-y-2">
            {results.map((r, i) => (
              <div key={i} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                  {r.projectId
                    ? <CheckCircle className="h-4 w-4 text-emerald-500" />
                    : <AlertCircle className="h-4 w-4 text-red-400" />
                  }
                  <span className="text-sm text-slate-700">
                    {r.projectId ? `Project ${i + 1} ready` : (r.error ?? "Failed")}
                  </span>
                </div>
                {r.projectId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/projects/${r.projectId}`)}
                  >
                    View
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          {results.every(r => r.projectId) && (
            <Button variant="primary" size="sm" onClick={() => router.push("/dashboard/projects")}>
              View All Projects
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}
