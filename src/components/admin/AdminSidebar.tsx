"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Receipt,
  FolderTree,
  Hammer,
  ArrowLeftCircle,
} from "lucide-react";
import { cn } from "@/lib/cn";

const NAV_ITEMS = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: Receipt },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-100 bg-white px-4 py-6 lg:flex">
      <Link href="/admin" className="flex items-center gap-2.5 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 shadow-soft">
          <Hammer className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
        </span>
        <div>
          <span className="block text-lg font-extrabold tracking-tight text-slate-900">
            DIY1T
          </span>
          <span className="block text-xs font-semibold uppercase tracking-widest text-slate-400">
            Admin
          </span>
        </div>
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
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/dashboard"
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
      >
        <ArrowLeftCircle className="h-4.5 w-4.5" />
        Back to App
      </Link>
    </aside>
  );
}
