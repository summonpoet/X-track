import type { Tweet, TrackedAccount } from '../types';

// Fetch tweets for a single user via X API v2
export async function fetchUserTweets(
  username: string,
  bearerToken: string,
  maxResults = 10
): Promise<Tweet[]> {
  // Step 1: get user ID by username
  const userRes = await fetch(`/api/x-proxy?endpoint=users/by/username/${username}`, {
    headers: { 'X-Bearer-Token': bearerToken },
  });
  if (!userRes.ok) {
    const err = await userRes.json().catch(() => ({}));
    throw new Error(err.error || `Failed to look up @${username}`);
  }
  const userData = await userRes.json();
  const userId = userData.data?.id;
  if (!userId) throw new Error(`User @${username} not found`);

  // Step 2: get recent tweets
  const params = new URLSearchParams({
    endpoint: `users/${userId}/tweets`,
    'tweet.fields': 'created_at,public_metrics',
    'user.fields': 'name,profile_image_url',
    max_results: String(maxResults),
    exclude: 'retweets,replies',
  });

  const tweetsRes = await fetch(`/api/x-proxy?${params}`, {
    headers: { 'X-Bearer-Token': bearerToken },
  });
  if (!tweetsRes.ok) {
    const err = await tweetsRes.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch tweets');
  }
  const tweetsData = await tweetsRes.json();

  if (!tweetsData.data) return [];

  return tweetsData.data.map((t: Record<string, unknown>) => {
    const metrics = (t.public_metrics || {}) as Record<string, number>;
    return {
      id: t.id as string,
      text: t.text as string,
      authorUsername: username,
      authorDisplayName: userData.data.name || username,
      authorProfileImage:
        userData.data.profile_image_url ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${username}`,
      createdAt: t.created_at as string,
      likes: metrics.like_count || 0,
      retweets: metrics.retweet_count || 0,
      replies: metrics.reply_count || 0,
      views: metrics.impression_count || 0,
      url: `https://x.com/${username}/status/${t.id}`,
    } satisfies Tweet;
  });
}

// Fetch tweets for all tracked accounts
export async function fetchAllTweets(
  accounts: TrackedAccount[],
  bearerToken: string,
  maxPerAccount = 10
): Promise<Tweet[]> {
  const results = await Promise.allSettled(
    accounts.map((a) => fetchUserTweets(a.username, bearerToken, maxPerAccount))
  );

  const tweets: Tweet[] = [];
  for (const r of results) {
    if (r.status === 'fulfilled') tweets.push(...r.value);
  }

  // Sort by creation time descending
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
