import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Loader2 } from 'lucide-react';
import type { ReactNode } from 'react';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import AppLayout from './layouts/AppLayout';

// Public Pages
import LandingPage from './pages/public/LandingPage';
import LoginPage from './pages/public/LoginPage';
import SignUpPage from './pages/public/SignUpPage';
import ForgotPasswordPage from './pages/public/ForgotPasswordPage';
import EmailVerificationPage from './pages/public/EmailVerificationPage';

// App Pages
import DashboardPage from './pages/app/DashboardPage';
import FarmsPage from './pages/app/FarmsPage';
import FarmDetailsPage from './pages/app/FarmDetailsPage';
import CropsPage from './pages/app/CropsPage';
import CropDetailsPage from './pages/app/CropDetailsPage';
import ScanCropPage from './pages/app/ScanCropPage';
import ScanResultPage from './pages/app/ScanResultPage';
import AIAssistantPage from './pages/app/AIAssistantPage';
import WeatherPage from './pages/app/WeatherPage';
import AlertsPage from './pages/app/AlertsPage';
import CropHealthHistoryPage from './pages/app/CropHealthHistoryPage';
import ProfilePage from './pages/app/ProfilePage';
import SettingsPage from './pages/app/SettingsPage';

// Loading Screen for auth checks
function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-3">
      <Loader2 className="w-9 h-9 animate-spin text-emerald-600" />
      <p className="text-sm font-medium text-slate-500">Checking authentication...</p>
    </div>
  );
}

// Protected Route wrapper
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

// Public Route wrapper — redirect to dashboard if already authenticated
function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen />;
  }

  if (isAuthenticated) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  // Landing
  {
    path: '/',
    element: <LandingPage />,
  },

  // Auth routes
  {
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignUpPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
      { path: '/verify-email', element: <EmailVerificationPage /> },
    ],
  },

  // Top-level aliases for direct URL navigation
  { path: '/dashboard', element: <Navigate to="/app/dashboard" replace /> },
  { path: '/farms', element: <Navigate to="/app/farms" replace /> },
  { path: '/crops', element: <Navigate to="/app/crops" replace /> },
  { path: '/scan', element: <Navigate to="/app/scan" replace /> },
  { path: '/assistant', element: <Navigate to="/app/assistant" replace /> },
  { path: '/weather', element: <Navigate to="/app/weather" replace /> },
  { path: '/alerts', element: <Navigate to="/app/alerts" replace /> },
  { path: '/profile', element: <Navigate to="/app/profile" replace /> },
  { path: '/settings', element: <Navigate to="/app/settings" replace /> },
  { path: '/health-history', element: <Navigate to="/app/health-history" replace /> },

  // Protected app routes
  {
    path: '/app',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'farms', element: <FarmsPage /> },
      { path: 'farms/:id', element: <FarmDetailsPage /> },
      { path: 'crops', element: <CropsPage /> },
      { path: 'crops/:id', element: <CropDetailsPage /> },
      { path: 'scan', element: <ScanCropPage /> },
      { path: 'scan/result/:id', element: <ScanResultPage /> },
      { path: 'assistant', element: <AIAssistantPage /> },
      { path: 'weather', element: <WeatherPage /> },
      { path: 'alerts', element: <AlertsPage /> },
      { path: 'health-history', element: <CropHealthHistoryPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'settings', element: <SettingsPage /> },
    ],
  },

  // Catch-all
  { path: '*', element: <Navigate to="/" replace /> },
]);
