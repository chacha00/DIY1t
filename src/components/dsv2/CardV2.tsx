import type { ReactNode } from "react";

export function CardV2({ children, className = "", hover = true }: { children: ReactNode; className?: string; hover?: boolean }) {
  return (
    <div className={`ds-card ${hover ? "" : "!transform-none"} ${className}`}>
      {children}
    </div>
  );
}
