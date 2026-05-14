---
name: hugo-chores
description: "Maintenance tasks for the memmachine.github.io Hugo site: upgrade Hugo version in CI/CD, verify the build, update npm dependencies, update vendored theme libraries. Use when the user wants to perform site maintenance."
trigger: /hugo-chores
---

# /hugo-chores

Perform maintenance tasks on the MemMachine website repository. Subcommands handle Hugo version upgrades, build verification, npm dependency updates, and vendored theme library updates.

## Usage

```
/hugo-chores                    # show available subcommands
/hugo-chores upgrade-hugo       # update Hugo version in CI/CD and docs
/hugo-chores verify-build       # run a production build and report results
/hugo-chores update-npm         # audit and update npm dependencies
/hugo-chores update-theme       # check and update vendored theme libraries
```

## Deployment Model

The site deploys automatically. Every push to `main` triggers the GitHub Actions workflow at `.github/workflows/hugo.yaml`, which builds the site with Hugo and deploys the output to GitHub Pages. There is no manual deploy step — merging a PR to `main` is the deploy.

**All tool versions are pinned as `env:` vars at the top of that workflow file:**

```yaml
env:
  DART_SASS_VERSION: 1.99.0
  GO_VERSION: 1.26.3
  HUGO_VERSION: 0.161.1
  NODE_VERSION: 22.22.3
```

To upgrade any tool, edit the corresponding env var in `.github/workflows/hugo.yaml` and push to main.

---

## What You Must Do When Invoked

If no subcommand is given, print the usage above and list the available subcommands with one-line descriptions. Do not run any commands.

If a subcommand is given, follow the steps for that subcommand below.

---

## Subcommand: upgrade-hugo

Upgrades the Hugo version used in CI/CD and updates all version references in documentation.

### Step 1 — Find the current version

```bash
grep -n "HUGO_VERSION\|DART_SASS_VERSION\|GO_VERSION\|NODE_VERSION" .github/workflows/hugo.yaml | head -10
```

Parse all four pinned versions from the workflow file.

### Step 2 — Find the latest releases

Run these in parallel:

```bash
curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | grep '"tag_name"'
curl -s https://api.github.com/repos/sass/dart-sass/releases/latest | grep '"tag_name"'
curl -s https://go.dev/dl/?mode=json | python3 -c "import sys,json; data=json.load(sys.stdin); stable=[r for r in data if r.get('stable')]; print(stable[0]['version'] if stable else 'not found')"
curl -s https://nodejs.org/dist/index.json | python3 -c "import sys,json; releases=[r for r in json.load(sys.stdin) if r['version'].startswith('v22.') and 'lts' in r and r['lts']]; print(releases[0]['version'] if releases else 'not found')"
```

If network access is unavailable, ask the user to provide the latest version numbers.

### Step 3 — Compare versions

If all current versions equal the latest, tell the user all tools are up to date and stop.

If any are newer, proceed with those that need updating.

### Step 4 — Update the workflow file

In `.github/workflows/hugo.yaml`, update the env vars that changed. Use the Edit tool for a targeted replacement of the env block.

Version format notes:
- Hugo and Dart Sass: strip leading `v` (e.g., `v0.161.1` → `0.161.1`)
- Go: strip leading `go` (e.g., `go1.26.3` → `1.26.3`)
- Node.js: strip leading `v` (e.g., `v22.22.3` → `22.22.3`)

### Step 5 — Update documentation

Update version references in these files (use grep first to find exact strings):

```bash
grep -rn "[0-9]\+\.[0-9]\+\.[0-9]\+" README.md AGENTS.md .claude/CLAUDE.md 2>/dev/null | grep -i "hugo\|sass\|go\|node"
```

Files that reference Hugo version: `README.md`, `AGENTS.md`, `.claude/CLAUDE.md`
Files that reference all four tool versions: `AGENTS.md`

Use the Edit tool to update each occurrence found.

### Step 6 — Verify

```bash
hugo version
```

Report the installed Hugo version. Note if it differs from the new CI version (that's expected if the user hasn't installed the new version locally yet).

### Step 7 — Report

Tell the user:
- What was updated (workflow file + which docs)
- Old version → new version for each tool changed
- Reminder to commit the changes: `git commit -sS -m "chore: bump CI tool versions"`
- Note that CI will use the new versions on next push to main

