// Lounge details. Edit this file to make the website yours.
// Everything here is placeholder content for a fictitious cocktail lounge. The sample address is a
// public landmark (Jackson Square, New Orleans) so the map has something to show; replace it with yours.
// Plain strings only: text is rendered as text, never as HTML.

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export const DAYS: readonly Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export interface OpeningHours {
  day: Day;
  /** 24-hour "HH:MM" local time when the doors open, e.g. "17:00". Omit `opens` and `closes` for a closed day. */
  opens?: string;
  /**
   * 24-hour "HH:MM" local time when the doors close. A time *earlier* than `opens` means after
   * midnight: Friday `opens: '17:00', closes: '02:00'` stays open until 2am Saturday morning.
   */
  closes?: string;
}

/** One weekly live music night. Times are local, like the opening hours. */
export interface MusicNight {
  /** Must be a day the lounge is open. */
  day: Day;
  /** 24-hour "HH:MM" when the set starts. Must be within that night's opening hours. */
  starts: string;
  /**
   * 24-hour "HH:MM" when the set ends. Earlier than `starts` means after midnight
   * (Saturday 22:00–01:00 ends at 1am Sunday). Must be no later than closing time.
   */
  ends: string;
  /** Who's playing, written to follow "with", e.g. "the Acme Trio". Use fictitious names in samples. */
  act: string;
  /** One or two lowercase words to follow "Live", e.g. "jazz" or "piano". */
  genre: string;
}

/** Small drawings for the find-the-door steps (components/deco.tsx). */
export type DoorArt = 'square' | 'lamp' | 'key' | 'door' | 'bell';

export const DOOR_ART: readonly DoorArt[] = ['square', 'lamp', 'key', 'door', 'bell'];

export interface DoorStep {
  /** Short step, e.g. "Look for the brass key". */
  title: string;
  /** One sentence of detail. */
  detail: string;
  /** Drawing shown beside the step. */
  art: DoorArt;
}

export interface Amenity {
  /** Icon name from components/icons.tsx. */
  icon: 'music' | 'glass' | 'seat' | 'access';
  title: string;
  detail: string;
}

