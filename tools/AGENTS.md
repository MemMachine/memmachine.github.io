# tools/AGENTS.md — Utility Scripts Guide

> **For maintainers and AI agents.** The `tools/` directory contains standalone utility scripts used for site maintenance tasks. These are not part of the Hugo build — they are run manually as needed.

## Tools Overview

| Tool | Location | Purpose |
|------|----------|---------|
| Stargazer Companies Extractor | `tools/stargazers/` | Fetches GitHub stargazers and extracts their company names for the homepage logo marquee |

---

## tools/stargazers/

### What It Does

Queries the GitHub API to get a list of users who have starred the [MemMachine](https://github.com/MemMachine/MemMachine) repository, fetches their public profile data, extracts company names, and writes a cleaned `companies.yaml` file. This YAML is then manually reviewed and used to update `data/logos.yaml` for the homepage marquee.

### When to Run It

Run this tool when you want to refresh the "companies using MemMachine" logo marquee with new stargazers. It is not run automatically — it is a manual, on-demand operation.

### Full Documentation

See [`tools/stargazers/README.md`](stargazers/README.md) for:
- Prerequisites (Python 3, pip, GitHub API token)
- Setup instructions (virtual environment)
- Usage examples
- Output format
- How to apply the output to `data/logos.yaml`

### Quick Reference

```bash
cd tools/stargazers

# Create and activate virtual environment (first time only)
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# Run with a GitHub token (recommended for higher rate limits)
GITHUB_TOKEN=your_token python3 stargazer_companies.py

# Output: companies.yaml in the current directory
# Review, clean, then copy relevant entries to ../../data/logos.yaml
```

---

## Adding New Tools

If you add a new tool to `tools/`:
1. Create a subdirectory: `tools/your-tool/`
2. Include a `README.md` in that directory documenting prerequisites, setup, and usage.
3. Update this file (`tools/AGENTS.md`) with a row in the Tools Overview table.
