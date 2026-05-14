# content/AGENTS.md — Content Creation Guide

> **For blog authors, content editors, and AI agents.** This guide covers everything needed to add or modify site content without breaking the build or layout.

## Directory Structure

```
content/
└── en/                         # English (active language)
    ├── _index.md               # Homepage content (hero text, section copy)
    ├── community.md            # /community page
    ├── community-ambassador-program.md
    ├── community-student-ambassador-program.md
    ├── contact.md              # /contact page
    ├── conversations.md        # /conversations page
    ├── examples.md             # /examples page (cards driven by data/examples.yaml)
    ├── integrations.md         # /integrations page (driven by data/integrations.yaml)
    ├── pricing.md              # /pricing page (currently hidden from nav)
    ├── privacy-policy.md       # /privacy-policy page
    ├── terms-of-service.md     # /terms-of-service page
    └── blog/                   # All blog posts
        ├── _index.md           # Blog listing page (/blog)
        └── YYYY/               # Year directory
            └── MM/             # Month directory (zero-padded: 01–12)
                └── slug/       # Post slug (kebab-case)
                    ├── index.md            # Post content and frontmatter
                    └── featured_image.png  # Required featured image
```

**Multi-language note:** Chinese (`zh/`) is configured in `hugo.toml` but `content/zh/` does not yet exist. Do not create it without explicit instruction.

---

## Blog Posts

### Directory Convention

Each blog post lives in its own directory:
```
content/en/blog/{YYYY}/{MM}/{slug}/index.md
```

Examples:
- `content/en/blog/2026/04/nat-integration/index.md`
- `content/en/blog/2025/12/0.2.0-announcement/index.md`

The slug is kebab-case (lowercase, hyphens between words). Hugo derives the URL from this path:
`/blog/YYYY/MM/slug/`

### Creating a New Post

Use the Hugo archetype command (creates the directory and `index.md` with full frontmatter):
```bash
hugo new content/en/blog/YYYY/MM/my-post-slug/index.md
```

Or use the `/write-blog` Claude Code skill, which handles directory creation and frontmatter interactively.

### Required Frontmatter

Every blog post `index.md` must have this YAML frontmatter:

```yaml
---
title: "Full Post Title Here"
date: 2026-05-14T09:00:00-08:00
featured_image: "featured_image.png"
tags: ["tag1", "tag2"]
author: "First Last"
description: "One sentence for SEO and social preview cards."
draft: true
---
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | Yes | Full title, used in `<h1>`, og:title, and blog card |
| `date` | RFC 3339 | Yes | ISO 8601 with timezone offset, e.g. `2026-04-27T09:00:00-08:00` |
| `featured_image` | string | Yes | Filename only (not path); file must be in the same directory as `index.md` |
| `tags` | string array | Yes | Used for taxonomy pages; include `"featured"` to appear in homepage carousel |
| `author` | string | Yes | Full name as it should appear on the post |
| `description` | string | Yes | One sentence; shown in blog card and used as meta description |
| `draft` | boolean | Yes | Set `true` while editing; change to `false` before merging to publish |

### Images

- **Featured image:** place `featured_image.png` (PNG preferred) in the same directory as `index.md`.
- **Inline images:** place any additional images alongside `index.md` and reference them in Markdown as `![alt](image.png)` (filename only, no path prefix needed for page bundle images).
- **Sizing:** featured images display as cards (~400×250px) and as page headers (~1200px wide). Provide high-resolution images when possible.

### Tags

Tags drive the taxonomy pages at `/tags/<tag>/`. Use existing tags where they fit for consistency. The special tag `"featured"` causes the post to appear in the homepage blog carousel.

Common existing tags: `"AI Agent"`, `"AI Memory"`, `"Generative AI"`, `"LLM"`, `"Agent Memory"`, `"Integration"`, `"Developer Tool"`, `"featured"`.

### Publishing

When the post is ready:
1. Set `draft: false` in frontmatter.
2. Build and preview locally: `hugo server --buildDrafts` → `hugo server`
3. Commit with a signed commit: `git commit -sS -m "Add blog: Post Title"`
4. Open a pull request against the upstream `main` branch.

---

## Standalone Pages

Standalone pages live directly in `content/en/` as `.md` files. Each page uses a specific Hugo layout defined in `themes/memmachine/layouts/`. The layout is matched by the page's `type` or filename.

To add a new standalone page:
1. Create `content/en/your-page.md` with appropriate frontmatter.
2. Create a matching layout in `themes/memmachine/layouts/your-page.html`.
3. Optionally add it to a menu in `hugo.toml`.

Modifying existing standalone pages (text copy, not layout) only requires editing the `.md` file.

---

## Data-Driven Content

Some pages are driven by YAML data files rather than Markdown content. Editing the `.md` file for these pages changes the page metadata (title, description), but the actual cards/entries come from `data/`.

| Page | Data file | What it controls |
|------|-----------|-----------------|
| `/examples` | `data/examples.yaml` | Use-case cards |
| `/integrations` | `data/integrations.yaml` | Integration cards |
| Homepage FAQ | `data/faq.yaml` | FAQ accordion entries |
| Homepage logo marquee | `data/logos.yaml` | Company logos |

See [`docs/data.md`](../docs/data.md) for the schema of each file.

---

## Homepage Content

`content/en/_index.md` contains the text used in the hero and other homepage sections. The homepage layout (`themes/memmachine/layouts/home.html`) pulls copy from this file's frontmatter and body. Changes to homepage marketing copy happen here or in the partial templates.

---

## Build Verification

After any content change, confirm the build succeeds:
```bash
hugo --gc --minify
```

To preview with drafts visible:
```bash
hugo server --buildDrafts --bind 0.0.0.0
```
