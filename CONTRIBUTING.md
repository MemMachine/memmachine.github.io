# Contributing to MemMachine Website

Thank you for your interest in contributing! We welcome pull requests, bug reports, and suggestions to improve the MemMachine website.

## How to Contribute

1. **Fork the repository**

   - Click the "Fork" button at the top right of the GitHub page.

2. **Clone your fork**

   - `git clone https://github.com/MemMachine/memmachine.github.io.git`

3. **Create a new branch**

   - `git checkout -b my-feature-branch`

4. **Make your changes**

   - Edit content, layouts, styles, or configuration as needed.

5. **Test locally**

   - Ensure you have [Hugo](https://gohugo.io/getting-started/installing/) (v0.148.2 or newer) and Node.js installed.
   - Run `npm install` if you change frontend assets.
   - Start the local server: `hugo server`
   - Visit [http://localhost:1313](http://localhost:1313) to preview your changes.

6. **Commit your changes**

    - All commits must be signed. See [Commit Signing Instructions](https://github.com/microsoft/vscode/wiki/Commit-Signing) for details.
    - Example:

       `git commit -sS -m "Describe your change"`

7. **Push to your fork**

   - `git push origin my-feature-branch`

8. **Open a pull request**

   - Go to the original repository and click "New pull request".

## Guidelines

- Follow the [Hugo documentation](https://gohugo.io/documentation/) for content and theme changes.
- Write clear, descriptive commit messages.
- Keep pull requests focused and concise.
- Ensure your changes do not break the build or site navigation.
- For bug reports or feature requests, open an issue with details and steps to reproduce.

## License

By contributing, you agree that your contributions will be licensed under the terms of the repository's [LICENSE](./LICENSE).
