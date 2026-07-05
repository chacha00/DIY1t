import Link from "next/link";
import { Hammer } from "lucide-react";
import { Container } from "@/components/ui/Container";

const COLUMNS = [
  {
    title: "Product",
    links: [
      { label: "How It Works", href: "#how-it-works" },
      { label: "Categories", href: "#categories" },
      { label: "Pricing", href: "/pricing" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Return Policy", href: "/returns" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <Container className="py-16">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl brand-gradient-bg">
                <Hammer className="h-4.5 w-4.5 text-white" strokeWidth={2.5} />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-slate-900">
                DIY1T
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              See It. Build It. Make It Yourself.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-brand-blue-600"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} DIY1T.com. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Made for makers, builders, and the AI-curious.
          </p>
        </div>
      </Container>
    </footer>
  );
}
