# The Kidiverse site

One page, no build step, no framework. Copy this folder as it stands to
`www.nexomalabs.com/kidiverse/` and it works.

```
website/
  index.html          every section of the page
  styles.css          tokens, both themes, all layout
  main.js             theme, reveals, the sign-up form, and the drawn scenes
  assets/
    brand/            mark.svg, app-icon.svg, favicon.svg
    worlds/           world art, generated from assets/images/canva/
    og-card.jpg       the 1200x630 card link previews show
```

## Publishing

Every path in the page is relative, so the folder can be served from any
sub-path without editing anything — with three exceptions, all of them in the
first fifteen lines of `index.html`: `canonical`, `og:url` and `og:image` are
absolute, because link scrapers do not resolve relative paths. If the site
lands anywhere other than `https://www.nexomalabs.com/kidiverse/`, change those
three lines and nothing else.

Nothing is minified. The whole page is about 40 KB of text plus the art, and
keeping it readable is worth more than the bytes.

## Where the content comes from

The copy is not invented marketing. It is drawn from the product's own
documents, and two parts of it are quoted rather than paraphrased:

- **The four camera disclosures** in the *What the camera does* section are the
  words the app itself shows a parent, from `src/consent/copy.ts`. If that file
  changes, this page changes with it. Do not reword them here to make them
  shorter — they exist in that shape because a headline that says less than its
  detail is how a disclosure becomes technically complete and practically
  misleading.
- **The status ledger** is the honest split the team keeps internally. In
  particular: **no frame-rate or latency figure appears anywhere on this page,
  because none has been measured on a named device.** Adding one is not a copy
  decision; it requires a measurement first.

`src/consent/__tests__/consent.test.ts` scans this folder's `.html` and `.md`
files on every test run for wording about the camera that has been ruled
misleading. That is deliberate: marketing copy is exactly where such a claim
tends to reappear in a shortened, friendlier form. If a change here fails that
test, the fix is the sentence, not the test. Keep parent-facing sentences in
`index.html`, where the scan reaches them, rather than in `main.js`, where it
does not.

## The two scenes are drawn, not recorded

`main.js` draws the weather and the anatomy figure with Canvas 2D from the same
five gestures the app recognises. There is no video and no screenshot, so the
demo cannot quietly drift out of date the way a recording does.

Two behaviours are carried across from the app on purpose:

- **The lightning wash is capped at three flashes a second** (`MIN_STRIKE_GAP`),
  the same photosensitivity limit the app enforces in world logic.
- **`prefers-reduced-motion` removes the flash entirely**, not just slows it — a
  full-screen flash is the specific thing that setting exists to prevent. The
  scenes still respond to a click; they simply do not animate.

## The early-access form

Out of the box the form has no server. It validates the address and then opens a
pre-filled message to `EARLY_ACCESS_EMAIL` — which works on a static host with
nothing running behind it.

To collect addresses properly, set `EARLY_ACCESS_ENDPOINT` at the top of
`main.js` to a URL that accepts `POST {"email": "...", "source": "kidiverse-site"}`.
The form switches to it automatically and falls back to the mail app if the
request fails.

**Confirm `EARLY_ACCESS_EMAIL` before publishing.** It is currently
`hello@nexomalabs.com`, which was assumed rather than given.

## Regenerating the images

From the repository root:

```bash
npm run website:build     # rebuilds assets/worlds/ and assets/og-card.jpg
npm run website:serve     # http://localhost:4321
npm run website:preview   # flattens the folder into one shareable HTML file
```

`website:build` reads the source art in `assets/images/canva/` and writes
optimised copies here. The originals stay the source of truth; the site ships
copies because it is published as a folder of its own, away from this
repository. It uses macOS `sips` and Python's Pillow — if the site is ever built
on CI, replace those two calls, not the mapping.

## This folder is not in the app

Nothing under `src/` or `tv/` imports anything here, so Metro never sees it and
it adds nothing to the iOS or Android binary. It lives in this repository so the
page and the product it describes change in the same commit.
