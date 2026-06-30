"use client";

import { Sparkles, PlayCircle, UploadCloud, Wand2, Hammer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-20 sm:pt-24 sm:pb-28">
      {/* Background accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-blue-100 opacity-60 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-brand-orange-100 opacity-60 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-brand-teal-100 opacity-50 blur-3xl" />
      </div>

      <Container>
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <div className="text-center lg:text-left">
            <div className="inline-flex justify-center lg:justify-start">
              <Badge color="teal">
                <Sparkles className="h-3.5 w-3.5" />
                AI-Powered DIY Generator
              </Badge>
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Turn Any Photo Into a{" "}
              <span className="brand-gradient-text">DIY Project</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-500 lg:mx-0">
              Upload an image and receive an AI-generated DIY guide complete
              with materials, costs, instructions, and a printable shopping
              list.
            </p>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <LinkButton href="/register" size="lg">
                <Sparkles className="h-4.5 w-4.5" />
                Start Free
              </LinkButton>
              <LinkButton href="#examples" variant="outline" size="lg">
                <PlayCircle className="h-4.5 w-4.5" />
                Watch Demo
              </LinkButton>
            </div>

            <p className="mt-6 text-sm text-slate-400">
              No credit card required &middot; 3 free projects to start
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="glass animate-float rounded-3xl p-6 shadow-soft-lg">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-brand-orange-400" />
                  <span className="h-3 w-3 rounded-full bg-brand-teal-400" />
                  <span className="h-3 w-3 rounded-full bg-brand-blue-400" />
                </div>
                <span className="text-xs font-medium text-slate-400">
                  diy1t.com/upload
                </span>
              </div>

              <div className="mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-brand-blue-200 bg-brand-blue-50/40 py-10">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft">
                  <UploadCloud className="h-7 w-7 text-brand-blue-500" />
                </span>
                <p className="text-sm font-medium text-slate-600">
                  Drop a photo to get started
                </p>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white p-3 shadow-soft">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-teal-50">
                  <Wand2 className="h-5 w-5 text-brand-teal-500" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    Generating: Cozy Dog Bed
                  </p>
                  <p className="text-xs text-slate-400">
                    Materials &middot; Cost &middot; Steps &middot; PDF
                  </p>
                </div>
              </div>
            </div>

            <div className="glass absolute -bottom-6 -left-6 hidden items-center gap-2 rounded-2xl px-4 py-3 shadow-soft-lg sm:flex">
              <Hammer className="h-4 w-4 text-brand-orange-500" />
              <span className="text-xs font-semibold text-slate-700">
                12,400+ projects built
              </span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
