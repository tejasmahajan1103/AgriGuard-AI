import { Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Sidebar from '../components/navigation/Sidebar';
import TopHeader from '../components/navigation/TopHeader';
import MobileNav from '../components/navigation/MobileNav';

const pageTitles: Record<string, string> = {
  '/app/dashboard': 'Dashboard',
  '/app/farms': 'My Farms',
  '/app/crops': 'My Crops',
  '/app/scan': 'Scan Crop',
  '/app/assistant': 'AI Assistant',
  '/app/weather': 'Weather',
  '/app/alerts': 'Alerts',
  '/app/profile': 'Profile',
  '/app/settings': 'Settings',
  '/app/health-history': 'Crop Health History',
};

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();

  const pageTitle = pageTitles[location.pathname] || '';

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Desktop Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Nav */}
        <MobileNav />

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <TopHeader title={pageTitle} />
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
