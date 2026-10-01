'use client';

import React from 'react';
import { X, Key, Cpu, Sliders, Shield, Info } from 'lucide-react';
import { ResearchDepth } from '../lib/types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  setApiKey: (key: string) => void;
  modelName: string;
  setModelName: (model: string) => void;
  customInstructions: string;
  setCustomInstructions: (inst: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  setApiKey,
  modelName,
  setModelName,
  customInstructions,
  setCustomInstructions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-5 text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">
              Research Factory Configuration
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-indigo-400" />
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... (Leave empty to use built-in intelligent simulation)"
              className="w-full bg-gray-950 px-3 py-2 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 font-mono text-xs text-gray-100 placeholder-gray-600"
            />
            <p className="text-[11px] text-gray-500 flex items-center gap-1">
              <Info className="w-3 h-3 text-gray-500" />
              Without a key, the factory executes full simulated multi-agent reasoning + live search queries.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              Model Architecture
            </label>
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-gray-950 px-3 py-2 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 text-xs text-gray-200"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast &amp; Balanced)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning &amp; Complex Analysis)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen High Performance)</option>
            </select>
          </div>

          {/* Custom Directives */}
          <div className="space-y-1.5">
            <label className="font-semibold text-gray-300 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-purple-400" />
              Custom Directives &amp; Focus Constraints
            </label>
            <textarea
              rows={3}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Focus heavily on 2025 financial unit economics, prioritize semiconductor manufacturing supply chain bottlenecks, etc."
              className="w-full bg-gray-950 p-3 rounded-xl border border-gray-800 focus:outline-none focus:border-indigo-500 text-xs text-gray-200 placeholder-gray-600 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-800">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
