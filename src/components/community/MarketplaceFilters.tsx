import { Select } from "@/components/ui/Select";
import type { Category } from "@/types/database";

const DIFFICULTIES = ["beginner", "easy", "medium", "advanced", "expert"];

export function MarketplaceFilters({
  categories,
  selectedCategory,
  selectedDifficulty,
  selectedSort,
}: {
  categories: Pick<Category, "slug" | "name">[];
  selectedCategory?: string;
  selectedDifficulty?: string;
  selectedSort?: string;
}) {
  return (
    <form className="flex flex-wrap items-center gap-3" method="get">
      <Select name="category" defaultValue={selectedCategory ?? ""} className="w-auto">
        <option value="">All Categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </Select>

      <Select name="difficulty" defaultValue={selectedDifficulty ?? ""} className="w-auto">
        <option value="">All Difficulties</option>
        {DIFFICULTIES.map((d) => (
          <option key={d} value={d}>
            {d[0].toUpperCase() + d.slice(1)}
          </option>
        ))}
      </Select>

      <Select name="sort" defaultValue={selectedSort ?? "newest"} className="w-auto">
        <option value="newest">Newest</option>
        <option value="popular">Most Popular</option>
      </Select>

      <button
        type="submit"
        className="rounded-full bg-brand-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-blue-700"
      >
        Apply
      </button>
    </form>
  );
}
