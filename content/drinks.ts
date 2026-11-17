// The cocktail card. Add, remove, reorder or reprice drinks here; every page reads from this file.
// Names, recipes and prices are placeholders: replace them with your own.
// Each cocktail is drawn in its own glass from `glass`, `color`, `layered` and `garnish`, so new
// drinks need no image files. Its `profile` places it on the flavour map.
// Plain strings only: text is rendered as text, never as HTML. Types are at the bottom of this file.

/* ==================================================================
   Signatures: the house cocktails. Changed most often, so they're first.
   Mark 4 `featured` for the home page. Set `soldOut: true` for "Not tonight".
   ================================================================== */

export const signatures: Cocktail[] = [
  {
    id: 'gilded-hour',
    name: 'The Gilded Hour',
    base: 'gin',
    ingredients: ['Gin', 'chamomile honey', 'lemon', 'brut sparkling wine'],
    description: 'Our welcome drink: soft, floral and bright, topped with fine bubbles.',
    glass: 'flute',
    color: '#ecd27a',
    garnish: 'twist',
    profile: { strength: 2, character: 2 },
    price: 16,
    badge: 'house',
    featured: true,
  },
  {
    id: 'emerald-door',
    name: 'The Emerald Door',
    base: 'gin',
    ingredients: ['Gin', 'green herbal liqueur', 'cucumber', 'lime', 'mint'],
    description: 'Cool and green, with a long herbal finish. The drink the lounge is named for.',
    glass: 'coupe',
    color: '#9cc98a',
    garnish: 'mint',
    profile: { strength: 3, character: 2 },
    price: 16,
    badge: 'house',
    featured: true,
  },
  {
    id: 'midnight-parlour',
    name: 'Midnight Parlour',
    base: 'whiskey',
    ingredients: ['Rye whiskey', 'dark cacao', 'bittersweet amaro', 'orange bitters'],
    description: 'Stirred long and served very cold. Dark chocolate and orange peel.',
    glass: 'nick-and-nora',
    color: '#5a2414',
    garnish: 'twist',
    profile: { strength: 5, character: 5 },
    price: 17,
    featured: true,
  },
  {
    id: 'velvet-fan',
    name: 'Velvet Fan',
    base: 'mezcal',
    ingredients: ['Mezcal', 'hibiscus', 'lime', 'agave', 'chili salt'],
    description: 'Gently smoky and tart, the colour of a velvet curtain, with a chili-salt rim.',
    glass: 'rocks',
    color: '#b32a4d',
    garnish: 'salt-rim',
    profile: { strength: 3, character: 1 },
    price: 16,
    featured: true,
  },
  {
    id: 'copper-lantern',
    name: 'Copper Lantern',
    base: 'brandy',
    ingredients: ['Brandy', 'bittersweet orange aperitivo', 'ginger', 'soda'],
    description: 'A tall, bittersweet highball with a gentle warmth from fresh ginger.',
    glass: 'highball',
    color: '#d9792b',
    garnish: 'wheel',
    profile: { strength: 2, character: 4 },
    price: 15,
  },
  {
    id: 'crescent-moon',
    name: 'Crescent Moon',
    base: 'brandy',
    ingredients: ['Brandy', 'spiced pear', 'lemon', 'silky foam'],
    description: 'Autumn in a coupe: ripe pear, warm spice and a cloud of foam (made without egg).',
    glass: 'coupe',
    color: '#d6a65c',
    garnish: 'foam',
    profile: { strength: 2, character: 3 },
    price: 16,
    badge: 'seasonal',
  },
  {
    id: 'riverboat-julep',
    name: 'Riverboat Julep',
    base: 'whiskey',
    ingredients: ['Bourbon whiskey', 'demerara', 'fresh mint', 'crushed ice'],
    description: 'Packed with crushed ice in a frosted silver cup, with a whole bouquet of mint.',
    glass: 'julep',
    color: '#c58a3a',
    garnish: 'mint',
    profile: { strength: 4, character: 3 },
    price: 15,
    badge: 'new',
  },
  {
    id: 'lamplighter-toddy',
    name: 'Lamplighter Toddy',
    base: 'rum',
    ingredients: ['Aged rum', 'spiced honey', 'lemon', 'hot water'],
    description: 'A warm glass mug for cool evenings, with freshly grated nutmeg.',
    glass: 'mug',
    color: '#b8743a',
    garnish: 'nutmeg',
    profile: { strength: 2, character: 4 },
    price: 14,
    soldOut: true,
  },
];

