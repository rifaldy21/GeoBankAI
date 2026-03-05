/**
 * Query Analysis Service
 * 
 * Analyzes user queries to determine intent, extract entities, and map to appropriate visualization types.
 * Used by the Intelligence Assistant to automatically generate visual outputs.
 */

export interface QueryAnalysis {
  intent: 'comparison' | 'trend' | 'distribution' | 'geographical' | 'tabular';
  entities: string[];
  timeframe?: DateRange;
  metrics: string[];
}

export interface DateRange {
  start?: Date;
  end?: Date;
  period?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}

export type VisualizationType = 'chart' | 'table' | 'map';
export type ChartType = 'bar' | 'line' | 'pie' | 'area';

/**
 * Determines the appropriate visualization type based on query analysis
 * 
 * @param analysis - The analyzed query intent and entities
 * @returns The visualization type to use
 */
export const determineVisualization = (analysis: QueryAnalysis): {
  type: VisualizationType;
  chartType?: ChartType;
} => {
  // Geographical queries should use maps
  if (analysis.intent === 'geographical') {
    return { type: 'map' };
  }
  
  // Trend queries should use line charts
  if (analysis.intent === 'trend') {
    return { type: 'chart', chartType: 'line' };
  }
  
  // Comparison queries should use bar charts
  if (analysis.intent === 'comparison') {
    return { type: 'chart', chartType: 'bar' };
  }
  
  // Distribution queries should use pie charts
  if (analysis.intent === 'distribution') {
    return { type: 'chart', chartType: 'pie' };
  }
  
  // Tabular queries should use tables
  return { type: 'table' };
};

/**
 * Analyzes a user query to determine intent and extract entities
 * 
 * @param query - The user's natural language query
 * @returns Analysis of the query including intent, entities, and metrics
 */
export const analyzeQuery = (query: string): QueryAnalysis => {
  const lowerQuery = query.toLowerCase();
  
  // Detect intent based on keywords
  let intent: QueryAnalysis['intent'] = 'tabular';
  
  // Geographical intent
  const geoKeywords = ['peta', 'map', 'lokasi', 'location', 'wilayah', 'region', 'area', 'density', 'kepadatan', 'sebaran', 'distribution'];
  if (geoKeywords.some(keyword => lowerQuery.includes(keyword))) {
    intent = 'geographical';
  }
  
  // Trend intent
  const trendKeywords = ['trend', 'growth', 'pertumbuhan', 'over time', 'seiring waktu', 'bulan', 'month', 'tahun', 'year', 'historis', 'historical'];
  if (trendKeywords.some(keyword => lowerQuery.includes(keyword))) {
    intent = 'trend';
  }
  
  // Comparison intent
  const comparisonKeywords = ['bandingkan', 'compare', 'versus', 'vs', 'dibanding', 'perbandingan', 'comparison', 'top', 'ranking', 'leaderboard'];
  if (comparisonKeywords.some(keyword => lowerQuery.includes(keyword))) {
    intent = 'comparison';
  }
  
  // Distribution intent
  const distributionKeywords = ['distribusi', 'distribution', 'breakdown', 'komposisi', 'composition', 'proporsi', 'proportion', 'kategori', 'category'];
  if (distributionKeywords.some(keyword => lowerQuery.includes(keyword))) {
    intent = 'distribution';
  }
  
  // Extract entities (simplified - in production, use NER)
  const entities: string[] = [];
  
  // Common entities
  const entityPatterns = [
    { pattern: /\b(rm|relationship manager)\b/i, entity: 'RM' },
    { pattern: /\b(cabang|branch)\b/i, entity: 'Branch' },
    { pattern: /\b(merchant|pedagang)\b/i, entity: 'Merchant' },
    { pattern: /\b(nasabah|customer)\b/i, entity: 'Customer' },
    { pattern: /\b(casa)\b/i, entity: 'CASA' },
    { pattern: /\b(qris)\b/i, entity: 'QRIS' },
    { pattern: /\b(credit|kredit)\b/i, entity: 'Credit' },
    { pattern: /\b(tam|total addressable market)\b/i, entity: 'TAM' },
    { pattern: /\b(penetrasi|penetration)\b/i, entity: 'Penetration' },
    { pattern: /\b(opportunity|peluang)\b/i, entity: 'Opportunity' },
  ];
  
  entityPatterns.forEach(({ pattern, entity }) => {
    if (pattern.test(query)) {
      entities.push(entity);
    }
  });
  
  // Extract metrics
  const metrics: string[] = [];
  const metricPatterns = [
    { pattern: /\b(performa|performance)\b/i, metric: 'performance' },
    { pattern: /\b(konversi|conversion)\b/i, metric: 'conversion' },
    { pattern: /\b(akuisisi|acquisition)\b/i, metric: 'acquisition' },
    { pattern: /\b(aktivasi|activation)\b/i, metric: 'activation' },
    { pattern: /\b(volume|transaksi|transaction)\b/i, metric: 'volume' },
    { pattern: /\b(target|realisasi|realization)\b/i, metric: 'target' },
    { pattern: /\b(gap|kesenjangan)\b/i, metric: 'gap' },
  ];
  
  metricPatterns.forEach(({ pattern, metric }) => {
    if (pattern.test(query)) {
      metrics.push(metric);
    }
  });
  
  // Extract timeframe (simplified)
  let timeframe: DateRange | undefined;
  
  const timePatterns = [
    { pattern: /\b(hari ini|today)\b/i, period: 'day' as const },
    { pattern: /\b(minggu ini|this week)\b/i, period: 'week' as const },
    { pattern: /\b(bulan ini|this month)\b/i, period: 'month' as const },
    { pattern: /\b(kuartal|quarter)\b/i, period: 'quarter' as const },
    { pattern: /\b(tahun ini|this year)\b/i, period: 'year' as const },
  ];
  
  for (const { pattern, period } of timePatterns) {
    if (pattern.test(query)) {
      timeframe = { period };
      break;
    }
  }
  
  return {
    intent,
    entities,
    timeframe,
    metrics,
  };
};
