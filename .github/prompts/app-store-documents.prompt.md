---
mode: agent
description: Produce App Store Connect documents and a theme brief for a Nexoma Labs app, ready to publish on nexomalabs.com.
---

# Generate App Store Connect documents for this app

You are producing the public legal and support documents for a **Nexoma Labs LLC**
mobile app, plus a theme brief. They will be published at
`https://www.nexomalabs.com/<slug>/` and submitted to App Store Connect, which
requires a working privacy policy URL and support URL and rejects placeholders.

Run this prompt **inside the app's own repository**, not in the website repo. The
facts these documents assert live in the app source, and the entire point of this
exercise is that the documents are true.

---

## Deliverables

Write these into a `docs/site/` folder in this repo, ready to copy across:

| File | Required | Purpose |
| --- | --- | --- |
| `PRIVACY.md` | yes | What the app does with data |
| `TERMS.md` | yes | Licence and rules of use |
| `FAQ.md` or `SUPPORT.md` | one of them | Support resource; Apple needs a support URL |
| `app.json` | yes | Metadata the page templates read |
| `THEME.md` | yes | Design tokens so the pages can match the app |

Plus a short report of what you found and what you had to ask me.

---

## Hard rules

These are not style preferences. Breaking them has caused real problems before.

1. **Never copy another app's privacy policy and change the name.** A privacy
   policy is a factual claim about what one specific app does with data. An
   inherited one is usually wrong and is worse than none.
2. **Never invent service commitments.** No response times, no SLAs, no "we reply
   within N business days", no support hours, no staffing claims. State the
   contact address and stop. If I want a commitment stated, I will say so.
3. **No placeholders.** No `[TBD]`, no `Lorem ipsum`, no `[Your Company]`. Apple
   rejects them. If you genuinely cannot determine something, ask me — do not
   write a guess and do not leave a blank.
4. **Every factual claim must trace to evidence in the code or to an answer I
   gave you.** If you write "no analytics", you must have looked. Cite where you
   looked in your report.
5. **Do not hedge to stay safe.** "If the app stores data only on your device"
   reads as though the author did not know. Determine it, then state it plainly.
6. **Plain language.** Short sentences. No legalese padding. A user should be
   able to read the privacy policy in two minutes and know exactly what happens
   to their data.

---

## Step 1 — Establish the facts from the code

Do this before writing a single sentence. Report what you find.

**Third-party SDKs and network egress**

```bash
# Dependencies that phone home
grep -iE 'firebase|analytics|amplitude|mixpanel|segment|sentry|bugsnag|crashlytics|posthog|appsflyer|adjust|branch|facebook|admob|revenuecat|onesignal' package.json Podfile* 2>/dev/null

# Anything that opens a socket
grep -rnE 'fetch\(|axios|XMLHttpRequest|WebSocket|URLSession|Alamofire' src/ app/ ios/ 2>/dev/null | grep -v node_modules | head -40
```

**Permissions actually requested** — the Info.plist usage strings are the
authoritative list of what the app can touch:

```bash
grep -A1 -E 'NS[A-Za-z]*UsageDescription' ios/*/Info.plist 2>/dev/null
grep -E 'permissions|NS[A-Za-z]*UsageDescription' app.json app.config.* 2>/dev/null
```

**Local storage** — what is persisted, and where:

```bash
grep -rniE 'asyncstorage|mmkv|sqlite|realm|watermelon|securestore|keychain|userdefaults|coredata' src/ app/ 2>/dev/null | grep -v node_modules | head -20
```

**Purchases** — decides whether the documents mention subscriptions at all:

```bash
grep -rniE 'in-?app-?purchase|StoreKit|react-native-iap|revenuecat|expo-in-app' . 2>/dev/null | grep -v node_modules | head
```

**Health and sensitive data**, if relevant:

```bash
grep -rniE 'healthkit|expo-health|apple-?health|Motion|CoreMotion' . 2>/dev/null | grep -v node_modules | head
```

**Existing documents** — reuse the app's own wording where it already exists:

```bash
ls docs/ 2>/dev/null
find . -maxdepth 3 -iname 'PRIVACY*' -o -iname 'TERMS*' -o -iname 'README.md' | grep -v node_modules
```

From this, produce a table before writing anything:

| Data | Collected? | Stored where | Leaves device? | Evidence |
| --- | --- | --- | --- | --- |

---

## Step 2 — Ask me what the code cannot tell you

Ask these as a single batch. Do not guess any of them.

1. **App name and URL slug** — the slug becomes `nexomalabs.com/<slug>/`.
   Lowercase, hyphens.
2. **One-sentence description** of what the app does, in your words.
3. **Is there a backend?** Any server, sync, account, or cloud feature — now or
   planned for the version being submitted.
4. **In-app purchases or subscriptions?** If no, the documents must not mention
   them at all.
5. **Support email**, and whether a second address is used for feedback.
6. **Is this a Kids Category app**, or otherwise directed at under-13s? If yes
   the privacy policy needs COPPA treatment and I will tell you more.
