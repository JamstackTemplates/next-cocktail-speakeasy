import type { Metadata } from 'next';
import { ChevronRule, Diamond } from '../../components/deco';
import { FlavourMap, TasteScope } from '../../components/flavour-map';
import { BiteList, CocktailEntry, CocktailList, PourList } from '../../components/menu-entries';
import { DecoHeading, PageHead } from '../../components/page-head';
import { SiteLink } from '../../components/site-link';
import { StatusLine } from '../../components/tonight';
import { drinks, sections, type MenuSection } from '../../content/drinks';
import { lounge } from '../../content/lounge';
import { absoluteUrl } from '../../lib/paths';
import { openDaysSummary } from '../../lib/tonight';

export const metadata: Metadata = {
  title: 'The cocktail card',
  description: `Signature cocktails, classics, zero-proof drinks, spirits by the pour and bar bites at ${lounge.name}, with a flavour map to help you choose.`,
  alternates: { canonical: absoluteUrl('/menu/') },
};

function SectionBody({ section }: { section: MenuSection }) {
  switch (section.kind) {
    case 'cocktails':
      // Signatures and zero proof get the full engraved entry in mirrored pairs; classics a tighter list.
      return section.id === 'classics'
        ? <CocktailList cocktails={section.items} />
        : <div className="pairs">{section.items.map(cocktail => <CocktailEntry key={cocktail.id} cocktail={cocktail} />)}</div>;
    case 'pours': return <PourList pours={section.items} />;
    case 'bites': return <BiteList bites={section.items} />;
  }
}

export default function MenuPage() {
  return (
    <>
      <PageHead eyebrow="The cocktail card" title="Drinks & bar bites">
        <p>Every drink is built to order at the bar. Ask us for something off the card: we’re happy to make it.</p>
        <p className="caps text-[.8rem]"><StatusLine fallback={openDaysSummary()} /></p>
        <p className="italic text-muted">{drinks.zeroProofNote}</p>
      </PageHead>

      <TasteScope map={
        <section id="flavour-map" className="wide pb-(--space-section)" aria-labelledby="flavour-map-title">
          <DecoHeading id="flavour-map-title" eyebrow="Find your drink" title="The flavour map">
            <p>Each diamond is a cocktail and each ring a zero-proof drink. Choose a corner to show only those drinks on the card below.</p>
          </DecoHeading>
          <div className="mt-10"><FlavourMap mode="full" /></div>
        </section>
      }>
        <nav aria-label="Menu sections" className="column">
          <ul className="section-index">
            {sections.map(section => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}
          </ul>
        </nav>

        {sections.map(section => (
          <section key={section.id} id={section.id} className="menu-card deco-frame" data-kind={section.kind} aria-labelledby={`${section.id}-title`}>
            <div className="menu-card-head">
              <DecoHeading id={`${section.id}-title`} title={section.title}>
                <p>{section.description}</p>
              </DecoHeading>
            </div>
            <SectionBody section={section} />
            {section.kind === 'cocktails' ? <p className="taste-empty">Nothing from this part of the card in that corner of the map.</p> : null}
            {section.kind === 'bites' ? (
              <div className="column mt-8 grid gap-2 text-center text-[.98rem] text-muted">
                {drinks.allergenNotes.map(note => <p key={note}>{note}</p>)}
              </div>
            ) : null}
          </section>
        ))}
      </TasteScope>

      <div className="column mt-(--space-section) text-center">
        <ChevronRule />
        <p className="mt-6 text-[1.1rem]">
          Planning a party of seven or more? <SiteLink href="/contact/" className="text-link">Enquire about private hire</SiteLink>
        </p>
        <p className="caps mt-3 inline-flex items-center gap-2 text-[.74rem] text-muted"><Diamond className="text-gold" />Please drink responsibly<Diamond className="text-gold" /></p>
      </div>
    </>
  );
}
