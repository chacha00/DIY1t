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

export interface SizeChartRow {
  size_name: string;
  breed_examples: string[];
  chest_in: string;
  neck_in: string;
  back_in: string;
  weight_lbs: string;
  notes: string;
}

export interface GeneratedProject {
  title: string;
  difficulty: DifficultyLevel;
  estimated_cost_cents: number;
  estimated_time_minutes: number;
  retail_price_cents: number;
  money_saved_cents: number;
  assembly_overview: string;
  materials: {
    name: string;
    quantity: string;
    unit?: string;
    cost_cents: number;
    reason?: string;
    alt_options?: { label: string; cost_cents: number }[];
  }[];
  tools: { name: string; required: boolean }[];
  steps: {
    order: number;
    title: string;
    description: string;
    quality_checkpoint?: string;
    common_mistake?: string;
    pro_tip?: string;
    time_minutes?: number;
  }[];
  safety_warnings: string[];
  pattern_pieces: PatternPiece[];
  measurements: ProjectMeasurement[];
  size_chart: SizeChartRow[];
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


export async function generateDiyProject(input: GenerationInput): Promise<GeneratedProject> {
  const prompt = `You are a professional DIY instructor specializing in sewing, knitting, and crochet. Analyze this photo and create a complete DIY build plan matched to the construction method visible in the image.

CONSTRUCTION METHOD RULES — detect from the photo and follow strictly:
- SEWN or NO-SEW item (fabric, webbing, canvas, fleece, leather, felt, foam): produce sewing/no-sew instructions with pattern pieces and cut dimensions.
- KNITTED item (visible knit stitches, stockinette, ribbing, cables): produce full knitting instructions written row by row for each piece — cast on count, stitch pattern per row, increases/decreases, bind off. List yarn weight, needle size, gauge.
- CROCHETED item (visible crochet stitches, chains, granny squares): produce full crochet instructions written round by round or row by row for each piece — starting chain or magic ring, stitch count per row/round, increases/decreases, fasten off. List yarn weight, hook size, gauge.
- NEVER mix methods. Match exactly what is shown in the photo.
${input.petContext ? `Pet measurements: ${input.petContext}.` : ""}

Respond with ONLY a raw JSON object (no markdown, no code blocks) with these exact fields:
{
  "title": "descriptive name of the DIY project",
  "difficulty": "beginner|easy|medium|advanced|expert",
  "assembly_overview": "2-3 sentence overview of how to build this",
  "estimated_cost_cents": 2500,
  "estimated_time_minutes": 120,
  "retail_price_cents": 6500,
  "money_saved_cents": 4000,
  "materials": [{"name":"string","quantity":"string","cost_cents":500,"reason":"why chosen"}],
  "tools": [{"name":"string","required":true}],
  "steps": [{"order":1,"title":"string","description":"string","quality_checkpoint":"string","pro_tip":"string","time_minutes":15}],
  "pattern_pieces": [{"name":"string","width_in":10,"height_in":8,"quantity":1,"shape":"rectangle","seam_allowance_in":0.625,"grain_direction":"straight grain","notes":"string"}],
  "measurements": [{"label":"string","value":"string","category":"fitting|finished|pattern|hardware|seam|adjustment"}],
  "size_chart": [{"size_name":"S","breed_examples":["Beagle"],"chest_in":"14-16","neck_in":"12-14","back_in":"12","weight_lbs":"20-30","notes":""}],
  "safety_warnings": ["string"],
  "diy_score": {"difficulty":3,"estimated_time_minutes":120,"estimated_cost_cents":2500,"safety_rating":8,"skill_level_required":"easy","tool_complexity":3,"overall_score":75,"success_probability_beginner":0.8},
  "tags": ["string"]
}

PRICING RULES — this is a budget DIY app, keep costs realistic and affordable:
- All monetary values must be in CENTS (e.g. $5.99 = 599, $12.00 = 1200)
- Individual materials: typically $1–$20 each (thread $299, fabric per yard $799, buckles $399, webbing $699)
- Total project cost: $5–$40 for simple items, $15–$80 for complex ones
- retail_price_cents: what the finished item sells for in a store (typically 3–5x the DIY cost)
- money_saved_cents = retail_price_cents minus estimated_cost_cents (never negative)
- Do NOT return dollar amounts — return CENTS only

Include 6-10 materials, 8-12 steps, 3-5 pattern pieces, 8-12 measurements, and 5-7 size chart rows.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: input.imageUrl, detail: "low" } },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 4000,
  });

  const choice = completion.choices[0];
  const content = choice?.message?.content;
  if (!content) throw new Error("OpenAI returned no content");
  if (choice?.finish_reason === "length") throw new Error("AI response was cut off — try a simpler image or project type");

  let parsed: GeneratedProject;
  try {
    parsed = JSON.parse(content) as GeneratedProject;
  } catch {
    throw new Error(`Failed to parse AI response as JSON: ${content.slice(0, 300)}`);
  }

  if (!parsed.title || !parsed.steps?.length) {
    throw new Error("AI response missing required fields (title or steps)");
  }

  return parsed;
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
