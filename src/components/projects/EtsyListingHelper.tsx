"use client";

import { useState } from "react";
import { ShoppingBag, Loader2, Copy, Check, Camera, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface EtsyListing {
  title: string;
  description: string;
  tags: string[];
  category_path: string;
  seo_keywords: string[];
  photo_tips: string[];
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
      title="Copy"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function EtsyListingHelper({ projectId }: { projectId: string }) {
  const [listing, setListing] = useState<EtsyListing | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/projects/${projectId}/etsy`, { method: "POST" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Generation failed");
      setListing(json as EtsyListing);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2">
        <ShoppingBag className="h-4.5 w-4.5 text-brand-orange-500" />
        <h2 className="text-base font-bold text-slate-900">Etsy listing helper</h2>
        <span className="ml-auto rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-purple-700">
          Pro
        </span>
      </div>
      <p className="mt-1 text-xs text-slate-400">AI-generates your title, description, tags, and category — ready to paste into Etsy.</p>

      {!listing && (
        <div className="mt-5">
          <Button variant="primary" size="sm" onClick={generate} disabled={loading} className="w-full">
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" />Generating listing…</> : <>Generate Etsy listing</>}
          </Button>
          {error && (
            <p className="mt-2 text-center text-xs text-red-500">{error}</p>
          )}
        </div>
      )}

      {listing && (
        <div className="mt-5 space-y-5">
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Title</p>
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">{listing.title.length}/140 chars</span>
                <CopyButton text={listing.title} />
              </div>
            </div>
            <p className="rounded-xl bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-800 leading-snug">{listing.title}</p>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</p>
              <CopyButton text={listing.description} />
            </div>
            <div className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-700 leading-relaxed whitespace-pre-line max-h-52 overflow-y-auto">
              {listing.description}
            </div>
          </div>

          {/* Tags */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tags ({listing.tags.length}/13)</p>
              <CopyButton text={listing.tags.join(", ")} />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {listing.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs text-slate-600">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Category + keywords row */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Etsy category</p>
              <p className="text-xs text-slate-700 leading-relaxed">{listing.category_path}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Top keywords</p>
              <ul className="space-y-0.5">
                {listing.seo_keywords.map(k => (
                  <li key={k} className="text-xs text-slate-600">• {k}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Photo tips */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Camera className="h-3.5 w-3.5 text-slate-400" />
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Photo tips</p>
            </div>
            <ul className="space-y-1.5">
              {listing.photo_tips.map((tip, i) => (
                <li key={i} className="flex gap-2 text-xs text-slate-600">
                  <span className="shrink-0 font-bold text-slate-400">{i + 1}.</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <Button variant="outline" size="sm" onClick={generate} disabled={loading} className="w-full">
            <RefreshCw className="h-3.5 w-3.5" />
            Regenerate listing
          </Button>
        </div>
      )}
    </Card>
  );
}
