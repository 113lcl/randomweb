# Pulsar Studio

A large, interactive, multi-page website for a fictional design & engineering studio. Built as a static site — no build step, no dependencies — just HTML, CSS and vanilla JavaScript.

## Pages

- `index.html` — Home
- `about.html` — Studio (story, values, timeline)
- `services.html` — Services, process, pricing, FAQ
- `work.html` — Filterable project grid
- `work-aurora.html` — Case study detail page
- `team.html` — Team grid + open roles
- `blog.html` — Journal (filterable articles)
- `contact.html` — Contact form

## Features

- Custom animated cursor with hover states (disabled on touch devices)
- Magnetic buttons and 3D tilt cards
- Scroll-triggered reveal animations (IntersectionObserver)
- Animated number counters
- Infinite marquee
- Full-screen mobile navigation with staggered link animation
- Accordion FAQ, filterable grids, floating-label form fields
- Fully responsive, dark-theme, accessibility-conscious (`prefers-reduced-motion` respected)

## Stack

Plain HTML5, CSS3 (custom properties, no framework) and vanilla JS. Fonts loaded from Google Fonts (Space Grotesk + Inter).

## Local development

Just open `index.html` in a browser, or serve the folder with any static server:

```bash
npx serve .
```

## Deployment

Static site — deployable as-is to GitHub Pages, Netlify, Vercel or any static host.
