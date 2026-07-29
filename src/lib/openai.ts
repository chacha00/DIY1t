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
  visionContext?: string;
}

export interface SizeCuttingSpec {
  piece_name: string; // must exactly match a name in pattern_pieces[]
  width_in: number;
  height_in: number;
  notes?: string; // e.g. "Cut 2 on fold" or a size-specific exception
}

export interface SizeChartRow {
  size_name: string;
  breed_examples: string[];
  chest_in: string;
  neck_in: string;
  back_in: string;
  weight_lbs: string;
  notes: string;
  cutting_specs?: SizeCuttingSpec[]; // sewn items only; omitted for knit/crochet
  // Optional garment-specific columns
  sleeve_in?: string;
  crotch_in?: string;
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
  fabric_consumption_by_size?: { size: string; yards: string; meters: string }[];
  notions_required?: { item: string; quantity: string; notes?: string }[];
  notions_optional?: { item: string; quantity: string; notes?: string }[];
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
${input.petContext ? `\nPet measurements provided: ${input.petContext}.\n` : ""}${input.visionContext ? `\nContext from DIY Vision scan: ${input.visionContext}\n` : ""}
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
    // CRITICAL: this array must contain 10-14 entries in the real response — the single entry below is
    // only a formatting example. A short project is NOT a valid reason to under-fill this array: break
    // construction into more granular steps (prep, cut, sew each seam, attach each hardware piece,
    // finish, fit-check) until you reach 10-14. Fewer than 8 steps will be rejected and regenerated.
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

  "notions_required": [
    {"item":"Separating zipper","quantity":"see size chart length column","notes":"Length varies by size — measure finished back length + 2 cm / ¾ in"},
    {"item":"Ready-made bias tape (1.5 in wide)","quantity":"1.5 meters / 1.65 yards","notes":"For armhole binding — buy pre-folded double-fold tape"}
  ],
  "notions_optional": [
    {"item":"Synthetic winterizer / batting","quantity":"same amount as main fabric","notes":"Cut matching pieces from FRONT, BACK, and COLLAR patterns; fuse to wrong side before sewing"}
  ],

  "fabric_consumption_by_size": [
    {"size":"2XS","yards":"0.44 yards","meters":"0.40 m"},
    {"size":"XS","yards":"0.55 yards","meters":"0.50 m"},
    {"size":"S","yards":"0.66 yards","meters":"0.60 m"},
    {"size":"M","yards":"0.77 yards","meters":"0.70 m"},
    {"size":"L","yards":"0.93 yards","meters":"0.85 m"},
    {"size":"XL","yards":"1.09 yards","meters":"1.00 m"},
    {"size":"2XL","yards":"1.20 yards","meters":"1.10 m"},
    {"size":"3XL","yards":"1.42 yards","meters":"1.30 m"},
    {"size":"4XL","yards":"1.64 yards","meters":"1.50 m"}
  ],

