import OpenAI from "openai";
import type { DifficultyLevel, PatternPiece, ProjectMeasurement } from "@/types/database";

export type { PatternPiece, ProjectMeasurement as Measurement };

let _openai: OpenAI | null = null;

/** Lazily instantiated so builds/imports don't fail before OPENAI_API_KEY is configured. */
export function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return _openai;
}

export interface GenerationInput {
  imageUrl: string;
  buildType: string;
  budgetLabel: string;
  skillLevel: string;
  preferredMaterials: string;
  timeAvailableLabel: string;
  petContext?: string;
}

export interface GeneratedProject {
  title: string;
  difficulty: DifficultyLevel;
  estimated_cost_cents: number;
  estimated_time_minutes: number;
  retail_price_cents: number;
  money_saved_cents: number;
  materials: {
    name: string;
    quantity: string;
    unit?: string;
    cost_cents: number;
    alt_options?: { label: string; cost_cents: number }[];
  }[];
  tools: { name: string; required: boolean }[];
  steps: { order: number; title: string; description: string }[];
  safety_warnings: string[];
  pattern_pieces: PatternPiece[];
  measurements: ProjectMeasurement[];
  diy_score: {
    difficulty: number;
    estimated_time_minutes: number;
    estimated_cost_cents: number;
    safety_rating: number;
    skill_level_required: DifficultyLevel;
    tool_complexity: number;
    overall_score: number;
    success_probability_beginner: number;
  };
  tags: string[];
}

const RESPONSE_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "title",
    "difficulty",
    "estimated_cost_cents",
    "estimated_time_minutes",
    "retail_price_cents",
    "money_saved_cents",
    "materials",
    "tools",
    "steps",
    "safety_warnings",
    "diy_score",
    "tags",
  ],
  properties: {
    title: { type: "string" },
    difficulty: { type: "string", enum: ["beginner", "easy", "medium", "advanced", "expert"] },
    estimated_cost_cents: { type: "integer" },
    estimated_time_minutes: { type: "integer" },
    retail_price_cents: { type: "integer" },
    money_saved_cents: { type: "integer" },
    materials: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "quantity", "cost_cents"],
        properties: {
          name: { type: "string" },
          quantity: { type: "string" },
          unit: { type: "string" },
          cost_cents: { type: "integer" },
          alt_options: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              required: ["label", "cost_cents"],
              properties: { label: { type: "string" }, cost_cents: { type: "integer" } },
            },
          },
        },
      },
    },
    tools: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "required"],
        properties: { name: { type: "string" }, required: { type: "boolean" } },
      },
    },
    steps: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["order", "title", "description"],
        properties: {
          order: { type: "integer" },
          title: { type: "string" },
          description: { type: "string" },
        },
      },
    },
    safety_warnings: { type: "array", items: { type: "string" } },
    pattern_pieces: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["name", "width_in", "height_in", "quantity"],
        properties: {
          name: { type: "string" },
          width_in: { type: "number" },
          height_in: { type: "number" },
          quantity: { type: "integer" },
          notes: { type: "string" },
          shape: { type: "string", enum: ["rectangle", "square", "circle", "triangle", "custom"] },
        },
      },
    },
    measurements: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "value"],
        properties: {
          label: { type: "string" },
          value: { type: "string" },
        },
      },
    },
    diy_score: {
      type: "object",
      additionalProperties: false,
      required: [
        "difficulty",
        "estimated_time_minutes",
        "estimated_cost_cents",
        "safety_rating",
        "skill_level_required",
        "tool_complexity",
        "overall_score",
        "success_probability_beginner",
      ],
      properties: {
        difficulty: { type: "integer" },
        estimated_time_minutes: { type: "integer" },
        estimated_cost_cents: { type: "integer" },
        safety_rating: { type: "integer" },
        skill_level_required: { type: "string", enum: ["beginner", "easy", "medium", "advanced", "expert"] },
        tool_complexity: { type: "integer" },
        overall_score: { type: "integer" },
        success_probability_beginner: { type: "number" },
      },
    },
    tags: { type: "array", items: { type: "string" } },
  },
} as const;

const SYSTEM_PROMPT = `You are DIY1T's master pattern maker and craft designer. When a user uploads a photo of an item, your job is to study it CAREFULLY and produce a high-quality, specific DIY guide that would let someone build THAT exact item — not a generic version of it.

STEP 1 — ANALYZE THE IMAGE IN DETAIL before writing anything:
- Identify the exact item: what is it, what is it used for, what size does it appear to be?
- Study the construction: how many pieces? How are they joined (stitched, glued, nailed, screwed, riveted, knotted, woven)?
- Note every visible material: fabric type, texture, hardware, closures, embellishments, lining, interfacing
- Estimate real proportions and dimensions from what you can see (reference known objects if visible)
- Spot every specific detail: pocket placement, strap attachment points, D-ring positions, edge finishing, topstitching

STEP 2 — GENERATE A CLOSELY MATCHED GUIDE:
title: Give the actual specific item name, not a generic one. "Adjustable Corgi Step-In Harness" not "Dog Harness".

steps: Write 10-20 detailed, specific steps that describe building THIS item. Each step must:
  - Reference the actual construction technique visible in the photo
  - Name the specific pieces being worked with
  - Include exact measurements, seam allowances, stitch types where relevant
  - Describe assembly: which edge attaches to which, which hardware goes where
  - Be detailed enough that someone could follow it without the photo

pattern_pieces: List every piece that needs cutting. For each piece:
  - Name it accurately (e.g. "Chest Plate — Front", not "Piece A")
  - Derive width_in and height_in from the actual proportions in the photo
  - Include seam allowances in dimensions or call them out in notes
  - Note shape type precisely
  - Add critical notes: "interface before cutting", "cut 2 mirrored", "cut on bias"

measurements: List ALL specific measurements needed:
  - Finished dimensions of the completed item
  - Every strap length and width
  - Hardware placement distances
  - Seam allowances (be specific per seam)
  - Overlap amounts, buckle positions, adjustment range
  - If pet sizing is provided, calculate measurements from those dimensions

materials: List specific materials matching what's visible in the photo. If you see waxed canvas, list waxed canvas — not just "fabric". If you see brass D-rings, specify brass D-rings. Include exact quantities.

IMPORTANT RULES:
- Do not reproduce exact branded/trademarked designs — create an original DIY version that closely matches the style and construction
- Tailor everything to the user's budget, skill level, and time
- Be realistic with costs (in US cents) and time (in minutes)
- Costs: estimated_cost_cents = DIY cost; retail_price_cents = retail equivalent; money_saved_cents must not be negative
- Include safety warnings for sharp tools, glue guns, power tools
- Respond ONLY with the structured JSON described by the schema`;