---

## Subcommand: verify-build

Runs a full production build and reports success or failure with useful diagnostics.

### Step 1 — Run the build

```bash
hugo --gc --minify 2>&1
```

### Step 2 — Report results

**On success:** Report:
- "Build successful"
- Total pages built (look for "pages" in hugo output)
- Build time
- Output directory: `public/`

**On failure:** Report:
- The full error message from Hugo
- Which file caused the error (if identifiable from the output)
- Suggested fix based on the error type

Common error types and fixes:
- `template: ... execute of template failed` — template syntax error in `themes/memmachine/layouts/`
- `YAML parse error` — malformed frontmatter in a content file or data file
- `Error: module ... not found` — run `hugo mod tidy` or check `hugo.toml`
- `Sass compilation error` — CSS syntax error in `themes/memmachine/assets/css/`

### Step 3 — Clean up

If build succeeded, the `public/` directory now contains the built site. Remind the user that `public/` is gitignored and should not be committed.

---

## Subcommand: update-npm

Audits and updates Node.js dependencies (PostCSS, Autoprefixer).

### Step 1 — Check for vulnerabilities

```bash
npm audit
```

Report the number of vulnerabilities found by severity. If none, say so.

### Step 2 — Update dependencies

```bash
npm update
```

### Step 3 — Verify the build still passes

```bash
hugo --gc --minify 2>&1
```

If the build fails after the npm update, report the error. The user may need to investigate the breaking change in the updated package.

### Step 4 — Report

Tell the user:
- Which packages were updated and to what versions (compare `package.json` before and after)
- Whether the build passed
- Reminder to commit: `git commit -sS -m "chore: update npm dependencies"`

---

## Subcommand: update-theme

Checks and updates the vendored third-party libraries used by the memmachine theme. The theme vendors libraries directly as minified files rather than using a package manager.

### Theme library inventory

| Library | Vendored files | How to detect version |
|---------|---------------|----------------------|
| Bootstrap (CSS) | `themes/memmachine/assets/css/bootstrap.min.css` | First line comment: `Bootstrap v5.3.8` |
| Bootstrap (JS) | `themes/memmachine/assets/js/bootstrap.bundle.min.js` | First line comment: `Bootstrap v5.3.8` |
| Lenis (CSS) | `themes/memmachine/assets/css/lenis.css` | File is unminified; version not embedded — check git blame or cross-reference JS |
| Lenis (JS) | `themes/memmachine/assets/js/lenis.min.js` | First 200 chars contain `"1.3.23"` (bare version string, first quoted number) |
| Font Awesome | CDN in `themes/memmachine/layouts/_partials/head.html` | `grep 'font-awesome' themes/memmachine/layouts/_partials/head.html` |

**Note:** `themes/memmachine/assets/css/aos.min.css` is vendored but **not included** in the CSS bundle (`themes/memmachine/layouts/_partials/head/css.html`) and not loaded by any layout — skip it.

### Step 1 — Detect current versions

```bash
# Bootstrap version (from CSS comment)
head -2 themes/memmachine/assets/css/bootstrap.min.css | grep -o 'Bootstrap v[0-9.]*'

# Lenis version (from JS string)
python3 -c "
import re
with open('themes/memmachine/assets/js/lenis.min.js') as f:
    c = f.read(300)
m = re.search(r'[^0-9]([0-9]+\.[0-9]+\.[0-9]+)[^0-9]', c)
print('Lenis:', m.group(1) if m else 'not found')
"

# Font Awesome version (from CDN URL)
grep -o 'font-awesome/[0-9.]*' themes/memmachine/layouts/_partials/head.html
```

### Step 2 — Check latest versions

Run these in parallel:

```bash
# Bootstrap latest
curl -s https://api.github.com/repos/twbs/bootstrap/releases/latest | grep '"tag_name"'

# Lenis latest
curl -s https://registry.npmjs.org/lenis/latest | python3 -c "import sys,json; d=json.load(sys.stdin); print('lenis:', d['version'])"

# Font Awesome latest
curl -s https://api.github.com/repos/FortAwesome/Font-Awesome/releases/latest | grep '"tag_name"'
```

### Step 3 — Compare and decide

Build a table of current vs. latest. For any library that is already up to date, skip it. For any that has a newer release, proceed to update it.

