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

- [Hugo](https://gohugo.io/getting-started/installing/) (version 0.148.2 or newer)
- [Node.js](https://nodejs.org/) (for asset building)

### Installation

1. Install Hugo (version 0.148.2 or newer):

   See the [official Hugo installation guide](https://gohugo.io/getting-started/installing/) for your platform, or use Homebrew (macOS/Linux):

   ```bash
   brew install hugo
   # Or, to upgrade:
   brew upgrade hugo
   # Or, download from https://github.com/gohugoio/hugo/releases
   ```

   To verify your Hugo version:

   ```bash
   hugo version
   # Should be 0.148.2 or newer
   ```

2. Clone the repository:

   ```bash
   git clone https://github.com/sscaragal/memmachine.github.io.git
   cd memmachine.github.io
   ```

3. Install Node.js dependencies:

   ```bash
   npm install
   ```

### Local Development

To start a local development server:

```bash
hugo server
```

Visit [http://localhost:1313](http://localhost:1313) to view the site.

### Building the Site

To build the static site for production:

```bash
hugo
```

The output will be in the `public/` directory.

## Contributing

Pull requests and issues are welcome! Please follow the [Hugo documentation](https://gohugo.io/documentation/) for content and theme changes.

## License

See [LICENSE](./LICENSE) for details.
