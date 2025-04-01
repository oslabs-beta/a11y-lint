# :test_tube: a11y-lint — Accessibility Linter for HTML, CSS & JSX
a11y-lint is a lightweight developer-focused linter that scans **HTML**, **CSS**, and **JSX** files for common accessibility issues **during development** — right in your code editor.
---
## :bulb: Why We Built This
Web accessibility is **too often an afterthought**, discovered only in audits or by users who face barriers. Popular tools like [Axe](https://www.deque.com/axe/) are excellent, but they:
- Rely on runtime in-browser testing
- Are not always friendly for dev-first feedback
- Can feel too heavy or complex for small projects
:wrench: **a11y-lint** solves this by working like ESLint — it gives **instant feedback in the editor** as you type.
---
## :rocket: What Makes It Different?
| Feature                  | a11y-lint                             | Axe (and others)         |
|--------------------------|---------------------------------------|--------------------------|
| Works in VS Code         | :white_check_mark: Yes                                 | :x: (browser only)         |
| Runs statically on save  | :white_check_mark: Yes                                 | :x: Needs runtime          |
| Custom rules per filetype| :white_check_mark: HTML, CSS, JSX                      | :white_check_mark: (but abstracted)       |
| Lightweight setup        | :white_check_mark: Simple, no browser dependency       | :x: Requires browser/iframe|
| Developer-first workflow | :white_check_mark: Lints code during writing           | :x: After-the-fact         |
---
## :gear: Quick Start
1. Clone or install the extension from source
2. Run your dev server with the extension active in VS Code
3. a11y-lint will highlight WCAG issues in HTML, CSS, or JSX files as you code
---
## :package: Installation (Dev / Local)
```bash
git clone https://github.com/your-username/a11y-lint
cd a11y-lint
npm install
npm run build
Then in VS Code:
Open the project
Press F5 to launch the extension in a new Extension Development Host
:test_tube: Usage
Simply open a project with .html, .css, or .jsx files and start editing.
a11y-lint will parse your code and show inline issues like:
:octagonal_sign: Missing <html lang="...">
:octagonal_sign: <img> missing alt
:warning: <title> is empty
:warning: Text contrast too low (CSS)
:warning: Headings skipped levels (soon)
Each issue provides:
Line/column location
Severity (error or warning)
Optional fix message
:brain: How It Works
Parsers
HTML → parse5
CSS → postcss (with walkRules)
JSX → @babel/parser + AST traversal
Rule Engine
Uses file-type specific rules: htmlRules, cssRules, jsxRules
Centralizes WCAG references and messages
Output
Uniform Issue[] objects for consistent feedback in the editor