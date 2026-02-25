import { useState } from 'react';
import { ArrowUpDown, Filter } from 'lucide-react';
import PostCard from '../components/PostCard';
import { recentPosts } from '../data/mockData';
import type { PostMetrics } from '../types';

type SortKey = 'timestamp' | 'likes' | 'reposts' | 'views';

export default function Posts() {
  const [sortBy, setSortBy] = useState<SortKey>('timestamp');
  const [filterAccount, setFilterAccount] = useState<string>('all');

  const uniqueAuthors = [...new Set(recentPosts.map((p) => p.authorUsername))];

  const sorted = [...recentPosts]
    .filter((p) => filterAccount === 'all' || p.authorUsername === filterAccount)
    .sort((a, b) => {
      if (sortBy === 'timestamp') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return (b[sortBy] as number) - (a[sortBy] as number);
    });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Posts</h1>
        <p className="text-gray-500 mt-1">All tracked posts and their metrics</p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-full px-4 py-2">
          <ArrowUpDown className="w-4 h-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortKey)}
            className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
          >
            <option value="timestamp">Most Recent</option>
            <option value="likes">Most Liked</option>
            <option value="reposts">Most Reposted</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-gray-950 border border-gray-800 rounded-full px-4 py-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={filterAccount}
            onChange={(e) => setFilterAccount(e.target.value)}
            className="bg-transparent text-white text-sm focus:outline-none cursor-pointer"
          >
            <option value="all">All Accounts</option>
            {uniqueAuthors.map((author) => (
              <option key={author} value={author}>
                @{author}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {sorted.map((post: PostMetrics) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>

      {sorted.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No posts found</p>
        </div>
      )}
    </div>
  );
}
