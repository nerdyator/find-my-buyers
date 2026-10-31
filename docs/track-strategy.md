# Track 02 · Strategy: find the signal nobody is watching

**Judge's test:** is the signal early and real? Show one example with its source and date, and explain why it comes before the buyer starts looking.
**Finish line (from the deck):** a one-page playbook with at least 3 signal sources, a simple way to score them, and one real signal found live.
**Time box:** 30 minutes.

## The bet

v0.1 gives every business the same 8 generic signal types. Our bet is a playbook built for **Sobot**, a WhatsApp campaign platform, and its sharpest point is a source nobody in the room will be watching: **Meta Ad Library.**

The trail for a WhatsApp platform buyer, oldest first:

```
Brand starts Click-to-WhatsApp ads / WhatsApp ordering   <- we catch it here (Ad Library, news)
      | 1 to 4 weeks
One phone with the WhatsApp Business app floods          <- "our WhatsApp is chaos" posts, CRM hires
      | weeks
Someone googles "WhatsApp automation tool"               <- where every competitor's lead form starts
```

**Why it's early:** a brand paying for ads whose button opens a WhatsApp chat is about to create more WhatsApp conversations than one person can answer. The ad goes live before the pain shows up, and long before anyone searches for a tool. The Ad Library shows **"Started running on <date>"** for every ad, which gives us a dated, public proof.

**Trigger moment:** they start pushing customers to WhatsApp (ads, ordering, a sale season) and one phone running the WhatsApp Business app can no longer keep up.

**Buyers:** Indian D2C brands, edtech and coaching institutes, real-estate developers, and clinic or diagnostic chains, at SMB to mid-market size.

**Not buyers (Scout must skip these):** AiSensy, Wati, Interakt, Gupshup, Gallabox, DoubleTick, Zoko, other WhatsApp BSPs and agencies, and Meta itself. No existing Sobot customers have been named. If any exist, add them here and to the recipe's `competitors`, so Scout skips them as well.

## Signal recipe (draft, check it live)

Save this as `recipes/whatsapp-platform.json`. It is the same shape as v0.1's "Steal the recipe" export, with two additions: `business.competitors` (Scout's prompt needs it) and `intent` per signal (the scoring rule below).

Query rules come from v0.1's free search: plain words, 4 to 8 per query, no quotes, no `site:`, no `OR`.

```json
{
  "recipe": "find-my-buyers/v0.1",
  "business": {
    "name": "Sobot",
    "sells": "WhatsApp broadcasts, chatbots and shared inbox for growing brands",
    "buyers": ["D2C brands", "edtech and coaching institutes", "real estate developers", "clinic and diagnostic chains"],
    "trigger_moment": "They start pushing customers to WhatsApp and one phone can no longer keep up.",
    "competitors": ["AiSensy", "Wati", "Interakt", "Gupshup", "Gallabox", "DoubleTick"]
  },
  "signals_to_watch": [
    {"signal": "Launches WhatsApp ordering", "type": "purchase", "intent": 5, "look_for": "brand starts taking orders, bookings or leads over WhatsApp", "query": "brand launches WhatsApp ordering customers India"},
    {"signal": "Unhappy with current tool", "type": "competitor", "intent": 5, "look_for": "public complaints about, or a switch away from, Wati, Interakt or Gupshup", "query": "Wati Interakt Gupshup review switching pricing"},
    {"signal": "Hiring CRM or retention lead", "type": "hiring", "intent": 4, "look_for": "D2C, edtech or clinic hiring a CRM, retention or WhatsApp marketing role", "query": "hiring CRM retention manager D2C brand"},
    {"signal": "WhatsApp inbox overload", "type": "social", "intent": 4, "look_for": "founder or team posting about drowning in customer WhatsApp messages", "query": "small business overwhelmed WhatsApp customer messages"},
    {"signal": "Festive sale push", "type": "event", "intent": 3, "look_for": "brand announcing a big Diwali or sale-season campaign", "query": "D2C brand Diwali sale campaign announces"},
    {"signal": "Fresh D2C funding", "type": "expansion", "intent": 3, "look_for": "D2C, edtech or healthtech raising seed or Series A", "query": "D2C brand raises Series A India"},
    {"signal": "New cities or stores", "type": "expansion", "intent": 3, "look_for": "brand opening new cities, stores, centres or clinics", "query": "D2C brand opens new stores cities"},
    {"signal": "Moving off SMS", "type": "regulation", "intent": 2, "look_for": "brands moving from SMS to WhatsApp after TRAI SMS rules or Meta pricing changes", "query": "brands shift from SMS to WhatsApp"}
  ]
}
```

Timely hook: Diwali 2026 falls on 8 Nov, so the session (31 Oct) is in the middle of the festive rush. Check the date before you say it on stage.

## Scoring: a simple rule you can defend

Keep v0.1's heat: `(fit + freshness + intent) / 15 x 100`. Change two things:

