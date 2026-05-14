# MemMachine Website

This repository contains the source code and content for the MemMachine website, built with [Hugo](https://gohugo.io/), a fast and flexible static site generator.

## Project Structure

- `hugo.toml` — Main Hugo configuration file
- `archetypes/` — Archetype templates for new content
- `content/` — Site content (pages, blog posts, etc.)
- `data/` — Structured data files (YAML)
- `public/` — Generated static site output (do not edit directly)
- `resources/` — Hugo-generated resources
- `static/` — Static assets (images, text files, etc.)
- `themes/` — Hugo themes (main: `memmachine`)
- `package.json` — Node.js dependencies for asset building
- `postcss.config.js` — PostCSS configuration

## Getting Started

### Prerequisites

- [Hugo](https://gohugo.io/getting-started/installing/) **Extended** edition, version 0.149.0 or newer (the Extended edition is required for Sass support)
- [Go](https://go.dev/dl/) 1.25.0 or newer (Hugo module dependency)
- [Node.js](https://nodejs.org/) 22.x or newer (for asset building)

### Installation

1. Install Hugo **Extended** (version 0.149.0 or newer):

   See the [official Hugo installation guide](https://gohugo.io/getting-started/installing/) for your platform, or use Homebrew (macOS/Linux):

   ```bash
   brew install hugo
   # Or, to upgrade:
   brew upgrade hugo
   # Or, download from https://github.com/gohugoio/hugo/releases
   ```

   To verify your Hugo version (must show `extended`):

   ```bash
   hugo version
   # Should show: hugo v0.149.0+extended ...
   ```

2. Install Go (required as a Hugo module dependency):

   Download from [go.dev/dl](https://go.dev/dl/) or use your system package manager.

3. Clone the repository:

   ```bash
   git clone https://github.com/sscaragal/memmachine.github.io.git
   cd memmachine.github.io
   ```

4. Install Node.js dependencies:

   ```bash
   npm install
   ```

### Local Development

To start a local development server:

```bash
hugo server
```

Visit [http://localhost:1313](http://localhost:1313) to view the site.

To bind to all network interfaces (use this in remote development environments, devcontainers, or cloud VMs):

```bash
hugo server --bind 0.0.0.0
```

Then open `http://<your-server-ip>:1313` in your browser.

To preview draft content (new blog posts start as drafts):

```bash
hugo server --buildDrafts
```

### Building the Site

To build the static site for production:

```bash
hugo --gc --minify
```

The output will be in the `public/` directory.

## Contributing

Pull requests and issues are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

**All commits must be signed.** Use `git commit -sS` (both `-s` for Signed-off-by and `-S` for GPG signing).

## For AI Agents

If you are an AI coding assistant (Claude, CodeX, Gemini, etc.), read [AGENTS.md](./AGENTS.md) for a complete orientation: tech stack, directory structure, build commands, content conventions, and critical constraints.

## License

See [LICENSE](./LICENSE) for details.
