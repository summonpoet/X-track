import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const claudeKey =
    (req.headers['x-claude-key'] as string) || process.env.CLAUDE_API_KEY;

  if (!claudeKey) {
    return res.status(401).json({
      error: 'Claude API Key is required. Set it in Settings.',
    });
  }

  const { system, message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message in request body' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': claudeKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        system: system || 'You are a helpful assistant.',
        messages: [{ role: 'user', content: message }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || 'Claude API request failed',
        details: data,
      });
    }

    const textContent = data.content?.find(
      (block: { type: string }) => block.type === 'text'
    );

    return res.status(200).json({
      content: textContent?.text || '',
    });
  } catch (error) {
    return res.status(500).json({
      error: 'Failed to reach Claude API',
      details: String(error),
    });
  }
}
