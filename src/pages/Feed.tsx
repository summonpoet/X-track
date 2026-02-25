import { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Loader2, AlertTriangle, Settings as SettingsIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import TweetCard from '../components/TweetCard';
import AiPanel from '../components/AiPanel';
import type { Tweet } from '../types';
import { getApiKeys, getAccounts } from '../utils/storage';
import { fetchAllTweets, summarizeTweets, researchTopic } from '../utils/api';

export default function Feed() {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // AI panel state
  const [aiPanel, setAiPanel] = useState<{
    open: boolean;
    title: string;
    content: string | null;
    loading: boolean;
    error: string | null;
  }>({ open: false, title: '', content: null, loading: false, error: null });

  const keys = getApiKeys();
  const accounts = getAccounts();
  const hasKeys = Boolean(keys.xBearerToken);

  const loadTweets = useCallback(async () => {
    if (!keys.xBearerToken || accounts.length === 0) return;

    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllTweets(accounts, keys.xBearerToken, 15);
      setTweets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tweets');
    } finally {
      setLoading(false);
    }
  }, [keys.xBearerToken, accounts.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hasKeys && accounts.length > 0) {
      loadTweets();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSummarize = async (tweet: Tweet) => {
    if (!keys.claudeApiKey) {
      setAiPanel({
        open: true,
        title: 'AI Summary',
        content: null,
        loading: false,
        error: 'Please set your Claude API Key in Settings first.',
      });
      return;
    }
    setAiPanel({ open: true, title: 'AI Summary', content: null, loading: true, error: null });
    try {
      const result = await summarizeTweets([tweet], keys.claudeApiKey,
        `Please analyze and summarize this single post from @${tweet.authorUsername}. Explain what it means, provide context, and highlight why it might be important:\n\n${tweet.text}`
      );
      setAiPanel((prev) => ({ ...prev, content: result, loading: false }));
    } catch (err) {
      setAiPanel((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to generate summary',
      }));
    }
  };

  const handleResearch = async (tweet: Tweet) => {
    if (!keys.claudeApiKey) {
      setAiPanel({
        open: true,
        title: 'Deep Research',
        content: null,
        loading: false,
        error: 'Please set your Claude API Key in Settings first.',
      });
      return;
    }
    setAiPanel({ open: true, title: 'Deep Research', content: null, loading: true, error: null });
    try {
      const result = await researchTopic(tweet.text.slice(0, 200), [tweet], keys.claudeApiKey);
      setAiPanel((prev) => ({ ...prev, content: result, loading: false }));
    } catch (err) {
      setAiPanel((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : 'Research failed',
      }));
    }
  };

  // Empty state: no API keys
  if (!hasKeys) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <SettingsIcon className="w-16 h-16 text-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Set up your API Keys</h2>
        <p className="text-gray-500 max-w-md mb-6">
          To fetch real posts from X, you need to configure your X API Bearer Token
          and Claude API Key in settings.
        </p>
        <Link
          to="/settings"
          className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors"
        >
          Go to Settings
        </Link>
      </div>
    );
  }

  // Empty state: no accounts
  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <AlertTriangle className="w-16 h-16 text-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No accounts tracked</h2>
        <p className="text-gray-500 max-w-md mb-6">
          Add some X accounts to start aggregating their posts.
        </p>
        <Link
          to="/accounts"
          className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors"
        >
          Add Accounts
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Feed</h1>
          <p className="text-gray-500 mt-1">
            Latest posts from {accounts.length} tracked account{accounts.length > 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={loadTweets}
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-full font-bold text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading && tweets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
          <p className="text-gray-400">Fetching posts from X...</p>
        </div>
      )}

      <div className="space-y-4">
        {tweets.map((tweet) => (
          <TweetCard
            key={tweet.id}
            tweet={tweet}
            onSummarize={handleSummarize}
            onResearch={handleResearch}
          />
        ))}
      </div>

      {!loading && tweets.length === 0 && !error && (
        <div className="text-center py-20 text-gray-500">
          <p>No posts loaded yet. Click Refresh to fetch latest posts.</p>
        </div>
      )}

      {aiPanel.open && (
        <AiPanel
          title={aiPanel.title}
          content={aiPanel.content}
          loading={aiPanel.loading}
          error={aiPanel.error}
          onClose={() =>
            setAiPanel({ open: false, title: '', content: null, loading: false, error: null })
          }
        />
      )}
    </div>
  );
}
