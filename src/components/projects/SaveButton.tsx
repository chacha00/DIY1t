"use client";

import { useState } from "react";
import { Heart } from "lucide-react";

interface Props {
  projectId: string;
  initialSaved: boolean;
  className?: string;
}

export function SaveButton({ projectId, initialSaved, className }: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    if (loading) return;
    setLoading(true);
    try {
      const method = saved ? "DELETE" : "POST";
      await fetch(`/api/projects/${projectId}/save`, { method });
      setSaved((s) => !s);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      aria-label={saved ? "Unsave project" : "Save project"}
      className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-transform active:scale-90 disabled:opacity-50 ${className ?? ""}`}
    >
      <Heart
        className={`h-4 w-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-slate-400"}`}
      />
    </button>
  );
}
