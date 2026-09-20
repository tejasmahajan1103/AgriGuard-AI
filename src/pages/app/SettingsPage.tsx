import { useState } from 'react';
import { Moon, Sun, Bell, Globe, Shield } from 'lucide-react';
import Card, { CardTitle } from '../../components/ui/Card';

export default function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    diseaseAlerts: true,
    weatherAlerts: true,
    irrigationReminders: true,
    weeklyReports: false,
  });

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 lg:hidden">Settings</h1>
        <p className="text-slate-500">Manage your application preferences.</p>
      </div>

      {/* Appearance */}
      <Card>
        <CardTitle className="flex items-center gap-2">
          {darkMode ? <Moon className="w-5 h-5 text-slate-600" /> : <Sun className="w-5 h-5 text-amber-500" />}
          Appearance
        </CardTitle>
        <div className="mt-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <p className="text-sm font-semibold text-slate-800">Dark Mode</p>
              <p className="text-xs text-slate-500 mt-0.5">Switch between light and dark theme</p>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                darkMode ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow ${
                  darkMode ? 'translate-x-6' : ''
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-blue-500" />
          Notifications
        </CardTitle>
        <div className="mt-4 space-y-3">
          {[
            { key: 'diseaseAlerts', label: 'Disease Alerts', desc: 'Get notified when disease is detected' },
            { key: 'weatherAlerts', label: 'Weather Alerts', desc: 'Severe weather warnings for your farms' },
            { key: 'irrigationReminders', label: 'Irrigation Reminders', desc: 'Scheduled irrigation notifications' },
            { key: 'weeklyReports', label: 'Weekly Reports', desc: 'Summary of farm health each week' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
              <div>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 cursor-pointer ${
                  notifications[item.key as keyof typeof notifications]
                    ? 'bg-emerald-600'
                    : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow ${
                    notifications[item.key as keyof typeof notifications] ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Language */}
      <Card>
        <CardTitle className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-purple-500" />
          Language & Region
        </CardTitle>
        <div className="mt-4 p-4 bg-slate-50 rounded-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-800">Language</p>
              <p className="text-xs text-slate-500 mt-0.5">English (US)</p>
            </div>
            <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded-full">
              Coming Soon
            </span>
          </div>
        </div>
      </Card>

      {/* About */}
      <Card>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-500" />
          About
        </CardTitle>
        <div className="mt-4 space-y-2 text-sm text-slate-500">
          <p><strong className="text-slate-700">AgriGuard AI</strong> v1.0.0</p>
          <p>AI-powered intelligence for healthier crops.</p>
          <p>Built for AWS Hackathon 2026</p>
          <p className="text-xs text-slate-400">© 2026 AgriGuard AI. All rights reserved.</p>
        </div>
      </Card>
    </div>
  );
}
