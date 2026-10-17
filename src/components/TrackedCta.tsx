"use client";
import { CTAButton } from "@/components/ui";
import { track, type AnalyticsEvent } from "@/lib/analytics";

export function TrackedCTA({ href, event, variant, className, children }: {
  href: string;
  event: AnalyticsEvent;
  variant?: "primary" | "ghost" | "dark" | "gold";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <CTAButton href={href} variant={variant} className={className} onClick={() => track(event)}>
      {children}
    </CTAButton>
  );
}
