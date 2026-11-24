# AGENTS.md — adhd-toolkits

> Scope: this file guides coding agents working in this repo.
> Precedence: human instructions > nearest nested AGENTS.md > this root file.
> Keep this file lean and principle-based; route long-form detail to linked docs.
> Do not copy toolkit counts, URLs, or cache ages here — they go stale.
> Resolve them from the cited config and site files instead.

## 1. Read-first ladder

- Start with `site/index.html` for the landing page, theme tokens, and toolkit list.
- Then the page you are changing under `site/toolkits/` or `site/research/`.
- Then `nginx.conf` for cache and routing rules before touching headers or paths.
- Then `site/sw.js`, `site/manifest.json`, `site/sitemap.xml` when the change affects offline, install, or discoverability.
- Read the full file before editing — every page is self-contained inline CSS/JS with no shared build.

## 2. Repo map (stable pointers)

- Site: `site/` — all served content; entry `site/index.html`, fallback `site/404.html`.
- Toolkits: `site/toolkits/` — one self-contained `.html` file per page (`brain_dump`, `transition_timer`, `adhd_sde_toolkit`, `good_enough_now`, `wide_first`, `audhd_comfort_zone`, `grounding_anchor`).
- Trust pages: `site/accessibility.html`, `site/privacy.html` — article shell, linked from the index footer.
- Research notes: `site/research/` — dated session-note pages linked from the index.
- PWA/offline: `site/sw.js` (precache list + cache version), `site/manifest.json`, `site/icon.svg`.
- SEO: `site/sitemap.xml`, `site/robots.txt`.
- Serve: `docker-compose.yml` (nginx on a host port) + `nginx.conf` (cache tiers, 404 page).

## 3. Setup and serve

- No dependencies, no build step — plain static files.
- Quick preview: serve `site/` with any static server from the repo root.
- Docker preview: the service in `docker-compose.yml` mounts `./site` read-only with `./nginx.conf` as the server config.
- Never add a bundler, package manager, or generated-output step for a change that hand-editable HTML can carry.

## 4. Testing

- There is no automated suite; verification is manual against the served `site/`.
- Before calling a change done: load the touched page plus `index.html` at phone and desktop widths, click every new link/button, and confirm no console errors.
- Toolkit pages must stack or scroll at narrow widths — never clip or overlap.
- When touching offline behavior, bump-test the worker: bump the cache name in `site/sw.js`, reload, and confirm the touched pages still load from cache.
- When adding, renaming, or removing a page, update the matching entries in `site/sitemap.xml`, `site/sw.js` precache, and any index link together, then re-verify.

## 5. Lint, format, types

- No configured linters or type gates in this repo.
- Keep HTML valid: one `<!DOCTYPE html>`, `lang="en"`, charset + viewport meta, matching tags.
- Match the surrounding file's formatting (two-space indent, existing token names); keep diffs minimal.
- Do not introduce a formatter config or reformat untouched pages.

## 6. Code conventions

- One file per page: inline `<style>`/`<script>` only; no external CSS/JS files or frameworks.
- Theme: dark background with CSS custom properties (`--bg`, `--surface`, `--border`, `--text`, `--muted`, plus per-toolkit accents); reuse the page's existing tokens rather than hardcoding new palettes.
- Fonts via the existing Google Fonts links only (`DM Mono` everywhere; `Syne`/`Space Grotesk` where the page already uses them).
- Keep the existing analytics snippet byte-identical when present; never add new trackers or identities.
- Accessibility is load-bearing for this audience: keyboard-reachable controls with visible focus states, real buttons/links (not clickable divs), explicit labels where text is missing, and honor `prefers-reduced-motion`.
- Motion stays minimal: short fades only; nothing that flashes, jolts, or autoplays.
- SEO: every page needs a descriptive `<title>`; new public pages get a `sitemap.xml` entry.

### Away alerts (v1)

