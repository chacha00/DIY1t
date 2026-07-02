"use client";

import { Sparkles, PlayCircle, UploadCloud } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-12 sm:pt-24 sm:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-blue-100 opacity-60 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-brand-orange-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-teal-100 opacity-50 blur-3xl" />
      </div>

      <Container>
        <div className="mx-auto max-w-4xl text-center">
          <Badge color="teal">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Pet DIY Generator
          </Badge>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Turn Any Pet Product Into a{" "}
            <span className="brand-gradient-text">DIY Project</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-500">
            Upload a photo of a harness, dog bed, sweater, leash, toy, or any pet accessory
            and receive an original DIY plan with materials, costs, printable templates,
            and step-by-step instructions tailored to your pet's exact measurements.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <LinkButton href="/register" size="lg">
              <Sparkles className="h-4.5 w-4.5" />
              Start Free — 3 Projects
            </LinkButton>
            <LinkButton href="#examples" variant="outline" size="lg">
              <PlayCircle className="h-4.5 w-4.5" />
              See Examples
            </LinkButton>
          </div>

          <p className="mt-5 text-sm text-slate-400">
            No credit card required &middot; Free plan includes 3 complete projects
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm font-semibold text-slate-500">
            {["🐶 Harnesses", "🛏️ Dog Beds", "🧶 Sweaters", "🎾 Toys", "🦮 Leashes", "🐱 Cat Accessories", "🐴 Horse Gear"].map(l => (
              <span key={l}>{l}</span>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
