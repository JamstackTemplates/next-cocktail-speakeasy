'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { allCocktails } from '../content/drinks';
import { drinksIn, isQuadrant, mapPoints, QUADRANTS, quadrantTitle, type Quadrant } from '../lib/flavour';
import { documentHref } from '../lib/paths';

type TasteState = { taste: Quadrant | null; choose: (taste: Quadrant | null) => void };

const TasteContext = createContext<TasteState | null>(null);

const HASH_PREFIX = '#taste-';

/**
 * Wraps the menu page so the flavour map can filter it. The chosen corner is set as `data-taste` on
 * this wrapper, and CSS hides entries whose `data-quadrant` doesn't match (app/tailwind.input.css).
 * Without JavaScript nothing is hidden. The corner is kept in the URL (#taste-rich-strong), so the
 * home page can link straight to one.
 */
export function TasteScope({ map, children }: { map: ReactNode; children: ReactNode }) {
  const [taste, setTaste] = useState<Quadrant | null>(null);

  useEffect(() => {
    const fromHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith(HASH_PREFIX)) {
        const value = hash.slice(HASH_PREFIX.length);
        setTaste(isQuadrant(value) ? value : null);
      }
    };
    fromHash();
    window.addEventListener('hashchange', fromHash);
    return () => window.removeEventListener('hashchange', fromHash);
  }, []);

  const choose = useCallback((next: Quadrant | null) => {
    setTaste(next);
    const url = `${window.location.pathname}${window.location.search}${next ? `${HASH_PREFIX}${next}` : ''}`;
    window.history.replaceState(window.history.state, '', url);
  }, []);

  const value = useMemo(() => ({ taste, choose }), [taste, choose]);
  const count = taste ? drinksIn(taste, allCocktails).length : 0;

  return (
    <TasteContext.Provider value={value}>
      <div className="taste-scope" data-taste={taste ?? undefined}>
        {map}
        <div className="taste-bar" hidden={!taste}>
          <p role="status" aria-live="polite" className="taste-bar-text">
            {taste ? <>Showing {count} {count === 1 ? 'drink' : 'drinks'}: <strong>{quadrantTitle(taste)}</strong></> : null}
          </p>
          {taste ? <button type="button" className="button button-ghost button-small" onClick={() => choose(null)}>Show the whole card</button> : null}
        </div>
        {children}
      </div>
    </TasteContext.Provider>
  );
}

const AXES = [
  { className: 'axis-top', label: 'Spirit-forward' },
  { className: 'axis-bottom', label: 'Light & refreshing' },
  { className: 'axis-left', label: 'Bright & sour' },
  { className: 'axis-right', label: 'Rich & bitter' },
];

/**
 * The flavour map: every cocktail plotted from its `profile`, light ↔ spirit-forward against
 * bright ↔ rich, with zero-proof drinks in their own marker. The four corners list their drinks.
 *
 * - `full` (menu page): with JavaScript, each corner is a toggle button that filters the menu.
 * - `compact` (home page): each corner links to that corner on the menu page.
 * Without JavaScript both show the static map and the text lists.
 */
