"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, Camera, Clipboard, ImageOff, X } from "lucide-react";
import { cn } from "@/lib/cn";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"];
const MAX_SIZE_BYTES = 15 * 1024 * 1024;

export function Dropzone({
  onFileSelected,
}: {
  onFileSelected: (file: File) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (file: File | undefined | null) => {
      if (!file) return;

      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError("Please upload a JPEG, PNG, WEBP, or HEIC image.");
        return;
      }
      if (file.size > MAX_SIZE_BYTES) {
        setError("Image must be smaller than 15MB.");
        return;
      }

      setError(null);
      setPreviewUrl(URL.createObjectURL(file));
      onFileSelected(file);
    },
    [onFileSelected]
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onPaste={(e) => {
          const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith("image/"));
          handleFile(item?.getAsFile());
        }}
        tabIndex={0}
        className={cn(
          "relative flex flex-col items-center justify-center gap-4 rounded-3xl border-2 border-dashed px-6 py-16 text-center transition-colors focus:outline-none",
          isDragging
            ? "border-brand-blue-400 bg-brand-blue-50/50"
            : "border-slate-200 bg-white hover:border-brand-blue-200"
        )}
      >
        {previewUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Selected upload preview"
              className="max-h-64 rounded-2xl object-contain shadow-soft"
            />
            <button
              type="button"
              onClick={() => {
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute -right-3 -top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-slate-500 shadow-soft hover:text-red-500"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-blue-50">
              <UploadCloud className="h-8 w-8 text-brand-blue-500" />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-700">
                Drag & drop a photo, or click to browse
              </p>
              <p className="mt-1 text-xs text-slate-400">
                JPEG, PNG, WEBP, or HEIC &middot; up to 15MB &middot; paste also works
              </p>
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-blue-300 hover:text-brand-blue-700"
          >
            <UploadCloud className="h-4 w-4" />
            Choose File
          </button>
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-blue-300 hover:text-brand-blue-700"
          >
            <Camera className="h-4 w-4" />
            Use Camera
          </button>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-400">
            <Clipboard className="h-4 w-4" />
            Ctrl+V to paste
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && (
        <p className="mt-3 flex items-center gap-1.5 text-sm font-medium text-red-500">
          <ImageOff className="h-4 w-4" />
          {error}
        </p>
      )}
    </div>
  );
}
