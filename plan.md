# Personal Site — Implementation Spec

**Owner:** Anikait Singh Matharu
**Type:** Personal site — portfolio + tech blog + informal writing, single site
**Stack:** SvelteKit

## Performance budget — hard constraint

Target: **each page's initial HTML response stays under ~14KB** (roughly one
TCP slow-start window, so the whole first paint can arrive in a single round
trip). This is a real constraint on every implementation decision below, not
a nice-to-have:

- SvelteKit compiles away at build time (no virtual DOM runtime shipped like
  React/Vue), which is why it's a reasonable fit for this budget — but its
  default client-side hydration bundle still adds weight beyond a hand-written
  static page. Mitigate this: disable hydration on pages that don't need
  interactivity (`export const csr = false` in SvelteKit, keeping them fully
  static HTML/CSS), and keep the one genuinely interactive bit — the theme
  toggle — as a small inline vanilla script rather than a hydrated Svelte
  component, so it works even on `csr = false` pages.
- Minify HTML/CSS/JS for the deployed output (SvelteKit's production build
  does this by default; don't disable it).
- **ASCII art fits this budget naturally** — it's plain text, effectively
  free, unlike a raster image. This is one more reason to keep it ASCII
  rather than switching to a real image/illustration later.
- Google Fonts (JetBrains Mono) adds an extra network round trip and file
  weight outside the 14KB HTML budget. Flag this as an open trade-off to
  settle when the tech stack is picked: either (a) self-host a subsetted
  woff2 to control the cost precisely, (b) fall back to a system monospace
  stack (`ui-monospace, "SF Mono", Menlo, Consolas, monospace`) with
  JetBrains Mono as a non-blocking progressive enhancement, or (c) accept the
  extra request. Don't decide this yet — just don't build anything that
  assumes the font request is free.
- As the blog grows, per-post pages naturally get heavier — that's expected
  and fine. The 14KB target is about keeping the _shell_ (layout, nav, CSS)
  lean, not capping total content forever.

## Hosting & content workflow

- **Static site, hosted on GitHub Pages** (`*.github.io`), built with
  **SvelteKit** using `@sveltejs/adapter-static`.
- Content authored in **Markdown**. Use `mdsvex` (or equivalent) so blog
  posts and long-form content are `.md`/`.svx` files with frontmatter, not
  hand-written Svelte components.
- GitHub Pages can't build SvelteKit natively, so `git push` should trigger a
  **GitHub Actions** workflow that runs the SvelteKit build and deploys the
  static output (e.g. to a `gh-pages` branch or Pages' own Actions
  deployment). Pushing a new `.md` post is the only thing the owner should
  need to do day-to-day — the Action handles the rest.
- Route structure should map directly to the site's filesystem metaphor:
  `/projects`, `/projects/[slug]`, `/writing/[category]`,
  `/writing/[category]/[slug]`.

## Design philosophy

The site is built around one metaphor: **the site is a filesystem / terminal
session**, because that's genuinely how the owner thinks and works (systems
programming, embedded, GPU internals, LLVM/Clang, GDB). Sections are framed as
commands and directories (`$ ls projects/`, `$ cat skills.txt`), projects are
listed like a directory tree, blog categories are subfolders. This is a
structural choice, not decoration — don't add the metaphor anywhere it doesn't
literally fit the content.

Tone: plain, direct, no marketing language. The owner does what he's
interested in and cares about free and open-source software because he
values freedom — that should come through in the bio copy and the general
voice (matter-of-fact, unpretentious, allergic to fluff and to being handed a
platform), not as a slogan or a labeled "philosophy" section bolted onto the
page.

Keep it minimal: no cards, no shadows, no rounded corners, no gradients, no
stock icons. Hairline 1px borders, sharp corners, generous whitespace,
content-first.

## Typography

- Single typeface throughout: **JetBrains Mono** (Google Fonts), weights 400 /
  500 / 700.
- Body text max width ~64ch. Hierarchy comes from weight, size, and color —
  not from multiple fonts.

## Color — intentionally left open

**Do not lock in a final accent color yet.** The owner wants to land on a
personal brand color separately before this is finalized.

- Build the whole site on **CSS custom properties** (`--bg`, `--fg`, `--muted`,
  `--border`, `--accent`, `--accent-soft`) so the palette is a one-place swap
  later.
- For now, ship in **grayscale only**: `--accent` should default to a neutral
  dark/light gray (e.g. `--fg` itself, or a mid-gray), not orange, not any
  other hue. Nothing in the design should assume a specific hue — no
  orange-tinted glows, no warm gradients baked into the CSS.
- Still build full **light/dark mode** support: system preference
  (`prefers-color-scheme`) + manual toggle via a `data-theme` attribute,
  persisted in `localStorage` (wrapped in try/catch).
- Leave a clear `/* TODO: brand accent color */` comment next to the
  `--accent` token so it's obvious where to drop the real color in later.

## ASCII art — leave space, don't invent final art yet

