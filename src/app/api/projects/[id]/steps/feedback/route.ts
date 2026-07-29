import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { step_order, photo_url, step_title, step_description } = await req.json();
  if (!step_order || !photo_url || !step_title) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const prompt = `You are an expert DIY craft coach reviewing a builder's progress photo.

The builder is working on step ${step_order}: "${step_title}"
Step instructions: ${step_description ?? ""}

Look at their photo and give specific, encouraging feedback in 2-3 sentences.
- Mention what looks good
- Point out any issues with technique, alignment, or materials if visible
- Give one actionable tip to improve or continue

Be specific to what you actually see in the photo. Keep it friendly and practical.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: photo_url, detail: "low" } },
        ],
      },
    ],
  });

  const feedback = response.choices[0]?.message?.content ?? "Looks great! Keep going.";

  // Save photo + feedback to step_progress
  const svc = createServiceRoleClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (svc as any).from("step_progress")
    .upsert(
      {
        user_id: user.id,
        project_id: projectId,
        step_order,
        completed: true,
        photo_url,
        ai_feedback: feedback,
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,project_id,step_order" }
    );

  return NextResponse.json({ feedback });
}