/* ==================================================================
   Classics, made the traditional way.
   ================================================================== */

export const classics: Cocktail[] = [
  {
    id: 'sazerac',
    name: 'Sazerac',
    base: 'whiskey',
    ingredients: ['Rye whiskey', 'demerara sugar', 'Creole bitters', 'absinthe rinse'],
    description: 'New Orleans’ own, served neat in a chilled glass with lemon oils.',
    glass: 'rocks',
    color: '#a5532a',
    garnish: 'twist',
    profile: { strength: 5, character: 4 },
    price: 15,
  },
  {
    id: 'vieux-carre',
    name: 'Vieux Carré',
    base: 'whiskey',
    ingredients: ['Rye whiskey', 'cognac', 'sweet vermouth', 'herbal honey liqueur', 'Creole & aromatic bitters'],
    description: 'Named for the French Quarter: rich, rounded and quietly complex.',
    glass: 'rocks',
    color: '#8c3a1f',
    garnish: 'cherry',
    profile: { strength: 5, character: 5 },
    price: 15,
  },
  {
    id: 'martini',
    name: 'Martini',
    base: 'gin',
    ingredients: ['Gin', 'dry vermouth', 'orange bitters'],
    description: 'Stirred until very cold. Ask for it dirtier, drier or with a twist.',
    glass: 'martini',
    color: '#eef0dc',
    garnish: 'olive',
    profile: { strength: 5, character: 2 },
    price: 15,
  },
  {
    id: 'daiquiri',
    name: 'Daiquiri',
    base: 'rum',
    ingredients: ['White rum', 'fresh lime', 'cane sugar'],
    description: 'Three ingredients, shaken hard and served straight up.',
    glass: 'coupe',
    color: '#e6edc0',
    garnish: 'wheel',
    profile: { strength: 3, character: 1 },
    price: 14,
  },
  {
    id: 'negroni',
    name: 'Negroni',
    base: 'gin',
    ingredients: ['Gin', 'sweet vermouth', 'bitter red aperitivo'],
    description: 'Equal parts, over one large clear cube, with orange peel.',
    glass: 'rocks',
    color: '#b3202f',
    garnish: 'twist',
    profile: { strength: 4, character: 5 },
    price: 14,
  },
  {
    id: 'old-fashioned',
    name: 'Old Fashioned',
    base: 'whiskey',
    ingredients: ['Bourbon whiskey', 'demerara sugar', 'aromatic bitters', 'orange peel'],
    description: 'Stirred slowly over a large cube, finished with a dark cherry.',
    glass: 'rocks',
    color: '#b8682c',
    garnish: 'cherry',
    profile: { strength: 5, character: 4 },
    price: 15,
  },
  {
    id: 'french-75',
    name: 'French 75',
    base: 'gin',
    ingredients: ['Gin', 'lemon', 'sugar', 'brut sparkling wine'],
    description: 'Bright, dry and celebratory, served long in a chilled flute.',
    glass: 'flute',
    color: '#f0e2a2',
    garnish: 'twist',
    profile: { strength: 2, character: 1 },
    price: 15,
  },
  {
    id: 'corpse-reviver-no-2',
    name: 'Corpse Reviver No. 2',
    base: 'gin',
    ingredients: ['Gin', 'blanc aperitif wine', 'orange liqueur', 'lemon', 'absinthe rinse'],
    description: 'Equal parts and a whisper of absinthe: sharp, citrusy and dangerously smooth.',
    glass: 'coupe',
    color: '#efe2ae',
    profile: { strength: 3, character: 1 },
    price: 15,
  },
];

