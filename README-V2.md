# Hash&ke GPT Astra AI — V2

## Files

- `index.html` — Astra AI frontend
- `chat.js` — Vercel server function for Gemini chat requests
- `models.js` — Vercel server function for Gemini model discovery
- `vercel.json` — routes the `/api/chat` and `/api/models` endpoints to the root server functions

## Vercel setup

1. Deploy this project to Vercel.
2. Open **Project → Settings → Environment Variables**.
3. Add:

   `GEMINI_API_KEY`

4. Set its value to your real Gemini API key.
5. Redeploy the project.

Do not put the Gemini API key in `index.html`, `chat.js`, `models.js`, GitHub, or any other source file.
