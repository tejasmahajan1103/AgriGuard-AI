import { Outlet } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { APP_NAME, APP_TAGLINE } from '../utils/constants';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-50 flex">
      {/* Left decorative panel - desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-400 rounded-full blur-3xl" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-white">
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-8 shadow-2xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-center">{APP_NAME}</h1>
          <p className="text-lg text-emerald-100 text-center max-w-md leading-relaxed">
            {APP_TAGLINE}
          </p>

          {/* Feature highlights */}
          <div className="mt-12 space-y-4 w-full max-w-sm">
            {[
              { emoji: '🌱', text: 'AI-powered crop disease detection' },
              { emoji: '📊', text: 'Real-time farm analytics' },
              { emoji: '🤖', text: 'Intelligent agriculture assistant' },
              { emoji: '🌤️', text: 'Weather-aware recommendations' },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex items-center gap-3 px-4 py-3 bg-white/10 backdrop-blur-sm rounded-xl"
              >
                <span className="text-xl">{feature.emoji}</span>
                <span className="text-sm text-emerald-50">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden flex flex-col items-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
              {APP_NAME}
            </h1>
            <p className="text-sm text-slate-500 mt-1">{APP_TAGLINE}</p>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}
