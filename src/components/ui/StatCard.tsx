import { type ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'emerald' | 'blue' | 'amber' | 'red' | 'purple';
}

const colorStyles: Record<string, { bg: string; icon: string; gradient: string }> = {
  emerald: {
    bg: 'bg-emerald-50',
    icon: 'text-emerald-600',
    gradient: 'from-emerald-500 to-green-500',
  },
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    gradient: 'from-blue-500 to-cyan-500',
  },
  amber: {
    bg: 'bg-amber-50',
    icon: 'text-amber-600',
    gradient: 'from-amber-500 to-orange-500',
  },
  red: {
    bg: 'bg-red-50',
    icon: 'text-red-600',
    gradient: 'from-red-500 to-rose-500',
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    gradient: 'from-purple-500 to-violet-500',
  },
};

const trendColors: Record<string, string> = {
  up: 'text-emerald-600',
  down: 'text-red-500',
  neutral: 'text-slate-500',
};

export default function StatCard({
  title,
  value,
  icon,
  trend,
  trendValue,
  color = 'emerald',
}: StatCardProps) {
  const styles = colorStyles[color];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-11 h-11 rounded-xl ${styles.bg} flex items-center justify-center ${styles.icon} group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        {trend && trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColors[trend]}`}>
            {trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
            {trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
            {trend === 'neutral' && <Minus className="w-3.5 h-3.5" />}
            {trendValue}
          </div>
        )}
      </div>
      <div className="text-2xl font-bold text-slate-800 mb-1">{value}</div>
      <div className="text-sm text-slate-500">{title}</div>
    </div>
  );
}
