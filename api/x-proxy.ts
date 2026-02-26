import type { VercelRequest, VercelResponse } from '@vercel/node';

// Fetch RSS feed from a Nitter instance and parse tweets
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const username = req.query.username as string;
  const nitterInstance =
    (req.headers['x-nitter-instance'] as string) ||
    process.env.NITTER_INSTANCE ||
    'https://nitter.privacydev.net';

  if (!username) {
    return res.status(400).json({ error: 'Missing username parameter' });
  }

  // Sanitize username
  const cleanUsername = username.replace(/[^a-zA-Z0-9_]/g, '');
  if (!cleanUsername) {
    return res.status(400).json({ error: 'Invalid username' });
  }

  const rssUrl = `${nitterInstance.replace(/\/$/, '')}/${cleanUsername}/rss`;

  try {
    const response = await fetch(rssUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; XTracker/1.0)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
    });

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Nitter returned ${response.status}. The instance may be down or rate-limited.`,
        instance: nitterInstance,
      });
    }

    const xml = await response.text();

    // Parse RSS XML to extract items
    const items = parseRssItems(xml, cleanUsername);

    return res.status(200).json({
      username: cleanUsername,
      instance: nitterInstance,
      tweets: items,
    });
  } catch (error) {
    return res.status(500).json({
      error: `Failed to reach Nitter instance at ${nitterInstance}`,
      details: String(error),
      hint: 'Try a different Nitter instance in Settings.',
    });
  }
}

interface ParsedTweet {
  id: string;
  text: string;
  createdAt: string;
  url: string;
  authorUsername: string;
}

function parseRssItems(xml: string, username: string): ParsedTweet[] {
  const items: ParsedTweet[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, 'title');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const description = extractTag(itemXml, 'description');

    // Use description (full content) if available, otherwise title
    const text = cleanHtml(description || title || '');

    // Extract tweet ID from link (e.g. https://nitter.net/user/status/123456)
    const idMatch = link?.match(/status\/(\d+)/);
    const id = idMatch ? idMatch[1] : String(Date.now() + items.length);

    // Build real X URL
    const xUrl = `https://x.com/${username}/status/${id}`;

    if (text) {
      items.push({
        id,
        text,
        createdAt: pubDate || new Date().toISOString(),
        url: xUrl,
        authorUsername: username,
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string | null {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tag}>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*</${tag}>`);
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`);
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function cleanHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<a[^>]*href="([^"]*)"[^>]*>[^<]*<\/a>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
