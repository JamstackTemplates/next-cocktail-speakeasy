import type { ReactNode } from 'react';
import { ChevronRule, Fan } from './deco';

/**
 * Heading block for inner pages, centred on the page's axis like an engraved card heading:
 * a sunburst fan, a small eyebrow, a deco display title and a short lede, closed by a chevron rule.
 */
export function PageHead({ eyebrow, title, children, id, before }: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  id?: string;
  /** Optional illustration above the title, in place of the fan. */
  before?: ReactNode;
}) {
  return (
    <header className="column pt-[clamp(2.5rem,6vw,4.5rem)] pb-[clamp(1.5rem,4vw,2.5rem)] text-center">
      <div className="flex justify-center text-gold">{before ?? <Fan width={84} />}</div>
      <p className="eyebrow mt-4">{eyebrow}</p>
      <h1 id={id} className="mt-3 font-display text-[clamp(2.5rem,7vw,4.2rem)] leading-[1.05] font-normal tracking-[.02em] normal-case text-ink">{title}</h1>
      {children ? <div className="lede mx-auto mt-5 max-w-(--measure) [&_p+p]:mt-3">{children}</div> : null}
      <ChevronRule className="mt-8" />
    </header>
  );
}

/** A centred section heading with a fan above it. */
export function DecoHeading({ id, eyebrow, title, children, className = '' }: {
  id: string;
  eyebrow?: string;
  title: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={`text-center ${className}`}>
      <Fan width={64} className="mx-auto text-gold" />
      {eyebrow ? <p className="eyebrow mt-3">{eyebrow}</p> : null}
      <h2 id={id} className="section-title mt-2">{title}</h2>
      {children ? <div className="lede mx-auto mt-4 max-w-(--measure)">{children}</div> : null}
    </div>
  );
}