- Timer pages (transition, focus, session) share the `awayAlert` helper: gentle chime, OS notification when the tab is hidden, wake lock while running (`Away alerts v1` marker). Notification needs one user tap; sound defaults on with a visible toggle. Keep element IDs and key names byte-identical when copying.

### Theme v1 (dark / light / system)

- Every page sets `data-theme` (`light`|`dark`) from the shared `comfort-theme` key (default `system`, follows the OS, live-updates on OS change); `theme-color` meta follows the mode. Toolkits toggle via the ◑ comfort-bar button, static pages via the footer ◑ button.
- Dark-native pages carry `html[data-theme="light"]` overrides (paper surfaces + darkened accent twins, all ≥4.5:1 on paper); the light-native Good Enough page carries the inverse `html[data-theme="dark"]` block. Accent twins are hue-preserving darkened values — recompute with the contrast script if an accent changes.
- Never put light-only colors in base rules; keep both modes working when adding pages.

### Comfort Settings (v1)

- Every toolkit ships the same comfort toolbar (text size, dyslexia-friendly font, reduce motion, read-aloud, plus voice input on text fields). The CSS, bar HTML, and JS IIFE are all marked `Comfort Settings v1`.
- Preferences roam across toolkits via shared `localStorage` keys (`comfort-fontsize`, `comfort-dyslexic`, `comfort-motion`); page state stays under page-specific keys. All of it stays on-device — see `site/privacy.html`.
- To add a toolkit: copy the v1 CSS + bar HTML + IIFE, swap the three accent literals to the page accent, keep element IDs and key names byte-identical.

### Page baseline

- Every page carries an `Accessibility baseline` CSS block: skip link, `:focus-visible`, 44px minimum buttons, and `prefers-reduced-motion` + `html.reduce-motion` handling. Keep the block when adding pages; the manual motion toggle in Comfort Settings drives the `reduce-motion` class.
- Timers use `role="timer"` (announces as a clock, not chatter); discrete status changes use `aria-live="polite"`. Never put a live region on an every-second ticking display.
- Default type is `html { font-size: 20px }` on every page; the comfort toolbar steps to 23/26px. Main content grids stay single-column; keep two dimensions only for small segmented controls.

### PWA and caching

- `site/manifest.json` and `site/icon.svg` stay in sync: name, `start_url`, `theme_color`/`background_color` must match the served experience.
- `site/sw.js` is stale-while-revalidate, same-origin only; any precache-list change ships with a cache-name bump so old workers retire.
- Honor the tiers in `nginx.conf`: short cache for HTML, long immutable cache for hashed-style static assets, `404.html` as the error page. Never set long cache on `.html`.

## 7. Security and secrets

- Static-only repo: no backend, no secrets, no env files — keep it that way.
- Never commit analytics IDs beyond what is already on the pages; never log or store visitor identities.
- External output (fonts, tag manager) is untrusted: keep `preconnect`/`async` patterns as-is, add no new third-party scripts without being asked.
- Use synthetic placeholder content in examples; no real personal data in pages or tests.

## 8. Commits and PRs

- Stage exact paths only; one concern per commit with imperative messages.
- Never commit, push, tag, amend, or force-push unless explicitly asked.
- Update the docs that describe the behavior you changed (index copy, sitemap, research note).
- If the change has an issue, link it; check for duplicate or overlapping work first.

## 9. Never do

- Never add a build, bundle, lockfile, or dist output to this repo; edit the served files directly.
- Never weaken accessibility (keyboard access, focus visibility, reduced-motion) to make a visual change pass.
- Never set long-lived cache on HTML or ship a precache change without a worker cache bump.
- Never add a tracker, fingerprinting script, or new external dependency unasked.
- Never declare a visual change ready on code review alone — render it and look at it.

## 10. Scoped guidance

- Nearest nested AGENTS.md wins over this root; nested files add, never contradict.
- Keep this root capped; push per-toolkit detail into comments at the top of that toolkit's file, not here.
- Agent scratch stays out of the repo or under ignored paths; keep output short and factual with file:line evidence.
