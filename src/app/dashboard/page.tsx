import Link from "next/link";
import { Coins, FolderKanban, Heart, Crown, Sparkles, History } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/StatCard";
import { ProjectListItem } from "@/components/dashboard/ProjectListItem";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { LinkButton } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Profile, Subscription, Project } from "@/types/database";

type ProjectListRow = Pick<
  Project,
  "id" | "title" | "status" | "difficulty" | "estimated_cost_cents" | "estimated_time_minutes" | "is_favorite" | "build_type"
>;

const PLAN_LABELS: Record<string, string> = {
  free: "Free (3/month)",
  monthly_unlimited: "DIY+",
  annual_unlimited: "Maker Pro",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: subscription }, { data: recentProjects }, { data: favoriteProjects }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("credits_balance, total_projects, total_money_saved_cents")
        .eq("id", user!.id)
        .single<Pick<Profile, "credits_balance" | "total_projects" | "total_money_saved_cents">>(),
      supabase
        .from("subscriptions")
        .select("plan, status")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle<Pick<Subscription, "plan" | "status">>(),
      supabase
        .from("projects")
        .select("id, title, status, difficulty, estimated_cost_cents, estimated_time_minutes, is_favorite, build_type")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5)
        .returns<ProjectListRow[]>(),
      supabase
        .from("projects")
        .select("id, title, status, difficulty, estimated_cost_cents, estimated_time_minutes, is_favorite, build_type")
        .eq("user_id", user!.id)
        .eq("is_favorite", true)
        .order("created_at", { ascending: false })
        .limit(5)
        .returns<ProjectListRow[]>(),
    ]);

  const planLabel = PLAN_LABELS[subscription?.plan ?? "free"];
  const moneySaved = profile?.total_money_saved_cents
    ? `$${(profile.total_money_saved_cents / 100).toFixed(0)}`
    : "$0";

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">My Workshop</h1>
          <p className="mt-1 text-sm text-slate-500">Here&apos;s what&apos;s happening with your projects.</p>
        </div>
        <LinkButton href="/dashboard/new" size="md">
          <Sparkles className="h-4 w-4" />
          New Project
        </LinkButton>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Credits Remaining" value={String(profile?.credits_balance ?? 0)} icon={Coins} accent="orange" />
        <StatCard label="Total Projects" value={String(profile?.total_projects ?? 0)} icon={FolderKanban} accent="blue" />
        <StatCard label="Money Saved" value={moneySaved} icon={Crown} accent="teal" />
        <StatCard label="Subscription" value={planLabel} icon={Crown} accent="blue" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <History className="h-4.5 w-4.5 text-brand-blue-500" />
              Recent Projects
            </h2>
            <Link href="/dashboard/projects" className="text-sm font-medium text-brand-blue-600 hover:underline">
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentProjects && recentProjects.length > 0 ? (
              recentProjects.map((project) => <ProjectListItem key={project.id} project={project} />)
            ) : (
              <EmptyState
                icon={FolderKanban}
                title="No projects yet"
                description="Upload a photo to generate your first AI-powered DIY guide."
                ctaLabel="Start a Project"
                ctaHref="/dashboard/new"
              />
            )}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
            <Heart className="h-4.5 w-4.5 text-brand-orange-500" />
            Favorite Projects
          </h2>

          <div className="mt-5 space-y-3">
            {favoriteProjects && favoriteProjects.length > 0 ? (
              favoriteProjects.map((project) => <ProjectListItem key={project.id} project={project} />)
            ) : (
              <EmptyState
                icon={Heart}
                title="No favorites yet"
                description="Star a project to pin it here."
              />
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
