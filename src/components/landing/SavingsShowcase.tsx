const ITEMS = [
  { name: "Dog Harness", emoji: "🦺", retail: 65, diy: 14 },
  { name: "Dog Bed", emoji: "🛏️", retail: 95, diy: 28 },
  { name: "Pet Sweater", emoji: "🧥", retail: 42, diy: 12 },
  { name: "Leash & Collar", emoji: "🪢", retail: 38, diy: 8 },
  { name: "Pet Carrier", emoji: "👜", retail: 110, diy: 32 },
  { name: "Bandana Set", emoji: "🎀", retail: 24, diy: 4 },
];

export function SavingsShowcase() {
  return (
    <section id="examples" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-brand-teal-600">Real Savings</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Save Thousands Every Year
          </h2>
          <p className="mt-3 text-base text-slate-500">
            See how much members save on common pet products.
          </p>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((item) => {
            const saved = item.retail - item.diy;
            const pct = Math.round((saved / item.retail) * 100);
            return (
              <div key={item.name} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{item.emoji}</span>
                  <p className="font-bold text-slate-900">{item.name}</p>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl bg-red-50 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-red-400">Retail</p>
                    <p className="mt-0.5 text-lg font-extrabold text-red-500 line-through">${item.retail}</p>
                  </div>
                  <div className="rounded-xl bg-brand-teal-50 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal-600">DIY</p>
                    <p className="mt-0.5 text-lg font-extrabold text-brand-teal-600">${item.diy}</p>
                  </div>
                  <div className="rounded-xl bg-brand-blue-600 p-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-white/80">Saved</p>
                    <p className="mt-0.5 text-lg font-extrabold text-white">${saved}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>You save</span>
                  <span className="font-bold text-brand-blue-600 text-sm">{pct}% off retail</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-brand-teal-400 to-brand-blue-500" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-gradient-to-r from-brand-blue-600 to-brand-teal-500 p-8 text-center text-white shadow-xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-white/70">Average DIY1T member saves</p>
          <p className="mt-2 text-6xl font-extrabold tracking-tight">$436</p>
          <p className="text-xl font-semibold text-white/80">per year</p>
          <p className="mt-3 text-sm text-white/60">Based on 3 projects/month at average $12 savings each</p>
        </div>
      </div>
    </section>
  );
}
