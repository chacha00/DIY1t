import OpenAI from "openai";
import type { DifficultyLevel } from "@/types/database";

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

const SYSTEM_PROMPT = `You are DIY1T's project designer. A user uploads a photo of an object and you generate an ORIGINAL, buildable DIY version of it.

Rules:
- Never encourage directly copying a copyrighted pattern, trademarked design, or branded product. Generate an original project merely INSPIRED by the shape/style/function of the uploaded image.
- Tailor the plan to the user's stated budget, skill level, preferred materials, and time available.
- Be realistic with costs (in US cents) and time (in minutes).
- estimated_cost_cents should be the DIY cost; retail_price_cents should be a reasonable estimate of buying an equivalent item; money_saved_cents = retail_price_cents - estimated_cost_cents (never negative).
- Include genuine safety warnings when tools like blades, needles, glue guns, or power tools are involved.
- Steps should be clear, numbered, and beginner-readable even for advanced projects.
- Respond ONLY with the structured JSON described by the schema.`;

export async function generateDiyProject(input: GenerationInput): Promise<GeneratedProject> {
  const userPrompt = `Build type: ${input.buildType}
Budget: ${input.budgetLabel}
Skill level: ${input.skillLevel}
Preferred materials: ${input.preferredMaterials}
Time available: ${input.timeAvailableLabel}
${input.petContext ? `Pet context: ${input.petContext}` : ""}

Analyze the attached photo and generate an original DIY project inspired by it.`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      {
        role: "user",
        content: [
          { type: "text", text: userPrompt },
          { type: "image_url", image_url: { url: input.imageUrl } },
        ],
      },
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
