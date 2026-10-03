# Switching rebeccaandthomas.net from the save-the-date to the invitation

The invitation is fully built in this repo and served from GitHub Pages.
Webflow only needs three small changes, made together, then one publish.

Before you start: check https://tttibs.github.io/wedding-site/preview.html
(with and without `?name=`) on your phone and on desktop.

## 1. Site settings → Custom code → Head code

Replace the whole field with the contents of `webflow/invite/head.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap" rel="stylesheet">

<link rel="stylesheet" href="https://tttibs.github.io/wedding-site/invite/invite.css">
```

## 2. Site settings → Custom code → Footer code (before `</body>`)

Replace the whole field with the contents of `webflow/invite/footer.html`.
Never put this in the JSON Schema field. Keep it synchronous (no `defer` or `async`).

```html
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<script src="https://tttibs.github.io/wedding-site/invite/invite.js"></script>
```

The old `main.css` and `main.js` tags must be gone after steps 1 and 2.
Both scripts bind the same RSVP form, so leaving `main.js` in place would
send every RSVP twice.

## 3. The home page's Embed element

Replace the Embed's contents (the whole save-the-date markup) with:

```html
<div id="rt-invite"></div>
```

Keep the page-level custom code fields (Page settings → Custom code) empty.

## 4. Publish, then check

Publish the site, then hard-refresh https://rebeccaandthomas.net (GitHub
Pages caches for about 10 minutes, so a change you merge later can take
that long to appear). Check:

- `?name=` shows the guest's name; no name shows "Guest" and the name prompt.
- An RSVP lands in the RSVPs sheet (once), and a note lands in Comments.
- The countdown runs in the footer.

## Rollback

Paste back the save-the-date versions and publish:

- Head code: `webflow/head.html`
- Footer code: `webflow/footer.html`
- Embed: `webflow/page-embed.html`

The save-the-date files (`site/main.css`, `site/main.js`) stay published, so
rollback works at any time.

## After switchover: updating the site

Merge changes to `main`; GitHub Pages redeploys and the live site updates
within about 10 minutes (hard-refresh). Bump `RT_VERSION` at the top of
`site/invite/invite.js` whenever drawings or hero frames change, so
browsers fetch the new files. No Webflow changes are needed.
