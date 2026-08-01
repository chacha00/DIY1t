"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, Heart, PawPrint, CreditCard,
  Settings, Hammer, Sparkles, Layers, TrendingUp, NotebookPen,
  Package, ScanEye, Plus, Crown, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/cn";

type NavItem = { label: string; href: string; icon: React.ElementType; proOnly?: boolean; plusOnly?: boolean };

const NAV_GROUPS: { heading: string; items: NavItem[] }[] = [
  {
    heading: "Create",
    items: [
      { label: "New Project",     href: "/dashboard/new",     icon: Plus },
      { label: "DIY Vision™",     href: "/dashboard/vision",  icon: ScanEye },
      { label: "Batch Generate",  href: "/dashboard/batch",   icon: Layers, proOnly: true },
    ],
  },
  {
    heading: "Organize",
    items: [
      { label: "Projects",        href: "/dashboard/projects",  icon: FolderKanban },
      { label: "Maker's Planner", href: "/dashboard/planner",   icon: NotebookPen, plusOnly: true },
      { label: "My Materials",    href: "/dashboard/materials",  icon: Package },
      { label: "Saved",           href: "/dashboard/saved",     icon: Heart },
      { label: "Pet Profiles",    href: "/dashboard/pets",      icon: PawPrint },
    ],
  },
  {
    heading: "Earn",
    items: [
      { label: "Affiliate",       href: "/dashboard/affiliate", icon: TrendingUp, proOnly: true },
    ],
  },
  {
    heading: "Account",
    items: [
      { label: "Billing",         href: "/dashboard/billing",   icon: CreditCard },
      { label: "Settings",        href: "/dashboard/settings",  icon: Settings },
    ],
  },
];

type SidebarProps = {
  plan: string;
  creditsLeft: number;
  usedThisMonth: number;
  monthlyLimit: number;
  totalProjects: number;
};

export function Sidebar({ plan, creditsLeft, usedThisMonth, monthlyLimit, totalProjects }: SidebarProps) {
  const pathname = usePathname();
  const isFree = plan === "free";
  const isPlus = plan === "monthly_unlimited";
  const isPro  = plan === "annual_unlimited";
  const hasUnlimited = isPlus || isPro;

  // Used credits = limit minus what's left, floored at 0
  const used = Math.max(0, monthlyLimit - creditsLeft);
  const usagePct = Math.min(100, Math.round((used / monthlyLimit) * 100));
  const usageNearLimit = used >= monthlyLimit - 1;

  // Personalised upgrade headline
  let upgradeHeadline = "Go unlimited";
  let upgradeBody = "Upgrade to keep generating custom DIY plans and save every project forever.";

  if (totalProjects >= 17) {
    upgradeHeadline = `You've created ${totalProjects} projects!`;
    upgradeBody = "Upgrade to keep generating unlimited custom plans, save every project, and unlock Maker's Planner.";
  } else if (used >= monthlyLimit) {
    upgradeHeadline = "You've hit your limit";
    upgradeBody = "Upgrade to keep building — unlimited plans, saved forever, with Maker's Planner included.";
  } else if (used > 0) {
    upgradeHeadline = `${used} of ${monthlyLimit} projects used this month`;
    upgradeBody = "Upgrade before you run out — unlimited plans, every project saved forever, Maker's Planner included.";
  }

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-100 bg-white lg:flex" style={{ height: "100dvh", position: "sticky", top: 0, overflowY: "auto" }}>
      <div className="flex flex-col h-full px-4 py-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 px-2 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient-bg shadow-soft">
            <Hammer className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
          </span>
          <span className="text-lg font-extrabold tracking-tight text-slate-900">
            DIY1T<span className="text-brand-orange-500">.</span>
          </span>
        </Link>

        {/* Dashboard home link */}
        <Link
          href="/dashboard"
          className={cn(
            "mt-5 flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors shrink-0",
            pathname === "/dashboard"
              ? "bg-brand-blue-50 text-brand-blue-700"
              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
          )}
        >
          <LayoutDashboard className="h-4.5 w-4.5" />
          Dashboard
        </Link>

        {/* Nav groups */}
        <nav className="mt-4 flex flex-1 flex-col gap-5 min-h-0">
          {NAV_GROUPS.map((group) => (
            <div key={group.heading}>
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {group.heading}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = pathname === item.href || pathname.startsWith(item.href + "/");
                  const locked = (item.proOnly && !isPro) || (item.plusOnly && isFree);
                  return (
                    <Link
                      key={item.href}
                      href={locked ? "/pricing" : item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                        active
                          ? "bg-brand-blue-50 text-brand-blue-700"
                          : locked
                          ? "text-slate-400 hover:bg-slate-50"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <item.icon className="h-4.5 w-4.5 shrink-0" />
                      <span className="truncate">{item.label}</span>
                      {item.proOnly && !isPro && (
                        <span className="ml-auto shrink-0 rounded-md bg-brand-orange-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-orange-600">Pro</span>
                      )}
                      {item.plusOnly && isFree && (
                        <span className="ml-auto shrink-0 rounded-md bg-brand-blue-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand-blue-600">DIY+</span>
                      )}
                      {item.label === "New Project" && (
                        <span className="ml-auto">
                          <Sparkles className="h-3.5 w-3.5 text-brand-blue-400" />
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom: usage + upgrade */}
        <div className="mt-4 shrink-0">
          {isFree ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              {/* Usage bar */}
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[11px] font-bold text-slate-700">
                  {used} of {monthlyLimit} projects used
                </p>
                <span className={cn(
                  "text-[10px] font-bold",
                  usageNearLimit ? "text-red-500" : "text-slate-400"
                )}>
                  {monthlyLimit - used} left
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    usageNearLimit ? "bg-red-400" : "bg-brand-blue-500"
                  )}
                  style={{ width: `${usagePct}%` }}
                />
              </div>

              {/* Personalised upgrade nudge */}
              <p className="mt-3 text-xs font-bold text-slate-800">{upgradeHeadline}</p>
              <p className="mt-1 text-[11px] text-slate-500 leading-relaxed">{upgradeBody}</p>
              <Link
                href="/pricing"
                className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-brand-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-brand-blue-700 transition-colors"
              >
                <Crown className="h-3.5 w-3.5" />
                Upgrade to DIY+
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          ) : (
            <div className="rounded-2xl border border-ds-amber-200 bg-ds-amber-50 px-4 py-3 flex items-center gap-2.5">
              <Crown className="h-4 w-4 text-ds-amber-500 shrink-0" />
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-800 truncate">
                  {isPro ? "Maker Pro" : "DIY+"} — Active
                </p>
                <p className="text-[11px] text-slate-500">Unlimited projects</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
