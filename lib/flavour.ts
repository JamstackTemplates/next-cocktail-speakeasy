// The flavour map: four corners from each cocktail's `profile`, and where its marker sits.
// Pure data, unit tested; components/flavour-map.tsx draws it and filters the menu.
import type { Cocktail } from '../content/drinks.ts';

/** The four corners of the map. */
export type Quadrant = 'bright-light' | 'rich-light' | 'bright-strong' | 'rich-strong';

export const QUADRANTS: readonly { id: Quadrant; title: string; hint: string }[] = [
  { id: 'bright-strong', title: 'Crisp & spirited', hint: 'Sours and stirred, dry drinks' },
  { id: 'rich-strong', title: 'Rich & spirit-forward', hint: 'Slow sippers, stirred and bitter' },
  { id: 'bright-light', title: 'Bright & refreshing', hint: 'Citrus, bubbles and long drinks' },
  { id: 'rich-light', title: 'Mellow & bittersweet', hint: 'Gentle, rounded and aperitif-style' },
];

/** The middle value of each 1–5 scale. Profiles at 3 count as the stronger or richer side. */
export const MIDPOINT = 3;

export function quadrantOf(profile: Cocktail['profile']): Quadrant {
  const strong = profile.strength >= MIDPOINT;
  const rich = profile.character >= MIDPOINT;
  return `${rich ? 'rich' : 'bright'}-${strong ? 'strong' : 'light'}`;
}

export function quadrantTitle(id: Quadrant): string {
  return QUADRANTS.find(quadrant => quadrant.id === id)!.title;
}

export function isQuadrant(value: string): value is Quadrant {
  return QUADRANTS.some(quadrant => quadrant.id === value);
}

/** Drinks in one corner, in menu order. */
export function drinksIn(quadrant: Quadrant, cocktails: readonly Cocktail[]): Cocktail[] {
  return cocktails.filter(cocktail => quadrantOf(cocktail.profile) === quadrant);
}

export interface MapPoint {
  cocktail: Cocktail;
  quadrant: Quadrant;
  /** Position on the map, 0–100 from left (bright) to right (rich). */
  x: number;
  /** Position on the map, 0–100 from top (spirit-forward) to bottom (light). */
  y: number;
}

/**
 * Marker positions. A value of 3 sits just inside the stronger/richer side so it never reads as
 * "on the line", and drinks with the same profile are fanned out around their spot so none hide.
 */
export function mapPoints(cocktails: readonly Cocktail[]): MapPoint[] {
  const scale = (value: number) => {
    const nudged = value === MIDPOINT ? MIDPOINT + 0.35 : value;
    return ((nudged - 0.5) / 5) * 100;
  };
  const groups = new Map<string, number>();
  const counts = new Map<string, number>();
  for (const cocktail of cocktails) {
    const key = `${cocktail.profile.strength}:${cocktail.profile.character}`;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return cocktails.map(cocktail => {
    const key = `${cocktail.profile.strength}:${cocktail.profile.character}`;
    const index = groups.get(key) ?? 0;
    groups.set(key, index + 1);
    const total = counts.get(key)!;
    // Spread duplicates on a small circle (radius in map units).
    const angle = total > 1 ? (index / total) * Math.PI * 2 - Math.PI / 2 : 0;
    const radius = total > 1 ? 4.2 : 0;
    const x = scale(cocktail.profile.character) + Math.cos(angle) * radius;
    const y = 100 - scale(cocktail.profile.strength) + Math.sin(angle) * radius;
    return {
      cocktail,
      quadrant: quadrantOf(cocktail.profile),
      x: Math.round(Math.min(97, Math.max(3, x)) * 10) / 10,
      y: Math.round(Math.min(97, Math.max(3, y)) * 10) / 10,
    };
  });
}
