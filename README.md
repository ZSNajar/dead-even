# DEAD EVEN

Five rounds. Three choices. How close can you get?

A complete browser game built with React, TypeScript, Vite, Tailwind CSS and Motion. All illustrations are original inline SVG; sounds are synthesized with the Web Audio API. No secrets, paid APIs, accounts or external media are needed to run the game.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite. For a production bundle:

```sh
npm test
npm run build
```

The static site is emitted to `dist/`.

## This edition

Seven distinct daily runs (35 puzzles) are scheduled October 18–24, 2026. Each run is weight, calories, distance, height, then price. The reset is midnight America/New_York, including daylight saving time. Every puzzle is deterministic and identical for everyone on that date. Only the first seven days are authored for this testing release. Day seven is an ordinary daily, not a finale. Additional dates should be added to the content schedule; the product is an ongoing daily game. Unscheduled dates do not silently recycle previous challenges.

Only today’s challenge unlocks for new daily play. Future dates are disabled in the interface and blocked by the entry guard, including practice. Past challenges can be replayed, and today can be replayed only after its daily is complete. Practice is stored separately. Daily submissions persist per date; already submitted rounds cannot be changed through the interface. Unfinished rounds and reveals resume after reload. Completed daily reports remain available through the edition menu.

Browser storage is per device and browser. It is not a backend identity or anti-cheating system. Clearing storage removes history. No invented rankings, player counts or global comparisons are displayed.

## Content and definitions

Each item stores an ID, category, value, unit, measurement definition, source/editorial provenance, date and artwork reference. The reveal exposes all measurements and sources.

- **Weight:** exact-model manufacturer masses where available (Yamaha, Honda, Concept2). Other objects are openly labeled `≈` workshop reference estimates, not claims about every real object. These should be replaced with documented measured specimens if a strictly empirical edition is desired.
- **Calories:** specified McDonald’s US items and FDA raw edible portions. Values are published rounded averages; multi-item target meals are explicit sums.
- **Distance:** haversine distance between fixed editorial city-centre coordinates on a spherical Earth with mean radius 6,371.0088 km. Not driving distances, actual flight tracks or a connected itinerary. The exact coordinates are included in each measurement definition.
- **Height:** explicitly qualified published vertical heights (statue-only vs pedestal-inclusive, antenna tip vs other definitions). References include NPS, NASA, UK Parliament, landmark operators and sporting rules. The reveal uses a shared ruler and bounded height segments; artwork is illustrative.
- **Price:** original nominal US launch MSRPs before tax, documented in manufacturer launch announcements. No current-sale pricing, inflation adjustment or arbitrary retail deals. The target budgets are game-defined.

All 56 combinations of three among eight are checked for every puzzle. All 35 puzzles have at least one solution within 5%, at least two within 8%, at least three within 15%, and at least one combination 35% or more away. Each final report shows the top five combinations for every round and the player’s rank among all 56. No best-combination panel or unchosen item measurements appear during the five-round run. Tied measurement differences share a rank.

## Scoring

```text
relativeError = abs(selectedTotal - targetTotal) / targetTotal
score = round(100 * max(0, 1 - 2 * relativeError))
```

No speed penalty. Identical absolute over/under differences receive the same score. Five rounds total 500 points.

## Controls and accessibility

Tap cards to select; tap again to remove. A fourth choice replaces the most recent selection. Desktop drag-to-scene is an optional equivalent. Number keys 1–8 select cards; Enter submits/continues when another interactive control is not focused. All controls support normal Tab/Enter/Space access. Dialogs trap focus and close with Escape. Audio can be muted; instant reveals can be toggled. System reduced-motion preference is respected. The share button copies a spoiler-free result, or exposes selectable text if clipboard access fails.

## Layout of the code

- `src/logic.ts`: pure scoring, exhaustive combinations, validation, date scheduling, DST reset, streaks and sharing.
- `src/data.ts`: sourced content pools and validated deterministic seven-day edition.
- `src/Art.tsx`: original SVG objects, assistant and animated balance scale.
- `src/App.tsx`: scenes, selection, persistence, reveals, archive, results and accessibility.
- `src/style.css`: responsive workshop design and reduced-motion rules.
- `src/logic.test.ts`: numerical, content and scheduling tests.
- `src/game.test.tsx`: DOM interaction test of all seven five-round runs, locking, reload/resume, sharing fallback and daily/practice separation.

## Verification limits

The production build and automated logic/DOM interaction tests are run in this environment. The initial build used automated logic and DOM checks; physical iPhone and Safari visual QA remain unverified. DOM tests exercise actual React interactions but do not validate pixel layout, audible playback or animation appearance.

## Public sharing and GitHub Pages

The copy-results text includes the URL of the deployment being played, including a GitHub Pages repository subpath. The current Sites deployment has public access enabled.

A GitHub Pages workflow is included at `.github/workflows/pages.yml`. After pushing this repository to GitHub, set Settings → Pages → Source to GitHub Actions. Pushing `main` runs the tests and builds/deploys `dist/`. Vite uses relative asset URLs so both a domain root and a repository subpath work. The public repository is ZSNajar/dead-even, with GitHub Actions selected as the Pages source.

Artwork was audited for distinct object forms and serving quantities. There are separate code-drawn SVGs for statue-only vs pedestal-inclusive Liberty; cherries, eight strawberries and grapes; whole vs diced watermelon; burger vs breakfast muffin; cat vs dog; football goal vs tennis net; and two/three/four-item portions and product packs. These are editable vector drawings authored directly in code, with no image-generator or external raster assets. They are stylized illustrations, not photographic product reproductions.

Mobile hardening includes iPhone safe-area spacing, 16px copy-fallback text to avoid input-focus zoom, and disabling native drag on coarse-pointer touch devices. These are code-level improvements; physical iPhone and Safari visual testing remain unverified.
