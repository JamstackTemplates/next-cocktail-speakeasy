# Working on this website

This is a customer-owned Next.js website for a cocktail bar or lounge. Read [README.md](README.md) for setup,
content editing, deployment and the optional Jamstacks contact form.

## Working preferences

- Work in this repository on its current branch unless asked otherwise.
- Preserve existing changes. Leave edits uncommitted; push or deploy only when requested.
- Adapt the website to its owner's requested content and features. Replace the sample lounge, drinks, music,
  address and contact details with the owner's real details; the fictional examples are starting content.

## Structure and content

- `content/drinks.ts` owns the cocktail card. Most owner requests are edits here only:
  - `signatures` (top of the file, edited most often), `classics` and `zeroProof`: cocktails with `id`, `name`,
    `base` (`gin` | `rum` | `whiskey` | `tequila` | `mezcal` | `vodka` | `brandy` | `none`), `ingredients` (ordered,
    no measurements), `description`, `glass`, `color` (hex), optional `layered` (hex float), `garnish`, `profile`
    (`strength` and `character`, whole numbers 1–5), `price`, `badge` (`house` | `seasonal` | `new`), `featured`
    (exactly 4 signatures), `zeroProof` and `soldOut` ("Not tonight": the drink stays listed).
  - Zero-proof drinks need `zeroProof: true` and `base: 'none'`, and live only in `zeroProof`.
  - `spirits` (name, category, origin, price, optional note), `bites` (with `diet` tags) and `sections`
    (titles and descriptions, in menu order), plus `drinks.zeroProofNote` and `drinks.allergenNotes`.
- Every cocktail is drawn from its data: `glass` picks a line-drawn glass, `color`/`layered` fill it and `garnish`
  adds the detail (`lib/glassware.ts`, `components/cocktail-glass.tsx`). Never add image files for drinks. A new
  glass or garnish is a new entry in `lib/glassware.ts` plus the type list in `content/drinks.ts`, with tests.
- `profile` places a drink on the flavour map (`lib/flavour.ts`). 3 and above count as the stronger/richer side;
  every corner must keep at least one drink.
- `content/lounge.ts` owns the name, monogram, tagline, welcome line, introduction, story, contact details,
  address (with a landmark `note`), directions, `findTheDoor` steps (with `art`), `accessibleEntrance`, opening
  hours, `lastCallMinutes`, notice, weekly `music`, `dressCode`, `houseRules`, `minimumAge`, amenities, FAQs and links.
- Opening hours: a `closes` earlier than `opens` means after midnight (Friday `17:00`–`02:00`). Music sets must fall
  on open nights within opening hours (after-midnight ends are fine). Status, last call and tonight's music live
  in `lib/tonight.ts` and are unit tested.
- Keep the hidden-door copy welcoming: always keep `accessibleEntrance`, state the age policy plainly, give
  zero-proof drinks equal billing, and avoid heavy-drinking promotions ("bottomless", shots deals).
- The address drives the "Find the door" section, Google map, directions links and structured data. Maps use
  keyless Google URLs from `lib/maps.ts`; never add a secret key, and keep the map lazy-loaded.
- The time zone is the IANA `timeZone` in `site.config.json` (Jamstacks writes the owner's choice there). Change it
  there, not in content; without it the status line stays neutral.
- Ids are unique, lowercase and hyphenated, and are page anchors (`/menu/#emerald-door`). Ids starting `taste-`
  are reserved for the flavour map.
- Keep content out of `site.config.json`: Jamstacks may rewrite it.
- Text is rendered as plain text. Don't invent reviews, awards or claims for a real business, or real bars' names.

## Styling (Tailwind CSS v4)

- Style components with Tailwind utility classes in the TSX. Don't add global CSS for one-off styles.
- `app/tailwind.input.css` holds what utilities can't express: the colour tokens (`:root` for light, plus two dark
  blocks that must stay identical), the `@theme` built from them, base element styles, shared building blocks
  (`.button`, `.button-ghost`, `.text-link`, `.eyebrow`, `.section-title`, `.deco-frame`, `.mirrored`,
  `.chevron-rule`, `.badge`), the portal, cocktail entries and lists, the flavour map, the programme, the footer
  plinth, glass/garnish colours by `data-role`, animation and data-attribute states.
