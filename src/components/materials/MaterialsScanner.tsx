"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  Camera, Loader2, Sparkles, Trash2, Clock, DollarSign,
  Package, ChevronRight, ScanLine, CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/Card";

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  color: string | null;
  quantity_estimate: string | null;
  confidence: number;
  photo_url: string | null;
  created_at: string;
}

interface MatchableProject {
  id: string;
  title: string;
  difficulty: string;
  estimated_cost_cents: number | null;
  estimated_time_minutes: number | null;
  build_type: string | null;
  matchPct: number;
  matchedCount: number;
  totalMaterials: number;
}

interface Props {
  initialInventory: InventoryItem[];
}

const CATEGORY_COLORS: Record<string, string> = {
  fabric: "bg-blue-100 text-blue-700",
  hardware: "bg-slate-100 text-slate-700",
  notions: "bg-purple-100 text-purple-700",
  tools: "bg-orange-100 text-orange-700",
  other: "bg-slate-100 text-slate-600",
};

function fmt(cents: number | null) {
  if (!cents) return null;
  return `$${(cents / 100).toFixed(0)}`;
}

function fmtTime(min: number | null) {
  if (!min) return null;
  return min < 60 ? `${min}m` : `${(min / 60).toFixed(1)}h`;
}

export function MaterialsScanner({ initialInventory }: Props) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{ summary: string; count: number } | null>(null);
  const [matchable, setMatchable] = useState<MatchableProject[] | null>(null);
  const [loadingMatch, setLoadingMatch] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleScan(file: File) {
    setScanning(true);
    setScanResult(null);
    try {
      // Upload photo
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/upload", { method: "POST", body: form });
      if (!uploadRes.ok) throw new Error("Upload failed");
      const { url } = await uploadRes.json();

      // Scan
      const scanRes = await fetch("/api/scan-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photo_url: url }),
      });
      const data = await scanRes.json();

      if (data.materials?.length) {
        // Refresh inventory from state (merge new items)
        const newItems: InventoryItem[] = data.materials.map((m: { name: string; category: string; color?: string; quantity_estimate?: string; confidence: number }, i: number) => ({
          id: `new-${Date.now()}-${i}`,
          name: m.name,
          category: m.category,
          color: m.color ?? null,
          quantity_estimate: m.quantity_estimate ?? null,
          confidence: m.confidence,
          photo_url: url,
          created_at: new Date().toISOString(),
        }));
        setInventory((prev) => [...newItems, ...prev]);
        setScanResult({ summary: data.summary, count: data.materials.length });
      } else {
        setScanResult({ summary: data.summary ?? "No craft materials detected in this photo.", count: 0 });
      }
    } catch {
      setScanResult({ summary: "Scan failed. Please try again.", count: 0 });
    } finally {
      setScanning(false);
    }
  }

  async function findMatchableProjects() {
    setLoadingMatch(true);
    try {
      const res = await fetch("/api/projects/matchable");
      const data = await res.json();
      setMatchable(data.projects ?? []);
    } finally {
      setLoadingMatch(false);
    }
  }

  async function removeItem(id: string) {
    setInventory((prev) => prev.filter((i) => i.id !== id));
    await fetch(`/api/inventory/${id}`, { method: "DELETE" }).catch(() => {});
  }

  const groupedByCategory = inventory.reduce<Record<string, InventoryItem[]>>((acc, item) => {
    const key = item.category || "other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">My Materials</h1>
        <p className="mt-1 text-sm text-slate-500">
          Photograph your craft supplies and see which projects you can build right now.
        </p>
      </div>

      {/* Scan card */}
      <Card className="overflow-hidden">
        <div className="flex items-center gap-4 bg-gradient-to-br from-brand-blue-600 to-purple-600 p-6 text-white">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <ScanLine className="h-7 w-7" />
          </div>
          <div>
            <p className="text-lg font-bold">Scan Your Supplies</p>
            <p className="mt-0.5 text-sm text-blue-100">
              Point your camera at fabric, hardware, or notions — AI identifies them instantly.
            </p>
          </div>
        </div>
        <div className="p-5">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleScan(f);
              e.target.value = "";
            }}
          />
          <button
            onClick={() => fileRef.current?.click()}
            disabled={scanning}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-blue-600 py-3 text-sm font-semibold text-white transition hover:bg-brand-blue-700 disabled:opacity-60"
          >
            {scanning ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> Scanning with AI…</>
            ) : (
              <><Camera className="h-4 w-4" /> Take Photo or Choose Image</>
            )}
          </button>

          {scanResult && (
            <div className={`mt-3 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${scanResult.count > 0 ? "bg-teal-50 text-teal-800" : "bg-slate-50 text-slate-600"}`}>
              {scanResult.count > 0 ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-teal-500" /> : <Package className="mt-0.5 h-4 w-4 shrink-0" />}
              <span>
                {scanResult.count > 0 && <strong>{scanResult.count} materials added. </strong>}
                {scanResult.summary}
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Inventory */}
      {inventory.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">
              Your Inventory <span className="ml-1.5 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">{inventory.length}</span>
            </h2>
            <button
              onClick={findMatchableProjects}
              disabled={loadingMatch}
              className="flex items-center gap-1.5 rounded-xl bg-brand-orange-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-orange-600 disabled:opacity-60"
            >
              {loadingMatch ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              What can I make?
            </button>
          </div>

          {Object.entries(groupedByCategory).map(([category, items]) => (
            <div key={category}>
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400 px-1">{category}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-3 py-2.5">
                    {item.photo_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.photo_url} alt="" className="h-10 w-10 shrink-0 rounded-lg object-cover" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                        <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold uppercase ${CATEGORY_COLORS[item.category] ?? CATEGORY_COLORS.other}`}>
                          {item.category}
                        </span>
                        {item.color && <span className="text-xs text-slate-400">{item.color}</span>}
                        {item.quantity_estimate && <span className="text-xs text-slate-400">· {item.quantity_estimate}</span>}
                      </div>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="shrink-0 text-slate-300 hover:text-red-400 transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Matchable projects */}
      {matchable !== null && (
        <div className="space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            {matchable.length > 0
              ? `You already have enough to start ${matchable.length} project${matchable.length !== 1 ? "s" : ""}`
              : "No strong matches yet — scan more supplies!"}
          </h2>

          {matchable.map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition hover:border-brand-blue-200 hover:shadow-soft"
            >
              {/* Match ring */}
              <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                <svg className="absolute inset-0 h-14 w-14 -rotate-90" viewBox="0 0 56 56">
                  <circle cx="28" cy="28" r="24" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                  <circle
                    cx="28" cy="28" r="24"
                    fill="none"
                    stroke={p.matchPct >= 80 ? "#14b8a6" : p.matchPct >= 50 ? "#f97316" : "#94a3b8"}
                    strokeWidth="4"
                    strokeDasharray={`${(p.matchPct / 100) * 150.8} 150.8`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-xs font-bold text-slate-700">{p.matchPct}%</span>
              </div>

              <div className="flex-1 min-w-0">
                <p className="truncate font-semibold text-slate-900">{p.title}</p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {p.matchedCount}/{p.totalMaterials} materials · {p.difficulty}
                  {fmtTime(p.estimated_time_minutes) && ` · ${fmtTime(p.estimated_time_minutes)}`}
                  {fmt(p.estimated_cost_cents) && ` · ${fmt(p.estimated_cost_cents)}`}
                </p>
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
            </Link>
          ))}
        </div>
      )}

      {/* Empty state */}
      {inventory.length === 0 && !scanning && (
        <div className="flex flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-slate-200 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
            <Package className="h-8 w-8 text-slate-400" />
          </div>
          <div>
            <p className="font-semibold text-slate-700">No materials scanned yet</p>
            <p className="mt-1 text-sm text-slate-400">
              Photograph your fabric, hardware, or supplies above to get started.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
