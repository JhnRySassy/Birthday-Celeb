# Cherry Dawang Birthday RSVP

## 1. Deploy sa Vercel
1. I-upload ang buong folder na ito sa isang bagong GitHub repository.
2. Pumunta sa vercel.com, mag-sign in, click "Add New Project," at piliin ang repo mo.
3. Vercel auto-detects na Next.js app ito — "Deploy" lang, walang kailangang i-configure.
4. Makakakuha ka ng live URL katulad ng `cherry-rsvp.vercel.app`.

## 2. I-connect sa Google Sheets (para ma-save at ma-export as Excel)
1. Gumawa ng bagong Google Sheet.
2. Extensions > Apps Script, tapos i-paste ang laman ng `google-apps-script.gs` (kasama sa folder na ito).
3. I-save, then Deploy > New deployment > Type: "Web app."
   - Execute as: **Me**
   - Who has access: **Anyone**
4. I-copy ang Web app URL na ibibigay.
5. Sa `pages/index.js`, hanapin ang linyang ito malapit sa taas:
   ```js
   const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_URL_HERE";
   ```
   Palitan ng na-copy mong URL, i-save, i-push ulit sa GitHub — mag-a-auto-redeploy si Vercel.

Bawat RSVP submission ay mapupunta na sa isang "RSVPs" tab sa Sheet mo, may Timestamp, Name, Guests, Contact, Message, at Code.

## 3. I-download bilang Excel
Sa Google Sheets: **File > Download > Microsoft Excel (.xlsx)** — kukunin lahat ng laman ng "RSVPs" tab bilang .xlsx file, real-time updated anytime may bagong RSVP.

## I-edit ang event details
Buksan ang `pages/index.js`, hanapin ang `EVENT` object sa taas — dun mo palitan ang time, venue, address, dress code.
