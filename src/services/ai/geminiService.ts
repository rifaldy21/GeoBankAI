/**
 * Gemini AI Service
 * 
 * Enhanced service for interacting with Google Gemini API with visual output generation capabilities.
 * Detects visual output markers in AI responses and extracts structured data.
 */

import { GoogleGenAI } from "@google/genai";
import { VisualOutput, ChartConfig, TableConfig, MapConfig } from '../../components/IntelligenceAssistant/types';

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
  visualOutput?: VisualOutput;
  timestamp: Date;
}

export interface AIContext {
  user: {
    role: string;
    assignedArea?: string;
  };
  filters: {
    dateRange?: string;
    territory?: string[];
  };
}

export interface AIResponse {
  text: string;
  visualOutput?: VisualOutput;
  timestamp: Date;
}

class GeminiService {
  private client: GoogleGenAI;

  constructor(apiKey: string) {
    this.client = new GoogleGenAI({ apiKey });
  }

  /**
   * Generate a response from the AI model with visual output detection
   */
  async generateResponse(
    messages: ChatMessage[],
    context: AIContext
  ): Promise<AIResponse> {
    const systemInstruction = this.buildSystemInstruction(context);
    const model = "gemini-3-flash-preview";

    try {
      const response = await this.client.models.generateContent({
        model,
        contents: messages.map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction,
        }
      });

      return this.parseResponse(response);
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  /**
   * Build system instruction with visual output generation capabilities
   */
  private buildSystemInstruction(context: AIContext): string {
    return `
You are BRI Intelligence Assistant, a specialized AI for banking territorial intelligence analysis.

User Context:
- Role: ${context.user.role}
- Territory: ${context.user.assignedArea || 'All regions'}

Current Filters:
- Date Range: ${context.filters.dateRange || 'All time'}
- Territory: ${context.filters.territory?.join(', ') || 'All territories'}

Core Capabilities:
1. Answer questions about territorial performance and market intelligence
2. Provide insights on RM and branch performance
3. Analyze market opportunities and gaps
4. Generate visual outputs (charts, tables, maps) for data-driven insights

Visual Output Generation:
When a query requires visual representation, include structured data markers in your response:

[CHART:type]
{"data": [...], "config": {...}}

[TABLE]
{"data": [...], "config": {...}}

[MAP]
{"data": {...}, "config": {...}}

Chart Types:
- bar: For comparisons (e.g., RM performance comparison, branch rankings)
- line: For trends over time (e.g., CASA growth, monthly performance)
- pie: For distributions (e.g., merchant categories, product mix)
- area: For cumulative trends

Example Response with Chart:
"Here's the RM performance comparison for your region:

[CHART:bar]
{
  "data": [
    {"name": "Sari W.", "conversion": 84, "acquisition": 45},
    {"name": "Budi S.", "conversion": 72, "acquisition": 38}
  ],
  "config": {
    "chartType": "bar",
    "xAxis": "name",
    "yAxis": "conversion",
    "title": "RM Conversion Rate Comparison"
  }
}

Sari Wulandari leads with 84% conversion rate, significantly above the area average of 24.5%."

Example Response with Table:
"Here are the top 10 regions by opportunity gap:

[TABLE]
{
  "data": [
    {"Region": "Thamrin", "Potential": 150, "Current": 45, "Gap": 105},
    {"Region": "Menteng", "Potential": 120, "Current": 50, "Gap": 70}
  ],
  "config": {
    "columns": ["Region", "Potential", "Current", "Gap"],
    "sortable": true,
    "title": "Top Opportunity Regions"
  }
}

Thamrin shows the highest opportunity gap with 105 potential merchants."

Example Response with Map:
"Here's the merchant density in your area:

[MAP]
{
  "data": {},
  "config": {
    "center": [-6.2088, 106.8456],
    "zoom": 13,
    "markers": [
      {"id": "1", "position": [-6.2088, 106.8456], "label": "Branch Thamrin", "type": "branch"}
    ],
    "heatmap": {
      "points": [
        {"lat": -6.2088, "lng": 106.8456, "value": 85},
        {"lat": -6.2100, "lng": 106.8470, "value": 65}
      ]
    },
    "title": "Merchant Density Heatmap"
  }
}

The heatmap shows high merchant concentration around Thamrin area."

Guidelines:
- Use Indonesian as the primary language
- Be professional, insightful, and concise
- Provide actionable recommendations
- Include visual outputs when data comparison or trends are discussed
- Always include both the visual marker and explanatory text
- Ensure JSON data is valid and properly formatted
`;
  }

  /**
   * Parse AI response and extract visual outputs
   */
  private parseResponse(response: any): AIResponse {
    const text = response.text || '';
    const visualOutput = this.detectVisualOutput(text);
    
    return {
      text: this.cleanText(text),
      visualOutput,
      timestamp: new Date()
    };
  }

  /**
   * Detect and extract visual output from AI response
   */
  private detectVisualOutput(text: string): VisualOutput | undefined {
    // Match [CHART:type], [TABLE], or [MAP] markers followed by JSON
    const chartMatch = text.match(/\[CHART:(bar|line|pie|area)\]\s*(\{[\s\S]*?\})/);
    const tableMatch = text.match(/\[TABLE\]\s*(\{[\s\S]*?\})/);
    const mapMatch = text.match(/\[MAP\]\s*(\{[\s\S]*?\})/);

    try {
      if (chartMatch) {
        const chartType = chartMatch[1] as 'bar' | 'line' | 'pie' | 'area';
        const jsonData = JSON.parse(chartMatch[2]);
        
        return {
          type: 'chart',
          data: jsonData.data,
          config: {
            chartType,
            ...jsonData.config
          } as ChartConfig
        };
      }

      if (tableMatch) {
        const jsonData = JSON.parse(tableMatch[1]);
        
        return {
          type: 'table',
          data: jsonData.data,
          config: jsonData.config as TableConfig
        };
      }

      if (mapMatch) {
        const jsonData = JSON.parse(mapMatch[1]);
        
        return {
          type: 'map',
          data: jsonData.data,
          config: jsonData.config as MapConfig
        };
      }
    } catch (error) {
      console.error('Error parsing visual output:', error);
    }

    return undefined;
  }

  /**
   * Remove visual output markers from text
   */
  private cleanText(text: string): string {
    return text
      .replace(/\[CHART:(bar|line|pie|area)\]\s*\{[\s\S]*?\}/g, '')
      .replace(/\[TABLE\]\s*\{[\s\S]*?\}/g, '')
      .replace(/\[MAP\]\s*\{[\s\S]*?\}/g, '')
      .trim();
  }
}

export default GeminiService;
