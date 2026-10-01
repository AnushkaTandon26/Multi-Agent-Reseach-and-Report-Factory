'use client';

import React, { useState } from 'react';
import { Send, Bot, Sparkles, Wand2, RefreshCw } from 'lucide-react';

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
    <div className="bg-gradient-to-r from-purple-950/40 via-indigo-950/30 to-gray-900 p-4 rounded-2xl border border-purple-800/40 space-y-3 shadow-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wand2 className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Interactive Report Co-Pilot &amp; Section Rewriter
          </h4>
        </div>
        <span className="text-[10px] font-mono text-purple-300 bg-purple-900/40 px-2 py-0.5 rounded border border-purple-800/40">
          Live Agent Steering
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
            className="text-[11px] bg-gray-950/80 hover:bg-purple-900/30 text-gray-300 hover:text-purple-200 px-2.5 py-1 rounded-lg border border-gray-800 shrink-0 transition-colors disabled:opacity-50"
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
          placeholder="Ask the Writer Agent to refine, expand, or adjust tone (e.g. 'Add more details on supply chain risks')..."
          disabled={isRewriting}
          className="flex-1 bg-gray-950 px-3 py-2 rounded-xl border border-gray-800 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-purple-500"
        />
        <button
          type="submit"
          disabled={!prompt.trim() || isRewriting}
          className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-semibold shadow-md disabled:opacity-50 flex items-center gap-1.5 shrink-0 transition-all"
        >
          {isRewriting ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
          <span>{isRewriting ? 'Refining...' : 'Refine'}</span>
        </button>
      </form>
    </div>
  );
};
