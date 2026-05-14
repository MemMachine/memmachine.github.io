# themes/memmachine/AGENTS.md — Theme Guide

> **For theme contributors and AI agents.** The `memmachine` theme is a fully custom Hugo theme — not a community theme. This guide explains how it is structured, what each file does, and how to make changes safely.

## Theme Architecture

```
themes/memmachine/
├── archetypes/            # Theme-level content archetypes (supplemented by root archetypes/)
├── assets/
│   ├── css/               # CSS source files (processed by Hugo Pipes + PostCSS)
│   │   ├── styles.css     # Main stylesheet (imports others)
│   │   ├── main.css       # Primary custom styles
│   │   ├── bootstrap.min.css
│   │   ├── lenis.css      # Smooth scrolling library styles
│   │   ├── logo-marquee.css  # Animated logo strip
│   │   └── aos.min.css    # Animate on Scroll library styles
│   └── js/                # JavaScript source files
│       ├── main.js        # Primary custom scripts
│       ├── custom.js      # Additional customizations
│       ├── bootstrap.bundle.min.js
│       └── lenis.min.js   # Smooth scrolling library
├── content/               # Theme demo content (not used by the live site)
├── layouts/               # Hugo template files — the core of the theme
│   ├── baseof.html        # Root template: wraps every page
│   ├── home.html          # Homepage layout
│   ├── list.html          # Blog listing page (/blog)
│   ├── page.html          # Generic single page layout
│   ├── 404.html           # 404 error page
│   ├── taxonomy.html      # Tag/category index pages
│   ├── term.html          # Individual tag page (list of posts with that tag)
│   ├── robots.txt         # Robots.txt template
│   ├── [name].html        # Custom layouts for specific pages (see below)
│   ├── _partials/         # Reusable template fragments
│   └── _shortcodes/       # Hugo shortcodes
├── static/                # Theme static assets (copied to site root at build)
│   ├── img/               # Theme images (logos, blog default images)
│   ├── js/                # Third-party JS delivered as static (aos.min.js)
│   └── [favicon files]    # favicon.ico, site.webmanifest, etc.
└── hugo.toml              # Theme's own default configuration
```

---

## Layout Hierarchy

Hugo selects templates with this precedence (most specific wins):

```
baseof.html
  └── home.html              ← rendered for the homepage (content/en/_index.md)
  └── list.html              ← rendered for /blog and tag/category listings
  └── page.html              ← rendered for generic single pages
  └── [custom].html          ← rendered when page type matches filename
```

`baseof.html` defines the outer HTML shell (`<html>`, `<head>`, `<body>`). Every other layout is injected into it via Hugo's `block` system.

---

## Custom Page Layouts

These layouts handle specific standalone pages:

| Layout file | URL | Description |
|------------|-----|-------------|
| `community.html` | `/community` | Community landing page |
| `community-ambassador-program.html` | `/community-ambassador-program` | Ambassador program page |
| `community-student-ambassador-program.html` | `/community-student-ambassador-program` | Student ambassador page |
| `contact.html` | `/contact` | Contact form page |
| `conversations.html` | `/conversations` | Conversations page |
| `examples.html` | `/examples` | Examples page (reads `data/examples.yaml`) |
| `integrations.html` | `/integrations` | Integrations page (reads `data/integrations.yaml`) |
| `pricing.html` | `/pricing` | Pricing page (hidden from nav) |
| `privacy-policy.html` | `/privacy-policy` | Privacy policy |

To add a new standalone page:
1. Create `layouts/your-page.html` following the pattern of an existing custom layout.
2. Create `content/en/your-page.md` with `type: your-page` in frontmatter (or rely on filename matching).
3. Add to a menu in `hugo.toml` if it should appear in navigation.

---

## Partials

Partials are reusable template fragments in `layouts/_partials/`. They are included in layouts with `{{ partial "partial-name.html" . }}`.

