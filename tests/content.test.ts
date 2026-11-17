// Content invariants for the lounge and its cocktail card. Runs with Node's built-in TypeScript type
// stripping. When one of these fails after an edit, the message names the item, section or day to fix.
import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { test } from 'node:test';
import {
  allCocktails, BADGES, BASES, bites, classics, DIETS, drinks, featuredCocktails, formatPrice, GARNISHES, GLASSES,
  ingredientLine, sections, signatures, spirits, zeroProof, type Cocktail, type Garnish, type Glass,
} from '../content/drinks.ts';
import { ageLine, DOOR_ART, formatAddress, lounge, publicLinks, telHref } from '../content/lounge.ts';
import { drawGlass, type Shape } from '../lib/glassware.ts';
import { drinksIn, mapPoints, quadrantOf, QUADRANTS } from '../lib/flavour.ts';
import { mapDirectionsUrl, mapEmbedUrl, mapSearchUrl } from '../lib/maps.ts';
import { timeZoneLabel } from '../lib/time-zone.ts';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX = /^#[0-9a-f]{6}$/i;
const validPrice = (amount: number) => Number.isFinite(amount) && amount > 0 && Math.round(amount * 100) === amount * 100;

test('sections are in order, complete and point at their drinks', () => {
  assert.deepEqual(sections.map(section => section.id), ['signatures', 'classics', 'zero-proof', 'spirits', 'bites'],
    'Keep the five sections: signatures, classics, zero-proof, spirits, bites');
  for (const section of sections) {
    assert.ok(section.title.trim() && section.description.trim(), `section ${section.id} needs a title and description`);
    assert.ok(section.items.length >= 1, `section ${section.id} has no items`);
  }
});

test('ids are unique and URL-safe across sections and every item', () => {
  const ids = [...sections.map(section => section.id), ...allCocktails.map(item => item.id), ...spirits.map(item => item.id), ...bites.map(item => item.id)];
  for (const id of ids) assert.match(id, SLUG, `"${id}" must be lowercase words joined by hyphens`);
  assert.ok(!ids.some(id => id.startsWith('taste-')), 'Ids starting "taste-" are reserved for the flavour map');
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
  assert.deepEqual(duplicates, [], `ids must be unique: ${duplicates.join(', ')}`);
});

test('every cocktail is complete, with a known base, glass, garnish and badge', () => {
  for (const cocktail of allCocktails) {
    const name = `cocktail ${cocktail.id}`;
    assert.ok(cocktail.name.trim(), `${name}.name`);
    assert.ok(cocktail.description.trim(), `${name}.description`);
    assert.ok(cocktail.description.length <= 120, `${name}.description is long for the card: keep it to one sentence (120 characters)`);
    assert.ok(cocktail.ingredients.length >= 2 && cocktail.ingredients.length <= 6, `${name}: list 2–6 ingredients`);
    for (const ingredient of cocktail.ingredients) {
      assert.ok(ingredient.trim(), `${name} has an empty ingredient`);
      assert.doesNotMatch(ingredient, /\d+\s*(ml|oz|cl|dash|dashes|tsp|barspoon)\b/i, `${name}: "${ingredient}" — leave measurements out of ingredients`);
    }
    assert.ok(BASES.includes(cocktail.base), `${name}.base "${cocktail.base}" must be one of ${BASES.join(', ')}`);
    assert.ok(GLASSES.includes(cocktail.glass), `${name}.glass "${cocktail.glass}" must be one of ${GLASSES.join(', ')}`);
    if (cocktail.garnish) assert.ok(GARNISHES.includes(cocktail.garnish), `${name}.garnish "${cocktail.garnish}" must be one of ${GARNISHES.join(', ')}`);
    assert.match(cocktail.color, HEX, `${name}.color must be a hex colour like #9cc98a`);
    if (cocktail.layered) assert.match(cocktail.layered, HEX, `${name}.layered must be a hex colour like #f2a65a`);
    if (cocktail.badge) assert.ok(cocktail.badge in BADGES, `${name}.badge "${cocktail.badge}" must be one of ${Object.keys(BADGES).join(', ')}`);
    assert.ok(validPrice(cocktail.price), `${name}.price ${cocktail.price} must be a positive amount with at most two decimals`);
    assert.equal(cocktail.base === 'none', Boolean(cocktail.zeroProof), `${name}: zero-proof drinks use base 'none' and zeroProof: true, and only they do`);
  }
});

