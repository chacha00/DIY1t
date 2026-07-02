import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Sparkles } from "lucide-react";

const POSTS: Record<string, {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  category: string;
  readTime: string;
  intro: string;
  sections: { heading: string; body: string }[];
  materials: string[];
  ctaText: string;
}> = {
  "how-to-make-a-dog-harness": {
    title: "How to Make a Dog Harness at Home (With Free Pattern)",
    description: "A complete guide to sewing a padded step-in harness for your dog. Includes materials list, pattern pieces, measurements, and step-by-step instructions.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",
    imageAlt: "Dog wearing a harness on a walk",
    category: "Harnesses",
    readTime: "8 min read",
    intro: "A well-fitted dog harness distributes pressure across the chest instead of the throat — crucial for dogs who pull, have tracheal issues, or are puppies still learning to walk on leash. Store-bought harnesses typically cost $35–$75 and rarely fit perfectly. Making your own takes about 2–3 hours and costs under $15 in materials.",
    sections: [
      {
        heading: "Materials You'll Need",
        body: "1.5\" nylon webbing (2 yards), 1\" side-release buckles × 2, 1\" D-ring × 1, fleece or neoprene lining fabric (¼ yard), matching thread, heavy-duty sewing machine needle (size 16), and a rotary cutter or sharp scissors.",
      },
      {
        heading: "Measuring Your Dog",
        body: "You'll need three measurements: (1) Chest girth — measured around the widest part of the chest, just behind the front legs. (2) Neck — measured loosely where a collar would sit. (3) Back length — from the base of the neck to the base of the tail. Add 1 inch to each measurement for ease.",
      },
      {
        heading: "Cutting the Pattern Pieces",
        body: "Cut two chest panels (your chest measurement ÷ 2, plus seam allowance). Cut one back strap (back length measurement × 1.5\" wide). Cut one belly band (chest girth ÷ 2 × 1.5\" wide). All pattern pieces include ⅝\" seam allowance.",
      },
      {
        heading: "Sewing the Harness",
        body: "Step 1: Interface one chest panel. Place panels right sides together and sew around the perimeter leaving a 3\" gap. Clip corners, turn right side out, and top-stitch. Step 2: Thread the back strap webbing through the D-ring and fold over 2\". Sew a box-X stitch to secure. Step 3: Attach buckle halves to the shoulder ends of each chest panel. Step 4: Join the belly band to the bottom edge of each chest panel. Try on your dog and adjust before final stitching.",
      },
      {
        heading: "Tips for a Perfect Fit",
        body: "You should be able to fit two fingers between the harness and your dog's body. The D-ring should sit between the shoulder blades, not at the neck. If your dog is between sizes, cut for the larger size and use the buckle adjustment range. Wash the fleece lining before sewing to prevent shrinkage.",
      },
    ],
    materials: ["1.5\" nylon webbing · ~$3", "Side-release buckles × 2 · ~$3", "D-ring × 1 · ~$1", "Fleece lining ¼ yd · ~$4", "Thread · ~$2"],
    ctaText: "Upload a photo of any harness to get a custom pattern sized to your dog",
  },
  "diy-dog-bed-pattern": {
    title: "DIY Dog Bed Pattern: Memory Foam Bolster Bed for Under $30",
    description: "Skip the $90 pet store bed. This tutorial shows you how to make a washable memory foam bolster dog bed with a removable cover — for any size dog.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=900&q=80",
    imageAlt: "Dog resting on a comfortable dog bed",
    category: "Dog Beds",
    readTime: "6 min read",
    intro: "Orthopedic dog beds can run $80–$150 at retail. This tutorial shows you how to build an equivalent bed with a 3-inch memory foam insert, washable canvas cover, and four stuffed bolster sides — for under $30 in materials from your local fabric store.",
    sections: [
      {
        heading: "Choosing the Right Foam",
        body: "Use 3-inch high-density memory foam (at least 4 lb density). For small dogs, 24\"×30\" is sufficient. Medium dogs need 28\"×36\". Large dogs need 36\"×48\". You can often find memory foam toppers at thrift stores and cut them to size.",
      },
      {
        heading: "Cutting the Fabric",
        body: "Cut one base piece (foam size + 2\" seam allowance on all sides). Cut four bolster strips (8\" wide × foam length, for each side). Cut one bottom panel for the zipper opening. All measurements assume ⅝\" seam allowance.",
      },
      {
        heading: "Sewing the Bolsters",
        body: "Fold each bolster strip in half lengthwise, right sides together. Sew the long edge and one short end. Turn right side out. Stuff firmly with polyfill. Baste the open end closed. Pin all four bolsters to the perimeter of the base panel, aligning raw edges.",
      },
      {
        heading: "Installing the Zipper",
        body: "Sew a 36\" zipper (or the length of one bolster side) to the bottom panel. This allows the foam insert to be removed for washing. Box-stitch the zipper ends for durability. Attach the zipper panel to the remaining open bolster edge.",
      },
    ],
    materials: ["Canvas fabric 1.5 yds · ~$12", "Memory foam 3\" · ~$18", "Polyfill batting · ~$5", "Heavy-duty zipper 36\" · ~$4", "Thread · ~$2"],
    ctaText: "Upload a photo of any dog bed to get a custom pattern and materials list",
  },
  "diy-dog-sweater-knitting-pattern": {
    title: "DIY Dog Sweater Knitting Pattern (All Sizes, Free)",
    description: "A beginner-friendly knitting pattern for a ribbed dog pullover sweater. Includes sizing charts from XS chihuahua to XL Great Dane.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=900&q=80",
    imageAlt: "Small dog wearing a knitted sweater",
    category: "Sweaters",
    readTime: "7 min read",
    intro: "A handknit dog sweater is one of the most satisfying pet projects — it's faster than you think, requires only basic knitting skills, and fits your dog exactly. This ribbed pullover pattern works for any breed from Chihuahuas to Golden Retrievers.",
    sections: [
      {
        heading: "Yarn & Needles",
        body: "Use bulky weight yarn (size 5–6) for most dogs. Avoid anything scratchy — merino, alpaca blends, or acrylic chenille all work well. You'll need US size 8–10 needles depending on your gauge. Knit a gauge swatch: you're aiming for approximately 14 stitches per 4 inches.",
      },
      {
        heading: "Sizing",
        body: "Measure your dog's back length (base of neck to base of tail), chest girth (widest point behind front legs), and neck girth. For a medium dog (15\" back, 20\" chest): Cast on 44 stitches, work 2×2 rib for 3\", increase to 56 sts for body, work 6\" stockinette, divide 14 sts each side for leg holes.",
      },
      {
        heading: "The Pattern",
        body: "CO 44 sts. Rows 1-10: *K2, P2* repeat. Inc row: K2, M1L, knit to last 2, M1R, K2. Repeat inc row every 6th row until 56 sts. Work even in stockinette until body measures 5\". Divide for legs: K14, BO 28, K14. Work 2\" on each side set. Rejoin and CO 28 over the bound-off sts. Work neck in 2×2 rib for 3\". BO loosely.",
      },
    ],
    materials: ["Bulky wool yarn 200 yds · ~$10", "US size 9 needles · ~$8", "Stitch markers × 4 · ~$2", "Tapestry needle · ~$1"],
    ctaText: "Upload a photo of any dog sweater for an AI-generated pattern sized to your dog",
  },
  "diy-dog-raincoat-pattern": {
    title: "DIY Dog Raincoat Pattern: Waterproof & Adjustable",
    description: "Make a custom waterproof raincoat for your dog using ripstop nylon. This pattern includes adjustable straps and a removable hood.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=900&q=80",
    imageAlt: "Dog wearing a raincoat outside",
    category: "Outerwear",
    readTime: "9 min read",
    intro: "Keep your dog dry on rainy walks without spending $55 on a branded raincoat. This pattern uses ripstop nylon with a DWR coating — the same material used in human rain jackets — for a fraction of the cost.",
    sections: [
      {
        heading: "Materials",
        body: "Ripstop nylon with DWR coating (1.5 yds), 1\" velcro hook-and-loop (2 yds), seam sealing tape, and a walking foot or teflon presser foot for your sewing machine. Do not pin ripstop — use binder clips or wonder clips to hold pieces together, as pin holes are permanent.",
      },
      {
        heading: "Pattern Pieces",
        body: "Main body panel: measure from your dog's neck to tail, add 4\" for overlap. Width: chest girth + 6\". Leg gussets: oval cutouts sized to your dog's front leg circumference + 1\". Hood (optional): dome shape sized to your dog's head circumference.",
      },
      {
        heading: "Assembly",
        body: "Sew the main body panel, folding raw edges to the wrong side and topstitching. Apply seam sealing tape to all sewn seams from the inside. Attach velcro along the belly edges for closure. Install leg gussets by sewing oval pieces around the leg openings. Add the hood attachment point at the neck.",
      },
    ],
    materials: ["Ripstop nylon DWR 1.5 yds · ~$14", "Velcro hook-and-loop 2 yds · ~$6", "Seam sealing tape · ~$5", "Thread · ~$2"],
    ctaText: "Upload a photo of any dog coat to get a waterproof pattern in your dog's exact size",
  },
  "diy-cat-tree-plans": {
    title: "DIY Cat Tree Plans: Floor-to-Ceiling Climbing Tower",
    description: "Build a custom cat tree with carpet-covered platforms, sisal scratching posts, and a hideaway den. Full cut list and assembly instructions included.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=900&q=80",
    imageAlt: "Cat sitting on a cat tree",
    category: "Cat Projects",
    readTime: "11 min read",
    intro: "A quality cat tree at retail costs $120–$400. Building your own lets you customize the height, number of platforms, and aesthetic — and costs as little as $60 in materials. This design includes five platforms, two scratching posts, and a hideaway box.",
    sections: [
      {
        heading: "Cut List",
        body: "Base platform: 24\"×24\" of ¾\" plywood. Upper platforms: four 16\"×16\" pieces. Box den: six 14\"×14\" pieces. Posts: 4\" PVC pipe cut to desired heights (typically 12\", 18\", 24\", and 36\"). Flanges: 4\" PVC flanges × 8.",
      },
      {
        heading: "Covering the Platforms",
        body: "Use low-pile carpet remnants or sisal fabric to cover all plywood pieces before assembly. Apply carpet adhesive to the board surface. Stretch fabric tight and staple gun the edges to the underside. Trim excess with a utility knife. This step is easiest before assembly.",
      },
      {
        heading: "Post Assembly",
        body: "Wrap sisal rope tightly around each PVC post, securing the start and end with staples. Use 3\" wood screws to attach PVC flanges to the top and bottom of each post. Bolt posts to platforms using the flange screw holes. Pre-drill to prevent splitting.",
      },
      {
        heading: "Final Assembly",
        body: "Build from the base up. Attach the base platform flanges to the floor (optional — the weight usually keeps it stable). Stack posts and platforms in your chosen configuration. Add hanging toys to the top posts. Check for wobble and reinforce any loose connections with L-brackets.",
      },
    ],
    materials: ["¾\" plywood (one 4×8 sheet) · ~$28", "4\" PVC pipe 8 ft · ~$12", "Sisal rope 100 ft · ~$14", "Carpet remnants · ~$10", "PVC flanges × 8 · ~$16"],
    ctaText: "Upload a photo of any cat tree to get a custom build plan with your exact dimensions",
  },
  "horse-leg-wrap-diy": {
    title: "Horse Leg Wrap DIY: Fleece Standing Wraps Pattern",
    description: "Save $40+ per set by making your own fleece horse leg wraps. This guide covers sizing for any breed — from ponies to warmbloods.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=900&q=80",
    imageAlt: "Horse with leg wraps",
    category: "Horse Gear",
    readTime: "7 min read",
    intro: "A set of four fleece standing wraps retails for $45–$80. Making your own set takes about an hour and costs $10–$15 in anti-pill fleece. DIY wraps also let you choose custom colors and exact lengths for your horse's leg conformation.",
    sections: [
      {
        heading: "Measuring for Standing Wraps",
        body: "Measure from just below the knee (or hock on the hind leg) to the top of the fetlock. Add 4\" for overlap. Standard warmblood: 18–20\". Pony: 14–16\". Width is always 4.5\" for proper leg support.",
      },
      {
        heading: "Cutting the Fleece",
        body: "Cut four strips to your measured length × 4.5\" wide. Anti-pill fleece is ideal — it doesn't fray, so raw edges don't need finishing. Cut on the crossgrain (perpendicular to selvage) for maximum stretch. Fleece naturally stretches more in one direction — orient this stretch lengthwise on the leg.",
      },
      {
        heading: "Finishing the Edges",
        body: "No finishing required on fleece raw edges — this is what makes them so fast to make. However, if you want a clean look, fold the long edges under ½\" and top-stitch with a stretch stitch (lightning bolt stitch or ballpoint needle with polyester thread).",
      },
      {
        heading: "Applying the Wraps",
        body: "Always apply over a clean, dry leg. Start just below the knee and wrap in the direction of the cannon bone tendon — front left leg wraps clockwise (left to right across the front). Overlap each pass by 50%. Secure with a velcro strip or large safety pins. Check that you can slip two fingers under the wrap — never wrap so tightly you can't.",
      },
    ],
    materials: ["Anti-pill fleece 2 yds · ~$8", "Velcro 2\" strips × 4 · ~$3", "Polyester thread · ~$2"],
    ctaText: "Upload a photo of any horse accessory for a custom AI-generated pattern",
  },
};

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return {};
  return {
    title: `${post.title} | DIY1T Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  return (
    <>
      <Header />
      <main className="flex-1">
        <article>
          {/* Hero */}
          <div className="relative h-64 sm:h-80 overflow-hidden">
            <Image src={post.image} alt={post.imageAlt} fill className="object-cover" unoptimized />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {post.category}
              </span>
              <h1 className="mt-2 max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-3xl">
                {post.title}
              </h1>
              <p className="mt-1 text-sm text-white/70">{post.readTime}</p>
            </div>
          </div>

          <Container>
            <div className="mx-auto max-w-2xl py-12">
              <p className="text-lg leading-relaxed text-slate-600">{post.intro}</p>

              {post.sections.map((section) => (
                <div key={section.heading} className="mt-10">
                  <h2 className="text-xl font-bold text-slate-900">{section.heading}</h2>
                  <p className="mt-3 leading-relaxed text-slate-600">{section.body}</p>
                </div>
              ))}

              {/* Materials list */}
              <div className="mt-10 rounded-2xl border border-brand-teal-100 bg-brand-teal-50 p-6">
                <h3 className="font-bold text-brand-teal-700">Materials &amp; Cost Estimate</h3>
                <ul className="mt-3 space-y-2">
                  {post.materials.map((m) => (
                    <li key={m} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-teal-400 shrink-0" />
                      {m}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <div className="mt-12 rounded-3xl bg-brand-blue-600 p-8 text-center text-white">
                <Sparkles className="mx-auto h-8 w-8 text-brand-blue-200" />
                <p className="mt-3 text-lg font-bold">{post.ctaText}</p>
                <p className="mt-1 text-sm text-brand-blue-200">Upload a photo → get a complete DIY plan in 30 seconds</p>
                <Link
                  href="/register"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-blue-600 hover:bg-brand-blue-50 transition"
                >
                  Try It Free — No Card Required
                </Link>
              </div>

              <div className="mt-8 border-t border-slate-100 pt-8">
                <Link href="/blog" className="text-sm font-semibold text-brand-blue-600 hover:underline">
                  ← Back to all guides
                </Link>
              </div>
            </div>
          </Container>
        </article>
      </main>
      <Footer />
    </>
  );
}
