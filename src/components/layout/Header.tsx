"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Hammer } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { LinkButton } from "@/components/ui/Button";

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Categories", href: "#categories" },
  { label: "Community", href: "/community" },
  { label: "Pricing", href: "/pricing" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      <div className="glass border-b border-slate-100/80">
        <Container className="flex h-18 items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl brand-gradient-bg shadow-soft">
              <Hammer className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              DIY1T<span className="text-brand-orange-500">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-blue-600"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <LinkButton href="/login" variant="ghost" size="sm">
              Log In
            </LinkButton>
            <LinkButton href="/register" variant="primary" size="sm">
              Start Free
            </LinkButton>
          </div>

          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-slate-700 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </Container>
      </div>

      {open && (
        <div className="glass border-b border-slate-100/80 md:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2 px-3">
              <LinkButton href="/login" variant="outline" size="sm" className="w-full">
                Log In
              </LinkButton>
              <LinkButton href="/register" variant="primary" size="sm" className="w-full">
                Start Free
              </LinkButton>
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
