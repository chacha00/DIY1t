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
    max_tokens: 500,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `You are DIY1T's product analysis AI. A user has photographed a product they want to DIY instead of buying.

Analyze the product in the image and return a JSON object with these exact fields:

{
  "product_name": "specific product name, e.g. 'No-Pull Dog Harness'",
  "product_category": "e.g. 'Pet Gear', 'Home Decor', 'Clothing', 'Organization'",
  "retail_price_low_cents": integer in cents (conservative low estimate),
  "retail_price_high_cents": integer in cents (high estimate),
  "diy_cost_low_cents": integer in cents (materials only, low estimate),
  "diy_cost_high_cents": integer in cents (materials only, high estimate),
  "difficulty": "Beginner" | "Intermediate" | "Advanced",
  "build_time_minutes": integer (estimated build time in minutes),
  "materials_count": integer (number of distinct materials needed),
  "key_materials": ["array", "of", "3-5", "main", "materials"],
  "savings_headline": "one punchy sentence, e.g. 'Save up to $80 and get a custom fit'",
  "can_diy": true | false,
  "cannot_diy_reason": "only if can_diy is false — why it's not practical to DIY"
}

Be realistic about retail prices (check what similar items actually sell for). Be accurate about DIY costs.
Return ONLY valid JSON, no markdown.`,
          },
          { type: "image_url", image_url: { url: photo_url, detail: "high" } },
        ],
      },
    ],
  });

  let result: Record<string, unknown>;
  try {
    const text = response.choices[0]?.message?.content ?? "{}";
    result = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
  }

  return NextResponse.json(result);
}
