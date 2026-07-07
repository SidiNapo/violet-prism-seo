/**
 * Crystalline "S" monogram built from CSS 3D-projected cube outlines.
 * Kept SVG so it's crisp at every size.
 */
export function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={className}
      role="img"
      aria-label="E-SeoMax logo"
    >
      <defs>
        <linearGradient id="lg-eseomax" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="hsl(275 100% 82%)" />
          <stop offset="50%" stopColor="hsl(265 85% 58%)" />
          <stop offset="100%" stopColor="hsl(250 90% 60%)" />
        </linearGradient>
        <filter id="glow-eseomax" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g fill="none" stroke="url(#lg-eseomax)" strokeWidth="1.6" filter="url(#glow-eseomax)" strokeLinejoin="round">
        {/* Top cube */}
        <path d="M12 12 L22 8 L32 12 L22 16 Z" />
        <path d="M12 12 L12 20 L22 24 L22 16 Z" />
        <path d="M32 12 L32 20 L22 24 L22 16 Z" />
        {/* Middle bar (S curve) */}
        <path d="M14 22 L34 20 L34 28 L14 30 Z" />
        {/* Bottom cube */}
        <path d="M16 32 L26 28 L36 32 L26 36 Z" />
        <path d="M16 32 L16 40 L26 44 L26 36 Z" />
        <path d="M36 32 L36 40 L26 44 L26 36 Z" />
      </g>
    </svg>
  );
}
