import type { Metadata } from 'next';
import { ChevronRule, Diamond, DoorStepArt, Plume } from '../components/deco';
import { FlavourMap } from '../components/flavour-map';
import { GoogleMap } from '../components/google-map';
import { Icon } from '../components/icons';
import { CocktailEntry } from '../components/menu-entries';
import { DecoHeading } from '../components/page-head';
import { Portal } from '../components/portal';
import { SiteLink } from '../components/site-link';
import { TimeZoneNote } from '../components/time-zone-note';
import { Programme, StatusLine, TonightMusic } from '../components/tonight';
import { featuredCocktails } from '../content/drinks';
import { ageLine, formatAddress, lounge, telHref } from '../content/lounge';
import { mapDirectionsUrl, mapSearchUrl } from '../lib/maps';
import { absoluteUrl, menuAnchor } from '../lib/paths';
import { loungeStructuredData, jsonLd } from '../lib/structured-data';
import { groupedHours, musicDaysSummary, openDaysSummary } from '../lib/tonight';

export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl('/') },
};

const NUMERALS = ['I', 'II', 'III', 'IV', 'V'];

export default function HomePage() {
  const musicDays = musicDaysSummary();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(loungeStructuredData()) }} />

      {/* 1. The portal: an engraved invitation at the door */}
      <section className="portal-stage" aria-labelledby="hero-title">
        <Portal>
          <p className="eyebrow">{lounge.welcome}</p>
          <h1 id="hero-title" className="portal-name">{lounge.name}</h1>
          <p className="portal-tagline">{lounge.tagline}</p>
          <ChevronRule className="my-[clamp(.9rem,2.5cqi,1.4rem)] w-[min(16rem,70%)]" />
          <p className="portal-status"><StatusLine fallback={openDaysSummary()} /></p>
          <TonightMusic fallback={musicDays ? `${musicDays} nights` : undefined} className="justify-center" />
          <p className="mt-[clamp(1.1rem,3cqi,1.75rem)] flex flex-wrap justify-center gap-3">
            <a className="button" href="#find-the-door">Find the door</a>
            <SiteLink className="button button-ghost" href="/menu/">See the menu</SiteLink>
          </p>
          <p className="portal-note">
            <span>{lounge.address.street}</span><Diamond className="text-gold" /><span>{ageLine()}</span>
          </p>
        </Portal>
      </section>

      {/* 2. Find the door: address, the steps to the entrance, hours and the map */}
      <section id="find-the-door" className="section" aria-labelledby="door-title">
        <DecoHeading id="door-title" eyebrow="Find the door" title={lounge.address.street}>
          {lounge.address.note ? <p>{lounge.address.note}.</p> : null}
          <p className="caps mt-2 text-[.8rem] text-muted">{lounge.address.locality}, {lounge.address.region} {lounge.address.postalCode}</p>
        </DecoHeading>
        <p className="mt-5 text-center text-[1.05rem]"><StatusLine fallback={openDaysSummary()} className="caps text-[.82rem]" /></p>

        <ol className="door-steps wide mt-10">
          {lounge.findTheDoor.map((step, index) => (
            <li key={step.title} className="door-step">
              <span className="door-numeral" aria-hidden="true">{NUMERALS[index] ?? index + 1}</span>
              <DoorStepArt art={step.art} className="mx-auto mt-3 text-gold" />
              <h3 className="mt-3 caps text-[.86rem]"><span className="sr-only">Step {index + 1}: </span>{step.title}</h3>
              <p className="mt-2 text-muted">{step.detail}</p>
            </li>
          ))}
        </ol>

        <div className="column mt-10 text-center">
          <p className="access-note"><Icon name="access" className="mx-auto mb-2 text-gold" width={26} height={26} />{lounge.accessibleEntrance}</p>
          <p className="mt-7 flex flex-wrap justify-center gap-3">
            <a className="button" href={mapDirectionsUrl(formatAddress())} rel="noopener">Get directions</a>
            <a className="button button-ghost" href={mapSearchUrl(formatAddress())} rel="noopener">Open in Google Maps</a>
          </p>
        </div>

        <div className="wide mt-12 grid gap-8 lg:grid-cols-2">
          <div className="deco-frame p-[clamp(1.5rem,4vw,2.5rem)] text-center">
            <h3 className="caps text-[.9rem] text-gold-ink">Opening hours</h3>
            {lounge.notice ? <p className="mt-4 border border-gold px-4 py-3">{lounge.notice}</p> : null}
            <ul className="mt-5 grid gap-4">
              {groupedHours().map(group => (
                <li key={group.label} data-closed={group.closed ? 'true' : undefined} className="hours-row">
                  <span className="caps text-[.8rem]">{group.label}</span>
                  <span className="figures text-[1.35rem]">{group.hours}</span>
                  {group.lastCall ? <span className="text-muted italic">last call {group.lastCall}</span> : null}
                </li>
              ))}
            </ul>
            <TimeZoneNote />
            {lounge.directions.length ? (
              <ul className="mt-6 grid gap-2 border-t border-line pt-5 text-[1.02rem] text-muted">
                {lounge.directions.map(line => <li key={line}>{line}</li>)}
              </ul>
            ) : null}
            {lounge.phone ? <p className="mt-4"><a className="text-link figures" href={telHref()}>{lounge.phone}</a></p> : null}
          </div>
          <div className="deco-frame map-frame p-3">
            <GoogleMap className="h-full min-h-88" />
          </div>
        </div>
      </section>

      {/* 3. Signatures, in mirrored pairs */}
      <section className="section" aria-labelledby="signatures-title">
        <ChevronRule className="column mb-[var(--space-section)]" />
        <DecoHeading id="signatures-title" eyebrow="From the bar" title="Signatures">
          <p>House cocktails built to order, each drawn in the glass it’s served in.</p>
        </DecoHeading>
        <div className="pairs mt-10">
          {featuredCocktails.map(cocktail => (
            <SiteLink key={cocktail.id} href={menuAnchor(cocktail.id)} className="entry-link">
              <CocktailEntry cocktail={cocktail} anchor={false} />
            </SiteLink>
          ))}
        </div>
        <p className="mt-10 text-center"><SiteLink className="button button-ghost" href="/menu/">The full cocktail card</SiteLink></p>
      </section>

      {/* 4. Find your drink: the compact flavour map */}
      <section className="section" aria-labelledby="map-title">
        <DecoHeading id="map-title" eyebrow="Find your drink" title="The flavour map">
          <p>Light or spirit-forward, bright or bittersweet: pick a corner to see the drinks that suit you.</p>
        </DecoHeading>
        <div className="wide mt-10"><FlavourMap mode="compact" /></div>
        <p className="mt-10 text-center"><SiteLink className="button button-ghost" href="/menu/#flavour-map">Open the full map</SiteLink></p>
      </section>

      {/* 5. This week: the music programme */}
      {lounge.music.length ? (
        <section id="this-week" className="section" aria-labelledby="week-title">
          <DecoHeading id="week-title" eyebrow="Live music" title="This week">
            <p>Music from the corner stage, never too loud to talk over. No cover charge.</p>
          </DecoHeading>
          <div className="column mt-10">
            <div className="deco-frame programme-card">
              <Plume width={40} className="mx-auto text-gold" />
              <Programme />
            </div>
          </div>
        </section>
      ) : null}

      {/* 6. Dress code and house rules, mirrored */}
      <section className="section" aria-labelledby="etiquette-title">
        <DecoHeading id="etiquette-title" eyebrow="Before you come" title="Dress code & house rules" />
        <div className="mirrored wide mt-10">
          <div className="deco-frame p-[clamp(1.5rem,4vw,2.5rem)] text-center">
            <h3 className="caps text-[.9rem] text-gold-ink">Dress code</h3>
            <p className="mt-3 text-[1.2rem]">{lounge.dressCode.summary}</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <h4 className="caps text-[.74rem] text-muted">Please</h4>
                <ul className="mt-2 grid gap-1.5">{lounge.dressCode.please.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
              <div>
                <h4 className="caps text-[.74rem] text-muted">Please not</h4>
                <ul className="mt-2 grid gap-1.5">{lounge.dressCode.pleaseNot.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            </div>
          </div>
          <div className="deco-frame p-[clamp(1.5rem,4vw,2.5rem)] text-center">
            <h3 className="caps text-[.9rem] text-gold-ink">House rules</h3>
            <ul className="mt-4 grid gap-4">
              {lounge.houseRules.map(rule => (
                <li key={rule.title}>
                  <span className="caps block text-[.8rem]">{rule.title}</span>
                  <span className="block text-muted">{rule.detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 7. Private hire */}
      <section className="section" aria-labelledby="hire-title">
        <div className="column">
          <div className="deco-frame hire-card text-center">
            <p className="eyebrow">Private hire</p>
            <h2 id="hire-title" className="mt-3 font-display text-[clamp(2rem,5vw,3rem)] leading-tight font-normal normal-case tracking-[.02em]">The room is yours</h2>
            {lounge.story.map(paragraph => <p key={paragraph} className="mx-auto mt-4 max-w-(--measure)">{paragraph}</p>)}
            <ul className="amenities mt-8">
              {lounge.amenities.map(amenity => (
                <li key={amenity.title}>
                  <Icon name={amenity.icon} className="mx-auto text-gold" width={24} height={24} />
                  <span className="caps mt-2 block text-[.74rem]">{amenity.title}</span>
                  <span className="block text-[.98rem] text-muted">{amenity.detail}</span>
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-8 max-w-(--measure)">
              Birthdays, launches, rehearsal dinners and late-night after-parties: hire the whole room or a section for
              parties of seven or more. Send an enquiry and we’ll reply to plan it with you.
            </p>
            <p className="mt-6"><SiteLink className="button" href="/contact/">Enquire about private hire</SiteLink></p>
          </div>
        </div>
      </section>

      {/* 8. FAQs */}
      {lounge.faqs.length ? (
        <section id="faq" className="section" aria-labelledby="faq-title">
          <DecoHeading id="faq-title" eyebrow="Good to know" title="Questions" />
          <div className="column mt-8 grid gap-3">
            {lounge.faqs.map(faq => (
              <details key={faq.question} className="faq">
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
          <p className="column mt-8 text-center text-muted">
            Something else? <SiteLink href="/contact/" className="text-link">Send us a note</SiteLink>
            {lounge.phone ? <> or call <a className="text-link figures" href={telHref()}>{lounge.phone}</a></> : null}.
          </p>
        </section>
      ) : null}
    </>
  );
}
