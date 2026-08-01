import Link from "next/link";
import {
  Camera, Link2, ScanLine, PawPrint, BookOpen,
  ChevronRight, Sparkles, Crown, Eye, ArrowRight, FolderKanban
} from "lucide-react";
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
  {
    icon: Camera,
    label: "Upload Photo",
    desc: "Snap or upload any pet product",
    href: "/dashboard/new",
    color: "bg-brand-blue-50 text-brand-blue-600 border-brand-blue-100",
    hoverColor: "hover:bg-brand-blue-100 hover:border-brand-blue-300",
  },
  {
    icon: Link2,
    label: "Paste Product Link",
    desc: "Amazon, Etsy, Pinterest & more",
    href: "/dashboard/new?mode=url",
    color: "bg-brand-orange-50 text-brand-orange-600 border-brand-orange-100",
    hoverColor: "hover:bg-brand-orange-100 hover:border-brand-orange-300",
  },
  {
    icon: ScanLine,
    label: "Scan Barcode",
    desc: "Point at any product label",
    href: "/dashboard/new?mode=scan",
    color: "bg-violet-50 text-violet-600 border-violet-100",
    hoverColor: "hover:bg-violet-100 hover:border-violet-300",
  },
  {
    icon: PawPrint,
    label: "Manage Pets",
    desc: "Profiles, measurements & breeds",
    href: "/dashboard/pets",
    color: "bg-pink-50 text-pink-600 border-pink-100",
    hoverColor: "hover:bg-pink-100 hover:border-pink-300",
  },
  {
    icon: BookOpen,
    label: "Project Library",
    desc: "All your saved DIY plans",
    href: "/dashboard/projects",
    color: "bg-teal-50 text-teal-600 border-teal-100",
    hoverColor: "hover:bg-teal-100 hover:border-teal-300",
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: subscription }, { data: recentProjects }, { data: inProgressProjects }, { data: petCount }] =
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
        .limit(5)
        .returns<ProjectListRow[]>(),
      supabase
        .from("projects")
        .select("id, title, status, difficulty, estimated_cost_cents, estimated_time_minutes, is_favorite, build_type")
        .eq("user_id", user!.id)
        .in("status", ["in_progress", "draft"])
        .order("updated_at", { ascending: false })
        .limit(1)
        .returns<ProjectListRow[]>(),
      supabase
        .from("pets")
        .select("id")
        .eq("user_id", user!.id),
    ]);

  const plan = subscription?.plan ?? "free";
  const hasUnlimited = plan === "monthly_unlimited" || plan === "annual_unlimited";
  const planLabel = PLAN_LABELS[plan];
  const moneySavedCents = profile?.total_money_saved_cents ?? 0;
  const moneySaved = moneySavedCents >= 100
    ? `$${Math.round(moneySavedCents / 100).toLocaleString("en-US")}`
    : "$0";
  const totalProjects = profile?.total_projects ?? 0;
  const pets = petCount?.length ?? 0;
  const firstName = profile?.full_name?.split(" ")[0];
  const lastProject = inProgressProjects?.[0] ?? null;

  // Fake progress for last project — in a real app this would come from step_progress
  const lastProjectProgress = 78;

  return (
    <div className="space-y-7">

      {/* ── Welcome header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            Ready to build something new? 🛠️
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            DIY Vision™ is ready to analyze your next project.
          </p>
        </div>
        <LinkButton href="/dashboard/new" size="md">
          <Sparkles className="h-4 w-4" />
          New DIY Plan
        </LinkButton>
      </div>

      {/* ── Stats strip ── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* This Month Saved */}
        <div className="rounded-[18px] bg-gradient-to-br from-ds-emerald-500 to-ds-emerald-700 p-5 text-white shadow-[0_4px_16px_rgba(16,185,129,0.25)]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/60">Lifetime Savings</p>
          <p className="mt-2 text-3xl font-extrabold leading-none">{moneySaved}</p>
          <p className="mt-1 text-[10px] text-white/50">vs. buying retail</p>
        </div>

        {/* Projects */}
        <div className="rounded-[18px] border border-slate-100 bg-white p-5 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Projects Created</p>
          <p className="mt-2 text-3xl font-extrabold leading-none text-slate-900">{totalProjects}</p>
          <p className="mt-1 text-[10px] text-slate-400">DIY plans built</p>
        </div>

        {/* Pets */}
        <div className="rounded-[18px] border border-slate-100 bg-white p-5 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Pets</p>
          <p className="mt-2 text-3xl font-extrabold leading-none text-slate-900">{pets > 0 ? pets : "—"}</p>
          <p className="mt-1 text-[10px] text-slate-400">
            {pets > 0 ? "profiles added" : <Link href="/dashboard/pets" className="text-brand-blue-500 hover:underline">Add a pet</Link>}
          </p>
        </div>

        {/* DIY Vision success rate */}
        <div className="rounded-[18px] border border-slate-100 bg-white p-5 shadow-soft">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">DIY Vision™</p>
          <p className="mt-2 text-3xl font-extrabold leading-none text-slate-900">98%</p>
          <p className="mt-1 text-[10px] text-slate-400">analysis success rate</p>
        </div>
      </div>

      {/* ── Continue last project ── */}
      {lastProject ? (
        <div className="rounded-[20px] border-2 border-brand-blue-100 bg-brand-blue-50 p-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand-blue-500 mb-1">Continue Your Last Project</p>
              <p className="text-base font-extrabold text-slate-900 truncate">{lastProject.title}</p>
              {/* Progress bar */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-2 overflow-hidden rounded-full bg-brand-blue-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-blue-400 to-brand-blue-600 transition-all"
                    style={{ width: `${lastProjectProgress}%` }}
                  />
                </div>
                <span className="text-xs font-bold text-brand-blue-600 shrink-0">{lastProjectProgress}% complete</span>
              </div>
            </div>
            <Link
              href={`/dashboard/projects/${lastProject.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-brand-blue-700 transition-colors shrink-0"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="rounded-[20px] border-2 border-dashed border-slate-200 bg-white p-5 text-center">
          <p className="text-sm text-slate-400">No projects in progress — start one below 👇</p>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div>
        <h2 className="mb-3 text-xs font-bold uppercase tracking-widest text-slate-400">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex flex-col gap-3 rounded-[16px] border p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft ${action.color} ${action.hoverColor}`}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/60">
                <action.icon className="h-4.5 w-4.5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{action.label}</p>
                <p className="mt-0.5 text-[11px] text-slate-500 leading-snug">{action.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Main content grid ── */}
      <div className="grid gap-6 lg:grid-cols-3">

        {/* Recent projects */}
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400">Recent Projects</h2>
            <Link href="/dashboard/projects" className="flex items-center gap-1 text-xs font-semibold text-brand-blue-600 hover:underline">
              View all <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-3">
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
        <div className="flex flex-col gap-5">

          {/* DIY Vision Recommends */}
          <Card className="overflow-hidden p-0">
            <div className="bg-gradient-to-br from-brand-blue-600 via-brand-blue-700 to-ds-emerald-700 px-5 pt-5 pb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/20">
                  <Eye className="h-4 w-4 text-white" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/80">DIY Vision™ Recommends</span>
              </div>
              <p className="text-sm font-semibold text-white leading-relaxed">
                You already own enough fleece and webbing to build these 3 projects.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {["Dog Harness", "Leash Set", "Collar"].map((tag) => (
                  <span key={tag} className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4">
              <Link
                href="/dashboard/projects"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-brand-blue-200 bg-brand-blue-50 px-4 py-2.5 text-sm font-bold text-brand-blue-700 hover:bg-brand-blue-100 transition-colors"
              >
                <Sparkles className="h-4 w-4" />
                See recommended projects
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

          {/* Plan badge for paid users */}
          {hasUnlimited && (
            <div className="rounded-[16px] border border-ds-amber-200 bg-ds-amber-50 p-4 flex items-center gap-3">
              <Crown className="h-5 w-5 text-ds-amber-500 shrink-0" />
              <div>
                <p className="text-sm font-bold text-slate-800">{planLabel} — Active</p>
                <p className="text-[11px] text-slate-500">Unlimited projects & analysis</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
