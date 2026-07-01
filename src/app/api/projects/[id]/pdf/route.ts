import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { createClient } from "@/lib/supabase/server";
import { uploadRawBuffer, getSignedDownloadUrl } from "@/lib/cloudinary";
import { ProjectPdfDocument } from "@/lib/pdf/ProjectPdfDocument";
import type { Project, GeneratedPdf, SavedImage } from "@/types/database";

type PdfKind = "instructions" | "shopping_list";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const kind = (searchParams.get("kind") as PdfKind) || "instructions";

  if (kind !== "instructions" && kind !== "shopping_list") {
    return NextResponse.json({ error: "Invalid kind" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .or(`user_id.eq.${user.id},is_public.eq.true`)
    .maybeSingle<Project>();

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  // Fetch preview image URL if available
  let previewImageUrl: string | null = null;
  if (project.preview_image_id) {
    const { data: previewImg } = await supabase
      .from("saved_images")
      .select("url")
      .eq("id", project.preview_image_id)
      .maybeSingle<Pick<SavedImage, "url">>();
    previewImageUrl = previewImg?.url ?? null;
  }

  // Untyped view: chaining differently-shaped Supabase calls in one function
  // defeats TS overload resolution for .insert() (see other API routes for the same pattern).
  const db = supabase as unknown as SupabaseClient;

  // Only use cached PDF if the project has no preview image (once an image is added
  // the cached PDF is deleted by generate-preview so we regenerate with the image included).
  if (!previewImageUrl) {
    const { data: existing } = await db
      .from("generated_pdfs")
      .select("cloudinary_public_id")
      .eq("project_id", project.id)
      .eq("kind", kind)
      .maybeSingle<Pick<GeneratedPdf, "cloudinary_public_id">>();

    if (existing?.cloudinary_public_id) {
      return NextResponse.redirect(getSignedDownloadUrl(existing.cloudinary_public_id, "pdf"));
    }
  }

  const pdfBuffer = await renderToBuffer(
    createElement(ProjectPdfDocument, { project, kind, previewImageUrl }) as Parameters<typeof renderToBuffer>[0]
  );

  const uploaded = await uploadRawBuffer(Buffer.from(pdfBuffer), {
    folder: `diy1t/pdfs/${user.id}`,
    publicIdPrefix: `${project.id}-${kind}`,
    format: "pdf",
  });

  await db.from("generated_pdfs").insert({
    project_id: project.id,
    user_id: user.id,
    url: uploaded.url,
    cloudinary_public_id: uploaded.publicId,
    kind,
  });

  return NextResponse.redirect(getSignedDownloadUrl(uploaded.publicId, "pdf"));
}
