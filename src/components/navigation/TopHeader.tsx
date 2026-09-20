import { Bell, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

interface TopHeaderProps {
  title?: string;
}

export default function TopHeader({ title }: TopHeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/60 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Left - Page title */}
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-lg font-bold text-slate-800 hidden sm:block">{title}</h1>
        )}
      </div>

      {/* Right - Actions */}
      <div className="flex items-center gap-3">
        {/* Search (desktop) */}
        <button
          className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-slate-500 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
          onClick={() => {}}
        >
          <Search className="w-4 h-4" />
          <span>Search...</span>
          <kbd className="text-xs bg-white px-1.5 py-0.5 rounded border border-slate-200 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Notifications */}
        <button
          onClick={() => navigate('/app/alerts')}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
        </button>

        {/* Profile */}
        <button
          onClick={() => navigate('/app/profile')}
          className="flex items-center gap-2 cursor-pointer"
        >
          <Avatar name={user?.name || 'User'} size="sm" />
          <span className="text-sm font-medium text-slate-700 hidden md:block">
            {user?.name || 'User'}
          </span>
        </button>
      </div>
    </header>
  );
}
