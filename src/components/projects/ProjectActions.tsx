"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, Heart, Share2, RefreshCw, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ImproveDesignModal } from "@/components/projects/ImproveDesignModal";
import { toggleFavorite } from "@/app/dashboard/projects/[id]/actions";

export function ProjectActions({ projectId, isFavorite }: { projectId: string; isFavorite: boolean }) {
  const router = useRouter();
  const [favorite, setFavorite] = useState(isFavorite);
  const [favPending, startFavTransition] = useTransition();
  const [downloading, setDownloading] = useState<"instructions" | "shopping_list" | null>(null);
  const [anotherLoading, setAnotherLoading] = useState(false);
  const [anotherError, setAnotherError] = useState<string | null>(null);
  const [showImproveModal, setShowImproveModal] = useState(false);

  function handleFavorite() {
    setFavorite((v) => !v);
    startFavTransition(async () => {
      await toggleFavorite(projectId, !favorite);
    });
  }

  function handleDownload(kind: "instructions" | "shopping_list") {
    setDownloading(kind);
    window.location.href = `/api/projects/${projectId}/pdf?kind=${kind}`;
    setTimeout(() => setDownloading(null), 2000);
  }

  async function handleAnotherVersion() {
    setAnotherLoading(true);
    setAnotherError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/improve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ improvementType: "another_version" }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generation failed");
      router.push(`/dashboard/projects/${json.projectId}`);
    } catch (err) {
      setAnotherError(err instanceof Error ? err.message : "Something went wrong");
      setAnotherLoading(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-start gap-3">
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleDownload("instructions")}
          disabled={downloading !== null}
        >
          {downloading === "instructions" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Download PDF
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handleDownload("shopping_list")}
          disabled={downloading !== null}
        >
          {downloading === "shopping_list" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Shopping List
        </Button>

        <Button variant="outline" size="sm" onClick={handleFavorite} disabled={favPending}>
          <Heart className={`h-4 w-4 ${favorite ? "fill-brand-orange-500 text-brand-orange-500" : ""}`} />
          {favorite ? "Saved" : "Save"}
        </Button>

        <Button variant="outline" size="sm" disabled>
          <Share2 className="h-4 w-4" />
          Share
        </Button>

        <div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleAnotherVersion}
            disabled={anotherLoading}
          >
            {anotherLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {anotherLoading ? "Generating…" : "Generate Another Version"}
          </Button>
          {anotherError && <p className="mt-1 text-xs text-red-500">{anotherError}</p>}
        </div>

        <Button variant="outline" size="sm" onClick={() => setShowImproveModal(true)}>
          <Wand2 className="h-4 w-4" />
          Improve Design
        </Button>
      </div>

      {showImproveModal && (
        <ImproveDesignModal
          projectId={projectId}
          onClose={() => setShowImproveModal(false)}
        />
      )}
    </>
  );
}
