export interface Stat {
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: string;
  color: string;
}

export interface RMPerformance {
  id: string;
  name: string;
  targetLeads: number;
  acquired: number;
  conversion: number;
  status: 'Top Performer' | 'On Track' | 'Needs Improvement';
  portfolio: number; // in billions
}

export interface DistrictData {
  name: string;
  potential: number;
  acquired: number;
  conversion: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}
