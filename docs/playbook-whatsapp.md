# Sobot signal playbook

**Every WhatsApp buyer leaves a trail. Most tools wait for the search. We catch the ad.**

Sobot sells WhatsApp broadcasts, chatbots and a shared inbox to growing Indian brands. Its buyers are D2C brands, edtech and coaching institutes, real-estate developers, and clinic chains.

## The trail, oldest first

```
1. Brand starts Click-to-WhatsApp ads or WhatsApp ordering    <- Sobot catches it here
        | 1 to 4 weeks
2. One phone running WhatsApp Business floods                  <- "our WhatsApp is chaos", CRM hires
        | weeks
3. Someone googles "WhatsApp automation tool"                  <- every competitor's lead form starts here
```

**Trigger moment:** they start pushing customers to WhatsApp and one phone can no longer keep up.

## The 8 signals

| Signal | Type | Intent (ceiling) | Shows up first in |
|---|---|---|---|
| Launches WhatsApp ordering or Click-to-WhatsApp ads | purchase | 5 | **Meta Ad Library** ("Started running on" date) |
| Unhappy with current tool (Wati, Interakt, Gupshup, AiSensy) | competitor | 5 | G2, Play Store reviews, Reddit, X |
| Hiring a CRM, retention or WhatsApp marketing lead | hiring | 4 | Naukri, LinkedIn Jobs |
| WhatsApp inbox overload post | social | 4 | LinkedIn and X founder posts |
| Festive sale push (Diwali falls on 8 Nov 2026) | event | 3 | Brand news, ad campaigns |
| Fresh D2C funding | expansion | 3 | Inc42, Entrackr, YourStory |
| New cities, stores or clinics | expansion | 3 | Business news |
| Moving off SMS (TRAI rules, Meta pricing) | regulation | 2 | Industry news (context, not a lead) |

The recipe file is `recipes/whatsapp-platform.json`. Open it with **Replay** in find-my-buyers and Scout hunts with these signals.

## Scoring

`heat = (fit + freshness + intent) / 15 x 100`. Each signal type has a ceiling on its intent score, and the code enforces it.

**A competitor complaint beats a funding round.** Funding proves money exists. A complaint proves money is already being spent on this exact problem and the buyer wants out. A funding or store clue therefore tops out at 87. A competitor-pain or WhatsApp-ordering clue can reach 100.

## What running it taught us

We ran the recipe through free news search: 17 real organisations, all from the last 12 months. **Every one was funding, new stores or a festive campaign, so intent was capped at 3.** The search found no competitor complaints, no CRM hires and no WhatsApp ordering launches.

**The highest-intent signals don't make the news.** They live in the Ad Library, on job boards and in review sites. That's why the signal nobody is watching is the one that wins.

## Live finds (31 Oct 2026)

**1. Bubble Me (magnesium wellness D2C, Panchkula). Hiring + competitor, a double signal.**
- **What:** hiring a *Retention Marketing Specialist* to "own WhatsApp, email and RCS". The must-have list includes "Working knowledge of WhatsApp marketing (Interakt, Wati, AiSensy or similar)".
- **Source:** [Indeed job post](https://in.indeed.com/viewjob?jk=80fdd4dc3f6638e8). It was posted about 17 days ago (around 14 Oct 2026). Indeed shows only a relative date, so screenshot it.
- **Second signal:** new festive Meta ads started 14 to 17 Oct 2026 (Ad Library ID 1661083728858353).
- **Why it's early:** the person who will choose the WhatsApp tool isn't hired yet, and the post names Sobot's competitors as the shortlist. If Sobot reaches the founder now, it's on that list before the new hire starts.

**2. Pepe Jeans India. A Click-to-WhatsApp ad, the source nobody watches.**
- **What:** a Powerflex denim video ad whose button is "Send WhatsApp message".
- **Source:** [Meta Ad Library](https://www.facebook.com/ads/library/?id=1100018642390118). "Started running on Oct 16, 2026".
- **Why it's early:** they're paying to push shoppers into WhatsApp at the festive peak. The flood comes next. This brand is bigger than Sobot's usual buyer, but it proves the method.

**3. Protein Pantry (frozen food D2C). Backup with an exact date.**
- **What:** raised Rs 9 Cr seed, has served 30,000+ households with a "strong repeat rate", and plans 6 more cities by the end of 2026.
- **Source:** [BW Healthcare World](https://www.bwhealthcareworld.com/article/protein-pantry-raises-rs-9-cr-to-scale-frozen-food-brand-625451), 30 Oct 2026.
- **Second signal:** new Meta ads started 29 Oct 2026.
- **Why it's early:** the money landed yesterday, and a repeat-order business runs on reorder messages.
