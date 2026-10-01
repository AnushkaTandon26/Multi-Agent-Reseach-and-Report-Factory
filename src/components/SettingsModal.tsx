'use client';

import React from 'react';
import { X, Key, Cpu, Sliders, Shield, Info } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl space-y-5 text-[#14181F]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F1F2F4] flex items-center justify-center text-[#14181F]">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14181F]">
                System Configuration
              </h3>
              <p className="text-xs text-[#6B7280]">AI models, API keys, and custom directives</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Controls */}
        <div className="space-y-4 text-xs">
          {/* API Key */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#14181F] flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#2563EB]" />
              Google Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy... (Leave empty to use built-in intelligent simulation)"
              className="w-full bg-white px-3.5 py-2.5 rounded-full border border-[#D1D5DB] focus:border-[#14181F] focus:outline-none font-mono text-xs text-[#14181F] placeholder-[#9CA3AF]"
            />
            <p className="text-[11px] text-[#6B7280] flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
              Without a key, the factory executes full simulated multi-agent reasoning + live search queries.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#14181F] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-[#6366F1]" />
              Model Architecture
            </label>
            <select
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              className="w-full bg-white px-3.5 py-2.5 rounded-full border border-[#D1D5DB] focus:border-[#14181F] focus:outline-none text-xs text-[#14181F] cursor-pointer"
            >
              <option value="gemini-1.5-flash">Gemini 1.5 Flash (Ultra Fast &amp; Balanced)</option>
              <option value="gemini-1.5-pro">Gemini 1.5 Pro (Deep Reasoning &amp; Complex Analysis)</option>
              <option value="gemini-2.0-flash">Gemini 2.0 Flash (Next-Gen High Performance)</option>
            </select>
          </div>

          {/* Custom Directives */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#14181F] flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#7C3AED]" />
              Custom Directives &amp; Focus Constraints
            </label>
            <textarea
              rows={3}
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              placeholder="e.g. Focus heavily on 2025 financial unit economics, prioritize semiconductor manufacturing supply chain bottlenecks, etc."
              className="w-full bg-white p-3 rounded-xl border border-[#D1D5DB] focus:border-[#14181F] focus:outline-none text-xs text-[#14181F] placeholder-[#9CA3AF] resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E5E7EB]">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-[#151A17] hover:bg-[#262E29] text-white rounded-full text-xs font-bold transition-all shadow-xs"
          >
            Save &amp; Close
          </button>
        </div>
      </div>
    </div>
  );
};
