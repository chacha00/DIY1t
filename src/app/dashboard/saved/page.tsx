import Link from "next/link";
import Image from "next/image";
import { Heart, ExternalLink, FolderKanban } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { SaveButton } from "@/components/projects/SaveButton";

function formatCents(cents: number | null) {
  if (!cents) return null;
  return `$${(cents / 100).toFixed(0)}`;
}

export default async function SavedPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: savedRows } = await (supabase as any)
    .from("saved_projects")
    .select(`
      project_id,
      created_at,
      project:projects (
        id, title, build_type, difficulty, status,
        estimated_cost_cents, money_saved_cents, tags,
        source_image:source_image_id(url),
        preview_image:preview_image_id(url)
      )
    `)
    .eq("user_id", user!.id)
    .order("created_at", { ascending: false });

  const projects = (savedRows ?? [])
    .map((r: any) => r.project)
    .filter(Boolean);

  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Heart className="h-12 w-12 text-slate-300" />
        <h2 className="mt-4 text-lg font-bold text-slate-700">No saved projects yet</h2>
        <p className="mt-2 text-sm text-slate-400">
          Tap the heart on any project to save it here for quick access.
        </p>
        <Link
          href="/community"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-blue-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-blue-600 transition-colors"
        >
          Browse community projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Saved Projects</h1>
        <p className="mt-1 text-sm text-slate-500">{projects.length} saved</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: any) => {
          const thumb = project.source_image?.url ?? project.preview_image?.url;

          return (
            <Card key={project.id} className="overflow-hidden flex flex-col">
              <div className="relative h-44 bg-slate-100">
                {thumb ? (
                  <Image src={thumb} alt={project.title} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-300">
                    <FolderKanban className="h-10 w-10" />
                  </div>
                )}
                {/* Save/unsave toggle */}
                <div className="absolute top-2 right-2">
                  <SaveButton projectId={project.id} initialSaved={true} />
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
                  {project.difficulty && <Badge color="blue">{project.difficulty}</Badge>}
                  {project.estimated_cost_cents && (
                    <Badge color="teal">{formatCents(project.estimated_cost_cents)} DIY cost</Badge>
                  )}
                  {project.money_saved_cents && (
                    <Badge color="orange">Save {formatCents(project.money_saved_cents)}</Badge>
                  )}
                </div>

                <Link
                  href={`/dashboard/projects/${project.id}`}
                  className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue-600 hover:text-brand-blue-700"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  View pattern &amp; instructions
                </Link>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