| Partial | Purpose |
|---------|---------|
| `head.html` | Assembles the full `<head>` element (includes sub-partials below) |
| `head/analytics.html` | Google Tag Manager snippet |
| `head/css.html` | Links to CSS assets |
| `head/js.html` | Links to JS assets |
| `head/seo-metadata.html` | Open Graph, Twitter Card, and canonical URL meta tags |
| `header.html` | Site navigation bar (logo, menu, social icons) |
| `footer.html` | Site footer (menus, copyright) |
| `menu.html` | Navigation menu renderer |
| `home-sections.html` | Main homepage sections (hero, features, stats, etc.) |
| `featured-blogs.html` | Featured blog post carousel (uses `"featured"` tag) |
| `blog-card.html` | Individual blog post card (used in listings and carousels) |
| `blog-sidebar.html` | Blog sidebar (tag cloud, recent posts) |
| `pagination.html` | Blog list page pagination controls |
| `logo-marquee.html` | Scrolling company logo strip (reads `data/logos.yaml`) |
| `brand-logos.html` | Static brand logo display |
| `testimonials.html` | Customer testimonials carousel |
| `faq.html` | FAQ accordion section (reads `data/faq.yaml`) |
| `pricing-table.html` | Pricing tier cards |
| `ready-section.html` | Call-to-action / "Get Started" section |
| `discord.html` | Discord community join section |
| `social-icons.html` | Social media icon links |
| `math.html` | LaTeX math rendering (KaTeX/MathJax setup) |
| `terms.html` | Terms of service content partial |

---

## CSS and JavaScript

### CSS

CSS files are in `assets/css/` and processed by Hugo Pipes + PostCSS (Autoprefixer). The entry point is `styles.css`, which imports the other files.

To modify styles: edit `assets/css/main.css` for custom styles. Avoid editing `bootstrap.min.css`, `lenis.css`, or `aos.min.css` — update those libraries instead.

### JavaScript

JS files are in `assets/js/`. `main.js` is the primary script. `custom.js` contains additional behavior. Third-party libraries (`bootstrap.bundle.min.js`, `lenis.min.js`) are bundled as-is.

`aos.min.js` is delivered from `static/js/` (not processed by Hugo Pipes).

---

## How Data Files Feed Templates

Templates read structured data from `data/*.yaml` using Hugo's `.Site.Data` variable:

| Data file | Template variable | Used by |
|-----------|------------------|---------|
| `data/logos.yaml` | `.Site.Data.logos` | `_partials/logo-marquee.html` |
| `data/faq.yaml` | `.Site.Data.faq` | `_partials/faq.html` |
| `data/examples.yaml` | `.Site.Data.examples` | `layouts/examples.html` |
| `data/integrations.yaml` | `.Site.Data.integrations` | `layouts/integrations.html` |

**Hugo converts hyphens to underscores** in data variable names (e.g., `logos-list.yaml` → `.Site.Data.logos_list`). Files without hyphens are unaffected.

---

## Menu System

Menus are defined in **`hugo.toml`** at the repository root, not in the theme. The theme templates read them with `site.Menus.main`, `site.Menus.footerProduct`, etc.

To add or remove navigation items: edit `hugo.toml`, not the theme templates.

Menu identifiers used by this theme:
- `main` — top navigation bar
- `social` — social media icons in header
- `footerProduct` — footer "Product" column
- `footerCompany` — footer "Company" column
- `footerCommunity` — footer "Community" column
- `legal` — footer "Legal" column

---

## Safe Zones vs. Fragile Zones

### Safe to edit
- CSS in `assets/css/main.css` and `assets/css/styles.css`
- JS in `assets/js/main.js` and `assets/js/custom.js`
- Copy/text inside specific layout files (e.g., updating a heading string)
- `static/img/` (adding new images)

### Fragile — understand cascade effects before changing
- `baseof.html` — changes affect every page on the site
- `header.html` and `footer.html` — changes affect every page
- `head.html` and its sub-partials — affects metadata, analytics, CSS loading on every page
- `home-sections.html` — large file; the homepage depends on its structure

### Do not edit without understanding
- `bootstrap.min.css`, `bootstrap.bundle.min.js` — third-party; update by replacing the whole file with a new version
- `lenis.min.js`, `lenis.css` — third-party smooth scrolling; replace to update
- `aos.min.css`, `aos.min.js` — third-party animate-on-scroll; replace to update

---

## Adding a New Shortcode

Shortcodes live in `layouts/_shortcodes/`. The existing `indent.html` shortcode wraps content with an indent style.

To add a new shortcode:
1. Create `layouts/_shortcodes/your-shortcode.html`
2. Use it in Markdown: `{{< your-shortcode >}}content{{< /your-shortcode >}}`

---

## Build Verification

After any theme change, always verify:
```bash
hugo --gc --minify
```

Preview changes visually:
```bash
hugo server --bind 0.0.0.0
# open http://localhost:1313
```
