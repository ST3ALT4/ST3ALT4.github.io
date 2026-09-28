# AGENTS.md

Welcome! This repository contains the personal portfolio and blog for **ST3ALT4** (Anikait), built with **SvelteKit 5**, **TypeScript**, **Tailwind CSS v4**, and **MDSveX**.

This file provides guidelines, architecture details, and commands for AI coding assistants working in this repository.

---

## 🛠 Tech Stack & Tools

- **Framework**: [SvelteKit 2](https://svelte.dev/docs/kit) with **Svelte 5** (Runes syntax `$state`, `$derived`, `$props`, etc.)
- **Preprocessors**: [MDSveX](https://mdsvex.pngwn.io/) for markdown blog posts
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/vite` and `@tailwindcss/typography`
- **Adapter**: `@sveltejs/adapter-static` (pre-rendered static site output to `build/`)
- **Theme**: Terminal charcoal/amber palette (`#0c0b09` dark, `#f5f3ee` light, `#d9822b` terminal orange accent) with zero-FOUC theme detector
- **Language**: TypeScript (strict type checking enabled)
- **Formatting & Linting**: Prettier (with Svelte & Tailwind plugins), ESLint (v9 flat config)

---

## 📁 Repository Structure

```
├── src/
│   ├── app.css                 # Global CSS, theme tokens and Tailwind imports
│   ├── app.d.ts                # Ambient TypeScript declarations
│   ├── app.html                # Base HTML template with inline theme detector
│   ├── blogs/                  # Markdown blog posts (.md files)
│   ├── lib/
│   │   ├── assets/             # Static icons/assets (SVG, favicon)
│   │   ├── components/         # Reusable Svelte components
│   │   │   ├── BlogCard.svelte
│   │   │   ├── BlogLayout.svelte
│   │   │   ├── Footer.svelte
│   │   │   └── Toolbar.svelte
│   │   ├── routes.ts           # Navigation route definitions
│   │   └── types.ts            # Shared TypeScript definitions
│   └── routes/                 # SvelteKit file-based routing
│       ├── +layout.svelte      # Root layout (Header, Main, Footer)
│       ├── +layout.ts          # Prerender configuration
│       ├── +page.svelte        # Home / Terminal Landing page
│       ├── +page.ts            # Home loader (queries projects dynamically)
│       └── blog/
│           ├── +page.svelte    # Blog directory view with category filter
│           ├── +page.ts        # Blog index loader
│           └── [slug]/         # Dynamic blog post route
├── static/                     # Static public assets served at root
├── svelte.config.js            # Svelte & MDSveX configuration
├── vite.config.ts              # Vite plugins configuration
├── tsconfig.json               # TypeScript configuration
└── eslint.config.js            # ESLint flat configuration
```

---

## 🚀 Key Commands & Workflows

Run commands from the repository root:

| Command               | Description                                           |
| :-------------------- | :---------------------------------------------------- |
| `npm run dev`         | Starts the local Vite development server              |
| `npm run build`       | Builds and prerenders the static site into `build/`   |
| `npm run preview`     | Previews the production build locally                 |
| `npm run check`       | Syncs SvelteKit types and runs `svelte-check`         |
| `npm run check:watch` | Runs type checks in watch mode                        |
| `npm run format`      | Formats all files using Prettier                      |
| `npm run lint`        | Checks formatting with Prettier and lints with ESLint |

---

## 📝 Content Management Conventions

### 1. Adding / Editing Blog Posts & Projects

- Blog posts live in [`src/blogs/<slug>.md`](src/blogs/).
- Each post must contain YAML frontmatter:
  ```markdown
  ---
  title: Post Title
  date: 'YYYY-MM-DD'
  description: Short summary for preview cards.
  category: 'tech-blog' # 'tech-blog' | 'life-skills' | 'random-stuff'
  tags: ['project', 'cpp', 'dsa'] # Adding 'project' automatically displays it in $ ls projects/
  author: Anikait
  ---

  # Post Content
  ```
- **Automatic Project Detection**: Any blog post tagged with `'project'` is automatically collected and displayed under the `$ ls projects/` tree on the home page, with other tags used as the tech stack breakdown and the description used as the project summary.

---

## 💡 Coding & Style Guidelines

1. **Svelte 5 Patterns**:
   - Utilize modern Svelte 5 Runes (`$props()`, `$state()`, `$derived()`, etc.).
   - Dynamic components render with `<data.Content />` directly instead of `<svelte:component>`.

2. **Styling & Colors**:
   - Dark background: `#0c0b09`, light background: `#f5f3ee`.
   - Accent color: `#d9822b` (dark) / `#c26910` (light).
   - Single typeface throughout: **JetBrains Mono**.
