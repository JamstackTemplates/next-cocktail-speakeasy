import { drinks } from '../content/drinks';
import { lounge } from '../content/lounge';
import { absoluteUrl } from './paths';

/**
 * schema.org BarOrPub for search engines and maps, built from the same content as the pages.
 * Late nights keep `closes` earlier than `opens` (Friday 17:00–02:00), which schema.org reads as
 * closing after midnight.
 */
export function loungeStructuredData() {
  const url = absoluteUrl('/');
  return {
    '@context': 'https://schema.org',
    '@type': 'BarOrPub',
    name: lounge.name,
    description: lounge.introduction,
    ...(url ? { url, hasMenu: absoluteUrl('/menu/') } : {}),
    email: lounge.email,
    ...(lounge.phone ? { telephone: lounge.phone } : {}),
    servesCuisine: ['Cocktails', 'Bar bites'],
    // Walk-ins with seated service; parties of seven or more and private hire enquire first.
    acceptsReservations: false,
    priceRange: '$$',
    currenciesAccepted: drinks.currency,
    address: {
      '@type': 'PostalAddress',
      streetAddress: lounge.address.street,
      addressLocality: lounge.address.locality,
      addressRegion: lounge.address.region,
      postalCode: lounge.address.postalCode,
      addressCountry: lounge.address.country,
    },
    openingHoursSpecification: lounge.hours.filter(entry => entry.opens && entry.closes).map(entry => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: entry.day,
      opens: entry.opens,
      closes: entry.closes,
    })),
    sameAs: lounge.links.filter(link => link.url.trim()).map(link => link.url),
  };
}

/** JSON for an inline <script type="application/ld+json">, safe against closing the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