/* ==================================================================
   Zero proof: alcohol-free cocktails with equal billing.
   Every drink here needs `zeroProof: true` and `base: 'none'`.
   ================================================================== */

export const zeroProof: Cocktail[] = [
  {
    id: 'garden-party',
    name: 'Garden Party',
    base: 'none',
    ingredients: ['Cucumber', 'elderflower cordial', 'lime', 'soda'],
    description: 'Long, green and crisp, over cracked ice with a sprig of mint.',
    glass: 'collins',
    color: '#cfe5b1',
    garnish: 'mint',
    profile: { strength: 1, character: 1 },
    price: 10,
    zeroProof: true,
  },
  {
    id: 'lucky-penny',
    name: 'Lucky Penny',
    base: 'none',
    ingredients: ['Fresh ginger', 'lime', 'wildflower honey', 'soda'],
    description: 'Spicy and bright, with a copper glow and a lime wheel.',
    glass: 'highball',
    color: '#e3b45e',
    garnish: 'wheel',
    profile: { strength: 1, character: 2 },
    price: 10,
    zeroProof: true,
  },
  {
    id: 'sunburst-spritz',
    name: 'Sunburst Spritz',
    base: 'none',
    ingredients: ['Blood orange', 'alcohol-free bitter aperitif', 'verjus', 'soda'],
    description: 'Bittersweet and sunset red, made for long conversations.',
    glass: 'collins',
    color: '#d9532f',
    layered: '#f2a65a',
    garnish: 'wheel',
    profile: { strength: 1, character: 4 },
    price: 11,
    zeroProof: true,
  },
  {
    id: 'velvet-hush',
    name: 'Velvet Hush',
    base: 'none',
    ingredients: ['Cold-brew coffee', 'cacao nib syrup', 'orange oils', 'silky foam'],
    description: 'Dark, rich and smooth, shaken to a fine foam. A nightcap without the spirits.',
    glass: 'coupe',
    color: '#4b2a1c',
    garnish: 'foam',
    profile: { strength: 1, character: 5 },
    price: 11,
    zeroProof: true,
  },
];

/* ==================================================================
   Spirits by the pour (1½ oz). Use generic or your own producers' names.
   ================================================================== */

export const spirits: Pour[] = [
  { id: 'delta-mill-rye', name: 'Delta Mill Rye', category: 'Rye whiskey', origin: 'Kentucky', price: 13, note: 'Spiced and dry' },
  { id: 'old-levee-bourbon', name: 'Old Levee Bourbon', category: 'Bourbon whiskey', origin: 'Kentucky', price: 12 },
  { id: 'gallery-row-12', name: 'Gallery Row 12-year', category: 'Single malt whisky', origin: 'Speyside, Scotland', price: 19, note: 'Honey, orchard fruit' },
  { id: 'harbour-light-gin', name: 'Harbour Light Gin', category: 'London dry gin', origin: 'England', price: 11 },
  { id: 'bayou-cane-agricole', name: 'Bayou Cane Agricole', category: 'Rhum agricole', origin: 'Martinique', price: 12, note: 'Grassy and bright' },
  { id: 'tidewater-dark-rum', name: 'Tidewater Dark', category: 'Aged rum', origin: 'Barbados', price: 13 },
  { id: 'highland-agave-reposado', name: 'Highland Agave Reposado', category: 'Tequila', origin: 'Jalisco, Mexico', price: 14 },
  { id: 'cerro-negro-espadin', name: 'Cerro Negro Espadín', category: 'Mezcal', origin: 'Oaxaca, Mexico', price: 15, note: 'Gentle smoke', soldOut: true },
  { id: 'maison-arceau-vsop', name: 'Maison Arceau VSOP', category: 'Cognac', origin: 'France', price: 18 },
  { id: 'vallee-verte-absinthe', name: 'Vallée Verte', category: 'Absinthe', origin: 'Switzerland', price: 14, note: 'Served with iced water' },
];

