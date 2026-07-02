import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "DIY Pet Projects Blog | Patterns, Guides & Tutorials | DIY1T",
  description: "Free DIY pet project guides — dog harness patterns, dog bed tutorials, cat sweater plans, horse leg wrap instructions, and more. AI-generated, printer-ready.",
};

const POSTS = [
  {
    slug: "how-to-make-a-dog-harness",
    title: "How to Make a Dog Harness at Home (With Free Pattern)",
    description: "A complete guide to sewing a padded step-in harness for your dog. Includes materials list, pattern pieces, measurements, and step-by-step instructions.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=75",
    imageAlt: "Dog wearing a harness on a walk",
    category: "Harnesses",
    readTime: "8 min read",
    tags: ["dog harness pattern", "DIY dog harness", "sew dog harness"],
  },
  {
    slug: "diy-dog-bed-pattern",
    title: "DIY Dog Bed Pattern: Memory Foam Bolster Bed for Under $30",
    description: "Skip the $90 pet store bed. This tutorial shows you how to make a washable memory foam bolster dog bed with a removable cover — for any size dog.",
    image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&q=75",
    imageAlt: "Dog resting on a comfortable dog bed",
    category: "Dog Beds",
    readTime: "6 min read",
    tags: ["DIY dog bed", "dog bed pattern", "sew dog bed"],
  },
  {
    slug: "diy-dog-sweater-knitting-pattern",
    title: "DIY Dog Sweater Knitting Pattern (All Sizes, Free Download)",
    description: "A beginner-friendly knitting pattern for a ribbed dog pullover sweater. Includes sizing charts from XS chihuahua to XL Great Dane.",
    image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&q=75",
    imageAlt: "Small dog wearing a knitted sweater",
    category: "Sweaters",
    readTime: "7 min read",
    tags: ["dog sweater pattern", "knit dog sweater", "DIY dog sweater"],
  },
  {
    slug: "diy-dog-raincoat-pattern",
    title: "DIY Dog Raincoat Pattern: Waterproof & Adjustable",
    description: "Make a custom waterproof raincoat for your dog using ripstop nylon. This pattern includes adjustable straps and a removable hood.",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=600&q=75",
    imageAlt: "Dog wearing a raincoat outside",
    category: "Outerwear",
    readTime: "9 min read",
    tags: ["dog raincoat pattern", "DIY dog raincoat", "waterproof dog coat"],
  },
  {
    slug: "diy-cat-tree-plans",
    title: "DIY Cat Tree Plans: Floor-to-Ceiling Climbing Tower",
    description: "Build a custom cat tree with carpet-covered platforms, sisal scratching posts, and a hideaway den. Full cut list and assembly instructions included.",
    image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=600&q=75",
    imageAlt: "Cat sitting on a cat tree",
    category: "Cat Projects",
    readTime: "11 min read",
    tags: ["DIY cat tree", "cat tree plans", "build cat tree"],
  },
  {
    slug: "horse-leg-wrap-diy",
    title: "Horse Leg Wrap DIY: Fleece Standing Wraps Pattern",
    description: "Save $40+ per set by making your own fleece horse leg wraps. This guide covers sizing for any breed — from ponies to warmbloods.",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600&q=75",
    imageAlt: "Horse with leg wraps",
    category: "Horse Gear",
    readTime: "7 min read",
    tags: ["horse leg wrap pattern", "DIY horse wraps", "fleece horse wraps"],
  },
];

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="border-b border-slate-100 py-14">
          <Container>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-widest text-brand-orange-500">Blog</p>
              <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900">
                DIY Pet Project Guides
              </h1>
              <p className="mt-4 text-lg text-slate-500">
                Free patterns, tutorials, and step-by-step guides for making pet accessories at home.
                Every guide was generated with DIY1T AI.
              </p>
            </div>
          </Container>
        </section>

        <section className="py-16">
          <Container>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {POSTS.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition-shadow hover:shadow-soft-lg"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.imageAlt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-700 shadow">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-400">{post.readTime}</p>
                    <h2 className="mt-1 text-base font-bold leading-snug text-slate-900 group-hover:text-brand-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-slate-500 line-clamp-2">
                      {post.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-16 rounded-3xl bg-brand-blue-600 p-8 text-center text-white">
              <p className="text-xl font-bold">Want a custom pattern for your pet?</p>
              <p className="mt-2 text-brand-blue-100">Upload any photo and get a complete DIY plan in 30 seconds — free to try.</p>
              <Link
                href="/register"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-semibold text-brand-blue-600 hover:bg-brand-blue-50 transition"
              >
                Generate My First Project Free
              </Link>
            </div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
