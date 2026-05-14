---
name: write-blog
description: "Create a correctly structured MemMachine blog post: right directory path, complete frontmatter, and image placeholder. Use when the user wants to write a new blog post for memmachine.ai."
trigger: /write-blog
---

# /write-blog

Create a new blog post for the MemMachine website (`memmachine.github.io`) with the correct directory structure, complete YAML frontmatter, and build verification.

## Usage

```
/write-blog                      # interactive — prompts for all fields
/write-blog "Post Title"         # pre-fill the title, prompt for remaining fields
```

## What You Must Do When Invoked

Follow these steps in order. Do not skip steps.

### Step 1 — Collect post metadata

If any of the following are not provided in the invocation arguments, ask for them now (you may ask for all missing fields in a single message):

| Field | Required | Notes |
|-------|----------|-------|
| **title** | Yes | Full post title (e.g., "MemMachine Now Supports LangGraph") |
| **author** | Yes | Author's full name as it should appear on the post |
| **description** | Yes | One sentence for SEO and social preview cards |
| **tags** | Yes | Comma-separated list (e.g., "AI Agent, Integration, LLM"). Always include at least one. |
| **date** | Yes | Publish date in `YYYY-MM-DD` format. Defaults to today if not provided. |
| **featured** | No | Should this post appear in the homepage carousel? (add tag `"featured"`) |

### Step 2 — Derive the slug and path

From the title:
1. Lowercase the entire title.
2. Replace spaces and any non-alphanumeric characters with hyphens.
3. Collapse multiple consecutive hyphens into one.
4. Strip leading and trailing hyphens.

From the date, extract `YYYY` and `MM` (zero-padded).

Construct the directory path:
```
content/en/blog/{YYYY}/{MM}/{slug}/
```

Example: title "MemMachine Joins NVIDIA NeMo Toolkit", date 2026-04-27:
- slug: `memmachine-joins-nvidia-nemo-toolkit`
- path: `content/en/blog/2026/04/memmachine-joins-nvidia-nemo-toolkit/`

### Step 3 — Format the date field

Convert the date to RFC 3339 format with a timezone offset. Use Pacific Time as default if not specified:
```
YYYY-MM-DDTHH:MM:SS-08:00   # Pacific Standard Time
YYYY-MM-DDTHH:MM:SS-07:00   # Pacific Daylight Time (summer)
```
Default time: `09:00:00` (9 AM).

### Step 4 — Build the tags array

Start with the user-provided tags. Clean each tag:
- Preserve original capitalization (e.g., "AI Agent", "LLM", "NeMo").
- Wrap each in quotes, comma-separated.

If the user said yes to featuring the post, append `"featured"` to the array.

### Step 5 — Create the post

Create the directory and `index.md` using the Write tool:

```markdown
---
title: "{title}"
date: {RFC 3339 date}
featured_image: "featured_image.png"
tags: [{tags array}]
author: "{author}"
description: "{description}"
draft: false
---

<!-- 
  Replace this comment with your blog post content.
  
  BEFORE PUBLISHING:
  1. Add featured_image.png to this directory (same folder as this index.md)
  2. Set draft: false in the frontmatter above
  3. Preview: hugo server --buildDrafts --bind 0.0.0.0
  4. Build check: hugo --gc --minify
  5. Commit with signed commit: git commit -sS -m "Add blog: {title}"
-->
```

### Step 6 — Report and next steps

After creating the file, tell the user:

1. The exact file path created.
2. That `featured_image.png` must be placed in the same directory as `index.md` before publishing.
3. The preview command: `hugo server --buildDrafts --bind 0.0.0.0`
4. The URL where the post will appear when published: `/blog/{YYYY}/{MM}/{slug}/`
5. That they must set `draft: false` before opening a pull request.

---

## Evaluations

### Evaluation 1: Full fields provided

**Input:** `/write-blog "MemMachine Reaches 1000 Stars" author="Jane Smith" description="MemMachine celebrates a community milestone." tags="AI Memory, Community, Open Source" date=2026-06-01 featured=yes`

**Expected behavior:**
- No prompts (all fields provided)
- Creates `content/en/blog/2026/06/memmachine-reaches-1000-stars/index.md`
- Frontmatter includes `"featured"` in tags array
- `draft: false` is set
- Reports file path and next steps

**Pass criteria:** File created at correct path with all frontmatter fields populated correctly.

---

### Evaluation 2: Missing required field

**Input:** `/write-blog "New Integration Post"` (no author, description, tags, date)

**Expected behavior:**
- Prompts for missing fields in a single message: author, description, tags, date, and whether to feature
- After user provides answers, creates the file at the correct path
- Does not proceed to file creation before all required fields are collected

**Pass criteria:** Skill asks for missing fields before creating any files.

---

### Evaluation 3: Title with special characters

**Input:** title = `"MemMachine v0.3: What's New & Why It Matters"`

**Expected slug:** `memmachine-v0-3-whats-new-why-it-matters`

**Expected behavior:**
- Colon, apostrophe, ampersand all converted to hyphens
- Multiple consecutive hyphens collapsed
- Correct directory path derived from slug

**Pass criteria:** Slug contains only lowercase letters, digits, and hyphens; no consecutive hyphens; no special characters.
