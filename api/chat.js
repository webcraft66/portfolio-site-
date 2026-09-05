// Vercel serverless function — runs on the server, never in the browser.
// Your Gemini API key stays here, read from an environment variable,
// so it's never visible in the page source.

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'Server is missing GEMINI_API_KEY. Add it in Vercel → Project → Settings → Environment Variables.'
    });
    return;
  }

  try {
    const { message, history, profile } = req.body || {};

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Missing "message" in request body.' });
      return;
    }

    const systemInstruction =
      `You are a professional AI assistant representing ${profile?.name || 'the portfolio owner'} on their personal ` +
      `portfolio site, speaking to recruiters, hiring managers, and potential clients on their behalf — the way a ` +
      `polished executive assistant would introduce a candidate. Always refer to them in the third person by name ` +
      `or "she/her" — never pretend to be them directly, and never break character. ` +
      `Answer strictly using the facts given below — do not invent education, skills, experience, or claims that ` +
      `aren't listed; if something isn't covered, say you don't have that detail and suggest contacting her directly. ` +
      `Keep a warm but corporate, confident and concise tone (2-4 sentences per reply), matching the visitor's ` +
      `language style (English, Hindi, or Hinglish). If asked something unrelated to her profile, politely decline ` +
      `and steer the conversation back to her background, skills, or projects.\n\n` +
      `Profile:\n${JSON.stringify(profile || {}, null, 2)}`;

    const contents = Array.isArray(history)
      ? history
          .filter(m => m && typeof m.text === 'string')
          .map(m => ({
            role: m.sender === 'user' ? 'user' : 'model',
            parts: [{ text: m.text }]
          }))
      : [];

    contents.push({ role: 'user', parts: [{ text: message }] });

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { maxOutputTokens: 220, temperature: 0.6 }
        })
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      res.status(geminiRes.status).json({ error: data?.error?.message || 'Gemini API error.' });
      return;
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    res.status(200).json({ reply: text || "Sorry, I couldn't generate a reply just now." });
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong on the server.' });
  }
};
