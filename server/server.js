import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import translateRouter from './routes/translate.js';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/translate', translateRouter);

export default app;

if (process.env.NODE_ENV !== 'production') {

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const buildPath = path.join(__dirname, '../client/dist');

    app.use(express.static(buildPath));
    app.get('*', (_, res) => res.sendFile(path.join(buildPath, 'index.html')));

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`API running on :${PORT}`));
}

