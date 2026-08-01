"use client";

import { useState } from "react";
import { Bell, ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import { signOut } from "@/app/dashboard/actions";

export function Topbar({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const initial = (name || email || "?").charAt(0).toUpperCase();

  return (
    <header className="glass sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-100/80 px-4 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold text-slate-500">
        Welcome back<span className="hidden sm:inline">, {name || "maker"}</span> 👋
      </p>

      <div className="flex items-center gap-3">
        <button
          aria-label="Notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-orange-500" />
        </button>

        <div className="relative">
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full border border-slate-200 py-1.5 pl-1.5 pr-3 hover:bg-slate-50"
          >
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-blue-100 text-xs font-bold text-brand-blue-700">
                {initial}
              </span>
            )}
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-soft-lg">
              <div className="border-b border-slate-100 px-4 py-3">
                <p className="truncate text-sm font-semibold text-slate-900">{name || "Maker"}</p>
                <p className="truncate text-xs text-slate-400">{email}</p>
              </div>
              <a
                href="/dashboard/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <UserIcon className="h-4 w-4" />
                Profile
              </a>
              <a
                href="/dashboard/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                <Settings className="h-4 w-4" />
                Settings
              </a>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
