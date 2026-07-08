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

export interface CostTier {
  label: "Budget" | "Standard" | "Premium";
  cost_cents: number;
  expected_lifespan: string;
  recommended_for: string;
  advantages: string[];
  disadvantages: string[];
}

export interface DesignImprovement {
  feature: string;
  why_it_matters: string;
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
  design_improvements?: DesignImprovement[];
  cost_tiers?: CostTier[];
  variants?: string[];
  maintenance_guide?: string[];
  repair_guide?: string[];
  finishing_recommendations?: string[];
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
  const prompt = `You are the lead product designer, master pattern maker, industrial designer, professional seamstress, leatherworker, upholstery expert, and DIY instructor for DIY1T.

Your objective is NOT to imitate or reproduce the uploaded product. Instead, analyze its visible functional features and create an ORIGINAL, professionally engineered DIY design that is equal to or better than the inspiration in terms of durability, usability, comfort, safety, aesthetics, and ease of construction.
${input.petContext ? `\nPet measurements provided: ${input.petContext}.\n` : ""}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 1 — PRODUCT ANALYSIS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Examine the photo and identify:
1. Product category and primary purpose
2. Key functional features and how they serve the user
3. Estimated dimensions and proportions
4. Construction method — determined ONLY from visual texture:
   • SEWN/NO-SEW: smooth woven fabric, canvas, nylon webbing, leather, fleece, felt, foam, vinyl (no yarn stitches visible) → pattern pieces + sewing steps
   • KNITTED: visible V-shaped knit stitches, stockinette, ribbing, cables, seed stitch → row-by-row knitting instructions with stitch counts in parentheses (24 sts)
   • CROCHETED: interlocking loops, chains, post stitches, granny squares, bumpy crochet texture → round-by-round crochet instructions with stitch counts (18)
5. Apparent weaknesses or poor design choices in the original
6. Opportunities for improvement

NEVER use the filename, product name, or brand. NEVER mix construction methods. Match what the photo visually shows.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 2 — DESIGN ENGINEERING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before generating instructions, perform an internal engineering review. Your design must improve on the original by incorporating where appropriate:
• Stronger construction and reinforced stress points
• Double stitching and bar tacks at high-load areas
• Reinforcement patches at hardware attachment points
• Cleaner seams and edge binding
• Easier assembly sequence and simplified cutting layouts
• Reduced material waste
• Improved comfort and ergonomics
• Safer hardware placement
• Better weight distribution
• Higher quality finishes
• Washable/removable components
• Adjustable sizing
• Modular construction where it improves repairability

NEVER copy logos, trademarks, copyrighted artwork, branded patterns, or proprietary design elements.
Create an original design inspired only by the product's functional characteristics.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PHASE 3 — OUTPUT FORMAT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Respond with ONLY a raw JSON object — no markdown, no code fences, no commentary before or after:

{
  "title": "Original descriptive project name — never the brand/retail name",
  "difficulty": "beginner|easy|medium|advanced|expert",

  "assembly_overview": "2-3 sentences describing your original engineered approach and what makes this design superior to the retail inspiration",

  "construction_notes": "Specific fabric or yarn type, gauge or weight, key tools, and technique notes tailored to what is visible in the image",

  "design_improvements": [
    {"feature":"Double-stitched stress points at all D-ring attachment areas","why_it_matters":"Bar-tack stitching distributes load across 1.5 in of fabric vs. a single stitch line, preventing tearing under sudden force"},
    {"feature":"Padded mesh lining on contact surfaces","why_it_matters":"Prevents chafing during extended wear; the original retail version uses unlined nylon that can rub raw spots"},
    {"feature":"Side-release buckles angled 30° outward","why_it_matters":"Makes one-handed release possible — critical for emergency removal"}
  ],

  "estimated_cost_cents": 1400,
  "estimated_time_minutes": 150,
  "retail_price_cents": 6500,
  "money_saved_cents": 5100,

  "cost_tiers": [
    {
      "label":"Budget",
      "cost_cents":800,
      "expected_lifespan":"6-12 months with regular use",
      "recommended_for":"First build or temporary use while sizing",
      "advantages":["Lowest material cost","Uses widely available fabric"],
      "disadvantages":["Nylon webbing may stiffen in cold weather","Less padding on contact points"]
    },
    {
      "label":"Standard",
      "cost_cents":1400,
      "expected_lifespan":"2-3 years",
      "recommended_for":"Most users — best value",
      "advantages":["Padded mesh lining","Quality side-release hardware","Washable"],
      "disadvantages":["Slightly longer build time than budget version"]
    },
    {
      "label":"Premium",
      "cost_cents":2800,
      "expected_lifespan":"5+ years",
      "recommended_for":"Active dogs, professional sellers, gift-quality builds",
      "advantages":["1000-denier Cordura outer shell","Solid brass D-ring","Reflective stitching","Full padding","Removable liner"],
      "disadvantages":["Higher material cost","Requires heavier-duty needle and thread"]
    }
  ],

  "variants": [
    "No-sew version: use iron-on webbing tape and rivets instead of stitching",
    "Waterproof version: substitute marine vinyl for main fabric, use rustproof hardware",
    "Lightweight summer version: mesh-only construction, eliminate padding layer",
    "Heavy-duty working dog version: Cordura shell + 2 in webbing + steel hardware",
    "Travel version: folds flat, includes removable ID tag pocket"
  ],

  "fabric_requirements": [
    {"component":"Main outer fabric","yards":"½ yd","notes":"1000-denier Cordura or 600D polyester Oxford — wipe-clean, tear-resistant"},
    {"component":"Padding/lining","yards":"¼ yd","notes":"Compression foam ¼ in thick OR air-mesh spacer fabric"},
    {"component":"Accent/trim","yards":"⅛ yd","notes":"Contrast color optional — use for decorative top-stitching or piping"}
  ],

  "materials": [
    {"name":"1000-denier Cordura nylon (main shell)","quantity":"½ yd","cost_cents":899,"reason":"Tear-resistant and water-repellent — significantly more durable than the polyester used in most retail harnesses","alt_options":[{"label":"600D polyester (budget)","cost_cents":399},{"label":"Marine vinyl (waterproof)","cost_cents":1199}]},
    {"name":"1.5 in nylon webbing","quantity":"2 yd","cost_cents":349,"reason":"Rated to 500 lb tensile strength — matches hardware width exactly so buckles seat cleanly"},
    {"name":"Side-release buckles (1.5 in) × 2","quantity":"2","cost_cents":299,"reason":"Curved release tab allows one-handed operation; flat buckles require two hands"},
    {"name":"Front D-ring (welded, 1.5 in)","quantity":"1","cost_cents":149,"reason":"Welded D-ring has no seam — rated for leash tension without bending open"},
    {"name":"Air-mesh spacer fabric (lining)","quantity":"¼ yd","cost_cents":399,"reason":"Allows airflow against skin — prevents the hot spots that solid foam creates"},
    {"name":"Heavy-duty thread (V-69 bonded nylon)","quantity":"1 spool","cost_cents":599,"reason":"Outdoor-rated UV-resistant thread — regular polyester degrades in sun within one season"}
  ],

  "tools": [
    {"name":"Sewing machine with walking foot","required":true},
    {"name":"Heavy-duty needle (size 16-18, denim/leather)","required":true},
    {"name":"Rotary cutter and cutting mat","required":false},
    {"name":"Wonder clips (12+)","required":false},
    {"name":"Seam gauge or ruler","required":true},
    {"name":"Lighter (for sealing webbing ends)","required":true},
    {"name":"Awl or punch for hardware holes","required":false}
  ],

  "abbreviations": [],

  "steps": [
    {
      "order":1,
      "title":"Take measurements and scale pattern",
      "description":"Measure the dog's neck circumference, chest circumference (widest point behind front legs), and back length (neck base to tail base). Add 1 in ease to neck and chest for comfort. If the pet's measurements fall between size chart rows, cut to the larger size and adjust straps. Record all measurements on paper before cutting anything.",
      "quality_checkpoint":"Confirm measurements against the size chart. The chest piece should wrap around the rib cage with 1 in overlap at the buckle when fastened.",
      "common_mistake":"Measuring over existing collar rather than directly on skin — this adds up to 1 in of error and causes a too-loose fit.",
      "pro_tip":"Wrap a soft tape measure around the widest chest point while the dog is standing — sitting compresses the ribs and gives a false reading.",
      "technique_note":"For dogs with deep chests (Greyhound, Whippet), add 2 in ease rather than 1 in.",
      "time_minutes":10
    }
  ],

  "pattern_pieces": [
    {
      "name":"CHEST VEST PANEL",
      "width_in":12,
      "height_in":8,
      "quantity":2,
      "shape":"rectangle",
      "seam_allowance_in":0.625,
      "grain_direction":"straight grain — length of fabric parallel to dog's spine",
      "fold_edge":"none",
      "cut_instruction":"Cut 2 (1 outer shell + 1 mesh lining)",
      "notches":[{"edge":"right","position_pct":50},{"edge":"bottom","position_pct":25},{"edge":"bottom","position_pct":75}],
      "shape_description":"Rectangle with 1.5 in radius rounded corners at bottom two corners only. Top edge straight for strap attachment.",
      "notes":"Reinforce D-ring attachment zone with a 2 in × 2 in square of extra shell fabric fused to wrong side before cutting."
    },
    {
      "name":"SHOULDER STRAP",
      "width_in":14,
      "height_in":2,
      "quantity":2,
      "shape":"rectangle",
      "seam_allowance_in":0.625,
      "grain_direction":"straight grain — length parallel to strap direction",
      "fold_edge":"none",
      "cut_instruction":"Cut 2 — mirror pair",
      "notches":[{"edge":"left","position_pct":50}],
      "shape_description":"Long rectangle. Both short ends receive bar tacks. Fold in half lengthwise with right sides together to form tube.",
      "notes":"Cut webbing 1 in shorter than fabric tube so stitching encases the raw webbing end."
    },
    {
      "name":"BELLY STRAP",
      "width_in":13,
      "height_in":2,
      "quantity":1,
      "shape":"rectangle",
      "seam_allowance_in":0.625,
      "grain_direction":"straight grain",
      "fold_edge":"none",
      "cut_instruction":"Cut 1",
      "notches":[{"edge":"top","position_pct":50}],
      "shape_description":"Straight rectangle. Both ends taper to 1 in width over the last 1.5 in for clean buckle feed.",
      "notes":"Sew two rows of stitching at each buckle feed point — ⅛ in from edge and again at ½ in from edge."
    }
  ],

  "measurements": [
    {"label":"Neck circumference (measured + 1 in ease)","value":"14 in (35.5 cm)","category":"fitting"},
    {"label":"Chest circumference (measured + 1 in ease)","value":"18 in (45.7 cm)","category":"fitting"},
    {"label":"Back length","value":"12 in (30.5 cm)","category":"fitting"},
    {"label":"Chest panel width (finished)","value":"11 in (27.9 cm)","category":"finished"},
    {"label":"Chest panel height (finished)","value":"7 in (17.8 cm)","category":"finished"},
    {"label":"Shoulder strap length (finished)","value":"13 in (33 cm)","category":"finished"},
    {"label":"Belly strap length (finished)","value":"12 in (30.5 cm)","category":"finished"},
    {"label":"Webbing width","value":"1.5 in (3.8 cm)","category":"hardware"},
    {"label":"D-ring opening","value":"1.5 in (3.8 cm) — must match webbing width","category":"hardware"},
    {"label":"Buckle opening","value":"1.5 in (3.8 cm) — must match webbing width","category":"hardware"},
    {"label":"Seam allowance (all seams)","value":"⅝ in (1.6 cm)","category":"seam"},
    {"label":"Bar tack width at stress points","value":"⅜ in (1 cm) × 3 passes","category":"seam"},
    {"label":"Reinforcement patch size","value":"2 in × 2 in (5 × 5 cm) at D-ring zone","category":"pattern"},
    {"label":"Total webbing required","value":"2 yd (180 cm)","category":"pattern"}
  ],

  "size_chart": [
    {"size_name":"XS","breed_examples":["Chihuahua","Yorkie","Teacup Poodle"],"chest_in":"10-14","neck_in":"8-10","back_in":"8-10","weight_lbs":"4-8","notes":"Use 1 in webbing. Reduce buckle to 1 in. Scale all pattern pieces by 75%."},
    {"size_name":"S","breed_examples":["Shih Tzu","Pug","French Bulldog"],"chest_in":"14-18","neck_in":"10-12","back_in":"10-13","weight_lbs":"8-15","notes":"Use 1 in webbing. Standard buckle."},
    {"size_name":"M","breed_examples":["Beagle","Cocker Spaniel","Corgi"],"chest_in":"18-22","neck_in":"12-14","back_in":"13-16","weight_lbs":"15-30","notes":"Use 1.5 in webbing. Standard pattern as drafted."},
    {"size_name":"L","breed_examples":["Labrador","Golden Retriever","Boxer"],"chest_in":"22-28","neck_in":"14-18","back_in":"16-20","weight_lbs":"30-60","notes":"Use 1.5 in webbing. Scale chest panel width +2 in."},
    {"size_name":"XL","breed_examples":["Great Dane","Mastiff","Rottweiler"],"chest_in":"28-36","neck_in":"18-22","back_in":"20-26","weight_lbs":"60-100","notes":"Use 2 in webbing. Use steel hardware. Double all bar tacks."}
  ],

  "fit_checklist": [
    "Two fingers slide easily under neck strap, chest panel, and belly strap simultaneously",
    "No strap crosses the throat or trachea — all pressure is on the chest and sternum only",
    "Dog can walk, sit, lie down, and turn its head fully in both directions without restriction",
    "Harness does not shift or rotate during a 5-minute walk — if it shifts, tighten belly strap",
    "All buckles release cleanly with one hand — critical for emergency removal",
    "D-ring sits at center of dog's upper back, not shifted to one side",
    "Garment clears potty area completely — belly strap sits behind the last rib",
    "No raw fabric edges or hardware corners contact the skin"
  ],

  "beginner_tips": [
    "Prewash all fabric on hot before cutting — Cordura and polyester shrink up to 3% and this prevents finished item from puckering after washing",
    "Use a size 16 denim needle and V-69 bonded nylon thread — standard thread will snap at stress points within months",
    "Singe all webbing cut ends with a lighter immediately after cutting — unfinished ends fray and jam buckles within days",
    "Use wonder clips instead of pins on webbing and thick layers — pins leave permanent holes in Cordura",
    "Test every buckle and D-ring by pulling firmly with both hands before attaching to the dog — hardware defects should be found now, not in the field",
    "Sew a complete test strap on scrap fabric before the real piece — this calibrates your stitch length and tension for thick material"
  ],

  "safety_warnings": [
    "Never leave a newly fitted harness on an unsupervised dog for the first 48 hours — check for rubbing, restricted movement, or escape attempts every 15 minutes initially",
    "Load-test all hardware before first use: clip a leash to the D-ring and pull with 50 lb of force — any hardware failure indicates defective parts",
    "Replace any hardware that shows signs of corrosion, cracking, or deformation immediately",
    "Do not use decorative or craft-grade buckles — use only buckles rated for pet or outdoor use",
    "Bar tacks are not optional at hardware attachment points — a single stitch line will eventually pull through under leash tension"
  ],

  "finishing_recommendations": [
    "Topstitch all exterior seams ⅛ in from edge for a professional machine-sewn appearance",
    "Press all seams open with a Teflon iron sheet (do not iron Cordura directly — it melts)",
    "Align all hardware so buckle openings face the same direction before final stitching",
    "Final inspection: run fingernail along all interior seams to confirm no raw edge can contact skin",
    "Wash on gentle/cold and air dry — never machine dry webbing or buckles"
  ],

  "maintenance_guide": [
    "Wash monthly or after muddy/wet use: hand wash in cold water with mild soap, rinse thoroughly, air dry fully before storage",
    "Inspect all bar tack stitching every 3 months — pull firmly on each D-ring and buckle; if stitching shows any fraying, re-stitch immediately",
    "Rinse buckles with fresh water after salt water or heavy sweat exposure — salt accelerates plastic fatigue",
    "Check webbing for fraying at cut ends every month — re-singe if any loose fibers appear"
  ],

  "repair_guide": [
    "Frayed seam: unpick 1 in on each side of the frayed section, re-sew with fresh thread, add bar tack at each end",
    "Broken buckle: cut stitching at buckle attachment only, slide out old buckle, slide in replacement, re-stitch with bar tacks",
    "Worn padding: remove lining stitching, replace air-mesh layer, re-attach — outer shell typically outlasts 2-3 liners",
    "Pulled-out D-ring: cut reinforcement patch stitching, add a second 2 in × 2 in patch on top of original, re-attach D-ring with doubled bar tacks"
  ],

  "diy_score": {"difficulty":4,"estimated_time_minutes":150,"estimated_cost_cents":1400,"safety_rating":9,"skill_level_required":"easy","tool_complexity":3,"overall_score":85,"success_probability_beginner":0.78},
  "tags": ["dog","harness","sewing","beginner","adjustable","padded"]
}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENGINEERING & QUALITY RULES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
The JSON above is a TEMPLATE showing structure and depth — generate completely original content for the actual photo. Do not copy the example values.

DESIGN IMPROVEMENTS — always include 3–6 specific, engineering-level improvements over what the retail product shows. Each improvement must state WHAT was changed and WHY it produces a better outcome. Vague statements like "better quality" are not acceptable.

COST TIERS — always provide Budget / Standard / Premium with realistic per-tier costs, expected lifespan, and honest trade-offs. The Standard tier drives estimated_cost_cents.

PATTERN PIECES (sewn items):
- Name every piece professionally: CHEST VEST PANEL, BELLY STRAP, SHOULDER STRAP — never "Piece 1"
- seam_allowance_in: ⅝ in (0.625) for woven/Cordura; ¼ in (0.25) for knit; ½ in (0.5) for leather
- fold_edge: set only when the piece is cut on fold — never include both halves of a folded piece
- notches: include on every piece that aligns to another piece — minimum 1 notch per seam junction
- grain_direction: be specific — "straight grain, length parallel to dog's spine" not just "straight grain"
- cut_instruction: exact — "Cut 2 (1 outer + 1 lining)", "Cut 1 on fold", "Cut 4 — mirror 2"
- shape_description: describe any curves, tapers, or non-rectangular features precisely
- notes: include reinforcement zones, special handling, or construction sequence notes

KNITTING INSTRUCTIONS:
- Gauge: X sts × Y rows = 4 in in [stitch name] on [size] US needles
- Every row/round ends with stitch count: "Row 4: K2, *P2, K2, rep from * to end (24 sts)"
- Name every increase/decrease technique: M1L, M1R, kfb, ssk, k2tog, cdd
- Abbreviations array must list every abbreviation used

CROCHET INSTRUCTIONS:
- Gauge: X sc × Y rows = 4 in with size [letter/mm] hook
- Every round/row ends with count: "Rnd 3: (sc, inc) × 6 (18)"
- Note "stuff as you go" at correct step for amigurumi
- Left/right limbs always get separate instructions
- Abbreviations array must list every abbreviation used

STEPS: Write exactly 10–14 numbered steps. Every step description must be self-contained — a builder with no other reference can follow it. Include: which pieces go together, which sides face which direction (right side / wrong side), exact measurements, stitch length settings, what the result looks and feels like when done correctly.

MATERIAL REASONS: every material entry must have a specific reason explaining why that material was chosen over cheaper alternatives — "durable" alone is not acceptable.

SAFETY: Every project must include at minimum 4 safety warnings. For pet items, all warnings must address both construction safety (hardware, materials) and use safety (supervision, fit check, load limits).

PRICING RULES:
- All monetary values in CENTS only ($5.99 = 599, $14.00 = 1400)
- Individual materials: $1–$20 each typical
- Budget tier total: $5–$25 for simple, $15–$45 for complex
- Standard tier total: $10–$40 for simple, $25–$80 for complex
- Premium tier total: 2–3× Standard
- estimated_cost_cents = Standard tier cost_cents
- retail_price_cents = what this sells for at PetSmart / Amazon / Etsy (3–5× Standard DIY cost)
- money_saved_cents = retail_price_cents − estimated_cost_cents (never negative, never zero)

OUTPUT COUNTS:
- 6–10 materials with reasons and alt_options
- 3–6 specific design_improvements with engineering rationale
- 3 cost_tiers (Budget / Standard / Premium)
- 3–8 variants
- 10–14 detailed steps
- 3–6 pattern pieces for sewn items (0 for knit/crochet — use steps instead)
- 8–14 measurements (both imperial and metric for every dimension)
- 5 size_chart rows
- 3–6 fabric_requirements for sewn items
- 4–6 fit_checklist items
- 4–8 beginner_tips
- 4–6 safety_warnings
- 3–5 finishing_recommendations
- 3–5 maintenance_guide items
- 3–5 repair_guide items`;

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
    max_tokens: 8000,
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
