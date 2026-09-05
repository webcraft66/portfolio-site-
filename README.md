# Mansi Srivastav — Portfolio

Static portfolio (`index.html`) with a voice-enabled assistant. The assistant
answers from a built-in profile by default, and gets smarter (understands any
phrasing, not just keywords) once you connect a free Gemini API key through a
secure serverless function — the key never touches the browser.

## Deploy on Vercel (free)

1. **Get a free Gemini API key**
   Go to [aistudio.google.com/apikey](https://aistudio.google.com/apikey),
   sign in with Google, and click "Create API key". Copy it.

2. **Push this folder to GitHub** (or use the Vercel CLI directly — step 4 below).

3. **Import the project on Vercel**
   Go to [vercel.com](https://vercel.com) → "Add New Project" → import your
   GitHub repo. Vercel will auto-detect `index.html` and the `api/` folder —
   no build settings needed.

4. **Add the environment variable**
   In the project → Settings → Environment Variables, add:
   - Key: `GEMINI_API_KEY`
   - Value: (the key you copied in step 1)

   Redeploy after adding it (Vercel prompts you to).

5. Done — `yoursite.vercel.app/api/chat` is now live, and the chat widget on
   the homepage will automatically use it.

### Alternative: deploy via CLI

```bash
npm install -g vercel
cd portfolio-site
vercel
vercel env add GEMINI_API_KEY
vercel --prod
```

## Notes

- **Icons & PWA**: `icons/` and `manifest.json` are included so the site
  shows a proper icon when saved to a phone's home screen and works as an
  installable PWA. No extra setup needed — Vercel serves them automatically.
- If the API isn't set up yet (or a request fails for any reason), the
  chatbot automatically falls back to its built-in keyword-based answers —
  so the site always works, even before you add the key.
- To update your details (name, education, skills, projects, contact),
  edit the `PROFILE` object near the top of the `<script>` section in
  `index.html`. Both the page content and the assistant's answers read from
  this one object.
- Free tier limits apply on the Gemini API — fine for personal portfolio
  traffic. Check current limits at [ai.google.dev/pricing](https://ai.google.dev/pricing).
