'use client';

import React from 'react';
import { Sparkles, X, Zap, Cpu, Dna, Battery, ShieldAlert } from 'lucide-react';
import { ResearchDepth } from '../lib/types';

interface TopicPresetsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (topic: string, depth: ResearchDepth) => void;
}

const PRESETS = [
  {
    category: 'Clean Energy & Hardware',
    icon: <Battery className="w-4 h-4 text-emerald-400" />,
    title: 'Solid-State Batteries: Manufacturing Breakthroughs & EV Commercialization (2025-2030)',
    depth: 'deep' as ResearchDepth,
    desc: 'Examines electrolyte stability, energy density comparisons, pilot production yields, and market parity roadmaps.',
  },
  {
    category: 'Artificial Intelligence',
    icon: <Cpu className="w-4 h-4 text-blue-400" />,
    title: 'Autonomous Multi-Agent Systems in Enterprise Software Architecture: Latency, Safety & Orchestration',
    depth: 'standard' as ResearchDepth,
    desc: 'Analyzes multi-agent consensus protocols, tool calling reliability, context window economics, and failure recovery.',
  },
  {
    category: 'Biotechnology & Genomics',
    icon: <Dna className="w-4 h-4 text-purple-400" />,
    title: 'In Vivo CRISPR Base & Prime Editing: Clinical Trial Milestones and Delivery Mechanisms',
    depth: 'deep' as ResearchDepth,
    desc: 'Assesses targeted lipid nanoparticles, off-target rate audits, FDA regulatory paths, and oncology efficacy data.',
  },
  {
    category: 'Cybersecurity & Quantum',
    icon: <ShieldAlert className="w-4 h-4 text-rose-400" />,
    title: 'Post-Quantum Cryptography Migration: NIST Standards, Implementation Vulnerabilities & Timeline',
    depth: 'standard' as ResearchDepth,
    desc: 'Evaluates Kyber and Dilithium algorithms, legacy infrastructure retrofit costs, and state-actor decryption risks.',
  },
];

export const TopicPresets: React.FC<TopicPresetsProps> = ({
  isOpen,
  onClose,
  onSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-2xl space-y-4 text-gray-200">
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              Featured Deep-Research Presets
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-gray-400">
          Select a curated multi-angle topic to see the 5-agent research floor (Planner, Searcher, Reader, Critic, Writer) operate in full sync.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelect(p.title, p.depth);
                onClose();
              }}
              className="text-left p-4 rounded-xl bg-gray-950/70 hover:bg-gray-800/80 border border-gray-800 hover:border-indigo-500/50 transition-all group flex flex-col justify-between space-y-2"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-400 flex items-center gap-1.5 uppercase tracking-wider">
                    {p.icon} {p.category}
                  </span>
                  <span className="text-[10px] font-mono bg-indigo-950/80 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-800/40 uppercase">
                    {p.depth}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-gray-100 group-hover:text-indigo-300 leading-snug">
                  {p.title}
                </h4>
              </div>

              <p className="text-[11px] text-gray-500 line-clamp-2">
                {p.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
