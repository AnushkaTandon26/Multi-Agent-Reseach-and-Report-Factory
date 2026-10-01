'use client';

import React from 'react';
import { Sparkles, X, Battery, Cpu, Dna, ShieldAlert } from 'lucide-react';
import { ResearchDepth } from '../lib/types';

interface TopicPresetsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (topic: string, depth: ResearchDepth) => void;
}

const PRESETS = [
  {
    category: 'Clean Energy & Hardware',
    icon: <Battery className="w-4 h-4 text-[#16A34A]" />,
    title: 'Solid-State Batteries: Manufacturing Breakthroughs & EV Commercialization (2025-2030)',
    depth: 'deep' as ResearchDepth,
    desc: 'Examines electrolyte stability, energy density comparisons, pilot production yields, and market parity roadmaps.',
  },
  {
    category: 'Artificial Intelligence',
    icon: <Cpu className="w-4 h-4 text-[#2563EB]" />,
    title: 'Autonomous Multi-Agent Systems in Enterprise Software Architecture: Latency, Safety & Orchestration',
    depth: 'standard' as ResearchDepth,
    desc: 'Analyzes multi-agent consensus protocols, tool calling reliability, context window economics, and failure recovery.',
  },
  {
    category: 'Biotechnology & Genomics',
    icon: <Dna className="w-4 h-4 text-[#7C3AED]" />,
    title: 'In Vivo CRISPR Base & Prime Editing: Clinical Trial Milestones and Delivery Mechanisms',
    depth: 'deep' as ResearchDepth,
    desc: 'Assesses targeted lipid nanoparticles, off-target rate audits, FDA regulatory paths, and oncology efficacy data.',
  },
  {
    category: 'Cybersecurity & Quantum',
    icon: <ShieldAlert className="w-4 h-4 text-[#DC2626]" />,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-white border border-[#E5E7EB] rounded-2xl p-6 shadow-2xl space-y-4 text-[#14181F]">
        <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#EAD5FF] flex items-center justify-center text-[#7C3AED]">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#14181F]">
                Curated Research Topic Presets
              </h3>
              <p className="text-xs text-[#6B7280]">Select a real-world technological domain to launch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#6B7280] hover:text-[#14181F] hover:bg-[#F1F2F4] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#4B5563]">
          Select any curated multi-angle topic to see the 5-agent research floor (Planner, Searcher, Reader, Critic, Writer) operate in synchronized autonomous coordination.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                onSelect(p.title, p.depth);
                onClose();
              }}
              className="text-left p-4 rounded-xl bg-white hover:bg-[#F8FAFC] border border-[#E5E7EB] hover:border-[#14181F] transition-all group flex flex-col justify-between space-y-2.5 shadow-xs"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-[#6B7280] flex items-center gap-1.5 uppercase font-semibold">
                    {p.icon} {p.category}
                  </span>
                  <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200 font-bold uppercase">
                    {p.depth}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-[#14181F] group-hover:text-[#2563EB] leading-snug">
                  {p.title}
                </h4>
              </div>

              <p className="text-[11px] text-[#6B7280] line-clamp-2">
                {p.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
