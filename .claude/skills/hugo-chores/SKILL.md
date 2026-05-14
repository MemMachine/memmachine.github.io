---
name: hugo-chores
description: "Maintenance tasks for the memmachine.github.io Hugo site: upgrade Hugo version in CI/CD, verify the build, update npm dependencies. Use when the user wants to perform site maintenance."
trigger: /hugo-chores
---

# /hugo-chores

Perform maintenance tasks on the MemMachine website repository. Subcommands handle Hugo version upgrades, build verification, and npm dependency updates.

## Usage

```
/hugo-chores                    # show available subcommands
/hugo-chores upgrade-hugo       # update Hugo version in CI/CD and docs
/hugo-chores verify-build       # run a production build and report results
/hugo-chores update-npm         # audit and update npm dependencies
```

## Deployment Model

The site deploys automatically. Every push to `main` triggers the GitHub Actions workflow at `.github/workflows/hugo.yaml`, which builds the site with Hugo and deploys the output to GitHub Pages. There is no manual deploy step — merging a PR to `main` is the deploy.

**All tool versions are pinned as `env:` vars at the top of that workflow file:**

```yaml
env:
  DART_SASS_VERSION: 1.91.0
  GO_VERSION: 1.25.0
  HUGO_VERSION: 0.149.0
  NODE_VERSION: 22.18.0
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
grep -n "HUGO_VERSION\|hugo-version\|hugo Extended" .github/workflows/hugo.yaml | head -10
```

Parse the current version from the workflow file (look for the version string in the Hugo setup step, typically `extended_0.149.0` or similar format).

### Step 2 — Find the latest Hugo release

```bash
# Check the latest release tag from the Hugo GitHub releases page
curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | grep '"tag_name"'
```

If network access is unavailable, ask the user to provide the latest version number.

### Step 3 — Compare versions

If the current version equals the latest, tell the user: "Hugo is already at the latest version (vX.X.X). No update needed." and stop.

If the latest is newer, proceed.

### Step 4 — Update the workflow file

In `.github/workflows/hugo.yaml`, update the `HUGO_VERSION` env var at the top of the `build` job. Use the Edit tool for a targeted replacement.

The exact line to change (no quotes around the version):
- `HUGO_VERSION: 0.149.0` → `HUGO_VERSION: {new_version}` (without a leading `v`)

### Step 5 — Update documentation

Update version references in these files (use grep first to find exact strings):

```bash
grep -n "0\.14[0-9]\|hugo.*version\|Hugo.*version" README.md AGENTS.md 2>/dev/null
```

Use the Edit tool to update each occurrence found.

### Step 6 — Verify

```bash
hugo version
```

Report the installed Hugo version. Note if it differs from the new CI version (that's expected if the user hasn't installed the new version locally yet).

### Step 7 — Report

Tell the user:
- What was updated (workflow file + which docs)
- Old version → new version
- Reminder to commit the changes: `git commit -sS -m "chore: upgrade Hugo to v{new_version}"`
- Note that CI will use the new version on next push to main

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

## Evaluations

### Evaluation 1: upgrade-hugo with newer version available

**Setup:** Current workflow has `extended_0.149.0`. Latest GitHub release is `v0.151.0`.

**Expected behavior:**
- Detects current version as `0.149.0`
- Detects latest as `0.151.0`
- Updates `.github/workflows/hugo.yaml` to `extended_0.151.0`
- Updates version references in `README.md` and `AGENTS.md`
- Reports: "Updated Hugo from 0.149.0 to 0.151.0 in 3 files"

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
