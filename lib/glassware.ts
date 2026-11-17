// Glass and garnish drawings for the cocktail card, as plain shape data.
// components/cocktail-glass.tsx turns a drawing into inline SVG coloured by CSS tokens; keeping the
// geometry here means every glass and garnish can be unit tested without a browser.
// All drawings share a 120 × 160 viewBox with the foot of the glass at the bottom.
import { GARNISHES, GLASSES, type Garnish, type Glass } from '../content/drinks.ts';

/** What a shape is, which decides its colour and stroke (see `.glass-art` in app/tailwind.input.css). */
export type Role =
  | 'glass' | 'glass-thin' | 'shine' | 'frost' | 'steam' | 'bubble'
  | 'liquid' | 'layer' | 'foam' | 'ice' | 'speck'
  | 'peel' | 'pith' | 'fruit' | 'cherry' | 'olive' | 'pimento' | 'leaf' | 'pick' | 'salt';

export type Shape =
  | { kind: 'path'; role: Role; d: string }
  | { kind: 'circle'; role: Role; cx: number; cy: number; r: number }
  | { kind: 'ellipse'; role: Role; cx: number; cy: number; rx: number; ry: number };

export interface Drawing {
  viewBox: string;
  /** Interior of the glass: the liquid is clipped to this path. */
  bowl: string;
  /** Drawn inside the bowl clip: the drink, any float or foam, bubbles and specks. */
  liquid: Shape[];
  /** The glass itself, drawn over the liquid. */
  glass: Shape[];
  /** The garnish, drawn last. */
  garnish: Shape[];
}

export interface GlassSpec {
  glass: Glass;
  /** Hex colour of the drink, e.g. "#9cc98a". */
  color: string;
  /** Optional hex colour of a float or split layer on top. */
  layered?: string;
  garnish?: Garnish;
}

interface Geometry {
  /** Interior outline (closed). */
  bowl: string;
  /** Outline strokes of the glass. */
  outline: Shape[];
  /** The rim: y and its left and right edges. */
  rim: { y: number; left: number; right: number };
  /** Liquid surface and the bottom of the drink. */
  surface: number;
  bottom: number;
  /** Opaque cups show crushed ice instead of the drink's side view. */
  opaque?: boolean;
}

const path = (role: Role, d: string): Shape => ({ kind: 'path', role, d });
const circle = (role: Role, cx: number, cy: number, r: number): Shape => ({ kind: 'circle', role, cx, cy, r });
const ellipse = (role: Role, cx: number, cy: number, rx: number, ry: number): Shape => ({ kind: 'ellipse', role, cx, cy, rx, ry });

/** A stem and a round foot under a stemmed glass. */
function stem(from: number, footWidth: number): Shape[] {
  return [
    path('glass', `M60 ${from} V143`),
    path('glass', `M${60 - footWidth} 147 Q60 140 ${60 + footWidth} 147 Z`),
  ];
}

/** Straight-sided tumbler from rim to a thick base. */
function tumbler(top: number, left: number, right: number, baseLeft: number, baseRight: number, base = 146): Geometry {
  const inner = base - 9;
  const lerp = (a: number, b: number) => a + (b - a) * ((inner - top) / (base - top));
  return {
    bowl: `M${left + 1} ${top} L${lerp(left, baseLeft) + 1} ${inner} H${lerp(right, baseRight) - 1} L${right - 1} ${top} Z`,
    outline: [
      path('glass', `M${left} ${top} L${baseLeft} ${base} H${baseRight} L${right} ${top}`),
      path('glass-thin', `M${lerp(left, baseLeft) + 1} ${inner} H${lerp(right, baseRight) - 1}`),
    ],
    rim: { y: top, left, right },
    surface: top + 13,
    bottom: inner,
  };
}

