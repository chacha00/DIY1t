export const BUILD_TYPES = [
  "Pet Outfit",
  "Harness",
  "Dog Bed",
  "Toy",
  "Furniture",
  "Decor",
  "Clothing",
  "Other",
] as const;

export const BUDGET_OPTIONS = [
  { label: "Under $25", value: "under_25" },
  { label: "$25 – $50", value: "25_50" },
  { label: "$50 – $100", value: "50_100" },
  { label: "$100 – $250", value: "100_250" },
  { label: "$250+", value: "250_plus" },
] as const;

export const SKILL_LEVELS = [
  { label: "Beginner", value: "beginner" },
  { label: "Easy", value: "easy" },
  { label: "Medium", value: "medium" },
  { label: "Advanced", value: "advanced" },
  { label: "Expert", value: "expert" },
] as const;

export const TIME_AVAILABLE_OPTIONS = [
  { label: "Under 1 hour", value: "under_1h" },
  { label: "1–3 hours", value: "1_3h" },
  { label: "3–6 hours", value: "3_6h" },
  { label: "A weekend", value: "weekend" },
  { label: "No rush", value: "no_rush" },
] as const;

export const MATERIAL_PREFERENCES = [
  "No preference",
  "Eco-friendly",
  "Fabric & textiles",
  "Wood",
  "Recycled materials",
  "Pet-safe materials",
] as const;
