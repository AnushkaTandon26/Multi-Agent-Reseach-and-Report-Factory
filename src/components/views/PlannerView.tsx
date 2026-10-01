'use client';

import React, { useState } from 'react';
import { Compass, Sparkles, Target, HelpCircle, Layers, Search, ListOrdered, CheckCircle2, Plus, Trash2, Edit3 } from 'lucide-react';
import { ResearchPlan, AgentInfo } from '../../lib/types';

interface PlannerViewProps {
  plan?: ResearchPlan;
  agent: AgentInfo;
  onUpdatePlan?: (updatedPlan: ResearchPlan) => void;
}

export const PlannerView: React.FC<PlannerViewProps> = ({ plan, agent, onUpdatePlan }) => {
  const [newQuestion, setNewQuestion] = useState('');
  const [newHypothesis, setNewHypothesis] = useState('');

  const handleAddQuestion = () => {
    if (!plan || !newQuestion.trim() || !onUpdatePlan) return;
    const updated = {
      ...plan,
      subQuestions: [...plan.subQuestions, newQuestion.trim()],
    };
    onUpdatePlan(updated);
    setNewQuestion('');
  };

  const handleDeleteQuestion = (index: number) => {
    if (!plan || !onUpdatePlan) return;
    const updated = {
      ...plan,
      subQuestions: plan.subQuestions.filter((_, i) => i !== index),
    };
    onUpdatePlan(updated);
  };

  const handleAddHypothesis = () => {
    if (!plan || !newHypothesis.trim() || !onUpdatePlan) return;
    const updated = {
      ...plan,
      hypotheses: [...plan.hypotheses, newHypothesis.trim()],
    };
    onUpdatePlan(updated);
    setNewHypothesis('');
  };

  const handleDeleteHypothesis = (index: number) => {
    if (!plan || !onUpdatePlan) return;
    const updated = {
      ...plan,
      hypotheses: plan.hypotheses.filter((_, i) => i !== index),
    };
    onUpdatePlan(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/60 to-gray-900/60 p-5 rounded-2xl border border-blue-500/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Stage 01: Strategic Planner</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40">
                {agent.status.toUpperCase()}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                Human Steering Enabled
              </span>
            </div>
            <p className="text-xs text-gray-400">
              Deconstructs research subject taxonomy, core hypotheses, targeted audience parameters, and boolean queries.
            </p>
          </div>
        </div>

        {agent.durationMs && (
          <div className="text-right hidden sm:block">
            <span className="text-[10px] font-mono text-gray-500 block uppercase">Planning Runtime</span>
            <span className="text-sm font-mono font-bold text-blue-400">{(agent.durationMs / 1000).toFixed(1)}s</span>
          </div>
        )}
      </div>

      {!plan ? (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-12 text-center text-gray-400 space-y-3">
          <Compass className="w-12 h-12 mx-auto text-blue-500/40 animate-spin" />
          <h3 className="text-base font-bold text-gray-200">Awaiting Research Strategy Formulation</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Launch a research topic from the top bar to watch the Planner agent decompose requirements and construct targeted inquiry vectors.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Scope, Hypotheses & Audience (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Target Audience */}
            <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Target className="w-4 h-4" />
                Target Audience &amp; Analytical Scope
              </div>
              <p className="text-sm font-medium text-gray-200 leading-relaxed">
                {plan.targetAudience}
              </p>
              <div className="pt-2 flex items-center gap-2">
                <span className="text-[11px] font-mono bg-blue-950 text-blue-300 px-2.5 py-1 rounded-lg border border-blue-800/40">
                  Topic: {plan.topic}
                </span>
                <span className="text-[11px] font-mono bg-gray-800 text-gray-300 px-2.5 py-1 rounded-lg">
                  Depth: {plan.depth.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Core Objectives */}
            <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                <Sparkles className="w-4 h-4" />
                Core Research Objectives
              </div>
              <ul className="space-y-2">
                {plan.coreObjectives?.map((obj, i) => (
                  <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5 bg-gray-950/60 p-2.5 rounded-xl border border-gray-800/60">
                    <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Testable Hypotheses with Human-in-the-loop editing */}
            <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-400">
                  <Layers className="w-4 h-4" />
                  Working Hypotheses ({plan.hypotheses?.length})
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Editable</span>
              </div>
              
              <div className="space-y-2">
                {plan.hypotheses?.map((hyp, i) => (
                  <div key={i} className="text-xs text-indigo-200 bg-indigo-950/30 p-3 rounded-xl border border-indigo-900/40 flex items-start justify-between gap-2">
                    <div>
                      <strong className="text-indigo-400 block mb-0.5">Hypothesis {i + 1}:</strong>
                      <span>{hyp}</span>
                    </div>
                    {onUpdatePlan && (
                      <button
                        onClick={() => handleDeleteHypothesis(i)}
                        className="text-gray-500 hover:text-rose-400 p-1 rounded-lg hover:bg-gray-800 shrink-0"
                        title="Delete Hypothesis"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Custom Hypothesis */}
              {onUpdatePlan && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newHypothesis}
                    onChange={(e) => setNewHypothesis(e.target.value)}
                    placeholder="Inject new testable hypothesis..."
                    className="flex-1 bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-800 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    onClick={handleAddHypothesis}
                    disabled={!newHypothesis.trim()}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold disabled:opacity-40 shrink-0"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Questions, Search Vectors & Outline (6 cols) */}
          <div className="lg:col-span-6 space-y-5">
            {/* Sub-Questions with Human-in-the-loop editing */}
            <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
                  <HelpCircle className="w-4 h-4" />
                  Key Lines of Inquiry ({plan.subQuestions?.length})
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Editable</span>
              </div>

              <div className="space-y-2">
                {plan.subQuestions?.map((q, i) => (
                  <div key={i} className="text-xs text-gray-300 bg-gray-950/70 p-3 rounded-xl border border-gray-800 flex items-start justify-between gap-2.5">
                    <div className="flex items-start gap-2">
                      <span className="font-mono text-blue-400 font-bold">Q{i + 1}.</span>
                      <span>{q}</span>
                    </div>
                    {onUpdatePlan && (
                      <button
                        onClick={() => handleDeleteQuestion(i)}
                        className="text-gray-500 hover:text-rose-400 p-1 rounded-lg hover:bg-gray-800 shrink-0"
                        title="Delete Question"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Add Custom Question */}
              {onUpdatePlan && (
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Add custom research question to investigate..."
                    className="flex-1 bg-gray-950 px-3 py-1.5 rounded-xl border border-gray-800 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddQuestion}
                    disabled={!newQuestion.trim()}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold disabled:opacity-40 shrink-0"
                  >
                    + Add
                  </button>
                </div>
              )}
            </div>

            {/* Search Query Vectors */}
            <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Search className="w-4 h-4" />
                Dispatched Query Vectors for Literature Scout
              </div>
              <div className="grid grid-cols-1 gap-2">
                {plan.searchQueries?.map((sq, i) => (
                  <div key={i} className="text-xs font-mono bg-gray-950 p-2.5 rounded-xl border border-gray-800 text-gray-300 flex items-center gap-2">
                    <span className="text-emerald-400">🔍</span>
                    <span className="truncate">{sq}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Proposed Section Blueprint */}
            <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                <ListOrdered className="w-4 h-4" />
                Proposed Report Section Blueprint
              </div>
              <div className="divide-y divide-gray-800 bg-gray-950/60 rounded-xl border border-gray-800 overflow-hidden">
                {plan.proposedSections?.map((sec, i) => (
                  <div key={i} className="p-3 text-xs flex items-center justify-between gap-3">
                    <span className="font-semibold text-gray-200">{sec.title}</span>
                    <span className="text-gray-500 text-[11px] truncate max-w-xs">{sec.focus}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
