const CAPABILITIES = [
  "Construction & seam patterns",
  "Materials & fabric types",
  "Stitching techniques",
  "Exact dimensions",
  "Hardware & closures",
  "Difficulty level",
  "Full cost breakdown",
  "Printable pattern layout",
];

export function DiyVisionSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* Left */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-brand-blue-600">AI Technology</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Meet DIY Vision™
            </h2>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              DIY Vision is our specialized computer vision model trained exclusively on pet accessories, fabric construction, and sewing patterns. It doesn't just see a photo — it understands how the product was made.
            </p>
            <ul className="mt-6 space-y-2.5">
              {CAPABILITIES.map((c) => (
                <li key={c} className="flex items-center gap-2.5 text-sm text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-blue-100 text-[10px] font-bold text-brand-blue-600">✓</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Right — visual */}
          <div className="relative">
            <div className="rounded-3xl bg-gradient-to-br from-brand-blue-600 to-brand-teal-500 p-8 text-white shadow-2xl">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <span className="text-xl">👁️</span>
                </div>
                <div>
                  <p className="font-bold">DIY Vision™</p>
                  <p className="text-xs text-white/70">Analyzing photo...</p>
                </div>
                <div className="ml-auto flex gap-1">
                  {[0,1,2].map(i => (
                    <span key={i} className="h-2 w-2 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>

              <div className="space-y-2.5">
                {[
                  { label: "Material detected", value: "Fleece + nylon webbing", done: true },
                  { label: "Seam type", value: "French seam, 3/8\"", done: true },
                  { label: "Hardware", value: "2× D-rings, 1× buckle", done: true },
                  { label: "Difficulty", value: "Beginner — 4 pieces", done: true },
                  { label: "Estimated retail", value: "$65", done: true },
                  { label: "Your DIY cost", value: "$14", done: true, highlight: true },
                ].map((row) => (
                  <div key={row.label} className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm ${row.highlight ? "bg-yellow-400/20 border border-yellow-300/30" : "bg-white/10"}`}>
                    <span className="text-white/70">{row.label}</span>
                    <span className={`font-semibold ${row.highlight ? "text-yellow-300" : "text-white"}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-4 -right-4 rounded-2xl bg-white px-4 py-3 shadow-xl border border-slate-100 text-center">
              <p className="text-xs text-slate-500">You save</p>
              <p className="text-2xl font-extrabold text-brand-teal-600">79%</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
