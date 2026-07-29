"use client";

import { useState, useTransition } from "react";
import {
  Shirt, ShoppingCart, CalendarCheck, GraduationCap, Printer, Trash2, Plus,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input, Label } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import type { FabricStashItem, MakerShoppingListItem, PlannerEntry } from "@/types/database";
import {
  addFabricStashItem, deleteFabricStashItem,
  addShoppingListItem, deleteShoppingListItem, toggleShoppingListBought,
  addPlannerEntry, deletePlannerEntry, togglePlannerEntryDone,
} from "@/app/dashboard/planner/actions";

type ProjectOption = { id: string; title: string };

const TABS = [
  { id: "stash", label: "Fabric Stash", icon: Shirt },
  { id: "shopping", label: "Shopping List", icon: ShoppingCart },
  { id: "todo", label: "Project Planner", icon: CalendarCheck },
  { id: "tips", label: "Beginner Tips", icon: GraduationCap },
  { id: "print", label: "Print & Assembly", icon: Printer },
] as const;

type TabId = (typeof TABS)[number]["id"];

function formatCents(cents: number | null) {
  if (cents == null) return null;
  return `$${(cents / 100).toFixed(2)}`;
}

function DeleteButton({ onDelete }: { onDelete: () => void }) {
  const [isPending, startTransition] = useTransition();
  return (
    <button
      onClick={() => startTransition(onDelete)}
      disabled={isPending}
      className="rounded-full p-1.5 text-slate-300 hover:bg-red-50 hover:text-red-400 disabled:opacity-50"
      aria-label="Delete"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}

function AddCard({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="flex w-full items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-brand-blue-200 bg-brand-blue-50/30 py-6 text-sm font-semibold text-brand-blue-600 transition-colors hover:bg-brand-blue-50"
      >
        <Plus className="h-4 w-4" />
        {title}
      </button>
    );
  }
  return (
    <div className="rounded-3xl border border-brand-blue-200 bg-white p-6 shadow-soft">
      <h3 className="mb-4 text-sm font-bold text-slate-900">{title}</h3>
      {children}
      <button onClick={() => setOpen(false)} className="mt-2 text-xs font-semibold text-slate-400 hover:text-slate-600">
        Cancel
      </button>
    </div>
  );
}

// ── Fabric Stash ────────────────────────────────────────────────────────────

