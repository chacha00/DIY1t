const BENEFITS = [
  {
    icon: "💰",
    title: "Save Money",
    desc: "See exactly how much you'll save before buying a single piece of fabric. Most members recoup their subscription on the first project.",
  },
  {
    icon: "⚡",
    title: "Save Time",
    desc: "Skip hours of searching YouTube and Pinterest. Upload a photo and get a complete build plan in under 60 seconds.",
  },
  {
    icon: "📏",
    title: "Perfect Fit",
    desc: "Every pattern scales to your pet's exact measurements. No guessing, no alterations — just the right fit the first time.",
  },
  {
    icon: "🏗️",
    title: "Build Better",
    desc: "Choose beginner-friendly, waterproof, eco-friendly, premium, or durable versions. AI adapts the plan to your skill and budget.",
  },
];

export function WhyDiy1tV2() {
  return (
    <section id="features" className="bg-slate-50 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue-600">Why DIY1T</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Built Around What You Actually Need
          </h2>
          <p className="mt-3 text-base text-slate-500">
            Not just features — outcomes that matter to you.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl bg-white p-6 shadow-sm hover:shadow-md transition-shadow border border-slate-100">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue-50 text-2xl">
                {b.icon}
              </div>
              <h3 className="font-bold text-slate-900">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
