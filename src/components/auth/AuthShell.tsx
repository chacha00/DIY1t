import Link from "next/link";
import { Hammer } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-blue-100 opacity-60 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-orange-100 opacity-60 blur-3xl" />
      </div>

      <Container className="flex justify-center">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl brand-gradient-bg shadow-soft">
              <Hammer className="h-5 w-5 text-white" strokeWidth={2.5} />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              DIY1T<span className="text-brand-orange-500">.</span>
            </span>
          </Link>

          <div className="glass rounded-3xl p-8 shadow-soft-lg">
            <h1 className="text-center text-2xl font-extrabold tracking-tight text-slate-900">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-2 text-center text-sm text-slate-500">{subtitle}</p>
            )}

            <div className="mt-7">{children}</div>
          </div>

          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
        </div>
      </Container>
    </main>
  );
}
