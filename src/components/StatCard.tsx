import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, LucideIcon, Store, Users, TrendingUp, Wallet } from 'lucide-react';
import { cn } from '../lib/utils';
import { Stat } from '../types';

const iconMap: Record<string, LucideIcon> = {
  Store,
  Users,
  TrendingUp,
  Wallet
};

const StatCard: React.FC<{ stat: Stat }> = ({ stat }) => {
  const Icon = iconMap[stat.icon];
  
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-xl text-white", stat.color)}>
          <Icon className="w-6 h-6" />
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
          stat.trend === 'up' ? "bg-emerald-50 text-emerald-600" : 
          stat.trend === 'down' ? "bg-red-50 text-red-600" : 
          "bg-slate-50 text-slate-600"
        )}>
          {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3" />}
          {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3" />}
          {stat.trend === 'neutral' && <Minus className="w-3 h-3" />}
          {stat.change.split(' ')[0]}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-xs font-semibold uppercase tracking-widest mb-1">{stat.label}</p>
        <h3 className="text-2xl font-bold text-slate-900">{stat.value}</h3>
        <p className="text-[11px] text-slate-400 mt-1">{stat.change.split(' ').slice(1).join(' ')}</p>
      </div>
    </div>
  );
};

export default StatCard;
