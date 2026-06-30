"use client";

import { useTransition } from "react";
import { Ban, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toggleUserSuspension } from "@/app/admin/users/actions";
import type { Profile } from "@/types/database";

export function UserRow({
  user,
}: {
  user: Pick<Profile, "id" | "email" | "full_name" | "role" | "credits_balance" | "total_projects" | "is_suspended" | "created_at">;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleUserSuspension(user.id, !user.is_suspended);
    });
  }

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{user.full_name || "—"}</p>
        <p className="text-xs text-slate-400">{user.email}</p>
      </td>
      <td className="px-4 py-3 text-sm text-slate-600">{user.role}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{user.credits_balance}</td>
      <td className="px-4 py-3 text-sm text-slate-600">{user.total_projects}</td>
      <td className="px-4 py-3 text-sm text-slate-400">
        {new Date(user.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        {user.is_suspended ? <Badge color="orange">Suspended</Badge> : <Badge color="teal">Active</Badge>}
      </td>
      <td className="px-4 py-3 text-right">
        <Button
          variant={user.is_suspended ? "outline" : "outline"}
          size="sm"
          onClick={handleToggle}
          disabled={isPending}
        >
          {user.is_suspended ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
          {user.is_suspended ? "Unsuspend" : "Suspend"}
        </Button>
      </td>
    </tr>
  );
}
