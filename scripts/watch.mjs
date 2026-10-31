// Morning buyer alert: run a recipe, let the AI judge the evidence, post new buyers to Slack.
// Usage: node scripts/watch.mjs [recipe.json] [--dry] [--fresh]
// Env: OLLAMA_API_KEY, SLACK_WEBHOOK_URL, SHEET_WEBHOOK_URL (optional), FOCUS (e.g. India), FRESH=true, SEEN (default seen.json)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { gnews, bing } from '../api/search.js';

const TODAY = new Date().toISOString().slice(0, 10);
const TYPES = 'tender|hiring|purchase|expansion|regulation|competitor|event|social';
const sleep = ms => new Promise(r => setTimeout(r, ms));
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const keyOf = c => String(c || '').toLowerCase().replace(/[^a-z0-9]/g, '');
export const heat = s => Math.min(100, Math.round(((+s.fit || 0) + (+s.freshness || 0) + (+s.intent || 0)) / 15 * 100) + (s.double ? 15 : 0));

// Keep companies not sent before, or sent before but now showing a new signal type (a double signal). Updates seen.
export function triage(found, seen, now = TODAY) {
  const byCo = Object.create(null); // company keys like "constructor" must not hit Object.prototype
  for (const s of found) {
    const k = keyOf(s.company); if (!k) continue;
    if (byCo[k]) { byCo[k].types.add(s.type); continue; } // two hunts found the same company
    byCo[k] = { s, types: new Set([s.type]) };
  }
  const out = [];
  for (const [k, { s, types }] of Object.entries(byCo)) {
    const old = new Set((Object.hasOwn(seen, k) && seen[k].types) || []);
    if (![...types].some(t => !old.has(t))) continue;
    const all = [...new Set([...old, ...types])];
    out.push({ ...s, types: all, double: all.length > 1 });
    seen[k] = { company: s.company, types: all, last: now };
  }
  return out.sort((a, b) => heat(b) - heat(a));
}

export function card(name, out, known) {
  if (!out.length) return { text: `No new buyers for ${name} today (${known} already known).` };
  const day = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' });
  const row = s => `${s.double ? '*DOUBLE SIGNAL*  ' : ''}*${esc(s.company)}*  ·  heat ${heat(s)}  ·  ${esc(s.types.join(' + '))}\n${esc(s.headline)}${s.date ? ` (${esc(s.date)})` : ''}\n_Why now:_ ${esc(s.why_now)}${/^https?:\/\/[^\s<>|]+$/.test(s.source_url || '') ? `\n<${s.source_url}|source>` : ''}`;
  return {
    text: `${out.length} new buyers for ${name}`,
    blocks: [
      { type: 'header', text: { type: 'plain_text', text: `${out.length} new buyer${out.length > 1 ? 's' : ''} for ${name} · ${day}` } },
      ...out.slice(0, 5).flatMap(s => [{ type: 'section', text: { type: 'mrkdwn', text: row(s) } }, { type: 'divider' }]),
      ...(out.length > 5 ? [{ type: 'context', elements: [{ type: 'mrkdwn', text: `+${out.length - 5} more on the wall` }] }] : []),
    ],
  };
}

// one sheet row per buyer, keys match the Apps Script in docs/guide.md. A leading ' stops Sheets running web text as a formula.
const cell = v => /^[\s\u0000-\u001f]*[=+\-@＝＋－＠]/.test(String(v ?? '')) ? "'" + v : v ?? '';
export const sheetRow = s => ({ company: cell(s.company), type: cell(s.types.join(' + ')), heat: heat(s), headline: cell(s.headline), source_url: cell(s.source_url), why_now: cell(s.why_now) });

// shortcut: copied from P.scout in index.html, keep both in sync until the prompts move to a shared module.
const scoutPrompt = (b, items, focus, ev) => `Today is ${TODAY}. Find REAL, recent (last 12 months) public evidence that specific organisations are about to need what ${b.name} sells (${b.sells}).
Trigger moment: ${b.trigger_moment}. ${focus ? 'Focus: ' + focus + '.' : ''}
${(b.buyers || []).length ? `Ideal buyers: ${b.buyers.join(', ')}. Score fit 1-2 for organisations outside these.` : ''}
Look for:
${items.map((r, i) => `${i + 1}. ${r.signal}: ${r.look_for}${r.intent ? ` (intent if found: ${r.intent})` : ''}`).join('\n')}
Only include organisations that appear in the search results below. Never invent companies, dates, people or links. Any source_url must be one of the URLs below.
Targets must be END BUYERS (organisations that would pay for this), never vendors in the same space: skip ${b.name}, its competitors (${(b.competitors || []).join(', ')}) and other companies that sell similar products or services.
A job post only counts if the hiring organisation is a buyer. Return up to 6 results, each a different organisation.
Return ONLY a JSON array: [{"company":"","type":"${TYPES}","headline":"what happened, factual, max 16 words","date":"Mon YYYY or ''","source_url":"","why_now":"why they need ${b.name} soon, max 22 words","fit":1-5,"freshness":1-5,"intent":1-5}]

WEB SEARCH RESULTS (searched just now):
${ev.map((x, i) => `[${i + 1}] ${x.title}\nURL: ${x.url}\n${String(x.content || '').replace(/\s+/g, ' ').slice(0, 500)}`).join('\n\n')}`;

