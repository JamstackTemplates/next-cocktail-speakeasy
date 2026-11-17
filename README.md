# Acme Lounge (Next.js)

An art-deco speakeasy theme in black, gold and emerald for cocktail bars and lounges: a signature cocktail menu with each drink drawn in its own glass, a flavour map to help guests choose, zero-proof drinks, live music nights, a "find the door" guide, dress code, late hours, location and a [Jamstacks](https://jamstacks.net) contact component for private hire and events.

The site is laid out like an engraved invitation and a gilded cocktail card: a strictly symmetrical, centred composition of stepped gold frames, sunburst fans and fine rules. The home page opens on a deco doorway drawn in gold line around your name. Dark mode is "after hours" (black lacquer, emerald-black panels, champagne text); light mode is "the invitation" (ivory card stock and black ink). Both follow the visitor's device unless they pick one with the header toggle.

It exports to plain static files, deploys to GitHub Pages (custom domain or `/repository/` path) and works with no backend.

**Acme Lounge**, its story, drinks, music acts and contact details are fictitious placeholders. The sample address is a public landmark, Jackson Square in New Orleans, so the map has something real to show. Replace all of them with your own.

## Pages

| Route | What's there |
| --- | --- |
| `/` | The **portal**: your name inside a gold deco doorway, tonight's status ("Open · last call 1:30am"), tonight's music, and "Find the door" / "See the menu". Then **Find the door** (address and landmark, numbered entrance steps with drawings, the step-free entrance note, directions buttons, hours with last call, and a map in a stepped frame), four **signatures** in mirrored pairs, a compact **flavour map**, **this week's** music programme, **dress code and house rules**, a **private hire** invitation and **FAQs** |
| `/menu/` | The full **flavour map** (choose a corner to filter the card), then the card itself: signatures and zero-proof drinks as engraved entries in mirrored pairs, classics, spirits by the pour and bar bites as tighter mirrored lists, with allergen notes |
| `/contact/` | Private hire, large parties & events: email and phone (always available) plus the hosted enquiry form when connected |
| any other URL | A friendly 404: "Wrong door…" |

## Quick start

Requires Node.js 24 or newer.

```sh
npm ci            # install exact locked dependencies
npm run dev       # http://localhost:3000 with live reload
npm test          # configuration, drinks, glasses, flavour map, hours and music checks
npm run typecheck
npm run build     # static export to out/
npm start         # serve out/ locally at http://localhost:3000/
npm run check     # test + typecheck + build in one go
```

No account, API key or network service is needed to run or build the website. Fonts are installed from npm and bundled at build time, so the build never fetches anything from a font service.

## Make it yours

Every page reads from two content files, so there are no duplicated strings to hunt down:

| File | What to change |
| --- | --- |
| [content/drinks.ts](content/drinks.ts) | **Signatures** (at the top), classics, zero-proof drinks, spirits by the pour, bar bites, section titles, prices, badges, sold-out ("Not tonight") items, allergen notes, currency |
| [content/lounge.ts](content/lounge.ts) | Name, monogram, tagline, introduction and story, email, phone, address (with a landmark `note`), directions, **find-the-door steps**, step-free entrance note, opening hours and last call, weekly music, dress code, house rules, age policy, amenities, FAQs, social links |
| [app/tailwind.input.css](app/tailwind.input.css) | Colours, fonts and other customizations. Components are styled with Tailwind classes |
| `public/og.png` | 1200×630 social preview image |
| `app/icon.svg` | Browser tab icon |
| [site.config.json](site.config.json) | Site name/description, domain, your time zone and public deployment settings (see below) |

### A cocktail

Signatures are first in `content/drinks.ts`, because they're the edit you'll make most:

```ts
{
  id: 'emerald-door',                 // unique; also the link /menu/#emerald-door
  name: 'The Emerald Door',
  base: 'gin',                        // gin, rum, whiskey, tequila, mezcal, vodka, brandy, or none (zero proof)
  ingredients: ['Gin', 'green herbal liqueur', 'cucumber', 'lime', 'mint'], // in order, no measurements
  description: 'Cool and green, with a long herbal finish.',
  glass: 'coupe',                     // coupe, nick-and-nora, martini, rocks, highball, collins, flute, julep, mug
  color: '#9cc98a',                   // the drink's colour in the glass
  layered: '#f2a65a',                 // optional: a float or split colour on top
  garnish: 'mint',                    // optional: twist, wheel, cherry, olive, mint, nutmeg, foam, salt-rim
  profile: { strength: 3, character: 2 }, // flavour map: 1 light … 5 spirit-forward; 1 bright & sour … 5 rich & bitter
  price: 16,
  badge: 'house',                     // optional: 'house' | 'seasonal' | 'new'
  featured: true,                     // optional: one of the 4 signatures on the home page
}
```

The glass drawing is made from `glass`, `color`, `layered` and `garnish`, so a new drink needs no image file.

- **Not tonight?** Add `soldOut: true`. The drink stays on the card with "Not tonight" in place of its price and a faded glass. Remove the line when it's back.
- **Seasonal signatures:** add a cocktail with `badge: 'seasonal'` and delete it when the season ends. Keep exactly four signatures `featured: true` for the home page.
- **Zero proof:** add drinks to `zeroProof` with `base: 'none'` and `zeroProof: true`. They're plotted on the flavour map as rings and get the same full entries as signatures.
- **Flavour map:** `profile` places the drink. Values of 3 and above count as the stronger or richer side. Each of the four corners (crisp & spirited, rich & spirit-forward, bright & refreshing, mellow & bittersweet) must keep at least one drink.
- **Spirits and bites:** `spirits` take a name, category, origin, price and optional note; `bites` take a description, price and `diet` tags (`vegetarian`, `vegan`, `gluten-free`, `contains-nuts`).
- **Sections:** titles and descriptions are in `sections` at the bottom of the drinks list. A new cocktail section is a new array plus an entry there with `kind: 'cocktails'`.
- **Prices** are numbers in `drinks.currency` (`16` is $16, `15.5` is $15.50). Change `currency` and `locale` for other countries.

`npm test` checks the card after every edit: unique, URL-safe ids, known bases, glasses, garnishes and badges, hex colours, profiles from 1 to 5, every flavour-map corner filled, zero-proof drinks only in the Zero proof section, valid prices and diet tags, and that every drink can be drawn. A failure names the drink to fix.

### Find the door, dress code and house rules

`findTheDoor` in `content/lounge.ts` is 3–5 short steps from your landmark to your entrance, each with a small drawing (`square`, `lamp`, `key`, `door` or `bell`). Keep `accessibleEntrance` so a hidden door never shuts anyone out. `dressCode` is a one-line summary plus "please" and "please not" lists; keep it friendly. `houseRules` cover seated service, walk-in party size, phones and the age policy, which also appears in the footer from `minimumAge` ("21+ with ID").

### Hours, last call, tonight and music

`hours` lists every day once with 24-hour `opens`/`closes` times in your local time; leave both out for a closed day. **For late nights, write the closing time as it reads on the clock:** Friday `opens: '17:00', closes: '02:00'` means open until 2am Saturday. `lastCallMinutes` sets last call before closing (30 by default).

`music` lists weekly sets with `day`, `starts`, `ends`, `act` and `genre`. A set may run past midnight (Saturday `22:00`–`01:00`); the tests check that it falls on an open night within your hours.

Your time zone is `timeZone` in [site.config.json](site.config.json), an IANA name such as `America/Chicago`. With it, the visitor's browser works out, using *your* clock and refreshing every minute:

- the status line in the portal, Find the door and the menu: "Doors open at 5pm", "Open · last call 1:30am", "Last call in 20 minutes", "After last call · doors close at 2am" or "Closed tonight · doors open Tuesday at 5pm";
- tonight's music, "Live jazz with the Acme Trio from 8:30pm", marked "Playing now" while it's on (1am on a Saturday night is still Saturday's set);
- "Tonight" on the week's programme;
- and "Times shown in Central Time" (or your zone) beside the hours.

The built files never contain a time-dependent claim. Without a time zone or without JavaScript, the portal says "Open Tuesday to Saturday from 5pm", lists the week's music nights and the full weekly hours with last call. An invalid zone name fails the build with a clear message. Use `notice` for one-off messages such as holiday hours; leave it `''` to hide it.

### Location and map

The Find the door section shows the address, landmark, entrance steps and hours beside a Google map in a stepped deco frame. The map and the "Get directions" and "Open in Google Maps" buttons all come from `address` in `content/lounge.ts`.

All three are free and need no Google account or API key:

- The links use Google's documented [Maps URLs](https://developers.google.com/maps/documentation/urls/get-started).
- The map uses Google's keyless embed (the `google.com/maps/embed?pb=…` form that `google.com/maps?q=…&output=embed` redirects to). It's widely used but isn't a documented API. For Google's officially supported option, create a free [Maps Embed API](https://developers.google.com/maps/documentation/embed/get-started) key restricted to your domain and change `mapEmbedUrl` in [lib/maps.ts](lib/maps.ts) to the `maps/embed/v1/place` form shown there. Embed API keys are meant to be public, so this is safe in a static site.

The map is lazy-loaded, so Google is only contacted when it scrolls into view. Google may set cookies in the embedded map, so mention it in your privacy notice if you have one. In dark mode a CSS filter (`--map-filter` in `app/tailwind.input.css`) turns it into a night map; set it to `none` to show Google's normal colours.

Text is rendered as plain text, never HTML. Don't present invented reviews or awards as fact.

## Appearance

The header uses `DarkModeToggle` from the published `jamstacks` React package. The root layout supplies `ThemeProvider` and the early `ThemeScript`, so a saved preference applies before the first paint and stays consistent across navigation and tabs.

Everything you see is drawn with inline SVG and CSS coloured by tokens: the deco portal and its sunburst, the stepped frame corners, sunburst fans, chevron and diamond rules, the monogram, the find-the-door drawings, the plume for music nights, the footer's stepped plinth, the flavour map and every cocktail glass and garnish. There are no image files to swap. The portal's gold lines draw in once on load, its sunburst shimmers very slowly (and glows after dark), and a drink settles in its glass when you hover it; all of this stops for visitors who prefer reduced motion.

Styling uses [Tailwind CSS v4](https://tailwindcss.com). Components use utility classes such as `bg-surface text-ink`, built from the template's own colour tokens; Tailwind's default palette is switched off so the look stays consistent. To change a colour, edit its variable in `app/tailwind.input.css` (light `:root` and both dark blocks, which must match). To add one, add a variable there and map it in `@theme inline` (`--color-highlight: var(--highlight)` gives `bg-highlight`, `text-highlight` and so on). Garnish colours are the `--g-*` tokens.

Fonts are self-hosted through npm packages:

| Font | Used for | Licence |
| --- | --- | --- |
| [Limelight](https://fonts.google.com/specimen/Limelight) (`@fontsource/limelight`) | The name, page titles and a few display moments | SIL Open Font License 1.1 |
| [Josefin Sans](https://fonts.google.com/specimen/Josefin+Sans) (`@fontsource-variable/josefin-sans`) | Tracked capitals: headings, cocktail names, navigation, prices | SIL Open Font License 1.1 |
| [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) (`@fontsource-variable/cormorant-garamond`) | Body text and italic ingredient lines | SIL Open Font License 1.1 |

Body text is set large and at a medium weight so the serif stays legible on dark backgrounds. Prices and times use lining, tabular figures (the `figures` utility).

## Footer credit

The footer ends with "with ❤️ [jamstacks.net](https://jamstacks.net)". It's an ordinary link in [components/site-footer.tsx](components/site-footer.tsx). This is your website, so you can keep, reword or remove it.

## Configuration

`site.config.json` holds public deployment settings only. Jamstacks may rewrite this file when it sets up a repository for you; it never touches `content/`.

```json
{
  "name": "Acme Lounge",
  "description": "A cocktail lounge behind an unmarked door on Jackson Square: signature cocktails and classics, zero-proof drinks, live music and late hours.",
  "domain": "next-cocktail-speakeasy.jamstacks.net",
  "timeZone": "America/Chicago",
  "jamstacks": { "siteId": "", "cdnUrl": "https://cdn.jamstacks.net" }
}
```

`domain` is the template's live demo, `next-cocktail-speakeasy.jamstacks.net`. **Replace it with your own domain** (hostname only, e.g. `www.example.com`) or set it to `""` if you don't know it yet; it's used for canonical links, the social image and the sitemap. Jamstacks provisioning replaces it for you.

Build-time environment variables override the file (blank values keep the file's value). See [.env.example](.env.example).

| Purpose | Local/build variable | GitHub Actions repository variable |
| --- | --- | --- |
| Public Jamstacks website ID | `JAMSTACKS_SITE` | `JAMSTACKS_SITE` |
| Component CDN base | `NEXT_PUBLIC_JAMSTACKS_CDN_URL` | `JAMSTACKS_CDN_URL` |
| Display/canonical domain (hostname only) | `NEXT_PUBLIC_SITE_DOMAIN` | `SITE_DOMAIN` |
| Time zone for opening hours (IANA name) | `SITE_TIME_ZONE` | not needed; set `timeZone` in the file |
| Project-path prefix, e.g. `/my-lounge` | `PAGES_BASE_PATH` | set automatically from `actions/configure-pages` |
| Absolute site URL for canonical links/sitemap | `PAGES_BASE_URL` | set automatically from `actions/configure-pages` |

Every value here is **public** and ends up in the built files. Never put GitHub tokens, publishing keys or private email addresses in config or `.env` files. The public site ID identifies your website; it grants no administrative access.

Validation happens at build time ([lib/config.mjs](lib/config.mjs)): the site ID must be a single path-safe segment, the CDN must be HTTPS (path prefixes like `https://example.org/_cdn` are fine), the domain must be a bare hostname, and the base path must be a plain URL path. A `localhost` CDN is rejected unless you opt in with `JAMSTACKS_ALLOW_LOCAL_CDN=1`, and is always rejected in GitHub Actions so a public site can never depend on your machine.

GitHub may report an HTTP `PAGES_BASE_URL` while a new custom domain's HTTPS certificate is provisioning. The build accepts that URL and emits HTTPS canonical, social and sitemap URLs, so the first deployment can complete. When neither `PAGES_BASE_URL` nor a domain is known, canonical links and social images are omitted and `sitemap.xml` is empty, rather than guessing an origin.

The home page includes schema.org `BarOrPub` structured data (address, phone, menu link, `acceptsReservations: false` for walk-ins, and opening hours) built from `content/lounge.ts`. Late nights are published as, for example, Friday `opens 17:00` / `closes 02:00`, which search engines read as closing after midnight.

## Contact and Jamstacks

**Without Jamstacks** (default): the Contact page shows your email with a copy button, your phone number and a "useful to include" list (the date and time, number of guests, the occasion, the whole room or a section, dietary needs). No Jamstacks script is requested anywhere.

**With Jamstacks**: create a website in the Jamstacks portal, configure the support form's copy (for example heading "Private hire & events", name/email/message labels, button text and a success message) and theme, and **publish** it. Then set `JAMSTACKS_SITE` (and `JAMSTACKS_CDN_URL` if you're not using `https://cdn.jamstacks.net`) and rebuild. The Contact page then renders:

```html
<jamstacks-support-form data-jamstacks-component="support-form" data-jamstacks-site="site_…"></jamstacks-support-form>
<!-- plus, after hydration, one script: {cdn}/sites/{siteId}/embed.js -->
```

How it behaves:

- The hosted component renders inside the tag (in its own shadow root) and owns validation, spam protection, submission and the success/error messages. This template never submits messages, never registers the element itself and never shows a success message of its own.
- Your email stays visible next to the form at all times. If the script can't load, a short message offers the email instead; if the form is slow to appear, a gentle note does the same. With JavaScript disabled, the page points to email.
- Form text and theme changes you publish in the portal appear after a reload (allow for the CDN cache interval), with no rebuild. Changing the drinks, hours or the site ID does need a rebuild.
- The form supports name, email and message today. The page copy says walk-ins are seated first come, first served, and that a message is an enquiry: nothing is booked until you reply to confirm. Don't promise booking slots, party-size fields or deposits.
- Only the Contact page loads the Jamstacks script.

**Why Contact uses full page loads:** the current shared runtime finds the form's host when its script runs and stops watching for new hosts after ten seconds; it has no public "remount" API. Links to and from Contact therefore do an ordinary full page load (all other links use fast client-side navigation), so the form appears reliably. This is handled by [components/site-link.tsx](components/site-link.tsx).

**Styling:** the page maps its design tokens to the shared `--jamstacks-*` CSS variables in [app/tailwind.input.css](app/tailwind.input.css). The form's primary colour stays emerald in both modes, so its white button text stays readable. A theme you publish in the portal overrides these on the component itself. Don't style the component's internals; they're owned by the runtime.

**Content Security Policy:** none is set by this template. If you add one, allow scripts from your Jamstacks CDN origin, the spam-check provider used by the form (`https://challenges.cloudflare.com` for scripts and frames), `connect-src` to the API origin your published form uses, and `frame-src https://www.google.com` for the map. Inline structured data and the theme script also need a nonce or hash. Avoid wildcards and `unsafe-eval`.

## Deploy to GitHub Pages

The workflow at [.github/workflows/pages.yml](.github/workflows/pages.yml) tests, type-checks, builds and deploys on every push to `main`, validates pull requests without deploying, and can be run manually.

1. Push this repository to GitHub.
2. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
3. Optional: **Settings → Secrets and variables → Actions → Variables**: add `JAMSTACKS_SITE`, `JAMSTACKS_CDN_URL`, `SITE_DOMAIN`. These are *variables*, not secrets: they're public.
4. Push to `main` or run the workflow from the Actions tab.

The site works at `https://<owner>.github.io/<repository>/`; the workflow reads the correct path prefix from GitHub. To preview a project-path build locally:

```sh
PAGES_BASE_PATH=/cocktail-preview npm run build
node scripts/serve.mjs --base /cocktail-preview   # http://localhost:3000/cocktail-preview/
```

**Custom domain:** set it in **Settings → Pages → Custom domain** and create the DNS records GitHub shows you, then put the same hostname in `site.config.json`'s `domain`. Don't add a `public/CNAME` file: deployments from GitHub Actions ignore it.

**Jamstacks provisioning:** if Jamstacks created this repository for you, it already enabled Pages, set the repository variables and started the first run. Its runs appear as `Jamstacks <operation id>` (the workflow's optional `provisioning_id` input). Keep the workflow's file path, inputs and run name if you edit it.

## Local Jamstacks development

For working against a locally running Jamstacks service (portal at `https://localhost:5001`, assets at `https://localhost:5001/_cdn`):

```sh
JAMSTACKS_SITE=site_… \
NEXT_PUBLIC_JAMSTACKS_CDN_URL=https://localhost:5001/_cdn \
JAMSTACKS_ALLOW_LOCAL_CDN=1 npm run dev
```

This website uses Next.js's default port 3000. Trust the local development certificate in your browser and register `http://localhost:3000` as an allowed origin for the website in the portal; the service refuses submissions from origins it doesn't know.

## Project structure

```
app/                    routes, metadata, sitemap/robots, global styles and tokens
components/             header, footer plinth, portal, deco ornaments, cocktail glass, menu entries,
                        flavour map, status/music lines, Jamstacks host/loader
content/                lounge.ts and drinks.ts: your content
lib/config.mjs          build-time public config resolution and validation
lib/tonight.ts          opening hours, last call, tonight's status and music
lib/glassware.ts        glass and garnish drawings as shape data
lib/flavour.ts          flavour-map corners and marker positions
lib/paths.ts            base-path-aware links and asset URLs
lib/structured-data.ts  schema.org BarOrPub data
lib/time-zone.ts        readable time zone names for the hours
lib/maps.ts             Google Maps embed, search and directions URLs
lib/embed-status.ts     observable states of the hosted form
types/                  typed JSX for <jamstacks-support-form>
public/                 social preview image
scripts/serve.mjs       static preview server (with base path support)
tests/                  node:test suites
site.config.json        public deployment settings (provisioner-compatible)
jamstacks/              optional template publishing metadata and gallery captures
```

## Before publishing your website

- Replace Acme Lounge, the monogram, story, address (and its `note`), directions, find-the-door steps, email, phone, drinks, prices, music, dress code, house rules, FAQs and social links with your own details.
- Set your real opening hours (late nights as `closes: '02:00'`), `lastCallMinutes` and `timeZone` in `site.config.json`, and check the status line on the home page.
- Replace the demo `domain` in `site.config.json` with your own (or set the correct Pages URL), and update the site title/description, icon and social preview image.
- Run `npm run check` and a project-path build when using a repository URL.
- Check the pages on phone and desktop, in light and dark, with keyboard navigation and the Contact fallback.
- If you connect Jamstacks, publish the form in the portal and verify a real test message reaches the website inbox. A successful build does not verify message delivery.

`AGENTS.md` gives coding assistants the same architecture and editing guidance.

## Optional template publishing folder

`jamstacks/` is used only to publish this source template in the Jamstacks gallery:

```text
jamstacks/config.json       template metadata and screenshot paths
jamstacks/screenshots.json  capture viewport, hashes and sizes
jamstacks/home-light.jpg    light homepage preview
jamstacks/home-dark.jpg     dark homepage preview
jamstacks/config.test.mjs   source-template publishing checks
```

Run `node --test jamstacks/config.test.mjs` when maintaining the source template.
When creating a customer website, the whole `jamstacks/` folder can be removed.
Normal `npm test`, type checking, builds and the Pages workflow do not depend on it.
Keep `site.config.json`, the website's embed integration and `.github/workflows/pages.yml`;
these belong to the customer website and continue to work without gallery metadata.
