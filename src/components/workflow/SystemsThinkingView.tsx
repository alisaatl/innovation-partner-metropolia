import React, { useState, useMemo } from 'react';
import { 
  GitBranch, 
  Plus, 
  Trash2, 
  RotateCw, 
  Scale, 
  ArrowRight, 
  Info, 
  Layers, 
  TrendingUp, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { SystemFactor, CausalRelationship, FeedbackLoop } from '../../types/innovation';

interface SystemsThinkingViewProps {
  factors: SystemFactor[];
  relationships: CausalRelationship[];
  feedbackLoops: FeedbackLoop[];
  onUpdateFactors: (updated: SystemFactor[]) => void;
  onUpdateRelationships: (updated: CausalRelationship[]) => void;
  onUpdateFeedbackLoops: (updated: FeedbackLoop[]) => void;
  onNextStep: () => void;
}

export const SystemsThinkingView: React.FC<SystemsThinkingViewProps> = ({
  factors,
  relationships,
  feedbackLoops,
  onUpdateFactors,
  onUpdateRelationships,
  onUpdateFeedbackLoops,
  onNextStep
}) => {
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);

  // Modal / Drawer state for adding factor
  const [isAddingFactor, setIsAddingFactor] = useState(false);
  const [newFactorName, setNewFactorName] = useState('');
  const [newFactorCategory, setNewFactorCategory] = useState<SystemFactor['category']>('operational');
  const [newFactorDesc, setNewFactorDesc] = useState('');

  // Modal / Drawer state for adding relationship
  const [isAddingRel, setIsAddingRel] = useState(false);
  const [sourceId, setSourceId] = useState<string>(factors[0]?.id || '');
  const [targetId, setTargetId] = useState<string>(factors[1]?.id || '');
  const [relPolarity, setRelPolarity] = useState<'+' | '-'>('+');
  const [relDescription, setRelDescription] = useState('');
  const [hasDelay, setHasDelay] = useState(false);

  // New feedback loop state
  const [isAddingLoop, setIsAddingLoop] = useState(false);
  const [newLoopName, setNewLoopName] = useState('');
  const [newLoopType, setNewLoopType] = useState<'reinforcing' | 'balancing'>('reinforcing');
  const [newLoopExplanation, setNewLoopExplanation] = useState('');
  const [newLoopImpact, setNewLoopImpact] = useState('');

  // Add Factor handler
  const handleAddFactor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFactorName.trim()) return;

    const newFactor: SystemFactor = {
      id: 'f_' + Date.now(),
      name: newFactorName.trim(),
      category: newFactorCategory,
      description: newFactorDesc.trim() || 'Key systemic variable.',
      x: 200 + Math.random() * 300,
      y: 100 + Math.random() * 200
    };

    onUpdateFactors([...factors, newFactor]);
    setNewFactorName('');
    setNewFactorDesc('');
    setIsAddingFactor(false);
  };

  // Delete Factor
  const handleDeleteFactor = (id: string) => {
    onUpdateFactors(factors.filter(f => f.id !== id));
    // also remove connected relationships
    onUpdateRelationships(relationships.filter(r => r.sourceId !== id && r.targetId !== id));
    if (selectedFactorId === id) setSelectedFactorId(null);
  };

  // Add Relationship
  const handleAddRelationship = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !targetId || sourceId === targetId) return;

    const newRel: CausalRelationship = {
      id: 'rel_' + Date.now(),
      sourceId,
      targetId,
      polarity: relPolarity,
      description: relDescription.trim() || `As ${sourceId} changes, ${targetId} changes ${relPolarity === '+' ? 'in the same direction' : 'in the opposite direction'}.`,
      delay: hasDelay
    };

    onUpdateRelationships([...relationships, newRel]);
    setRelDescription('');
    setIsAddingRel(false);
  };

  // Delete Relationship
  const handleDeleteRelationship = (id: string) => {
    onUpdateRelationships(relationships.filter(r => r.id !== id));
  };

  // Add Loop
  const handleAddLoop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoopName.trim()) return;

    const code = (newLoopType === 'reinforcing' ? 'R' : 'B') + (feedbackLoops.length + 1);
    const newLoop: FeedbackLoop = {
      id: 'loop_' + Date.now(),
      code,
      name: newLoopName.trim(),
      type: newLoopType,
      factorIds: factors.slice(0, 3).map(f => f.id),
      explanation: newLoopExplanation.trim() || 'Dynamic feedback loop regulating systemic behavior.',
      systemImpact: newLoopImpact.trim() || 'Guides high-leverage interventions.'
    };

    onUpdateFeedbackLoops([...feedbackLoops, newLoop]);
    setNewLoopName('');
    setNewLoopExplanation('');
    setNewLoopImpact('');
    setIsAddingLoop(false);
  };

  const handleDeleteLoop = (id: string) => {
    onUpdateFeedbackLoops(feedbackLoops.filter(l => l.id !== id));
    if (selectedLoopId === id) setSelectedLoopId(null);
  };

  // Highlight helper: which factors/relationships are connected
  const connectedRelIds = useMemo(() => {
    if (!selectedFactorId) return new Set<string>();
    return new Set(
      relationships
        .filter(r => r.sourceId === selectedFactorId || r.targetId === selectedFactorId)
        .map(r => r.id)
    );
  }, [selectedFactorId, relationships]);

  const activeLoop = feedbackLoops.find(l => l.id === selectedLoopId);

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">3. Systems Thinking & Feedback Loops</span>
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800 px-2 py-0.5 rounded">
              {factors.length} FACTORS · {relationships.length} CAUSAL LINKS · {feedbackLoops.length} LOOPS
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Map systemic variables and their causal directions. Identify Reinforcing (amplifying) and Balancing (stabilizing) feedback loops that drive overall campus behavior.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddingFactor(true)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-sky-400" />
            <span>+ Factor</span>
          </button>

          <button
            onClick={() => setIsAddingRel(true)}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-[#ff5a00]" />
            <span>+ Causal Link</span>
          </button>

          <button
            onClick={onNextStep}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Leverage Points</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Add Factor Drawer */}
      {isAddingFactor && (
        <form onSubmit={handleAddFactor} className="bg-[#0e1626] rounded-xl border border-sky-500/40 p-4 flex flex-col gap-3 shadow-lg">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider text-sky-400">Add System Variable / Factor</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Factor Name</label>
              <input
                type="text"
                required
                value={newFactorName}
                onChange={(e) => setNewFactorName(e.target.value)}
                placeholder="e.g. Indoor Air Particulates"
                className="w-full bg-[#090f1a] border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Domain Category</label>
              <select
                value={newFactorCategory}
                onChange={(e) => setNewFactorCategory(e.target.value as any)}
                className="w-full bg-[#090f1a] border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              >
                <option value="operational">Operational</option>
                <option value="technical">Technical</option>
                <option value="human">Human / Behavioral</option>
                <option value="economic">Economic</option>
                <option value="environmental">Environmental</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-300 block mb-1">Description</label>
              <input
                type="text"
                value={newFactorDesc}
                onChange={(e) => setNewFactorDesc(e.target.value)}
                placeholder="How this variable functions in the system..."
                className="w-full bg-[#090f1a] border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setIsAddingFactor(false)} className="px-3 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded">Cancel</button>
            <button type="submit" className="px-3.5 py-1 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded">Save Factor</button>
          </div>
        </form>
      )}

      {/* Add Causal Relationship Drawer */}
      {isAddingRel && (
        <form onSubmit={handleAddRelationship} className="bg-[#0e1626] rounded-xl border border-[#ff5a00]/40 p-4 flex flex-col gap-3 shadow-lg">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider text-[#ff5a00]">Add Causal Relationship</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-xs text-slate-300 block mb-1">Source Variable (Cause)</label>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full bg-[#090f1a] border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              >
                {factors.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Target Variable (Effect)</label>
              <select
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
                className="w-full bg-[#090f1a] border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              >
                {factors.map(f => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">Polarity</label>
              <select
                value={relPolarity}
                onChange={(e) => setRelPolarity(e.target.value as '+' | '-')}
                className="w-full bg-[#090f1a] border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              >
                <option value="+">(+) Positive / Same Direction</option>
                <option value="-">(-) Negative / Opposite Direction</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="delayCheck"
                checked={hasDelay}
                onChange={(e) => setHasDelay(e.target.checked)}
                className="accent-[#ff5a00]"
              />
              <label htmlFor="delayCheck" className="text-xs text-slate-300 cursor-pointer">
                Time Delay in Effect
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">Causal Explanation</label>
            <input
              type="text"
              value={relDescription}
              onChange={(e) => setRelDescription(e.target.value)}
              placeholder="e.g. As autonomous cleaning increases, physical night-shift strain decreases."
              className="w-full bg-[#090f1a] border border-slate-700 rounded p-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={() => setIsAddingRel(false)} className="px-3 py-1 text-xs text-slate-400 hover:text-white bg-slate-800 rounded">Cancel</button>
            <button type="submit" className="px-3.5 py-1 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded">Add Link</button>
          </div>
        </form>
      )}

      {/* Main Visual Causal Loop Diagram Canvas */}
      <div className="relative bg-[#080d15] rounded-xl border border-slate-800 p-4 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="font-semibold text-white flex items-center gap-1.5">
              <GitBranch className="w-3.5 h-3.5 text-[#ff5a00]" />
              <span>Causal Loop Diagram (CLD)</span>
            </span>
            <span>·</span>
            <span>Click any factor node to highlight causal pathways</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="flex items-center gap-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>(+) Same Direction</span>
            </span>
            <span className="flex items-center gap-1 text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              <span>(-) Opposite Direction</span>
            </span>
          </div>
        </div>

        {/* SVG Diagram Viewport */}
        <svg
          viewBox="0 0 840 520"
          className="w-full h-auto max-h-[560px] floorplan-grid select-none rounded-lg"
        >
          <defs>
            <marker
              id="arrowhead-plus"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#10b981" />
            </marker>

            <marker
              id="arrowhead-minus"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#f43f5e" />
            </marker>

            <marker
              id="arrowhead-dim"
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#475569" />
            </marker>
          </defs>

          {/* Causal Directed Arrows */}
          {relationships.map((rel) => {
            const src = factors.find(f => f.id === rel.sourceId);
            const tgt = factors.find(f => f.id === rel.targetId);
            if (!src || !tgt) return null;

            const isHighlighted = selectedFactorId
              ? rel.sourceId === selectedFactorId || rel.targetId === selectedFactorId
              : true;

            const isLoopHighlighted = activeLoop
              ? activeLoop.factorIds.includes(rel.sourceId) && activeLoop.factorIds.includes(rel.targetId)
              : false;

            // Compute curved path with offset
            const dx = tgt.x - src.x;
            const dy = tgt.y - src.y;
            const dist = Math.hypot(dx, dy) || 1;
            const mx = (src.x + tgt.x) / 2 - (dy / dist) * 28;
            const my = (src.y + tgt.y) / 2 + (dx / dist) * 28;

            const strokeColor = !isHighlighted
              ? '#334155'
              : rel.polarity === '+'
              ? '#10b981'
              : '#f43f5e';

            const strokeWidth = isLoopHighlighted ? 3 : isHighlighted ? 2 : 1;
            const opacity = isHighlighted ? (isLoopHighlighted ? 1 : 0.85) : 0.25;

            return (
              <g key={rel.id} className="transition-opacity">
                {/* Curve path */}
                <path
                  d={`M ${src.x} ${src.y} Q ${mx} ${my} ${tgt.x} ${tgt.y}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={rel.delay ? '5,4' : undefined}
                  opacity={opacity}
                  markerEnd={
                    !isHighlighted
                      ? 'url(#arrowhead-dim)'
                      : rel.polarity === '+'
                      ? 'url(#arrowhead-plus)'
                      : 'url(#arrowhead-minus)'
                  }
                />

                {/* Polarity Badge on midpoint */}
                <g transform={`translate(${mx}, ${my})`}>
                  <circle
                    r={9}
                    className={`${
                      rel.polarity === '+'
                        ? 'fill-emerald-950 stroke-emerald-500'
                        : 'fill-rose-950 stroke-rose-500'
                    } stroke-1`}
                  />
                  <text
                    y={3.5}
                    textAnchor="middle"
                    className={`text-[11px] font-mono font-bold ${
                      rel.polarity === '+' ? 'fill-emerald-400' : 'fill-rose-400'
                    }`}
                  >
                    {rel.polarity}
                  </text>
                  {rel.delay && (
                    <text x={11} y={3} className="text-[9px] fill-amber-400 font-mono">
                      ||
                    </text>
                  )}
                </g>
              </g>
            );
          })}

          {/* Factor Nodes */}
          {factors.map((factor) => {
            const isSelected = selectedFactorId === factor.id;
            const isInActiveLoop = activeLoop ? activeLoop.factorIds.includes(factor.id) : false;

            const getCategoryColor = (cat: SystemFactor['category']) => {
              switch (cat) {
                case 'operational': return 'stroke-sky-500 fill-sky-950/80 text-sky-300';
                case 'technical': return 'stroke-cyan-500 fill-cyan-950/80 text-cyan-300';
                case 'human': return 'stroke-amber-500 fill-amber-950/80 text-amber-300';
                case 'economic': return 'stroke-emerald-500 fill-emerald-950/80 text-emerald-300';
                case 'environmental': return 'stroke-teal-500 fill-teal-950/80 text-teal-300';
                default: return 'stroke-slate-600 fill-slate-900 text-slate-300';
              }
            };

            const catClass = getCategoryColor(factor.category);

            return (
              <g
                key={factor.id}
                transform={`translate(${factor.x}, ${factor.y})`}
                onClick={() => setSelectedFactorId(isSelected ? null : factor.id)}
                className="cursor-pointer group select-none"
              >
                {/* Node Pill Card */}
                <rect
                  x={-75}
                  y={-22}
                  width={150}
                  height={44}
                  rx={8}
                  className={`${catClass} transition-all ${
                    isSelected
                      ? 'stroke-2 ring-2 ring-[#ff5a00] filter drop-shadow-[0_0_8px_rgba(255,90,0,0.5)]'
                      : isInActiveLoop
                      ? 'stroke-2 ring-2 ring-amber-400 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]'
                      : 'stroke-1 hover:stroke-white'
                  }`}
                />

                {/* Factor Name */}
                <text
                  textAnchor="middle"
                  y={-4}
                  className="text-[10px] font-bold fill-white pointer-events-none"
                >
                  {factor.name.length > 22 ? factor.name.substring(0, 20) + '...' : factor.name}
                </text>

                {/* Category label */}
                <text
                  textAnchor="middle"
                  y={12}
                  className="text-[8px] font-mono uppercase tracking-wider fill-slate-400 pointer-events-none"
                >
                  {factor.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Feedback Loops Grid & Explanations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Identified Loops List (2 cols) */}
        <div className="lg:col-span-2 bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <RotateCw className="w-4 h-4 text-[#ff5a00]" />
              <span>Identified System Feedback Loops</span>
            </h3>
            <button
              onClick={() => setIsAddingLoop(!isAddingLoop)}
              className="text-xs text-[#ff5a00] hover:text-[#ff7426] font-medium"
            >
              + Define Custom Loop
            </button>
          </div>

          {/* Add Loop Inline */}
          {isAddingLoop && (
            <form onSubmit={handleAddLoop} className="bg-[#090f1a] p-3 rounded-lg border border-[#ff5a00]/40 flex flex-col gap-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  required
                  placeholder="Loop Name (e.g. Winter Slush Counteraction)"
                  value={newLoopName}
                  onChange={(e) => setNewLoopName(e.target.value)}
                  className="bg-[#0e1626] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                />
                <select
                  value={newLoopType}
                  onChange={(e) => setNewLoopType(e.target.value as any)}
                  className="bg-[#0e1626] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
                >
                  <option value="reinforcing">Reinforcing (R) - Amplifying</option>
                  <option value="balancing">Balancing (B) - Stabilizing</option>
                </select>
              </div>
              <input
                type="text"
                placeholder="Dynamic explanation..."
                value={newLoopExplanation}
                onChange={(e) => setNewLoopExplanation(e.target.value)}
                className="bg-[#0e1626] border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button type="button" onClick={() => setIsAddingLoop(false)} className="px-2.5 py-1 text-xs text-slate-400 bg-slate-800 rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 text-xs font-semibold text-white bg-[#ff5a00] rounded">Save Loop</button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-3">
            {feedbackLoops.map((loop) => {
              const isSelected = selectedLoopId === loop.id;
              const isReinforcing = loop.type === 'reinforcing';

              return (
                <div
                  key={loop.id}
                  onClick={() => setSelectedLoopId(isSelected ? null : loop.id)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800/80 border-[#ff5a00]'
                      : 'bg-[#090f1a] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-xs font-mono font-bold rounded ${
                        isReinforcing
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {loop.code} {isReinforcing ? 'REINFORCING' : 'BALANCING'}
                      </span>
                      <h4 className="text-xs font-bold text-white">{loop.name}</h4>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLoop(loop.id);
                      }}
                      className="text-slate-500 hover:text-rose-400 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-2">
                    {loop.explanation}
                  </p>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1.5">
                    <span className="text-[#ff5a00]">System Impact:</span>
                    <span>{loop.systemImpact}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Causal Relationship Table / Inspector (1 col) */}
        <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-sky-400" />
              <span>Causal Link Directory</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">{relationships.length} links</span>
          </div>

          <div className="flex flex-col gap-2 max-h-[460px] overflow-y-auto pr-1">
            {relationships.map((rel) => {
              const src = factors.find(f => f.id === rel.sourceId);
              const tgt = factors.find(f => f.id === rel.targetId);
              if (!src || !tgt) return null;

              return (
                <div
                  key={rel.id}
                  className="bg-[#090f1a] p-2.5 rounded-lg border border-slate-800/80 text-xs flex flex-col gap-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <span className="text-sky-300">{src.name}</span>
                      <span className={`px-1 py-0.2 rounded text-[10px] font-mono ${
                        rel.polarity === '+' ? 'text-emerald-400 bg-emerald-950' : 'text-rose-400 bg-rose-950'
                      }`}>
                        {rel.polarity}
                      </span>
                      <span className="text-sky-300">→ {tgt.name}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteRelationship(rel.id)}
                      className="text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug">
                    {rel.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