1. **Intent by signal type.** The recipe's `intent` value tells Scout what each signal type is worth.
   - **Competitor pain = 5:** they already pay for a tool, the budget exists, and they've named the pain.
   - **WhatsApp ordering or Click-to-WhatsApp ads = 5:** they're spending money to create the problem we solve.
   - **Hiring or inbox overload = 4:** the pain is real, but the budget isn't proven yet.
   - **Funding, expansion or festive push = 3:** they have money or a moment, but no named pain.
   - **Regulation = 2:** it moves the whole market, so it's context, not a lead.

   Answer to the deck's "is a tender worth more than a job post?" for this business: **a complaint about a competitor beats a funding round.** Funding means money exists. A complaint means money is already being spent on this exact problem and the buyer is looking for a way out.
2. **Stack bonus (stretch):** add +15 heat, capped at 100, when the same company shows 2 or more different signal types. One signal is a hint. Two is a pattern. Within a single run this only fires when two hunts return the same company, which is rare. The automation track catches it across days, and the live find (step 4 below) can prove it by hand.

## The live find (this is the proof, so do it first)

1. Open [Meta Ad Library](https://www.facebook.com/ads/library/). Set country to India, ad category to All ads, and search `order on WhatsApp` (also try `WhatsApp us`, `chat on WhatsApp`).
2. Filter to active ads. Pick a brand whose ad says **Started running on** a date in the last 7 to 14 days and whose button is **Send WhatsApp message**.
3. Check that it is a real end buyer: a brand, not a WhatsApp vendor or an agency.
4. Optionally look for a second signal for the same brand (a job post, funding news, or a Diwali sale) so the stack bonus applies.
5. Capture the **brand, the ad URL, the start date and a screenshot.** Then write one line on why this comes before they go shopping for a tool.

Backups if the Ad Library is slow: this week's D2C funding news on Inc42 or Entrackr, or a "CRM / retention manager" job post on Naukri or LinkedIn from a D2C brand.

## Build steps

| # | Do | Time | Done when |
|---|---|---|---|
| 1 | The live find above | 10 min | Screenshot, URL and date captured |
| 2 | Save the recipe JSON to `recipes/whatsapp-platform.json` | 3 min | The file is in the repo |
| 3 | **Load a recipe in v0.1:** the Replay file picker checks whether the file is a recipe (it has a `signals_to_watch` key; don't test for `recipe`, because saved runs have that key too) and, if so, stores it, puts `business.name` in the input, and lets `go()` skip the Sniff call (the profile comes from `business`, the signals from `signals_to_watch`). Also add `competitors` to the "Steal the recipe" export so exports load back cleanly. | 10 min | Loading the recipe and pressing Go makes Scout hunt with our 8 signals |
| 4 | Pass `intent` into `P.scout`: each `Look for` line gets `(intent if found: N)`. The model ignored that hint in testing, so the Scout loop also caps each clue's intent at the recipe's value for its type. | 2 min | Clues of the strongest types score higher |
| 5 | Write `docs/playbook-whatsapp.md`: one page with the trail, the 8 signals, the scoring rule, sources, and the live find with its screenshot | 5 min | Fits on one screen |
| Stretch | Stack bonus: in the Scout loop, a repeated company adds its signal to the existing clue instead of being dropped, and `heat()` adds +15 | 10 min | One company shows "2 signals" |
| Stretch | A new search source: a `jobs(q)` function in `api/search.js` that runs Bing with `site:naukri.com` added on the server, merged into the results | 10 min | Job posts show up as clues |

## Sources (the playbook needs 3 or more)

| Source | Signal | How | Why it's early |
|---|---|---|---|
| Meta Ad Library | Click-to-WhatsApp ads | Manual search, dated | Money is spent before the inbox pain starts |
| Naukri / LinkedIn Jobs | CRM, retention or WhatsApp marketing hires | Search, or the stretch `jobs()` source | The role exists because the volume already does |
| G2, Capterra, Play Store, Reddit, X | Complaints about Wati, Interakt or Gupshup | Search the competitor name with "pricing", "support" or "banned" | The buyer is already looking for a way out |
| Inc42, Entrackr, YourStory | D2C funding, new cities | v0.1 news search already covers these | Money arrives before the growth tooling |

## Demo (3 minutes)

1. **(30s)** The trail diagram: "Everyone waits for the search. We catch the ad."
2. **(60s)** The live find: Ad Library screenshot, start date, brand. Explain why it's early.
3. **(45s)** The scoring rule: "A competitor complaint beats a funding round. Here's why."
4. **(45s)** Load the recipe in v0.1 and press Go (or Replay a saved run). Clues come from our signals, not the generic 8.

**Fallback:** the screenshots and the playbook page are the demo. Nothing has to run live.

## Not doing

- Automating the Ad Library. Its API only returns political and social-issue ads outside the EU, so it is a manual source, and that's fine for the judge's proof.
- Scraping G2 or Reddit from the server. They block cloud IPs. Those stay manual.
