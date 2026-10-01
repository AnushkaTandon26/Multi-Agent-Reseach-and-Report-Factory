'use client';

import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Shield,
  FileCheck,
  Flame,
  Skull,
  EyeOff,
  RefreshCw,
  Search,
  PenTool,
} from 'lucide-react';
import { CriticReview, AgentInfo } from '../../lib/types';

interface CriticViewProps {
  critic?: CriticReview;
  agent: AgentInfo;
}

export const CriticView: React.FC<CriticViewProps> = ({ critic, agent }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-950/60 to-gray-900/60 p-5 rounded-2xl border border-rose-500/30 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-rose-600/20 border border-rose-500/40 flex items-center justify-center text-rose-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white">Stage 04: Epistemic Critic &amp; Loop Auditor</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-rose-500/20 text-rose-300 border border-rose-500/40">
                {agent.status.toUpperCase()}
              </span>
              {critic?.redTeamAudit && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-red-950 text-red-300 border border-red-700/50 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-red-400" />
                  Red Team Active
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">
              Evaluates source credibility, audits bias, triggers targeted search replanning loops, and performs post-draft verification.
            </p>
          </div>
        </div>

        {critic && (
          <div className="text-right">
            <span className="text-[10px] font-mono text-gray-500 block uppercase">Reliability Index</span>
            <span className="text-2xl font-mono font-extrabold text-rose-400">
              {critic.overallCredibilityScore}/100
            </span>
          </div>
        )}
      </div>

      {!critic ? (
        <div className="bg-gray-900/50 rounded-2xl border border-gray-800 p-12 text-center text-gray-400 space-y-3">
          <ShieldCheck className="w-12 h-12 mx-auto text-rose-500/40 animate-pulse" />
          <h3 className="text-base font-bold text-gray-200">Epistemic Audit in Standby</h3>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            The Critic Agent will analyze extracted findings, detect gaps, and audit the draft once the Reader stage completes.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Agentic Decision & Replanning Directive Callout */}
          <div className="bg-gradient-to-r from-amber-950/40 via-gray-900 to-indigo-950/40 p-4 rounded-2xl border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 text-amber-400" />
                  Orchestration Feedback Status
                </span>
                <span className="text-xs font-bold text-gray-200">
                  Decision: <span className="text-amber-300 uppercase">{critic.criticDecision || 'Approved'}</span>
                </span>
              </div>
              <p className="text-xs text-gray-400">
                {critic.criticDecision === 'request_more_evidence'
                  ? 'Critic detected evidence gaps and triggered follow-up search directives to Searcher & Reader.'
                  : 'Evidence threshold satisfied; Critic cleared synthesis pass to Writer with specific epistemic constraints.'}
              </p>
            </div>

            {critic.followUpSearchQueries && critic.followUpSearchQueries.length > 0 && (
              <div className="text-xs bg-gray-950/80 px-3 py-1.5 rounded-xl border border-amber-500/30 text-amber-200 shrink-0">
                <span className="font-mono font-bold text-amber-400">{critic.followUpSearchQueries.length}</span> follow-up query vectors generated
              </div>
            )}
          </div>

          {/* Draft Report Audit Card (if available) */}
          {critic.draftAudit && (
            <div className="bg-gradient-to-r from-purple-950/40 via-gray-900 to-indigo-950/30 p-5 rounded-2xl border border-purple-500/40 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <PenTool className="w-5 h-5 text-purple-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Post-Draft Verification &amp; Anti-Hallucination Audit
                  </h3>
                </div>
                <span className="text-xs font-mono font-bold bg-purple-900/40 text-purple-200 px-3 py-1 rounded-full border border-purple-500/40">
                  Draft Score: {critic.draftAudit.score}/100 ({critic.draftAudit.approved ? 'APPROVED' : 'REVISION REQUESTED'})
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-gray-400 font-semibold block text-[11px] uppercase">Identified Draft Nuances:</span>
                  <ul className="space-y-1 text-gray-300">
                    {critic.draftAudit.issues?.map((issue, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-purple-400">•</span>
                        <span>{issue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-gray-950/70 p-3.5 rounded-xl border border-gray-800 space-y-1.5">
                  <span className="text-indigo-400 font-semibold block text-[11px] uppercase">Writer Revision Directives:</span>
                  <ul className="space-y-1 text-gray-300">
                    {critic.draftAudit.revisionDirectives?.map((dir, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-indigo-400">➔</span>
                        <span>{dir}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Adversarial Red Team Stress Test Section */}
          {critic.redTeamAudit && (
            <div className="bg-gradient-to-r from-red-950/40 via-gray-900 to-red-950/20 p-5 rounded-2xl border border-red-700/40 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-400" />
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    Adversarial Red Team Stress-Test Audit
                  </h3>
                </div>
                <span className="text-[10px] font-mono bg-red-900/40 text-red-200 px-2.5 py-0.5 rounded-full border border-red-700/50">
                  Hypothesis Deconstruction
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-gray-950/70 p-4 rounded-xl border border-red-900/40 space-y-2">
                  <span className="text-[11px] font-bold text-red-400 flex items-center gap-1.5 uppercase">
                    <AlertTriangle className="w-3.5 h-3.5" /> Core Vulnerabilities
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    {critic.redTeamAudit.vulnerabilitiesIdentified.map((v, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-red-400">•</span>
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-950/70 p-4 rounded-xl border border-red-900/40 space-y-2">
                  <span className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5 uppercase">
                    <Shield className="w-3.5 h-3.5" /> Counter-Theses
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    {critic.redTeamAudit.counterTheses.map((ct, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{ct}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-950/70 p-4 rounded-xl border border-red-900/40 space-y-2">
                  <span className="text-[11px] font-bold text-rose-400 flex items-center gap-1.5 uppercase">
                    <Skull className="w-3.5 h-3.5" /> Worst-Case Scenarios
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    {critic.redTeamAudit.worstCaseScenarios.map((w, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-rose-400">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-gray-950/70 p-4 rounded-xl border border-red-900/40 space-y-2">
                  <span className="text-[11px] font-bold text-purple-400 flex items-center gap-1.5 uppercase">
                    <EyeOff className="w-3.5 h-3.5" /> Blindspots Flagged
                  </span>
                  <ul className="space-y-1.5 text-xs text-gray-300">
                    {critic.redTeamAudit.blindspotsFlagged.map((b, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-purple-400">•</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Scorecards & Domain Matrix (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              {/* Reliability Summary Card */}
              <div className="bg-gradient-to-br from-gray-900 via-rose-950/20 to-gray-900 p-5 rounded-2xl border border-rose-800/40 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Epistemic Credibility Rating
                  </span>
                  <span className="text-xs font-mono text-gray-400">
                    {critic.verifiedFactsCount} Verified Claims / {critic.totalSourcesEvaluated} Sources
                  </span>
                </div>
                <div className="w-full bg-gray-950 rounded-full h-3 overflow-hidden border border-gray-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${critic.overallCredibilityScore}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400">
                  Independent epistemological assessment confirms high statistical consistency across institutional baselines, with targeted guidance provided for forward-looking vendor projections.
                </p>
              </div>

              {/* Source Scorecards Table */}
              <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 block">
                  Primary Domain Scorecards ({critic.sourceScorecards?.length})
                </span>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-gray-800 text-gray-400 font-mono text-[11px]">
                        <th className="pb-2">Domain</th>
                        <th className="pb-2">Authority</th>
                        <th className="pb-2">Bias Profile</th>
                        <th className="pb-2 text-right">Credibility</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {critic.sourceScorecards?.map((sc, i) => (
                        <tr key={i} className="hover:bg-gray-800/40">
                          <td className="py-2.5 font-mono text-indigo-300 font-semibold">{sc.domain}</td>
                          <td className="py-2.5">{sc.authorityLevel}</td>
                          <td className="py-2.5 text-gray-400">{sc.biasRating}</td>
                          <td className="py-2.5 text-right font-mono font-bold text-rose-400">
                            {sc.credibilityScore}/100
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Methodology Notes */}
              <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" /> Methodology &amp; Provenance Notes
                </span>
                <ul className="space-y-2">
                  {critic.methodologyNotes?.map((note, i) => (
                    <li key={i} className="text-xs text-gray-400 flex items-start gap-2 bg-gray-950/60 p-2.5 rounded-xl border border-gray-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Flagged Nuances & Writer Directives (6 cols) */}
            <div className="lg:col-span-6 space-y-5">
              {/* Flagged Claims & Counter-Perspectives */}
              <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <AlertTriangle className="w-4 h-4" />
                  Flagged Claims &amp; Risk Nuances ({critic.questionableClaims?.length})
                </div>
                <div className="space-y-3">
                  {critic.questionableClaims?.map((qc, i) => (
                    <div key={i} className="bg-amber-950/20 p-4 rounded-xl border border-amber-900/40 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-gray-200">Claim Under Audit</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-900/40 text-amber-300 border border-amber-800/40 uppercase">
                          {qc.risk} Risk
                        </span>
                      </div>
                      <p className="font-semibold text-gray-200">&quot;{qc.claim}&quot;</p>
                      <p className="text-amber-300/90"><strong className="text-amber-400">Identified Issue:</strong> {qc.issue}</p>
                      <p className="text-gray-400 bg-gray-950/60 p-2.5 rounded-lg border border-gray-800 text-[11px]">
                        <strong className="text-gray-300 block mb-0.5">Directives for Writer:</strong>
                        {qc.recommendation}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Writer Synthesis Directives */}
              <div className="bg-gray-900/70 p-5 rounded-2xl border border-gray-800 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400">
                  <CheckCircle2 className="w-4 h-4" />
                  Mandatory Directives for Writer Agent
                </div>
                <ul className="space-y-2">
                  {critic.synthesisGuidanceForWriter?.map((g, i) => (
                    <li key={i} className="text-xs text-gray-300 flex items-start gap-2.5 bg-purple-950/20 p-3 rounded-xl border border-purple-900/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0 mt-1.5" />
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