async function askOllama(prompt) {
  for (let n = 0; ; n++) {
    const r = await fetch('https://ollama.com/api/chat', {
      method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + process.env.OLLAMA_API_KEY },
      body: JSON.stringify({ model: 'gpt-oss:120b', stream: false, format: 'json', options: { temperature: 0.5 }, messages: [{ role: 'user', content: prompt + '\n\nReply with the JSON only.' }] }),
    });
    const j = await r.json().catch(() => ({ error: 'status ' + r.status }));
    const err = j.error && String(j.error.message || j.error);
    if (!err) {
      let d;
      try { d = JSON.parse(j.message?.content || '{}'); } catch { if (n === 2) throw new Error('the reply came back garbled'); continue; }
      // format:'json' forces an object, so unwrap the array the model put inside one
      return Array.isArray(d) ? d : Object.values(d).find(Array.isArray) || (d.company ? [d] : []);
    }
    if (n === 2 || !/rate|limit|quota|overload|busy|429|5\d\d/i.test(err)) throw new Error(err);
    await sleep(6000 * (n + 1));
  }
}

async function hunt(R, items, focus) {
  const res = (await Promise.all(items.map(r => {
    const q = r.query + (focus && !r.query.includes(focus) ? ' ' + focus : '');
    return Promise.all([gnews(q).catch(() => []), bing(q).catch(() => [])]);
  }))).flat(2);
  const urls = new Set(), ev = res.filter(x => x.url && !urls.has(x.url) && urls.add(x.url)).slice(0, 28);
  if (!ev.length) return [];
  const minYear = new Date().getFullYear() - 1;
  return (await askOllama(scoutPrompt(R.business, items, focus, ev))).filter(s => {
    if (!s?.company) return false;
    const yr = +(String(s.date || '').match(/20\d\d/) || [0])[0];
    if (yr && yr < minYear) return false;
    if (!urls.has(s.source_url)) s.source_url = ''; // only links that came back from the search, never AI-written ones
    // recipe intent is a ceiling per signal type, same rule as index.html
    const cap = Math.max(0, ...R.signals_to_watch.filter(r => r.type === s.type && r.intent).map(r => +r.intent));
    if (cap) s.intent = Math.min(+s.intent || 0, cap);
    return true;
  });
}

async function main() {
  const args = process.argv.slice(2), dry = args.includes('--dry');
  const fresh = args.includes('--fresh') || process.env.FRESH === 'true';
  const R = JSON.parse(readFileSync(args.find(a => !a.startsWith('--')) || 'recipes/whatsapp-platform.json', 'utf8'));
  const SEEN = process.env.SEEN || 'seen.json', focus = process.env.FOCUS || '';
  if (!process.env.OLLAMA_API_KEY) throw new Error('OLLAMA_API_KEY is not set');
  if (!dry && !process.env.SLACK_WEBHOOK_URL) throw new Error('SLACK_WEBHOOK_URL is not set (use --dry to print instead)');

  const groups = [[], [], [], []]; R.signals_to_watch.forEach((r, i) => groups[i % 4].push(r));
  const hunts = await Promise.allSettled(groups.filter(g => g.length).map(g => hunt(R, g, focus)));
  hunts.filter(h => h.status === 'rejected').forEach(h => console.warn('hunt failed:', h.reason?.message));
  if (hunts.every(h => h.status === 'rejected')) throw new Error('every hunt failed');
  const found = hunts.flatMap(h => h.value || []);

  const seen = existsSync(SEEN) ? JSON.parse(readFileSync(SEEN, 'utf8')) : {};
  const base = fresh ? {} : seen, out = triage(found, base);
  const payload = card(R.business.name, out, Object.keys(seen).length);
  console.log(`${found.length} clues, ${out.length} new, ${out.filter(s => s.double).length} double`);
  if (dry) return console.log(JSON.stringify(payload, null, 2));

  // the schedule stays quiet on days with nothing new; manual runs always answer
  if (out.length || process.env.GITHUB_EVENT_NAME !== 'schedule') {
    const r = await fetch(process.env.SLACK_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    if (!r.ok) throw new Error(`slack said ${r.status}: ${await r.text()}`);
  }
  writeFileSync(SEEN, JSON.stringify({ ...seen, ...base }, null, 2));

  // sheet failures only warn: failing the job would skip the cache save and re-send today's buyers to Slack
  if (process.env.SHEET_WEBHOOK_URL) for (const s of out) {
    const r = await fetch(process.env.SHEET_WEBHOOK_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sheetRow(s)) }).catch(e => ({ ok: false, status: e.message }));
    if (!r.ok) { console.warn(`sheet stopped at ${s.company}: ${r.status}`); break; }
  }
  if (process.env.SHEET_WEBHOOK_URL) console.log(`${out.length} rows sent to the sheet`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main().catch(e => { console.error(e.message); process.exit(1); });
