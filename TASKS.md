# Tasks

Tracked here instead of only in chat so nothing gets lost between sessions.
Check items off as they're done; add new ones as they come up.

## Launch blockers

- [x] Swap the placeholder ActBlue URL in `src/consts.ts` (`DONATE_URL`) for
      the real committee donation link.
- [x] Wire the volunteer, newsletter, and contact forms to a real backend —
      `worker/index.ts` now emails submissions via Resend. Remaining:
  - [x] Set the `RESEND_API_KEY` secret on the live Worker.
  - [ ] **`columbiacountydems.org` DNS is on Wix, which doesn't support the
        subdomain MX record Resend needs for domain verification.** Until
        this is resolved, `worker/index.ts` sends from Resend's shared
        `onboarding@resend.dev` sender, which can only deliver to the Resend
        account's own signup address — so `TO_EMAILS`/`CC_EMAILS` are
        temporarily overridden to a test address instead of the real
        `info@columbiademocrats.org` / `groseclosea31@yahoo.com`. Options:
        move the domain's DNS to Cloudflare (also satisfies the item below),
        or find another domain/DNS host to verify with Resend. Once
        verified, restore the real `TO_EMAILS`/`CC_EMAILS` (commented out
        in `worker/index.ts`) and update `FROM_EMAIL` to send from the
        verified domain.
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
