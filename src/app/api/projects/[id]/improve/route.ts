import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient, createServiceRoleClient } from "@/lib/supabase/server";
import { getOpenAI } from "@/lib/openai";
import type { Profile, Project, Subscription, CreditTransaction } from "@/types/database";

export const maxDuration = 60;

const IMPROVEMENT_PROMPTS: Record<string, string> = {
  cheaper: "Generate a cheaper version of this project. Reduce material costs by at least 40% by substituting budget-friendly alternatives. Keep the same overall design but optimize every material choice for cost.",
  beginner: "Generate a beginner-friendly version of this project. Simplify every step, reduce the number of tools required, and use the most forgiving materials possible. Assume the builder has never done this before.",
  eco_friendly: "Generate an eco-friendly version of this project. Use sustainable, recycled, or natural materials. Minimize waste, avoid synthetic materials, and consider the environmental impact of every choice.",
  premium: "Generate a luxury premium version of this project. Use high-end materials, professional-grade hardware, and elevated design details. This should look and feel like a boutique store purchase.",
  durable: "Generate a more durable version of this project. Focus on longevity — use stronger materials, reinforced joints, and techniques that ensure this lasts for years of heavy use.",
  another_version: "Generate a completely different version of this project with an alternative design approach, different materials, or different construction method. Keep the same function but reimagine the form.",
};

const IMPROVEMENT_LABELS: Record<string, string> = {
  cheaper: "Budget Version",
  beginner: "Beginner Version",
  eco_friendly: "Eco-Friendly Version",
  premium: "Premium Version",
  durable: "Extra Durable Version",
  another_version: "Alternative Version",
};

function insertRow(supabase: SupabaseClient, table: string, payload: Record<string, unknown>) {
  return supabase.from(table).insert(payload);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { improvementType } = (await request.json()) as { improvementType: string };

  if (!IMPROVEMENT_PROMPTS[improvementType]) {
    return NextResponse.json({ error: "Invalid improvement type" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: original } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<Project>();

  if (!original) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  // Credit check
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_balance")
    .eq("id", user.id)
    .single<Pick<Profile, "credits_balance">>();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle<Pick<Subscription, "plan">>();

  const hasUnlimited = subscription?.plan === "monthly_unlimited" || subscription?.plan === "annual_unlimited";

  if (!hasUnlimited && (profile?.credits_balance ?? 0) <= 0) {
    return NextResponse.json({ error: "No credits remaining." }, { status: 402 });
  }

  const systemPrompt = `You are DIY1T's project designer. You receive an existing DIY project and generate an improved version of it.
Rules:
- Never copy copyrighted patterns or branded products. All designs must be original.
- Return ONLY valid JSON matching the exact same structure as the input project.
- Keep the same project type and purpose, just improve it as instructed.`;

  const userPrompt = `${IMPROVEMENT_PROMPTS[improvementType]}

Original project to improve:
Title: ${original.title}
Build type: ${original.build_type}
Difficulty: ${original.difficulty}
Estimated cost: $${((original.estimated_cost_cents ?? 0) / 100).toFixed(2)}
Materials: ${JSON.stringify(original.materials)}
Tools: ${JSON.stringify(original.tools)}
Steps: ${JSON.stringify(original.steps)}
Safety warnings: ${JSON.stringify(original.safety_warnings)}

Respond with a JSON object containing: title, difficulty, estimated_cost_cents, estimated_time_minutes, retail_price_cents, money_saved_cents, materials (array of {name,quantity,unit,cost_cents}), tools (array of {name,required}), steps (array of {order,title,description}), safety_warnings (array of strings), diy_score ({overall_score,difficulty,safety_rating,tool_complexity,success_probability_beginner}), tags (array of strings).`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) return NextResponse.json({ error: "Generation failed" }, { status: 502 });

  let generated: Record<string, unknown>;
  try {
    generated = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid response from AI" }, { status: 502 });
  }

  const db = supabase as unknown as SupabaseClient;

  const newProjectPayload = {
    user_id: user.id,
    parent_project_id: original.id,
    category_id: original.category_id,
    pet_id: original.pet_id,
    title: String(generated.title ?? `${IMPROVEMENT_LABELS[improvementType]}: ${original.title}`),
    build_type: original.build_type,
    status: "complete",
    difficulty: generated.difficulty ?? original.difficulty,
    source_image_id: original.source_image_id,
    skill_level: original.skill_level,
    preferred_materials: original.preferred_materials,
    time_available: original.time_available,
    estimated_cost_cents: generated.estimated_cost_cents ?? null,
    estimated_time_minutes: generated.estimated_time_minutes ?? null,
    retail_price_cents: generated.retail_price_cents ?? null,
    money_saved_cents: generated.money_saved_cents ?? null,
    materials: generated.materials ?? [],
    tools: generated.tools ?? [],
    steps: generated.steps ?? [],
    safety_warnings: generated.safety_warnings ?? [],
    diy_score: generated.diy_score ?? {},
    tags: generated.tags ?? [],
    ai_model: "gpt-4o",
  };

  const { data: newProject, error } = await db
    .from("projects")
    .insert(newProjectPayload)
    .select("id")
    .single<{ id: string }>();

  if (error || !newProject) {
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }

  if (!hasUnlimited) {
    const creditPayload: Partial<CreditTransaction> = {
      user_id: user.id,
      amount: -1,
      reason: "project_generation",
      related_project_id: newProject.id,
    };
    const svc = createServiceRoleClient() as unknown as SupabaseClient;
    await svc.from("credit_transactions").insert(creditPayload);
  }

  const svc2 = createServiceRoleClient() as unknown as SupabaseClient;
  await svc2.rpc("increment_profile_stats", {
    p_user_id: user.id,
    p_money_saved_cents: (generated.money_saved_cents as number) ?? 0,
  });

  return NextResponse.json({ projectId: newProject.id });
}
