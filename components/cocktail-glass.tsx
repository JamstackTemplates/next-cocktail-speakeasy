import type { CSSProperties } from 'react';
import type { Cocktail } from '../content/drinks';
import { drawGlass, type Shape } from '../lib/glassware';

function ShapeElement({ shape }: { shape: Shape }) {
  switch (shape.kind) {
    case 'path': return <path data-role={shape.role} d={shape.d} />;
    case 'circle': return <circle data-role={shape.role} cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case 'ellipse': return <ellipse data-role={shape.role} cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />;
  }
}

/**
 * A cocktail drawn in its own glass from content/drinks.ts: `glass` picks the shape, `color` fills the
 * drink (with `layered` as a float on top) and `garnish` adds the detail. The glass and garnish
 * colours are tokens in app/tailwind.input.css (`.glass-art`). Decorative: the name is always
 * written beside it.
 */
export function CocktailGlass({ cocktail, size = 120, className = '' }: {
  cocktail: Pick<Cocktail, 'id' | 'glass' | 'color' | 'layered' | 'garnish'>;
  /** Height in pixels. */
  size?: number;
  className?: string;
}) {
  const drawing = drawGlass(cocktail);
  const clip = `bowl-${cocktail.id}-${size}`;
  const style = { '--drink': cocktail.color, '--float': cocktail.layered ?? cocktail.color } as CSSProperties;
  return (
    <svg className={`glass-art ${className}`} viewBox={drawing.viewBox} width={(size * 3) / 4} height={size} style={style} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={clip}><path d={drawing.bowl} /></clipPath>
      </defs>
      <g clipPath={`url(#${clip})`}>
        <g className="glass-liquid">{drawing.liquid.map((shape, i) => <ShapeElement key={i} shape={shape} />)}</g>
      </g>
      <g>{drawing.glass.map((shape, i) => <ShapeElement key={i} shape={shape} />)}</g>
      <g>{drawing.garnish.map((shape, i) => <ShapeElement key={i} shape={shape} />)}</g>
    </svg>
  );
}
