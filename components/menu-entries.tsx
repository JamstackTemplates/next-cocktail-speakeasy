import type { ReactNode } from 'react';
import { BADGES, DIETS, formatPrice, ingredientLine, type Bite, type Cocktail, type Pour } from '../content/drinks';
import { quadrantOf } from '../lib/flavour';
import { CocktailGlass } from './cocktail-glass';
import { Diamond } from './deco';

/** The price between two small diamonds, or "Not tonight" for a sold-out drink. */
export function Price({ amount, soldOut }: { amount: number; soldOut?: boolean }) {
  return (
    <p className="entry-price">
      <Diamond />
      {soldOut ? <span className="not-tonight">Not tonight</span> : <span className="figures">{formatPrice(amount)}</span>}
      <Diamond />
    </p>
  );
}

function Badges({ cocktail }: { cocktail: Cocktail }) {
  if (!cocktail.badge && !cocktail.zeroProof) return null;
  return (
    <p className="entry-badges">
      {cocktail.badge ? <span className="badge">{BADGES[cocktail.badge]}</span> : null}
      {cocktail.zeroProof ? <span className="badge badge-zero">Zero proof</span> : null}
    </p>
  );
}

/**
 * One engraved, centred entry on the cocktail card: the drink in its glass, its name in spaced
 * capitals, the ingredients as one italic line, a short description and the price between diamonds.
 * `heading` sets the name's heading level; `anchor` gives it a page anchor (/menu/#id).
 */
export function CocktailEntry({ cocktail, heading: Heading = 'h3', anchor = true }: {
  cocktail: Cocktail;
  heading?: 'h2' | 'h3' | 'h4';
  anchor?: boolean;
}) {
  return (
    <article id={anchor ? cocktail.id : undefined} className="entry" data-quadrant={quadrantOf(cocktail.profile)}
      data-sold-out={cocktail.soldOut ? 'true' : undefined}>
      <CocktailGlass cocktail={cocktail} size={132} className="entry-glass" />
      <Heading className="entry-name">{cocktail.name}</Heading>
      <Badges cocktail={cocktail} />
      <p className="entry-ingredients">{ingredientLine(cocktail)}</p>
      <p className="entry-description">{cocktail.description}</p>
      <Price amount={cocktail.price} soldOut={cocktail.soldOut} />
    </article>
  );
}

/** One line of a tighter engraved list: name, a dotted leader and the price, then a line of detail. */
function ListRow({ id, name, detail, price, soldOut, quadrant, art, tags }: {
  id: string;
  name: string;
  detail: string;
  price: number;
  soldOut?: boolean;
  quadrant?: string;
  art?: ReactNode;
  tags?: ReactNode;
}) {
  return (
    <li id={id} className="list-row" data-quadrant={quadrant} data-sold-out={soldOut ? 'true' : undefined}>
      {art}
      <div className="list-text">
        <p className="list-line">
          <span className="list-name">{name}{tags}</span>
          <span className="list-leader" aria-hidden="true" />
          {soldOut ? <span className="not-tonight">Not tonight</span> : <span className="list-price figures">{formatPrice(price)}</span>}
        </p>
        <p className="list-detail">{detail}</p>
      </div>
    </li>
  );
}

/** Classics: a mirrored list with small glasses. */
export function CocktailList({ cocktails }: { cocktails: Cocktail[] }) {
  return (
    <ul className="engraved-list">
      {cocktails.map(cocktail => (
        <ListRow key={cocktail.id} id={cocktail.id} name={cocktail.name} detail={ingredientLine(cocktail)} price={cocktail.price}
          soldOut={cocktail.soldOut} quadrant={quadrantOf(cocktail.profile)}
          art={<CocktailGlass cocktail={cocktail} size={64} className="list-glass" />} />
      ))}
    </ul>
  );
}

/** Spirits by the pour. */
export function PourList({ pours }: { pours: Pour[] }) {
  return (
    <ul className="engraved-list">
      {pours.map(pour => (
        <ListRow key={pour.id} id={pour.id} name={pour.name} price={pour.price} soldOut={pour.soldOut}
          detail={[pour.category, pour.origin, pour.note].filter(Boolean).join(' · ')} />
      ))}
    </ul>
  );
}

/** Bar bites, with diet tags. */
export function BiteList({ bites }: { bites: Bite[] }) {
  return (
    <ul className="engraved-list">
      {bites.map(bite => (
        <ListRow key={bite.id} id={bite.id} name={bite.name} detail={bite.description} price={bite.price} soldOut={bite.soldOut}
          tags={bite.diet?.length ? (
            <span className="diet-tags">
              {bite.diet.map(diet => <abbr key={diet} className="diet-tag" title={DIETS[diet].label}>{DIETS[diet].short}</abbr>)}
            </span>
          ) : null} />
      ))}
    </ul>
  );
}
