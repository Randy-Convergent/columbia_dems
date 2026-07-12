# Columbia County Democrats

Source for the Columbia County Democrats website — a redesign of
[columbiacountydems.org](https://www.columbiacountydems.org/), built with
[Astro](https://astro.build) and deployed as a Cloudflare Worker with static
assets.

The volunteer and contact forms submit to a small Worker (`worker/index.ts`)
that emails submissions via [Resend](https://resend.com).
See [TASKS.md](./TASKS.md) for what's left before launch.

## Local development

```sh
npm install
npm run dev         # http://localhost:4321, live reload (Astro only, forms won't send)
npm run build       # outputs static site to dist/
npm run preview     # serve the built dist/ locally (Astro only)
npm run dev:worker  # build + run the full Worker locally via wrangler (forms work)
```

To test forms locally, copy `.dev.vars.example` to `.dev.vars` and fill in a
real Resend API key — `.dev.vars` is gitignored and only used by `wrangler dev`.

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

Editing these files and redeploying (Cloudflare rebuilds automatically on
push) is enough for non-developer maintenance today. A git-based CMS (e.g.
[Decap CMS](https://decapcms.org/)) can be added later as a simple admin UI
on top of this same Markdown content — nothing here needs to be restructured
to support that.

Site-wide values (donate link, phone/email, social links, nav) live in
`src/consts.ts`. Form recipients (`TO_EMAILS`/`CC_EMAILS`) and the sending
address live in `worker/index.ts`.

## Form backend

`worker/index.ts` is a Cloudflare Worker that handles `POST /api/contact` and
`/api/volunteer`, emails the submission via Resend, and falls through to the
static site (via the `ASSETS` binding) for everything else. It needs a
`RESEND_API_KEY` secret to work:

```sh
npx wrangler secret put RESEND_API_KEY
```

Submissions currently send from Resend's shared `onboarding@resend.dev`
address. Once `columbiacountydems.org` is verified as a sending domain in
Resend (add their SPF/DKIM DNS records alongside the existing Google
Workspace ones), update `FROM_EMAIL` in `worker/index.ts` to send from that
domain instead.

## Deploying

This deploys as a Cloudflare Worker with static assets (not classic Pages) —
`wrangler.jsonc` has both a `main` (the form-handling Worker) and an `assets`
binding (the built site).

1. Push this repo to GitHub (already done if you're reading this in the PR).
2. Set the `RESEND_API_KEY` secret (see above) — only needs doing once per
   environment.
3. Deploy with `npm run deploy` (runs `astro build` then `wrangler deploy`),
   or connect the repo in the Cloudflare dashboard for Workers Builds to
   deploy automatically on push.
4. Connect the real `columbiacountydems.org` domain under the Worker's
   **Custom domains** tab once you're ready to cut over from Wix.

## Before you launch

See [TASKS.md](./TASKS.md) for the running list of launch blockers and
recommended improvements.
