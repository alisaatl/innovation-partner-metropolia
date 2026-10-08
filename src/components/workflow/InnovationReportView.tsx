import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  Share2, 
  Check, 
  Award, 
  Target, 
  Users, 
  GitBranch, 
  Zap, 
  Calculator,
  Building,
  Calendar,
  Sparkles
} from 'lucide-react';
import { 
  ProjectIdea, 
  Stakeholder, 
  SystemFactor, 
  CausalRelationship, 
  FeedbackLoop, 
  LeveragePoint, 
  SolutionAlternative, 
  AHPCriterion, 
  AHPAnalysisResult 
} from '../../types/innovation';
import { getQuadrant } from './StakeholderAnalysisView';

interface InnovationReportViewProps {
  projectIdea: ProjectIdea;
  stakeholders: Stakeholder[];
  factors: SystemFactor[];
  relationships: CausalRelationship[];
  feedbackLoops: FeedbackLoop[];
  leveragePoints: LeveragePoint[];
  alternatives: SolutionAlternative[];
  criteria: AHPCriterion[];
  ahpResult: AHPAnalysisResult;
  onExportJson: () => void;
}

export const InnovationReportView: React.FC<InnovationReportViewProps> = ({
  projectIdea,
  stakeholders,
  factors,
  relationships,
  feedbackLoops,
  leveragePoints,
  alternatives,
  criteria,
  ahpResult,
  onExportJson
}) => {
  const [copied, setCopied] = useState(false);

  const winningAlt = alternatives.find(a => a.id === ahpResult.ranking[0]?.alternativeId);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    const md = `# Innovation Project Evaluation: ${projectIdea.title}
Institution: ${projectIdea.institution}
Authors: ${projectIdea.authorTeam}
Date: ${projectIdea.lastUpdated}

## 1. Executive Summary & Problem Framing
${projectIdea.problemStatement}

### Proposed Innovation
${projectIdea.proposedInnovation}

### Strategic Goals
${projectIdea.strategicGoals.map((g, i) => `${i + 1}. ${g}`).join('\n')}

## 2. Key Stakeholders & Engagement
${stakeholders.map(s => `- **${s.name}** (${s.role}): Influence ${s.influence}/5, Interest ${s.interest}/5. Strategy: ${s.customStrategy || getQuadrant(s.influence, s.interest).strategy}`).join('\n')}

## 3. Systems Thinking & Feedback Loops
- Factors mapped: ${factors.length}
- Causal links: ${relationships.length}
${feedbackLoops.map(l => `### Loop ${l.code}: ${l.name} (${l.type.toUpperCase()})\n${l.explanation}\nSystem Impact: ${l.systemImpact}`).join('\n\n')}

## 4. Systemic Leverage Points (Meadows Framework)
${leveragePoints.map(lp => `- **${lp.interventionTitle}** (${lp.levelName}): ${lp.whyItHasLeverage}`).join('\n')}

## 5. AHP Decision Analysis Results
Recommended Winner: **${winningAlt?.title || 'N/A'}** (${ahpResult.ranking[0]?.scorePct}% overall priority)
Mathematical Consistency: ${ahpResult.isConsistent ? 'Consistent (CR <= 0.10)' : 'Review Required'}
`;

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Export Actions */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">7. Final Innovation Project Report & Dossier</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              COMPREHENSIVE SYNTHESIS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Consolidates the strategic framing, stakeholder matrix, causal loop dynamics, leverage points, and multi-criteria AHP decision into an academic-grade evaluation report.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown' : 'Copy Markdown'}</span>
          </button>

          <button
            onClick={onExportJson}
            className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 text-sky-400" />
            <span>Export JSON Project</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Main Printable Dossier Card */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-8 flex flex-col gap-8 shadow-2xl print:border-none print:p-0 print:bg-white print:text-black">
        {/* Report Header Lockup */}
        <div className="border-b border-slate-800 pb-6 flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#ff5a00]">
            <span>{projectIdea.institution}</span>
            <span>DATE: {projectIdea.lastUpdated}</span>
          </div>

          <h1 className="text-2xl font-bold text-white tracking-tight leading-snug">
            {projectIdea.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 mt-1">
            <span>Author Team: <strong className="text-slate-200">{projectIdea.authorTeam}</strong></span>
            <span>·</span>
            <span>Methodology: <strong className="text-slate-200">Systems Dynamics & Saaty AHP</strong></span>
            <span>·</span>
            {projectIdea.isDemoData && (
              <span className="text-amber-400">[Contains Simulated/Demo Data]</span>
            )}
          </div>
        </div>

        {/* Section 1: Executive Summary & Problem */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00]"></span>
            <span>1. Executive Summary & Problem Definition</span>
          </h2>
          <div className="bg-[#090f1a] p-4 rounded-lg border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
            {projectIdea.problemStatement}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="bg-[#090f1a] p-4 rounded-lg border border-slate-800/80 flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-white">Proposed Innovation:</h3>
              <p className="text-xs text-slate-300 leading-relaxed">{projectIdea.proposedInnovation}</p>
            </div>

            <div className="bg-[#090f1a] p-4 rounded-lg border border-slate-800/80 flex flex-col gap-2">
              <h3 className="text-xs font-semibold text-white">Strategic Goals:</h3>
              <ul className="text-xs text-slate-300 flex flex-col gap-1.5">
                {projectIdea.strategicGoals.map((g, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-[#ff5a00] font-bold">✓</span>
                    <span>{g}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Stakeholder Governance */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00]"></span>
            <span>2. Stakeholder Governance Framework ({stakeholders.length} Evaluated)</span>
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse border border-slate-800 rounded-lg">
              <thead>
                <tr className="bg-[#090f1a] text-slate-400 font-semibold border-b border-slate-800">
                  <th className="py-2.5 px-3">Stakeholder</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3 text-center">Influence</th>
                  <th className="py-2.5 px-3 text-center">Interest</th>
                  <th className="py-2.5 px-3">Quadrant</th>
                  <th className="py-2.5 px-3">Strategic Action Plan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {stakeholders.map(s => {
                  const q = getQuadrant(s.influence, s.interest);
                  return (
                    <tr key={s.id} className="hover:bg-slate-800/20">
                      <td className="py-2.5 px-3 font-semibold text-white">{s.name}</td>
                      <td className="py-2.5 px-3 text-slate-400">{s.role}</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-[#ff5a00]">{s.influence}/5</td>
                      <td className="py-2.5 px-3 text-center font-mono font-bold text-sky-400">{s.interest}/5</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${q.badgeClass}`}>
                          {q.label}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-300 max-w-[280px]">
                        {s.customStrategy || q.strategy}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 3: Systems Dynamics & Feedback Loops */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00]"></span>
            <span>3. Systems Thinking & Causal Dynamics ({feedbackLoops.length} Loops Identified)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbackLoops.map(loop => {
              const isReinforcing = loop.type === 'reinforcing';
              return (
                <div key={loop.id} className="bg-[#090f1a] p-4 rounded-lg border border-slate-800 flex flex-col justify-between gap-3">
                  <div>
                    <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                      isReinforcing ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {loop.code} {isReinforcing ? 'REINFORCING' : 'BALANCING'}
                    </span>
                    <h4 className="text-xs font-bold text-white mt-1.5">{loop.name}</h4>
                    <p className="text-[11px] text-slate-300 leading-relaxed mt-2">{loop.explanation}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 border-t border-slate-800 pt-2 font-mono">
                    Impact: {loop.systemImpact}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: Leverage Interventions (Meadows) */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00]"></span>
            <span>4. Systemic Leverage Points (Donella Meadows Framework)</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {leveragePoints.map(lp => (
              <div key={lp.id} className="bg-[#090f1a] p-4 rounded-lg border border-slate-800 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                    {lp.levelName}
                  </span>
                  <span className="text-[10px] font-mono uppercase text-[#ff5a00] font-bold">
                    {lp.impactScore} IMPACT
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{lp.interventionTitle}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">{lp.description}</p>
                <div className="bg-emerald-950/20 p-2 rounded text-[11px] text-emerald-300 border border-emerald-800/40">
                  <strong>Why High Leverage:</strong> {lp.whyItHasLeverage}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: AHP Multi-Criteria Results & Winning Alternative */}
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a00]"></span>
            <span>5. Analytic Hierarchy Process (AHP) Decision Verdict</span>
          </h2>

          {/* Winner Showcase Banner */}
          <div className="bg-gradient-to-r from-orange-950/40 to-slate-900 border border-[#ff5a00] p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-mono font-bold text-[#ff5a00] uppercase tracking-wider">
                RECOMMENDED INNOVATION SELECTION
              </div>
              <h3 className="text-xl font-bold text-white mt-1">
                {winningAlt?.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                {winningAlt?.description}
              </p>
            </div>

            <div className="text-right">
              <div className="text-3xl font-extrabold font-mono text-white tabular-nums">
                {ahpResult.ranking[0]?.scorePct}%
              </div>
              <div className="text-xs text-emerald-400 font-mono">
                Consistency Ratio CR = {(ahpResult.criteriaCR * 100).toFixed(1)}% (PASS)
              </div>
            </div>
          </div>

          {/* Summary Ranking Table */}
          <div className="overflow-x-auto mt-2">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg">
              <thead>
                <tr className="bg-[#090f1a] text-slate-400 font-semibold border-b border-slate-800">
                  <th className="py-2.5 px-3">Rank</th>
                  <th className="py-2.5 px-3">Solution Concept</th>
                  <th className="py-2.5 px-3">AHP Global Score</th>
                  <th className="py-2.5 px-3">Economics [Simulated Data]</th>
                  <th className="py-2.5 px-3">Deploy Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 font-mono">
                {ahpResult.ranking.map(r => {
                  const alt = alternatives.find(a => a.id === r.alternativeId);
                  return (
                    <tr key={r.alternativeId} className="hover:bg-slate-800/20">
                      <td className="py-2.5 px-3 font-bold text-[#ff5a00]">#{r.rank}</td>
                      <td className="py-2.5 px-3 font-sans font-semibold text-white">{alt?.title}</td>
                      <td className="py-2.5 px-3 text-emerald-400 font-bold">{r.scorePct}% ({r.score.toFixed(3)})</td>
                      <td className="py-2.5 px-3 text-slate-300">{alt?.estimatedCost}</td>
                      <td className="py-2.5 px-3 text-slate-400">{alt?.timeToDeploy}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Report Footer */}
        <div className="border-t border-slate-800 pt-6 flex flex-wrap items-center justify-between text-xs text-slate-500">
          <div>
            Generated via Metropolia University of Applied Sciences Innovation Partner System
          </div>
          <div className="font-mono">
            Notice: All CleanBot numerical data labeled as [Simulated/Demo Data]
          </div>
        </div>
      </div>
    </div>
  );
};
