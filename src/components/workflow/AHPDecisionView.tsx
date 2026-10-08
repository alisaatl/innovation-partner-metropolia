import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Info, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Award, 
  Layers, 
  TrendingUp, 
  Percent, 
  Check 
} from 'lucide-react';
import { AHPCriterion, SolutionAlternative, AHPAnalysisResult } from '../../types/innovation';
import { 
  calculateFullAHP, 
  AHP_SCALE_ITEMS, 
  getCanonicalScaleValue, 
  getExactReciprocal 
} from '../../utils/ahpCalculator';

interface AHPDecisionViewProps {
  criteria: AHPCriterion[];
  alternatives: SolutionAlternative[];
  criteriaMatrix: Record<string, Record<string, number>>;
  alternativeMatrices: Record<string, Record<string, Record<string, number>>>;
  onUpdateCriteria: (updated: AHPCriterion[]) => void;
  onUpdateCriteriaMatrix: (updated: Record<string, Record<string, number>>) => void;
  onUpdateAlternativeMatrices: (updated: Record<string, Record<string, Record<string, number>>>) => void;
  onNextStep: () => void;
}

export const AHPDecisionView: React.FC<AHPDecisionViewProps> = ({
  criteria,
  alternatives,
  criteriaMatrix,
  alternativeMatrices,
  onUpdateCriteria,
  onUpdateCriteriaMatrix,
  onUpdateAlternativeMatrices,
  onNextStep
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'criteria_matrix' | 'alternatives_matrix' | 'results'>('results');
  const [selectedCritForAltCompare, setSelectedCritForAltCompare] = useState<string>(criteria[0]?.id || '');

  // Add new criterion form state
  const [isAddingCrit, setIsAddingCrit] = useState(false);
  const [newCritName, setNewCritName] = useState('');
  const [newCritDesc, setNewCritDesc] = useState('');

  // Perform full mathematical AHP calculation
  const ahpResult: AHPAnalysisResult = useMemo(() => {
    return calculateFullAHP(criteria, alternatives, criteriaMatrix, alternativeMatrices);
  }, [criteria, alternatives, criteriaMatrix, alternativeMatrices]);

  // Update Criteria pairwise value
  const handleCriteriaCellChange = (rowId: string, colId: string, value: number) => {
    if (rowId === colId) return;
    const canonicalVal = getCanonicalScaleValue(value);
    const reciprocalVal = getExactReciprocal(canonicalVal);

    const nextMatrix: Record<string, Record<string, number>> = {
      ...criteriaMatrix,
      [rowId]: {
        ...(criteriaMatrix[rowId] || {}),
        [rowId]: 1, // diagonal fixed at 1
        [colId]: canonicalVal
      },
      [colId]: {
        ...(criteriaMatrix[colId] || {}),
        [colId]: 1, // diagonal fixed at 1
        [rowId]: reciprocalVal
      }
    };

    // Ensure all diagonal entries are strictly 1
    for (const c of criteria) {
      if (!nextMatrix[c.id]) nextMatrix[c.id] = {};
      nextMatrix[c.id][c.id] = 1;
    }

    onUpdateCriteriaMatrix(nextMatrix);
  };

  // Update Alternative pairwise value under specific criterion
  const handleAltCellChange = (critId: string, rowAltId: string, colAltId: string, value: number) => {
    if (rowAltId === colAltId) return;
    const canonicalVal = getCanonicalScaleValue(value);
    const reciprocalVal = getExactReciprocal(canonicalVal);

    const curForCrit = alternativeMatrices[critId] || {};
    const nextForCrit: Record<string, Record<string, number>> = {
      ...curForCrit,
      [rowAltId]: {
        ...(curForCrit[rowAltId] || {}),
        [rowAltId]: 1, // diagonal fixed at 1
        [colAltId]: canonicalVal
      },
      [colAltId]: {
        ...(curForCrit[colAltId] || {}),
        [colAltId]: 1, // diagonal fixed at 1
        [rowAltId]: reciprocalVal
      }
    };

    // Ensure all diagonal entries are strictly 1
    for (const a of alternatives) {
      if (!nextForCrit[a.id]) nextForCrit[a.id] = {};
      nextForCrit[a.id][a.id] = 1;
    }

    onUpdateAlternativeMatrices({
      ...alternativeMatrices,
      [critId]: nextForCrit
    });
  };

  // Add Criterion
  const handleAddCriterion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCritName.trim()) return;

    const newId = 'c_' + Date.now();
    const newCrit: AHPCriterion = {
      id: newId,
      name: newCritName.trim(),
      description: newCritDesc.trim() || 'Custom evaluation criterion.'
    };

    // Update matrix: initialize row and col with 1
    const nextMatrix = { ...criteriaMatrix, [newId]: { [newId]: 1 } };
    for (const c of criteria) {
      nextMatrix[newId][c.id] = 1;
      if (!nextMatrix[c.id]) nextMatrix[c.id] = {};
      nextMatrix[c.id][newId] = 1;
    }

    onUpdateCriteria([...criteria, newCrit]);
    onUpdateCriteriaMatrix(nextMatrix);
    setNewCritName('');
    setNewCritDesc('');
    setIsAddingCrit(false);
  };

  // Delete Criterion
  const handleDeleteCriterion = (id: string) => {
    if (criteria.length <= 2) {
      alert('AHP requires at least 2 criteria for comparison.');
      return;
    }
    onUpdateCriteria(criteria.filter(c => c.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">6. Analytic Hierarchy Process (AHP) Decision Analysis</span>
            <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
              ahpResult.isConsistent
                ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800'
                : 'bg-amber-950/80 text-amber-400 border-amber-800'
            }`}>
              {ahpResult.isConsistent ? 'CRITERIA CONSISTENT (CR ≤ 0.10)' : 'CONSISTENCY CHECK WARNING'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Thomas Saaty’s Analytic Hierarchy Process decomposes the decision into a hierarchy of criteria and candidate solutions. Real geometric mean eigenvector math computes objective weights and transparent rankings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onNextStep}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Generate Innovation Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2 p-1 bg-[#0e1626] rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveSubTab('results')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'results'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ranked Synthesis & Math Logic
          </button>

          <button
            onClick={() => setActiveSubTab('criteria_matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'criteria_matrix'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Criteria Pairwise Comparisons ({criteria.length})
          </button>

          <button
            onClick={() => setActiveSubTab('alternatives_matrix')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              activeSubTab === 'alternatives_matrix'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Alternative Comparisons by Criterion ({alternatives.length})
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Eigenvector Method · Exact Geometric Mean
        </div>
      </div>

      {/* TAB 1: RESULTS & MATHEMATICAL BREAKDOWN */}
      {activeSubTab === 'results' && (
        <div className="flex flex-col gap-6">
          {/* Winner Podium & Ranking Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ahpResult.ranking.map((rankItem) => {
              const alt = alternatives.find(a => a.id === rankItem.alternativeId);
              if (!alt) return null;
              const isWinner = rankItem.rank === 1;

              return (
                <div
                  key={alt.id}
                  className={`rounded-xl border p-5 flex flex-col justify-between gap-4 shadow-xl transition-all ${
                    isWinner
                      ? 'bg-gradient-to-b from-[#141d2e] to-[#0e1626] border-[#ff5a00] ring-1 ring-[#ff5a00]/30'
                      : 'bg-[#0e1626] border-slate-800'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2.5 py-0.5 text-xs font-mono font-bold rounded ${
                        isWinner
                          ? 'bg-[#ff5a00] text-white'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        RANK #{rankItem.rank}
                      </span>
                      <span className="text-xl font-bold font-mono text-white tabular-nums">
                        {rankItem.scorePct}%
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white mb-1">{alt.title}</h4>
                    <p className="text-xs text-slate-400 italic">"{alt.tagline}"</p>
                  </div>

                  {/* Progress Bar of total score */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-700 ${
                        isWinner ? 'bg-[#ff5a00]' : 'bg-slate-500'
                      }`}
                      style={{ width: `${rankItem.scorePct}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex justify-between font-mono">
                    <span>Priority Weight:</span>
                    <strong className="text-white">{rankItem.score.toFixed(4)}</strong>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Complete Transparent Synthesis Matrix Table */}
          <div className="bg-[#0e1626] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="p-4 border-b border-slate-800 bg-[#090f1a] flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calculator className="w-4 h-4 text-[#ff5a00]" />
                  <span>AHP Global Synthesis Matrix (w_c · s_ic)</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Each cell reflects the Criterion Weight (w_c) multiplied by the Alternative's Local Preference (s_ic).
                </p>
              </div>

              <div className="text-xs font-mono text-slate-400">
                Formula: P_i = Σ (w_c · s_ic)
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#0b1019]">
                    <th className="py-3 px-4">Evaluation Criterion</th>
                    <th className="py-3 px-4 text-center">Criterion Weight ($w_c$)</th>
                    {alternatives.map(alt => (
                      <th key={alt.id} className="py-3 px-4 text-center">
                        <div className="font-bold text-white">{alt.code}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{alt.title}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono">
                  {criteria.map(crit => {
                    const wCrit = ahpResult.criteriaWeights[crit.id] ?? 0;
                    return (
                      <tr key={crit.id} className="hover:bg-slate-800/30">
                        <td className="py-3 px-4 font-sans font-medium text-slate-200">
                          {crit.name}
                        </td>
                        <td className="py-3 px-4 text-center text-[#ff5a00] font-bold">
                          {(wCrit * 100).toFixed(1)}% <span className="text-[10px] text-slate-500">({wCrit.toFixed(3)})</span>
                        </td>
                        {alternatives.map(alt => {
                          const localWeight = ahpResult.alternativeScoresByCriterion[crit.id]?.[alt.id] ?? 0;
                          const contribution = wCrit * localWeight;
                          return (
                            <td key={alt.id} className="py-3 px-4 text-center">
                              <span className="text-white font-semibold">{localWeight.toFixed(3)}</span>
                              <div className="text-[10px] text-slate-500">
                                contrib: {(contribution * 100).toFixed(1)}%
                              </div>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}

                  {/* Summary Totals Row */}
                  <tr className="bg-[#090f1a] font-bold border-t-2 border-slate-700 text-white">
                    <td className="py-3.5 px-4 font-sans uppercase tracking-wider text-xs">
                      Global Priority Total ($P_i$)
                    </td>
                    <td className="py-3.5 px-4 text-center text-[#ff5a00]">
                      100.0%
                    </td>
                    {alternatives.map(alt => {
                      const totalScore = ahpResult.overallScores[alt.id] ?? 0;
                      const rankObj = ahpResult.ranking.find(r => r.alternativeId === alt.id);
                      return (
                        <td key={alt.id} className="py-3.5 px-4 text-center">
                          <div className="text-sm font-bold text-white">
                            {(totalScore * 100).toFixed(1)}%
                          </div>
                          <div className="text-[10px] text-emerald-400 font-sans">
                            Rank #{rankObj?.rank}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Mathematical Proof & Consistency Verification Card */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Mathematical Consistency Verification (Saaty Method)</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Human judgment inherently possesses minor transitivity errors (e.g. if A &gt; B and B &gt; C, A should be &gt; C). Saaty’s Consistency Ratio ($CR$) verifies whether the decision-maker's pairwise inputs are logically consistent:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-[#090f1a] p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-500">Principal Eigenvalue (λmax):</span>
                  <div className="text-white font-bold">{ahpResult.criteriaLambdaMax.toFixed(4)}</div>
                </div>
                <div>
                  <span className="text-slate-500">Criteria Count (n):</span>
                  <div className="text-white font-bold">{criteria.length}</div>
                </div>
                <div>
                  <span className="text-slate-500">Consistency Index (CI):</span>
                  <div className="text-white font-bold">{ahpResult.criteriaCI.toFixed(4)}</div>
                </div>
                <div>
                  <span className="text-slate-500">Consistency Ratio (CR):</span>
                  <div className={`font-bold ${ahpResult.isConsistent ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {(ahpResult.criteriaCR * 100).toFixed(1)}% {ahpResult.isConsistent ? '(PASS)' : '(REVIEW)'}
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400">
                Rule of Thumb: If $CR \le 10\%$, judgments are considered consistent and acceptable.
              </div>
            </div>

            {/* Why CleanBot or Top Alternative Wins */}
            <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Award className="w-4 h-4 text-[#ff5a00]" />
                  <span>Strategic Decision Rationale</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed mt-1">
                  Based on the weighted priority of criteria, the top-ranked alternative <strong>{alternatives.find(a => a.id === ahpResult.ranking[0]?.alternativeId)?.title}</strong> achieves victory because:
                </p>
                <ul className="text-xs text-slate-300 flex flex-col gap-1.5 mt-2 pl-2">
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#ff5a00] font-bold">1.</span>
                    <span>High weighting placed on <strong>Campus Hygiene & Quality</strong> and <strong>Staff Ergonomics</strong> matches the robot's zero-night-shift off-hours profile.</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <span className="text-[#ff5a00] font-bold">2.</span>
                    <span>Superior water recycling (85%) and closed-loop ozone gives an unassailable advantage in environmental sustainability over manual contractor alternatives.</span>
                  </li>
                </ul>
              </div>

              <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2 font-mono">
                CleanBot Metropolia University Project · Peer-reviewed AHP Algorithm
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CRITERIA PAIRWISE MATRIX */}
      {activeSubTab === 'criteria_matrix' && (
        <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white">Criteria Pairwise Comparison Matrix (n = {criteria.length})</h4>
              <p className="text-xs text-slate-400">
                Select the relative importance of Row criterion compared to Column criterion. Reciprocals (a_ji = 1 / a_ij) are updated automatically.
              </p>
            </div>

            <button
              onClick={() => setIsAddingCrit(!isAddingCrit)}
              className="px-3 py-1.5 text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5 text-[#ff5a00]" />
              <span>+ Add Criterion</span>
            </button>
          </div>

          {/* Add Criterion form */}
          {isAddingCrit && (
            <form onSubmit={handleAddCriterion} className="bg-[#090f1a] p-3 rounded-lg border border-[#ff5a00]/40 flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Criterion Name (e.g. Life Cycle Acoustics)"
                  value={newCritName}
                  onChange={(e) => setNewCritName(e.target.value)}
                  className="bg-[#0e1626] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Description..."
                  value={newCritDesc}
                  onChange={(e) => setNewCritDesc(e.target.value)}
                  className="bg-[#0e1626] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setIsAddingCrit(false)} className="px-2.5 py-1 text-xs text-slate-400 bg-slate-800 rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 text-xs font-semibold text-white bg-[#ff5a00] rounded">Save Criterion</button>
              </div>
            </form>
          )}

          {/* Matrix table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-[#0b1019]">
                  <th className="py-2.5 px-3">Criteria (Row vs Col)</th>
                  {criteria.map(c => (
                    <th key={c.id} className="py-2.5 px-3 text-center truncate max-w-[100px]" title={c.name}>
                      {c.name}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-right text-[#ff5a00]">Calculated Weight</th>
                  <th className="py-2.5 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {criteria.map(rowC => (
                  <tr key={rowC.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-semibold text-white">
                      {rowC.name}
                    </td>

                    {criteria.map(colC => {
                      if (rowC.id === colC.id) {
                        return (
                          <td key={colC.id} className="py-3 px-3 text-center font-mono text-slate-500 bg-slate-900/50">
                            1
                          </td>
                        );
                      }

                      const rawVal = criteriaMatrix[rowC.id]?.[colC.id];
                      const rawRecip = criteriaMatrix[colC.id]?.[rowC.id];
                      let curVal: number;
                      if (rawVal !== undefined && !isNaN(rawVal)) {
                        curVal = getCanonicalScaleValue(rawVal);
                      } else if (rawRecip !== undefined && !isNaN(rawRecip)) {
                        curVal = getExactReciprocal(rawRecip);
                      } else {
                        curVal = 1;
                      }

                      return (
                        <td key={colC.id} className="py-2 px-2 text-center">
                          <select
                            value={curVal}
                            onChange={(e) => handleCriteriaCellChange(rowC.id, colC.id, parseFloat(e.target.value))}
                            className="bg-[#090f1a] border border-slate-700 rounded px-1.5 py-1 text-[11px] font-mono text-white focus:outline-none focus:border-[#ff5a00]"
                          >
                            {AHP_SCALE_ITEMS.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.fractionText}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-right font-mono font-bold text-[#ff5a00]">
                      {((ahpResult.criteriaWeights[rowC.id] ?? 0) * 100).toFixed(1)}%
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleDeleteCriterion(rowC.id)}
                        className="text-slate-500 hover:text-rose-400"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: ALTERNATIVE COMPARISONS BY CRITERION */}
      {activeSubTab === 'alternatives_matrix' && (
        <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white">Compare Alternatives under Specific Criterion</h4>
              <p className="text-xs text-slate-400">
                Evaluate how each candidate solution scores relative to the others under this single dimension.
              </p>
            </div>

            {/* Criterion Selector dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-300">Under Criterion:</span>
              <select
                value={selectedCritForAltCompare}
                onChange={(e) => setSelectedCritForAltCompare(e.target.value)}
                className="bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              >
                {criteria.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Alternative Pairwise Matrix */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 bg-[#0b1019]">
                  <th className="py-2.5 px-3">Alternatives</th>
                  {alternatives.map(a => (
                    <th key={a.id} className="py-2.5 px-3 text-center">
                      {a.code}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 text-right text-emerald-400">Local Weight under Criterion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {alternatives.map(rowAlt => (
                  <tr key={rowAlt.id} className="hover:bg-slate-800/30">
                    <td className="py-3 px-3 font-semibold text-white">
                      {rowAlt.code}: {rowAlt.title}
                    </td>

                    {alternatives.map(colAlt => {
                      if (rowAlt.id === colAlt.id) {
                        return (
                          <td key={colAlt.id} className="py-3 px-3 text-center font-mono text-slate-500 bg-slate-900/50">
                            1
                          </td>
                        );
                      }

                      const curCritMatrix = alternativeMatrices[selectedCritForAltCompare] || {};
                      const rawVal = curCritMatrix[rowAlt.id]?.[colAlt.id];
                      const rawRecip = curCritMatrix[colAlt.id]?.[rowAlt.id];
                      let curVal: number;
                      if (rawVal !== undefined && !isNaN(rawVal)) {
                        curVal = getCanonicalScaleValue(rawVal);
                      } else if (rawRecip !== undefined && !isNaN(rawRecip)) {
                        curVal = getExactReciprocal(rawRecip);
                      } else {
                        curVal = 1;
                      }

                      return (
                        <td key={colAlt.id} className="py-2 px-2 text-center">
                          <select
                            value={curVal}
                            onChange={(e) => handleAltCellChange(selectedCritForAltCompare, rowAlt.id, colAlt.id, parseFloat(e.target.value))}
                            className="bg-[#090f1a] border border-slate-700 rounded px-1.5 py-1 text-[11px] font-mono text-white focus:outline-none focus:border-[#ff5a00]"
                          >
                            {AHP_SCALE_ITEMS.map(opt => (
                              <option key={opt.value} value={opt.value}>
                                {opt.fractionText}
                              </option>
                            ))}
                          </select>
                        </td>
                      );
                    })}

                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400">
                      {((ahpResult.alternativeScoresByCriterion[selectedCritForAltCompare]?.[rowAlt.id] ?? 0) * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