  "pattern_pieces": [
    {
      "name":"FRONT",
      "width_in":12,
      "height_in":8,
      "quantity":2,
      "shape":"rectangle",
      "seam_allowance_in":0.375,
      "grain_direction":"straight grain — length parallel to dog's spine",
      "fold_edge":"none",
      "cut_instruction":"Cut 2 (1 main fabric + 1 lining)",
      "notches":[{"edge":"right","position_pct":50},{"edge":"bottom","position_pct":25},{"edge":"bottom","position_pct":75}],
      "shape_description":"Rectangle with 1 cm radius rounded corners at bottom two corners only. Top edge straight for collar attachment.",
      "notes":"Mark center front with chalk before cutting. Reinforce attachment zones with iron-on interfacing on wrong side."
    },
    {
      "name":"BACK",
      "width_in":12.5,
      "height_in":8.5,
      "quantity":2,
      "shape":"rectangle",
      "seam_allowance_in":0.375,
      "grain_direction":"straight grain — length parallel to dog's spine",
      "fold_edge":"none",
      "cut_instruction":"Cut 2 (1 main fabric + 1 lining)",
      "notches":[{"edge":"left","position_pct":50},{"edge":"bottom","position_pct":50}],
      "shape_description":"Rectangle. Side edges will be joined to FRONT at shoulder and side seams.",
      "notes":"Match notches to FRONT side seams when sewing together."
    },
    {
      "name":"COLLAR",
      "width_in":14,
      "height_in":2.25,
      "quantity":1,
      "shape":"rectangle",
      "seam_allowance_in":0.375,
      "grain_direction":"straight grain",
      "fold_edge":"left",
      "cut_instruction":"Cut 1 on fold",
      "notches":[{"edge":"top","position_pct":50},{"edge":"bottom","position_pct":50}],
      "shape_description":"Long strip cut on fold. Fold in half lengthwise with wrong sides together; secure two layers with zigzag before attaching to neckline.",
      "notes":"Mark center point on short edge opposite fold for alignment with center back neckline."
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
    {"size_name":"2XS","breed_examples":["Chihuahua","Toy Poodle","Pomeranian"],"chest_in":"8-10","neck_in":"6-8","back_in":"6-8","weight_lbs":"2-4","notes":"Use 1 in webbing. Reduce buckle to ¾ in.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":7,"height_in":5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":7.5,"height_in":5.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":8.5,"height_in":1.5,"notes":"Cut 1 on fold"}
      ]},
    {"size_name":"XS","breed_examples":["Yorkie","Maltese","Teacup Poodle"],"chest_in":"10-14","neck_in":"8-10","back_in":"8-10","weight_lbs":"4-8","notes":"Use 1 in webbing.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":8.5,"height_in":6,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":9,"height_in":6.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":10,"height_in":1.75,"notes":"Cut 1 on fold"}
      ]},
    {"size_name":"S","breed_examples":["Shih Tzu","Pug","French Bulldog"],"chest_in":"14-18","neck_in":"10-12","back_in":"10-13","weight_lbs":"8-15","notes":"Use 1 in webbing.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":10,"height_in":7,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":10.5,"height_in":7.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":12,"height_in":2,"notes":"Cut 1 on fold"}
      ]},
    {"size_name":"M","breed_examples":["Beagle","Cocker Spaniel","Corgi"],"chest_in":"18-22","neck_in":"12-14","back_in":"13-16","weight_lbs":"15-30","notes":"Use 1.5 in webbing. Standard pattern as drafted.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":12,"height_in":8,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":12.5,"height_in":8.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":14,"height_in":2.25,"notes":"Cut 1 on fold"}
      ]},
    {"size_name":"L","breed_examples":["Labrador","Golden Retriever","Boxer"],"chest_in":"22-28","neck_in":"14-18","back_in":"16-20","weight_lbs":"30-60","notes":"Use 1.5 in webbing.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":14.5,"height_in":9.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":15,"height_in":10,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":17,"height_in":2.5,"notes":"Cut 1 on fold"}
      ]},
    {"size_name":"XL","breed_examples":["German Shepherd","Husky","Doberman"],"chest_in":"28-34","neck_in":"18-22","back_in":"20-24","weight_lbs":"60-80","notes":"Use 1.5 in webbing.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":17,"height_in":11,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":17.5,"height_in":11.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":20,"height_in":2.75,"notes":"Cut 1 on fold"}
      ]},
    {"size_name":"2XL","breed_examples":["Labrador Retriever","Weimaraner","Flat-Coated Retriever"],"chest_in":"34-38","neck_in":"22-25","back_in":"24-27","weight_lbs":"80-95","notes":"Use 2 in webbing.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":19,"height_in":12.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":19.5,"height_in":13,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":23,"height_in":3,"notes":"Cut 1 on fold"}
      ]},
    {"size_name":"3XL","breed_examples":["Great Dane","Bernese Mountain Dog","Irish Wolfhound"],"chest_in":"38-44","neck_in":"25-28","back_in":"27-31","weight_lbs":"95-120","notes":"Use 2 in webbing. Reinforce all stress points.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":22,"height_in":14,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":22.5,"height_in":14.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":26,"height_in":3.25,"notes":"Cut 1 on fold"}
      ]},
    {"size_name":"4XL","breed_examples":["Mastiff","Saint Bernard","Newfoundland"],"chest_in":"44-52","neck_in":"28-33","back_in":"31-36","weight_lbs":"120-160","notes":"Use 2 in webbing. Use steel hardware. Double all bar tacks.",
      "cutting_specs":[
        {"piece_name":"FRONT","width_in":25,"height_in":16,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"BACK","width_in":25.5,"height_in":16.5,"notes":"Cut 2 (1 outer + 1 lining)"},
        {"piece_name":"COLLAR","width_in":30,"height_in":3.5,"notes":"Cut 1 on fold"}
      ]}
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
- Name every piece using simple, capitalized professional sewing terms: FRONT, BACK, COLLAR, PLACKET, SLEEVE, CUFF, GUSSET, HOOD, LEG, POCKET, WAISTBAND — the same naming used in commercial indie dog patterns (Indie Pattern, LoveDogClothing). Never use compound names like "CHEST VEST PANEL" or "BELLY STRAP PIECE" — these are incorrect; use FRONT and BACK for body panels and COLLAR, PLACKET for those specific components.
- seam_allowance_in: ⅜ in (0.375) for knit/stretch fabric; ⅝ in (0.625) for woven/Cordura/leather — match to the actual construction method
- seam_allowance_in: ⅝ in (0.625) for woven/Cordura; ¼ in (0.25) for knit; ½ in (0.5) for leather
- fold_edge: set only when the piece is cut on fold — never include both halves of a folded piece
- notches: include on every piece that aligns to another piece — minimum 1 notch per seam junction
- grain_direction: be specific — "straight grain, length parallel to dog's spine" not just "straight grain"
- cut_instruction: exact — "Cut 2 (1 outer + 1 lining)", "Cut 1 on fold", "Cut 4 — mirror 2"
- shape_description: describe any curves, tapers, or non-rectangular features precisely
- openings: for a body/torso/harness panel with an armhole (vest, harness, coat), add one entry per armhole on the appropriate side edge: {"kind":"armhole","edge":"left" (or "right"),"position_pct":<30-50>,"width_in":3.5-5 for a medium dog,"depth_in":2-3.5,"curve":"standard"}. For a hoodie/sweater body or hood panel with a neckline cut into the top edge, add {"kind":"neckhole","edge":"top","position_pct":50,"width_in":4-6,"depth_in":1.5-2.5,"curve":"shallow"}. For a poncho/cowl-style piece with a fully enclosed head hole in the middle (not touching any edge), add {"kind":"neckhole","edge":"center","width_in":5-7,"depth_in":5-7} — keep width_in and depth_in close to equal so the hole reads as roughly round. For leg holes (onesie body panel, leg warmers), use the same mechanism with "kind":"leghole". Only add openings that are structurally real for that piece — straps, cuffs, pockets, and flat panels normally have none; omit the key or leave it empty rather than forcing one in.
- notes: include reinforcement zones, special handling, or construction sequence notes

