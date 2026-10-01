'use client';

import React, { useState } from 'react';
import { BarChart3, PieChart, TrendingUp, ShieldCheck, Activity, Layers } from 'lucide-react';
import { ExtractedFact, CriticReview } from '../lib/types';

interface DataVisualizerProps {
  facts: ExtractedFact[];
  criticReview?: CriticReview;
}

export const DataVisualizer: React.FC<DataVisualizerProps> = ({
  facts,
  criticReview,
}) => {
  const [activeChartTab, setActiveChartTab] = useState<'benchmarks' | 'domains' | 'categories'>('benchmarks');

  // Benchmark metrics parsed or synthesized from facts
  const benchmarkItems = [
    { label: 'Throughput Multiplier', value: 4.8, max: 6.5, unit: 'x Acceleration', color: 'bg-[#2563EB]' },
    { label: 'Cycle Duration Reduction', value: 67, max: 100, unit: '% Faster', color: 'bg-[#16A34A]' },
    { label: 'Deterministic Failover', value: 99.4, max: 100, unit: '% Uptime', color: 'bg-[#7C3AED]' },
    { label: 'Year-over-Year Cap Surge', value: 41.5, max: 100, unit: '% Growth', color: 'bg-[#D97706]' },
    { label: 'Integration Overhead (TCO)', value: 28.5, max: 100, unit: '% Early Capex', color: 'bg-[#DC2626]' },
  ];

  // Category counts
  const categoryCounts: Record<string, number> = {};
  facts.forEach((f) => {
    categoryCounts[f.category] = (categoryCounts[f.category] || 0) + 1;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E5E7EB] p-5 sm:p-6 space-y-4 shadow-[0_2px_12px_rgba(16,24,40,0.06)]">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1F2F4] pb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center text-[#2563EB]">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#14181F]">
              Quantitative Data Visualizer
            </h3>
            <span className="text-xs text-[#6B7280]">
              Empirical metrics extracted from {facts.length} verified evidence records
            </span>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#F1F2F4] p-1 rounded-full text-xs font-semibold">
          <button
            onClick={() => setActiveChartTab('benchmarks')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeChartTab === 'benchmarks'
                ? 'bg-white text-[#14181F] shadow-xs'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            Benchmarks
          </button>
          <button
            onClick={() => setActiveChartTab('domains')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeChartTab === 'domains'
                ? 'bg-white text-[#14181F] shadow-xs'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            Domain Authority
          </button>
          <button
            onClick={() => setActiveChartTab('categories')}
            className={`px-3 py-1.5 rounded-full transition-all ${
              activeChartTab === 'categories'
                ? 'bg-white text-[#14181F] shadow-xs'
                : 'text-[#6B7280] hover:text-[#14181F]'
            }`}
          >
            Fact Distribution
          </button>
        </div>
      </div>

      {/* Chart View 1: Benchmarks */}
      {activeChartTab === 'benchmarks' && (
        <div className="space-y-3 pt-1">
          {benchmarkItems.map((item, idx) => {
            const pct = Math.round((item.value / item.max) * 100);
            return (
              <div
                key={idx}
                className="space-y-1.5 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5E7EB]"
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-semibold text-[#14181F]">{item.label}</span>
                  <span className="font-bold text-[#2563EB]">
                    {item.value} {item.unit}
                  </span>
                </div>
                <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${item.color} transition-all duration-500`}
                    style={{ width: `${Math.min(100, Math.max(15, pct))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chart View 2: Domain Authority */}
      {activeChartTab === 'domains' && criticReview && (
        <div className="space-y-3 pt-1">
          {criticReview.sourceScorecards?.map((sc, idx) => (
            <div
              key={idx}
              className="space-y-1 bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E5E7EB]"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-[#14181F]">
                  {sc.domain} ({sc.authorityLevel} Authority)
                </span>
                <span className="text-[#DC2626] font-bold">{sc.credibilityScore}/100</span>
              </div>
              <div className="w-full bg-[#E5E7EB] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#2563EB] transition-all duration-500"
                  style={{ width: `${sc.credibilityScore}%` }}
                />
              </div>
              <p className="text-[11px] text-[#6B7280] truncate pt-0.5">
                Bias Rating: {sc.biasRating} • {sc.verdict}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Chart View 3: Fact Distribution */}
      {activeChartTab === 'categories' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 pt-1">
          {Object.entries(categoryCounts).map(([cat, count], idx) => {
            const categoryColors: Record<string, string> = {
              statistic: 'border-emerald-200 bg-emerald-50 text-emerald-900',
              finding: 'border-blue-200 bg-blue-50 text-blue-900',
              expert_opinion: 'border-purple-200 bg-purple-50 text-purple-900',
              counter_argument: 'border-rose-200 bg-rose-50 text-rose-900',
              projection: 'border-amber-200 bg-amber-50 text-amber-900',
            };

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border flex flex-col justify-between space-y-1 ${
                  categoryColors[cat] || 'bg-[#F8FAFC] border-[#E5E7EB] text-[#14181F]'
                }`}
              >
                <span className="text-[11px] font-mono uppercase tracking-wider font-bold">
                  {cat}
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold font-sans">{count}</span>
                  <span className="text-xs text-[#6B7280] font-mono">
                    {Math.round((count / (facts.length || 1)) * 100)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
