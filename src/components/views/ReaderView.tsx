'use client';

import React, { useState } from 'react';
import { BookOpen, Quote, Sparkles, Filter, CheckCircle2, Trash2, Plus, Edit2 } from 'lucide-react';
import { ExtractedFact, AgentInfo } from '../../lib/types';

interface ReaderViewProps {
  facts: ExtractedFact[];
  agent: AgentInfo;
  onDeleteFact?: (id: string) => void;
  onAddFact?: (fact: Partial<ExtractedFact>) => void;
}

export const ReaderView: React.FC<ReaderViewProps> = ({
  facts,
  agent,
  onDeleteFact,
  onAddFact,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isAddingFact, setIsAddingFact] = useState(false);
  const [newFactText, setNewFactText] = useState('');
  const [newFactCategory, setNewFactCategory] = useState<ExtractedFact['category']>('finding');

  const categories = Array.from(new Set(facts.map((f) => f.category)));

  const filteredFacts = facts.filter((f) => {
    return selectedCategory === 'all' || f.category === selectedCategory;
  });

  const categoryBadgeColors: Record<string, string> = {
    statistic: 'bg-emerald-950/80 text-emerald-300 border-emerald-800/40',
    finding: 'bg-blue-950/80 text-blue-300 border-blue-800/40',
    expert_opinion: 'bg-purple-950/80 text-purple-300 border-purple-800/40',
    counter_argument: 'bg-rose-950/80 text-rose-300 border-rose-800/40',
    projection: 'bg-amber-950/80 text-amber-300 border-amber-800/40',
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactText.trim() || !onAddFact) return;

    onAddFact({
      id: `fact-user-${Date.now()}`,
      sourceId: 'src-manual-entry',
      sourceTitle: 'User Injected Primary Fact',
      sourceUrl: '#',
      fact: newFactText.trim(),
      category: newFactCategory,
      confidence: 0.99,
      timeframe: '2024-2025',
    });

    setNewFactText('');
    setIsAddingFact(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 to-gray-900/60 p-5 rounded-2xl border border-amber-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-600/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Stage 03: Deep Reader</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {agent.status.toUpperCase()}
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Mines retrieved documents for granular quantitative metrics, empirical results, expert citations, and context quotes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAddingFact(!isAddingFact)}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white rounded-xl text-xs font-semibold border border-amber-500/40 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Verified Fact</span>
          </button>
          <div className="text-right hidden md:block">
            <span className="text-[10px] font-mono text-gray-500 block uppercase">Fact Bank Size</span>
            <span className="text-sm font-mono font-bold text-amber-400">{facts.length} Verified Records</span>
          </div>
        </div>
      </div>

      {/* Add Custom Fact Form */}
      {isAddingFact && (
        <form onSubmit={handleAddSubmit} className="bg-gray-900 p-4 rounded-2xl border border-amber-500/40 space-y-3 animate-fadeIn">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Add Verified Data Point or Metric
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              value={newFactText}
              onChange={(e) => setNewFactText(e.target.value)}
              placeholder="e.g. 'Production pilot achieves 450 Wh/kg specific energy density in initial test runs.'"
              className="sm:col-span-3 bg-gray-950 px-3 py-2 rounded-xl border border-gray-800 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-amber-500"
            />
            <select
              value={newFactCategory}
              onChange={(e) => setNewFactCategory(e.target.value as any)}
              className="bg-gray-950 px-3 py-2 rounded-xl border border-gray-800 text-xs text-gray-200 focus:outline-none focus:border-amber-500"
            >
              <option value="statistic">Statistic</option>
              <option value="finding">Finding</option>
              <option value="expert_opinion">Expert Opinion</option>
              <option value="counter_argument">Counter-Argument</option>
              <option value="projection">Projection</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddingFact(false)}
              className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!newFactText.trim()}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-semibold disabled:opacity-40"
            >
              Save Fact
            </button>
          </div>
        </form>
      )}

      {facts.length === 0 ? (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-12 text-center text-gray-400 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-amber-500/40 animate-pulse" />
          <h3 className="text-base font-bold text-gray-200">Fact Bank Empty</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            The Deep Reader agent will ingest literature payloads and extract verified data points as the pipeline progresses.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-600 text-white shadow-md'
                  : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
              }`}
            >
              All Categories ({facts.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase transition-all ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'bg-gray-900 text-gray-400 hover:text-white border border-gray-800'
                }`}
              >
                {cat} ({facts.filter((f) => f.category === cat).length})
              </button>
            ))}
          </div>

          {/* Fact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredFacts.map((fact, i) => (
              <div
                key={fact.id || i}
                className="bg-gray-900/80 p-5 rounded-2xl border border-gray-800 hover:border-amber-500/50 transition-all flex flex-col justify-between space-y-3 shadow-lg group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-md border ${
                        categoryBadgeColors[fact.category] || 'bg-gray-800 text-gray-300'
                      }`}
                    >
                      {fact.category}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-amber-400 font-semibold">
                        Confidence: {Math.round(fact.confidence * 100)}%
                      </span>
                      {onDeleteFact && (
                        <button
                          onClick={() => onDeleteFact(fact.id)}
                          className="text-gray-500 hover:text-rose-400 p-0.5"
                          title="Delete Fact"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-gray-100 leading-relaxed">
                    {fact.fact}
                  </p>

                  {fact.quote && (
                    <div className="flex items-start gap-2 text-xs text-amber-200/80 italic bg-amber-950/20 p-3 rounded-xl border-l-2 border-amber-500/80">
                      <Quote className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{fact.quote}</span>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[11px] font-mono text-gray-500">
                  <span className="truncate max-w-[240px]">Source: {fact.sourceTitle}</span>
                  <span>{fact.timeframe || '2024-2025'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
