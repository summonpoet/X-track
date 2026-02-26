import { useState } from 'react';
import { Sparkles, Loader2, RefreshCw, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Markdown from 'react-markdown';
import { getApiKeys, getAccounts } from '../utils/storage';
import { fetchAllTweets, summarizeTweets } from '../utils/api';

export default function Digest() {
  const [digest, setDigest] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tweetCount, setTweetCount] = useState(0);
  const [customPrompt, setCustomPrompt] = useState('');

  const keys = getApiKeys();
  const accounts = getAccounts();
  const hasClaude = Boolean(keys.claudeApiKey);

  const generateDigest = async () => {
    if (!keys.claudeApiKey) return;

    setLoading(true);
    setError(null);
    try {
      const tweets = await fetchAllTweets(accounts, keys.nitterInstance);
      setTweetCount(tweets.length);

      if (tweets.length === 0) {
        setError('No tweets fetched. The Nitter instance may be down, or check your tracked accounts.');
        setLoading(false);
        return;
      }

      const prompt = customPrompt.trim()
        ? `${customPrompt}\n\nHere are the posts:\n\n${tweets.map((t) => `[@${t.authorUsername}] ${t.text}`).join('\n\n---\n\n')}`
        : undefined;

      const summary = await summarizeTweets(tweets, keys.claudeApiKey, prompt);
      setDigest(summary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate digest');
    } finally {
      setLoading(false);
    }
  };

  if (!hasClaude) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <Sparkles className="w-16 h-16 text-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Claude API Key Required</h2>
        <p className="text-gray-500 max-w-md mb-6">
          AI Digest needs your Claude API Key to generate summaries.
          Posts will be fetched via Nitter (no API key needed).
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

  if (accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <Users className="w-16 h-16 text-gray-700 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">No accounts tracked</h2>
        <p className="text-gray-500 max-w-md mb-6">
          Add X accounts first, then come back to generate a digest.
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
          <h1 className="text-2xl font-bold text-white">AI Digest</h1>
          <p className="text-gray-500 mt-1">
            AI-powered summary of your tracked accounts' latest posts
          </p>
        </div>
      </div>

      {/* Custom prompt */}
      <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 mb-6">
        <label className="text-sm text-gray-400 block mb-2">
          Custom instructions (optional)
        </label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="e.g. Focus on AI industry news, ignore memes. Write in English..."
          rows={3}
          className="w-full bg-black border border-gray-800 rounded-xl px-4 py-3 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors resize-none"
        />
        <button
          onClick={generateDigest}
          disabled={loading}
          className="mt-3 flex items-center gap-2 px-6 py-2.5 bg-blue-500 text-white rounded-full font-bold text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : digest ? (
            <RefreshCw className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          {loading ? 'Generating...' : digest ? 'Regenerate' : 'Generate Digest'}
        </button>
      </div>

      {error && (
        <div className="bg-red-950/30 border border-red-800 rounded-xl p-4 mb-6">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-blue-400 animate-spin mb-3" />
          <p className="text-gray-400">
            Fetching posts and generating AI summary...
          </p>
          <p className="text-gray-600 text-sm mt-1">This may take a moment</p>
        </div>
      )}

      {digest && !loading && (
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-800">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Summary</h2>
            <span className="text-gray-600 text-sm ml-auto">
              Based on {tweetCount} posts
            </span>
          </div>
          <div className="prose prose-invert prose-sm max-w-none
            prose-headings:text-white prose-headings:font-bold
            prose-p:text-gray-300 prose-p:leading-relaxed
            prose-strong:text-white
            prose-li:text-gray-300
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-code:text-blue-300 prose-code:bg-gray-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-blockquote:border-blue-500 prose-blockquote:text-gray-400
          ">
            <Markdown>{digest}</Markdown>
          </div>
        </div>
      )}

      {!digest && !loading && !error && (
        <div className="text-center py-16 text-gray-600">
          <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-800" />
          <p>Click "Generate Digest" to get an AI-powered summary</p>
          <p className="text-sm mt-1">
            of all recent posts from your {accounts.length} tracked accounts.
          </p>
        </div>
      )}
    </div>
  );
}
