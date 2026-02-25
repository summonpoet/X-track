import { Heart, Repeat2, MessageCircle, Eye, ExternalLink, Sparkles } from 'lucide-react';
import type { Tweet } from '../types';
import { formatNumber, timeAgo } from '../utils/format';

interface TweetCardProps {
  tweet: Tweet;
  onSummarize?: (tweet: Tweet) => void;
  onResearch?: (tweet: Tweet) => void;
  compact?: boolean;
}

export default function TweetCard({ tweet, onSummarize, onResearch, compact }: TweetCardProps) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
      {/* Author header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={tweet.authorProfileImage}
            alt={tweet.authorDisplayName}
            className="w-10 h-10 rounded-full bg-gray-800"
          />
          <div>
            <span className="font-bold text-white text-sm">
              {tweet.authorDisplayName}
            </span>
            <div className="flex items-center gap-1.5 text-gray-500 text-xs">
              <span>@{tweet.authorUsername}</span>
              <span>·</span>
              <span>{timeAgo(tweet.createdAt)}</span>
            </div>
          </div>
        </div>
        <a
          href={tweet.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-full hover:bg-gray-900 text-gray-600 hover:text-blue-400 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Tweet text */}
      <p className="text-white text-[15px] leading-relaxed mb-4 whitespace-pre-wrap">
        {tweet.text}
      </p>

      {/* Metrics */}
      {!compact && (
        <div className="flex items-center gap-5 text-gray-600 text-xs mb-3">
          <span className="flex items-center gap-1">
            <MessageCircle className="w-3.5 h-3.5" /> {formatNumber(tweet.replies)}
          </span>
          <span className="flex items-center gap-1">
            <Repeat2 className="w-3.5 h-3.5" /> {formatNumber(tweet.retweets)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5" /> {formatNumber(tweet.likes)}
          </span>
          {tweet.views > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {formatNumber(tweet.views)}
            </span>
          )}
        </div>
      )}

      {/* AI actions */}
      {(onSummarize || onResearch) && (
        <div className="flex gap-2 pt-3 border-t border-gray-800/50">
          {onSummarize && (
            <button
              onClick={() => onSummarize(tweet)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              AI Summary
            </button>
          )}
          {onResearch && (
            <button
              onClick={() => onResearch(tweet)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Deep Research
            </button>
          )}
        </div>
      )}
    </div>
  );
}