test('flavour profiles are whole numbers from 1 to 5', () => {
  for (const cocktail of allCocktails) {
    for (const axis of ['strength', 'character'] as const) {
      const value = cocktail.profile[axis];
      assert.ok(Number.isInteger(value) && value >= 1 && value <= 5, `cocktail ${cocktail.id}.profile.${axis} is ${value}: use a whole number 1–5`);
    }
  }
});

test('the Zero proof section only holds zero-proof drinks, and has 3–4 of them', () => {
  for (const cocktail of zeroProof) {
    assert.ok(cocktail.zeroProof && cocktail.base === 'none', `${cocktail.id} is in Zero proof: set zeroProof: true and base: 'none'`);
  }
  for (const cocktail of [...signatures, ...classics]) {
    assert.ok(!cocktail.zeroProof, `${cocktail.id} is zero-proof: move it to the zeroProof list`);
  }
  assert.ok(zeroProof.length >= 3 && zeroProof.length <= 6, `List 3–6 zero-proof drinks (now ${zeroProof.length})`);
});

test('every corner of the flavour map has at least one drink', () => {
  for (const quadrant of QUADRANTS) {
    assert.ok(drinksIn(quadrant.id, allCocktails).length >= 1, `No drink is "${quadrant.title}": adjust a profile so this corner isn't empty`);
  }
  assert.equal(quadrantOf({ strength: 3, character: 3 }), 'rich-strong', '3 counts as the stronger, richer side');
  assert.equal(quadrantOf({ strength: 1, character: 1 }), 'bright-light');
  assert.equal(quadrantOf({ strength: 5, character: 2 }), 'bright-strong');
  assert.equal(quadrantOf({ strength: 2, character: 4 }), 'rich-light');
  const points = mapPoints(allCocktails);
  assert.equal(points.length, allCocktails.length);
  for (const point of points) {
    assert.ok(point.x > 0 && point.x < 100 && point.y > 0 && point.y < 100, `${point.cocktail.id} is plotted off the map`);
    // A marker always lands in its own corner, never on the dividing lines.
    const [left, top] = [point.x < 50, point.y < 50];
    assert.equal(`${left ? 'bright' : 'rich'}-${top ? 'strong' : 'light'}`, point.quadrant, `${point.cocktail.id} is drawn in the wrong corner`);
  }
  const keys = new Set(points.map(point => `${point.x}:${point.y}`));
  assert.equal(keys.size, points.length, 'Drinks with the same profile are fanned out, so no marker hides another');
});

test('sample menu sizes and the home page featured drinks', () => {
  assert.ok(signatures.length >= 6 && signatures.length <= 8, `Sample: 6–8 signatures (now ${signatures.length})`);
  assert.ok(classics.length >= 6 && classics.length <= 8, `Sample: 6–8 classics (now ${classics.length})`);
  assert.ok(spirits.length >= 8 && spirits.length <= 12, `Sample: 8–12 spirits (now ${spirits.length})`);
  assert.ok(bites.length >= 4 && bites.length <= 5, `Sample: 4–5 bar bites (now ${bites.length})`);
  assert.equal(featuredCocktails.length, 4, `Mark exactly 4 signatures featured: true for the home page (now ${featuredCocktails.length})`);
  for (const cocktail of [...classics, ...zeroProof]) assert.ok(!cocktail.featured, `${cocktail.id}: only signatures can be featured`);
  assert.ok([...allCocktails, ...spirits, ...bites].some(item => item.soldOut), 'Sample menu shows one "Not tonight" item');
});

