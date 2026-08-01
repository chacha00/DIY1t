import Link from "next/link";
import { Coins, FolderKanban, Heart, Crown, Sparkles, History, Camera, Package, TrendingUp, ChevronRight, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
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
  free: "Free",
  monthly_unlimited: "DIY+",
  annual_unlimited: "Maker Pro",
};

const QUICK_ACTIONS = [
  { icon: Camera, label: "Analyze a Photo", desc: "Upload or take a photo", href: "/dashboard/new", color: "bg-brand-blue-50 text-brand-blue-600" },
  { icon: Package, label: "My Projects", desc: "Browse your library", href: "/dashboard/projects", color: "bg-brand-orange-50 text-brand-orange-600" },
  { icon: Heart, label: "Favorites", desc: "Saved projects", href: "/dashboard/saved", color: "bg-pink-50 text-pink-600" },
  { icon: Package, label: "Materials", desc: "My inventory", href: "/dashboard/materials", color: "bg-teal-50 text-teal-600" },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: subscription }, { data: recentProjects }, { data: inProgressProjects }] =
    await Promise.all([
      supabase
        .from("profiles")
        .select("credits_balance, total_projects, total_money_saved_cents, full_name")
        .eq("id", user!.id)
        .single<Pick<Profile, "credits_balance" | "total_projects" | "total_money_saved_cents" | "full_name">>(),
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
        .limit(6)
        .returns<ProjectListRow[]>(),
      supabase
        .from("projects")
        .select("id, title, status, difficulty, estimated_cost_cents, estimated_time_minutes, is_favorite, build_type")
        .eq("user_id", user!.id)
        .eq("status", "in_progress")
        .order("updated_at", { ascending: false })
        .limit(3)
        .returns<ProjectListRow[]>(),
    ]);

  const plan = subscription?.plan ?? "free";
  const planLabel = PLAN_LABELS[plan];
  const hasUnlimited = plan === "monthly_unlimited" || plan === "annual_unlimited";
  const moneySavedCents = profile?.total_money_saved_cents ?? 0;
  const moneySaved = moneySavedCents >= 100 ? `$${(moneySavedCents / 100).toFixed(0)}` : "$0";
  const totalProjects = profile?.total_projects ?? 0;
  const creditsLeft = profile?.credits_balance ?? 0;
  const firstName = profile?.full_name?.split(" ")[0];
  const greeting = firstName ? `Welcome back, ${firstName}` : "Welcome back";

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{greeting} 👋</h1>
          <p className="mt-1 text-sm text-slate-500">Ready to build something? DIY Vision™ is standing by.</p>
        </div>
        <LinkButton href="/dashboard/new" size="md">
          <Sparkles className="h-4 w-4" />
          Analyze a Photo
        </LinkButton>
      </div>

      {/* Savings hero strip */}
      <div className="rounded-[20px] bg-gradient-to-r from-brand-blue-600 via-brand-blue-500 to-brand-teal-500 p-6 text-white shadow-lg">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Total Saved</p>
            <p className="mt-1 text-3xl font-extrabold">{moneySaved}</p>
            <p className="mt-0.5 text-xs text-white/60">vs. buying retail</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Projects Built</p>
            <p className="mt-1 text-3xl font-extrabold">{totalProjects}</p>
            <p className="mt-0.5 text-xs text-white/60">DIY projects</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
              {hasUnlimited ? "Plan" : "Projects Left"}
            </p>
            <p className="mt-1 text-3xl font-extrabold">
              {hasUnlimited ? planLabel : creditsLeft}
            </p>
            <p className="mt-0.5 text-xs text-white/60">
              {hasUnlimited ? "unlimited projects" : "this month"}
            </p>
          </div>
          <div className="flex items-center justify-end sm:justify-center">
            {!hasUnlimited && (
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 rounded-xl bg-white/20 px-4 py-2.5 text-sm font-bold text-white hover:bg-white/30 transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                Upgrade
              </Link>
            )}
            {hasUnlimited && (
              <div className="text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Status</p>
                <p className="mt-1 text-sm font-bold text-yellow-300">✦ {planLabel}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.href} href={action.href} className="group rounded-[16px] border border-slate-100 bg-white p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-soft-lg">
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <p className="text-sm font-bold text-slate-800">{action.label}</p>
            <p className="mt-0.5 text-xs text-slate-500">{action.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">

        {/* Continue working */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-slate-900">
              <History className="h-4.5 w-4.5 text-brand-blue-500" />
              Recent Projects
            </h2>
            <Link href="/dashboard/projects" className="flex items-center gap-1 text-sm font-medium text-brand-blue-600 hover:underline">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-5 space-y-3">
            {recentProjects && recentProjects.length > 0 ? (
              recentProjects.map((project) => <ProjectListItem key={project.id} project={project} />)
            ) : (
              <EmptyState
                icon={FolderKanban}
                title="No projects yet"
                description="Upload a photo to let DIY Vision™ build your first guide."
                ctaLabel="Analyze a Photo"
                ctaHref="/dashboard/new"
              />
            )}
          </div>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Continue building */}
          {inProgressProjects && inProgressProjects.length > 0 && (
            <Card className="p-5">
              <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <Sparkles className="h-4 w-4 text-brand-orange-500" />
                Continue Building
              </h2>
              <div className="mt-4 space-y-3">
                {inProgressProjects.map((p) => (
                  <Link key={p.id} href={`/dashboard/projects/${p.id}`} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 px-3 py-2.5 text-sm hover:border-brand-blue-200 hover:bg-brand-blue-50 transition-colors">
                    <span className="h-2 w-2 rounded-full bg-brand-orange-400 shrink-0" />
                    <span className="flex-1 truncate font-medium text-slate-800">{p.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {/* DIY Vision promo / upgrade */}
          <Card className="overflow-hidden p-0">
            <div className="bg-gradient-to-br from-brand-blue-600 to-brand-teal-500 p-5 text-white">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">👁️</span>
                <span className="text-sm font-bold">DIY Vision™</span>
              </div>
              <p className="text-xs text-white/80 leading-relaxed">
                Upload a photo of any pet product and DIY Vision™ will reverse-engineer it — patterns, materials, and step-by-step instructions in seconds.
              </p>
            </div>
            <div className="p-4">
              <Link href="/dashboard/new" className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                Start New Project
              </Link>
            </div>
          </Card>

          {/* Upgrade nudge for free users */}
          {!hasUnlimited && (
            <Card className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-brand-orange-500" />
                <p className="text-sm font-bold text-slate-900">Go Unlimited</p>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Most members save enough on their first project to pay for an entire year of DIY1T.
              </p>
              <Link href="/pricing" className="mt-3 flex items-center gap-1 text-xs font-bold text-brand-blue-600 hover:underline">
                See plans <ChevronRight className="h-3 w-3" />
              </Link>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
