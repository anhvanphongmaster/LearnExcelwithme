# App Shell Migration (AVP)

## Goal
Unified chrome (fixed header, account, settings, language, theme, Desktop/Mobile) for all public HTML routes without editing each of the 64 pages.

## Architecture
| Layer | Role |
|-------|------|
| `app-shell.html` + `app-shell.css` + `app-shell.js` | Persistent chrome; owns header & prefs; hosts page content in an iframe |
| `sw.js` | Top-level navigations to `*.html` → serve shell; iframe/`?avp_content=1`/`?embed=1` → original page |
| Existing pages | Unchanged body/Hero; `simple-nav.js` already hides chrome when `embed=1` or in iframe |
| `404.html` | GitHub Pages unknown-path fallback → shell |

## Request routing
1. **Top-level navigate** to `/LearnExcelwithme/excel.html` → SW returns `app-shell.html`. Shell sets iframe to `excel.html?embed=1&avp_content=1` and keeps the public URL as `/LearnExcelwithme/excel.html`.
2. **Iframe document request** (`Sec-Fetch-Dest: iframe` or `avp_content=1`) → original HTML (network-first). No shell recursion.
3. **Excluded full-page**: `admin.html`, `auth.html`, `office-quest-admin.html`, `office-quest-world.html`, `offline.html`, `app-shell.html`.
4. **Assets / downloads / external / forms**: untouched (non-navigate or non-HTML).

## Settings
- Key: `avp-settings-v1` → `{ language, theme, layout }`
- Applied in shell **before paint** (inline script) to avoid flash
- Viewport is always `width=device-width, initial-scale=1` — Desktop/Mobile only change layout classes, **not** the old `width=1200` zoom hack
- Legacy `avp-display-mode` is migrated when present

## First-visit limitation (GitHub Pages)
Until the Service Worker is installed and controlling the client, the first hard navigation to an existing HTML file is served as the raw page (GitHub Pages static file). After `sw.js` activates (`clients.claim` + `skipWaiting`), subsequent navigations and refreshes go through the shell.

**Fallback:** `404.html` handles unknown paths. Existing deep links work fully once SW controls the page.

## What was not changed
- Hero markup/CSS on `index.html`
- Supabase schema, policies, secrets, data
- Per-page lesson/tool scripts and modals
- Admin surfaces (remain full document)

## Test checklist
- [ ] Home `/LearnExcelwithme/` after SW active → fixed header + home content
- [ ] Direct `/LearnExcelwithme/excel.html` (refresh, back/forward)
- [ ] Query + hash preserved
- [ ] Theme / language / Mobile|Desktop persist and apply without flash
- [ ] Header stays fixed while scrolling iframe content
- [ ] Auth, admin open full-page (not iframe)
- [ ] Form submit, download, `target=_blank`, OAuth popup still work
- [ ] Console: no shell↔content loop; assets 200
- [ ] Mobile device-width (no forced 1200px zoom)
- [ ] Deploy workflow GitHub Pages succeeds; production URL shows shell chrome

## Deploy
1. Branch from `main` (e.g. `feature/app-shell`)
2. Add/replace: `app-shell.html`, `app-shell.js`, `app-shell.css`, `sw.js`, `404.html`, this doc
3. PR → review → merge → confirm Actions “Deploy GitHub Pages” green
4. Hard-refresh production, verify SW version `learnexcel-assets-v20261030-appshell1`
