// Health check endpoint
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
}

