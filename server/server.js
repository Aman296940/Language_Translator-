import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import translateRouter from './routes/translate.js';

dotenv.config();
const app = express();
app.use(cors());
app.use('/api/translate', translateRouter);

// --- IMPORTANT MODIFICATION STARTS HERE ---

// In a serverless environment like Vercel, your app is not 'listened' to directly.
// Instead, you export the app instance, and the serverless platform handles the incoming requests.
// This line replaces the need for `app.listen()` in production.
export default app;

// The following block is for local development only.
// Vercel sets `process.env.NODE_ENV` to 'production' during deployment,
// so this `app.listen` will not run on Vercel.
if (process.env.NODE_ENV !== 'production') {
    // These imports and static serving are only relevant if you're serving
    // the frontend from the *same* Express server locally.
    // In a Vercel monorepo setup, Vercel serves the frontend separately.
    import { dirname } from 'node:path';
    import { fileURLToPath } from 'node:url';
    import path from 'node:path';

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const buildPath = path.join(__dirname, '../frontend/dist');

    // Serve React build locally if not in production
    app.use(express.static(buildPath));
    app.get('*', (_, res) => res.sendFile(path.join(buildPath, 'index.html')));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
}

// --- IMPORTANT MODIFICATION ENDS HERE ---