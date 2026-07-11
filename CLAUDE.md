# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static marketing site for Columbia County Democrats, built with Astro 7 and deployed to Cloudflare
Pages/Workers (see `wrangler.jsonc`). It is a from-scratch redesign of columbiacountydems.org, not
yet cut over from the current Wix site.

**This build is a content/visual demo, not a fully wired site.** The volunteer, newsletter, and
contact forms (`src/components/DemoForm.astro`) are styled and validate client-side but don't
submit anywhere — submitting just reveals a "thanks" message. See `TASKS.md` for this and other
launch blockers, and keep it updated as items are completed or added.

## Commands

```sh
npm install
npm run dev       # http://localhost:4321, live reload
npm run build     # outputs static site to dist/
npm run preview   # serve the built dist/ locally
npx astro check   # typecheck .astro files + content collection schemas
```

There is no lint script and no test suite. Always run `npx astro check` and `npm run build` after
changes — both should complete with 0 errors before considering a change done.

## Architecture

- **Pages** (`src/pages/*.astro`) are mostly self-contained: page copy, layout, and page-specific
  `<style>` blocks all live in the same file rather than being pulled from a CMS. Editing content
  usually means editing the `.astro` file directly.
- **Content collections** (`src/content/`) hold the two things editors update without touching
  code: `events/*.md` and `officers/*.md`, loaded via `glob()` loaders and validated by Zod schemas
  in `src/content.config.ts`. Frontmatter fields are documented in the README's "Editing content"
  section — read that before changing the schema, since it's the doc non-developers follow.
- **`src/consts.ts`** is the single source for site-wide values: `DONATE_URL`, `CONTACT`, `SOCIAL`,
  `NAV_LINKS`. Change links/contact info here, not by hunting through pages.
- **`src/components/Section.astro`** is the shared page-section wrapper with a `background` prop
  (`white` | `soft` | `navy` | `gold`) — reuse it for new sections rather than hand-rolling section
  backgrounds/padding.
- **Social links** are treated as a primary CTA, not a footer afterthought: `SocialLinks.astro`
  (small icon pair, used in the header/footer/contact) and `SocialCTAButtons.astro` (large branded
  Facebook/Instagram buttons, used in dedicated "follow us" sections on the homepage and Get
  Involved page) both pull from `SOCIAL` in `consts.ts`.
- **Officer/event photos** (`src/assets/images/*.jpg`) are processed through Astro's built-in
  `<Image>` component. When `width`/`height` are both set and don't match the source aspect ratio,
  Astro/sharp center-crops (`fit: cover` is the implicit default) rather than distorting the image —
  so a photo with an off-center subject needs re-cropping/re-composing at the source, not a CSS fix,
  if the subject ends up too close to the frame edge.
- Events on `/events` and the homepage split into recurring / upcoming / past by comparing
  frontmatter `date` against `new Date()` **at build time** — this is a static site, so that
  classification only updates on the next deploy, not in real time.

## Deployment

Cloudflare Pages, static output (`dist/`). Build command `npm run build`, output directory `dist`.
Production domain cutover and other pre-launch steps are tracked in `TASKS.md`, not here.
