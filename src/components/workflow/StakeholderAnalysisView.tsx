import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  ArrowRight, 
  Info, 
  Target, 
  ShieldCheck, 
  HelpCircle 
} from 'lucide-react';
import { Stakeholder, QuadrantType } from '../../types/innovation';

interface StakeholderAnalysisViewProps {
  stakeholders: Stakeholder[];
  onChange: (updated: Stakeholder[]) => void;
  onNextStep: () => void;
}

export function getQuadrant(influence: number, interest: number): {
  type: QuadrantType;
  label: string;
  strategy: string;
  colorClass: string;
  badgeClass: string;
} {
  const isHighInfluence = influence >= 3.5;
  const isHighInterest = interest >= 3.5;

  if (isHighInfluence && isHighInterest) {
    return {
      type: 'key_players',
      label: 'Manage Closely (Key Players)',
      strategy: 'Partner actively. Involve directly in project governance, solution co-design, and milestone sign-offs. High priority focus.',
      colorClass: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      badgeClass: 'bg-emerald-950/80 text-emerald-400 border border-emerald-800'
    };
  } else if (isHighInfluence && !isHighInterest) {
    return {
      type: 'keep_satisfied',
      label: 'Keep Satisfied (High Power)',
      strategy: 'Fulfill institutional and regulatory requirements. Provide concise executive updates; do not overwhelm with daily operational details.',
      colorClass: 'border-indigo-500/40 bg-indigo-950/20 text-indigo-300',
      badgeClass: 'bg-indigo-950/80 text-indigo-400 border border-indigo-800'
    };
  } else if (!isHighInfluence && isHighInterest) {
    return {
      type: 'keep_informed',
      label: 'Keep Informed (High Interest)',
      strategy: 'Maintain regular two-way communication. Solicit feedback, pilot testing input, and utilize as word-of-mouth project champions.',
      colorClass: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      badgeClass: 'bg-amber-950/80 text-amber-400 border border-amber-800'
    };
  } else {
    return {
      type: 'monitor',
      label: 'Monitor (Low Priority)',
      strategy: 'Monitor via standard general communications. Allocate minimum effort, but track whether their influence or interest evolves.',
      colorClass: 'border-slate-700/60 bg-slate-900/40 text-slate-400',
      badgeClass: 'bg-slate-900 text-slate-400 border border-slate-800'
    };
  }
}

