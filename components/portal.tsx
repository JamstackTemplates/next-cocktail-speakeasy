import type { ReactNode } from 'react';

// The hero: a stepped, arched deco doorway drawn in gold line around the lounge's name.
// It's built from three SVGs so it scales cleanly at any width: the arch (fixed proportions),
// the sides (stretch to the content's height) and the stepped threshold. Every gold line has
// pathLength="1" so CSS can draw it in once on load (`.portal-line`); under reduced motion it's
// simply drawn. The sunburst inside the arch shimmers slowly and glows after dark.

const CX = 300;
const SPRING = 300;

/** Sunburst rays fanning up from the centre of the arch. */
function rays(): string {
  const parts: string[] = [];
  for (let i = 1; i < 24; i++) {
    const angle = Math.PI + (i * Math.PI) / 24;
    const long = i % 2 === 0;
    const [r1, r2] = [78, long ? 236 : 196];
    const point = (r: number) => `${(CX + Math.cos(angle) * r).toFixed(1)} ${(SPRING + Math.sin(angle) * r).toFixed(1)}`;
    parts.push(`M${point(r1)} L${point(r2)}`);
  }
  return parts.join(' ');
}

function Line({ d, width = 1.5, className = '' }: { d: string; width?: number; className?: string }) {
  return <path className={`portal-line ${className}`} d={d} pathLength={1} strokeWidth={width} />;
}

export function Portal({ children }: { children: ReactNode }) {
  return (
    <div className="portal">
      <svg className="portal-arch" viewBox="0 0 600 330" aria-hidden="true" fill="none">
        <g className="portal-sunburst">
          <path d={rays()} strokeWidth="1" />
          <path d={`M${CX - 56} ${SPRING} A56 56 0 0 1 ${CX + 56} ${SPRING}`} strokeWidth="1" />
          <path d={`M${CX - 66} ${SPRING} A66 66 0 0 1 ${CX + 66} ${SPRING}`} strokeWidth=".6" />
        </g>
        {/* Outer double frame and the stepped inner arch */}
        <Line d="M2 330 V300 A298 298 0 0 1 598 300 V330" width={1.6} />
        <Line d="M16 330 V300 A284 284 0 0 1 584 300 V330" width={0.8} />
        <Line d="M36 330 V314 H46 V300 A254 254 0 0 1 554 300 V314 H564 V330" width={1.3} />
        {/* Keystone */}
        <Line d="M300 0 L314 18 L300 36 L286 18 Z" width={1.2} className="portal-keystone" />
        <Line d="M300 36 V46" width={1} />
      </svg>
      <svg className="portal-sides" viewBox="0 0 600 100" preserveAspectRatio="none" aria-hidden="true" fill="none">
        <Line d="M2 0 V100 M598 0 V100" width={1.6} />
        <Line d="M16 0 V100 M584 0 V100" width={0.8} />
        <Line d="M36 0 V100 M564 0 V100" width={1.3} />
      </svg>
      <svg className="portal-base" viewBox="0 0 600 50" aria-hidden="true" fill="none">
        <Line d="M36 0 V12 H564 V0" width={1.3} />
        <Line d="M16 0 V28 H584 V0" width={0.8} />
        <Line d="M2 0 V44 H598 V0" width={1.6} />
        <path className="portal-gem" d="M300 18 L305 23 L300 28 L295 23 Z" />
      </svg>
      <div className="portal-content">{children}</div>
    </div>
  );
}
