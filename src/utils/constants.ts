// ============================================================
// AgriGuard AI — Constants
// ============================================================

export const APP_NAME = 'AgriGuard AI';
export const APP_TAGLINE = 'AI-powered intelligence for healthier crops.';

export const NAV_ITEMS = [
  { label: 'Dashboard', path: '/app/dashboard', icon: 'LayoutDashboard' },
  { label: 'My Farms', path: '/app/farms', icon: 'Warehouse' },
  { label: 'My Crops', path: '/app/crops', icon: 'Sprout' },
  { label: 'Scan Crop', path: '/app/scan', icon: 'ScanLine' },
  { label: 'AI Assistant', path: '/app/assistant', icon: 'Bot' },
  { label: 'Weather', path: '/app/weather', icon: 'CloudSun' },
  { label: 'Alerts', path: '/app/alerts', icon: 'Bell' },
  { label: 'Profile', path: '/app/profile', icon: 'UserCircle' },
] as const;

export const MOBILE_NAV_ITEMS = [
  { label: 'Home', path: '/app/dashboard', icon: 'LayoutDashboard' },
  { label: 'Farms', path: '/app/farms', icon: 'Warehouse' },
  { label: 'Scan', path: '/app/scan', icon: 'ScanLine' },
  { label: 'AI', path: '/app/assistant', icon: 'Bot' },
  { label: 'More', path: '/app/more', icon: 'Menu' },
] as const;

export const SUGGESTED_QUESTIONS = [
  'Why are my tomato leaves turning yellow?',
  'How often should I irrigate my crop?',
  'What are common tomato pests?',
  'How can I improve soil health?',
];

export const GROWTH_STAGES = [
  'Seedling',
  'Vegetative',
  'Flowering',
  'Fruiting',
  'Harvest',
] as const;

export const HEALTH_STATUSES = [
  'Excellent',
  'Good',
  'Fair',
  'Poor',
  'Critical',
] as const;

export const SEVERITY_LEVELS = [
  'Low',
  'Medium',
  'High',
  'Critical',
] as const;

export const AREA_UNITS = ['acres', 'hectares', 'sq ft', 'sq m'] as const;

export const HEALTH_STATUS_COLORS: Record<string, string> = {
  Excellent: '#10b981',
  Good: '#22c55e',
  Fair: '#f59e0b',
  Poor: '#f97316',
  Critical: '#ef4444',
};

export const SEVERITY_COLORS: Record<string, string> = {
  Low: '#3b82f6',
  Medium: '#f59e0b',
  High: '#f97316',
  Critical: '#ef4444',
};
