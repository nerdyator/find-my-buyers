# Track 01 · Design: see the signal

**Judge's test (5-second test):** a judge sees the screen for 5 seconds, then answers "who would you contact first, and why?"
**Finish line (from the deck):** a clickable prototype or a working screen, shown with real or realistic signals.
**Time box:** 30 minutes. Only `index.html` changes.

## The problem with v0.1 in 5 seconds

Up to 15 notes of the same size get pinned all over the wall. Heat is a small rotated number in a corner. The centre card, where every red string ends, still shows the business we typed, not the buyer to call. A judge's eye has nowhere to land.

## The bet: "Call first"

Make one buyer win the screen and push everything else back.

```
+---------------------------- cork wall ----------------------------+
|  [faded cool note]          [HOT note, pulsing pin]                |
|                \               |                                   |
|        +------------------------------------------+               |
|        | CALL FIRST                          87    |  <- strings   |
|        | <Company>                                 |     end here  |
|        | Launched WhatsApp ordering · Oct 2026     |               |
|        | Why now: one line from the clue           |               |
|        | [ Write to them -> ]           source ↗   |               |
|        +------------------------------------------+               |
|  [warm note]                          [faded cool note]           |
+--------------------------------------------------------------------+
```

1. **Call first card.** When scoring finishes, the centre card turns into the #1 buyer: company, headline and date, a one-line why-now, heat, a big **Write to them** button that opens Quill's letter, and the source link. Every string already runs to the centre, so the wall now points at the buyer.
2. **Heat you can see from across the room.**
   - **Hot (75 or more):** full colour, slightly larger, a pulsing pin, and a "CALL NOW" stamp.
   - **Warm (55 to 74):** as now.
   - **Cool (under 55):** faded, partly greyed, smaller, with a "WATCH" stamp.

   A weak clue should look weak.
3. **Phone view: one list, hottest first.** Below 600px the wall becomes a vertical list. The Call first card sits on top, the notes follow sorted by heat, and the strings are hidden. That's the sales rep on the move.

**5-second answer we want:** "That company, because they just launched WhatsApp ordering. The button says write to them."

## Build steps

| # | Do | Time | Done when |
|---|---|---|---|
| 1 | **Tiers:** in `addClue()`, give hot clues a `hot` class (v0.1 uses an empty class) and set the stamp text by tier. Add CSS: `.clue.cool{opacity:.55;filter:grayscale(.5);scale:.9}`, `.clue.hot{scale:1.06}` and a pulse on `.clue.hot:before`. Use the CSS `scale` property, not `transform`, because `transform` already holds each note's random rotation. | 8 min | A mixed run shows a clear hot, warm and cool difference |
| 2 | **Call first:** after `top` is computed in `go()`, `emit('top',{s:top[0].s})`. Add `render.top(p)`, which rewrites `#center` with the hero layout (a `.hero` class for styles) and wires **Write to them** to `openLetter()` for that clue. `render.reset()` restores the centre card's HTML. Make it remove the `.hero` class too. | 12 min | After a run, the centre card is the hottest buyer and the button opens the letter |
| 3 | **Phone list:** in `addClue()` set `el.style.order=100-h`. Add `@media(max-width:600px)`: the wall becomes a scrolling flex column (`.clue{position:static;width:auto}`), `#strings` and `.hint` are hidden, the centre card is static with `order:-1`, and `.letter` becomes `position:fixed` so the letter isn't stuck at the top of a scrolled list. The existing 900px rule gives the chat the top half, so below 600px put the wall first (`.wall{order:-1}`) and give it about 65% of the height. | 8 min | In DevTools at iPhone size: hero on top, then hottest to coolest |
| 4 | Run once on the WhatsApp recipe and **Save run** (this is the backup). | 2 min | Replay shows the Call first card |

**What changed after testing.** With the strategy track's intent ceiling, scores cluster between 73 and 80, so fixed 75/55 tiers never made anything look weak. The `top` event therefore re-tiers every note by rank: top 3 are hot, the bottom half is cool, the rest are warm. The run also no longer auto-opens a letter at the end, because the letter covered the Call first card. Cool notes fade with `filter`, not `opacity`, because the slap animation holds opacity at 1. On phones, the top bar wraps and the footer is hidden.

Because `top` is an event, Replay plays it back. Runs saved **before** this change don't contain it, so save a fresh run.

## Stretch (only if there's time)

- **Trail badge:** if the strategy track's stack bonus is done, a clue with 2 or more signals shows "2 signals" plus a mini timeline (date: signal) in the hero card.
- **Slack card:** design the automation track's Slack message as a design deliverable. It's the same "Call first" layout in Block Kit.
- **Headline font weight by heat** instead of a uniform 16px.

## Demo (3 minutes)

1. **(20s)** Show v0.1's wall. "Who would you call? Hard to say."
2. **(60s)** Replay our saved run. Clues land, cool ones fade, and the Call first card takes the centre.
3. **(30s)** Do the 5-second test on the judges: hide the screen, show it for 5 seconds, ask who they'd call.
4. **(40s)** Click **Write to them**. Quill's letter opens, and the email opens with the buyer's news.
5. **(30s)** Phone view (DevTools device mode or a real phone): the same story as one list.

**Fallback:** if the live run is slow or the API is rate-limited, use Replay of the saved run. Nothing needs the network.

## Not doing

- A map view: our clues have no reliable location field.
- A timeline across buyers: v0.1 dates are month-level only ("Oct 2026"), too coarse to sort a timeline.
- New fonts, a new layout framework, or a rewrite of the wall.