const GEOMETRY: Record<Glass, Geometry> = {
  coupe: {
    bowl: 'M18 46 C20 72 38 80 60 80 C82 80 100 72 102 46 Z',
    outline: [path('glass', 'M18 46 C20 72 38 80 60 80 C82 80 100 72 102 46'), path('glass-thin', 'M18 46 H102'), ...stem(80, 22)],
    rim: { y: 46, left: 18, right: 102 },
    surface: 52,
    bottom: 80,
  },
  'nick-and-nora': {
    bowl: 'M34 38 C34 66 44 84 60 84 C76 84 86 66 86 38 Z',
    outline: [path('glass', 'M34 38 C34 66 44 84 60 84 C76 84 86 66 86 38'), path('glass-thin', 'M34 38 H86'), ...stem(84, 19)],
    rim: { y: 38, left: 34, right: 86 },
    surface: 47,
    bottom: 84,
  },
  martini: {
    bowl: 'M16 40 L60 86 L104 40 Z',
    outline: [path('glass', 'M16 40 L60 86 L104 40'), path('glass-thin', 'M16 40 H104'), ...stem(86, 23)],
    rim: { y: 40, left: 16, right: 104 },
    surface: 48,
    bottom: 86,
  },
  rocks: tumbler(70, 26, 94, 30, 90),
  highball: tumbler(36, 34, 86, 37, 83),
  collins: tumbler(22, 38, 82, 40, 80),
  flute: {
    bowl: 'M46 18 C45 56 49 86 60 90 C71 86 75 56 74 18 Z',
    outline: [path('glass', 'M46 18 C45 56 49 86 60 90 C71 86 75 56 74 18'), path('glass-thin', 'M46 18 H74'), ...stem(90, 18)],
    rim: { y: 18, left: 46, right: 74 },
    surface: 28,
    bottom: 90,
  },
  julep: {
    // The cup is silver, so the drink shows as a mound of tinted crushed ice above the rim.
    bowl: 'M30 57 C32 38 46 30 58 35 C70 28 88 36 90 57 Z',
    outline: [
      path('glass', 'M32 56 L36 140 Q60 147 84 140 L88 56 Z'),
      path('glass-thin', 'M33 64 H87'),
      path('glass-thin', 'M35.6 132 Q60 138 84.4 132'),
    ],
    rim: { y: 56, left: 32, right: 88 },
    surface: 36,
    bottom: 57,
    opaque: true,
  },
  mug: {
    bowl: 'M31 48 L33.6 136 H76.4 L79 48 Z',
    outline: [
      path('glass', 'M30 48 L33 145 H77 L80 48'),
      path('glass-thin', 'M33.6 136 H76.4'),
      path('glass', 'M79.5 64 C99 63 101 110 78.2 113'),
      path('glass-thin', 'M79.2 73 C91 73 92 103 78.5 104'),
    ],
    rim: { y: 48, left: 30, right: 80 },
    surface: 60,
    bottom: 136,
  },
};

const HEX = /^#[0-9a-f]{6}$/i;

function garnishShapes(garnish: Garnish, g: Geometry): Shape[] {
  const { rim, surface } = g;
  const r = rim.right;
  const top = rim.y;
  const mid = (rim.left + rim.right) / 2;
  switch (garnish) {
    case 'twist':
      // A long spiral of peel hooked over the rim.
      return [path('peel', `M${r - 9} ${top + 5} C${r - 6} ${top - 9} ${r + 9} ${top - 9} ${r + 8} ${top + 3} C${r + 7} ${top + 13} ${r - 1} ${top + 12} ${r + 2} ${top + 21} C${r + 4} ${top + 27} ${r + 9} ${top + 27} ${r + 9} ${top + 32}`)];
    case 'wheel': {
      // A citrus wheel cut onto the rim.
      const cx = r - 3, cy = top - 7, size = 11;
      const spokes = [0, 60, 120].map(angle => {
        const rad = (angle * Math.PI) / 180;
        const dx = Math.cos(rad) * (size - 3), dy = Math.sin(rad) * (size - 3);
        return `M${round(cx - dx)} ${round(cy - dy)} L${round(cx + dx)} ${round(cy + dy)}`;
      }).join(' ');
      return [circle('fruit', cx, cy, size), circle('pith', cx, cy, size - 2.5), path('pith', spokes)];
    }
    case 'cherry': {
      // A dark cherry on a pick resting across the glass.
      const cx = mid + 4, cy = Math.min(surface + 10, g.bottom - 8);
      return [path('pick', `M${r + 8} ${top - 18} L${cx - 2} ${cy + 2}`), circle('cherry', cx, cy, 6.5), path('glass-thin', `M${cx + 1} ${cy - 6} C${cx + 3} ${cy - 14} ${cx + 9} ${cy - 18} ${cx + 13} ${cy - 20}`)];
    }
    case 'olive': {
      // Two olives on a pick.
      const x1 = mid + 2, y1 = Math.min(surface + 12, g.bottom - 10);
      return [
        path('pick', `M${r + 6} ${top - 20} L${x1 - 8} ${y1 + 8}`),
        ellipse('olive', x1, y1, 6, 5), circle('pimento', x1 - 1, y1, 1.8),
        ellipse('olive', x1 + 9, y1 - 11, 6, 5), circle('pimento', x1 + 8, y1 - 11, 1.8),
      ];
    }
    case 'mint': {
      // A sprig of mint above the rim.
      const x = g.opaque ? mid + 8 : r - 12, y = g.opaque ? surface - 2 : top;
      return [
        path('glass-thin', `M${x} ${y + 6} C${x + 1} ${y - 6} ${x + 3} ${y - 14} ${x + 2} ${y - 22}`),
        path('leaf', `M${x + 1} ${y - 4} C${x - 10} ${y - 4} ${x - 14} ${y - 12} ${x - 13} ${y - 16} C${x - 6} ${y - 16} ${x} ${y - 10} ${x + 1} ${y - 4} Z`),
        path('leaf', `M${x + 2} ${y - 8} C${x + 12} ${y - 9} ${x + 16} ${y - 17} ${x + 15} ${y - 21} C${x + 8} ${y - 20} ${x + 2} ${y - 15} ${x + 2} ${y - 8} Z`),
        path('leaf', `M${x + 2} ${y - 18} C${x - 4} ${y - 22} ${x - 4} ${y - 30} ${x + 1} ${y - 33} C${x + 6} ${y - 30} ${x + 6} ${y - 22} ${x + 2} ${y - 18} Z`),
      ];
    }
    case 'nutmeg':
      // Freshly grated nutmeg on the surface.
      return [-14, -7, -1, 5, 11, 16].map((dx, i) => circle('speck', round(mid + dx), surface + 1 + (i % 2 ? 1.6 : 0), 1.2));
    case 'foam':
      // Foam is drawn with the liquid (it sits inside the glass); a few drops of bitters on top.
      return [circle('cherry', mid - 6, surface - 1, 1.6), circle('cherry', mid + 2, surface - 1.5, 1.4), circle('cherry', mid + 9, surface - 0.8, 1.2)];
    case 'salt-rim':
      return [path('salt', `M${rim.left} ${top} H${rim.right}`)];
  }
}