test('spirits and bar bites are complete with valid prices and known diet tags', () => {
  for (const pour of spirits) {
    assert.ok(pour.name.trim() && pour.category.trim() && pour.origin.trim(), `spirit ${pour.id} needs a name, category and origin`);
    assert.ok(validPrice(pour.price), `spirit ${pour.id}.price ${pour.price}`);
  }
  for (const bite of bites) {
    assert.ok(bite.name.trim() && bite.description.trim(), `bite ${bite.id} needs a name and description`);
    assert.ok(validPrice(bite.price), `bite ${bite.id}.price ${bite.price}`);
    for (const diet of bite.diet ?? []) assert.ok(diet in DIETS, `bite ${bite.id} has unknown diet "${diet}"`);
    assert.equal(new Set(bite.diet).size, bite.diet?.length ?? 0, `bite ${bite.id} repeats a diet tag`);
    assert.ok(!(bite.diet?.includes('vegan') && bite.diet.includes('vegetarian')), `bite ${bite.id}: tag vegan or vegetarian, not both`);
  }
  assert.ok(drinks.allergenNotes.length >= 1 && drinks.zeroProofNote.trim(), 'Keep the allergen notes and zero-proof note');
});

test('every glass and garnish draws, and drinks draw from their own content', () => {
  const visible = (shapes: Shape[]) => shapes.length > 0 && shapes.every(shape =>
    shape.kind === 'path' ? /^M[\d.\s\-MLHVCQSZlhvcqsz]+$/.test(shape.d) : Number.isFinite(shape.cx) && Number.isFinite(shape.cy));
  for (const glass of GLASSES) {
    const plain = drawGlass({ glass, color: '#c8a050' });
    assert.ok(visible(plain.glass), `${glass}: the glass outline draws`);
    assert.ok(visible(plain.liquid), `${glass}: the drink draws`);
    assert.match(plain.bowl, /Z$/, `${glass}: the bowl is a closed shape for clipping`);
    assert.equal(plain.garnish.length, 0, `${glass}: no garnish unless asked`);
    for (const garnish of GARNISHES) {
      const drawing = drawGlass({ glass, color: '#c8a050', layered: '#f2a65a', garnish });
      assert.ok(visible(drawing.garnish), `${glass} + ${garnish}: the garnish draws`);
      assert.ok(drawing.liquid.some(shape => shape.role === 'layer'), `${glass}: a layered drink draws its float`);
    }
  }
  assert.ok(drawGlass({ glass: 'coupe', color: '#ffffff', garnish: 'foam' }).liquid.some(shape => shape.role === 'foam'), 'foam sits on the drink');
  for (const cocktail of allCocktails) {
    assert.doesNotThrow(() => drawGlass(cocktail), `cocktail ${cocktail.id} can't be drawn`);
  }
});

test('unknown glasses, garnishes and colours fail with a clear message', () => {
  assert.throws(() => drawGlass({ glass: 'tankard' as Glass, color: '#c8a050' }), /Unknown glass "tankard"\. Use one of: coupe, nick-and-nora/);
  assert.throws(() => drawGlass({ glass: 'coupe', color: '#c8a050', garnish: 'umbrella' as Garnish }), /Unknown garnish "umbrella"\. Use one of: twist/);
  assert.throws(() => drawGlass({ glass: 'coupe', color: 'green' }), /color "green" must be a hex colour/);
  assert.throws(() => drawGlass({ glass: 'coupe', color: '#c8a050', layered: 'red' }), /layered "red" must be a hex colour/);
});

test('prices and ingredients format for the card', () => {
  assert.equal(formatPrice(16), '$16');
  assert.equal(formatPrice(15.5), '$15.50');
  assert.equal(formatPrice(0), 'Free');
  assert.equal(ingredientLine({ ingredients: ['Gin', 'lime'] } as Cocktail), 'Gin · lime');
  assert.doesNotThrow(() => new Intl.NumberFormat(drinks.locale, { style: 'currency', currency: drinks.currency }));
});

