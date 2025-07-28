import { Router } from 'express';
// Import the new unofficial translation library
import translate from 'google-translate-api-x';

const router = Router();

/*
 * GET /api/translate?q=Hello&to=fr&from=en (from is optional; auto-detected)
 */
router.get('/', async (req, res) => {
  const { q, to, from } = req.query;

  if (!q || !to) {
    console.error('Missing required parameters for translation:', { q, to });
    return res.status(400).json({ error: 'Missing q (query text) or to (target language) param' });
  }

  try {
    // Construct the options for the translation
    const options = {
      to: to,
      autoCorrect: true // Auto-correct minor errors in source text
    };

    // If 'from' language is provided and not 'auto', add it to the options
    if (from && from !== 'auto') {
      options.from = from;
    }

    // Perform translation using google-translate-api-x
    // The library returns an object with `text` (translated), `from` (detected source), etc.
    const { text, from: detected } = await translate(q, options);

    // Send successful response
    res.json({
      result: text,
      detected: detected.language.iso, // Access the ISO code of the detected language
    });

  } catch (err) {
    console.error('Error during google-translate-api-x call:', err.message);
    // Unofficial APIs often fail with simple "Failed to fetch" or similar messages
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
});

export default router;