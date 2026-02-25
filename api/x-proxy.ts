import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const bearerToken =
    (req.headers['x-bearer-token'] as string) || process.env.X_BEARER_TOKEN;

  if (!bearerToken) {
    return res.status(401).json({
      error: 'X API Bearer Token is required. Set it in Settings.',
    });
  }

  const { endpoint, ...queryParams } = req.query;

  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ error: 'Missing endpoint parameter' });
  }

  // Only allow X API v2 endpoints
  const allowedPrefixes = ['users/', 'tweets/'];
  if (!allowedPrefixes.some((p) => endpoint.startsWith(p))) {
    return res.status(400).json({ error: 'Invalid endpoint' });
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(queryParams)) {
    if (key !== 'endpoint' && typeof value === 'string') {
      params.set(key, value);
    }
  }

  const url = `https://api.x.com/2/${endpoint}${params.toString() ? '?' + params : ''}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.detail || data.title || 'X API request failed',
        details: data,
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to reach X API',
      details: String(error),
    });
  }
}
