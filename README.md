# Nexoma Labs Website

Official repository for the Nexoma Labs LLC public website.

This project is a lightweight, production-ready static site built with plain HTML, CSS, and JavaScript. It is designed to be fast, easy to maintain, and easy to host on GitHub Pages.

## Overview

The site positions Nexoma Labs as an engineering and product company focused on:

- Enterprise software engineering
- Artificial intelligence
- Distributed systems
- Cloud-native applications
- Digital product development
- Technical publications and open source innovation

## Features

- Responsive navigation with mobile menu
- Dark/light mode toggle with local persistence
- Scroll-based reveal animations
- Professional multi-section landing page
- Custom 404 page
- SEO metadata (title, description, Open Graph, Twitter cards)
- Sitemap for search indexing

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Google Fonts (Space Grotesk, Inter)

No frameworks, no build pipeline, no runtime dependencies.

## Project Structure

```text
.
├─ index.html
├─ 404.html
├─ CNAME                     www.nexomalabs.com
├─ .nojekyll                 serve files byte-exact, no Jekyll processing
├─ sitemap.xml               generated
├─ assets/
│  ├─ style.css
│  ├─ main.js
│  ├─ banner.png
│  ├─ Nexoma-logo.png
│  └─ favicon.svg
├─ tools/
│  ├─ build_docs.py          Markdown -> HTML generator (stdlib only)
│  └─ README.md              how to use the generator
├─ hundy/                    one directory per app
│  ├─ app.json               source: name, tagline, support email, dates
│  ├─ PRIVACY.md             source, also served raw
│  ├─ TERMS.md               source, also served raw
│  ├─ SUPPORT.md             source, also served raw
│  ├─ privacy.html           generated
│  ├─ terms.html             generated
│  ├─ support.html           generated
│  └─ index.html             generated
├─ fitly/                    same layout
├─ habit-tracker/            same layout
├─ kidivers/                 same layout
└─ README.md
```

## Run Locally

Because this is a static site, you can open index.html directly in a browser.

For a cleaner local preview, use a simple local server:

### Python

```bash
python -m http.server 5500
```

Then open:

- http://localhost:5500

### VS Code Live Server (optional)

If you use the Live Server extension, right-click index.html and choose Open with Live Server.

## App Documents (Privacy, Terms, Support)

Each app has a directory at the site root holding its legal and support
documents. The Markdown files are the **single source of truth**: they are
served verbatim at their own URLs *and* rendered into styled HTML pages.

### Published URLs

For an app directory named `hundy`:

| URL | File | Use |
| --- | --- | --- |
| `https://www.nexomalabs.com/hundy/privacy` | `privacy.html` | **App Store Connect privacy policy URL** |
| `https://www.nexomalabs.com/hundy/support` | `support.html` | **App Store Connect support URL** |
| `https://www.nexomalabs.com/hundy/terms` | `terms.html` | EULA / terms of service |
| `https://www.nexomalabs.com/hundy/` | `index.html` | That app's document hub |
| `https://www.nexomalabs.com/hundy/PRIVACY.md` | `PRIVACY.md` | Raw Markdown, for linking from app repos |

Submit the **HTML** URLs to App Store Connect. A raw `.md` URL is served as
plain Markdown source, which reviewers may see as unformatted text or as a file
download.

GitHub Pages resolves both `/hundy/privacy` and `/hundy/privacy.html`; prefer the
extensionless form. Use the `www.` host — the apex domain 301-redirects to it.

### Working with these documents

The Markdown files are the single source of truth. After editing one, regenerate
the HTML and commit both:

```bash
python3 tools/build_docs.py           # regenerate
python3 tools/build_docs.py --check   # verify nothing is stale before committing
```

Never hand-edit the generated `*.html` files or `sitemap.xml`.

**Full guide, including how to add a new app, the `app.json` schema, the
supported Markdown subset and troubleshooting: [tools/README.md](tools/README.md).**

## Deployment

### GitHub Pages

1. Push this repository to GitHub.
2. Open repository settings.
3. Go to Pages.
4. Under Build and deployment, select:
   - Source: Deploy from a branch
   - Branch: main (or your default branch)
   - Folder: / (root)
5. Save and wait for deployment.

After deployment, the site will be available at your GitHub Pages URL.

## Customization Guide

- Main content and sections: index.html
- Visual system and responsive behavior: assets/style.css
- Theme toggle, mobile menu, reveal animations: assets/main.js
- Not found page: 404.html
- Search crawler map: sitemap.xml (generated — do not hand-edit)
- App privacy/terms/support documents: the Markdown files in each app directory

## Branding and Messaging

The current version is intentionally positioned around capabilities and outcomes rather than listing frameworks as the primary message. This keeps the positioning durable as technologies evolve.

## License

Copyright (c) 2026 Nexoma Labs LLC.
All rights reserved.
