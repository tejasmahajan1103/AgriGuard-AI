import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Warehouse,
  Sprout,
  ScanLine,
  Bot,
  CloudSun,
  Bell,
  UserCircle,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../utils/constants';

const navIcons: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Warehouse: <Warehouse className="w-5 h-5" />,
  Sprout: <Sprout className="w-5 h-5" />,
  ScanLine: <ScanLine className="w-5 h-5" />,
  Bot: <Bot className="w-5 h-5" />,
  CloudSun: <CloudSun className="w-5 h-5" />,
  Bell: <Bell className="w-5 h-5" />,
  UserCircle: <UserCircle className="w-5 h-5" />,
};

const navItems = [
  { label: 'Dashboard', path: '/app/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Farms', path: '/app/farms', icon: 'Warehouse' },
  { label: 'My Crops', path: '/app/crops', icon: 'Sprout' },
  { label: 'Scan Crop', path: '/app/scan', icon: 'ScanLine' },
  { label: 'AI Assistant', path: '/app/assistant', icon: 'Bot' },
  { label: 'Weather', path: '/app/weather', icon: 'CloudSun' },
  { label: 'Alerts', path: '/app/alerts', icon: 'Bell' },
  { label: 'Profile', path: '/app/profile', icon: 'UserCircle' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r border-slate-200/80 transition-all duration-300 ease-in-out ${
        collapsed ? 'w-[72px]' : 'w-64'
      } h-screen sticky top-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-slate-100 flex-shrink-0">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
          <Shield className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <span className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent whitespace-nowrap">
            {APP_NAME}
          </span>
        )}
      </div>

      {/* Nav Items */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
              {navIcons[item.icon]}
            </span>
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="border-t border-slate-100 p-3 space-y-1 flex-shrink-0">
        <NavLink
          to="/app/settings"
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-emerald-50 text-emerald-700'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            } ${collapsed ? 'justify-center' : ''}`
          }
          title={collapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full cursor-pointer ${
            collapsed ? 'justify-center' : ''
          }`}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors cursor-pointer z-10"
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5 text-slate-500" />
        )}
      </button>
    </aside>
  );
}
