import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { dailyMetrics, engagementData } from '../data/mockData';
import { formatNumber, formatDate } from '../utils/format';

export default function Analytics() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 mt-1">Detailed performance metrics</p>
      </div>

      {/* Impressions Chart */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-1">Impressions</h2>
        <p className="text-gray-500 text-sm mb-6">Daily impression count over 30 days</p>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dailyMetrics}>
              <defs>
                <linearGradient id="impressionGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
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
                formatter={(value) => [formatNumber(Number(value)), 'Impressions']}
              />
              <Area
                type="monotone"
                dataKey="impressions"
                stroke="#a855f7"
                strokeWidth={2}
                fill="url(#impressionGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 mb-6">
        <h2 className="text-lg font-bold text-white mb-1">Engagement Breakdown</h2>
        <p className="text-gray-500 text-sm mb-6">
          Likes, reposts, replies, and bookmarks over time
        </p>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={engagementData}>
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
                formatter={(value, name) => [
                  formatNumber(Number(value)),
                  String(name).charAt(0).toUpperCase() + String(name).slice(1),
                ]}
              />
              <Legend
                wrapperStyle={{ color: '#e7e9ea', fontSize: '12px' }}
              />
              <Bar dataKey="likes" fill="#f43f5e" radius={[2, 2, 0, 0]} />
              <Bar dataKey="reposts" fill="#22c55e" radius={[2, 2, 0, 0]} />
              <Bar dataKey="replies" fill="#3b82f6" radius={[2, 2, 0, 0]} />
              <Bar dataKey="bookmarks" fill="#f59e0b" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Daily Posts */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-1">Posting Activity</h2>
        <p className="text-gray-500 text-sm mb-6">Number of posts per day</p>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyMetrics}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a2e" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                stroke="#536471"
                fontSize={12}
                tickLine={false}
              />
              <YAxis
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
                formatter={(value) => [Number(value), 'Posts']}
              />
              <Bar dataKey="posts" fill="#1d9bf0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
