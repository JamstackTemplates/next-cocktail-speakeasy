import type { ReactNode } from 'react';
import type { DoorArt } from '../content/lounge';

// Art-deco line ornaments, drawn in currentColor (usually the gold token) so they follow the theme.

type ArtProps = { className?: string; width?: number; height?: number };

/** A small sunburst fan, set above centred headings. */
export function Fan({ className = '', width = 64 }: ArtProps) {
  const rays = Array.from({ length: 13 }, (_, i) => {
    const angle = Math.PI + (i * Math.PI) / 12;
    const long = i % 2 === 0;
    const [r1, r2] = [11, long ? 30 : 23];
    return `M${(32 + Math.cos(angle) * r1).toFixed(1)} ${(32 + Math.sin(angle) * r1).toFixed(1)} L${(32 + Math.cos(angle) * r2).toFixed(1)} ${(32 + Math.sin(angle) * r2).toFixed(1)}`;
  }).join(' ');
  return (
    <svg className={`fan ${className}`} viewBox="0 0 64 34" width={width} height={(width * 34) / 64} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round">
      <path d={rays} />
      <path d="M24 32 A8 8 0 0 1 40 32" />
      <path d="M2 32.5 H62" strokeWidth="1" />
    </svg>
  );
}

/** A section break: fine rules either side of mirrored chevrons and a diamond. */
export function ChevronRule({ className = '' }: { className?: string }) {
  return (
    <div className={`chevron-rule ${className}`} aria-hidden="true">
      <svg viewBox="0 0 96 16" width="96" height="16" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round">
        <path d="M18 3 L24 8 L18 13 M26 3 L32 8 L26 13 M78 3 L72 8 L78 13 M70 3 L64 8 L70 13" />
        <path d="M48 1.5 L54.5 8 L48 14.5 L41.5 8 Z" fill="currentColor" stroke="none" />
        <path d="M0 8 H14 M82 8 H96" />
      </svg>
    </div>
  );
}

/** The header monogram: letters inside a stepped diamond. */
export function Monogram({ letters, className = '' }: { letters: string; className?: string }) {
  return (
    <svg className={`monogram ${className}`} viewBox="0 0 56 56" aria-hidden="true" fill="none" stroke="currentColor">
      <path d="M28 1.5 L54.5 28 L28 54.5 L1.5 28 Z" strokeWidth="1.3" />
      <path d="M28 6 L50 28 L28 50 L6 28 Z" strokeWidth=".8" />
      <path d="M28 1.5 V6 M54.5 28 H50 M28 54.5 V50 M1.5 28 H6" strokeWidth="1" />
      <text x="28" y="29" textAnchor="middle" dominantBaseline="central" className="monogram-letters" fill="currentColor" stroke="none">{letters}</text>
    </svg>
  );
}

/** Line drawings for the find-the-door steps. */
export function DoorStepArt({ art, className = '' }: { art: DoorArt; className?: string }) {
  return (
    <svg className={`door-art ${className}`} viewBox="0 0 64 64" width="64" height="64" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {DOOR_DRAWINGS[art]}
    </svg>
  );
}

const DOOR_DRAWINGS: Record<DoorArt, ReactNode> = {
  // A square's skyline: three spires over a railing.
  square: (
    <>
      <path d="M8 54 H56" />
      <path d="M20 54 V30 L24 24 L28 30 V54 M36 54 V30 L40 24 L44 30 V54" />
      <path d="M28 54 V22 L32 8 L36 22 V54" />
      <path d="M30.5 32 A1.5 1.5 0 0 1 33.5 32 V38 H30.5 Z" />
      <path d="M8 46 H20 M44 46 H56 M11 46 V54 M14 46 V54 M17 46 V54 M47 46 V54 M50 46 V54 M53 46 V54" strokeWidth="1" />
    </>
  ),
  // A gas lamp with a soft glow.
  lamp: (
    <>
      <path d="M32 58 V30 M27 58 H37" />
      <path d="M25 30 H39 L36 16 H28 Z" />
      <path d="M28 16 L32 11 L36 16 M32 11 V8" />
      <path d="M32 21 V25" strokeWidth="2.2" />
      <path d="M18 18 L13 15 M46 18 L51 15 M17 25 H11 M47 25 H53" strokeWidth="1" />
    </>
  ),
  // A small brass key.
  key: (
    <>
      <circle cx="20" cy="32" r="9" />
      <path d="M20 27.5 L23.5 32 L20 36.5 L16.5 32 Z" strokeWidth="1" />
      <path d="M29 32 H54 M46 32 V39 M51 32 V37" />
    </>
  ),
  // The green door, arched, with a key above it.
  door: (
    <>
      <path d="M18 58 V26 A14 14 0 0 1 46 26 V58" />
      <path d="M22 58 V27 A10 10 0 0 1 42 27 V58" strokeWidth="1" />
      <path d="M22 42 H42 M32 17 V58" strokeWidth="1" />
      <circle cx="38" cy="45" r="1.4" fill="currentColor" />
      <path d="M12 58 H52" />
      <path d="M29 6 A2.5 2.5 0 1 0 29 11 A2.5 2.5 0 1 0 29 6 M31.5 8.5 H38 M36 8.5 V10.5" strokeWidth="1" />
    </>
  ),
  // A brass bell push.
  bell: (
    <>
      <rect x="22" y="16" width="20" height="32" rx="2" />
      <circle cx="32" cy="32" r="5" />
      <circle cx="32" cy="32" r="1.6" fill="currentColor" />
      <path d="M48 24 A10 10 0 0 1 48 40 M53 20 A16 16 0 0 1 53 44 M16 24 A10 10 0 0 0 16 40 M11 20 A16 16 0 0 0 11 44" strokeWidth="1" />
    </>
  ),
};

/** A plume fan for music nights. */
export function Plume({ className = '', width = 34 }: ArtProps) {
  return (
    <svg className={className} viewBox="0 0 40 40" width={width} height={width} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d="M20 38 C20 26 14 14 6 6 M20 38 C20 24 20 12 20 3 M20 38 C20 26 26 14 34 6" />
      <path d="M11 13 L14 11 M9 9 L12 8 M15 20 L17 17 M17 10 L20 8 L23 10 M17 17 L20 15 L23 17 M29 13 L26 11 M31 9 L28 8 M25 20 L23 17" strokeWidth=".9" />
      <path d="M16 38 H24" />
    </svg>
  );
}

/** A small filled diamond, used between prices and as list bullets. */
export function Diamond({ className = '' }: { className?: string }) {
  return (
    <svg className={`diamond ${className}`} viewBox="0 0 10 10" width="7" height="7" aria-hidden="true">
      <path d="M5 0 L10 5 L5 10 L0 5 Z" fill="currentColor" />
    </svg>
  );
}
