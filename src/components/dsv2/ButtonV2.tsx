import Link from "next/link";
import type { ReactNode } from "react";

interface Props {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "amber";
  children: ReactNode;
  className?: string;
  type?: "button" | "submit";
}

export function ButtonV2({ href, onClick, variant = "primary", children, className = "", type = "button" }: Props) {
  const base = variant === "primary" ? "ds-btn-primary" : variant === "amber" ? "ds-btn-primary ds-gradient-amber" : "ds-btn-secondary";
  const cls = `${base} ${className}`;
  if (href) return <Link href={href} className={cls}>{children}</Link>;
  return <button type={type} onClick={onClick} className={cls}>{children}</button>;
}
