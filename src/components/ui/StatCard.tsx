import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  trend?: number;
  trendLabel?: string;
  color?: 'primary' | 'accent' | 'warning' | 'warm' | 'neutral';
  subtitle?: string;
}

const colors = {
  primary: { gradient: 'from-primary-500 to-primary-600' },
  accent: { gradient: 'from-accent-400 to-accent-500' },
  warning: { gradient: 'from-secondary-400 to-secondary-500' },
  warm: { gradient: 'from-warm-400 to-warm-500' },
  neutral: { gradient: 'from-ink-500 to-ink-600' },
};

export function StatCard({ title, value, icon, trend, trendLabel, color = 'primary', subtitle }: StatCardProps) {
  const c = colors[color];
  return (
    <Card hover className="p-5 group">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.gradient} text-white flex items-center justify-center shadow-soft group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
          {icon}
        </div>
        {trend !== undefined && (
          <div className={`flex items-center gap-1 text-sm font-bold px-2 py-1 rounded-lg ${trend >= 0 ? 'text-primary-700 bg-primary-50' : 'text-secondary-700 bg-secondary-50'}`}>
            {trend >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-4">
        <p className="text-3xl font-bold text-ink-900 tracking-tight font-display">{value}</p>
        <p className="text-sm font-semibold text-ink-500 mt-1">{title}</p>
        {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
        {trendLabel && <p className="text-xs text-ink-400 mt-0.5">{trendLabel}</p>}
      </div>
    </Card>
  );
}
