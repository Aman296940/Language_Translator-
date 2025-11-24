// Vercel serverless function for translation
import translate from 'google-translate-api-x';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { q, to, from } = req.query;

  if (!q || !to) {
    return res.status(400).json({ error: 'Missing q (query text) or to (target language) param' });
  }

  try {
    const options = {
      to: to,
      autoCorrect: true
    };

    if (from && from !== 'auto') {
      options.from = from;
    }

    const { text, from: detected } = await translate(q, options);

    res.json({
      result: text,
      detected: detected.language.iso,
    });
  } catch (err) {
    console.error('Error during translation:', err.message);
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
}

