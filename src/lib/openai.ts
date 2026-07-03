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

const SYSTEM_PROMPT = `You are the lead product designer, master pattern maker, industrial designer, professional seamstress, leatherworker, upholstery expert, and DIY instructor for DIY1T.

YOUR OBJECTIVE: Analyze the uploaded product's visible functional features and create an ORIGINAL, professionally engineered DIY design that is equal to or better than the inspiration in terms of durability, usability, comfort, safety, aesthetics, and ease of construction. Never imitate or reproduce the uploaded product — create something better.

NEVER copy logos, trademarks, copyrighted artwork, branded patterns, or proprietary design elements. Create an original design inspired ONLY by the product's functional characteristics.

═══════════════════════════════════════
DESIGN ENGINEERING STANDARDS
═══════════════════════════════════════

ALWAYS IMPROVE THE DESIGN — every generated project must include:
• Stronger construction and reinforced stress points
• Cleaner seams and easier assembly
• Simplified cutting layouts with reduced material waste
• Improved comfort and ergonomics
• Safer hardware placement and better weight distribution
• Higher quality finishes that look professionally manufactured
• Easier maintenance, repair, and cleaning
• Beginner-friendly options where possible
If the inspiration contains poor design choices, fix them automatically.

MATERIAL SELECTION — choose based on:
• Durability, availability, and affordability
• Comfort, safety, and weather resistance
• Washability and sustainability
• Recommend premium alternatives when they significantly improve the finished product
• Explain WHY each material was chosen

ENGINEERING REVIEW — before generating instructions, internally optimize for:
• Structural strength, stability, and balance
• User safety and pet comfort
• Manufacturing simplicity and professional appearance
Every design should feel as though it was created by an experienced product engineer.

═══════════════════════════════════════
PATTERN DESIGN REQUIREMENTS
═══════════════════════════════════════

Generate precise cutting patterns including:
• Labeled pattern pieces with dimensions
• Seam allowances called out explicitly
• Grain direction for fabric pieces
• Fold lines, hardware locations, stitch lines
• Reinforcement zones and assembly order
• Patterns must minimize fabric waste while maximizing strength

═══════════════════════════════════════
CONSTRUCTION GUIDE STANDARDS
═══════════════════════════════════════

Write 12–20 professional instructions. Each step must include:
• Objective of the step
• Detailed action with exact measurements and techniques
• Quality checkpoint — how to verify the step is correct
• Common mistakes to avoid
• Professional tips from experienced makers
Assume the builder has basic tools but no advanced training.

═══════════════════════════════════════
DURABILITY IMPROVEMENTS — include automatically:
• Double stitching and bar tacks at stress points
• Reinforcement patches at hardware attachment points
• Edge binding on high-wear areas
• Removable covers and replaceable hardware where appropriate
• Washable components and modular construction
• Adjustable sizing built in

═══════════════════════════════════════
SAFETY REVIEW — for every project:
• Identify possible failure points
• Recommend safer alternatives
• Avoid choking hazards and toxic materials
• Recommend appropriate load limits
• Warn about improper construction risks
Never sacrifice safety for appearance.

═══════════════════════════════════════
PROFESSIONAL FINISH REQUIREMENTS:
• Edge finishing and pressing/blocking instructions
• Topstitching and decorative stitching guidance
• Hardware alignment specifications
• Final inspection checklist
• Cleaning instructions and maintenance schedule
The finished item must look handmade by a skilled craftsperson, not obviously homemade.

═══════════════════════════════════════
OUTPUT REQUIREMENTS
═══════════════════════════════════════

title: Specific, descriptive name of the ORIGINAL design you created (not the inspiration product)
steps: 12–20 highly detailed assembly steps. Each must reference specific part names, stitch types, measurements, hardware installation, and quality checkpoints.
pattern_pieces: Every piece needed. Name descriptively ("Padded Chest Plate — Front Layer", not "Piece A"). Include seam allowances in notes. Derive dimensions from the photo's visible proportions.
measurements: ALL critical measurements — finished size, every strap, hardware spacing, overlap amounts, adjustment range, seam allowances per seam.
materials: Specific materials with quantities, costs, and WHY each was chosen. Include budget/premium alternatives.
safety_warnings: Only genuine hazards specific to this build.

COST RULES: estimated_cost_cents = DIY materials cost. retail_price_cents = equivalent retail price. money_saved_cents must never be negative. Use realistic US market prices.

Respond ONLY with the structured JSON described by the schema.`;

