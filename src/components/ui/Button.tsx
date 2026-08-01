import Link from "next/link";
import { cn } from "@/lib/cn";

type ButtonBaseProps = {
  variant?: "primary" | "secondary" | "ghost" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
};

const variantClasses: Record<NonNullable<ButtonBaseProps["variant"]>, string> = {
  primary:
    "bg-brand-blue-500 text-white hover:bg-brand-blue-600 hover:-translate-y-0.5 shadow-[0_8px_24px_rgba(16,185,129,0.28)] hover:shadow-[0_12px_32px_rgba(16,185,129,0.35)]",
  secondary:
    "bg-brand-orange-500 text-white hover:bg-brand-orange-600 hover:-translate-y-0.5 shadow-soft hover:shadow-soft-lg",
  outline:
    "border-[1.5px] border-slate-200 bg-white text-slate-700 hover:border-brand-blue-400 hover:text-brand-blue-600 hover:-translate-y-0.5 shadow-soft hover:shadow-soft-lg",
  ghost: "text-slate-600 hover:bg-slate-100",
};

const sizeClasses: Record<NonNullable<ButtonBaseProps["size"]>, string> = {
  sm: "h-9 px-4 text-sm rounded-[12px]",
  md: "h-[52px] px-7 text-[0.9375rem] rounded-[16px]",
  lg: "h-14 px-9 text-base rounded-[16px]",
};

const base =
  "inline-flex items-center justify-center gap-2 font-bold transition-all duration-200 active:translate-y-0 cursor-pointer disabled:opacity-50 disabled:pointer-events-none";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: ButtonBaseProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...rest}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonBaseProps & { href: string }) {
  return (
    <Link
      href={href}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
    >
      {children}
    </Link>
  );
}