/* ==================================================================
   Bar bites, served until last call.
   ================================================================== */

export const bites: Bite[] = [
  { id: 'spiced-pecans', name: 'Warm spiced pecans', description: 'Toasted with cane syrup, cayenne and sea salt.', price: 7, diet: ['vegan', 'gluten-free', 'contains-nuts'] },
  { id: 'gougeres', name: 'Gruyère gougères', description: 'Six warm cheese puffs, straight from the oven.', price: 11, diet: ['vegetarian'] },
  { id: 'shrimp-remoulade', name: 'Gulf shrimp rémoulade', description: 'Chilled shrimp, Creole rémoulade and crisp lettuce.', price: 16, diet: ['gluten-free'] },
  { id: 'muffuletta-bites', name: 'Muffuletta bites', description: 'Olive salad, salami, ham and provolone on sesame bread.', price: 14 },
  { id: 'chocolate-truffles', name: 'Dark chocolate truffles', description: 'Four truffles with flaky sea salt.', price: 9, diet: ['vegetarian', 'gluten-free'] },
];

/* ==================================================================
   Sections, in menu order. Titles and descriptions appear on the card.
   ================================================================== */

export const sections: MenuSection[] = [
  { id: 'signatures', title: 'Signatures', description: 'House cocktails, built to order. These change with the seasons.', kind: 'cocktails', items: signatures },
  { id: 'classics', title: 'Classics', description: 'The drinks that built the bar, made the traditional way.', kind: 'cocktails', items: classics },
  { id: 'zero-proof', title: 'Zero proof', description: 'Alcohol-free cocktails, made with the same care as every drink on the card.', kind: 'cocktails', items: zeroProof },
  { id: 'spirits', title: 'Spirits by the pour', description: 'A 1½ oz pour, neat or over a single large cube.', kind: 'pours', items: spirits },
  { id: 'bites', title: 'Bar bites', description: 'Small plates to share, served until last call.', kind: 'bites', items: bites },
];

export const drinks = {
  /** ISO 4217 currency for prices, e.g. "USD". */
  currency: 'USD',
  /** BCP 47 locale for price formatting, e.g. "en-US". */
  locale: 'en-US',
  /** Shown near the top of the menu page. */
  zeroProofNote: 'Every cocktail on the card can be made zero-proof: ask your bartender.',
  /** Allergy advice under the bar bites. */
  allergenNotes: [
    'V vegetarian · VG vegan · GF made without gluten · N contains nuts.',
    'Our kitchen and bar handle nuts, dairy, eggs, shellfish and gluten, so we can’t promise anything is free from allergens. Please tell us about any allergy when you order.',
  ],
};

/* ==================================================================
   Types and helpers
   ================================================================== */

/** The base spirit. Zero-proof drinks use `none`. */
export type Base = 'gin' | 'rum' | 'whiskey' | 'tequila' | 'mezcal' | 'vodka' | 'brandy' | 'none';
export const BASES: readonly Base[] = ['gin', 'rum', 'whiskey', 'tequila', 'mezcal', 'vodka', 'brandy', 'none'];

/** The glass the drink is drawn in (components/cocktail-glass.tsx, lib/glassware.ts). */
export type Glass = 'coupe' | 'nick-and-nora' | 'martini' | 'rocks' | 'highball' | 'collins' | 'flute' | 'julep' | 'mug';
export const GLASSES: readonly Glass[] = ['coupe', 'nick-and-nora', 'martini', 'rocks', 'highball', 'collins', 'flute', 'julep', 'mug'];

/** The garnish drawn on the glass. `twist` and `wheel` are citrus; `foam` sits on top of the drink. */
export type Garnish = 'twist' | 'wheel' | 'cherry' | 'olive' | 'mint' | 'nutmeg' | 'foam' | 'salt-rim';
export const GARNISHES: readonly Garnish[] = ['twist', 'wheel', 'cherry', 'olive', 'mint', 'nutmeg', 'foam', 'salt-rim'];

