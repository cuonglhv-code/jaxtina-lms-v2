import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  iconBg: string;
  value: string | number;
  label: string;
  trend?: 'up' | 'down';
  trendValue?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ icon: Icon, iconBg, value, label, trend, trendValue }) => {
  return (
    <div className="bg-white rounded-[16px] border border-[var(--border)] p-6 shadow-[var(--card-shadow)]">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white" style={{ backgroundColor: iconBg }}>
          <Icon size={16} />
        </div>
        {trend && (
          <span className={`text-xs px-2 py-1 rounded-full ml-auto font-medium ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
      </div>
      <div className="font-display text-[40px] leading-none text-[var(--ink)] mb-1">
        {value}
      </div>
      <div className="font-sans text-[13px] text-[var(--mist)] uppercase tracking-wide">
        {label}
      </div>
    </div>
  );
};
