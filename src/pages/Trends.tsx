import { TrendingUp, Hash, ArrowUpRight } from 'lucide-react';

const trendingTopics = [
  { tag: 'AI', posts: '2.4M', category: 'Technology' },
  { tag: 'GPT5', posts: '1.8M', category: 'Technology' },
  { tag: 'SpaceX', posts: '1.2M', category: 'Science' },
  { tag: 'ClaudeAI', posts: '890K', category: 'Technology' },
  { tag: 'Bitcoin', posts: '780K', category: 'Finance' },
  { tag: 'OpenSource', posts: '650K', category: 'Technology' },
  { tag: 'Startups', posts: '540K', category: 'Business' },
  { tag: 'MachineLearning', posts: '480K', category: 'Technology' },
  { tag: 'Web3', posts: '420K', category: 'Technology' },
  { tag: 'Climate', posts: '380K', category: 'Science' },
];

const peakTimes = [
  { hour: '9 AM', engagement: 85 },
  { hour: '10 AM', engagement: 92 },
  { hour: '11 AM', engagement: 78 },
  { hour: '12 PM', engagement: 95 },
  { hour: '1 PM', engagement: 88 },
  { hour: '2 PM', engagement: 72 },
  { hour: '3 PM', engagement: 68 },
  { hour: '4 PM', engagement: 75 },
  { hour: '5 PM', engagement: 82 },
  { hour: '6 PM', engagement: 90 },
  { hour: '7 PM', engagement: 98 },
  { hour: '8 PM', engagement: 100 },
  { hour: '9 PM', engagement: 94 },
  { hour: '10 PM', engagement: 80 },
];

export default function Trends() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Trends</h1>
        <p className="text-gray-500 mt-1">
          Discover what's trending and optimal posting times
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trending Topics */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Trending Topics</h2>
          </div>
          <div className="space-y-1">
            {trendingTopics.map((topic, i) => (
              <div
                key={topic.tag}
                className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-gray-900/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 text-sm w-5">{i + 1}</span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-blue-400" />
                      <span className="font-bold text-white">{topic.tag}</span>
                    </div>
                    <span className="text-gray-600 text-xs">{topic.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">{topic.posts} posts</span>
                  <ArrowUpRight className="w-4 h-4 text-green-400" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Engagement Times */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">
            Peak Engagement Times
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            Best times to post for maximum engagement
          </p>
          <div className="space-y-3">
            {peakTimes.map((slot) => (
              <div key={slot.hour} className="flex items-center gap-4">
                <span className="text-gray-400 text-sm w-14 text-right">
                  {slot.hour}
                </span>
                <div className="flex-1 bg-gray-900 rounded-full h-6 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${slot.engagement}%`,
                      background:
                        slot.engagement >= 90
                          ? 'linear-gradient(90deg, #1d9bf0, #22c55e)'
                          : slot.engagement >= 75
                            ? 'linear-gradient(90deg, #1d9bf0, #3b82f6)'
                            : '#374151',
                    }}
                  />
                </div>
                <span
                  className={`text-sm font-medium w-10 ${
                    slot.engagement >= 90
                      ? 'text-green-400'
                      : slot.engagement >= 75
                        ? 'text-blue-400'
                        : 'text-gray-500'
                  }`}
                >
                  {slot.engagement}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