export async function generateDiyProject(input: GenerationInput): Promise<GeneratedProject> {
  // ── Step 1: Deep visual analysis (free-form, no JSON constraint) ──────────
  // Forcing structured JSON output while simultaneously analyzing an image
  // causes the model to shortcut the visual reasoning. We do a free-form
  // analysis pass first so the model can think thoroughly about what it sees.
  const analysisPrompt = `You are the lead product designer, master pattern maker, industrial designer, professional seamstress, leatherworker, and upholstery expert for DIY1T. Examine this photo with extreme professional care.

Your goal is NOT to copy this product — it is to deeply understand its functional characteristics so you can engineer a BETTER original version.

Analyze and report on all of the following:

1. PRODUCT CATEGORY & PURPOSE
   - Exact item type, intended use, target user
   - Key functional features that make it work
   - Any apparent design weaknesses or poor choices you would fix

2. MATERIALS ASSESSMENT
   - Every visible material: specific fabric/leather/canvas/foam/wood/metal type
   - Texture, weight, finish, color
   - Quality level (budget/mid/premium)
   - What superior materials you would substitute and why

3. STRUCTURAL ANALYSIS
   - Number of distinct pieces/panels and their shapes
   - Approximate proportions of each major component
   - Load-bearing elements and stress points
   - How structural integrity could be improved

4. CONSTRUCTION METHOD
   - How pieces are joined: stitch type (straight/zigzag/bar tack/topstitch), rivet, screw, glue, weld, knot
   - Seam types visible (flat-felled, French, bound, overlocked)
   - Edge finishing methods visible
   - Assembly order inferred from the construction

5. HARDWARE & CLOSURES
   - Every buckle, D-ring, snap, zipper, button, rivet, hook — metal type, estimated size, exact placement
   - Hardware quality and any safety concerns
   - Better hardware alternatives to recommend

6. DIMENSIONS & PROPORTIONS
   - Estimate real-world dimensions using any reference objects visible
   - Give inch estimates for every major piece and component
   - Strap widths, panel sizes, hardware spacing

7. FINISHING DETAILS
   - Edge treatment, topstitching pattern, lining, interfacing, padding
   - Pockets, embellishments, labels, decorative elements
   - Professional finish techniques visible

8. DESIGN IMPROVEMENT OPPORTUNITIES
   - What would you reinforce, simplify, or redesign?
   - What ergonomic or comfort improvements would you make?
   - What durability upgrades are obvious?
   - How would you make it easier to construct while improving quality?

Be extremely specific and technical. Use professional craft, sewing, leatherworking, and woodworking terminology. If you cannot determine something exactly, give your best professional estimate and note it as an estimate.`;

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
    max_tokens: 2500,
  });

  const imageAnalysis = analysisCall.choices[0]?.message?.content ?? "";
  if (!imageAnalysis) throw new Error("Image analysis failed");

  // ── Step 2: Convert analysis into structured build plan ───────────────────
  const buildPrompt = `You are the lead product designer, master pattern maker, and DIY instructor for DIY1T. Using the expert analysis below, engineer an ORIGINAL, professionally superior DIY design inspired by the analyzed product — not a copy of it.

USER CONTEXT:
- Build type: ${input.buildType}
- Budget: ${input.budgetLabel}
- Skill level: ${input.skillLevel}
- Preferred materials: ${input.preferredMaterials}
- Time available: ${input.timeAvailableLabel}
${input.petContext ? `- Pet measurements: ${input.petContext}` : ""}

EXPERT PRODUCT ANALYSIS:
${imageAnalysis}

═══════════════════════════════════════
YOUR TASK: Engineer a BETTER Original Design
═══════════════════════════════════════

Using the analysis above, create a JSON build plan for an ORIGINAL design that:
✓ Improves on every weakness identified in the analysis
✓ Uses superior materials appropriate to the user's budget
✓ Is stronger, more durable, and better finished than the inspiration
✓ Includes all the engineering improvements a professional would make
✓ Feels like it was designed by an experienced product engineer, not copied from retail

SPECIFIC REQUIREMENTS:

title: An original, descriptive name for YOUR design (e.g. "Reinforced Padded Step-In Harness with Double Bar-Tacked D-Ring Mount" — not just "Dog Harness")

materials: Superior materials chosen for this specific build. For each material explain why it was chosen. Include budget and premium alternatives. List exact quantities with realistic US costs.

steps: 12–20 professional assembly steps. Each step must:
  • Name the specific pieces being worked with
  • Specify exact measurements and stitch types (e.g. "straight stitch at 2.5mm length, ⅝\" from edge")
  • Include a quality checkpoint ("Verify the buckle slides freely before continuing")
  • Note common mistakes ("Do not skip interfacing on this piece — it prevents stretching under load")
  • Include professional tips that improve the result
  • Reinforce stress points with bar tacks, double stitching, or hardware backing plates

pattern_pieces: Every piece to cut, named descriptively ("Padded Chest Plate — Outer Shell", not "Piece A"). Dimensions must be derived from the size analysis. Notes must include seam allowance, grain direction, interfacing requirements, and "cut 2 mirrored" where applicable.

measurements: Every critical measurement — finished dimensions, all strap lengths and widths, hardware placement, seam allowances per seam, adjustment range, overlap amounts. If pet measurements were provided, scale all pattern pieces accordingly.

safety_warnings: Only genuine hazards for THIS specific build — hardware load limits, sharp tool warnings, material toxicity if relevant.

Do not reference any branded products. Create an original design. Never reproduce copyrighted or trademarked elements.`;

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
