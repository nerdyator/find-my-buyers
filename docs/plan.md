# Beat v0.1: the plan

**Session:** FlytBase Marketing Build Session, 2 hours.
**Business we point it at:** **Sobot** ([sobot.in](https://sobot.in)), a WhatsApp campaign and automation platform in the same space as AiSensy. Letters are signed **Amit Chavan, Founder, Sobot**.
**sobot.in is out of date.** Don't run v0.1 in "a company" mode on it, because Sniff would misread the business. Load the Sobot recipe (strategy track), or use "a product" mode with "WhatsApp campaign and automation platform" and the focus "India". Keep the focus to one word: v0.1 adds it to every search query, so "India, D2C and SMB" would narrow the searches too much.
**Approach:** be demo-ready in all three tracks, then pick one to show once you see what the room has built. Each track gets equal time.

Judges ask every demo one question: **would someone act on this today?** Each track also has its own test:

| Track | Judge's test | Our bet for v0.1 | Plan |
|---|---|---|---|
| Design | See the screen for 5 seconds: who would you contact first, and why? | **Call first**: the hottest buyer takes over the centre of the wall, weak clues fade, and a mobile list puts the hottest buyer on top | [track-design.md](track-design.md) |
| Strategy | Is the signal early and real? Show one example with its source and date | **The WhatsApp playbook**: 8 signals built for this business, Meta Ad Library as the source nobody watches, a scoring rule, one live find | [track-strategy.md](track-strategy.md) |
| Automation | Does it run without you? Trigger it live | **Morning buyer alert**: a GitHub Action runs the recipe every morning, AI judges it, new buyers land in Slack, and a buyer with two signals gets a louder alert | [track-automation.md](track-automation.md) |

Setup steps (accounts, keys, fork, deploy) are in [guide.md](guide.md).

## One spine, three demos

```
Strategy ──> recipes/whatsapp-platform.json ──┬──> Design: v0.1 runs on the sharper recipe, shows "Call first"
(playbook + recipe)                           └──> Automation: the morning job runs the same recipe
```

The recipe uses the same JSON shape as v0.1's "Steal the recipe" button. Every track can be demoed on its own. The recipe only makes the clues better. Without the strategy track, Design runs on v0.1's own Sniff recipe (loading a recipe file needs strategy step 3), and Automation runs on any recipe exported with "Steal the recipe".

## Timeline (2 hours)

| Time | Do | Done when |
|---|---|---|
| 0:00 to 0:15 | Setup ([guide.md](guide.md)): fork, Ollama key, Vercel deploy, Slack webhook | Your fork's live URL runs a search |
| 0:15 to 0:45 | Strategy | `recipes/whatsapp-platform.json` is in the repo and one live signal is in the playbook with its source and date |
| 0:45 to 1:15 | Design | A saved run shows "Call first" on desktop and the list on a phone |
| 1:15 to 1:45 | Automation | Clicking "Run workflow" makes a Slack card arrive with no other steps |
| 1:45 to 2:00 | Rehearse all three 3-minute demos and save the backups below | Each demo has a working path and a fallback |

Strategy goes first because its recipe makes the other two better. If it overruns, stop at 0:45 anyway and carry on without it.

If the session rules allow it, do the setup before the clock starts. That gives each track 5 more minutes.

## Which one to demo

Decide when you see the room:
- **Most people built Slack or n8n bots:** demo Design or Strategy.
- **Most people restyled the UI:** demo Automation. "It ran at 8am while I slept" stands out.
- **Most people built tools but nobody showed a real signal:** demo Strategy. It is the only track that has to show proof.
- **Otherwise:** demo whichever one passes its own test most clearly. Every demo should end on an action (a letter or a Slack card with a link), because that answers "would someone act on this today?"

## Demo backups (save these before the end)

- **Design:** a run saved after the design changes, so Replay shows "Call first" (`find-my-buyers-*.json`), plus one phone screenshot.
- **Strategy:** a screenshot of the live signal (an Ad Library ad, a job post or a news item) with its URL and date.
- **Automation:** the Slack message from a real scheduled or manual run, plus the green Actions run page.

## Ground rules

- Build on the fork. No new framework, no build step, no paid tools.
- Keep the v0.1 rules: real organisations only, end buyers only, evidence from the last 12 months.
- **Never cold-message prospects on WhatsApp.** WhatsApp requires opt-in, and a WhatsApp vendor caught spamming on WhatsApp sinks its own pitch. Outreach stays on email and LinkedIn.
- Keep v0.1 working: every change should still pass a normal run and a Replay.
