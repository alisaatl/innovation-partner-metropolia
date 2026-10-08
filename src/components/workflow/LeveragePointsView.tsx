import React, { useState } from 'react';
import { 
  Zap, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ArrowRight, 
  Info, 
  AlertTriangle, 
  Layers, 
  Award,
  HelpCircle
} from 'lucide-react';
import { LeveragePoint, SystemFactor } from '../../types/innovation';

interface LeveragePointsViewProps {
  leveragePoints: LeveragePoint[];
  factors: SystemFactor[];
  onChange: (updated: LeveragePoint[]) => void;
  onNextStep: () => void;
}

const MEADOWS_LEVELS = [
  { level: 12, name: 'Level 12: Constants, parameters, numbers (subsidies, taxes, standards)' },
  { level: 11, name: 'Level 11: The sizes of buffers and other stabilizing stocks' },
  { level: 10, name: 'Level 10: Structure of material stocks and flows (physical transport)' },
  { level: 9, name: 'Level 9: Length of delays relative to the rate of system change' },
  { level: 8, name: 'Level 8: Strength of negative feedback loops (self-correcting controls)' },
  { level: 7, name: 'Level 7: Gain around driving positive feedback loops (amplifiers)' },
  { level: 6, name: 'Level 6: Structure of information flows (who has access to data)' },
  { level: 5, name: 'Level 5: Rules of the system (incentives, punishments, constraints)' },
  { level: 4, name: 'Level 4: Power to add, change, evolve, or self-organize system structure' },
  { level: 3, name: 'Level 3: Goals of the system (what the overall system strives to achieve)' },
  { level: 2, name: 'Level 2: Mindset or paradigm out of which the system arises' },
  { level: 1, name: 'Level 1: The power to transcend paradigms (ultimate flexibility)' }
];

export const LeveragePointsView: React.FC<LeveragePointsViewProps> = ({
  leveragePoints,
  factors,
  onChange,
  onNextStep
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);

  // Add form state
  const [title, setTitle] = useState('');
  const [level, setLevel] = useState(6);
  const [factorId, setFactorId] = useState(factors[0]?.id || '');
  const [desc, setDesc] = useState('');
  const [whyLeverage, setWhyLeverage] = useState('');
  const [resistance, setResistance] = useState('');
  const [impact, setImpact] = useState<LeveragePoint['impactScore']>('transformative');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const selectedMeadows = MEADOWS_LEVELS.find(m => m.level === level);
    const newPoint: LeveragePoint = {
      id: 'lp_' + Date.now(),
      meadowsLevel: level,
      levelName: selectedMeadows?.name || `Level ${level}`,
      factorId,
      interventionTitle: title.trim(),
      description: desc.trim(),
      whyItHasLeverage: whyLeverage.trim() || 'Small procedural shift causes outsized system stability.',
      potentialResistance: resistance.trim() || 'Inertia in current operations.',
      impactScore: impact
    };

    onChange([...leveragePoints, newPoint]);
    setTitle('');
    setDesc('');
    setWhyLeverage('');
    setResistance('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onChange(leveragePoints.filter(p => p.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">4. Systemic Leverage Points</span>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
              DONELLA MEADOWS FRAMEWORK
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Identify places in a complex system where a relatively small shift in information flow, operational rules, or goals produces profound systemic change.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#ff5a00]" />
            <span>Add Leverage Point</span>
          </button>

          <button
            onClick={onNextStep}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Solution Alternatives</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#0e1626] rounded-xl border border-[#ff5a00]/40 p-5 flex flex-col gap-4 shadow-xl">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#ff5a00]" />
            <span>Add High-Leverage Intervention</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Intervention Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Real-Time Room Booking Telemetry"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Meadows Hierarchy Level</label>
              <select
                value={level}
                onChange={(e) => setLevel(parseInt(e.target.value))}
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              >
                {MEADOWS_LEVELS.map(m => (
                  <option key={m.level} value={m.level}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Targeted System Factor</label>
              <select
                value={factorId}
                onChange={(e) => setFactorId(e.target.value)}
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              >
                {factors.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Intervention Mechanism Description</label>
            <textarea
              rows={2}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="What specifically changes in the system?"
              className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">Why It Has High Leverage (Causal Chain)</label>
              <textarea
                rows={3}
                value={whyLeverage}
                onChange={(e) => setWhyLeverage(e.target.value)}
                placeholder="Why does this small intervention unlock huge systemic returns?"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">Potential Systemic Resistance & Pushback</label>
              <textarea
                rows={3}
                value={resistance}
                onChange={(e) => setResistance(e.target.value)}
                placeholder="Where will friction, union resistance, or organizational inertia arise?"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs text-slate-400 bg-slate-800 rounded">Cancel</button>
            <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-white bg-[#ff5a00] rounded">Save Leverage Point</button>
          </div>
        </form>
      )}

      {/* Leverage Points Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {leveragePoints.map((point) => {
          const linkedFactor = factors.find(f => f.id === point.factorId);

          return (
            <div
              key={point.id}
              className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col justify-between gap-4 shadow-xl hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-950/80 text-amber-400 border border-amber-800 inline-block mb-1.5">
                      {point.levelName}
                    </span>
                    <h4 className="text-base font-bold text-white">{point.interventionTitle}</h4>
                  </div>

                  <button
                    onClick={() => handleDelete(point.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-[#090f1a] p-3 rounded-lg border border-slate-800">
                  {point.description}
                </p>

                {/* Why It Has Leverage */}
                <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-800/40 flex flex-col gap-1">
                  <div className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Why This Point Has Outsized Leverage:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {point.whyItHasLeverage}
                  </p>
                </div>

                {/* Resistance */}
                <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-800/40 flex flex-col gap-1">
                  <div className="text-[11px] font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Potential Systemic Resistance:</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">
                    {point.potentialResistance}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
                <span>Target: {linkedFactor?.name || 'Whole System'}</span>
                <span className="text-[#ff5a00] font-semibold uppercase">{point.impactScore} IMPACT</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
