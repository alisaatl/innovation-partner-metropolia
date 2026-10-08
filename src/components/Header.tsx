import React from 'react';
import { 
  Volume2, 
  VolumeX, 
  Bot, 
  FileText, 
  RotateCcw,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { InnovationWorkflowStep } from '../types/innovation';
import { sound } from '../utils/audio';

interface HeaderProps {
  activeStep: InnovationWorkflowStep;
  setActiveStep: (step: InnovationWorkflowStep) => void;
  onResetDemo: () => void;
  isDemoActive: boolean;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeStep,
  setActiveStep,
  onResetDemo,
  isDemoActive,
  soundEnabled,
  setSoundEnabled
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    if (next) sound.playChime();
  };

  const steps: { id: InnovationWorkflowStep; num: string; label: string }[] = [
    { id: 'project_idea', num: '1', label: 'Idea' },
    { id: 'stakeholders', num: '2', label: 'Stakeholders' },
    { id: 'systems_thinking', num: '3', label: 'Systems' },
    { id: 'leverage_points', num: '4', label: 'Leverage' },
    { id: 'alternatives', num: '5', label: 'Solutions' },
    { id: 'ahp_analysis', num: '6', label: 'AHP Decision' },
    { id: 'report', num: '7', label: 'Report' }
  ];

  return (
    <header className="flex items-center justify-between px-6 py-3.5 bg-[#0b1019] border-b border-slate-800/90 sticky top-0 z-50">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); setActiveStep('project_idea'); }}
          className="text-base font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#ff5a00] inline-block"></span>
          <span>Innovation Partner</span>
        </a>
        <span className="hidden xl:inline-block text-xs text-slate-500 border-l border-slate-800 pl-3">
          Metropolia University Framework
        </span>
      </div>

      {/* Zone 2: 7 clean text workflow links with subtle active highlight — permanently visible */}
      <nav className="flex items-center gap-1 sm:gap-1.5 xl:gap-2.5 text-xs font-medium overflow-x-auto py-1 max-w-full">
        {steps.map((step) => {
          const isActive = activeStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(step.id);
                sound.playChime();
              }}
              className={`px-2 sm:px-2.5 py-1 rounded-md transition-colors whitespace-nowrap flex items-center gap-1 sm:gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-slate-800 text-[#ff5a00] font-semibold border border-slate-700 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-mono shrink-0 ${
                isActive ? 'bg-[#ff5a00] text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {step.num}
              </span>
              <span>{step.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary actions (CleanBot Demo Sim, Reset, Audio) */}
      <div className="flex items-center gap-2.5">
        {/* Toggle to view CleanBot Live Simulator Demo Case */}
        <button
          onClick={() => {
            setActiveStep(activeStep === 'cleanbot_demo_sim' ? 'project_idea' : 'cleanbot_demo_sim');
            sound.playChime();
          }}
          className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 border whitespace-nowrap ${
            activeStep === 'cleanbot_demo_sim'
              ? 'bg-[#ff5a00] text-white border-[#ff5a00] shadow-sm shadow-[#ff5a00]/30'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700/80 hover:text-white'
          }`}
          title="Inspect the CleanBot Metropolia Autonomous Campus Floorplan Simulation"
        >
          <Bot className="w-3.5 h-3.5 text-[#ff5a00]" />
          <span>{activeStep === 'cleanbot_demo_sim' ? 'Back to Workflow' : 'CleanBot Demo Case'}</span>
        </button>

        <button
          onClick={onResetDemo}
          title="Reset all modules to pre-filled CleanBot Metropolia demo data"
          className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-md transition-colors"
          aria-label="Reset Demo Data"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={toggleSound}
          title={soundEnabled ? 'Mute operational audio' : 'Enable operational audio'}
          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/60 rounded-md transition-colors"
          aria-label={soundEnabled ? 'Mute sound' : 'Unmute sound'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>
    </header>
  );
};
