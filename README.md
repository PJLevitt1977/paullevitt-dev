# paullevitt.dev

Personal portfolio site for Paul Levitt.

Hand-written HTML, CSS and JavaScript. **No frameworks and no runtime
dependencies.** Parcel is a devDependency only; nothing it bundles pulls
anything into the browser except our own source.

## Commands

| Command           | What it does                                        |
| ----------------- | --------------------------------------------------- |
| `npm run dev`     | Dev server on :3000 with hot reload, opens a browser |
| `npm run build`   | Production bundle into `dist/`, then copies `static/` |
| `npm run rebuild` | Clears the Parcel cache first (use when CSS goes odd) |
| `npm run serve`   | Serve the built `dist/` locally to sanity-check it   |

## Layout

```
src/
  index.html            entry point (listed in package.json "source")
  about/index.html      second page -> /about/
  styles/
    main.css            declares @layer order, imports everything else
    reset.css           layer: reset
    tokens.css          layer: tokens — the whole design system
    layout.css          layer: layout
    components/*.css    layer: components, one file per component
  scripts/
    main.js             the only client-side JS; pure progressive enhancement
  assets/               fonts and images, content-hashed by Parcel
static/                 copied verbatim into dist/ (_headers, robots.txt)
```

Adding a page: create `src/<name>/index.html` and add it to the `source`
array in `package.json`. The directory-per-page layout gives clean URLs
on Cloudflare Pages with no redirect rules.

## CSS conventions

Cascade layers are declared once, at the top of `main.css`, in this order:

```
reset, tokens, layout, components, utilities
```

Because the order is declared up front, partials can be imported in any
order without affecting specificity. Every file wraps its rules in
`@layer <name> { ... }`.

Native CSS nesting is used throughout. Lightning CSS (built into Parcel)
downlevels nesting, `color-mix()` and logical properties for the browsers
in the `browserslist` field, so modern syntax costs nothing in support.

Accent colours are set with `data-accent="brass|sky|rose|mint"` rather than
inline `style` attributes, which lets the Content-Security-Policy forbid
inline styles outright.

## Deploying to Cloudflare Pages

Connect the repo, then:

- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Node version:** 20 (set via `.node-version`)

`static/_headers` sets the CSP and cache policy: hashed assets are
immutable for a year, HTML always revalidates.

## Things deliberately not here

- No analytics. If it becomes necessary, use Cloudflare Web Analytics —
  server-side, no client script, no cookies, no consent banner.
- No web fonts from a CDN. Self-host into `src/assets/fonts` instead.
- No contact form. `mailto:` plus LinkedIn, which is what recruiters use.
