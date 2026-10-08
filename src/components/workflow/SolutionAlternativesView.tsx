import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Check, 
  AlertTriangle, 
  Clock, 
  Coins, 
  Layers,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { SolutionAlternative } from '../../types/innovation';

interface SolutionAlternativesViewProps {
  alternatives: SolutionAlternative[];
  onChange: (updated: SolutionAlternative[]) => void;
  onNextStep: () => void;
}

export const SolutionAlternativesView: React.FC<SolutionAlternativesViewProps> = ({
  alternatives,
  onChange,
  onNextStep
}) => {
  const [isAdding, setIsAdding] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [desc, setDesc] = useState('');
  const [cost, setCost] = useState('');
  const [deployTime, setDeployTime] = useState('');
  const [strengthText, setStrengthText] = useState('');
  const [riskText, setRiskText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newCode = `ALT-${alternatives.length + 1}`;
    const strengths = strengthText.split('\n').filter(s => s.trim().length > 0);
    const risks = riskText.split('\n').filter(r => r.trim().length > 0);

    const newAlt: SolutionAlternative = {
      id: 'alt_' + Date.now(),
      code: newCode,
      title: title.trim(),
      tagline: tagline.trim() || 'Alternative innovation concept',
      description: desc.trim(),
      keyStrengths: strengths.length > 0 ? strengths : ['Flexible implementation path.'],
      keyRisks: risks.length > 0 ? risks : ['Requires stakeholder alignment.'],
      estimatedCost: cost.trim() || 'TBD [Simulated Data]',
      timeToDeploy: deployTime.trim() || '2–3 months'
    };

    onChange([...alternatives, newAlt]);
    setTitle('');
    setTagline('');
    setDesc('');
    setCost('');
    setDeployTime('');
    setStrengthText('');
    setRiskText('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    if (alternatives.length <= 2) {
      alert('AHP Decision Analysis requires at least 2 alternative solutions to compare.');
      return;
    }
    onChange(alternatives.filter(a => a.id !== id));
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">5. Solution Alternatives & Concepts</span>
            <span className="text-xs font-mono text-purple-400 bg-purple-950/60 border border-purple-800 px-2 py-0.5 rounded">
              {alternatives.length} CONCEPTS DEVELOPED
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Formulate distinct candidate solutions to address the system challenge. These will be rigorously evaluated against multiple criteria in the Analytic Hierarchy Process (AHP).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#ff5a00]" />
            <span>Add Alternative Concept</span>
          </button>

          <button
            onClick={onNextStep}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>AHP Decision Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add Alternative Drawer */}
      {isAdding && (
        <form onSubmit={handleAdd} className="bg-[#0e1626] rounded-xl border border-[#ff5a00]/40 p-5 flex flex-col gap-4 shadow-xl">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#ff5a00]" />
            <span>Formulate New Solution Concept</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Concept Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CleanBot Mark IV Autonomous Fleet"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">One-Line Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Multi-task robotic vacuum & mop with hands-free docking"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Concept Architecture & Description</label>
            <textarea
              rows={3}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="How does this solution technically or organizationally function?"
              className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-emerald-400 mb-1">Key Strengths (one per line)</label>
              <textarea
                rows={3}
                value={strengthText}
                onChange={(e) => setStrengthText(e.target.value)}
                placeholder="100% elimination of night shifts&#10;Conserves 85% water"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-rose-400 mb-1">Key Risks & Limitations (one per line)</label>
              <textarea
                rows={3}
                value={riskText}
                onChange={(e) => setRiskText(e.target.value)}
                placeholder="High initial CapEx&#10;Requires Wi-Fi 6 coverage"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Cost / Economics</label>
              <input
                type="text"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                placeholder="e.g. €42,000 CapEx [Simulated Data]"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Time to Deploy</label>
              <input
                type="text"
                value={deployTime}
                onChange={(e) => setDeployTime(e.target.value)}
                placeholder="e.g. 3–4 months"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
            <button type="button" onClick={() => setIsAdding(false)} className="px-3 py-1.5 text-xs text-slate-400 bg-slate-800 rounded">Cancel</button>
            <button type="submit" className="px-4 py-1.5 text-xs font-semibold text-white bg-[#ff5a00] rounded">Save Alternative</button>
          </div>
        </form>
      )}

      {/* Alternatives Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {alternatives.map((alt, idx) => (
          <div
            key={alt.id}
            className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col justify-between gap-5 shadow-xl hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-[#ff5a00] bg-orange-950/60 border border-orange-800/80 px-2 py-0.5 rounded">
                    {alt.code}
                  </span>
                  <h4 className="text-base font-bold text-white mt-1.5">{alt.title}</h4>
                </div>

                <button
                  onClick={() => handleDelete(alt.id)}
                  className="text-slate-500 hover:text-rose-400 p-1"
                  title="Delete concept"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <p className="text-xs text-slate-400 italic">
                "{alt.tagline}"
              </p>

              <p className="text-xs text-slate-300 leading-relaxed bg-[#090f1a] p-3 rounded-lg border border-slate-800/80">
                {alt.description}
              </p>

              {/* Strengths */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Key Strengths</span>
                </span>
                <ul className="text-xs text-slate-300 flex flex-col gap-1 pl-1">
                  {alt.keyStrengths.map((str, sIdx) => (
                    <li key={sIdx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">·</span>
                      <span className="text-[11px] leading-relaxed">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Risks */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Key Risks & Challenges</span>
                </span>
                <ul className="text-xs text-slate-300 flex flex-col gap-1 pl-1">
                  {alt.keyRisks.map((risk, rIdx) => (
                    <li key={rIdx} className="flex items-start gap-1.5">
                      <span className="text-rose-400 font-bold">·</span>
                      <span className="text-[11px] leading-relaxed">{risk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Meta */}
            <div className="pt-3 border-t border-slate-800 text-xs flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cost Profile:</span>
                </span>
                <span className="text-slate-200 font-semibold">{alt.estimatedCost}</span>
              </div>

              <div className="flex items-center justify-between font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-sky-400" />
                  <span>Deployment:</span>
                </span>
                <span className="text-slate-200">{alt.timeToDeploy}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
