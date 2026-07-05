"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { BackBar } from "@/components/ui/BackBar";
import { Container } from "@/components/ui/Container";

const FAQS = [
  {
    category: "Getting Started",
    items: [
      {
        q: "How does DIY1T work?",
        a: "Upload a photo of any pet item you want to recreate — a harness, bed, sweater, or toy. Our AI analyzes the image and generates a complete step-by-step DIY build plan including materials, pattern pieces, measurements, and instructions tailored to the construction method shown in the photo.",
      },
      {
        q: "What kinds of items can I build?",
        a: "Anything for pets — harnesses, vests, beds, blankets, toys, sweaters, coats, collars, and more. The AI detects whether the item is sewn, knitted, or crocheted and produces the appropriate instructions.",
      },
      {
        q: "Do I need sewing experience?",
        a: "No. Projects are rated by difficulty from Beginner to Expert. Many projects include no-sew options using iron-on adhesive or Velcro. The AI adjusts its instructions based on the complexity of the item.",
      },
      {
        q: "What photo should I upload?",
        a: "Any clear photo of the item works — a product photo, a photo of your pet wearing it, or even a store screenshot. Phone photos are fine. The clearer the photo, the better the AI can detect the materials and construction method.",
      },
    ],
  },
  {
    category: "Credits & Billing",
    items: [
      {
        q: "How do credits work?",
        a: "Each project generation uses 1 credit. Free accounts receive a starter credit to try the service. You can purchase additional credits or upgrade to an unlimited plan.",
      },
      {
        q: "What is the unlimited plan?",
        a: "Unlimited plans let you generate as many projects as you want for a flat monthly or annual fee. Check the Pricing page for current rates.",
      },
      {
        q: "Can I get a refund?",
        a: "Yes. If you are not satisfied with a generated project, contact us at info@diy1t.com within 7 days of purchase and we will review your request. See our full Return Policy for details.",
      },
      {
        q: "How do I cancel my subscription?",
        a: "Go to your Dashboard → Billing and click Manage Subscription. You can cancel at any time and your access continues until the end of the billing period.",
      },
    ],
  },
  {
    category: "Projects & Patterns",
    items: [
      {
        q: "Are the measurements accurate?",
        a: "The AI generates measurements based on standard pet sizing and what is visible in the photo. We always recommend measuring your pet and comparing against the size chart included in each project before cutting any fabric.",
      },
      {
        q: "Can I customize the project for my pet's measurements?",
        a: "Yes. Add your pet's profile (breed, weight, neck and chest measurements) in the Pets section of your dashboard. The AI will use those measurements to adjust the pattern.",
      },
      {
        q: "Can I download the pattern as a PDF?",
        a: "Yes. Every completed project includes a Download PDF button that generates a print-ready PDF with all pattern pieces, measurements, materials list, and step-by-step instructions.",
      },
      {
        q: "Can I share my finished project?",
        a: "Yes. Use the Publish to Community toggle on your project page to share it with other DIY1T makers. You can also browse the Community page to get inspired by other builders.",
      },
    ],
  },
  {
    category: "Technical",
    items: [
      {
        q: "What AI model powers DIY1T?",
        a: "DIY1T uses GPT-4o with vision, which can analyze images and generate detailed structured build plans. The model looks at the actual visual content of your photo — not the filename — to determine materials and construction method.",
      },
      {
        q: "Is my photo stored?",
        a: "Uploaded photos are stored securely on Cloudinary and linked to your account. We do not sell or share your images with third parties. See our Privacy Policy for full details.",
      },
      {
        q: "Is there a mobile app?",
        a: "A mobile app for iOS and Android is in development. In the meantime, DIY1T works great in any mobile browser.",
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left"
      >
        <span className="text-sm font-semibold text-slate-800">{q}</span>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <p className="pb-4 text-sm leading-relaxed text-slate-500">{a}</p>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <BackBar />
      <main className="min-h-screen bg-slate-50 py-20">
      <Container>
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center">
            <span className="inline-block rounded-full bg-brand-blue-100 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-brand-blue-600">
              FAQ
            </span>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Frequently Asked Questions
            </h1>
            <p className="mt-4 text-lg text-slate-500">
              Everything you need to know about DIY1T. Can&apos;t find your answer?{" "}
              <a href="/contact" className="text-brand-blue-600 hover:underline">
                Contact us
              </a>
              .
            </p>
          </div>

          {/* FAQ sections */}
          <div className="mt-12 space-y-8">
            {FAQS.map((section) => (
              <div key={section.category} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-xs font-bold uppercase tracking-widest text-brand-blue-500">
                  {section.category}
                </h2>
                {section.items.map((item) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} />
                ))}
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-10 rounded-2xl bg-brand-blue-50 p-6 text-center">
            <p className="font-semibold text-slate-800">Still have questions?</p>
            <p className="mt-1 text-sm text-slate-500">
              Email us at{" "}
              <a href="mailto:info@diy1t.com" className="text-brand-blue-600 hover:underline font-medium">
                info@diy1t.com
              </a>{" "}
              or call{" "}
              <a href="tel:+15035920808" className="text-brand-blue-600 hover:underline font-medium">
                (503) 592-0808
              </a>
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
