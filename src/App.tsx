/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { ProjectIdeaView } from './components/workflow/ProjectIdeaView';
import { StakeholderAnalysisView } from './components/workflow/StakeholderAnalysisView';
import { SystemsThinkingView } from './components/workflow/SystemsThinkingView';
import { LeveragePointsView } from './components/workflow/LeveragePointsView';
import { SolutionAlternativesView } from './components/workflow/SolutionAlternativesView';
import { AHPDecisionView } from './components/workflow/AHPDecisionView';
import { InnovationReportView } from './components/workflow/InnovationReportView';

// CleanBot Demo Case Simulation Components
import { CampusLiveMap } from './components/CampusLiveMap';
import { RobotTelemetryPanel } from './components/RobotTelemetryPanel';
import { OffHoursSchedule } from './components/OffHoursSchedule';
import { TeleoperationCockpit } from './components/TeleoperationCockpit';
import { QuickDispatchModal } from './components/QuickDispatchModal';

import { 
  ProjectIdea, 
  Stakeholder, 
  SystemFactor, 
  CausalRelationship, 
  FeedbackLoop, 
  LeveragePoint, 
  SolutionAlternative, 
  AHPCriterion,
  InnovationWorkflowStep,
  AHPAnalysisResult
} from './types/innovation';

import {
  DEMO_PROJECT_IDEA,
  DEMO_STAKEHOLDERS,
  DEMO_SYSTEM_FACTORS,
  DEMO_CAUSAL_RELATIONSHIPS,
  DEMO_FEEDBACK_LOOPS,
  DEMO_LEVERAGE_POINTS,
  DEMO_ALTERNATIVES,
  DEMO_CRITERIA,
  DEMO_CRITERIA_PAIRWISE,
  DEMO_ALT_PAIRWISE
} from './data/demoInnovationData';

import { CAMPUS_DATA, INITIAL_TELEMETRY, INITIAL_LOGS } from './data/campuses';
import { RobotTelemetry, OperationalLog, CampusId, Room, TrashItem, SpillItem } from './types/cleanbot';
import { calculateFullAHP } from './utils/ahpCalculator';
import { sound } from './utils/audio';

// Helper utilities for persistent localStorage storage
function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore quota errors
  }
}