export function FlavourMap({ mode }: { mode: 'full' | 'compact' }) {
  const scope = useContext(TasteContext);
  const [enhanced, setEnhanced] = useState(false);
  const [hover, setHover] = useState<string | null>(null);
  useEffect(() => setEnhanced(true), []);

  const taste = scope?.taste ?? null;
  const points = useMemo(() => mapPoints(allCocktails), []);
  const interactive = mode === 'full' && enhanced && scope;

  return (
    <div className="flavour" data-mode={mode} data-taste={taste ?? undefined}>
      <div className="flavour-board deco-frame">
        {AXES.map(axis => <p key={axis.className} className={`flavour-axis ${axis.className}`} aria-hidden="true">{axis.label}</p>)}
        <svg className="flavour-plot" viewBox="0 0 100 100" role="img"
          aria-label={`Flavour map of ${allCocktails.length} drinks, from light and refreshing to spirit-forward, and from bright and sour to rich and bitter. The drinks in each corner are listed beside the map.`}>
          {QUADRANTS.map((quadrant, index) => (
            <rect key={quadrant.id} className="flavour-cell" data-quadrant={quadrant.id} data-active={taste === quadrant.id ? 'true' : undefined}
              x={index % 2 ? 50 : 0} y={index < 2 ? 0 : 50} width="50" height="50" />
          ))}
          <path className="flavour-grid" d="M10 0 V100 M30 0 V100 M70 0 V100 M90 0 V100 M0 10 H100 M0 30 H100 M0 70 H100 M0 90 H100" />
          <path className="flavour-cross" d="M50 0 V100 M0 50 H100" />
          <path className="flavour-centre" d="M50 48.4 L51.6 50 L50 51.6 L48.4 50 Z" />
          {points.map(point => {
            const { cocktail } = point;
            const dimmed = taste && taste !== point.quadrant;
            const s = hover === cocktail.id ? 3.4 : 2.3;
            return (
              <g key={cocktail.id} className="flavour-point" data-zero={cocktail.zeroProof ? 'true' : undefined}
                data-dimmed={dimmed ? 'true' : undefined} data-hover={hover === cocktail.id ? 'true' : undefined}>
                <title>{`${cocktail.name}${cocktail.zeroProof ? ' (zero proof)' : ''}`}</title>
                {cocktail.zeroProof
                  ? <circle cx={point.x} cy={point.y} r={s * 0.78} />
                  : <path d={`M${point.x} ${point.y - s} L${point.x + s} ${point.y} L${point.x} ${point.y + s} L${point.x - s} ${point.y} Z`} />}
              </g>
            );
          })}
        </svg>
        <p className="flavour-legend" aria-hidden="true">
          <span><svg viewBox="0 0 10 10" width="9" height="9"><path d="M5 0 L10 5 L5 10 L0 5 Z" className="legend-diamond" /></svg> Cocktail</span>
          <span><svg viewBox="0 0 10 10" width="9" height="9"><circle cx="5" cy="5" r="3.6" className="legend-ring" /></svg> Zero proof</span>
        </p>
      </div>

      {QUADRANTS.map(quadrant => {
        const drinks = drinksIn(quadrant.id, allCocktails);
        const active = taste === quadrant.id;
        return (
          <section key={quadrant.id} id={mode === 'full' ? `taste-${quadrant.id}` : undefined} className="flavour-corner"
            data-corner={quadrant.id} data-active={active ? 'true' : undefined} aria-labelledby={`corner-${mode}-${quadrant.id}`}>
            <h3 id={`corner-${mode}-${quadrant.id}`} className="flavour-corner-title">
              {interactive ? (
                <button type="button" aria-pressed={active} onClick={() => scope.choose(active ? null : quadrant.id)}>
                  {quadrant.title}
                </button>
              ) : mode === 'compact' ? (
                <a href={documentHref(`/menu/#taste-${quadrant.id}`)}>{quadrant.title}</a>
              ) : quadrant.title}
            </h3>
            <p className="flavour-corner-hint">{quadrant.hint}</p>
            {mode === 'full' ? (
              <ul className="flavour-corner-list">
                {drinks.map(cocktail => (
                  <li key={cocktail.id} onMouseEnter={() => setHover(cocktail.id)} onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(cocktail.id)} onBlur={() => setHover(null)}>
                    <a href={`#${cocktail.id}`}>{cocktail.name}</a>
                    {cocktail.zeroProof ? <span className="sr-only"> (zero proof)</span> : null}
                    {cocktail.zeroProof ? <span className="zero-mark" aria-hidden="true" /> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="flavour-corner-names">{drinks.map(cocktail => cocktail.name).join(' · ')}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}
