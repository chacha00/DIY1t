import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getOpenAI } from "@/lib/openai";
import { uploadImageBuffer } from "@/lib/cloudinary";
import type { Project, SavedImage } from "@/types/database";

export const maxDuration = 60;

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("id, title, build_type, difficulty, user_id")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle<Pick<Project, "id" | "title" | "build_type" | "difficulty" | "user_id">>();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const prompt = `A clean, professional product photo of a handmade DIY ${project.build_type ?? "project"}: "${project.title}". Finished, complete, well-crafted. Neutral white background, soft studio lighting, realistic and detailed. No text or labels.`;

  const imageResponse = await getOpenAI().images.generate({
    model: "gpt-image-1",
    prompt,
    n: 1,
    size: "1024x1024",
  });

  const b64 = imageResponse.data?.[0]?.b64_json;
  if (!b64) {
    return NextResponse.json({ error: "Image generation failed" }, { status: 502 });
  }

  const uploaded = await uploadImageBuffer(Buffer.from(b64, "base64"), {
    folder: `diy1t/previews/${user.id}`,
    publicIdPrefix: `${project.id}-preview`,
  });

  const db = supabase as unknown as SupabaseClient;

  const { data: savedImage } = await db
    .from("saved_images")
    .insert({
      user_id: user.id,
      cloudinary_public_id: uploaded.publicId,
      url: uploaded.url,
      kind: "ai_preview",
      width: uploaded.width,
      height: uploaded.height,
    } as Partial<SavedImage>)
    .select("id")
    .single<{ id: string }>();

  await db
    .from("projects")
    .update({ preview_image_id: savedImage?.id })
    .eq("id", project.id);

  // Delete any cached PDFs so the next download regenerates with the image.
  await db.from("generated_pdfs").delete().eq("project_id", project.id);

  return NextResponse.json({ url: uploaded.url });
}