function FabricStashTab({ items }: { items: FabricStashItem[] }) {
  return (
    <div className="space-y-4">
      <AddCard title="Add Fabric to Stash">
        <form action={addFabricStashItem} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="fabric_name">Fabric Name *</Label>
              <Input id="fabric_name" name="fabric_name" required placeholder="Anti-pill fleece" />
            </div>
            <div>
              <Label htmlFor="fiber_content">Fiber Content</Label>
              <Input id="fiber_content" name="fiber_content" placeholder="100% polyester" />
            </div>
            <div>
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" placeholder="Navy" />
            </div>
            <div>
              <Label htmlFor="shop">Shop</Label>
              <Input id="shop" name="shop" placeholder="JOANN" />
            </div>
            <div>
              <Label htmlFor="yardage">Yardage</Label>
              <Input id="yardage" name="yardage" type="number" step="0.25" placeholder="1.5" />
            </div>
            <div>
              <Label htmlFor="width_in">Width (in)</Label>
              <Input id="width_in" name="width_in" type="number" step="0.5" placeholder="60" />
            </div>
            <div>
              <Label htmlFor="cost_dollars">Cost ($)</Label>
              <Input id="cost_dollars" name="cost_dollars" type="number" step="0.01" placeholder="12.99" />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" placeholder="Good for hoodie bodies" />
          </div>
          <Button type="submit" size="sm">Add to Stash</Button>
        </form>
      </AddCard>

      {items.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <Card key={item.id} className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{item.fabric_name}</p>
                  <p className="text-xs text-slate-400">
                    {[item.fiber_content, item.color].filter(Boolean).join(" · ")}
                  </p>
                </div>
                <DeleteButton onDelete={() => deleteFabricStashItem(item.id)} />
              </div>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {item.yardage != null && <span>{item.yardage} yd</span>}
                {item.width_in != null && <span>{item.width_in}" wide</span>}
                {item.cost_cents != null && <span className="font-semibold text-brand-teal-600">{formatCents(item.cost_cents)}</span>}
                {item.shop && <span>{item.shop}</span>}
              </div>
              {item.notes && <p className="mt-2 text-xs text-slate-400">{item.notes}</p>}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shopping List ───────────────────────────────────────────────────────────

function ShoppingListTab({ items }: { items: MakerShoppingListItem[] }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="space-y-4">
      <AddCard title="Add Item to Shopping List">
        <form action={addShoppingListItem} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="item_name">Item *</Label>
              <Input id="item_name" name="item_name" required placeholder="Side-release buckles" />
            </div>
            <div>
              <Label htmlFor="shop">Shop</Label>
              <Input id="shop" name="shop" placeholder="Amazon" />
            </div>
            <div>
              <Label htmlFor="budget_dollars">Budget ($)</Label>
              <Input id="budget_dollars" name="budget_dollars" type="number" step="0.01" placeholder="10.00" />
            </div>
            <div>
              <Label htmlFor="price_dollars">Actual Price ($)</Label>
              <Input id="price_dollars" name="price_dollars" type="number" step="0.01" placeholder="8.50" />
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" placeholder="Need 1.5in width to match webbing" />
          </div>
          <Button type="submit" size="sm">Add Item</Button>
        </form>
      </AddCard>

      {items.length > 0 && (
        <Card className="divide-y divide-slate-100 p-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 px-3 py-3">
              <input
                type="checkbox"
                checked={item.is_bought}
                disabled={isPending}
                onChange={(e) => startTransition(() => toggleShoppingListBought(item.id, e.target.checked))}
                className="h-4 w-4 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-400"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${item.is_bought ? "text-slate-400 line-through" : "text-slate-900"}`}>
                  {item.item_name}
                </p>
                <p className="text-xs text-slate-400">
                  {[item.shop, item.price_cents != null ? formatCents(item.price_cents) : item.budget_cents != null ? `budget ${formatCents(item.budget_cents)}` : null]
                    .filter(Boolean).join(" · ")}
                </p>
              </div>
              <DeleteButton onDelete={() => deleteShoppingListItem(item.id)} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ── Project Planner ─────────────────────────────────────────────────────────

function PlannerEntryTab({ entries, projects }: { entries: PlannerEntry[]; projects: ProjectOption[] }) {
  const [isPending, startTransition] = useTransition();
  return (
    <div className="space-y-4">
      <AddCard title="Add Planner Entry">
        <form action={addPlannerEntry} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="title">Task *</Label>
              <Input id="title" name="title" required placeholder="Cut pattern pieces" />
            </div>
            <div>
              <Label htmlFor="entry_date">Date</Label>
              <Input id="entry_date" name="entry_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="project_id">Link to Project (optional)</Label>
              <Select id="project_id" name="project_id" defaultValue="">
                <option value="">No project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </Select>
            </div>
          </div>
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Input id="notes" name="notes" placeholder="Remember 5/8in seam allowance" />
          </div>
          <Button type="submit" size="sm">Add Entry</Button>
        </form>
      </AddCard>

      {entries.length > 0 && (
        <Card className="divide-y divide-slate-100 p-2">
          {entries.map((entry) => (
            <div key={entry.id} className="flex items-center gap-3 px-3 py-3">
              <input
                type="checkbox"
                checked={entry.is_done}
                disabled={isPending}
                onChange={(e) => startTransition(() => togglePlannerEntryDone(entry.id, e.target.checked))}
                className="h-4 w-4 rounded border-slate-300 text-brand-blue-600 focus:ring-brand-blue-400"
              />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold ${entry.is_done ? "text-slate-400 line-through" : "text-slate-900"}`}>
                  {entry.title}
                </p>
                <p className="text-xs text-slate-400">
                  {entry.entry_date}
                  {entry.notes ? ` · ${entry.notes}` : ""}
                </p>
              </div>
              <DeleteButton onDelete={() => deletePlannerEntry(entry.id)} />
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ── Static reference guides (original content, no DB) ───────────────────────

function GuideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2 text-sm font-bold text-slate-900">{title}</h3>
      <div className="space-y-2 text-sm leading-relaxed text-slate-600">{children}</div>
    </div>
  );
}

function BeginnerTipsTab() {
  return (
    <Card className="space-y-6 p-6">
      <GuideSection title="Tools & setup">
        <p>Sharp fabric scissors (or a rotary cutter + mat), pins or fabric clips, a seam gauge or ruler, and a ballpoint needle for knits/fleece — a universal needle will skip stitches on stretch fabric.</p>
      </GuideSection>
      <GuideSection title="Seam allowances">
        <p>Unless a pattern piece says otherwise, ⅝" is standard for woven fabric, ¼" for knits, and ½" for leather or vinyl. Sew a test seam on scrap fabric first to confirm your machine's tension and stitch length before cutting into good fabric.</p>
      </GuideSection>
      <GuideSection title="Reading row/round notation (knit & crochet)">
        <p>Every row or round in a DIY1t pattern ends with a stitch count in parentheses, e.g. <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">Row 4: K2, *P2, K2, rep from * to end (24 sts)</code>. If your count doesn't match after a row, stop and recount before continuing — small errors compound quickly.</p>
      </GuideSection>
      <GuideSection title="Common beginner mistakes">
        <p>Measuring over an existing collar instead of directly on your pet's skin (adds up to 1" of error), skipping a test seam on scrap fabric, and forcing a too-small armhole rather than sizing up. When in doubt, size up and take in the seam later — it's much harder to add fabric back.</p>
      </GuideSection>
    </Card>
  );
}

function PrintAssemblyTab() {
  return (
    <Card className="space-y-6 p-6">
      <GuideSection title="Print at true 100% scale">
        <p>When printing a pattern-piece PDF or SVG, select "Actual Size" (or set scaling to "None") in your print dialog — never "Fit to Page", which silently resizes your pattern. Every DIY1t SVG download includes a 1-inch calibration square on the first piece; measure it with a ruler after printing and confirm it's exactly 1 inch before cutting any fabric.</p>
      </GuideSection>
      <GuideSection title="Assembling multi-page patterns">
        <p>For larger pieces that span more than one printed page, trim the margin off one page and overlap it onto the next, lining up any matching edge marks, then tape or glue-stick them together before cutting.</p>
      </GuideSection>
      <GuideSection title="Notches and grain lines">
        <p>The small triangular notches on a pattern piece mark where it lines up with the piece it's sewn to — match notch to notch, not just edge to edge. The grain-line arrow should run parallel to the fabric's selvage (the finished, non-fraying edge) when you lay out the pattern for cutting.</p>
      </GuideSection>
      <GuideSection title="Cutting">
        <p>Cut one layer of fabric at a time for accuracy, and use pattern weights or pins rather than tracing around a moving piece. Fold-cut pieces (marked with a red dashed fold line) are cut once on folded fabric, not cut twice and sewn together.</p>
      </GuideSection>
    </Card>
  );
}

// ── Hub ───────────────────────────────────────────────────────────────────

export function PlannerHub({
  fabricStash,
  shoppingList,
  plannerEntries,
  projects,
}: {
  fabricStash: FabricStashItem[];
  shoppingList: MakerShoppingListItem[];
  plannerEntries: PlannerEntry[];
  projects: ProjectOption[];
}) {
  const [tab, setTab] = useState<TabId>("stash");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              tab === t.id
                ? "bg-brand-blue-600 text-white shadow-soft"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab === "stash" && <FabricStashTab items={fabricStash} />}
      {tab === "shopping" && <ShoppingListTab items={shoppingList} />}
      {tab === "todo" && <PlannerEntryTab entries={plannerEntries} projects={projects} />}
      {tab === "tips" && <BeginnerTipsTab />}
      {tab === "print" && <PrintAssemblyTab />}
    </div>
  );
}
