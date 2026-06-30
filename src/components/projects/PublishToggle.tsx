"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Globe2, Lock, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { togglePublish } from "@/app/community/[id]/actions";

export function PublishToggle({ projectId, isPublic }: { projectId: string; isPublic: boolean }) {
  const [published, setPublished] = useState(isPublic);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !published;
    setPublished(next);
    startTransition(async () => {
      await togglePublish(projectId, next);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Button variant="outline" size="sm" onClick={handleToggle} disabled={isPending}>
        {isPending ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : published ? (
          <Globe2 className="h-3.5 w-3.5 text-brand-teal-500" />
        ) : (
          <Lock className="h-3.5 w-3.5" />
        )}
        {published ? "Published to Community" : "Publish to Community"}
      </Button>
      {published && (
        <Link
          href={`/community/${projectId}`}
          className="flex items-center gap-1 text-xs font-medium text-brand-blue-600 hover:underline"
        >
          View public page <ExternalLink className="h-3 w-3" />
        </Link>
      )}
    </div>
  );
}
