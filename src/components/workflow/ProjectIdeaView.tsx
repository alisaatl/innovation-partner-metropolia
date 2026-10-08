import React, { useState } from 'react';
import { 
  Lightbulb, 
  Target, 
  Users, 
  Building2, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  ArrowRight,
  Info,
  Calendar,
  Layers
} from 'lucide-react';
import { ProjectIdea } from '../../types/innovation';
import { DEMO_PROJECT_IDEA } from '../../data/demoInnovationData';

interface ProjectIdeaViewProps {
  projectIdea: ProjectIdea;
  onChange: (updated: ProjectIdea) => void;
  onResetDemo: () => void;
  onNextStep: () => void;
}

export const ProjectIdeaView: React.FC<ProjectIdeaViewProps> = ({
  projectIdea,
  onChange,
  onResetDemo,
  onNextStep
}) => {
  const [newGoalText, setNewGoalText] = useState('');
  const [saveBanner, setSaveBanner] = useState(false);

  const handleFieldChange = (field: keyof ProjectIdea, value: any) => {
    onChange({
      ...projectIdea,
      [field]: value,
      isDemoData: false
    });
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2000);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    handleFieldChange('strategicGoals', [...projectIdea.strategicGoals, newGoalText.trim()]);
    setNewGoalText('');
  };

  const handleRemoveGoal = (index: number) => {
    handleFieldChange(
      'strategicGoals',
      projectIdea.strategicGoals.filter((_, i) => i !== index)
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header & Meta Card */}
      <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-white">1. Project Idea & Strategic Framing</span>
            {projectIdea.isDemoData && (
              <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                DEMO CASE: CleanBot Metropolia
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Define the problem, proposed innovation, goals, constraints, and beneficiaries. This serves as the foundation for stakeholder mapping, systems thinking, and AHP evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onResetDemo}
            className="px-3.5 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-1.5"
            title="Reset to CleanBot Metropolia pre-filled demo data"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Reset Demo Case</span>
          </button>

          <button
            onClick={onNextStep}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#ff5a00] hover:bg-[#ff6c1a] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Stakeholder Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Editing Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Core Idea & Problem */}
        <div className="lg:col-span-2 flex flex-col gap-5 bg-[#0e1626] rounded-xl border border-slate-800 p-5">
          {/* Project Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Project Title / Innovation Name
            </label>
            <input
              type="text"
              value={projectIdea.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              placeholder="e.g. CleanBot Metropolia: Autonomous Off-Hours Campus Cleaning"
              className="w-full bg-[#090f1a] border border-slate-700 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          {/* Problem Statement */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Problem Statement (The Unmet Need)
              </label>
              <span className="text-[11px] text-slate-500">Root friction & real-world pain points</span>
            </div>
            <textarea
              rows={4}
              value={projectIdea.problemStatement}
              onChange={(e) => handleFieldChange('problemStatement', e.target.value)}
              placeholder="Describe the challenge, who experiences it, and why existing solutions are inadequate..."
              className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          {/* Proposed Innovation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Proposed Innovation (Your Intervention)
              </label>
              <span className="text-[11px] text-slate-500">Novel mechanism, tech, or business model</span>
            </div>
            <textarea
              rows={4}
              value={projectIdea.proposedInnovation}
              onChange={(e) => handleFieldChange('proposedInnovation', e.target.value)}
              placeholder="Explain how the proposed innovation solves the problem systematically..."
              className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-3 text-xs text-slate-200 leading-relaxed focus:outline-none focus:border-[#ff5a00]"
            />
          </div>

          {/* Strategic Goals List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#ff5a00]" />
                <span>Strategic Goals & Success Indicators</span>
              </label>
              <span className="text-[11px] text-slate-500">{projectIdea.strategicGoals.length} defined</span>
            </div>

            <div className="flex flex-col gap-2 mb-3">
              {projectIdea.strategicGoals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-2 p-2.5 bg-[#090f1a] rounded-lg border border-slate-800 text-xs"
                >
                  <span className="text-slate-200 leading-normal">
                    <strong className="text-[#ff5a00] font-mono mr-1.5">{index + 1}.</strong>
                    {goal}
                  </span>
                  <button
                    onClick={() => handleRemoveGoal(index)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors shrink-0"
                    title="Remove goal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Goal form */}
            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                type="text"
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                placeholder="Add a new measurable strategic goal..."
                className="flex-1 bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ff5a00]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Goal</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Context, Institutional Environment & Summary */}
        <div className="flex flex-col gap-5">
          {/* Institutional Context */}
          <div className="bg-[#0e1626] rounded-xl border border-slate-800 p-5 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-sky-400" />
              <span>Institutional Context</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Host University / Institution
              </label>
              <input
                type="text"
                value={projectIdea.institution}
                onChange={(e) => handleFieldChange('institution', e.target.value)}
                placeholder="e.g. Metropolia University of Applied Sciences"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Student Project Team / Authors
              </label>
              <input
                type="text"
                value={projectIdea.authorTeam}
                onChange={(e) => handleFieldChange('authorTeam', e.target.value)}
                placeholder="e.g. Robotics & Smart Facility Project Team"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Target Beneficiaries
              </label>
              <textarea
                rows={3}
                value={projectIdea.targetBeneficiaries}
                onChange={(e) => handleFieldChange('targetBeneficiaries', e.target.value)}
                placeholder="Who gains the most from this innovation?"
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#ff5a00]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Context & Critical Constraints
              </label>
              <textarea
                rows={3}
                value={projectIdea.contextAndConstraints}
                onChange={(e) => handleFieldChange('contextAndConstraints', e.target.value)}
                placeholder="Operating environment, legal constraints, safety rules..."
                className="w-full bg-[#090f1a] border border-slate-700 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-[#ff5a00]"
              />
            </div>
          </div>

          {/* Quick Guidance Box */}
          <div className="bg-[#090f1a] rounded-xl border border-slate-800 p-4 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Info className="w-4 h-4 text-[#ff5a00]" />
              <span>Systems Innovation Tip</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              In university innovation projects, framing the problem not merely as a technical lack (e.g. "we need a robot") but as a systemic friction (e.g. "night-shift staff burnout vs. 08:00 AM classroom cleanliness") ensures your solution directly drives human, economic, and institutional change.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