The hero should have a fixed-width monospace ASCII art slot, but **don't
finalize the artwork** — the owner wants to design/choose this himself later
(could be a portrait, a circuit/chip motif, a logo mark, etc.).

- Reserve a `<pre class="ascii-hero" aria-hidden="true">` block in the hero,
  sized for roughly a 24–30 char wide, 10–14 line piece (matches how the
  reference build's chip art was sized).
- Put clearly-marked **placeholder art** in it for now — something obviously
  a placeholder, e.g. a simple bordered box with `[ ascii art goes here ]`
  centered inside it, not a finished illustration. Comment above it:
  `<!-- TODO: replace with final ASCII art -->`.
- Make sure the surrounding layout (hero grid, spacing) doesn't assume a
  specific art size — it should hold up whether the final piece is 10 lines
  or 20.

## Content

Use this copy directly; don't invent additional sections or fluff it up.

### Nav

`st3alt4` (brand mark, blinking cursor block after it) — links: `projects`,
`writing`, `contact` — theme toggle button. Use this brand mark everywhere the
old spec said `asm` (nav, page `<title>`, any favicon/mark), including the
placeholder ASCII art block — don't leave old initials in there.

### Hero

- Name: **Anikait Singh Matharu**
- Role line: an identity line, not a technical descriptor — something like
  `explorer — goes wherever the wind takes him`. Keep it short (one line),
  lowercase to match the rest of the UI's voice, and feel free to tighten the
  wording as long as it keeps that "explorer / wind-led" spirit rather than
  listing technologies.
- Bio (rewrite in the owner's voice — plain, freedom/FOSS-leaning, not
  corporate):
  > Electronics and Computer Engineering student at Thapar University. I work
  > close to the hardware — compiler internals, low-level debugging tools,
  > custom CUDA kernels, real-time embedded deployment. I build what I'm
  > curious about, and I'd rather use and contribute to free, open-source
  > tools than closed ones — that's just how I like to work.
- Links: `github.com/ST3ALT4`, `anikait749@email.com`

### Skills (`$ cat skills.txt`)

| label     | value                                                  |
| --------- | ------------------------------------------------------ |
| languages | C, C++, Rust, Python                                   |
| systems   | Linux, LLVM, Clang, GDB, Make, Git, Docker, Kubernetes |
| embedded  | Jetson Nano, ESP-32, Arduino, Verilog                  |
| gpu / hpc | CUDA, CUDA Python, Numba, CuPy, TensorRT, Vulkan       |
| data / ml | DALI, NumPy, pandas, OpenCV, PyTorch                   |

### Projects (`$ ls projects/`)

1. **c-cpp-variable-inspector/** — C++ / LLVM · Clang / DAP
   A Clang-AST based inspector that statically extracts scope, type and
   symbol structure, then correlates it with a live Debug Adapter Protocol
   session to resolve variable values across nested scopes at runtime.
2. **cuda-pruning-engine/** — Python / Numba CUDA / PyTorch / ResNet-18
   Custom Numba CUDA kernels for magnitude thresholding and sparse matrix
   multiplication, profiled against dense libraries on a T4 GPU to find the
   hardware crossover point where structured pruning actually pays off.
3. **particle-simulator/** — Python / NumPy / OpenCV / Flask / Jetson Nano
   Gesture-driven particle simulator on a Jetson Nano — on-device hand pose
   estimation at 21 keypoints driving six real-time physics modes, streamed
   as MJPEG over Flask for headless browser viewing.

Render as a tree list (`├──` / `└──`), not cards.

### Writing (`$ ls writing/`)

Four category folders, currently empty — say so honestly, don't fake posts:

- `systems/` — low-level debugging, compilers, LLVM internals
- `gpu/` — CUDA kernels, profiling, performance notes
- `embedded/` — Jetson, ESP32, PCB logs
- `unsorted/` — whatever else is on my mind

Below the list: `// empty for now — first post is in the works`

Footer note copy should say `built with sveltekit, hosted on github pages —
2026` instead of the earlier "no framework" line.

### Footer / contact

Short line on current status (Thapar Institute, open to conversations about
systems/embedded/GPU work) + `email` and `github` links. No phone number —
keep that off the public site.

## Technical notes

- SvelteKit + `adapter-static`, deployed to GitHub Pages via a GitHub Actions
  build (see Hosting & content workflow above). Content in Markdown via
  `mdsvex`, routed as `/projects`, `/writing/[category]/[slug]`, etc. — not
  just anchors on one HTML page.
- Stay inside the 14KB-per-page shell budget above — this affects font
  loading, hydration/`csr` settings, and CSS decisions throughout.
- Responsive: hero grid stacks to one column on mobile; ASCII art shrinks
  font-size on narrow viewports rather than breaking layout.
- Accessibility: visible keyboard focus states, respect
  `prefers-reduced-motion` (the only motion in the design is a blinking
  terminal cursor next to the brand mark — disable it under reduced motion).
- Keep runtime client JS to the theme toggle only; don't reach for a Svelte
  store or extra client-side interactivity unless a real need shows up.
