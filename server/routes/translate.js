import { Router } from 'express';
import translate from 'google-translate-api-x';

const router = Router();

router.get('/', async (req, res) => {
  const { q, to, from } = req.query;

  if (!q || !to) {
    console.error('Missing required parameters for translation:', { q, to });
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
    console.error('Error during google-translate-api-x call:', err.message);
    res.status(500).json({ error: 'Translation failed', details: err.message });
  }
});

export default router;