export interface HouseRule {
  title: string;
  detail: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface LoungeLink {
  label: string;
  /** Absolute https:// URL. Entries with an empty URL are not rendered. */
  url: string;
}

export interface Lounge {
  name: string;
  /** One or two letters for the monogram in the middle of the header, e.g. "AL". */
  monogram: string;
  /** Short line under the name in the portal, e.g. "Cocktails · live music · late". */
  tagline: string;
  /** A few words above the name in the portal, e.g. "Behind the green door". */
  welcome: string;
  /** One or two sentences: the first thing visitors read. */
  introduction: string;
  /** Short "Our story" paragraphs, shown with the private hire invitation. */
  story: string[];
  /** Public contact address. Choose an address you are happy to publish. */
  email: string;
  /** Public phone number as written for people, e.g. "(504) 555-0127". Set to '' to hide it. */
  phone: string;
  address: {
    street: string;
    locality: string;
    region: string;
    postalCode: string;
    /** ISO 3166-1 alpha-2, e.g. "US". */
    country: string;
    /** Optional landmark or cross streets shown under the address. */
    note?: string;
  };
  /** Getting here: transit, parking, rides. */
  directions: string[];
  /** 3–5 short steps from the landmark to your entrance. */
  findTheDoor: DoorStep[];
  /** Shown beside the steps, so a hidden door never shuts anyone out. */
  accessibleEntrance: string;
  /** Local times in the lounge's time zone, which is set by `timeZone` in site.config.json. */
  hours: OpeningHours[];
  /** Last call is this many minutes before closing, e.g. 30. */
  lastCallMinutes: number;
  /** Optional one-off notice such as holiday hours. Set to '' to hide it. */
  notice: string;
  /** Weekly live music. Leave empty for none. */
  music: MusicNight[];
  /** Keep it friendly: a one-line summary, then short "please" and "please not" lists. */
  dressCode: { summary: string; please: string[]; pleaseNot: string[] };
  /** Seated service, walk-in party size, phones, age policy. */
  houseRules: HouseRule[];
  /** Minimum age for entry. Shown as "21+ with ID" in the footer and house rules. */
  minimumAge: number;
  amenities: Amenity[];
  faqs: Faq[];
  /** Public profiles. Leave `url` empty to hide an entry. */
  links: LoungeLink[];
}

export const lounge: Lounge = {
  name: 'Acme Lounge',
  monogram: 'AL',
  tagline: 'Cocktails · live music · late',
  welcome: 'Behind the green door',
  introduction:
    'A small cocktail lounge behind an unmarked door off Jackson Square. Seated service, a short card of house cocktails and classics, zero-proof drinks made with the same care, and live music three nights a week.',
  story: [
    'Acme Lounge began as a storeroom with a beautiful ceiling. We kept the plasterwork, hung brass lamps over twelve tables and a long walnut bar, and left the door without a sign.',
    'Our bartenders build every drink to order, juice citrus by hand each afternoon and treat a zero-proof cocktail exactly like any other.',
  ],
  email: 'hello@example.com',
  phone: '(504) 555-0127',
  address: {
    street: '700 Decatur St',
    locality: 'New Orleans',
    region: 'LA',
    postalCode: '70116',
    country: 'US',
    note: 'On Jackson Square, on the Decatur St side facing the river',
  },
  directions: [
    'The Canal St and Riverfront streetcars stop a short walk from the square.',
    'Paid parking lots line Decatur St; on busy nights a ride share to the square is easiest.',
  ],
  findTheDoor: [
    { title: 'Start at Jackson Square', detail: 'Walk the Decatur St side of the square, with the river at your back.', art: 'square' },
    { title: 'Follow the brass lamp', detail: 'Halfway along, one gas lamp burns a little brighter than the rest.', art: 'lamp' },
    { title: 'Look for the brass key', detail: 'Beneath the lamp is a green door with a small brass key above it. No sign, no name.', art: 'key' },
    { title: 'Ring once', detail: 'Press the bell and wait a moment. Your host will open the door and seat you.', art: 'bell' },
  ],
  accessibleEntrance: 'Step-free entrance: ask at the host stand next door, or call us and we’ll meet you at the side gate.',
  hours: [
    { day: 'Monday' },
    { day: 'Tuesday', opens: '17:00', closes: '01:00' },
    { day: 'Wednesday', opens: '17:00', closes: '01:00' },
    { day: 'Thursday', opens: '17:00', closes: '01:00' },
    { day: 'Friday', opens: '17:00', closes: '02:00' },
    { day: 'Saturday', opens: '17:00', closes: '02:00' },
    { day: 'Sunday' },
  ],
  lastCallMinutes: 30,
  notice: '',
  music: [
    { day: 'Thursday', starts: '20:30', ends: '23:30', act: 'the Acme Trio', genre: 'jazz' },
    { day: 'Friday', starts: '21:00', ends: '00:00', act: 'the Night Owl Quartet', genre: 'swing' },
    { day: 'Saturday', starts: '22:00', ends: '01:00', act: 'Celeste Arden', genre: 'piano' },
  ],
  dressCode: {
    summary: 'Smart casual. Come as you’d dress for a nice dinner out.',
    please: ['Collared shirts, blouses or a good knit', 'Dresses, skirts, tailored trousers or dark jeans', 'Clean shoes of any kind'],
    pleaseNot: ['Athletic wear or gym kit', 'Swimwear or flip-flops', 'Hats indoors, except for religious or medical reasons'],
  },
  houseRules: [
    { title: 'Seated service', detail: 'Every guest has a seat. When the room is full, we’ll take your number and call you when a table opens.' },
    { title: 'Walk-ins up to six', detail: 'Parties of seven or more, and private hire, please send an enquiry first.' },
    { title: 'Quiet phones', detail: 'Calls outside, please, and no flash photography during the music.' },
    { title: '21+ with ID', detail: 'Everyone needs valid photo ID at the door, every night, whatever your age.' },
  ],
  minimumAge: 21,
  amenities: [
    { icon: 'music', title: 'Live music', detail: 'Jazz, swing and piano three nights a week.' },
    { icon: 'glass', title: 'Zero proof', detail: 'A full card of alcohol-free cocktails.' },
    { icon: 'seat', title: 'Twelve tables', detail: 'Plus eight seats at the bar.' },
    { icon: 'access', title: 'Step-free route', detail: 'Ask at the host stand next door.' },
  ],
  faqs: [
    {
      question: 'Do you take reservations?',
      answer: 'No: we’re walk-in with seated service, first come, first served. For parties of seven or more, or to hire the room or a section, send an enquiry from the Contact page and we’ll reply to arrange it.',
    },
    {
      question: 'What’s the dress code?',
      answer: 'Smart casual. Collared shirts, dresses, dark jeans and clean shoes are all welcome; we ask guests not to wear athletic wear, swimwear or hats indoors.',
    },
    {
      question: 'Can I bring a group?',
      answer: 'Groups of up to six can walk in and we’ll seat you together as soon as we can. For seven or more, please send an enquiry first so we can hold a section for you.',
    },
    {
      question: 'Do you have alcohol-free drinks?',
      answer: 'Yes. Our zero-proof cocktails are built with the same care as the rest of the card, with house cordials, fresh juice and alcohol-free bitters. Ask your bartender for something off-menu, too.',
    },
    {
      question: 'Do you serve food?',
      answer: 'A short menu of bar bites until last call: spiced pecans, gougères, shrimp rémoulade, muffuletta bites and chocolate truffles. Tell us about any allergy when you order.',
    },
    {
      question: 'Is the lounge accessible?',
      answer: 'Yes. The green door has two steps, so we keep a step-free entrance next door: ask at the host stand there, or call us and we’ll meet you at the side gate. The lounge itself is on one level with an accessible restroom.',
    },
    {
      question: 'What’s your age policy?',
      answer: 'Acme Lounge is 21+ only, and everyone needs valid photo ID at the door, whatever your age. We can’t make exceptions.',
    },
  ],
  links: [
    // Add your public profiles. Entries with an empty URL are hidden, so no dead links ship.
    { label: 'Instagram', url: '' },
    { label: 'Facebook', url: '' },
    { label: 'Google Maps', url: '' },
  ],
};

/** Profile links that have a URL. */
export const publicLinks = lounge.links.filter(link => link.url.trim() !== '');

/** Single-line postal address. */
export function formatAddress(address = lounge.address): string {
  return `${address.street}, ${address.locality}, ${address.region} ${address.postalCode}`;
}

/** Digits for a tel: link. */
export function telHref(phone = lounge.phone): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** "21+ with ID". */
export function ageLine(age = lounge.minimumAge): string {
  return `${age}+ with ID`;
}
