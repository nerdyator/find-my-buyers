# Setup guide

Everything the three tracks need, in order. Steps 1 to 5 take about 15 minutes. Steps 6 and 7 are only for the stretch goals.

| Step | Needed for | Time |
|---|---|---|
| 1. Fork and repoint your clone | All tracks | 3 min |
| 2. Ollama API key | All tracks | 2 min |
| 3. Deploy the fork on Vercel | Design, Strategy | 4 min |
| 4. Slack webhook | Automation | 4 min |
| 5. Turn on GitHub Actions and add secrets | Automation | 2 min |
| 6. Google Sheet log (optional) | Automation stretch | 5 min |
| 7. WhatsApp test number (optional) | Automation stretch | 10 min |

**Keys never go in `index.html` or a commit.** They live in Vercel, GitHub secrets or a git-ignored `.env`.

---

## 1. Fork and repoint your clone

Your local clone points at the organiser's repo (`Jijo01pup/find-my-buyers`). You can't push there.

1. Open https://github.com/Jijo01pup/find-my-buyers and click **Fork**, then create the fork under your personal account.
2. In this folder, keep the original as `upstream` and make your fork `origin`. Your clone uses the SSH alias `github.com-personal`, so keep it:
   ```sh
   git remote rename origin upstream
   git remote add origin git@github.com-personal:<your-username>/find-my-buyers.git
   git push -u origin main
   ```
3. Check that `git remote -v` shows `origin` as your fork.

## 2. Ollama API key (the AI)

v0.1's default AI is Ollama's cloud models, and the key is free.

1. Sign up at https://ollama.com, then open https://ollama.com/settings/keys and click **Add API key**. Copy it.
2. Test it:
   ```sh
   curl https://ollama.com/api/chat -H "Authorization: Bearer <key>" \
     -d '{"model":"gpt-oss:120b","stream":false,"messages":[{"role":"user","content":"say hi"}]}'
   ```
   You should get JSON with a `message`.

## 3. Deploy the fork on Vercel

1. Go to https://vercel.com/new, sign in with GitHub, and **Import** your fork.
2. Set Framework Preset to **Other**. Leave the build command empty.
3. Under **Environment Variables**, add `OLLAMA_API_KEY` = your key, ticked for all environments (Production, Preview, Development).
4. Click **Deploy**. Every push to `main` redeploys in about 30 seconds.
5. Check it:
   - `https://<your-app>.vercel.app/api/ok` returns `{"ok":true}`
   - `https://<your-app>.vercel.app/api/search?q=whatsapp ordering` returns results
   - The home page runs a search with no key.

6. **Sign the letters.** On your live site, click **Use my own key**. Leave the key empty and keep the provider on **Ollama**. Set **Sign messages as** to `Amit Chavan, Founder, Sobot`, then click **Save**. This is stored per browser, so repeat it on the demo laptop.

**Local testing (optional, faster than pushing):** run `npx vercel dev` in this folder. The first run asks you to log in and link the project, then pulls the Development env vars. It also creates `.vercel/`. Make sure `.vercel` and `.env*` are in `.gitignore` before you commit.

## 4. Slack webhook

1. No Slack workspace? Create a free one at https://slack.com/get-started. Then create a channel, for example `#buyer-alerts`.
2. Go to https://api.slack.com/apps and choose **Create New App**, then **From scratch**. Name it `Buyer alerts` and pick your workspace.
3. In the left menu, choose **Incoming Webhooks**, switch it **On**, click **Add New Webhook**, pick `#buyer-alerts`, and click **Allow**.
4. Copy the webhook URL (`https://hooks.slack.com/services/...`). Treat it like a password: Slack revokes webhook URLs that get pushed to GitHub.
5. Test it:
   ```sh
   curl -X POST -H 'Content-type: application/json' --data '{"text":"buyer alerts online"}' <webhook-url>
   ```

## 5. Turn on GitHub Actions and add secrets

Forks start with Actions turned off.

1. On your fork, open the **Actions** tab and click **I understand my workflows, go ahead and enable them**.
2. Go to **Settings**, then **Secrets and variables**, then **Actions**, and click **New repository secret**. Add:
   - `OLLAMA_API_KEY`
   - `SLACK_WEBHOOK_URL`

   Or from the terminal: `gh secret set OLLAMA_API_KEY` and `gh secret set SLACK_WEBHOOK_URL`. Each one prompts for the value.
3. Once `.github/workflows/watch.yml` is pushed (automation track), it appears under Actions with a **Run workflow** button. If the scheduled runs don't fire, open the workflow there and click **Enable workflow** if you see it.

## 6. Google Sheet log (optional)

1. Open https://sheets.new. Put these headers in row 1: `when, company, type, heat, headline, source, why_now`.
2. Go to **Extensions**, then **Apps Script**, replace the code with this, and save:
   ```js
   function doPost(e) {
     const d = JSON.parse(e.postData.contents);
     SpreadsheetApp.getActiveSheet().appendRow([new Date(), d.company, d.type, d.heat, d.headline, d.source_url, d.why_now]);
     return ContentService.createTextOutput('ok');
   }
   ```
3. Choose **Deploy**, then **New deployment**. Set the type to **Web app**, Execute as **Me**, and Who has access **Anyone**. Deploy and authorise.
4. Copy the web app URL and add it as the secret `SHEET_WEBHOOK_URL`. Anyone with the URL can add rows, so keep it secret.

## 7. WhatsApp Cloud API test number (optional)

This sends the alert to your own team's WhatsApp, not to prospects.

1. Go to https://developers.facebook.com, open **My Apps**, and click **Create App**. Choose the WhatsApp / business use case and add the **WhatsApp** product.
2. Open **WhatsApp**, then **API Setup**. You get a free test number. Add your own phone as a recipient (it's verified by code, and up to 5 numbers are allowed).
3. Copy the **temporary access token** (it expires after 24 hours) and the **Phone number ID**. Add them as the secrets `WA_TOKEN` and `WA_PHONE_ID`, plus `WA_TO` (your number with country code, no `+`).
4. Free-form text only goes through within 24 hours of the recipient messaging the business. **Send "hi" to the test number from your phone before the demo.** Otherwise only the `hello_world` template is allowed.
5. To send, `POST https://graph.facebook.com/<version>/<WA_PHONE_ID>/messages` with the header `Authorization: Bearer <WA_TOKEN>` and this body:
   ```json
   {"messaging_product":"whatsapp","to":"<WA_TO>","type":"text","text":{"body":"3 new buyers..."}}
   ```
   Use the API version shown on the API Setup page.

---

## Before you demo (checklist)

- [ ] The live site runs a full search on your fork's URL.
- [ ] **Design:** a run saved *after* the design changes (`Save run`), plus a phone screenshot.
- [ ] **Strategy:** a screenshot of the live find with its URL and date, and `recipes/whatsapp-platform.json` pushed.
- [ ] **Automation:** at least one unattended run in Actions, and its Slack card in the channel.
- [ ] Laptop charged, the Slack channel open in a tab, and the Actions page open in a tab.
