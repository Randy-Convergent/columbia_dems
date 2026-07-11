# Tasks

Tracked here instead of only in chat so nothing gets lost between sessions.
Check items off as they're done; add new ones as they come up.

## Launch blockers

- [x] Swap the placeholder ActBlue URL in `src/consts.ts` (`DONATE_URL`) for
      the real committee donation link.
- [x] Wire the volunteer, newsletter, and contact forms to a real backend —
      `worker/index.ts` now emails submissions via Resend. Remaining:
  - [ ] Set the `RESEND_API_KEY` secret on the live Worker (`npx wrangler secret put RESEND_API_KEY`).
  - [ ] Verify `columbiacountydems.org` as a sending domain in Resend (SPF/DKIM
        records alongside the existing Google Workspace ones), then update
        `FROM_EMAIL` in `worker/index.ts` — currently sends from Resend's
        shared `onboarding@resend.dev` address.
- [ ] Replace the sample dated event in `src/content/events/sample-county-fair.md`
      with a real upcoming event (or delete it if there isn't one yet).
- [ ] Double-check officer contact info and photos in `src/content/officers/`.
- [ ] Connect the production domain (Worker custom domain, not Pages).

## Recommended improvements

- [ ] Add an Open Graph / Twitter share image. `Layout.astro` sets `og:title`
      and `og:description` but no `og:image`, so links shared on
      Facebook/Instagram show a blank preview card.
- [ ] Rebuild on a schedule (daily cron via Cloudflare or a GitHub Action
      hitting the deploy hook) so events automatically flip from "Upcoming"
      to "Past" — right now that's computed at build time, so it only
      updates on the next deploy.
- [ ] Add basic analytics (e.g. Cloudflare Web Analytics) to see whether the
      social CTAs and donate link are actually converting.
