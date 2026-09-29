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

- **Webflow** (paid hosting) serves the page. The site's HTML/CSS/JS is maintained in this repo and pasted into Webflow's **Custom Code footer** (before `</body>`).
- **Domain:** rebeccaandthomas.net, DNS on GoDaddy.
- **Guest data:** Google Sheet, published as CSV, read client-side.
- **RSVP backend:** Google Apps Script, writing to Google Sheets.
- **Email:** HubSpot Marketing Hub, sends personalised invites from hello@rebeccaandthomas.net.
- **Frontend:** jQuery, vanilla JS, HTML/CSS. Images from the Webflow CDN.
- **Design origin:** Bliss & Bone pre-designed HTML template.

## Repo layout

Each file maps 1:1 to a Webflow custom code field, so deploying is a straight copy-paste of the whole file.

- `webflow/head.html`: Site settings → Custom code → **Head code**. Google Fonts plus all CSS.
- `webflow/footer.html`: Site settings → Custom code → **Footer code** (before `</body>`). jQuery plus all JS.
- `webflow/page-embed.html`: the Embed element on the home page. All page markup (`#mainContent`, card, RSVP form, comment form, footer, guest prompt).
- `apps-script/Code.gs`: Google Apps Script backend (write-only: RSVPs and comments to the Sheet). Deployed as a Web App (Execute as Me, access: Anyone). After changing it, it must be pasted into the Apps Script editor and **redeployed as a new version**, or the live URL keeps running the old code.

JS in `webflow/footer.html` and `apps-script/Code.gs` should both pass `node --check` (copy `.gs` to a `.js` file to check it).

Webflow limits each custom code field in length, so check file size before pasting.

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
- **Webflow can load footer embeds twice.** Scripts need a guard like `if (window.__rtInitDone) return; window.__rtInitDone = true;`. Note: the live `webflow/footer.html` does NOT currently contain this guard. Confirm with Tom whether it lives elsewhere before relying on or adding it.
- No regex with literal newlines baked in. It causes a SyntaxError. Use string splits or verified escape sequences.
- **CSS cascade:** the reveal animation uses opacity 0 to 1 driven by `.active`. Any later rule setting `opacity: 0` on `.cardPreview .preview` overrides it and hides the card. Check cascade order before adding CSS.
- Webflow console line numbers don't match this file (Webflow injects its own code first).
- GoDaddy auto-appends the domain to DNS records. Enter only the subdomain part.
- HubSpot SMS is US/Canada only, so it can't be used for this guest list.

## Outstanding from save-the-date

- Remove the verbose `[GuestAllowance] row X` debug logs (they log every sheet row on each load).
- Verify RSVP submission and the dropdown for guests with allowances of 2 and 3.
- Confirm DKIM/SPF/DMARC records are correct in GoDaddy (manual, outside this repo).
