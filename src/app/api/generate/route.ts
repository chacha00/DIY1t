import { NextResponse } from "next/server";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { generateDiyProject, generatePreviewImage } from "@/lib/openai";
import { uploadImageBuffer } from "@/lib/cloudinary";
import { BUDGET_OPTIONS, SKILL_LEVELS, TIME_AVAILABLE_OPTIONS } from "@/lib/constants/project-options";
import type { Profile, Project, Pet, Subscription, SavedImage, CreditTransaction } from "@/types/database";

function labelFor(options: readonly { label: string; value: string }[], value: string) {
  return options.find((o) => o.value === value)?.label ?? value;
}

/**
 * Chaining several differently-typed `.single<T>()` calls on the same Supabase
 * client in one function defeats TypeScript's overload resolution for later
 * `.insert()` calls (resolves to `never[]`). Routing inserts through an
 * untyped client view sidesteps it; the payload itself is still typed via
 * `Partial<Row>` at each call site.
 */
function insertRow(supabase: SupabaseClient, table: string, payload: Record<string, unknown>) {
  return supabase.from(table).insert(payload);
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { imageId, imageUrl, buildType, budget, skillLevel, preferredMaterials, timeAvailable, petId } = body as {
    imageId: string;
    imageUrl: string;
    buildType: string;
    budget: string;
    skillLevel: string;
    preferredMaterials: string;
    timeAvailable: string;
    petId?: string;
  };

  if (!imageId || !imageUrl || !buildType) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // --- Credit / subscription gate ---
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits_balance")
    .eq("id", user.id)
    .single<Pick<Profile, "credits_balance">>();

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan, status")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle<Pick<Subscription, "plan" | "status">>();

  const hasUnlimitedPlan =
    subscription?.plan === "monthly_unlimited" || subscription?.plan === "annual_unlimited";

  if (!hasUnlimitedPlan && (profile?.credits_balance ?? 0) <= 0) {
    return NextResponse.json(
      { error: "No credits remaining. Upgrade or purchase credits to continue." },
      { status: 402 }
    );
  }

  // --- Pet context (optional) ---
  let petContext: string | undefined;
  if (petId) {
    const { data: pet } = await supabase
      .from("pets")
      .select("name, species, breed, weight_lbs, neck_measurement_in, chest_measurement_in")
      .eq("id", petId)
      .eq("user_id", user.id)
      .maybeSingle<
        Pick<Pet, "name" | "species" | "breed" | "weight_lbs" | "neck_measurement_in" | "chest_measurement_in">
      >();

    if (pet) {
      petContext = `${pet.name}, a ${pet.breed ?? pet.species}, weight ${pet.weight_lbs ?? "unknown"} lbs, neck ${pet.neck_measurement_in ?? "unknown"}in, chest ${pet.chest_measurement_in ?? "unknown"}in.`;
    }
  }

  // --- AI generation ---
  let generated;
  try {
    generated = await generateDiyProject({
      imageUrl,
      buildType,
      budgetLabel: labelFor(BUDGET_OPTIONS, budget),
      skillLevel: labelFor(SKILL_LEVELS, skillLevel),
      preferredMaterials: preferredMaterials || "No preference",
      timeAvailableLabel: labelFor(TIME_AVAILABLE_OPTIONS, timeAvailable),
      petContext,
    });
  } catch (err) {
    console.error("AI generation failed", err);
    return NextResponse.json({ error: "AI generation failed. Please try again." }, { status: 502 });
  }

  // --- Optional AI preview image (best-effort; failures don't block the project) ---
  let previewImageId: string | null = null;
  try {
    const previewB64 = await generatePreviewImage(generated.title);
    const uploaded = await uploadImageBuffer(Buffer.from(previewB64, "base64"), {
      folder: `diy1t/previews/${user.id}`,
      publicIdPrefix: "preview",
    });
    const previewImagePayload: Partial<SavedImage> = {
      user_id: user.id,
      cloudinary_public_id: uploaded.publicId,
      url: uploaded.url,
      kind: "ai_preview",
      width: uploaded.width,
      height: uploaded.height,
    };
    const { data: savedPreview } = await insertRow(supabase, "saved_images", previewImagePayload)
      .select("id")
      .single<{ id: string }>();
    previewImageId = savedPreview?.id ?? null;
  } catch (err) {
    console.error("Preview image generation failed (non-fatal)", err);
  }

  // --- Persist the project ---
  const projectPayload: Partial<Project> = {
    user_id: user.id,
    pet_id: petId || null,
    title: generated.title,
    build_type: buildType,
    status: "complete",
    difficulty: generated.difficulty,
    source_image_id: imageId,
    preview_image_id: previewImageId,
    budget_cents: null,
    skill_level: skillLevel,
    preferred_materials: preferredMaterials,
    time_available: timeAvailable,
    estimated_cost_cents: generated.estimated_cost_cents,
    estimated_time_minutes: generated.estimated_time_minutes,
    retail_price_cents: generated.retail_price_cents,
    money_saved_cents: generated.money_saved_cents,
    materials: generated.materials,
    tools: generated.tools,
    steps: generated.steps,
    safety_warnings: generated.safety_warnings,
    diy_score: generated.diy_score,
    tags: generated.tags,
    ai_model: "gpt-4o",
  };

  const { data: project, error: projectError } = await insertRow(supabase, "projects", projectPayload)
    .select("id")
    .single<Pick<Project, "id">>();

  if (projectError || !project) {
    console.error("Failed to save project", projectError);
    return NextResponse.json({ error: "Failed to save project" }, { status: 500 });
  }

  // --- Deduct credit + update rollups (skip credit deduction for unlimited plans) ---
  if (!hasUnlimitedPlan) {
    const creditPayload: Partial<CreditTransaction> = {
      user_id: user.id,
      amount: -1,
      reason: "project_generation",
      related_project_id: project.id,
    };
    await insertRow(supabase, "credit_transactions", creditPayload);
  }

  await (supabase as unknown as SupabaseClient).rpc("increment_profile_stats", {
    p_user_id: user.id,
    p_money_saved_cents: generated.money_saved_cents,
  });

  return NextResponse.json({ projectId: project.id });
}
