import type { TrackedAccount, PostMetrics, DailyMetrics, EngagementData } from '../types';

export const trackedAccounts: TrackedAccount[] = [
  {
    id: '1',
    username: 'elonmusk',
    displayName: 'Elon Musk',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=EM&backgroundColor=1d9bf0',
    followers: 196_800_000,
    following: 826,
    postsCount: 48_200,
    verified: true,
    addedAt: '2025-12-01',
  },
  {
    id: '2',
    username: 'OpenAI',
    displayName: 'OpenAI',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=OA&backgroundColor=10a37f',
    followers: 4_200_000,
    following: 42,
    postsCount: 3_800,
    verified: true,
    addedAt: '2025-12-15',
  },
  {
    id: '3',
    username: 'AnthropicAI',
    displayName: 'Anthropic',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=AN&backgroundColor=d97706',
    followers: 580_000,
    following: 12,
    postsCount: 1_200,
    verified: true,
    addedAt: '2026-01-05',
  },
  {
    id: '4',
    username: 'ycombinator',
    displayName: 'Y Combinator',
    avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=YC&backgroundColor=f97316',
    followers: 1_100_000,
    following: 210,
    postsCount: 8_400,
    verified: true,
    addedAt: '2026-01-10',
  },
];

export const recentPosts: PostMetrics[] = [
  {
    id: 'p1',
    text: 'Exciting news! We just released our latest model with significant improvements across all benchmarks.',
    likes: 24_300,
    reposts: 5_800,
    replies: 2_100,
    views: 3_200_000,
    bookmarks: 8_400,
    timestamp: '2026-02-25T10:30:00Z',
    authorUsername: 'AnthropicAI',
  },
  {
    id: 'p2',
    text: 'The future of AI is about making technology that genuinely helps people in their daily work and creativity.',
    likes: 182_000,
    reposts: 28_400,
    replies: 15_200,
    views: 48_000_000,
    bookmarks: 42_000,
    timestamp: '2026-02-24T18:15:00Z',
    authorUsername: 'elonmusk',
  },
  {
    id: 'p3',
    text: 'Introducing our new research paper on reasoning capabilities in large language models.',
    likes: 18_500,
    reposts: 4_200,
    replies: 1_800,
    views: 2_800_000,
    bookmarks: 12_300,
    timestamp: '2026-02-24T14:00:00Z',
    authorUsername: 'OpenAI',
  },
  {
    id: 'p4',
    text: 'Applications for YC Summer 2026 are now open! Apply at ycombinator.com/apply',
    likes: 8_900,
    reposts: 3_100,
    replies: 920,
    views: 1_500_000,
    bookmarks: 5_600,
    timestamp: '2026-02-23T16:45:00Z',
    authorUsername: 'ycombinator',
  },
  {
    id: 'p5',
    text: 'Safety is not a feature you bolt on later. It needs to be part of the foundation from day one.',
    likes: 15_600,
    reposts: 3_800,
    replies: 1_400,
    views: 2_100_000,
    bookmarks: 6_200,
    timestamp: '2026-02-23T09:20:00Z',
    authorUsername: 'AnthropicAI',
  },
  {
    id: 'p6',
    text: 'Great thread on the future of space exploration. The next decade will be transformative.',
    likes: 245_000,
    reposts: 32_000,
    replies: 18_900,
    views: 62_000_000,
    bookmarks: 58_000,
    timestamp: '2026-02-22T20:00:00Z',
    authorUsername: 'elonmusk',
  },
];

function generateDailyMetrics(days: number): DailyMetrics[] {
  const data: DailyMetrics[] = [];
  const now = new Date('2026-02-25');

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 1000 + Math.sin(i * 0.3) * 300;
    data.push({
      date: date.toISOString().split('T')[0],
      followers: Math.floor(580000 + (days - i) * 420 + Math.random() * 200),
      impressions: Math.floor(base * 1000 + Math.random() * 500_000),
      engagements: Math.floor(base * 50 + Math.random() * 10_000),
      posts: Math.floor(2 + Math.random() * 6),
    });
  }
  return data;
}

export const dailyMetrics = generateDailyMetrics(30);

function generateEngagementData(days: number): EngagementData[] {
  const data: EngagementData[] = [];
  const now = new Date('2026-02-25');

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const base = 800 + Math.sin(i * 0.5) * 400;
    data.push({
      date: date.toISOString().split('T')[0],
      likes: Math.floor(base * 20 + Math.random() * 5000),
      reposts: Math.floor(base * 5 + Math.random() * 2000),
      replies: Math.floor(base * 3 + Math.random() * 1000),
      bookmarks: Math.floor(base * 8 + Math.random() * 3000),
    });
  }
  return data;
}

export const engagementData = generateEngagementData(30);

export const overviewStats = {
  totalFollowers: trackedAccounts.reduce((sum, a) => sum + a.followers, 0),
  totalImpressions: 328_400_000,
  totalEngagements: 1_240_000,
  avgEngagementRate: 3.78,
  followerGrowth: 12_480,
  followerGrowthPercent: 2.15,
  impressionChange: 15.3,
  engagementChange: 8.7,
};
