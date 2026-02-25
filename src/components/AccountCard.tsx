import { BadgeCheck, UserPlus, Trash2 } from 'lucide-react';
import type { TrackedAccount } from '../types';
import { formatNumber } from '../utils/format';

interface AccountCardProps {
  account: TrackedAccount;
  onRemove?: (id: string) => void;
}

export default function AccountCard({ account, onRemove }: AccountCardProps) {
  return (
    <div className="bg-gray-950 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <img
            src={account.avatarUrl}
            alt={account.displayName}
            className="w-12 h-12 rounded-full bg-gray-800"
          />
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white">{account.displayName}</span>
              {account.verified && (
                <BadgeCheck className="w-4 h-4 text-blue-400" />
              )}
            </div>
            <span className="text-gray-500 text-sm">@{account.username}</span>
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

      <div className="grid grid-cols-3 gap-4 mt-5 pt-4 border-t border-gray-800">
        <div>
          <div className="text-sm text-gray-500">Followers</div>
          <div className="text-lg font-bold text-white">
            {formatNumber(account.followers)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Following</div>
          <div className="text-lg font-bold text-white">
            {formatNumber(account.following)}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500">Posts</div>
          <div className="text-lg font-bold text-white">
            {formatNumber(account.postsCount)}
          </div>
        </div>
      </div>

      <button className="w-full mt-4 py-2 rounded-full bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
        <UserPlus className="w-4 h-4" />
        View Profile
      </button>
    </div>
  );
}