export async function generateDiyProject(input: GenerationInput): Promise<GeneratedProject> {
  // ── Step 1: Deep visual analysis (free-form, no JSON constraint) ──────────
  // Forcing structured JSON output while simultaneously analyzing an image
  // causes the model to shortcut the visual reasoning. We do a free-form
  // analysis pass first so the model can think thoroughly about what it sees.
  const analysisPrompt = `You are a master crafter and pattern maker. Examine this photo with extreme care and provide a detailed construction analysis. Be SPECIFIC — describe exactly what you see, not what a generic version might look like.

Describe in detail:
1. WHAT IT IS: Exact item name, size estimate, intended use
2. MATERIALS: Every material visible — specific fabric/leather/wood type, color, texture, finish, hardware metal type
3. STRUCTURE: How many distinct pieces/panels are there? What are their approximate shapes and proportions?
4. CONSTRUCTION METHOD: How are pieces joined — stitched (what stitch pattern?), riveted, screwed, glued, knotted, woven? Describe what you actually see.
5. HARDWARE & CLOSURES: Every buckle, D-ring, snap, zipper, button — metal type, size estimate, placement
6. DIMENSIONS: Estimate real-world dimensions using any reference objects in the frame. Give inch estimates for every major piece.
7. FINISHING DETAILS: Edge treatment, topstitching lines, lining visible, interfacing, padding, pockets, embellishments
8. ASSEMBLY ORDER: Based on what you see, what order would these pieces logically be assembled?

Be as specific as possible. Use technical craft/sewing/woodworking terminology. If you can't determine something exactly, give your best estimate and say so.`;

  const analysisCall = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: analysisPrompt },
          { type: "image_url", image_url: { url: input.imageUrl, detail: "high" } },
        ],
      },
    ],
    max_tokens: 1500,
  });

  const imageAnalysis = analysisCall.choices[0]?.message?.content ?? "";
  if (!imageAnalysis) throw new Error("Image analysis failed");

  // ── Step 2: Convert analysis into structured build plan ───────────────────
  const buildPrompt = `You are DIY1T's master pattern maker. Using the detailed image analysis below, generate a complete, accurate DIY build plan for this SPECIFIC item.

USER CONTEXT:
- Build type: ${input.buildType}
- Budget: ${input.budgetLabel}
- Skill level: ${input.skillLevel}
- Preferred materials: ${input.preferredMaterials}
- Time available: ${input.timeAvailableLabel}
${input.petContext ? `- Pet measurements: ${input.petContext}` : ""}

DETAILED IMAGE ANALYSIS:
${imageAnalysis}

Using this analysis, produce a JSON build plan. Requirements:
- title: The specific item name from the analysis (e.g. "Step-In Dog Harness with Padded Chest Plate", not "Dog Harness")
- materials: List the exact materials identified in the analysis with accurate quantities and costs
- steps: 12-20 highly specific assembly steps that match the construction method observed. Each step must describe what to actually do with the real materials and pieces — reference specific parts by their names. Include: how pieces attach, stitch types and lengths, hardware installation method, finishing techniques.
- pattern_pieces: Every piece needed to cut, with dimensions derived from the size estimates in the analysis. Include seam allowances in notes. Name each piece descriptively.
- measurements: All critical measurements from the analysis — finished size, every strap dimension, hardware spacing, overlap amounts.
- safety_warnings: Only include genuine hazards relevant to this specific build.
- Never reference any branded products. Create an original DIY version that closely matches what was analyzed.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: buildPrompt },
    ],
    response_format: {
      type: "json_schema",
      json_schema: { name: "diy_project", strict: false, schema: RESPONSE_SCHEMA },
    },
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) throw new Error("OpenAI returned no content");

  return JSON.parse(content) as GeneratedProject;
}

export async function generatePreviewImage(prompt: string): Promise<string> {
  const result = await getOpenAI().images.generate({
    model: "gpt-image-1",
    prompt: `A clean, well-lit product photo of a handmade DIY project: ${prompt}. Realistic, professional, neutral background.`,
    size: "1024x1024",
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("OpenAI returned no preview image");
  return b64;
}
