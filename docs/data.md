# docs/data.md — Structured Data Files Guide

> **For content editors and AI agents.** The `data/` directory contains YAML files that drive dynamic sections of the site. Templates read these files at build time to render cards, lists, and components.
>
> **Note:** Documentation cannot live inside `data/` itself — Hugo treats every file there as structured data and fails on Markdown. This guide lives in `docs/` instead.

## Overview

| File | Page/Section | Template |
|------|-------------|---------|
| `data/examples.yaml` | `/examples` page | `themes/memmachine/layouts/examples.html` |
| `data/faq.yaml` | Homepage FAQ section | `themes/memmachine/layouts/_partials/faq.html` |
| `data/integrations.yaml` | `/integrations` page | `themes/memmachine/layouts/integrations.html` |
| `data/logos.yaml` | Homepage logo marquee | `themes/memmachine/layouts/_partials/logo-marquee.html` |

---

## data/examples.yaml

Drives the use-case cards displayed on the `/examples` page.

**Schema:**
```yaml
- title: "Card Title"           # string, required — displayed as card heading
  icon: "fa-solid fa-chess-board"  # string, required — FontAwesome class
  text: "Description..."        # string, required — shown as card body text
  url: "https://..."            # string, required — card link target
```

**To add an example:** append a new YAML list item following the schema above. Order in the file determines display order on the page.

**To remove an example:** delete the corresponding list item block (the `-` line through the `url:` line).

---

## data/faq.yaml

Drives the FAQ accordion section on the homepage.

**Schema:**
```yaml
- question: "Question text?"    # string, required — accordion header
  answer: "Answer text..."      # string, required — accordion body; supports Markdown links
```

**Markdown in answers:** Hugo renders the answer through the template, so standard Markdown link syntax works: `[link text](https://url)`.

**To add a FAQ entry:** append a new list item. Order in the file is the display order.

**To edit an answer:** find the matching `question:` and update the `answer:` value.

---

## data/integrations.yaml

Drives the integration cards on the `/integrations` page.

**Schema:**
```yaml
- title: "Integration Name"     # string, required — card heading
  icon: "fa-solid fa-link"      # string, required — FontAwesome class
  text: "Description..."        # string, required — card body text
  url: "https://..."            # string, required — "Learn more" link; use "#" as placeholder
```

**Note:** Several entries currently use `url: "#"` as a placeholder for coming-soon integrations. Update the URL when documentation is ready.

---

## data/logos.yaml

Drives the scrolling company logo marquee on the homepage. Updated periodically by the `tools/stargazers/` script.

**Schema:**
```yaml
- name: "Company Name"          # string, required — used as alt text and title attribute
  logo: "https://..."           # string, required — URL to company logo image (PNG or SVG)
  url: "https://..."            # string, optional — company website; omit if unknown
```

**Manual updates:** To add a company manually, append a new list item with `name` and `logo`. The `logo` field should be a direct image URL (e.g., a GitHub organization avatar URL).

**Automated updates:** The `tools/stargazers/` script queries the GitHub API and regenerates a `companies.yaml` with new stargazers' companies. Review the output and merge into `data/logos.yaml`. See [`tools/AGENTS.md`](../tools/AGENTS.md) for instructions.

---

## Adding New Data Files

To add a new data file:
1. Create `data/your-file.yaml` following the YAML schema you need.
2. Reference it in a Hugo template using `{{ site.Data.your_file }}` (Hugo converts hyphens to underscores in variable names).
3. Create or update the template that reads the data.

Data files are consumed only at build time — there is no runtime data fetching.

---

## YAML Formatting Rules

- Use 2-space indentation.
- Strings with colons or special characters must be quoted.
- Long text values: use a quoted string on one line or a YAML literal block scalar (`|`).
- Do not use tabs.
- Validate YAML before committing:
  ```bash
  python3 -c "import yaml; yaml.safe_load(open('data/faq.yaml').read()); print('OK')"
  ```
