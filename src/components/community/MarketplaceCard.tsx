import Link from "next/link";
import { Heart, Clock, DollarSign } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

function formatCents(cents: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(0)}`;
}

function formatMinutes(minutes: number | null) {
  if (minutes == null) return "—";
  if (minutes < 60) return `${minutes}m`;
  return `${(minutes / 60).toFixed(1)}h`;
}

export interface MarketplaceProjectCard {
  id: string;
  title: string;
  difficulty: string;
  estimated_cost_cents: number | null;
  estimated_time_minutes: number | null;
  category_name: string | null;
  category_emoji: string | null;
  author_name: string;
  like_count: number;
}

export function MarketplaceCard({ project }: { project: MarketplaceProjectCard }) {
  return (
    <Link href={`/community/${project.id}`}>
      <Card className="overflow-hidden">
        <div className="flex h-40 items-center justify-center bg-gradient-to-br from-brand-blue-100 to-brand-teal-50 text-5xl">
          {project.category_emoji ?? "🛠️"}
        </div>
        <div className="p-5">
          {project.category_name && <Badge color="blue">{project.category_name}</Badge>}
          <h3 className="mt-3 line-clamp-2 text-base font-bold text-slate-900">{project.title}</h3>
          <p className="mt-1 text-xs text-slate-400">by {project.author_name}</p>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-blue-500" />
              {formatMinutes(project.estimated_time_minutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-brand-teal-500" />
              {formatCents(project.estimated_cost_cents)}
            </span>
            <span className="flex items-center gap-1.5">
              <Heart className="h-3.5 w-3.5 text-brand-orange-500" />
              {project.like_count}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
