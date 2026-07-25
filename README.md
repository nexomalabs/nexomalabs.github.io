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
├─ sitemap.xml
├─ .gitignore
├─ assets/
│  ├─ style.css
│  ├─ main.js
│  ├─ banner.png
│  ├─ Nexoma-logo.png
│  └─ favicon.svg
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
- Search crawler map: sitemap.xml

## Branding and Messaging

The current version is intentionally positioned around capabilities and outcomes rather than listing frameworks as the primary message. This keeps the positioning durable as technologies evolve.

## License

Copyright (c) 2026 Nexoma Labs LLC.
All rights reserved.
