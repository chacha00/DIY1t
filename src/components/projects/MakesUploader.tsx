"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Camera, Plus, X, Loader2, ImagePlus } from "lucide-react";

interface Make {
  id: string;
  url: string;
  caption: string | null;
  created_at: string;
}

interface Props {
  projectId: string;
  initialCount: number;
}

export function MakesUploader({ projectId, initialCount }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [makes, setMakes] = useState<Make[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [count, setCount] = useState(initialCount);
  const inputRef = useRef<HTMLInputElement>(null);

  async function loadMakes() {
    if (loaded) return;
    const res = await fetch(`/api/projects/${projectId}/makes`);
    const data = await res.json();
    setMakes(data.makes ?? []);
    setLoaded(true);
  }

  function handleToggle() {
    if (!expanded) loadMakes();
    setExpanded((e) => !e);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  }

  async function handleUpload() {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", pendingFile);
      fd.append("caption", caption);
      const res = await fetch(`/api/projects/${projectId}/makes`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.make) {
        setMakes((prev) => [data.make, ...prev]);
        setCount((c) => c + 1);
      }
    } finally {
      setUploading(false);
      setPendingFile(null);
      setPreviewUrl(null);
      setCaption("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function handleDelete(makeId: string) {
    await fetch(`/api/projects/${projectId}/makes?makeId=${makeId}`, { method: "DELETE" });
    setMakes((prev) => prev.filter((m) => m.id !== makeId));
    setCount((c) => Math.max(0, c - 1));
  }

  return (
    <div>
      <button
        onClick={handleToggle}
        className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-blue-600 transition-colors"
      >
        <Camera className="h-3.5 w-3.5" />
        My Makes {count > 0 && <span className="text-brand-blue-500">({count})</span>}
        <span className="text-slate-300">{expanded ? "▲" : "▼"}</span>
      </button>

      {expanded && (
        <div className="mt-3 space-y-3">
          {/* Existing makes */}
          {makes.length > 0 && (
            <div className="grid grid-cols-3 gap-1.5">
              {makes.map((make) => (
                <div key={make.id} className="group relative aspect-square rounded-lg overflow-hidden bg-slate-100">
                  <Image src={make.url} alt={make.caption ?? "My make"} fill className="object-cover" />
                  <button
                    onClick={() => handleDelete(make.id)}
                    className="absolute top-1 right-1 hidden group-hover:flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Upload area */}
          {previewUrl ? (
            <div className="space-y-2">
              <div className="relative h-32 rounded-xl overflow-hidden bg-slate-100">
                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                <button
                  onClick={() => { setPendingFile(null); setPreviewUrl(null); }}
                  className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a caption (optional)"
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-brand-blue-400"
              />
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-blue-500 py-2 text-xs font-semibold text-white hover:bg-brand-blue-600 disabled:opacity-50 transition-colors"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
                {uploading ? "Uploading…" : "Save photo"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => inputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-3 text-xs font-medium text-slate-400 hover:border-brand-blue-300 hover:text-brand-blue-500 transition-colors"
            >
              <ImagePlus className="h-4 w-4" />
              Upload a photo of your build
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      )}
    </div>
  );
}
