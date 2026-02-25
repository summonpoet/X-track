import { useState } from 'react';
import { Bell, Moon, Globe, Shield, Save } from 'lucide-react';

export default function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState('30');

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 mt-1">Configure your X Tracker preferences</p>
      </div>

      <div className="max-w-2xl space-y-6">
        {/* Notifications */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-bold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Push Notifications</p>
                <p className="text-gray-500 text-sm">
                  Get notified about important metric changes
                </p>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  notifications ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                    notifications ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">Appearance</h2>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white">Dark Mode</p>
              <p className="text-gray-500 text-sm">Use dark theme throughout the app</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full transition-colors ${
                darkMode ? 'bg-blue-500' : 'bg-gray-700'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                  darkMode ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Data */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-green-400" />
            <h2 className="text-lg font-bold text-white">Data & Sync</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white">Auto Refresh</p>
                <p className="text-gray-500 text-sm">
                  Automatically refresh data in the background
                </p>
              </div>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`w-12 h-6 rounded-full transition-colors ${
                  autoRefresh ? 'bg-blue-500' : 'bg-gray-700'
                }`}
              >
                <div
                  className={`w-5 h-5 bg-white rounded-full transition-transform mx-0.5 ${
                    autoRefresh ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div>
              <label className="text-white text-sm block mb-2">
                Refresh Interval (minutes)
              </label>
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="bg-black border border-gray-800 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
                <option value="360">6 hours</option>
              </select>
            </div>
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-orange-400" />
            <h2 className="text-lg font-bold text-white">Privacy</h2>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Your data is stored locally and never shared with third parties.
            X Tracker only reads public data from X accounts.
          </p>
          <button className="px-5 py-2.5 border border-red-800 text-red-400 rounded-full text-sm font-medium hover:bg-red-950/50 transition-colors">
            Clear All Data
          </button>
        </div>

        {/* Save */}
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full font-bold hover:bg-blue-600 transition-colors">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
