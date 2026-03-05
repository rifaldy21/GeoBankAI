import { FC } from 'react';
import IntelligenceAssistant from '../components/IntelligenceAssistant';

/**
 * Intelligence Assistant Page
 * 
 * AI-powered conversational interface with visual output generation capabilities.
 * Provides natural language query interface for territorial intelligence analysis.
 */
const IntelligenceAssistantPage: FC = () => {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <IntelligenceAssistant />
      </div>
    </div>
  );
};

export default IntelligenceAssistantPage;