function round(value: number): number {
  return Math.round(value * 10) / 10;
}

/**
 * The drawing for one drink. Throws a clear error for an unknown glass or garnish, or a colour
 * that isn't a hex value, so content mistakes fail the tests rather than drawing nothing.
 */
export function drawGlass(spec: GlassSpec): Drawing {
  const g = GEOMETRY[spec.glass];
  if (!g || !GLASSES.includes(spec.glass)) {
    throw new Error(`Unknown glass "${spec.glass}". Use one of: ${GLASSES.join(', ')}.`);
  }
  if (spec.garnish !== undefined && !GARNISHES.includes(spec.garnish)) {
    throw new Error(`Unknown garnish "${spec.garnish}". Use one of: ${GARNISHES.join(', ')}, or leave it out.`);
  }
  for (const [field, value] of [['color', spec.color], ['layered', spec.layered]] as const) {
    if (value !== undefined && !HEX.test(value)) throw new Error(`The drink's ${field} "${value}" must be a hex colour like #9cc98a.`);
  }

  const depth = g.bottom - g.surface;
  const liquid: Shape[] = [path('liquid', `M0 ${g.surface} H120 V160 H0 Z`)];
  if (spec.layered) {
    // A float: the top third of the drink in the second colour.
    const line = g.opaque ? g.surface + depth * 0.45 : g.surface + Math.max(6, depth * 0.32);
    liquid.push(path('layer', `M0 ${g.surface - (g.opaque ? 30 : 0)} H120 V${round(line)} H0 Z`));
  }
  if (spec.garnish === 'foam') liquid.push(path('foam', `M0 ${g.surface - 2} H120 V${g.surface + Math.min(9, depth * 0.3)} H0 Z`));
  if (g.opaque) {
    // Crushed ice: a few facets on the mound.
    liquid.push(path('ice', 'M40 50 l6 -6 l5 5 M54 44 l5 -5 l6 4 M66 50 l5 -6 l6 5 M47 38 l4 -4 l4 4 M72 40 l4 -3'));
  }
  if (spec.glass === 'flute' || spec.glass === 'highball' || spec.glass === 'collins') {
    // A thin line of rising bubbles.
    const x = (g.rim.left + g.rim.right) / 2 + 4;
    for (let i = 0; i < 4; i++) liquid.push(circle('bubble', x + (i % 2 ? -2 : 1), round(g.bottom - 10 - i * (depth / 5)), 1.3));
  }

  const glass: Shape[] = [...g.outline];
  // A highlight down the left side of the glass.
  if (!g.opaque) glass.push(path('shine', `M${g.rim.left + 7} ${g.rim.y + 8} Q${g.rim.left + 6} ${round(g.rim.y + (g.bottom - g.rim.y) * 0.4)} ${g.rim.left + 10} ${round(g.rim.y + (g.bottom - g.rim.y) * 0.6)}`));
  if (g.opaque) {
    // Frost on the silver cup.
    glass.push(path('frost', 'M42 74 V126 M50 72 V130 M60 70 V132 M70 72 V130 M78 74 V126'));
  }
  if (spec.glass === 'mug') glass.push(path('steam', 'M48 40 C44 32 52 28 48 18 M60 38 C56 30 64 26 60 14 M72 40 C68 32 76 28 72 18'));

  return {
    viewBox: '0 0 120 160',
    bowl: g.bowl,
    liquid,
    glass,
    garnish: spec.garnish ? garnishShapes(spec.garnish, g) : [],
  };
}