/** Small label beside a cocktail's name. */
export type Badge = 'house' | 'seasonal' | 'new';
export const BADGES: Record<Badge, string> = { house: 'House', seasonal: 'Seasonal', new: 'New' };

/** Dietary markers on bar bites. */
export type Diet = 'vegetarian' | 'vegan' | 'gluten-free' | 'contains-nuts';
export const DIETS: Record<Diet, { label: string; short: string }> = {
  vegetarian: { label: 'Vegetarian', short: 'V' },
  vegan: { label: 'Vegan', short: 'VG' },
  'gluten-free': { label: 'Made without gluten', short: 'GF' },
  'contains-nuts': { label: 'Contains nuts', short: 'N' },
};

export interface Cocktail {
  /** Unique, URL-safe id used for links such as /menu/#emerald-door. */
  id: string;
  name: string;
  base: Base;
  /** In order, without measurements. Shown as one italic line separated by dots. */
  ingredients: string[];
  /** One short sentence. */
  description: string;
  glass: Glass;
  /** The drink's colour in the glass drawing, as a hex colour like "#9cc98a". */
  color: string;
  /** Optional second hex colour for a float or split colour, drawn on top. */
  layered?: string;
  garnish?: Garnish;
  /**
   * Where the drink sits on the flavour map. `strength`: 1 light & refreshing … 5 spirit-forward.
   * `character`: 1 bright & sour … 5 rich & bitter. 3 and above count as the stronger/richer side.
   */
  profile: { strength: 1 | 2 | 3 | 4 | 5; character: 1 | 2 | 3 | 4 | 5 };
  /** Price in `drinks.currency`, e.g. 16 for $16 or 15.5 for $15.50. */
  price: number;
  badge?: Badge;
  /** Show on the home page (signatures only; mark 4). */
  featured?: boolean;
  /** Alcohol-free. Required for, and only allowed in, the Zero proof section. */
  zeroProof?: boolean;
  /** "Not tonight": stays listed, without a price. Remove the line when it's back. */
  soldOut?: boolean;
}

export interface Pour {
  /** Unique, URL-safe id. */
  id: string;
  /** Producer and expression. Use generic or real producers you stock, never invented claims. */
  name: string;
  /** e.g. "Rye whiskey". */
  category: string;
  /** Where it's made, e.g. "Kentucky". */
  origin: string;
  price: number;
  /** Optional few words, e.g. "Gentle smoke". */
  note?: string;
  soldOut?: boolean;
}

export interface Bite {
  /** Unique, URL-safe id. */
  id: string;
  name: string;
  description: string;
  price: number;
  diet?: Diet[];
  soldOut?: boolean;
}

interface SectionInfo {
  /** Unique, URL-safe id used for links such as /menu/#classics. */
  id: string;
  title: string;
  /** One line under the section title. */
  description: string;
}

export type MenuSection =
  | (SectionInfo & { kind: 'cocktails'; items: Cocktail[] })
  | (SectionInfo & { kind: 'pours'; items: Pour[] })
  | (SectionInfo & { kind: 'bites'; items: Bite[] });

/** Every cocktail (signatures, classics and zero proof), in menu order. */
export const allCocktails: Cocktail[] = [...signatures, ...classics, ...zeroProof];

/** Signatures shown on the home page. */
export const featuredCocktails: Cocktail[] = signatures.filter(cocktail => cocktail.featured);

const formatter = new Intl.NumberFormat(drinks.locale, { style: 'currency', currency: drinks.currency });

/** "$16", or "$15.50" for amounts with cents. */
export function formatPrice(amount: number): string {
  if (amount === 0) return 'Free';
  const text = formatter.format(amount);
  return Number.isInteger(amount) ? text.replace(/[.,]00(?=\D*$)/, '') : text;
}

/** "Gin · chamomile honey · lemon · brut sparkling wine". */
export function ingredientLine(cocktail: Cocktail): string {
  return cocktail.ingredients.join(' · ');
}
