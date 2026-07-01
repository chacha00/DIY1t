import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { uploadImageBuffer } from "@/lib/cloudinary";
import type { SavedImage } from "@/types/database";

export const maxDuration = 60;

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  if (file.size > 15 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 15MB)" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let uploaded;
  try {
    uploaded = await uploadImageBuffer(buffer, {
      folder: `diy1t/uploads/${user.id}`,
      publicIdPrefix: "source",
    });
  } catch {
    return NextResponse.json({ error: "Image upload failed" }, { status: 502 });
  }

  const uploadPayload: Partial<SavedImage> = {
    user_id: user.id,
    cloudinary_public_id: uploaded.publicId,
    url: uploaded.url,
    kind: "upload",
    width: uploaded.width,
    height: uploaded.height,
  };

  const { data: savedImage, error } = await (supabase as unknown as SupabaseClient)
    .from("saved_images")
    .insert(uploadPayload)
    .select("id, url")
    .single<Pick<SavedImage, "id" | "url">>();

  if (error || !savedImage) {
    return NextResponse.json({ error: "Failed to save image record" }, { status: 500 });
  }

  return NextResponse.json({ imageId: savedImage.id, url: savedImage.url });
}
