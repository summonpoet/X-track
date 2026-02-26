export interface TrackedAccount {
  id: string;
  username: string;
  displayName: string;
  profileImageUrl: string;
  addedAt: string;
}

export interface Tweet {
  id: string;
  text: string;
  authorUsername: string;
  authorDisplayName: string;
  authorProfileImage: string;
  createdAt: string;
  url: string;
}

export interface AISummary {
  id: string;
  title: string;
  summary: string;
  keyTopics: string[];
  sourceTweets: Tweet[];
  createdAt: string;
}

export interface ApiKeys {
  nitterInstance: string;
  claudeApiKey: string;
}
