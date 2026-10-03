# Rebecca & Thomas: wedding website

Personalised wedding website for Rebecca Bonavia and Thomas Bowers.
Wedding: Saturday 10 July 2027, Malta. Adults-only.
Live site: https://rebeccaandthomas.net

Phase 1 (save-the-date) is live. Phase 2 (formal invitations) is starting.
Guests are using the live site, so treat every change as a production change.

## How to work with me (Tom)

- **Plan first, always.** Propose an outline and wait for my explicit sign-off before editing anything. A genuine back-and-forth, not one round of questions and then building.
- **One change at a time.** Small, targeted edits with a verification step between each.
- **Never hand me a broken file.** Run `node --check` on any extracted JS before saying a change is done.
- **Commit after each verified change**, with a message that says what changed and why.
- Debugging is console-log driven: add targeted logs, confirm the fix, then remove the logs.
- Establish a known-good base, then apply changes cleanly on top. If a change goes wrong, roll back rather than patching over it.

## Stack

- **Webflow** (paid hosting) serves the page. The page markup is pasted into a Webflow Embed element, and the Webflow **Site settings** custom code fields (Head code, Footer code) contain only tags that load the CSS and JS. The home page's **page-level** custom code fields (Page settings → Custom code) are intentionally empty. Keep them empty so nothing is loaded twice or sets `__rtInitDone` ahead of `main.js`.
- **GitHub Pages** serves `site/main.css` and `site/main.js`, deployed automatically on push to `main` by `.github/workflows/pages.yml`.
- **Domain:** rebeccaandthomas.net, DNS on GoDaddy.
- **Guest data:** Google Sheet, published as CSV, read client-side.
- **RSVP backend:** Google Apps Script, writing to Google Sheets.
- **Email:** HubSpot Marketing Hub, sends personalised invites from hello@rebeccaandthomas.net.
- **Frontend:** jQuery, vanilla JS, HTML/CSS. Images from the Webflow CDN.
- **Design origin:** Bliss & Bone pre-designed HTML template.
- **Design skills** (project skills in `.claude/skills/`, each folder has its pack's LICENSE):
  - Impeccable, `impeccable` (pbakaus/impeccable@114ea1d, Apache 2.0). No hooks or agents.
  - Emil Kowalski's `emil-design-eng`, `animate`, `review-animations`, `improve-animations`, `find-animation-opportunities`, `animation-vocabulary` and `mobile-native` (emilkowalski/skills@d16ebe6, MIT).
  - Taste-Skill's `taste-skill` and `redesign-skill` (Leonxlnx/taste-skill@ce26fc2, MIT). They run as `/design-taste-frontend` and `/redesign-existing-projects`.

## Repo layout

- `site/main.css`: all site CSS. Served by GitHub Pages.
- `site/main.js`: all site JS, wrapped in the double-load guard. Served by GitHub Pages.
- `.github/workflows/pages.yml`: on push to `main`, runs `node --check site/main.js`, then publishes **only** `site/` to Pages. Pages source must be set to "GitHub Actions".
- `webflow/head.html`: Site settings → Custom code → **Head code**. Google Fonts tags plus a `<link>` to `main.css`.
- `webflow/footer.html`: Site settings → Custom code → **Footer code** (before `</body>`). The jQuery tag plus a `<script src>` to `main.js`. It is synchronous on purpose (no `defer`/`async`) so that main.js runs after jQuery and before DOMContentLoaded/`load`.
- `webflow/page-embed.html`: the Embed element on the home page. All page markup (`#mainContent`, card, RSVP form, comment form, footer, guest prompt).
- `apps-script/Code.gs`: Google Apps Script backend (write-only: RSVPs and comments to the Sheet). Deployed as a Web App (Execute as Me, access: Anyone). After changing it, it must be pasted into the Apps Script editor and **redeployed as a new version**, or the live URL keeps running the old code.

### Deploying

- **CSS/JS** (`site/`): merge to `main`. The workflow deploys to Pages, and Pages caches for about 10 minutes, so hard-refresh before judging a change. There is no Webflow republish.
- **Webflow fields** (`webflow/*.html`): paste the whole file and republish. This is only needed when the tags or the page markup change.
- **Rollback:** revert the commit on `main` (it redeploys). In an emergency, paste the pre-migration inline versions back into Webflow. Get them with `git show 0631d8f:webflow/head.html` and `git show 0631d8f:webflow/footer.html`; these have no double-load guard.
- If GitHub Pages is down, the site renders unstyled and without JS.

JS in `site/main.js` and `apps-script/Code.gs` should both pass `node --check` (copy `.gs` to a `.js` file to check it).

## Design system

- Fonts: Playfair Display (serif headings, italic), Montserrat (sans body), via Google Fonts; CSS vars `--serifFS` / `--sansFS`. Cormorant Garamond and Georgia appear only as `local()` fallbacks for template font names.
- Colours: beige `rgba(247,243,233,1)`, dark red `#761d1d`, near-black `#1a0a0a`
- CDN base: `https://cdn.prod.website-files.com/69a032f3f3d37a0b3745556f/`
- Key assets: `Platter4_Black.png`, `tx_bg_heavy-cotton.png`, `tx_card_fiber-02 (1).png`, `shadow_arbor-06.png`

## Personalisation

- URL param `?name=` drives the guest name display and the allowance lookup.
- Sheet names must match the URL value: case-insensitive, but spacing-sensitive.
- Ampersands in names are encoded as `%26` in HubSpot-generated URLs.
- HubSpot merge tag: `{{ contact.couple_name }}`.
- Guest allowance from the sheet limits the RSVP guest-count dropdown.
- With no `?name=`, the page shows a guest name prompt.

## Current features

Animated card reveal (slide-up and fade via `active`/`done` classes); parallax (background 0.3x, platter 0.15x, shadow 0.35x); guest allowance lookup; RSVP form to Apps Script; comments wall from published CSV; add-to-calendar (Google, Outlook, Yahoo, Apple/ICS); footer countdown to 2027-07-10.

## Gotchas: do not repeat

- Scripts go in Webflow's **Custom Code footer**, never the JSON Schema field. Misplacement fails completely and silently.
- **Webflow can load footer embeds twice.** `site/main.js` is wrapped in `if (!window.__rtInitDone) { window.__rtInitDone = true; ... }`. It is a plain block, not an IIFE, so the top-level `var`s and functions (e.g. `showCalendarOptions`) stay global. Keep the file in sloppy mode: `"use strict"`, an IIFE wrapper, or top-level `let`/`const` would change what's global. The body is intentionally not indented inside the block.
- No regex with literal newlines baked in. It causes a SyntaxError. Use string splits or verified escape sequences.
- **CSS cascade:** the reveal animation uses opacity 0 to 1 driven by `.active`. Any later rule setting `opacity: 0` on `.cardPreview .preview` overrides it and hides the card. Check cascade order before adding CSS.
- Console errors now point at `main.js` with its real line numbers. Webflow's own injected code no longer shifts them.
- GoDaddy auto-appends the domain to DNS records. Enter only the subdomain part.
- HubSpot SMS is US/Canada only, so it can't be used for this guest list.

## Outstanding from save-the-date

- Verify RSVP submission and the dropdown for guests with allowances of 2 and 3.
- Confirm DKIM/SPF/DMARC records are correct in GoDaddy (manual, outside this repo).