test('find-the-door steps, dress code and house rules are complete and welcoming', () => {
  assert.ok(lounge.findTheDoor.length >= 3 && lounge.findTheDoor.length <= 5, `findTheDoor: 3–5 steps (now ${lounge.findTheDoor.length})`);
  lounge.findTheDoor.forEach((step, index) => {
    assert.ok(step.title.trim() && step.detail.trim(), `findTheDoor step ${index + 1} needs a title and detail`);
    assert.ok(DOOR_ART.includes(step.art), `findTheDoor step ${index + 1}: art "${step.art}" must be one of ${DOOR_ART.join(', ')}`);
  });
  assert.ok(lounge.accessibleEntrance.trim(), 'accessibleEntrance: say how guests who can’t use the hidden door get in');
  assert.ok(lounge.dressCode.summary.trim() && lounge.dressCode.please.length && lounge.dressCode.pleaseNot.length, 'dressCode needs a summary and both lists');
  assert.ok(lounge.houseRules.length >= 2 && lounge.houseRules.every(rule => rule.title.trim() && rule.detail.trim()), 'houseRules need a title and detail each');
  assert.ok(Number.isInteger(lounge.minimumAge) && lounge.minimumAge >= 18, 'minimumAge');
  assert.equal(ageLine(21), '21+ with ID');
  assert.ok(lounge.houseRules.some(rule => rule.title.includes(`${lounge.minimumAge}+`)), `Add a house rule titled "${ageLine()}"`);
  assert.match(lounge.monogram, /^[A-Za-z&]{1,3}$/, 'monogram: one to three letters');
});

test('contact details and links are publishable', () => {
  assert.match(lounge.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  assert.equal(telHref('(504) 555-0127'), 'tel:5045550127');
  for (const link of publicLinks) assert.match(link.url, /^https:\/\//, link.url);
  assert.ok(lounge.amenities.length >= 1 && lounge.faqs.length >= 1);
  assert.ok(existsSync(new URL('../public/og.png', import.meta.url)), 'public/og.png social image');
});

test('copy keeps hospitality first: no bottomless or shots promotions', () => {
  const text = JSON.stringify({ lounge, sections }).toLowerCase();
  for (const phrase of ['bottomless', 'shots', 'all you can drink', 'drink specials', 'get wasted']) {
    assert.ok(!text.includes(phrase), `Avoid "${phrase}" in the copy`);
  }
});

test('time zones read naturally next to the hours', () => {
  assert.equal(timeZoneLabel('America/Chicago'), 'Central Time');
  assert.equal(timeZoneLabel('America/New_York'), 'Eastern Time');
  assert.equal(timeZoneLabel('UTC'), 'UTC');
  assert.equal(timeZoneLabel(''), '');
});

test('the address is complete and Google Maps links are keyless and encoded', () => {
  for (const key of ['street', 'locality', 'region', 'postalCode', 'country'] as const) assert.ok(lounge.address[key].trim(), `address.${key}`);
  assert.match(lounge.address.country, /^[A-Z]{2}$/);
  const query = formatAddress();
  assert.equal(query, '700 Decatur St, New Orleans, LA 70116');
  assert.equal(mapSearchUrl('A & B, #1'), 'https://www.google.com/maps/search/?api=1&query=A%20%26%20B%2C%20%231');
  assert.ok(mapDirectionsUrl(query).startsWith('https://www.google.com/maps/dir/?api=1&destination=700%20Decatur%20St'));
  assert.equal(mapEmbedUrl(query), 'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!2m1!1s700+Decatur+St%2C+New+Orleans%2C+LA+70116!6i16');
  for (const url of [mapSearchUrl(query), mapDirectionsUrl(query), mapEmbedUrl(query)]) assert.doesNotMatch(url, /key=/);
});
