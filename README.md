# Foundations of CSE by Namare

Complete notes on the undergraduate Computer Science & Engineering curriculum, written for lecturer interviews and master's admission exams.

Live site: https://foundations-of-cse.vercel.app

Built with [Astro Starlight](https://starlight.astro.build).

## Run locally

```bash
npm install
npm run dev
```

## Adding notes

- Each course is a folder in `src/content/docs/<course>/`. Its `index.md` is the course overview.
- Add a topic note as a new `.md` file in that folder. It appears in the sidebar automatically; set `sidebar.order` in its frontmatter to control position.
- The course list and sidebar groups live in `src/syllabus.mjs`.
- Math works with LaTeX: `$O(n \log n)$` inline, `$$ ... $$` for display equations.
