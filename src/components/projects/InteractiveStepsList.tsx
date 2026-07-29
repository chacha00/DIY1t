"use client";

import { useState, useRef, useTransition } from "react";
import {
  ListChecks, CheckCircle2, AlertTriangle, Lightbulb,
  Clock, Camera, Loader2, ChevronDown, ChevronUp, Sparkles,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { ProjectStep } from "@/types/database";

interface StepExt extends ProjectStep {
  quality_checkpoint?: string;
  common_mistake?: string;
  pro_tip?: string;
  time_minutes?: number;
}

interface StepProgressRow {
  step_order: number;
  completed: boolean;
  photo_url: string | null;
  ai_feedback: string | null;
}

interface Props {
  projectId: string;
  steps: ProjectStep[];
  initialProgress: StepProgressRow[];
}

export function InteractiveStepsList({ projectId, steps, initialProgress }: Props) {
  const sorted = (steps as StepExt[]).slice().sort((a, b) => a.order - b.order);

  const [completed, setCompleted] = useState<Record<number, boolean>>(
    Object.fromEntries(initialProgress.map((p) => [p.step_order, p.completed]))
  );
  const [feedback, setFeedback] = useState<Record<number, string>>(
    Object.fromEntries(
      initialProgress.filter((p) => p.ai_feedback).map((p) => [p.step_order, p.ai_feedback!])
    )
  );
  const [photos, setPhotos] = useState<Record<number, string>>(
    Object.fromEntries(
      initialProgress.filter((p) => p.photo_url).map((p) => [p.step_order, p.photo_url!])
    )
  );
  const [uploading, setUploading] = useState<Record<number, boolean>>({});
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [, startTransition] = useTransition();
  const fileRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const doneCount = Object.values(completed).filter(Boolean).length;
  const totalCount = sorted.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

  async function toggleStep(order: number, value: boolean) {
    setCompleted((prev) => ({ ...prev, [order]: value }));
    startTransition(async () => {
      await fetch(`/api/projects/${projectId}/steps/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step_order: order, completed: value }),
      });
    });
  }

  async function handlePhotoUpload(step: StepExt, file: File) {
    setUploading((prev) => ({ ...prev, [step.order]: true }));
    try {
      // Upload to Cloudinary
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();

      setPhotos((prev) => ({ ...prev, [step.order]: url }));

      // Get AI feedback
      const fbRes = await fetch(`/api/projects/${projectId}/steps/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          step_order: step.order,
          photo_url: url,
          step_title: step.title,
          step_description: step.description,
        }),
      });
      if (fbRes.ok) {
        const { feedback: fb } = await fbRes.json();
        setFeedback((prev) => ({ ...prev, [step.order]: fb }));
        // Also mark as completed
        setCompleted((prev) => ({ ...prev, [step.order]: true }));
      }
    } catch {
      // silently fail — photo just won't have feedback
    } finally {
      setUploading((prev) => ({ ...prev, [step.order]: false }));
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
          <ListChecks className="h-4.5 w-4.5 text-brand-teal-500" />
          Step-by-Step Instructions
        </h2>
        <span className="text-sm font-semibold text-slate-500">
          {doneCount}/{totalCount} done
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-brand-teal-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {pct === 100 && (
        <p className="mt-2 text-center text-sm font-semibold text-brand-teal-600">
          🎉 All steps complete! Time to admire your work.
        </p>
      )}

      <ol className="mt-5 space-y-4">
        {sorted.map((step) => {
          const isDone = completed[step.order] ?? false;
          const isExpanded = expanded[step.order] ?? false;
          const stepFeedback = feedback[step.order];
          const stepPhoto = photos[step.order];
          const isUploading = uploading[step.order] ?? false;

          return (
            <li
              key={step.order}
              className={`rounded-2xl border transition-colors ${
                isDone
                  ? "border-brand-teal-200 bg-brand-teal-50/50"
                  : "border-slate-100 bg-white"
              }`}
            >
              {/* Step header */}
              <div className="flex items-start gap-3 p-4">
                <button
                  onClick={() => toggleStep(step.order, !isDone)}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                    isDone
                      ? "border-brand-teal-500 bg-brand-teal-500 text-white"
                      : "border-slate-300 hover:border-brand-teal-400"
                  }`}
                  aria-label={isDone ? "Mark incomplete" : "Mark complete"}
                >
                  {isDone && (
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${isDone ? "text-brand-teal-700 line-through decoration-brand-teal-400" : "text-slate-900"}`}>
                      <span className="mr-1.5 font-bold text-slate-400">{step.order}.</span>
                      {step.title}
                    </p>
                    <div className="flex shrink-0 items-center gap-2">
                      {step.time_minutes && (
                        <span className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3 w-3" />
                          {step.time_minutes}m
                        </span>
                      )}
                      <button
                        onClick={() => setExpanded((prev) => ({ ...prev, [step.order]: !isExpanded }))}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Collapsed: show description always */}
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{step.description}</p>

                  {/* Photo + AI feedback strip */}
                  {(stepPhoto || stepFeedback) && (
                    <div className="mt-3 flex gap-3">
                      {stepPhoto && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={stepPhoto}
                          alt={`Step ${step.order} progress`}
                          className="h-16 w-16 shrink-0 rounded-xl object-cover"
                        />
                      )}
                      {stepFeedback && (
                        <div className="flex items-start gap-1.5 rounded-xl bg-purple-50 px-3 py-2">
                          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-purple-500" />
                          <p className="text-xs leading-relaxed text-purple-800">{stepFeedback}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Expanded: quality checks + photo upload */}
              {isExpanded && (
                <div className="border-t border-slate-100 px-4 pb-4 pt-3 space-y-3">
                  {step.quality_checkpoint && (
                    <div className="flex items-start gap-2 rounded-lg bg-brand-teal-50 px-3 py-2">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-teal-500" />
                      <p className="text-xs text-brand-teal-700">
                        <strong>Quality check:</strong> {step.quality_checkpoint}
                      </p>
                    </div>
                  )}
                  {step.common_mistake && (
                    <div className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-red-400" />
                      <p className="text-xs text-red-700">
                        <strong>Common mistake:</strong> {step.common_mistake}
                      </p>
                    </div>
                  )}
                  {step.pro_tip && (
                    <div className="flex items-start gap-2 rounded-lg bg-brand-orange-50 px-3 py-2">
                      <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-orange-500" />
                      <p className="text-xs text-brand-orange-700">
                        <strong>Pro tip:</strong> {step.pro_tip}
                      </p>
                    </div>
                  )}

                  {/* Photo upload for AI feedback */}
                  <div>
                    <input
                      ref={(el) => { fileRefs.current[step.order] = el; }}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handlePhotoUpload(step, file);
                        e.target.value = "";
                      }}
                    />
                    <button
                      onClick={() => fileRefs.current[step.order]?.click()}
                      disabled={isUploading}
                      className="flex items-center gap-2 rounded-xl border border-dashed border-purple-200 bg-purple-50 px-3 py-2 text-xs font-medium text-purple-700 transition hover:bg-purple-100 disabled:opacity-60"
                    >
                      {isUploading ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Camera className="h-3.5 w-3.5" />
                      )}
                      {isUploading
                        ? "Analyzing your progress…"
                        : stepFeedback
                        ? "Upload new photo for fresh feedback"
                        : "Upload photo — get AI feedback"}
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </Card>
  );
}
