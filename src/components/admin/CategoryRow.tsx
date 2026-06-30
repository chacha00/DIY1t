"use client";

import { useTransition } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { toggleCategoryActive } from "@/app/admin/categories/actions";
import type { Category } from "@/types/database";

export function CategoryRow({ category }: { category: Category }) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    startTransition(async () => {
      await toggleCategoryActive(category.id, !category.is_active);
    });
  }

  return (
    <tr className="border-b border-slate-100 last:border-0">
      <td className="px-4 py-3 text-lg">{category.emoji}</td>
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-slate-800">{category.name}</p>
        <p className="text-xs text-slate-400">{category.slug}</p>
      </td>
      <td className="px-4 py-3">
        {category.is_active ? <Badge color="teal">Active</Badge> : <Badge color="slate">Hidden</Badge>}
      </td>
      <td className="px-4 py-3 text-right">
        <Button variant="outline" size="sm" onClick={handleToggle} disabled={isPending}>
          {category.is_active ? "Hide" : "Activate"}
        </Button>
      </td>
    </tr>
  );
}
