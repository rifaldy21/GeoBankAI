import React from 'react';
import { MapPin, Info, TrendingUp, Target, Wallet } from 'lucide-react';
import { RMPerformance } from '../types';
import { cn } from '../lib/utils';

interface RMPerformanceCardProps {
  rm: RMPerformance;
}

const RMPerformanceCard: React.FC<RMPerformanceCardProps> = ({ rm }) => {
  const isTop = rm.status === 'Top Performer';
  const isNeedsImprovement = rm.status === 'Needs Improvement';

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden">
            <img 
              src={`https://picsum.photos/seed/${rm.id}/100/100`} 
              alt={rm.name} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 leading-tight">{rm.name}</h4>
            <p className="text-xs text-slate-500">Relationship Manager</p>
          </div>
        </div>
        <div className={cn(
          "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
          isTop ? "bg-amber-50 text-amber-600 border border-amber-100" :
          isNeedsImprovement ? "bg-red-50 text-red-600 border border-red-100" :
          "bg-indigo-50 text-indigo-600 border border-indigo-100"
        )}>
          {rm.status}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-2 rounded-xl bg-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Target</p>
          <p className="text-sm font-bold text-slate-900">{rm.targetLeads}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Acquired</p>
          <p className="text-sm font-bold text-slate-900">{rm.acquired}</p>
        </div>
        <div className="text-center p-2 rounded-xl bg-slate-50">
          <p className="text-[10px] text-slate-400 font-bold uppercase mb-1">Conv.</p>
          <p className="text-sm font-bold text-slate-900">{rm.conversion}%</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-[11px] font-bold mb-1.5">
            <span className="text-slate-500 uppercase tracking-wider">Progress to Target</span>
            <span className="text-slate-900">{rm.conversion}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isTop ? "bg-emerald-500" : isNeedsImprovement ? "bg-red-500" : "bg-indigo-500"
              )}
              style={{ width: `${rm.conversion}%` }}
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <div className="flex items-center gap-1.5">
            <Wallet className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs text-slate-500">Portfolio: <span className="font-bold text-slate-900">Rp {rm.portfolio}B</span></span>
          </div>
          <button className="text-indigo-600 hover:text-indigo-700 text-xs font-bold flex items-center gap-1">
            Details
            <TrendingUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RMPerformanceCard;
