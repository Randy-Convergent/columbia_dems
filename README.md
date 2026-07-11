# Columbia County Democrats

Source for the Columbia County Democrats website — a redesign of
[columbiacountydems.org](https://www.columbiacountydems.org/), built with
[Astro](https://astro.build) as a static site for deployment on Cloudflare Pages.

**This build is a visual/content demo.** The volunteer, newsletter, and contact
forms are fully styled and validate input, but they don't send anywhere yet —
submitting one just shows a "thanks" message in the browser. See
[Before you launch](#before-you-launch) for what's left to wire up.

## Local development

```sh
npm install
npm run dev       # http://localhost:4321, live reload
npm run build     # outputs static site to dist/
npm run preview   # serve the built dist/ locally
```

## Editing content

Most page copy lives directly in the `.astro` files under `src/pages/`.
Structured content lives in Markdown under `src/content/`:

- **`src/content/events/*.md`** — one file per event. Frontmatter:
  `title`, `location`, `recurring` (true/false), `time` (free text), and for
  one-off events, `date` (YYYY-MM-DD). Set `sample: true` on placeholder
  events so they carry the "replace before launch" badge; remove that field
  once it's a real event. Add a new event by copying an existing file.
- **`src/content/officers/*.md`** — one file per committee officer.
  Frontmatter: `name`, `role`, `order` (controls display order), optional
  `phone`, optional `photo` (filename of an image already in
  `src/assets/images/`). Leave `photo` off to show a placeholder initials
  avatar instead of a fabricated photo.

Editing these files and redeploying (a Cloudflare Pages build triggers
automatically on push) is enough for non-developer maintenance today. A
git-based CMS (e.g. [Decap CMS](https://decapcms.org/)) can be added later as
a simple admin UI on top of this same Markdown content — nothing here needs
to be restructured to support that.

Site-wide values (donate link, phone/email, social links, nav) live in
`src/consts.ts`.

## Deploying to Cloudflare Pages

1. Push this repo to GitHub (already done if you're reading this in the PR).
2. In the Cloudflare dashboard, create a new Pages project connected to this
   repo.
3. Build settings:
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Deploy. Cloudflare will rebuild automatically on every push to the
   production branch.
5. Connect the real `columbiacountydems.org` domain under the Pages
   project's **Custom domains** tab once you're ready to cut over from Wix.

## Before you launch

- [x] Swap the placeholder ActBlue URL in `src/consts.ts` (`DONATE_URL`) for
      the real committee donation link.
- [ ] Wire the volunteer, newsletter, and contact forms to a real backend —
      e.g. a Cloudflare Pages Function that emails submissions, or a
      third-party form service. The form markup in `src/components/DemoForm.astro`
      and the pages that use it are already structured for this.
- [ ] Replace the sample dated event in `src/content/events/sample-county-fair.md`
      with a real upcoming event (or delete it if there isn't one yet).
- [ ] Double-check officer contact info and photos in `src/content/officers/`.
- [ ] Connect the production domain in Cloudflare Pages.