### Step 4 — Update outdated libraries

#### Updating Bootstrap

Download new CSS and JS from jsDelivr, replacing the vendored files:

```bash
BOOTSTRAP_VERSION=5.3.8   # use the actual latest version

curl -sL "https://cdn.jsdelivr.net/npm/bootstrap@${BOOTSTRAP_VERSION}/dist/css/bootstrap.min.css" \
  -o themes/memmachine/assets/css/bootstrap.min.css

curl -sL "https://cdn.jsdelivr.net/npm/bootstrap@${BOOTSTRAP_VERSION}/dist/js/bootstrap.bundle.min.js" \
  -o themes/memmachine/assets/js/bootstrap.bundle.min.js
```

Verify the download by checking the version comment:
```bash
head -2 themes/memmachine/assets/css/bootstrap.min.css | grep -o 'Bootstrap v[0-9.]*'
```

#### Updating Lenis

Download new CSS and JS from jsDelivr:

```bash
LENIS_VERSION=1.3.23   # use the actual latest version

curl -sL "https://cdn.jsdelivr.net/npm/lenis@${LENIS_VERSION}/dist/lenis.css" \
  -o themes/memmachine/assets/css/lenis.css

curl -sL "https://cdn.jsdelivr.net/npm/lenis@${LENIS_VERSION}/dist/lenis.min.js" \
  -o themes/memmachine/assets/js/lenis.min.js
```

Verify by checking the version string in the new JS:
```bash
python3 -c "
import re
with open('themes/memmachine/assets/js/lenis.min.js') as f:
    c = f.read(300)
m = re.search(r'[^0-9]([0-9]+\.[0-9]+\.[0-9]+)[^0-9]', c)
print('Lenis:', m.group(1) if m else 'not found')
"
```

#### Updating Font Awesome

Edit the CDN URL in `themes/memmachine/layouts/_partials/head.html`. The line looks like:

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" ...>
```

Use the Edit tool to replace only the version number in the URL. Do not change any other attributes.

### Step 5 — Verify build

```bash
hugo --gc --minify 2>&1
```

If the build fails, the most likely causes are:
- A Lenis API change requiring a JS update in `themes/memmachine/assets/js/custom.js`
- A Bootstrap breaking change in CSS class names

If the build fails, revert the specific failing library and report the issue to the user.

### Step 6 — Report

Tell the user:
- Which libraries were updated (old → new version)
- Which were already up to date
- Build result
- Reminder to commit: `git commit -sS -m "chore: update vendored theme libraries"`

---

## Evaluations

### Evaluation 1: upgrade-hugo with newer version available

**Setup:** Current workflow has `HUGO_VERSION: 0.149.0`. Latest GitHub release is `v0.161.1`.

**Expected behavior:**
- Detects current versions from workflow file
- Fetches latest from GitHub/Go/Node APIs
- Updates `.github/workflows/hugo.yaml` env block
- Updates version references in `README.md`, `AGENTS.md`, `.claude/CLAUDE.md`
- Reports: "Updated Hugo from 0.149.0 to 0.161.1"

**Pass criteria:** All files updated with correct version string; no other files modified.

---

### Evaluation 2: verify-build on clean repository

**Setup:** Repository has no uncommitted changes; all content and templates are valid.

**Expected behavior:**
- Runs `hugo --gc --minify`
- Build succeeds
- Reports page count and build time
- Does not commit or push anything

**Pass criteria:** Build passes; only read-only operations and the hugo command are run; `public/` is not staged for commit.

---

### Evaluation 3: update-theme with Bootstrap and Lenis outdated

**Setup:** `bootstrap.min.css` first line shows `Bootstrap v5.3.2`. Lenis JS has `"1.1.14"`. Font Awesome CDN shows `7.0.0`. Latest Bootstrap is `v5.3.8`, Lenis is `1.3.23`, Font Awesome is `7.2.0`.

**Expected behavior:**
- Detects all three as outdated
- Downloads Bootstrap 5.3.8 CSS and JS from jsDelivr
- Downloads Lenis 1.3.23 CSS and JS from jsDelivr
- Edits Font Awesome version in `head.html`
- Verifies build passes
- Reports all three updated

**Pass criteria:** All three libraries at new versions; build passes; no other files modified.
