import { useState } from 'react';
import { Key, Eye, EyeOff, Save, CheckCircle, ExternalLink } from 'lucide-react';
import { getApiKeys, saveApiKeys } from '../utils/storage';

export default function Settings() {
  const [keys, setKeys] = useState(getApiKeys);
  const [showX, setShowX] = useState(false);
  const [showClaude, setShowClaude] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveApiKeys(keys);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your API keys and preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* X API Key */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">X API Bearer Token</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Required to fetch posts from X accounts. Get your token from the{' '}
            <a
              href="https://developer.x.com/en/portal/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              X Developer Portal <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <div className="relative">
            <input
              type={showX ? 'text' : 'password'}
              value={keys.xBearerToken}
              onChange={(e) => setKeys({ ...keys, xBearerToken: e.target.value })}
              placeholder="Enter your X API Bearer Token"
              className="w-full px-4 py-3 pr-12 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
            />
            <button
              onClick={() => setShowX(!showX)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors"
            >
              {showX ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {keys.xBearerToken && (
            <p className="text-green-500 text-xs mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Token configured
            </p>
          )}
        </div>

        {/* Claude API Key */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Key className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Claude API Key</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Required for AI summaries and deep research. Get your key from the{' '}
            <a
              href="https://console.anthropic.com/settings/keys"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              Anthropic Console <ExternalLink className="w-3 h-3" />
            </a>
          </p>
          <div className="relative">
            <input
              type={showClaude ? 'text' : 'password'}
              value={keys.claudeApiKey}
              onChange={(e) => setKeys({ ...keys, claudeApiKey: e.target.value })}
              placeholder="sk-ant-..."
              className="w-full px-4 py-3 pr-12 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
            />
            <button
              onClick={() => setShowClaude(!showClaude)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-white transition-colors"
            >
              {showClaude ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {keys.claudeApiKey && (
            <p className="text-green-500 text-xs mt-2 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Key configured
            </p>
          )}
        </div>

        {/* How it works */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-3">How it works</h2>
          <ol className="space-y-3 text-gray-400 text-sm">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              <span>Configure your X API Bearer Token and Claude API Key above.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Add X accounts you want to track in the Accounts page.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Visit Feed to see real posts, or AI Digest for automated summaries.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span>Click "AI Summary" or "Deep Research" on any post for in-depth analysis.</span>
            </li>
          </ol>
        </div>

        {/* Privacy */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Privacy</h2>
          <p className="text-gray-500 text-sm">
            All API keys are stored in your browser's localStorage. They are only
            sent to the Vercel serverless functions that proxy requests to X and
            Claude APIs. No data is collected or stored on any server.
          </p>
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors"
        >
          {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? 'Saved!' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