SIZE CHART — always output exactly 9 rows: 2XS, XS, S, M, L, XL, 2XL, 3XL, 4XL. This is the same 9-size system used by professional indie dog sewing patterns (Indie Pattern, LoveDogClothing, etc.). Use the following body measurement ranges as your guide and interpolate breed examples accurately for each size:
  2XS: chest 8-10", neck 6-8", back 6-8", weight 2-4 lbs — Chihuahua, Toy Poodle, Pomeranian
  XS:  chest 10-14", neck 8-10", back 8-10", weight 4-8 lbs — Yorkie, Maltese, Teacup Poodle
  S:   chest 14-18", neck 10-12", back 10-13", weight 8-15 lbs — Shih Tzu, Pug, French Bulldog
  M:   chest 18-22", neck 12-14", back 13-16", weight 15-30 lbs — Beagle, Cocker Spaniel, Corgi
  L:   chest 22-28", neck 14-18", back 16-20", weight 30-60 lbs — Labrador, Golden Retriever, Boxer
  XL:  chest 28-34", neck 18-22", back 20-24", weight 60-80 lbs — German Shepherd, Husky, Doberman
  2XL: chest 34-38", neck 22-25", back 24-27", weight 80-95 lbs — Weimaraner, Flat-Coated Retriever
  3XL: chest 38-44", neck 25-28", back 27-31", weight 95-120 lbs — Great Dane, Bernese Mountain Dog
  4XL: chest 44-52", neck 28-33", back 31-36", weight 120-160 lbs — Mastiff, Saint Bernard, Newfoundland

SIZE CHART CUTTING SPECS (sewn items only — omit the cutting_specs key entirely for knit/crochet projects):
- Every size_chart row must include a cutting_specs array with exactly one entry per pattern_pieces item — never a vague scaling note ("scale by 75%") in place of real numbers.
- piece_name must exactly match a name in the pattern_pieces array, same string and case.
- Derive each size's width_in/height_in from the base pattern piece's dimensions using the same proportion implied by that size's chest_in/neck_in relative to the base (M) — round to a sane sewing increment (nearest ¼ in).
- Sanity-check growth per size step against real commercial patterns: main body panels (FRONT, BACK) grow ~1.5-2 in in width per size step; collar/bands grow ~1 in per step; straps scale by ~10-15% per step. Do not output near-identical dimensions across sizes, and do not output implausibly large jumps.
- Keep the row-level notes field for general per-size guidance (webbing width, hardware size) — put exact cut numbers only in cutting_specs.

FABRIC CONSUMPTION BY SIZE — always output fabric_consumption_by_size for sewn items, with all 9 size rows. Calculate yardage assuming standard 60 in / 150 cm fabric width with pieces placed efficiently on the fold. Base size (M) total is typically 0.7-0.9 yards; scale up/down ~0.1-0.15 yards per step. Always include both yards and meters.

