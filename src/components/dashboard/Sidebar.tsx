"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Heart,
  PawPrint,
  CreditCard,
  Settings,
  Hammer,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { label: "Saved", href: "/dashboard/saved", icon: Heart },
  { label: "Pet Profiles", href: "/dashboard/pets", icon: PawPrint },
  { label: "Billing", href: "/dashboard/billing", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-100 bg-white px-4 py-6 lg:flex">
      <Link href="/" className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient-bg shadow-soft">
          <Hammer className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </span>
        <span className="text-lg font-extrabold tracking-tight text-slate-900">
          DIY1T<span className="text-brand-orange-500">.</span>
        </span>
      </Link>

      <Link
        href="/dashboard/new"
        className="mt-6 flex items-center justify-center gap-2 rounded-2xl bg-brand-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:bg-brand-blue-700 hover:shadow-soft-lg"
      >
        <Sparkles className="h-4 w-4" />
        New Project
      </Link>

      <nav className="mt-8 flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-blue-50 text-brand-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
