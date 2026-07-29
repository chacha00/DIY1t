import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { uploadImageBuffer } from "@/lib/cloudinary";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_makes")
    .select("id, url, caption, created_at")
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ makes: data });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify user owns this project
  const { data: project } = await supabase
    .from("projects")
    .select("id")
    .eq("id", projectId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  const caption = (formData.get("caption") as string | null) ?? "";

  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  const bytes = await file.arrayBuffer();
  const { publicId, url } = await uploadImageBuffer(Buffer.from(bytes), {
    folder: `diy1t/makes/${user.id}`,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: make, error: insertErr } = await (supabase as any)
    .from("project_makes")
    .insert({ project_id: projectId, user_id: user.id, cloudinary_public_id: publicId, url, caption })
    .select("id, url, caption, created_at")
    .single();

  if (insertErr) return NextResponse.json({ error: insertErr.message }, { status: 500 });
  return NextResponse.json({ make });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const makeId = searchParams.get("makeId");
  if (!makeId) return NextResponse.json({ error: "Missing makeId" }, { status: 400 });

  await supabase
    .from("project_makes")
    .delete()
    .eq("id", makeId)
    .eq("user_id", user.id)
    .eq("project_id", projectId);

  return NextResponse.json({ deleted: true });
}
