import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { photo_url } = await req.json();
  if (!photo_url) return NextResponse.json({ error: "Missing photo_url" }, { status: 400 });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are an expert crafting supply identifier. Examine this photo of craft supplies, fabric, or materials.

Identify every distinct material, fabric, or supply you can see. For each item return:
- name: specific material name (e.g. "Fleece fabric", "Nylon webbing 1 inch", "Brass D-rings", "Cotton canvas")
- category: one of "fabric" | "hardware" | "notions" | "tools" | "other"
- color: dominant color if visible
- quantity_estimate: rough estimate ("about 1 yard", "small piece", "several pieces", "one roll", etc.)
- confidence: 0-100 how confident you are this is what it is

Return ONLY valid JSON in this exact shape, no markdown:
{
  "materials": [
    { "name": "...", "category": "...", "color": "...", "quantity_estimate": "...", "confidence": 85 }
  ],
  "summary": "One sentence describing what you see overall"
}

If you cannot identify any craft materials, return { "materials": [], "summary": "No craft materials detected" }.`,
          },
          { type: "image_url", image_url: { url: photo_url, detail: "high" } },
        ],
      },
    ],
  });

  let parsed: { materials: { name: string; category: string; color?: string; quantity_estimate?: string; confidence: number }[]; summary: string };
  try {
    const text = response.choices[0]?.message?.content ?? "{}";
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }

  if (!parsed.materials?.length) {
    return NextResponse.json({ materials: [], summary: parsed.summary ?? "No materials detected" });
  }

  // Save detected materials to inventory
  const rows = parsed.materials.map((m) => ({
    user_id: user.id,
    name: m.name,
    category: m.category ?? "other",
    color: m.color ?? null,
    quantity_estimate: m.quantity_estimate ?? null,
    confidence: m.confidence ?? 70,
    photo_url,
  }));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any).from("craft_inventory").insert(rows);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ materials: parsed.materials, summary: parsed.summary });
}