export default function App() {
  // Workflow Navigation with reload/refresh persistence
  const [activeStep, setActiveStep] = useState<InnovationWorkflowStep>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('innovation_active_step') as InnovationWorkflowStep;
        if (saved && [
          'project_idea',
          'stakeholders',
          'systems_thinking',
          'leverage_points',
          'alternatives',
          'ahp_analysis',
          'report',
          'cleanbot_demo_sim'
        ].includes(saved)) {
          return saved;
        }
      } catch {
        // fallback to default
      }
    }
    return 'project_idea';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('innovation_active_step', activeStep);
      } catch {
        // ignore storage quota errors
      }
    }
  }, [activeStep]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // 1. Project Idea State with persistence
  const [projectIdea, setProjectIdea] = useState<ProjectIdea>(() =>
    loadFromStorage('innovation_project_idea', DEMO_PROJECT_IDEA)
  );

  // 2. Stakeholders State with persistence
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(() =>
    loadFromStorage('innovation_stakeholders', DEMO_STAKEHOLDERS)
  );

  // 3. Systems Thinking & Loops State with persistence
  const [factors, setFactors] = useState<SystemFactor[]>(() =>
    loadFromStorage('innovation_factors', DEMO_SYSTEM_FACTORS)
  );
  const [relationships, setRelationships] = useState<CausalRelationship[]>(() =>
    loadFromStorage('innovation_relationships', DEMO_CAUSAL_RELATIONSHIPS)
  );
  const [feedbackLoops, setFeedbackLoops] = useState<FeedbackLoop[]>(() =>
    loadFromStorage('innovation_feedback_loops', DEMO_FEEDBACK_LOOPS)
  );

  // 4. Leverage Points State with persistence
  const [leveragePoints, setLeveragePoints] = useState<LeveragePoint[]>(() =>
    loadFromStorage('innovation_leverage_points', DEMO_LEVERAGE_POINTS)
  );

  // 5. Solution Alternatives State with persistence
  const [alternatives, setAlternatives] = useState<SolutionAlternative[]>(() =>
    loadFromStorage('innovation_alternatives', DEMO_ALTERNATIVES)
  );

  // 6. AHP Decision Analysis State with persistence
  const [criteria, setCriteria] = useState<AHPCriterion[]>(() =>
    loadFromStorage('innovation_criteria', DEMO_CRITERIA)
  );
  const [criteriaMatrix, setCriteriaMatrix] = useState<Record<string, Record<string, number>>>(() =>
    loadFromStorage('innovation_criteria_matrix', DEMO_CRITERIA_PAIRWISE)
  );
  const [alternativeMatrices, setAlternativeMatrices] = useState<Record<string, Record<string, Record<string, number>>>>(() =>
    loadFromStorage('innovation_alternative_matrices', DEMO_ALT_PAIRWISE)
  );

  // Auto-save changes to localStorage
  useEffect(() => {
    saveToStorage('innovation_project_idea', projectIdea);
  }, [projectIdea]);

  useEffect(() => {
    saveToStorage('innovation_stakeholders', stakeholders);
  }, [stakeholders]);

  useEffect(() => {
    saveToStorage('innovation_factors', factors);
  }, [factors]);

  useEffect(() => {
    saveToStorage('innovation_relationships', relationships);
  }, [relationships]);

  useEffect(() => {
    saveToStorage('innovation_feedback_loops', feedbackLoops);
  }, [feedbackLoops]);

  useEffect(() => {
    saveToStorage('innovation_leverage_points', leveragePoints);
  }, [leveragePoints]);

  useEffect(() => {
    saveToStorage('innovation_alternatives', alternatives);
  }, [alternatives]);

  useEffect(() => {
    saveToStorage('innovation_criteria', criteria);
  }, [criteria]);

  useEffect(() => {
    saveToStorage('innovation_criteria_matrix', criteriaMatrix);
  }, [criteriaMatrix]);

  useEffect(() => {
    saveToStorage('innovation_alternative_matrices', alternativeMatrices);
  }, [alternativeMatrices]);

  // CleanBot Demo Case Simulation State
  const [selectedCampusId, setSelectedCampusId] = useState<CampusId>('myllypuro');
  const [campusData, setCampusData] = useState(CAMPUS_DATA);
  const [telemetry, setTelemetry] = useState<RobotTelemetry>(INITIAL_TELEMETRY);
  const [logs, setLogs] = useState<OperationalLog[]>(INITIAL_LOGS);
  const [mopTrail, setMopTrail] = useState<{ x: number; y: number; opacity: number }[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [simSpeed, setSimSpeed] = useState<number>(1);
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);
  const [demoSimTab, setDemoSimTab] = useState<'map' | 'schedule' | 'cockpit'>('map');

  const currentCampus = campusData[selectedCampusId] || campusData.myllypuro;

  // Real-time AHP calculation
  const ahpResult: AHPAnalysisResult = useMemo(() => {
    return calculateFullAHP(criteria, alternatives, criteriaMatrix, alternativeMatrices);
  }, [criteria, alternatives, criteriaMatrix, alternativeMatrices]);

  // Reset to CleanBot Metropolia Demo Data
  const handleResetDemo = () => {
    const keys = [
      'innovation_project_idea',
      'innovation_stakeholders',
      'innovation_factors',
      'innovation_relationships',
      'innovation_feedback_loops',
      'innovation_leverage_points',
      'innovation_alternatives',
      'innovation_criteria',
      'innovation_criteria_matrix',
      'innovation_alternative_matrices'
    ];
    if (typeof window !== 'undefined') {
      try {
        keys.forEach(k => localStorage.removeItem(k));
      } catch {
        // ignore
      }
    }

    setProjectIdea(DEMO_PROJECT_IDEA);
    setStakeholders(DEMO_STAKEHOLDERS);
    setFactors(DEMO_SYSTEM_FACTORS);
    setRelationships(DEMO_CAUSAL_RELATIONSHIPS);
    setFeedbackLoops(DEMO_FEEDBACK_LOOPS);
    setLeveragePoints(DEMO_LEVERAGE_POINTS);
    setAlternatives(DEMO_ALTERNATIVES);
    setCriteria(DEMO_CRITERIA);
    setCriteriaMatrix(DEMO_CRITERIA_PAIRWISE);
    setAlternativeMatrices(DEMO_ALT_PAIRWISE);
    sound.playChime();
  };

  // Export JSON Project
  const handleExportJson = () => {
    const projectBundle = {
      projectIdea,
      stakeholders,
      factors,
      relationships,
      feedbackLoops,
      leveragePoints,
      alternatives,
      criteria,
      criteriaMatrix,
      alternativeMatrices,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(projectBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `innovation_project_${projectIdea.title.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    sound.playChime();
  };

  // Step navigation sequence
  const stepOrder: InnovationWorkflowStep[] = [
    'project_idea',
    'stakeholders',
    'systems_thinking',
    'leverage_points',
    'alternatives',
    'ahp_analysis',
    'report'
  ];

  const handleNextStep = (current: InnovationWorkflowStep) => {
    const curIdx = stepOrder.indexOf(current);
    if (curIdx >= 0 && curIdx < stepOrder.length - 1) {
      setActiveStep(stepOrder[curIdx + 1]);
      sound.playChime();
    }
  };

  return (
    <div className="min-h-screen bg-[#070b12] text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        activeStep={activeStep}
        setActiveStep={setActiveStep}
        onResetDemo={handleResetDemo}
        isDemoActive={projectIdea.isDemoData}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {/* Step 1: Project Idea */}
        {activeStep === 'project_idea' && (
          <ProjectIdeaView
            projectIdea={projectIdea}
            onChange={setProjectIdea}
            onResetDemo={handleResetDemo}
            onNextStep={() => handleNextStep('project_idea')}
          />
        )}

        {/* Step 2: Stakeholders */}
        {activeStep === 'stakeholders' && (
          <StakeholderAnalysisView
            stakeholders={stakeholders}
            onChange={setStakeholders}
            onNextStep={() => handleNextStep('stakeholders')}
          />
        )}

        {/* Step 3: Systems Thinking */}
        {activeStep === 'systems_thinking' && (
          <SystemsThinkingView
            factors={factors}
            relationships={relationships}
            feedbackLoops={feedbackLoops}
            onUpdateFactors={setFactors}
            onUpdateRelationships={setRelationships}
            onUpdateFeedbackLoops={setFeedbackLoops}
            onNextStep={() => handleNextStep('systems_thinking')}
          />
        )}

        {/* Step 4: Leverage Points */}
        {activeStep === 'leverage_points' && (
          <LeveragePointsView
            leveragePoints={leveragePoints}
            factors={factors}
            onChange={setLeveragePoints}
            onNextStep={() => handleNextStep('leverage_points')}
          />
        )}

        {/* Step 5: Solution Alternatives */}
        {activeStep === 'alternatives' && (
          <SolutionAlternativesView
            alternatives={alternatives}
            onChange={setAlternatives}
            onNextStep={() => handleNextStep('alternatives')}
          />
        )}

        {/* Step 6: AHP Decision Analysis */}
        {activeStep === 'ahp_analysis' && (
          <AHPDecisionView
            criteria={criteria}
            alternatives={alternatives}
            criteriaMatrix={criteriaMatrix}
            alternativeMatrices={alternativeMatrices}
            onUpdateCriteria={setCriteria}
            onUpdateCriteriaMatrix={setCriteriaMatrix}
            onUpdateAlternativeMatrices={setAlternativeMatrices}
            onNextStep={() => handleNextStep('ahp_analysis')}
          />
        )}

        {/* Step 7: Final Innovation Report */}
        {activeStep === 'report' && (
          <InnovationReportView
            projectIdea={projectIdea}
            stakeholders={stakeholders}
            factors={factors}
            relationships={relationships}
            feedbackLoops={feedbackLoops}
            leveragePoints={leveragePoints}
            alternatives={alternatives}
            criteria={criteria}
            ahpResult={ahpResult}
            onExportJson={handleExportJson}
          />
        )}

        {/* CleanBot Live Case Study Simulator (Demo Case) */}
        {activeStep === 'cleanbot_demo_sim' && (
          <div className="flex flex-col gap-6">
            <div className="bg-[#0e1626] rounded-xl border border-[#ff5a00]/40 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold text-white">CleanBot Metropolia: Living Innovation Demo Case</span>
                  <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800 px-2 py-0.5 rounded">
                    [SIMULATED DIGITAL TWIN]
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  This interactive simulation represents <strong>Alternative 1 (CleanBot Mark IV Autonomous Fleet)</strong> modeled in our innovation workflow. It demonstrates hands-free classroom vacuuming, wet mopping, and auto-docking.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setDemoSimTab('map')}
                  className={`px-3 py-1.5 text-xs font-medium rounded ${
                    demoSimTab === 'map' ? 'bg-[#ff5a00] text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Campus Live Map
                </button>
                <button
                  onClick={() => setDemoSimTab('cockpit')}
                  className={`px-3 py-1.5 text-xs font-medium rounded ${
                    demoSimTab === 'cockpit' ? 'bg-[#ff5a00] text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  Robot Cockpit Feed
                </button>
                <button
                  onClick={() => setActiveStep('ahp_analysis')}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded ml-2"
                >
                  Return to AHP →
                </button>
              </div>
            </div>

            {demoSimTab === 'map' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 flex flex-col gap-4">
                  <CampusLiveMap
                    campus={currentCampus}
                    onSelectCampus={setSelectedCampusId}
                    telemetry={telemetry}
                    mopTrail={mopTrail}
                    onDispatchToRoom={(r) => setSelectedRoom(r)}
                    onDispatchToCoordinate={(x, y) => {
                      setTelemetry(prev => ({ ...prev, position: { ...prev.position, x, y } }));
                    }}
                    onAddTrash={(x, y) => {
                      const newTr: TrashItem = {
                        id: 'tr_' + Date.now(),
                        type: 'coffee_cup',
                        label: 'Simulated Paper Cup',
                        x,
                        y,
                        weightGrams: 30,
                        collected: false,
                        roomId: 'corridor_main'
                      };
                      setCampusData(prev => ({
                        ...prev,
                        [selectedCampusId]: {
                          ...prev[selectedCampusId],
                          trashItems: [...prev[selectedCampusId].trashItems, newTr]
                        }
                      }));
                    }}
                    onAddSpill={(x, y) => {
                      const newSp: SpillItem = {
                        id: 'sp_' + Date.now(),
                        x,
                        y,
                        radius: 20,
                        type: 'coffee',
                        cleaned: false,
                        roomId: 'corridor_main'
                      };
                      setCampusData(prev => ({
                        ...prev,
                        [selectedCampusId]: {
                          ...prev[selectedCampusId],
                          spills: [...prev[selectedCampusId].spills, newSp]
                        }
                      }));
                    }}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom}
                    allCampuses={campusData}
                  />
                </div>

                <div className="lg:col-span-4 flex flex-col gap-4">
                  <RobotTelemetryPanel
                    telemetry={telemetry}
                    onChangeMode={(m) => setTelemetry(t => ({ ...t, cleanMode: m }))}
                    onReturnToDock={() => {
                      setTelemetry(t => ({ 
                        ...t, 
                        state: 'idle_docked', 
                        position: { x: currentCampus.dockPosition.x, y: currentCampus.dockPosition.y, angle: 0 } 
                      }));
                      sound.playDockLatch();
                    }}
                    onEmptyHopper={() => {
                      setTelemetry(t => ({ ...t, trashHopperLiters: 0 }));
                      sound.playDockLatch();
                    }}
                    onEmergencyStop={() => setTelemetry(t => ({ ...t, state: 'emergency_stop' }))}
                    onToggleLights={() => setTelemetry(t => ({ ...t, lightsActive: !t.lightsActive }))}
                    onToggleUvc={() => setTelemetry(t => ({ ...t, uvcSanitizationActive: !t.uvcSanitizationActive }))}
                  />
                </div>
              </div>
            )}

            {demoSimTab === 'cockpit' && (
              <TeleoperationCockpit
                telemetry={telemetry}
                onDrive={(dx, dy, dAngle) => {
                  setTelemetry(prev => ({
                    ...prev,
                    position: {
                      x: Math.max(30, Math.min(760, prev.position.x + dx)),
                      y: Math.max(30, Math.min(370, prev.position.y + dy)),
                      angle: prev.position.angle + dAngle
                    }
                  }));
                }}
                onToggleLights={() => setTelemetry(t => ({ ...t, lightsActive: !t.lightsActive }))}
                onToggleUvc={() => setTelemetry(t => ({ ...t, uvcSanitizationActive: !t.uvcSanitizationActive }))}
                onEmptyHopper={() => setTelemetry(t => ({ ...t, trashHopperLiters: 0 }))}
              />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-[#070b12] py-4 px-6 text-xs text-slate-500 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div>
          Innovation Partner — University Innovation & Systems Evaluation Framework · Metropolia UAS
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Demo Case: CleanBot Metropolia [All figures simulated]</span>
          <span>·</span>
          <span>Analytic Hierarchy Process (Saaty Eigenvector Model)</span>
        </div>
      </footer>
    </div>
  );
}
