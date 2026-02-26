import type { Tweet, TrackedAccount } from '../types';

// Fetch tweets for a single user via Nitter RSS proxy
export async function fetchUserTweets(
  username: string,
  nitterInstance: string
): Promise<Tweet[]> {
  const res = await fetch(
    `/api/x-proxy?username=${encodeURIComponent(username)}`,
    {
      headers: { 'X-Nitter-Instance': nitterInstance },
    }
  );

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      err.error || `Failed to fetch posts for @${username}`
    );
  }

  const data = await res.json();

  if (!data.tweets || data.tweets.length === 0) return [];

  return data.tweets.map(
    (t: { id: string; text: string; createdAt: string; url: string; authorUsername: string }) => ({
      id: t.id,
      text: t.text,
      authorUsername: t.authorUsername,
      authorDisplayName: username,
      authorProfileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=1d9bf0`,
      createdAt: t.createdAt,
      url: t.url,
    })
  );
}

// Fetch tweets for all tracked accounts
export async function fetchAllTweets(
  accounts: TrackedAccount[],
  nitterInstance: string
): Promise<Tweet[]> {
  const results = await Promise.allSettled(
    accounts.map((a) => fetchUserTweets(a.username, nitterInstance))
  );

  const tweets: Tweet[] = [];
  const errors: string[] = [];
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    if (r.status === 'fulfilled') {
      tweets.push(...r.value);
    } else {
      errors.push(`@${accounts[i].username}: ${r.reason?.message || 'failed'}`);
    }
  }

  if (tweets.length === 0 && errors.length > 0) {
    throw new Error(
      `Failed to fetch posts:\n${errors.join('\n')}`
    );
  }

  tweets.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  return tweets;
}

// Call Claude API to summarize tweets
export async function summarizeTweets(
  tweets: Tweet[],
  claudeApiKey: string,
  customPrompt?: string
): Promise<string> {
  const tweetTexts = tweets
    .map(
      (t) =>
        `[@${t.authorUsername} · ${new Date(t.createdAt).toLocaleDateString()}]\n${t.text}`
    )
    .join('\n\n---\n\n');

  const systemPrompt = `You are a helpful assistant that summarizes social media posts from X (Twitter).
Provide concise, insightful summaries in Chinese (unless the user asks otherwise).
Highlight key themes, important announcements, and interesting discussions.
Use markdown formatting for readability.`;

  const userPrompt =
    customPrompt ||
    `Please summarize the following ${tweets.length} posts from X. Group by theme if possible, highlight the most important information, and note any trends:\n\n${tweetTexts}`;

  const res = await fetch('/api/claude-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Claude-Key': claudeApiKey,
    },
    body: JSON.stringify({
      system: systemPrompt,
      message: userPrompt,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Claude API call failed');
  }

  const data = await res.json();
  return data.content;
}

// Deep research: ask Claude to explore a topic based on tweets
export async function researchTopic(
  topic: string,
  relatedTweets: Tweet[],
  claudeApiKey: string
): Promise<string> {
  const context = relatedTweets
    .map((t) => `[@${t.authorUsername}] ${t.text}`)
    .join('\n\n');

  const res = await fetch('/api/claude-proxy', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Claude-Key': claudeApiKey,
    },
    body: JSON.stringify({
      system: `You are a research assistant. Based on social media posts and your knowledge, provide in-depth analysis on the given topic. Write in Chinese unless asked otherwise. Use markdown.`,
      message: `Topic: "${topic}"\n\nRelated posts from X:\n${context}\n\nPlease provide a comprehensive analysis of this topic. Include background context, key points from these posts, your analysis of the implications, and what to watch for going forward.`,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Research request failed');
  }

  const data = await res.json();
  return data.content;
}
