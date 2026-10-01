'use client';

import React, { useState } from 'react';
import { Send, Wand2, RefreshCw, Sparkles } from 'lucide-react';

interface ReportCopilotProps {
  onRewriteRequest: (instruction: string) => void;
  isRewriting: boolean;
}

export const ReportCopilot: React.FC<ReportCopilotProps> = ({
  onRewriteRequest,
  isRewriting,
}) => {
  const [prompt, setPrompt] = useState('');

  const quickPrompts = [
    'Expand the Executive Summary with 3 high-impact bullets',
    'Add an in-depth regulatory & compliance risk section',
    'Make technical architecture section more mathematically rigorous',
    'Include a 5-year investment and ROI amortization estimate',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isRewriting) return;
    onRewriteRequest(prompt.trim());
    setPrompt('');
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-[#E5E7EB] shadow-[0_2px_12px_rgba(16,24,40,0.06)] space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-[#7C3AED]" />
          <h4 className="text-xs font-bold text-[#14181F] uppercase tracking-wider">
            Interactive Report Co-Pilot &amp; Section Rewriter
          </h4>
        </div>
        <span className="text-[10px] font-mono text-[#581C87] bg-[#EAD5FF] px-2.5 py-0.5 rounded-full font-bold border border-[#D8B4FE]">
          Human-in-the-Loop Steering
        </span>
      </div>

      {/* Quick Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onRewriteRequest(qp)}
            disabled={isRewriting}
            className="text-[11px] bg-[#F8FAFC] hover:bg-[#EAD5FF]/40 text-[#4B5563] hover:text-[#581C87] px-3 py-1.5 rounded-full border border-[#E5E7EB] shrink-0 transition-colors disabled:opacity-50 font-medium"
          >
            ✨ {qp}
          </button>
        ))}
      </div>

      {/* Custom Prompt Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask the Synthesizer Agent to refine, expand, or adjust tone (e.g. 'Add more details on supply chain risks')..."
          disabled={isRewriting}
          className="flex-1 bg-white px-4 py-2.5 rounded-full border border-[#D1D5DB] text-xs text-[#14181F] placeholder-[#9CA3AF] focus:border-[#14181F] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isRewriting}
          className="h-[42px] px-5 bg-[#151A17] hover:bg-[#262E29] text-white rounded-full text-xs font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5 shrink-0 transition-all"
        >
          {isRewriting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>{isRewriting ? 'Refining...' : 'Refine'}</span>
        </button>
      </form>
    </div>
  );
};
