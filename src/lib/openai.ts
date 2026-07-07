import OpenAI from "openai";
import type { DifficultyLevel, PatternPiece, PatternAbbreviation, FabricRequirement, ProjectMeasurement } from "@/types/database";

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
  construction_notes?: string;
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
    technique_note?: string;
    time_minutes?: number;
  }[];
  safety_warnings: string[];
  fit_checklist?: string[];
  beginner_tips?: string[];
  abbreviations?: PatternAbbreviation[];
  fabric_requirements?: FabricRequirement[];
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
  const prompt = `You are a professional pattern designer and DIY instructor producing commercial-quality sewing, knitting, and crochet patterns — the same standard as Etsy top sellers, Create Kids Couture, and published amigurumi books. Analyze this photo and produce a complete, print-ready DIY build plan.

═══════════════════════════════════════════════
STEP 1 — DETERMINE CONSTRUCTION METHOD
═══════════════════════════════════════════════
Look ONLY at the visual texture and material in the photo. Never use the filename or product name.

• SEWN / NO-SEW: smooth woven fabric, nylon webbing, canvas, fleece, felt, leather, foam, vinyl — no individual yarn stitches visible in the material itself.
  → Output: printable pattern pieces with seam allowances, grain lines, fold marks, and notches. Numbered sewing steps.

• KNITTED: you can see individual V-shaped knit stitches, stockinette, ribbing, seed stitch, cables, or lace in the fabric itself.
  → Output: full knitting pattern with cast-on count, stitch pattern abbreviation key, row-by-row instructions with stitch counts in parentheses like (24 sts), increases/decreases marked, bind-off. Include yarn weight, needle size, gauge per 4 inches.

• CROCHETED: you can see interlocking loops, chains, post stitches, granny squares, or the characteristic bumpy crochet texture.
  → Output: full crochet pattern with magic ring or starting chain, stitch abbreviation key, round-by-round or row-by-row instructions with stitch counts like (18), increases/decreases, fasten-off and finishing. Include yarn weight, hook size, gauge.

NEVER mix methods. NEVER assume from the name. Match exactly what the photo shows.
${input.petContext ? `\nPet measurements provided: ${input.petContext}.` : ""}

═══════════════════════════════════════════════
STEP 2 — PRODUCE PROFESSIONAL-QUALITY OUTPUT
═══════════════════════════════════════════════
Match the quality of a published Etsy pattern book. Every field below must be filled with real, usable detail — not placeholder text.

Respond with ONLY a raw JSON object (no markdown fences, no code blocks):

{
  "title": "Descriptive project name matching what is visible in the photo",
  "difficulty": "beginner|easy|medium|advanced|expert",
  "assembly_overview": "2-3 sentences describing the overall build approach and what makes this project special",
  "construction_notes": "1-2 sentences on fabric/yarn type, key tools, and technique notes specific to what is shown",

  "estimated_cost_cents": 1400,
  "estimated_time_minutes": 150,
  "retail_price_cents": 6500,
  "money_saved_cents": 5100,

  "fabric_requirements": [
    {"component":"Main body fabric","yards":"½ yd","notes":"knit with 50% stretch minimum"},
    {"component":"Contrast trim","yards":"¼ yd","notes":"ribbed knit"},
    {"component":"Fusible interfacing","yards":"⅛ yd","notes":"lightweight, optional for structure"}
  ],

  "materials": [
    {"name":"Main fabric or yarn (specific description)","quantity":"½ yd or 150 g","cost_cents":799,"reason":"why this specific material is correct for this project","alt_options":[{"label":"Budget option","cost_cents":399}]}
  ],

  "tools": [{"name":"Sewing machine or crochet hook size","required":true}],

  "abbreviations": [
    {"term":"sc","definition":"single crochet"},
    {"term":"inc","definition":"2 sc in same stitch (increase)"},
    {"term":"dec","definition":"invisible decrease — insert hook in front loops of next 2 sts, yarn over, pull through, yarn over, pull through 2 loops"},
    {"term":"MR","definition":"magic ring"}
  ],

  "steps": [
    {
      "order":1,
      "title":"Step title",
      "description":"Detailed instruction matching the technique (e.g. for crochet: exact stitch counts per round; for sewing: exactly what to sew right sides together, which raw edges to align, stitch length, seam allowance)",
      "quality_checkpoint":"How to verify this step is correct before moving on",
      "common_mistake":"The most common error beginners make at this step and how to avoid it",
      "pro_tip":"A professional tip that makes this step easier or produces a better result",
      "technique_note":"Fabric/yarn-specific note (e.g. use clips not pins for stretch knit; reduce machine tension to 3 for knits)",
      "time_minutes":15
    }
  ],

  "pattern_pieces": [
    {
      "name":"CHEST PANEL",
      "width_in":12,
      "height_in":8,
      "quantity":2,
      "shape":"rectangle",
      "seam_allowance_in":0.625,
      "grain_direction":"straight grain (length of fabric runs top to bottom)",
      "fold_edge":"left",
      "cut_instruction":"Cut 2 on fold",
      "notches":[{"edge":"right","position_pct":50}],
      "shape_description":"Rectangle with 1.5 in radius curved corners at bottom two corners",
      "notes":"Clip curves every ½ in before turning"
    }
  ],

  "measurements": [
    {"label":"Neck circumference","value":"14 in (35.5 cm)","category":"fitting"},
    {"label":"Chest circumference","value":"18 in (45.7 cm)","category":"fitting"},
    {"label":"Back length","value":"12 in (30.5 cm)","category":"fitting"},
    {"label":"Seam allowance","value":"⅝ in (1.6 cm)","category":"seam"},
    {"label":"Hardware: side-release buckle","value":"1.5 in wide to match webbing","category":"hardware"}
  ],

  "size_chart": [
    {"size_name":"XS","breed_examples":["Chihuahua","Yorkie"],"chest_in":"10-14","neck_in":"8-10","back_in":"8-10","weight_lbs":"4-8","notes":"Strap width 1 in"},
    {"size_name":"S","breed_examples":["Shih Tzu","Pug"],"chest_in":"14-18","neck_in":"10-12","back_in":"10-13","weight_lbs":"8-15","notes":"Strap width 1 in"},
    {"size_name":"M","breed_examples":["Beagle","Cocker Spaniel"],"chest_in":"18-22","neck_in":"12-14","back_in":"13-16","weight_lbs":"15-30","notes":"Strap width 1.5 in"},
    {"size_name":"L","breed_examples":["Lab","Golden Retriever"],"chest_in":"22-28","neck_in":"14-18","back_in":"16-20","weight_lbs":"30-60","notes":"Strap width 1.5 in"},
    {"size_name":"XL","breed_examples":["Great Dane","Mastiff"],"chest_in":"28-36","neck_in":"18-22","back_in":"20-26","weight_lbs":"60-100","notes":"Strap width 2 in"}
  ],

  "fit_checklist": [
    "You can slide two fingers under the neck, chest, and belly straps",
    "No strap crosses or presses on the throat",
    "The item does not restrict leg movement — dog can walk, sit, and lie down normally",
    "Garment clears potty area and tail",
    "Hardware buckles release easily with one hand"
  ],

  "beginner_tips": [
    "Prewash all fabrics before cutting — knit fabrics in particular shrink significantly",
    "For knit fabrics: use a ballpoint needle, reduce tension to 3, increase stitch length to 4",
    "Use clips instead of pins for stretch fabrics, mesh, or slippery materials",
    "Sew one test seam on a fabric scrap before sewing the actual pieces",
    "Press every seam with an iron before the next step — this makes a big difference in finish quality"
  ],

  "safety_warnings": [
    "Never leave a pet unsupervised while wearing a newly made item — check fit after 5 minutes",
    "Ensure no hardware edges are sharp or exposed where they could scratch skin"
  ],

  "diy_score": {"difficulty":4,"estimated_time_minutes":150,"estimated_cost_cents":1400,"safety_rating":9,"skill_level_required":"easy","tool_complexity":3,"overall_score":80,"success_probability_beginner":0.78},
  "tags": ["dog","harness","sewing","beginner"]
}

═══════════════════════════════════════════════
QUALITY RULES — READ BEFORE GENERATING
═══════════════════════════════════════════════
PATTERN PIECES (sewn items):
- Every piece must have a real name (CHEST PANEL, BELLY STRAP, NECK BAND — not "Piece 1")
- Include seam_allowance_in (standard ⅝ in = 0.625 for woven, ¼ in = 0.25 for knit)
- Set fold_edge when a piece is cut on fold (never include both halves — pattern pieces show only half)
- Include at least one notch on pieces that must align with another piece
- grain_direction should be specific: "straight grain, length parallel to straps"
- cut_instruction must be exact: "Cut 2", "Cut 1 on fold", "Cut 4 — mirror 2"

KNITTING INSTRUCTIONS:
- List gauge: X sts × Y rows = 4 in in [stitch pattern] on [needle size] needles
- Every row must have a stitch count in parentheses at the end: "Row 1: K across (24 sts)"
- For increases: "M1L, kfb" — name the exact technique
- For decreases: "ssk, k2tog" — name the exact technique
- List all abbreviations used in the abbreviations array

CROCHET INSTRUCTIONS:
- List gauge: X sc × Y rows = 4 in with [hook size] hook
- Every round/row must end with stitch count in parentheses: "(18)"
- Specify "stuff as you go" where relevant
- For amigurumi: left and right limbs get separate instructions
- List all abbreviations used in the abbreviations array

STEPS: Write 10–14 numbered steps. Each step description must be specific enough to follow without any other reference — include exact stitch counts, seam allowance sizes, which edges to align, right-side vs wrong-side, and what the result should look like.

PRICING RULES:
- All monetary values in CENTS only (e.g. $5.99 = 599)
- Individual materials: $1–$20 each. Total: $5–$40 simple, $15–$80 complex
- retail_price_cents = what this sells for in a store (3–5× DIY cost)
- money_saved_cents = retail_price_cents − estimated_cost_cents (never negative)

COUNTS: 6–10 materials, 10–14 steps, 3–6 pattern pieces (sewn) or 0 pattern pieces (knit/crochet — use steps instead), 8–14 measurements, 5 size chart rows, 3–6 fabric_requirements (sewn) or 0 (knit/crochet).`;

  const completion = await getOpenAI().chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: input.imageUrl, detail: "high" } },
        ],
      },
    ],
    response_format: { type: "json_object" },
    max_tokens: 6000,
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
