import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Warehouse,
  ScanLine,
  Bot,
  Menu,
  X,
  Sprout,
  CloudSun,
  Bell,
  UserCircle,
  Settings,
  LogOut,
  Shield,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { APP_NAME } from '../../utils/constants';

const bottomNavItems = [
  { label: 'Home', path: '/app/dashboard', icon: LayoutDashboard },
  { label: 'Farms', path: '/app/farms', icon: Warehouse },
  { label: 'Scan', path: '/app/scan', icon: ScanLine },
  { label: 'AI', path: '/app/assistant', icon: Bot },
];

const drawerNavItems = [
  { label: 'Dashboard', path: '/app/dashboard', icon: LayoutDashboard },
  { label: 'My Farms', path: '/app/farms', icon: Warehouse },
  { label: 'My Crops', path: '/app/crops', icon: Sprout },
  { label: 'Scan Crop', path: '/app/scan', icon: ScanLine },
  { label: 'AI Assistant', path: '/app/assistant', icon: Bot },
  { label: 'Weather', path: '/app/weather', icon: CloudSun },
  { label: 'Alerts', path: '/app/alerts', icon: Bell },
  { label: 'Profile', path: '/app/profile', icon: UserCircle },
  { label: 'Settings', path: '/app/settings', icon: Settings },
];

export default function MobileNav() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <header className="lg:hidden h-14 bg-white/90 backdrop-blur-md border-b border-slate-200/60 px-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="text-base font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
            {APP_NAME}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/app/alerts')}
            className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200/60 z-30 safe-area-bottom">
        <div className="flex items-center justify-around h-16 px-2">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all duration-200 ${
                  isActive ? 'text-emerald-600' : 'text-slate-400'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          ))}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col items-center gap-1 px-3 py-1 text-slate-400 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
            <span className="text-[10px] font-medium">More</span>
          </button>
        </div>
      </nav>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl animate-slide-in-right flex flex-col">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-4 h-14 border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">
                {user?.name || 'Menu'}
              </span>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Drawer Nav */}
            <nav className="flex-1 py-3 px-3 space-y-1 overflow-y-auto">
              {drawerNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setDrawerOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'text-slate-600 hover:bg-slate-50'
                    }`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Drawer Footer */}
            <div className="border-t border-slate-100 p-3">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors w-full cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
