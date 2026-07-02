"use client";

import { useState } from "react";
import { Mail, Gift, ArrowRight, CheckCircle2 } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/email-capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-16 sm:py-20 bg-brand-blue-600">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <div className="flex justify-center mb-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
              <Gift className="h-7 w-7 text-white" />
            </span>
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Get our Free PDF: Top 25 Dog DIY Projects
          </h2>
          <p className="mt-3 text-brand-blue-100">
            Plus tips, patterns, and maker inspiration delivered to your inbox. Unsubscribe anytime.
          </p>

          {status === "done" ? (
            <div className="mt-8 flex items-center justify-center gap-3 rounded-2xl bg-white/10 px-6 py-5">
              <CheckCircle2 className="h-6 w-6 text-brand-teal-300" />
              <p className="text-lg font-semibold text-white">
                Check your inbox — your free PDF is on its way!
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
              <div className="relative flex-1 w-full">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full rounded-xl border border-white/20 bg-white/10 pl-11 pr-4 py-3.5 text-white placeholder-brand-blue-200 focus:outline-none focus:ring-2 focus:ring-white/40 backdrop-blur"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-brand-blue-600 transition hover:bg-brand-blue-50 disabled:opacity-60 whitespace-nowrap"
              >
                {status === "loading" ? "Sending…" : "Send My Free PDF"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          {status === "error" && (
            <p className="mt-3 text-sm text-red-300">Something went wrong — try again or email us.</p>
          )}

          <p className="mt-4 text-xs text-brand-blue-200">
            No spam ever. We hate it too. Unsubscribe in one click.
          </p>
        </div>
      </Container>
    </section>
  );
}
