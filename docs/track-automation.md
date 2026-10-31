# Track 03 · Automation: signal to inbox

**Judge's test:** does it run without you? Trigger it live, or show a past run, and the result lands in Slack, a sheet or an inbox with no hands on it.
**Finish line (from the deck):** one flow that runs end to end on its own: source in, AI judgment, message out.
**Time box:** 30 minutes.

## The bet: "Morning buyer alert"

```
GitHub Actions (cron, 08:00 IST)  or  "Run workflow" button
      |
scripts/watch.mjs
      |-- loads recipes/whatsapp-platform.json     (from the strategy track; any stolen recipe works)
      |-- searches each signal                     (gnews() + bing() from api/search.js)
      |-- AI judges the evidence                   (Ollama, the same rules as P.scout)
      |-- drops companies it has already sent,     (seen.json, kept in the Actions cache)
      |   unless they show a NEW signal type
      |-- marks DOUBLE SIGNAL buyers               (2+ signal types for one company, today or across days)
      '-- posts one Slack card                     (hottest first, each with source link and why-now)
```

**Why GitHub Actions (my call):** the fork already lives on GitHub. Actions is free, has a cron, has a "Run workflow" button for the live demo, keeps a public log of every unattended run, and needs no new account. n8n or Make would add a third account and a visual builder to learn under time pressure. Vercel Cron on the free plan runs at most once a day and has nowhere to store `seen.json`.

**Why the double-signal rule:** it's straight from the deck's idea list ("alert only when a buyer shows two signals at once"), and it keeps the alert from becoming noise. A double-signal buyer goes at the top of the card with a label.

**How `seen.json` makes it work (my call):** the file stores, for each company key, the signal types already sent and the date last seen.
- A company with no new signal type is dropped.
- A company that comes back with a **new** type is sent again as a DOUBLE SIGNAL.
- Within one run, two hunts that return the same company merge into one double.

Doubles are rare on day one and grow over days. That's the point of a watcher.

## What the Slack card looks like

```
3 new buyers for Sobot · Sat 31 Oct

DOUBLE SIGNAL  <Company>  ·  heat 92  ·  purchase + hiring
Launched WhatsApp ordering (Oct 2026). Hiring a CRM lead.
Why now: one line.                               <source link>

<Company>  ·  heat 80  ·  competitor
...
```

Post only when there are new buyers, so the channel stays quiet otherwise. A manual run always posts something (even "no new buyers, 7 already known"), so the live demo never lands on silence.

## Build steps

| # | Do | Time | Done when |
|---|---|---|---|
| 1 | In `api/search.js`, add `export` to `gnews` and `bing` so the script can reuse them. Vercel only treats HTTP-method names (`GET`, `POST`) as handlers, so the extra exports are safe. | 1 min | The site's search still works |
| 2 | Write `scripts/watch.mjs` (Node 18+, no dependencies). It reads the recipe, splits the signals into hunts of 2 (as `go()` does), searches, and calls `https://ollama.com/api/chat` with `OLLAMA_API_KEY`, model `gpt-oss:120b` and `format:'json'`. The prompt is a short copy of `P.scout`. Then: drop dates older than last year, dedupe by company (same key as v0.1), compare against `seen.json`, apply heat (the v0.1 formula, plus 15 for a double signal, capped at 100), and post the card to `SLACK_WEBHOOK_URL`. `--dry` prints the Slack payload instead of posting. Retry on rate limits as `retrying()` does. | 15 min | `node scripts/watch.mjs --dry` prints a card made of real companies |
| 3 | One small assert-based check of the dedupe and double-signal rules (pure functions, no network) | 3 min | `node scripts/watch.test.mjs` passes |
| 4 | Write `.github/workflows/watch.yml` with these triggers: `schedule: '30 2 * * *'` (08:00 IST) and `workflow_dispatch` with a `fresh` boolean input (ignore `seen.json`, for the demo). The steps: checkout, setup-node 20, restore `seen.json` with `actions/cache` (`key: seen-${{ github.run_id }}`, `restore-keys: seen-`), then run the script with both secrets. | 6 min | The workflow appears in the Actions tab |
| 5 | Run it with "Run workflow" (fresh = true) | 3 min | The Slack card arrives |
| 6 | **For the session only:** add a second cron, `'*/30 * * * *'`, and push it **as soon as step 4 works**. GitHub can take a while to start a new schedule, so the earlier it goes in, the more unattended runs you'll have by demo time. Every 30 minutes rather than 15 keeps AI usage down on the one Ollama key. Remove it afterwards. | 2 min | A run you didn't click shows in Actions |

Why `actions/cache` instead of committing `seen.json` (my call): the job never pushes to the repo, so it can't clash with your design-track pushes. The tradeoff is that GitHub drops caches unused for 7 days, which is fine for this purpose.

The prompt is duplicated from `index.html` into the script. Leave a `shortcut:` comment that it must be kept in sync with `P.scout`. Moving the prompts into a shared module is a refactor we aren't doing today.

## Stretch (only if there's time)

- **Quill in the card:** for the hottest buyer, run a short copy of `P.quill`, signed "Amit Chavan, Founder, Sobot", and attach the email draft under the card.
- **Google Sheet log:** POST each new buyer to an Apps Script web app (`SHEET_WEBHOOK_URL`, setup in [guide.md](guide.md)), one row per clue. The deck lists Sheets as a valid landing place too.
- **Deliver it on WhatsApp:** send the alert to your own team's WhatsApp through the Cloud API test number (setup in [guide.md](guide.md)). That's on brand for a WhatsApp platform, and it's allowed because teammates opt in. It is internal, not outreach.

## Demo (3 minutes)

**Click "Run workflow" before you start talking.** It takes about 1 to 2 minutes.

1. **(20s)** "A tool you have to remember to open is a tool nobody uses."
2. **(40s)** The Actions history: session runs that nobody clicked. Show `watch.yml` (the 08:00 IST cron line).
3. **(60s)** While the live run finishes: walk through recipe, search, AI judgment, dedupe, and the double-signal rule.
4. **(60s)** The Slack card lands. Open the source link of the top buyer: it's a real article with a date. "Tomorrow at 8am this lands again, with only the new buyers, and nobody opens anything."

**Fallback:** if the live run is slow, the Slack channel already holds the card from an unattended run, and the Actions page shows it green. If no unattended run has fired yet, the deck allows "trigger it live", so the manual run counts.

## Risks

- Bing may block GitHub's servers. The search then falls back to Google News only, which v0.1 already handles.
- GitHub can delay scheduled runs by several minutes at busy times. The demo relies on "Run workflow", not the clock.
- Forks start with Actions disabled. Enable them first ([guide.md](guide.md), step 5).
- One Ollama key serves the site, your local tests and the cron. If it hits its usage cap, live runs fail. Check usage on ollama.com before the demo. Every track has a fallback that needs no network.

## Not doing

- Gmail drafts: OAuth setup takes longer than the whole time box.
- HubSpot or Salesforce: they need paid or sandbox accounts.
- A web UI for the automation: Slack is the UI.
