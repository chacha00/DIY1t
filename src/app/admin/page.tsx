import { Users, FolderKanban, DollarSign, Crown, Sparkles, TrendingUp } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import { Card } from "@/components/ui/Card";

function formatCents(cents: number) {
  return `$${(cents / 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { count: totalUsers },
    { count: totalProjects },
    { count: projectsThisWeek },
    { count: activeSubscriptions },
    { data: payments },
    { data: categoryRows },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("projects").select("*", { count: "exact", head: true }),
    supabase
      .from("projects")
      .select("*", { count: "exact", head: true })
      .gte("created_at", sevenDaysAgo),
    supabase
      .from("subscriptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
    supabase
      .from("payments")
      .select("amount_cents")
      .eq("status", "succeeded")
      .returns<{ amount_cents: number }[]>(),
    supabase
      .from("projects")
      .select("category_id, categories(name)")
      .not("category_id", "is", null)
      .returns<{ category_id: string; categories: { name: string } | null }[]>(),
  ]);

  const totalRevenueCents = (payments ?? []).reduce((sum, p) => sum + (p.amount_cents ?? 0), 0);

  const categoryCounts = new Map<string, number>();
  const typedCategoryRows = (categoryRows ?? []) as unknown as {
    category_id: string;
    categories: { name: string } | null;
  }[];
  for (const row of typedCategoryRows) {
    const name = row.categories?.name;
    if (!name) continue;
    categoryCounts.set(name, (categoryCounts.get(name) ?? 0) + 1);
  }
  const topCategories = [...categoryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Admin Overview</h1>
        <p className="mt-1 text-sm text-slate-500">Platform-wide metrics and activity.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Users" value={String(totalUsers ?? 0)} icon={Users} accent="blue" />
        <StatCard label="Total Projects" value={String(totalProjects ?? 0)} icon={FolderKanban} accent="teal" />
        <StatCard label="Total Revenue" value={formatCents(totalRevenueCents)} icon={DollarSign} accent="orange" />
        <StatCard label="Active Subscriptions" value={String(activeSubscriptions ?? 0)} icon={Crown} accent="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Sparkles className="h-4.5 w-4.5 text-brand-teal-500" />
            AI Usage
          </h2>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-500">Projects generated (all time)</span>
              <span className="text-sm font-bold text-slate-900">{totalProjects ?? 0}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <span className="text-sm text-slate-500">Projects generated (last 7 days)</span>
              <span className="text-sm font-bold text-slate-900">{projectsThisWeek ?? 0}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <TrendingUp className="h-4.5 w-4.5 text-brand-orange-500" />
            Most Popular Categories
          </h2>
          <div className="mt-5 space-y-3">
            {topCategories.length > 0 ? (
              topCategories.map(([name, count]) => (
                <div key={name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
                  <span className="text-sm text-slate-600">{name}</span>
                  <span className="text-sm font-bold text-slate-900">{count}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No category data yet.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