export const StakeholderAnalysisView: React.FC<StakeholderAnalysisViewProps> = ({
  stakeholders,
  onChange,
  onNextStep
}) => {
  const [selectedStakeholderId, setSelectedStakeholderId] = useState<string | null>(null);
  const [filterQuadrant, setFilterQuadrant] = useState<string>('all');
  const [isAdding, setIsAdding] = useState(false);

  // New stakeholder form state
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newInfluence, setNewInfluence] = useState(3);
  const [newInterest, setNewInterest] = useState(3);
  const [newConcerns, setNewConcerns] = useState('');

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const quad = getQuadrant(newInfluence, newInterest);
    const newStakeholder: Stakeholder = {
      id: 'st_' + Date.now(),
      name: newName.trim(),
      role: newRole.trim() || 'Project Stakeholder',
      influence: newInfluence,
      interest: newInterest,
      keyConcerns: newConcerns.trim() || 'Operational alignment and risk mitigation.',
      customStrategy: quad.strategy
    };

    onChange([...stakeholders, newStakeholder]);
    setNewName('');
    setNewRole('');
    setNewConcerns('');
    setNewInfluence(3);
    setNewInterest(3);
    setIsAdding(false);
  };

  const handleDeleteStakeholder = (id: string) => {
    onChange(stakeholders.filter(s => s.id !== id));
    if (selectedStakeholderId === id) setSelectedStakeholderId(null);
  };

  const handleUpdateRating = (id: string, field: 'influence' | 'interest', val: number) => {
    onChange(
      stakeholders.map(s => {
        if (s.id !== id) return s;
        const updated = { ...s, [field]: val };
        const quad = getQuadrant(updated.influence, updated.interest);
        return {
          ...updated,
          customStrategy: quad.strategy
        };
      })
    );
  };

  const filteredStakeholders = stakeholders.filter(s => {
    if (filterQuadrant === 'all') return true;
    const q = getQuadrant(s.influence, s.interest).type;
    return q === filterQuadrant;
  });

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">2. Stakeholder Analysis & Influence-Interest Matrix</span>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              {stakeholders.length} STAKEHOLDERS MAPPED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Evaluate key individuals and groups by their institutional Influence (Power) and Interest (Stake) on a 1–5 scale. The system calculates their quadrant and generates tailored engagement strategies.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#ff5a00]" />
            <span>Add Stakeholder</span>
          </button>

          <button
            onClick={onNextStep}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Systems Thinking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add Stakeholder Drawer/Form */}
      {isAdding && (
        <form onSubmit={handleAddStakeholder} className="bg-[#0e1626] rounded-xl border border-[#ff5a00]/40 p-5 flex flex-col gap-4 shadow-xl animate-in fade-in duration-200">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#ff5a00]" />
            <span>Add New Innovation Stakeholder</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Stakeholder / Group Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Student Union METKA"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Role / Function</label>
              <input
                type="text"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
                placeholder="e.g. Primary Campus User Representative"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Influence (Power): <strong className="text-[#ff5a00] font-mono">{newInfluence}/5</strong>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={newInfluence}
                onChange={(e) => setNewInfluence(parseInt(e.target.value))}
                className="w-full accent-[#ff5a00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 (Low)</span>
                <span>3 (Medium)</span>
                <span>5 (High)</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Interest (Stake): <strong className="text-[#ff5a00] font-mono">{newInterest}/5</strong>
              </label>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={newInterest}
                onChange={(e) => setNewInterest(parseInt(e.target.value))}
                className="w-full accent-[#ff5a00] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>1 (Low)</span>
                <span>3 (Medium)</span>
                <span>5 (High)</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Key Concerns & Expectations</label>
            <input
              type="text"
              value={newConcerns}
              onChange={(e) => setNewConcerns(e.target.value)}
              placeholder="e.g. Cleanliness consistency, noise during evening study hours, transparent safety..."
              className="w-full bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-slate-800 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded"
            >
              Save Stakeholder
            </button>
          </div>
        </form>
      )}

      {/* 2D Interactive Matrix + Stakeholder Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Matrix Visualization (7 cols) */}
        <div className="lg:col-span-7 bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#ff5a00]" />
              <span>Influence – Interest 2D Matrix</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Click a dot to inspect</span>
          </div>

          {/* 2D Coordinate Grid Canvas / SVG */}
          <div className="relative bg-[#080d15] rounded-lg border border-slate-800 p-4 aspect-[4/3] flex flex-col justify-between overflow-hidden">
            {/* 4 Quadrants Background Tint */}
            <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-40">
              {/* Top-Left: High Influence, Low Interest */}
              <div className="border-r border-b border-dashed border-slate-700/80 bg-indigo-950/20 p-2 flex flex-col justify-start">
                <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-wider">
                  Keep Satisfied
                </span>
                <span className="text-[9px] text-slate-400">High Influence · Low Interest</span>
              </div>
              {/* Top-Right: High Influence, High Interest */}
              <div className="border-b border-dashed border-slate-700/80 bg-emerald-950/25 p-2 flex flex-col justify-start text-right">
                <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider">
                  Manage Closely (Key Players)
                </span>
                <span className="text-[9px] text-slate-400">High Influence · High Interest</span>
              </div>
              {/* Bottom-Left: Low Influence, Low Interest */}
              <div className="border-r border-dashed border-slate-700/80 bg-slate-900/40 p-2 flex flex-col justify-end">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Monitor (Minimum Effort)
                </span>
                <span className="text-[9px] text-slate-500">Low Influence · Low Interest</span>
              </div>
              {/* Bottom-Right: Low Influence, High Interest */}
              <div className="bg-amber-950/20 p-2 flex flex-col justify-end text-right">
                <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider">
                  Keep Informed
                </span>
                <span className="text-[9px] text-slate-400">Low Influence · High Interest</span>
              </div>
            </div>

            {/* Stakeholder Scatter Points */}
            <div className="absolute inset-x-8 inset-y-8 pointer-events-auto">
              {stakeholders.map((s) => {
                const isSelected = selectedStakeholderId === s.id;
                // Map influence (1 to 5) to Y% (bottom 0% to top 100%)
                const yPercent = 100 - ((s.influence - 1) / 4) * 100;
                // Map interest (1 to 5) to X% (left 0% to right 100%)
                const xPercent = ((s.interest - 1) / 4) * 100;

                const q = getQuadrant(s.influence, s.interest);

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStakeholderId(s.id)}
                    style={{
                      left: `calc(${xPercent}% + ${((Math.random() - 0.5) * 8).toFixed(1)}px)`,
                      top: `calc(${yPercent}% + ${((Math.random() - 0.5) * 8).toFixed(1)}px)`
                    }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group transition-transform ${
                      isSelected ? 'scale-125 z-30' : 'hover:scale-110 z-10'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono transition-shadow shadow-md ${
                        q.type === 'key_players'
                          ? 'bg-emerald-500 text-slate-950 ring-2 ring-emerald-300'
                          : q.type === 'keep_satisfied'
                          ? 'bg-indigo-500 text-white ring-2 ring-indigo-300'
                          : q.type === 'keep_informed'
                          ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300'
                          : 'bg-slate-600 text-white ring-2 ring-slate-400'
                      }`}
                    >
                      {s.influence},{s.interest}
                    </div>

                    {/* Tooltip / Label */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-1.5 hidden group-hover:block whitespace-nowrap bg-slate-950/95 border border-slate-700 px-2 py-1 rounded text-[11px] text-white z-40 pointer-events-none shadow-lg">
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.role}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Axes Labels */}
            <div className="relative z-10 flex justify-between items-center text-[10px] font-mono text-slate-500 border-t border-slate-800 pt-1 mt-auto">
              <span>← Low Interest (1)</span>
              <span className="font-bold text-slate-400 uppercase tracking-widest">Stakeholder Interest</span>
              <span>High Interest (5) →</span>
            </div>
          </div>
        </div>

        {/* Selected Stakeholder Detail Card (5 cols) */}
        <div className="lg:col-span-5 bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-400" />
                <span>Stakeholder Detail & Strategy</span>
              </h3>
              {selectedStakeholderId && (
                <button
                  onClick={() => setSelectedStakeholderId(null)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Clear Selection
                </button>
              )}
            </div>

            {selectedStakeholderId ? (() => {
              const s = stakeholders.find(item => item.id === selectedStakeholderId);
              if (!s) return null;
              const q = getQuadrant(s.influence, s.interest);

              return (
                <div className="flex flex-col gap-4 mt-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-base font-bold text-white">{s.name}</h4>
                      <span className={`px-2 py-0.5 text-[10px] font-mono rounded ${q.badgeClass}`}>
                        {q.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{s.role}</p>
                  </div>

                  {/* Rating Sliders in detail */}
                  <div className="grid grid-cols-2 gap-3 bg-[#090f1a] p-3 rounded-lg border border-slate-800">
                    <div>
                      <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                        <span>Influence:</span>
                        <span className="font-mono text-[#ff5a00]">{s.influence}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={s.influence}
                        onChange={(e) => handleUpdateRating(s.id, 'influence', parseInt(e.target.value))}
                        className="w-full accent-[#ff5a00]"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-300 font-semibold mb-1">
                        <span>Interest:</span>
                        <span className="font-mono text-[#ff5a00]">{s.interest}/5</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={s.interest}
                        onChange={(e) => handleUpdateRating(s.id, 'interest', parseInt(e.target.value))}
                        className="w-full accent-[#ff5a00]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Key Concerns:
                    </label>
                    <p className="text-xs text-slate-200 bg-[#090f1a] p-2.5 rounded-lg border border-slate-800 leading-relaxed">
                      {s.keyConcerns}
                    </p>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Recommended Engagement Strategy:
                    </label>
                    <p className="text-xs text-emerald-200 bg-emerald-950/20 p-2.5 rounded-lg border border-emerald-800/40 leading-relaxed">
                      {s.customStrategy || q.strategy}
                    </p>
                  </div>
                </div>
              );
            })() : (
              <div className="py-12 flex flex-col items-center justify-center text-center text-slate-500 text-xs">
                <Users className="w-10 h-10 mb-2 stroke-[1.5] text-slate-600" />
                <p className="max-w-[220px]">
                  Select any stakeholder from the matrix or list below to view their tailored engagement strategy.
                </p>
              </div>
            )}
          </div>

          {selectedStakeholderId && (
            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDeleteStakeholder(selectedStakeholderId)}
                className="px-3 py-1.5 text-xs text-rose-400 hover:text-white hover:bg-rose-900/60 rounded border border-rose-800/60 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Stakeholder</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stakeholders Table View & Quick Sliders */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-[#090f1a]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-white">Filter by Quadrant:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'All' },
                { id: 'key_players', label: 'Key Players' },
                { id: 'keep_satisfied', label: 'Keep Satisfied' },
                { id: 'keep_informed', label: 'Keep Informed' },
                { id: 'monitor', label: 'Monitor' }
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilterQuadrant(f.id)}
                  className={`px-2.5 py-1 text-xs rounded transition-colors ${
                    filterQuadrant === f.id
                      ? 'bg-slate-700 text-white font-medium'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs text-slate-400 font-mono">
            Showing {filteredStakeholders.length} of {stakeholders.length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-[#0b1019]">
                <th className="py-3 px-4">Stakeholder & Role</th>
                <th className="py-3 px-4 w-28">Influence</th>
                <th className="py-3 px-4 w-28">Interest</th>
                <th className="py-3 px-4">Matrix Quadrant</th>
                <th className="py-3 px-4">Key Concerns</th>
                <th className="py-3 px-4">Engagement Strategy</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredStakeholders.map((s) => {
                const q = getQuadrant(s.influence, s.interest);
                const isSelected = selectedStakeholderId === s.id;
                return (
                  <tr
                    key={s.id}
                    onClick={() => setSelectedStakeholderId(s.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-slate-800/60' : 'hover:bg-slate-800/30'
                    }`}
                  >
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{s.name}</div>
                      <div className="text-[11px] text-slate-400">{s.role}</div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={s.influence}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleUpdateRating(s.id, 'influence', parseInt(e.target.value));
                          }}
                          className="w-16 accent-[#ff5a00]"
                        />
                        <span className="text-slate-300 font-bold">{s.influence}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={s.interest}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleUpdateRating(s.id, 'interest', parseInt(e.target.value));
                          }}
                          className="w-16 accent-[#ff5a00]"
                        />
                        <span className="text-slate-300 font-bold">{s.interest}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono ${q.badgeClass}`}>
                        {q.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-[200px] truncate" title={s.keyConcerns}>
                      {s.keyConcerns}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-[240px] truncate" title={s.customStrategy || q.strategy}>
                      {s.customStrategy || q.strategy}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStakeholder(s.id);
                        }}
                        className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
