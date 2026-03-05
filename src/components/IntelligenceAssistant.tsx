import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2, Maximize2, Minimize2, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { cn } from '../lib/utils';
import { VisualOutputRenderer } from './IntelligenceAssistant/VisualOutputRenderer';
import GeminiService from '../services/ai/geminiService';

const IntelligenceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      content: "Halo! Saya Intelligence Assistant. Saya bisa membantu Anda menganalisis performa wilayah, produktivitas RM, dan mengidentifikasi peluang pasar baru. Apa yang ingin Anda ketahui hari ini?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionChips = [
    "Tampilkan area dengan penetrasi rendah",
    "Siapa RM dengan performa terbaik?",
    "Analisis opportunity gap di Thamrin",
    "Bandingkan CASA Jakarta Pusat vs Selatan",
    "Rekomendasi area prioritas akuisisi"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const geminiService = new GeminiService(process.env.GEMINI_API_KEY!);
      
      const context = {
        user: {
          role: 'Area Manager',
          assignedArea: 'Jakarta Pusat'
        },
        filters: {
          dateRange: 'Last 30 days',
          territory: ['Jakarta Pusat']
        }
      };

      const response = await geminiService.generateResponse(
        messages.concat(userMessage),
        context
      );

      const aiResponse: ChatMessage = {
        role: 'model',
        content: response.text || "Maaf, saya mengalami kendala teknis. Mohon coba lagi.",
        visualOutput: response.visualOutput,
        timestamp: response.timestamp
      };

      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => [...prev, {
        role: 'model',
        content: "Maaf, terjadi kesalahan saat menghubungi AI. Pastikan API Key sudah terkonfigurasi.",
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col bg-white border border-slate-200 shadow-2xl transition-all duration-300 ease-in-out z-50 overflow-hidden",
      isExpanded 
        ? "fixed inset-4 rounded-3xl" 
        : "h-[600px] rounded-2xl"
    )}>
      {/* Header */}
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold leading-tight">Intelligence Assistant</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-[10px] text-indigo-100 font-medium uppercase tracking-wider">Online • Ready to Analyze</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
        {messages.map((msg, idx) => (
          <div 
            key={idx} 
            className={cn(
              "flex gap-3 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
              msg.role === 'user' ? "bg-indigo-600 text-white" : "bg-white text-indigo-600 border border-slate-100"
            )}>
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>
            <div className="flex-1 space-y-3">
              <div className={cn(
                "p-4 rounded-2xl text-sm shadow-sm",
                msg.role === 'user' 
                  ? "bg-indigo-600 text-white rounded-tr-none" 
                  : "bg-white text-slate-800 border border-slate-100 rounded-tl-none"
              )}>
                <div className="prose prose-sm max-w-none prose-slate">
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
                <p className={cn(
                  "text-[10px] mt-2 font-medium opacity-50",
                  msg.role === 'user' ? "text-right" : ""
                )}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {/* Render visual output inline */}
              {msg.visualOutput && msg.role === 'model' && (
                <div className="mt-3">
                  <VisualOutputRenderer output={msg.visualOutput} />
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-lg bg-white text-indigo-600 flex items-center justify-center shrink-0 shadow-sm border border-slate-100">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-sm text-slate-500 font-medium">Analyzing data...</span>
            </div>
          </div>
        )}
        
        {/* Suggestion Chips - Show only when no messages from user yet */}
        {messages.length === 1 && !isLoading && (
          <div className="space-y-3">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Suggested Questions</p>
            <div className="flex flex-wrap gap-2">
              {suggestionChips.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(suggestion);
                    // Auto-submit after a brief delay
                    setTimeout(() => {
                      const submitEvent = new KeyboardEvent('keydown', { key: 'Enter' });
                      document.dispatchEvent(submitEvent);
                    }, 100);
                  }}
                  className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all shadow-sm"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Tanyakan tentang TAM, performa RM, atau rekomendasi area..."
            className="flex-1 bg-slate-50 border-none focus:ring-2 focus:ring-indigo-500 rounded-xl px-4 py-3 text-sm placeholder:text-slate-400"
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 mt-3 font-medium uppercase tracking-widest">
          Powered by Gemini AI • Real-time Banking Intelligence
        </p>
      </div>
    </div>
  );
};

export default IntelligenceAssistant;
