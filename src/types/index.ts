export interface TrackedAccount {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  followers: number;
  following: number;
  postsCount: number;
  verified: boolean;
  addedAt: string;
}

export interface PostMetrics {
  id: string;
  text: string;
  likes: number;
  reposts: number;
  replies: number;
  views: number;
  bookmarks: number;
  timestamp: string;
  authorUsername: string;
}

export interface DailyMetrics {
  date: string;
  followers: number;
  impressions: number;
  engagements: number;
  posts: number;
}

export interface EngagementData {
  date: string;
  likes: number;
  reposts: number;
  replies: number;
  bookmarks: number;
}

export interface TopPost extends PostMetrics {
  engagementRate: number;
}
