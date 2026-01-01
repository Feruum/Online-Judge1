import { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  topFade?: boolean;
  bottomFade?: boolean;
  glow?: boolean;
  glowClassName?: string;
}

export default function Section({
  children,
  className = "",
  containerClassName = "",
  topFade = true,
  bottomFade = true,
  glow = true,
  glowClassName = "left-1/2 top-16 h-72 w-72 -translate-x-1/2 bg-[#46ec13]/15 blur-[140px]",
}: SectionProps) {
  return (
    <section className={`relative bg-[#142210] ${className}`}>
      {/* background effects (always behind) */}
      {glow && (
        <div
          className={`pointer-events-none absolute ${glowClassName} z-0 rounded-full`}
          aria-hidden="true"
        />
      )}

      {topFade && (
        <div
          className="pointer-events-none absolute top-0 left-0 z-0 h-24 w-full bg-gradient-to-b from-[#142210] to-transparent"
          aria-hidden="true"
        />
      )}

      {bottomFade && (
        <div
          className="pointer-events-none absolute bottom-0 left-0 z-0 h-24 w-full bg-gradient-to-t from-[#142210] to-transparent"
          aria-hidden="true"
        />
      )}

      {/* content (always above) */}
      <div className={`relative z-10 mx-auto max-w-5xl px-4 ${containerClassName}`}>
        {children}
      </div>
    </section>
  );
}







