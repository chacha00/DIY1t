const AUDIENCES = [
  { icon: "🐾", label: "Pet Owners" },
  { icon: "🪡", label: "Makers" },
  { icon: "🏠", label: "Shelters" },
  { icon: "🐕", label: "Breeders" },
  { icon: "🛍️", label: "Small Businesses" },
];

export function TrustedBy() {
  return (
    <section className="border-y border-slate-100 bg-slate-50 py-8">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Trusted by</p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {AUDIENCES.map((a) => (
            <div key={a.label} className="flex items-center gap-2 text-slate-500">
              <span className="text-xl">{a.icon}</span>
              <span className="text-sm font-semibold">{a.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
