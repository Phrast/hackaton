import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export function GlassCard({ children, className, glow }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass-card p-6 transition-all duration-300 hover:border-border",
        glow && "glow-pulse",
        className
      )}
    >
      {children}
    </div>
  );
}
