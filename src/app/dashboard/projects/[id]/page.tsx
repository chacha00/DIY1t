import { notFound } from "next/navigation";
import { Clock, DollarSign } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/Badge";
import { MaterialsList } from "@/components/projects/MaterialsList";
import { StepsList } from "@/components/projects/StepsList";
import { ToolsAndSafety } from "@/components/projects/ToolsAndSafety";
import { DiyScoreCard } from "@/components/projects/DiyScoreCard";
import { ProjectActions } from "@/components/projects/ProjectActions";
import { PublishToggle } from "@/components/projects/PublishToggle";
import { GeneratePreviewButton } from "@/components/projects/GeneratePreviewButton";
import type { Project, SavedImage } from "@/types/database";

function formatCents(cents: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(0)}`;
}

function formatMinutes(minutes: number | null) {
  if (minutes == null) return "—";
  if (minutes < 60) return `${minutes}m`;
  return `${(minutes / 60).toFixed(1)}h`;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .or(`user_id.eq.${user?.id},is_public.eq.true`)
    .maybeSingle<Project>();

  if (!project) notFound();

  let previewImageUrl: string | null = null;
  if (project.preview_image_id) {
    const { data: previewImage } = await supabase
      .from("saved_images")
      .select("url")
      .eq("id", project.preview_image_id)
      .maybeSingle<Pick<SavedImage, "url">>();
    previewImageUrl = previewImage?.url ?? null;
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="blue">{project.build_type ?? "DIY Project"}</Badge>
            <Badge color="slate">{project.difficulty}</Badge>
          </div>
          <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {project.title}
          </h1>
          <div className="mt-2 flex items-center gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {formatMinutes(project.estimated_time_minutes)}
            </span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="h-4 w-4" />
              {formatCents(project.estimated_cost_cents)}
            </span>
          </div>
        </div>
      </div>

      {previewImageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={previewImageUrl}
          alt={project.title}
          className="aspect-video w-full rounded-3xl object-cover shadow-soft-lg"
        />
      ) : project.user_id === user?.id ? (
        <div className="flex items-center gap-4 rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8">
          <div className="text-4xl">🎨</div>
          <div>
            <p className="text-sm font-semibold text-slate-700">No preview image yet</p>
            <p className="mt-0.5 text-xs text-slate-400">Generate an AI image of your finished project — it&apos;ll also appear in the PDF.</p>
          </div>
          <div className="ml-auto">
            <GeneratePreviewButton projectId={project.id} />
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <ProjectActions projectId={project.id} isFavorite={project.is_favorite} />
        {project.user_id === user?.id && (
          <PublishToggle projectId={project.id} isPublic={project.is_public} />
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <MaterialsList materials={project.materials} />
          <StepsList steps={project.steps} />
        </div>

        <div className="space-y-6">
          <DiyScoreCard
            score={project.diy_score}
            retailPriceCents={project.retail_price_cents}
            moneySavedCents={project.money_saved_cents}
          />
          <ToolsAndSafety tools={project.tools} safetyWarnings={project.safety_warnings} />
        </div>
      </div>
    </div>
  );
}
