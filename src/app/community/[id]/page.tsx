import { notFound } from "next/navigation";
import { Clock, DollarSign } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { MaterialsList } from "@/components/projects/MaterialsList";
import { StepsList } from "@/components/projects/StepsList";
import { ToolsAndSafety } from "@/components/projects/ToolsAndSafety";
import { DiyScoreCard } from "@/components/projects/DiyScoreCard";
import { LikeButton } from "@/components/community/LikeButton";
import { Comments, type CommentItem } from "@/components/community/Comments";
import { createClient } from "@/lib/supabase/server";
import type { Project, SavedImage } from "@/types/database";

function formatMinutes(minutes: number | null) {
  if (minutes == null) return "—";
  if (minutes < 60) return `${minutes}m`;
  return `${(minutes / 60).toFixed(1)}h`;
}

function formatCents(cents: number | null) {
  if (cents == null) return "—";
  return `$${(cents / 100).toFixed(0)}`;
}

interface RawComment {
  id: string;
  body: string;
  created_at: string;
  user_id: string;
}

export default async function CommunityProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("is_public", true)
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

  const [{ data: likes }, { data: rawComments }] = await Promise.all([
    supabase.from("project_likes").select("user_id").eq("project_id", project.id).returns<{ user_id: string }[]>(),
    supabase
      .from("project_comments")
      .select("id, body, created_at, user_id")
      .eq("project_id", project.id)
      .order("created_at", { ascending: false })
      .returns<RawComment[]>(),
  ]);

  // profiles RLS only allows reading your own row; author/commenter display
  // names come from the public_profiles view (full_name/avatar/username only).
  const authorIds = [project.user_id, ...(rawComments ?? []).map((c) => c.user_id)];
  const uniqueAuthorIds = [...new Set(authorIds)];
  const { data: publicProfiles } = await supabase
    .from("public_profiles")
    .select("id, full_name")
    .in("id", uniqueAuthorIds)
    .returns<{ id: string; full_name: string | null }[]>();

  const nameById = new Map((publicProfiles ?? []).map((p) => [p.id, p.full_name]));

  const likedByMe = !!user && (likes ?? []).some((l) => l.user_id === user.id);
  const comments: CommentItem[] = (rawComments ?? []).map((c) => ({
    id: c.id,
    body: c.body,
    created_at: c.created_at,
    author_name: nameById.get(c.user_id) || "A maker",
  }));

  return (
    <>
      <Header />
      <main className="flex-1 py-12 sm:py-16">
        <Container className="max-w-5xl space-y-6">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge color="blue">{project.build_type ?? "DIY Project"}</Badge>
              <Badge color="slate">{project.difficulty}</Badge>
            </div>
            <h1 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              {project.title}
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              by {nameById.get(project.user_id) || "A maker"}
            </p>
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

          {previewImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewImageUrl}
              alt={project.title}
              className="aspect-video w-full rounded-3xl object-cover shadow-soft-lg"
            />
          )}

          <LikeButton projectId={project.id} initialLiked={likedByMe} initialCount={likes?.length ?? 0} />

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <MaterialsList materials={project.materials} />
              <StepsList steps={project.steps} />
              <Comments projectId={project.id} comments={comments} isLoggedIn={!!user} />
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
        </Container>
      </main>
      <Footer />
    </>
  );
}
