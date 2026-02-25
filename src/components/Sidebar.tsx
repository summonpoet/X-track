import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/accounts', icon: Users, label: 'Accounts' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/posts', icon: FileText, label: 'Posts' },
  { to: '/trends', icon: TrendingUp, label: 'Trends' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-gray-800 flex flex-col z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="black">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        <span className="text-xl font-bold text-white">X Tracker</span>
      </div>

      <nav className="flex-1 px-3 py-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-full text-lg transition-colors mb-1 ${
                isActive
                  ? 'bg-gray-900 text-white font-bold'
                  : 'text-gray-400 hover:bg-gray-900/50 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <p className="text-xs text-gray-600 text-center">X Tracker v1.0</p>
      </div>
    </aside>
  );
}
