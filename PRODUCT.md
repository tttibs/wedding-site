# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Wedding guests of Rebecca Bonavia and Thomas Bowers. Most are flying in to Malta from Australia and the UK; a minority are based in Malta. English only. Most will open the site on a phone, from a personalised HubSpot email, and come back to it several times between now and the wedding (to RSVP, to check details, to plan travel).

Their jobs, in order: feel invited (this is the formal invitation), learn the when/where/what-to-wear, RSVP for their party, plan the trip around the weekend, and leave a public note for the couple.

## Product Purpose

The formal invitation for the wedding on Saturday 10 July 2027 at St. Paul's Cathedral, Mdina, Malta, replacing the live save-the-date at https://rebeccaandthomas.net. Success: every invited party RSVPs by 17 December 2026 through the site, arrives knowing the schedule, dress code and logistics, and feels the occasion before they land.

## Positioning

A personal, tactile stationery experience rather than a template wedding site: each guest is addressed by name, the page behaves like paper, ink and candlelight (real paper textures, hand-drawn chalk illustrations that draw themselves, an overhead film of the couple's own tablescape), and it is built around their real weekend in Malta.

## Operating Context

- Guests arrive from a HubSpot email link carrying `?name=` (a couple or individual name; `&` encoded as `%26`). Without it, the page asks for their name.
- The name drives a guest-allowance lookup in a published Google Sheet CSV, which caps the RSVP guest count.
- RSVPs (with a private note to the hosts) and public comments post to a Google Apps Script web app that writes to Google Sheets. Comments are read back from a published CSV onto a public notes wall.
- Served from Webflow (one embed element), with CSS/JS from GitHub Pages. The save-the-date is live while this is built; the new site is previewed at `preview.html` on GitHub Pages and switched over in one Webflow change.

## Capabilities and Constraints

- Sections, in order: hero, invitation, order of events, the details (FAQ), RSVP, public notes wall, a little guide to Malta, footer.
- RSVP must work with no animation, no JS animation library, and on slow mobile connections. RSVP note is private (to the hosts); comments are public.
- Add-to-calendar covers three events: welcome drinks (Thu 8 Jul 2027, 3–5pm, venue TBC), the wedding (Sat 10 Jul, 3.30pm–2am, St. Paul's Cathedral, Mdina), the debrief (Sun 11 Jul, 12–4pm, venue TBC).
- Adults-only celebration. Black tie dress code.
- Undecided: welcome-drinks and debrief venues, Malta guide place cards, Spotify playlist URL.

## Brand Commitments

- Names as written: Rebecca Bonavia & Thomas Bowers. Contact: hello@rebeccaandthomas.net.
- Locked by the couple: Playfair Display + Montserrat; beige rgba(247,243,233,1), dark red #761d1d, near-black #1a0a0a; the existing Webflow CDN paper textures; the chalk illustration set in `assets/chalk/`; the centred card-stack layout; the section order above.
- Voice: warm, gracious, British/Australian English, lightly formal ("Kindly respond by…").

## Evidence on Hand

- Hero film: `assets/hero/source/Romantic Candlelit Wedding Table Setting.mp4` (overhead tablescape, lace card on a silver tray reading "Rebecca & Thomas, 10th July 2027, Malta"; a wine glass is drawn away at the end).
- Chalk illustrations: `assets/chalk/svg/` (monogram, church, 19 dinner-table objects).
- All page copy comes from the couple's brief. Malta guide places are placeholders and must stay visibly marked until supplied; never invent venues, places or reviews.

## Product Principles

1. The invitation comes first: date, venue, dress code and RSVP are never more than a glance away and never depend on animation.
2. Every motion has a physical cause: paper moving, ink drawing, light shifting.
3. Personal over generic: address the guest by name and speak about the couple's real Malta.
4. Live-site safety: nothing breaks the save-the-date guests are using today.

## Accessibility & Inclusion

WCAG 2.2 AA. Full keyboard operation, `prefers-reduced-motion` honoured (no intro, no scrub, drawings shown complete).
