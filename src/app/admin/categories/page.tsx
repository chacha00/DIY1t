import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { CategoryRow } from "@/components/admin/CategoryRow";
import { createCategory } from "./actions";
import type { Category } from "@/types/database";

export default async function AdminCategoriesPage() {
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })
    .returns<Category[]>();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Categories</h1>
        <p className="mt-1 text-sm text-slate-500">Manage the categories shown on the homepage.</p>
      </div>

      <Card className="p-6">
        <h2 className="text-sm font-bold text-slate-900">Add Category</h2>
        <form action={createCategory} className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input name="emoji" placeholder="🪵" className="sm:w-20" maxLength={4} />
          <Input name="name" placeholder="Category name" required className="flex-1" />
          <Button type="submit" size="sm">
            <Plus className="h-4 w-4" />
            Add
          </Button>
        </form>
      </Card>

      <Card className="overflow-x-auto p-0">
        <table className="w-full min-w-[500px] text-left">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <th className="px-4 py-3"></th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories && categories.length > 0 ? (
              categories.map((c) => <CategoryRow key={c.id} category={c} />)
            ) : (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-slate-400">
                  No categories yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
