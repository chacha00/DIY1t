import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/Container";
import { MarketplaceCard, type MarketplaceProjectCard } from "@/components/community/MarketplaceCard";
import { MarketplaceFilters } from "@/components/community/MarketplaceFilters";
import { createClient } from "@/lib/supabase/server";
import type { Category } from "@/types/database";

interface RawPublicProject {
  id: string;
  title: string;
  difficulty: string;
  estimated_cost_cents: number | null;
  estimated_time_minutes: number | null;
  created_at: string;
  user_id: string;
  categories: { name: string; emoji: string | null; slug: string } | null;
}

export default async function CommunityPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; difficulty?: string; sort?: string }>;
}) {
  const { category, difficulty, sort } = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("slug, name")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .returns<Pick<Category, "slug" | "name">[]>();

  let query = supabase
    .from("projects")
    .select(
      "id, title, difficulty, estimated_cost_cents, estimated_time_minutes, created_at, user_id, categories(name, emoji, slug)"
    )
    .eq("is_public", true);

  if (difficulty) query = query.eq("difficulty", difficulty);
  if (category) query = query.eq("categories.slug", category);

  query = query.order("created_at", { ascending: false }).limit(60);

  const { data: rawProjects } = await query.returns<RawPublicProject[]>();

  const filteredProjects = (rawProjects ?? []).filter((p) => !category || p.categories?.slug === category);
  const projectIds = filteredProjects.map((p) => p.id);

  const likeCounts = new Map<string, number>();
  if (projectIds.length > 0) {
    const { data: likes } = await supabase
      .from("project_likes")
      .select("project_id")
      .in("project_id", projectIds)
      .returns<{ project_id: string }[]>();

    for (const like of likes ?? []) {
      likeCounts.set(like.project_id, (likeCounts.get(like.project_id) ?? 0) + 1);
    }
  }

  // profiles RLS only allows reading your own row; author display names
  // come from the public_profiles view (full_name/avatar/username only).
  const authorIds = [...new Set(filteredProjects.map((p) => p.user_id))];
  const nameById = new Map<string, string | null>();
  if (authorIds.length > 0) {
    const { data: publicProfiles } = await supabase
      .from("public_profiles")
      .select("id, full_name")
      .in("id", authorIds)
      .returns<{ id: string; full_name: string | null }[]>();
    for (const p of publicProfiles ?? []) nameById.set(p.id, p.full_name);
  }

  let cards: MarketplaceProjectCard[] = filteredProjects.map((p) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    estimated_cost_cents: p.estimated_cost_cents,
    estimated_time_minutes: p.estimated_time_minutes,
    category_name: p.categories?.name ?? null,
    category_emoji: p.categories?.emoji ?? null,
    author_name: nameById.get(p.user_id) || "A maker",
    like_count: likeCounts.get(p.id) ?? 0,
  }));

  if (sort === "popular") {
    cards = cards.sort((a, b) => b.like_count - a.like_count);
  }

  return (
    <>
      <Header />
      <main className="flex-1 py-16 sm:py-24">
        <Container>
          <SectionHeading
            eyebrow="Community"
            title="Builds from the DIY1T community"
            description="Browse real projects shared by other makers. Like, comment, and get inspired."
          />

          <div className="mt-10 flex justify-center">
            <MarketplaceFilters
              categories={categories ?? []}
              selectedCategory={category}
              selectedDifficulty={difficulty}
              selectedSort={sort}
            />
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.length > 0 ? (
              cards.map((project) => <MarketplaceCard key={project.id} project={project} />)
            ) : (
              <p className="col-span-full text-center text-sm text-slate-400">
                No published projects match your filters yet. Be the first to share one!
              </p>
            )}
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
