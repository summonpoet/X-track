import { Heart, Repeat2, MessageCircle, Eye, Bookmark } from 'lucide-react';
import type { PostMetrics } from '../types';
import { formatNumber, timeAgo } from '../utils/format';

interface PostCardProps {
  post: PostMetrics;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold">
          {post.authorUsername[0].toUpperCase()}
        </div>
        <span className="text-gray-400 text-sm font-medium">
          @{post.authorUsername}
        </span>
        <span className="text-gray-600">·</span>
        <span className="text-gray-600 text-sm">{timeAgo(post.timestamp)}</span>
      </div>

      <p className="text-white text-[15px] leading-relaxed mb-4">{post.text}</p>

      <div className="flex items-center gap-6 text-gray-500">
        <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
          <MessageCircle className="w-4 h-4" />
          <span className="text-sm">{formatNumber(post.replies)}</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-green-400 transition-colors cursor-pointer">
          <Repeat2 className="w-4 h-4" />
          <span className="text-sm">{formatNumber(post.reposts)}</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-pink-400 transition-colors cursor-pointer">
          <Heart className="w-4 h-4" />
          <span className="text-sm">{formatNumber(post.likes)}</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
          <Eye className="w-4 h-4" />
          <span className="text-sm">{formatNumber(post.views)}</span>
        </div>
        <div className="flex items-center gap-1.5 hover:text-blue-400 transition-colors cursor-pointer">
          <Bookmark className="w-4 h-4" />
          <span className="text-sm">{formatNumber(post.bookmarks)}</span>
        </div>
      </div>
    </div>
  );
}
