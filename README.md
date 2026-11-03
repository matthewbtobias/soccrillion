# Soccrillion

A rare-answer football trivia game: seven new prompts every day, 25 seconds each. The rarer your accepted answer, the more points you score and the bigger the ground you play in next, from a park pitch to deep space.

Play: https://matthewbtobias.github.io/soccrillion/

## How it works

- `index.html` is the whole game (no build step).
- `days/index.json` lists every published date, newest first.
- `days/YYYY-MM-DD.json` holds that day's seven prompts and answer sheets. Older days stay in the folder and show up in the game's archive.
- A scheduled Claude task writes the next day's prompts each night and runs `node scripts/add-day.js <file>` to validate and add them.

## Day file format

```json
{"date":"2026-11-03","questions":[
  {"id":"short-id","cat":"eu|nat|mls","people":1,"prompt":"Name a ...","scope":"What counts","note":"One sentence on what the Soccrillion answer is and why it is rare",
   "t":["tier1 answers","tier2","tier3","tier4","tier5"]}
]}
```

Each tier string lists answers separated by `;`, with alias spellings after `|` (display name first). Tiers score 10, 30, 60, 85 and 100 points. Tier 5 holds exactly one answer (two if the sheet has more than 1,000 answers).
