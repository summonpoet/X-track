import { Trash2 } from 'lucide-react';
import type { TrackedAccount } from '../types';

interface AccountCardProps {
  account: TrackedAccount;
  onRemove?: (id: string) => void;
}

export default function AccountCard({ account, onRemove }: AccountCardProps) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition-colors flex items-center justify-between">
      <div className="flex items-center gap-3">
        <img
          src={account.profileImageUrl}
          alt={account.displayName}
          className="w-11 h-11 rounded-full bg-gray-800"
        />
        <div>
          <div className="font-bold text-white text-sm">{account.displayName}</div>
          <div className="text-gray-500 text-xs">@{account.username}</div>
        </div>
      </div>
      {onRemove && (
        <button
          onClick={() => onRemove(account.id)}
          className="p-2 rounded-full hover:bg-red-950/50 text-gray-600 hover:text-red-400 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