7. **Effective date** for the documents.
8. **Anything the app does that a user might not expect** — background activity,
   camera or microphone use, notifications, data retained after deletion.

---

## Step 3 — Write the documents

Match the tone of `hundy/PRIVACY.md` on the website repo: short, direct, written
by someone who knows the product. Headings that say what the section is about
("What the app collects", "What is never stored"), not numbered legal clauses,
unless the app's risk profile warrants them.

**PRIVACY.md** must cover: what is collected and why; what is explicitly never
collected; where data is stored; any permission the app requests and what happens
if it is denied; how to delete everything, with the exact in-app path; children's
privacy; and how to contact us. If a permission is sensitive — camera, health,
location — give it its own section explaining precisely what happens to the data.

**TERMS.md** must cover: what the app is; that it is not professional advice if
it touches health or finance; user responsibility and safe use; accuracy
limitations; who owns the user's data and who is responsible for backups;
acceptable use; and how changes are announced. Add the Apple App Store minimum
terms (Schedule 1) only if the app has purchases or I ask for them — for a free,
account-free app they are noise.

**FAQ.md** works better than a `SUPPORT.md` for most apps: answer the questions
users will actually ask, then finish with how to get help. If you write
`SUPPORT.md` instead, include what to put in a bug report, accessibility, and a
security disclosure address — but still no response times.

Start each document with a `# H1` and a one-line italic subtitle, then
`**Last updated:** YYYY-MM-DD`. The website's page templates use the `H1` as the
page heading and suppress their own date line when the document states one.

---

## Step 4 — Produce the theme brief

The published pages should feel like the app, not like a generic legal page.
Extract the app's real design tokens — from `src/theme/tokens.*`, a Tailwind
config, or the marketing site if one exists. Do not invent a palette.

Write `THEME.md` containing:

```markdown
## Tokens
| Token | Value | Used for |
| --- | --- | --- |
| background | #07090B | page background |
| surface | #0B0E12 | cards, footer |
| text | #F4F7FA | body text |
| text-muted | #A6B1BD | secondary text |
| accent | #C9FF3C | links, rules, bullets |
| hairline | rgba(244,247,250,.08) | borders |

## Type
Font stack, base size, heading weight and letter-spacing.

## Shape
Corner radii, button shape (pill or rounded), border style.

## Mode
Dark-only, light-only, or both. Say which and why.

## Brand mark
Inline SVG of the app icon glyph, or the path to it in this repo.

## Reference
The file these came from, so they can be re-synced later.
```

If the app already has a marketing page, say so and point at it — its tokens are
the source of truth and the document pages should mirror it exactly.

---

## Step 5 — Hand off to the website repo

Report these commands to me, filled in with the real slug. Do not run them; the
website is a separate repository.

```bash
cd ../nexomalabs.github.io
mkdir -p <slug>/assets
cp ../<app-repo>/docs/site/{PRIVACY.md,TERMS.md,FAQ.md,app.json} <slug>/
# add <slug>/assets/docs.css from THEME.md, and the app's favicon/og image
python3 tools/build_docs.py
python3 tools/build_docs.py --check
```

`app.json` schema — every key required and non-empty, plus optional
`footer_note`:

```json
{
  "name": "Hundy",
  "category": "Mobile Product",
  "tagline": "One sentence for the footer blurb.",
  "support_email": "support@nexomalabs.com",
  "footer_note": "Optional small print, themed pages only.",
  "effective_date": "August 24, 2026",
  "updated_date": "August 24, 2026"
}
```

**Things to know about the website repo**, so your output fits it:

- Generated HTML carries a `<!-- generated by tools/build_docs.py -->` marker.
  Files without that marker are never overwritten, so an app can ship its own
  hand-built `index.html` landing page and keep it.
- If `<slug>/assets/docs.css` exists, the pages use that theme instead of the
  Nexoma site design. That file's presence is the only switch.
- Submit the **HTML** URLs to Apple — `/<slug>/privacy` and `/<slug>/support` or
  `/<slug>/`. GitHub Pages serves raw `.md` as `text/markdown`, which browsers
  show as unformatted source or download.
- The Markdown renderer supports a subset: headings, `**bold**`, `*italic*`,
  `_italic_`, `` `code` ``, links, `<https://autolinks>`, bare emails, flat
  lists, pipe tables, blockquotes and rules. **Nested lists are silently
  flattened** — restructure them as a subheading with a flat list. Images and
  fenced code blocks are mangled. Raw HTML is escaped.

---

## Definition of done

- [ ] Every claim in `PRIVACY.md` traces to code you read or an answer I gave.
- [ ] No response times, SLAs, or invented commitments anywhere.
- [ ] No placeholder text.
- [ ] Purchases and subscriptions mentioned **only** if the app has them.
- [ ] Permissions in the documents match the Info.plist usage strings exactly.
- [ ] The deletion instructions name the real in-app path.
- [ ] `THEME.md` tokens copied from a real theme file, with its path cited.
- [ ] No nested lists in any document.
- [ ] A report telling me what you found, what you assumed, and what still needs
      my confirmation before submission.
