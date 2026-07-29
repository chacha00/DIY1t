import Link from "next/link";
import Image from "next/image";
import { Plus, FolderKanban, ExternalLink } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MakesUploader } from "@/components/projects/MakesUploader";
import type { Project } from "@/types/database";

function formatCents(cents: number | null) {
  if (!cents) return null;
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select(`
      id, title, build_type, difficulty, status,
      estimated_cost_cents, money_saved_cents,
      created_at, tags,
      source_image:source_image_id(url),
      preview_image:preview_image_id(url)
    `)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false })
    .returns<(Project & {
      source_image: { url: string } | null;
      preview_image: { url: string } | null;
    })[]>();

  // Fetch makes counts for each project
  const projectIds = (projects ?? []).map((p) => p.id);
  const { data: makesRaw } = projectIds.length > 0
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ? await (supabase as any)
        .from("project_makes")
        .select("project_id, id")
        .in("project_id", projectIds)
    : { data: [] };

  const makesByProject = ((makesRaw ?? []) as { project_id: string; id: string }[]).reduce<Record<string, number>>((acc, m) => {
    acc[m.project_id] = (acc[m.project_id] ?? 0) + 1;
    return acc;
  }, {});

  if (!projects || projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <FolderKanban className="h-12 w-12 text-slate-300" />
        <h2 className="mt-4 text-lg font-bold text-slate-700">No projects yet</h2>
        <p className="mt-2 text-sm text-slate-400">Upload a photo to generate your first DIY project.</p>
        <Link
          href="/dashboard/new"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">My Projects</h1>
          <p className="mt-1 text-sm text-slate-500">{projects.length} project{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-blue-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          New Project
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const thumb = project.source_image?.url ?? project.preview_image?.url;
          const makesCount = makesByProject[project.id] ?? 0;

          return (
            <Card key={project.id} className="overflow-hidden flex flex-col">
              {/* Project image */}
              <div className="relative h-44 bg-slate-100">
                {thumb ? (
                  <Image src={thumb} alt={project.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <FolderKanban className="h-10 w-10" />
                  </div>
                )}
                <div className="absolute top-2 right-2">
                  <Badge color={project.status === "complete" ? "teal" : "slate"}>
                    {project.status}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <p className="font-bold text-slate-900 leading-tight line-clamp-2">{project.title}</p>
                  {project.build_type && (
                    <p className="mt-0.5 text-xs text-slate-400">{project.build_type}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {project.difficulty && (
                    <Badge color="blue">{project.difficulty}</Badge>
                  )}
                  {project.estimated_cost_cents && (
                    <Badge color="teal">{formatCents(project.estimated_cost_cents)} DIY cost</Badge>
                  )}
                  {project.money_saved_cents && (
                    <Badge color="orange">Save {formatCents(project.money_saved_cents)}</Badge>
                  )}
                </div>

                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue-600 hover:text-brand-blue-700"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View pattern &amp; instructions
                </Link>

                {/* My Makes section */}
                <div className="mt-auto border-t border-slate-100 pt-3">
                  <MakesUploader
                    projectId={project.id}
                    initialCount={makesCount}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
