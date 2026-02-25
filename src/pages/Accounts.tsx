import { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import AccountCard from '../components/AccountCard';
import { getAccounts, saveAccounts } from '../utils/storage';
import type { TrackedAccount } from '../types';

export default function Accounts() {
  const [accounts, setAccounts] = useState<TrackedAccount[]>(getAccounts);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const filtered = accounts.filter(
    (a) =>
      a.username.toLowerCase().includes(search.toLowerCase()) ||
      a.displayName.toLowerCase().includes(search.toLowerCase())
  );

  const persist = (next: TrackedAccount[]) => {
    setAccounts(next);
    saveAccounts(next);
  };

  const handleRemove = (id: string) => {
    persist(accounts.filter((a) => a.id !== id));
  };

  const handleAdd = () => {
    if (!newUsername.trim()) return;
    const username = newUsername.replace(/^@/, '').trim();
    if (accounts.some((a) => a.username.toLowerCase() === username.toLowerCase())) {
      setNewUsername('');
      setShowAddModal(false);
      return;
    }
    const newAccount: TrackedAccount = {
      id: Date.now().toString(),
      username,
      displayName: username,
      profileImageUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${username}&backgroundColor=1d9bf0`,
      addedAt: new Date().toISOString().split('T')[0],
    };
    persist([...accounts, newAccount]);
    setNewUsername('');
    setShowAddModal(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Tracked Accounts</h1>
          <p className="text-gray-500 mt-1">
            {accounts.length} account{accounts.length !== 1 ? 's' : ''} being tracked
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-full font-bold text-sm hover:bg-blue-600 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add Account
        </button>
      </div>

      {accounts.length > 3 && (
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-950 border border-gray-800 rounded-full text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((account) => (
          <AccountCard
            key={account.id}
            account={account}
            onRemove={handleRemove}
          />
        ))}
      </div>

      {accounts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-2">No accounts tracked yet</p>
          <p className="text-gray-600 text-sm">
            Add X accounts to start aggregating their posts.
          </p>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-white mb-2">
              Track New Account
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Enter the X username to track their posts.
            </p>
            <input
              type="text"
              placeholder="@username"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 transition-colors mb-4"
              autoFocus
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setShowAddModal(false); setNewUsername(''); }}
                className="flex-1 py-2.5 border border-gray-700 text-white rounded-full font-medium text-sm hover:bg-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                className="flex-1 py-2.5 bg-blue-500 text-white rounded-full font-bold text-sm hover:bg-blue-600 transition-colors"
              >
                Track Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
