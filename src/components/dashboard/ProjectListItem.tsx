import Link from "next/link";
import { Clock, DollarSign, Heart } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { Project } from "@/types/database";

function formatCents(cents: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(0)}`;
}

function formatMinutes(minutes: number | null) {
  if (minutes == null) return "—";
  if (minutes < 60) return `${minutes}m`;
  return `${Math.round(minutes / 60)}h`;
}

export function ProjectListItem({ project }: { project: Pick<Project, "id" | "title" | "status" | "difficulty" | "estimated_cost_cents" | "estimated_time_minutes" | "is_favorite" | "build_type">}) {
  return (
    <Link
      href={`/dashboard/projects/${project.id}`}
      className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-4 transition-all hover:-translate-y-0.5 hover:shadow-soft"
    >
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand-blue-50 text-lg">
        🛠️
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{project.title}</p>
        <div className="mt-1 flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {formatMinutes(project.estimated_time_minutes)}
          </span>
          <span className="flex items-center gap-1">
            <DollarSign className="h-3.5 w-3.5" />
            {formatCents(project.estimated_cost_cents)}
          </span>
        </div>
      </div>

      {project.is_favorite && <Heart className="h-4 w-4 shrink-0 fill-brand-orange-500 text-brand-orange-500" />}

      <Badge color={project.status === "complete" ? "teal" : project.status === "processing" ? "blue" : "slate"}>
        {project.status}
      </Badge>
    </Link>
  );
}