- Only this template's palette exists (`bg`, `surface`, `panel`, `ink`, `muted`, `line`, `gold`, `gold-ink`,
  `accent`, `emerald`, `on-emerald`). Tailwind's default colours are switched off. To add a colour, add a variable
  to `:root` and both dark blocks, then map it in `@theme inline` as `--color-name: var(--variable)` to get
  `bg-name`, `text-name` and so on. Garnish colours are `--g-*` tokens.
- Colours switch with the theme through the tokens, so prefer them to `dark:` variants (`dark:` follows `html.dark`).
- The layout is strictly symmetrical: centred columns (`column`, `wide`), mirrored pairs and panels. Keep new
  sections on the mirror axis. Reuse `PageHead`, `DecoHeading`, `CocktailEntry`, `CocktailGlass`, `Fan`,
  `ChevronRule`, `Diamond` and `StatusLine` instead of restyling each instance.
- Keep the `--jamstacks-*` component variables mapped to the tokens (the form's primary stays emerald so its white
  button text is readable). Preserve contrast in both themes, layouts from 360px, visible keyboard focus, semantic
  headings and reduced-motion support (the portal line draw, sunburst shimmer and glass settle all stop).

## Static architecture

- Production is a static export in `out/`. Preserve static-export compatibility; no request-time rendering, API
  routes, Server Actions, database or production Next.js server.
- Use local content for pages and ordinary client code for browser-only interactions (status line, tonight's
  music, the programme's "tonight" mark, flavour-map filters, copy button). Time-dependent text is computed in the
  browser (`components/lounge-clock.tsx`), never at build time: the static HTML shows weekly hours and music.
- The flavour map filters by setting `data-taste` on the menu's `TasteScope`; CSS hides non-matching entries.
  Without JavaScript the full menu and the per-corner lists are always there.
- Preserve both custom-domain root URLs and arbitrary GitHub Pages repository paths. Use the shared path helpers
  (`lib/paths.ts`) and `SiteLink` for links, images and metadata.
- Read relevant installed Next.js guides in `node_modules/next/dist/docs/` before changing framework behaviour.
  Keep dependencies modest and the npm lockfile reproducible.

## Optional Jamstacks form

- Keep the integration documented in README.md. The host is `<jamstacks-support-form>` with
  `data-jamstacks-component="support-form"` and `data-jamstacks-site` attributes.
- `JAMSTACKS_SITE` is a public website ID. Load one configured CDN bootstrap at `/sites/{publicSiteId}/embed.js`;
  no ID means no script request and a useful email fallback. The email stays visible beside the form.
- The shared runtime owns form rendering, validation, spam protection and submission. Do not copy it, register a
  replacement element, intercept submission or simulate success.
- Preserve the full-document Contact navigation (`SiteLink`) until a supported remount contract is available.
- The form supports name, email and message. Don't promise bookings or extra fields in page copy: a message is an
  enquiry, and nothing is booked until the lounge replies to confirm.
- Style through supported `--jamstacks-*` CSS variables; do not reach into shadow-root internals.
- Configuration and build-time environment values are public. Never put credentials, publishing keys or private
  notification recipients in them. Remote builds must not depend on localhost.
- Preserve `.github/workflows/pages.yml`, its optional `provisioning_id` input and correlated run name when
  changing the workflow. Pull requests validate without deploying.

## Commands and checks

```sh
npm ci
npm run dev       # http://localhost:3000
npm test          # drinks, glasses, flavour map, hours, music, config and embed checks
npm run typecheck
npm run build     # static export
npm run check     # all three
PAGES_BASE_PATH=/cocktail-preview npm run build
```

Run `npm run check` after every content or code change; test failures name the drink, section, step or day to fix.
`npm start` previews the export on port 3000. Browser-check affected routes in light and dark, at phone and
desktop widths, and root/project-path assets when changing layout, navigation or deployment behaviour. Report
local checks separately from any actual GitHub deployment or accepted contact submission.

## Template publishing assets

- `jamstacks/` contains optional source-template metadata, gallery captures and their checks.
- Read `jamstacks/config.json`; capture evidence is `jamstacks/screenshots.json` and JPEGs stay directly inside `jamstacks/`.
- Run `node --test jamstacks/config.test.mjs` only when maintaining a source template.
- Customer websites can remove this entire folder. Normal tests, website code, builds and the Pages workflow must not import it.
- Keep `site.config.json`, embed integration and the Pages workflow outside the optional folder.
