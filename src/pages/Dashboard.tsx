import { Users, Eye, MousePointerClick, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/StatCard';
import PostCard from '../components/PostCard';
import { overviewStats, dailyMetrics, recentPosts } from '../data/mockData';
import { formatNumber, formatDate } from '../utils/format';

export default function Dashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-500 mt-1">Overview of your tracked X accounts</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Followers"
          value={formatNumber(overviewStats.totalFollowers)}
          change={overviewStats.followerGrowthPercent}
          changeLabel="vs last month"
          icon={Users}
          iconColor="text-blue-400"
        />
        <StatCard
          title="Total Impressions"
          value={formatNumber(overviewStats.totalImpressions)}
          change={overviewStats.impressionChange}
          changeLabel="vs last month"
          icon={Eye}
          iconColor="text-purple-400"
        />
        <StatCard
          title="Total Engagements"
          value={formatNumber(overviewStats.totalEngagements)}
          change={overviewStats.engagementChange}
          changeLabel="vs last month"
          icon={MousePointerClick}
          iconColor="text-green-400"
        />
        <StatCard
          title="Avg. Engagement Rate"
          value={`${overviewStats.avgEngagementRate}%`}
          change={0.45}
          changeLabel="vs last month"
          icon={TrendingUp}
          iconColor="text-orange-400"
        />
      </div>

      {/* Follower Growth Chart */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 mb-8">
        <h2 className="text-lg font-bold text-white mb-1">Follower Growth</h2>
        <p className="text-gray-500 text-sm mb-6">Last 30 days</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyMetrics}>
              <defs>
                <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1d9bf0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#1d9bf0" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#536471"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v) => formatNumber(v)}
                stroke="#536471"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: '#16181c',
                  border: '1px solid #2f3336',
                  borderRadius: '12px',
                  color: '#e7e9ea',
                }}
                labelFormatter={(label) => formatDate(String(label))}
                formatter={(value) => [formatNumber(Number(value)), 'Followers']}
              />
              <Area
                type="monotone"
                dataKey="followers"
                stroke="#1d9bf0"
                strokeWidth={2}
                fill="url(#followerGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Posts */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Recent Posts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {recentPosts.slice(0, 4).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
}
