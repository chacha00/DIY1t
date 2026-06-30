"use client";

import { useState, useTransition } from "react";
import { Download, Heart, Share2, RefreshCw, Wand2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { toggleFavorite } from "@/app/dashboard/projects/[id]/actions";

export function ProjectActions({ projectId, isFavorite }: { projectId: string; isFavorite: boolean }) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isPending, startTransition] = useTransition();
  const [downloading, setDownloading] = useState<"instructions" | "shopping_list" | null>(null);

  function handleFavorite() {
    setFavorite((v) => !v);
    startTransition(async () => {
      await toggleFavorite(projectId, !favorite);
    });
  }

  function handleDownload(kind: "instructions" | "shopping_list") {
    setDownloading(kind);
    window.location.href = `/api/projects/${projectId}/pdf?kind=${kind}`;
    setTimeout(() => setDownloading(null), 2000);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button
        variant="primary"
        size="sm"
        onClick={() => handleDownload("instructions")}
        disabled={downloading !== null}
      >
        {downloading === "instructions" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Download PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleDownload("shopping_list")}
        disabled={downloading !== null}
      >
        {downloading === "shopping_list" ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Download className="h-4 w-4" />
        )}
        Shopping List
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleFavorite}
        disabled={isPending}
      >
        <Heart className={`h-4 w-4 ${favorite ? "fill-brand-orange-500 text-brand-orange-500" : ""}`} />
        {favorite ? "Saved" : "Save Project"}
      </Button>
      <Button variant="outline" size="sm" disabled>
        <Share2 className="h-4 w-4" />
        Share
      </Button>
      <Button variant="outline" size="sm" disabled>
        <RefreshCw className="h-4 w-4" />
        Generate Another Version
      </Button>
      <Button variant="outline" size="sm" disabled>
        <Wand2 className="h-4 w-4" />
        Improve Design
      </Button>
    </div>
  );
}