NOTIONS — for sewn items: always output notions_required (hardware and trims that are definitively needed: zipper, bias tape, webbing, D-rings, buckles) and notions_optional (batting, winterizer, decorative trim, optional pockets). Omit both for knit/crochet. Give specific quantities — "1.5 meters / 1.65 yards of 1.5 in wide double-fold bias tape" not just "bias tape".

KNITTING INSTRUCTIONS (write every knitting step's description as a literal professional pattern — the way a Lion Brand or Ravelry pattern prints, never paraphrased prose):
- construction_notes must open with a gauge + terminology line in this exact shape: "GAUGE: 14 sts × 18 rows = 4 in (10 cm) in stockinette stitch on US 8 (5 mm) needles. Terms are US terminology throughout." Adjust stitch/row counts, stitch name, needle size, and terminology (US or UK) to match the actual design — never mix US and UK terms in one pattern.
- Every row is its own numbered line inside the step description: "Row 4: K2, *P2, K2, rep from * to end (24 sts)"
- Every row ends with the resulting stitch count in parentheses, EXCEPT verbatim repeats of an already-counted row — state the count once, then collapse: "Row 5: Rep Row 4. Rows 6-11: Rep Row 4 six more times." or "Rep Row 4 until piece measures 20 in from cast-on, ending after a WS row." Never spell out more than 4 consecutive identical rows individually.
- Name every increase/decrease technique explicitly on first use, then abbreviate it: M1L, M1R, kfb, ssk, k2tog, cdd
- Note which side is facing at any transition point: "ending after a RS row", "with WS facing"
- Abbreviations array must list every abbreviation used, as {"term":"ssk","definition":"slip, slip, knit — left-leaning decrease"}

CROCHET INSTRUCTIONS (write every crochet step's description as a literal professional pattern — never paraphrased prose):
- construction_notes must open with a gauge + terminology line in this exact shape: "GAUGE: 12 sc × 14 rows = 4 in (10 cm) with size H/8 (5 mm) hook. Terms are US terminology throughout (US sc = UK dc)." Adjust stitch counts, stitch name, hook size, and terminology to match the actual design — never mix US and UK terms in one pattern.
- Every row/round is its own numbered line using literal notation: "Ch 30. Row 1: Hdc in 3rd ch from hook and in each ch across (28 sts). Row 2: Ch 2 (does not count as a st), turn, hdc in each st across (28 sts)."
- The first time a turning/starting chain does not count as a stitch, say so inline: "(ch 2 does not count as a st)" — state once per stitch height used, not on every repeat.
- Every round/row ends with the count in parentheses: "Rnd 3: (sc, inc) in each st around (18 sts)" — omit only on verbatim repeats after the count is already established.
- Collapse long identical-row runs the way commercial patterns do: "Rep Row 2 until piece measures 50 in from beginning." Never spell out more than 4 consecutive identical rows individually.
- Note "stuff as you go" at correct step for amigurumi
- Left/right limbs always get separate instructions, each restarting its own row/round numbering at 1
- Abbreviations array must list every abbreviation used, as {"term":"sc","definition":"single crochet"}

STEPS: Write exactly 10–14 numbered steps. Every step description must be self-contained — a builder with no other reference can follow it. Use professional sewing language throughout:
- Always specify which sides face each other: "with right sides of the fabric together", "with wrong sides together"
- Always specify pressing direction: "press the seam allowances open" or "press towards the back"
- For KNIT / STRETCH fabric projects: always specify stitch type — "using a serger or zigzag stitch to maintain stretch" (not just "sew")
- For WOVEN fabric projects: specify "using a straight stitch"
- Call out alignment points: "aligning the notches", "matching the side seams", "aligning center fronts"
- State when to turn right side out: "turn right side out through the armhole opening and press"
- Tip lines should use the same concise, diagram-ready style as professional indie patterns — one clear action per sentence
For KNITTED or CROCHETED projects, step descriptions must be written as literal row-by-row/round-by-round pattern text per the KNITTING/CROCHET INSTRUCTIONS rules above — never paraphrase stitches in prose.

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
- 9 size_chart rows (2XS through 4XL); for sewn items, every row's cutting_specs array must have exactly one entry per pattern_piece (matching pattern_pieces.length); omit cutting_specs entirely for knit/crochet projects
- 9 fabric_consumption_by_size entries (matching all 9 sizes) for sewn items; omit for knit/crochet
- notions_required and notions_optional for sewn items (omit for knit/crochet)
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

  if (parsed.steps.length < 8) {
    throw new Error(
      `AI generated only ${parsed.steps.length} step(s) — expected 10-14 detailed steps. Try regenerating.`
    );
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
