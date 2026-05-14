# AGENTS.md — memmachine.github.io

> **For AI agents and human contributors.** This file is the canonical orientation guide for this repository. Read it before making any changes.

## What This Repository Is

This repository is the source for [memmachine.ai](https://memmachine.ai/), the public website for **MemMachine** — an open-source, multi-layered memory system for AI agents. It is a static site built with [Hugo](https://gohugo.io/) and deployed automatically to GitHub Pages on every push to `main`.

**Do not confuse this with the MemMachine software itself.** The software lives at [github.com/MemMachine/MemMachine](https://github.com/MemMachine/MemMachine). This repository is the website only.

---

## Tech Stack

| Component | Version | Notes |
|-----------|---------|-------|
| Hugo | ≥ 0.149.0 **Extended** | Must be Extended edition (Sass support); pinned via `HUGO_VERSION` in workflow |
| Dart Sass | 1.91.0 | CSS compilation; pinned via `DART_SASS_VERSION` in workflow |
| Go | ≥ 1.25.0 | Hugo module dependency; pinned via `GO_VERSION` in workflow |
| Node.js | ≥ 22.x | PostCSS / Autoprefixer; pinned via `NODE_VERSION` in workflow |
| npm | bundled with Node.js | Dependency management |
| Theme | `memmachine` (custom) | Lives in `themes/memmachine/` |
| Deployment | GitHub Pages | Push to `main` → GitHub Actions → Pages (automatic) |

---

## Directory Structure

```
memmachine.github.io/
│
├── hugo.toml                  # Main Hugo configuration (baseURL, menus, params, taxonomies)
├── postcss.config.js          # PostCSS / Autoprefixer configuration
├── package.json               # Node.js dependencies (autoprefixer, postcss, postcss-cli)
│
├── archetypes/                # Hugo content templates
│   ├── default.md             # Default archetype (non-blog content)
│   └── blog.md                # Blog post archetype with full frontmatter
│
├── content/                   # All site content (Markdown)
│   └── en/                    # English content (active)
│       ├── _index.md          # Homepage content
│       ├── blog/              # Blog posts — see content/AGENTS.md
│       └── *.md               # Standalone pages (community, contact, examples, etc.)
│
├── data/                      # Structured data (YAML) — see data/AGENTS.md
│   ├── examples.yaml          # Use-case cards for /examples page
│   ├── faq.yaml               # FAQ entries for homepage
│   ├── integrations.yaml      # Integration cards for /integrations page
│   └── logos.yaml             # Company logos for the homepage marquee
│
├── static/                    # Static assets served at site root
│   ├── llms.txt               # AI-readable site description (for LLM crawlers)
│   └── llms-full.txt          # Extended AI-readable content index
│
├── themes/
│   └── memmachine/            # Custom Hugo theme — see themes/memmachine/AGENTS.md
│       ├── assets/            # CSS and JS source files
│       ├── layouts/           # Hugo templates and partials
│       └── static/            # Theme static assets (images, favicons)
│
├── tools/                     # Utility scripts — see tools/AGENTS.md
│   └── stargazers/            # GitHub stargazer company extractor (Python)
│
├── .claude/                   # Claude Code configuration (local)
│   ├── CLAUDE.md              # Project-level Claude instructions
│   └── skills/                # Local Claude Code skills
│       ├── write-blog/        # /write-blog skill
│       └── hugo-chores/       # /hugo-chores skill
│
├── .github/
│   └── workflows/
│       └── hugo.yaml          # CI/CD: build and deploy to GitHub Pages
│
├── public/                    # Hugo build output — NEVER edit directly (gitignored)
└── resources/                 # Hugo resource cache — NEVER edit directly
```

---

## Prerequisites and Setup

### One-time installation

```bash
# 1. Install Hugo Extended (required — standard edition will fail)
#    Option A: download from https://github.com/gohugoio/hugo/releases
#    Option B: Homebrew (macOS/Linux)
brew install hugo

# Verify Extended edition and correct version
hugo version
# Expected: hugo v0.149.0+extended ...

# 2. Install Go (Hugo module dependency)
#    Download from https://go.dev/dl/ or use your package manager

# 3. Install Node.js ≥ 22.x
#    Download from https://nodejs.org/ or use nvm

# 4. Clone the repository
git clone https://github.com/MemMachine/memmachine.github.io.git
cd memmachine.github.io

# 5. Install Node.js dependencies
npm install
```

---

## Build Commands

### Production build
```bash
hugo --gc --minify
```
Output goes to `public/`. The `--gc` flag cleans unused cache files; `--minify` produces smaller HTML/CSS/JS.

### Development server (local)
```bash
hugo server
```
Opens at `http://localhost:1313`. Changes to content and templates hot-reload automatically.

### Development server (remote / IDE / devcontainer)
```bash
hugo server --bind 0.0.0.0
```
Binds to all network interfaces. Access from another machine or browser at `http://<server-ip>:1313`. Use this in remote development environments (VS Code Remote, devcontainers, cloud VMs).

### Draft content preview
```bash
hugo server --buildDrafts
```
Shows pages with `draft: true` in frontmatter. New blog posts start as drafts.

---

## Content Types

See [`content/AGENTS.md`](content/AGENTS.md) for the full content guide.

| Type | Location | Description |
|------|----------|-------------|
| Blog posts | `content/en/blog/YYYY/MM/slug/` | Each post is a directory with `index.md` |
| Standalone pages | `content/en/*.md` | Community, contact, examples, pricing, etc. |
| Homepage | `content/en/_index.md` | Homepage copy and hero content |
| Data-driven content | `data/*.yaml` | FAQ, examples, logos, integrations |

**Multi-language:** English (`en/`) is active. Chinese (`zh/`) is configured in `hugo.toml` but the `content/zh/` directory does not yet exist. Do not create it without explicit instruction.

---

## Theme

See [`themes/memmachine/AGENTS.md`](themes/memmachine/AGENTS.md) for the full theme guide.

The `memmachine` theme is fully custom (not a Hugo community theme). It uses:
- Bootstrap 5 (CSS framework)
- Lenis (smooth scrolling)
- AOS — Animate on Scroll
- FontAwesome (icons)
- Google Tag Manager (analytics, configured via `hugo.toml` params)

**Menus are defined in `hugo.toml`**, not in the theme. To add or remove navigation items, edit `hugo.toml`.

---

## CI/CD Pipeline

File: `.github/workflows/hugo.yaml`

Triggers on: push to `main` branch, or manual workflow dispatch. **Merging a PR to `main` is the deploy** — there is no separate deploy step.

All tool versions are pinned as `env:` vars at the top of the `build` job:

| Variable | Current value |
|----------|--------------|
| `HUGO_VERSION` | `0.149.0` |
| `DART_SASS_VERSION` | `1.91.0` |
| `GO_VERSION` | `1.25.0` |
| `NODE_VERSION` | `22.18.0` |

To upgrade any tool, edit its variable and push. The download URLs in the workflow derive the version from these vars automatically.

Steps:
1. Checkout (with submodules, full history)
2. Setup Go, Node.js
3. Install Dart Sass and Hugo Extended
4. Install npm dependencies (if lock file exists)
5. Build: `hugo --gc --minify --baseURL "${{ steps.pages.outputs.base_url }}"`
6. Upload artifact to GitHub Pages
7. Deploy

One deployment runs at a time (concurrency group). Branches other than `main` do not trigger deployment.

---

## Git Workflow

This repository uses a fork + pull request model.

```bash
# Fork on GitHub, then:
git clone https://github.com/YOUR-USERNAME/memmachine.github.io.git
cd memmachine.github.io
git remote add upstream https://github.com/MemMachine/memmachine.github.io.git

# Create a feature branch
git checkout -b my-feature-branch

# Make changes, then commit — ALL COMMITS MUST BE SIGNED
git commit -sS -m "Brief description of change"
#  -s  adds Signed-off-by line
#  -S  GPG-signs the commit (requires configured GPG key)

# Push and open a PR
git push origin my-feature-branch
# → open PR on GitHub against MemMachine/memmachine.github.io main
```

**Unsigned commits will not be accepted.** See [GitHub's commit signing guide](https://docs.github.com/en/authentication/managing-commit-signature-verification) to set up GPG signing.

---

## Critical Constraints

| Constraint | Reason |
|------------|--------|
| Never edit `public/` | Auto-generated by Hugo; overwritten on every build |
| Never edit `resources/` | Hugo resource cache; managed automatically |
| Never create `content/zh/` without instruction | Chinese content is planned but not started |
| All commits must be signed | Project policy (`git commit -sS`) |
| Hugo must be **Extended** edition | Theme uses Sass; standard edition will fail |
| Run `hugo --gc --minify` after any change | Confirms the site builds before committing |

---

## Subdirectory Guides

| Directory | Guide |
|-----------|-------|
| `content/` | [`content/AGENTS.md`](content/AGENTS.md) — blog posts, frontmatter, images |
| `themes/memmachine/` | [`themes/memmachine/AGENTS.md`](themes/memmachine/AGENTS.md) — layouts, partials, CSS/JS |
| `data/` | [`docs/data.md`](docs/data.md) — YAML data files schema |
| `tools/` | [`tools/AGENTS.md`](tools/AGENTS.md) — utility scripts |

---

## Local Claude Code Skills

| Skill | Trigger | Purpose |
|-------|---------|---------|
| write-blog | `/write-blog` | Create a new blog post with correct structure and frontmatter |
| hugo-chores | `/hugo-chores` | Maintenance: upgrade Hugo, verify builds, update npm deps |
