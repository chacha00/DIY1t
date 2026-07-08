import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getOpenAI } from "@/lib/openai";
import type { Project, Subscription } from "@/types/database";

export const maxDuration = 60;

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle<Pick<Subscription, "plan" | "status">>();

  if (subscription?.plan !== "annual_unlimited") {
    return NextResponse.json({ error: "Etsy listing helper requires a Maker Pro subscription." }, { status: 403 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<Project>();

  if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });

  const materials = (project.materials ?? []).map(m => m.name).join(", ");
  const steps = (project.steps ?? []).slice(0, 3).map(s => s.title).join("; ");
  const tags_hint = (project.tags ?? []).join(", ");

  const prompt = `You are an expert Etsy seller and SEO copywriter specialising in handmade pet products and crafts.

Generate a complete, optimised Etsy listing for this handmade DIY project:

Title: ${project.title}
Category: ${project.build_type ?? "Handmade pet product"}
Difficulty: ${project.difficulty}
Key materials: ${materials}
Construction highlights: ${steps}
Tags from project: ${tags_hint}
Estimated time to make: ${project.estimated_time_minutes ? Math.round(project.estimated_time_minutes / 60 * 10) / 10 + " hours" : "unknown"}

Respond with ONLY a raw JSON object — no markdown, no code fences:

{
  "title": "140-char max Etsy title — include 4-6 high-volume search terms, include size range if applicable, handmade/custom descriptor, avoid ALL CAPS",
  "description": "300-500 word Etsy description. First 160 chars appear in search — make them count. Use short paragraphs. Include: what it is, key features (3-4 bullet lines with ✦), materials, sizing info, care instructions, made-to-order note, shipping estimate. End with a warm call to action.",
  "tags": ["array of exactly 13 tags", "each under 20 chars", "no duplicates", "mix broad and specific", "include material, animal, size, use-case terms"],
  "category_path": "Etsy category path e.g. Pet Supplies > Dogs > Collars, Leashes and Harnesses",
  "seo_keywords": ["5 highest-volume keyword phrases a buyer would search"],
  "photo_tips": ["4-5 specific photo tips for this exact product to maximise Etsy conversion — e.g. which angles, what props, what lifestyle shots"]
}`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    max_tokens: 1500,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) return NextResponse.json({ error: "AI returned no content" }, { status: 502 });

  let listing;
  try {
    listing = JSON.parse(content);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 502 });
  }

  return NextResponse.json(listing);
}
