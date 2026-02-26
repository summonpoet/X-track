import { useState } from 'react';
import { Key, Globe, Eye, EyeOff, Save, CheckCircle, ExternalLink, RotateCcw } from 'lucide-react';
import { getApiKeys, saveApiKeys } from '../utils/storage';

const DEFAULT_NITTER = 'https://nitter.privacydev.net';

const NITTER_INSTANCES = [
  'https://nitter.privacydev.net',
  'https://nitter.poast.org',
  'https://nitter.woodland.cafe',
  'https://n.opnxng.com',
];

export default function Settings() {
  const [keys, setKeys] = useState(getApiKeys);
  const [showClaude, setShowClaude] = useState(false);
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleSave = () => {
    saveApiKeys(keys);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const testNitter = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch(
        `/api/x-proxy?username=elonmusk`,
        { headers: { 'X-Nitter-Instance': keys.nitterInstance } }
      );
      if (res.ok) {
        const data = await res.json();
        setTestResult({
          ok: true,
          message: `Connected! Fetched ${data.tweets?.length || 0} posts.`,
        });
      } else {
        const err = await res.json().catch(() => ({}));
        setTestResult({
          ok: false,
          message: err.error || `Instance returned ${res.status}`,
        });
      }
    } catch (err) {
      setTestResult({
        ok: false,
        message: err instanceof Error ? err.message : 'Connection failed',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Configure data sources and API keys</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Nitter Instance */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Nitter Instance</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Nitter is an open-source alternative frontend for X that provides RSS feeds.
            No API key needed — just pick a working instance.
          </p>

          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={keys.nitterInstance}
              onChange={(e) => setKeys({ ...keys, nitterInstance: e.target.value })}
              placeholder="https://nitter.example.com"
              className="flex-1 px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors font-mono text-sm"
            />
            <button
              onClick={() => setKeys({ ...keys, nitterInstance: DEFAULT_NITTER })}
              className="p-3 border border-gray-800 rounded-xl text-gray-400 hover:text-white hover:border-gray-600 transition-colors"
              title="Reset to default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick instance picker */}
          <div className="flex flex-wrap gap-2 mb-4">
            {NITTER_INSTANCES.map((inst) => (
              <button
                key={inst}
                onClick={() => setKeys({ ...keys, nitterInstance: inst })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  keys.nitterInstance === inst
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600'
                }`}
              >
                {inst.replace('https://', '')}
              </button>
            ))}
          </div>

          <button
            onClick={testNitter}
            disabled={testing}
            className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {testing ? 'Testing...' : 'Test Connection'}
          </button>

          {testResult && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${
              testResult.ok ? 'text-green-400' : 'text-red-400'
            }`}>
              <CheckCircle className="w-3 h-3" />
              {testResult.message}
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
              <span>Choose a working Nitter instance above (default is pre-filled).</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              <span>Add your Claude API Key for AI-powered summaries.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              <span>Add X accounts in the Accounts page.</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center text-xs font-bold">4</span>
              <span>Visit Feed to read posts, or AI Digest for automated summaries.</span>
            </li>
          </ol>
        </div>

        {/* Privacy */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white mb-2">Privacy</h2>
          <p className="text-gray-500 text-sm">
            Your Claude API key is stored in your browser's localStorage. Posts are
            fetched via Nitter (an open-source project) through our Vercel serverless
            proxy. No data is collected or stored on any server.
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
