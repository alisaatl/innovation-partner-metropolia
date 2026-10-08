export interface ProjectIdea {
  title: string;
  problemStatement: string;
  proposedInnovation: string;
  strategicGoals: string[];
  contextAndConstraints: string;
  targetBeneficiaries: string;
  institution: string;
  authorTeam: string;
  lastUpdated: string;
  isDemoData: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  influence: number; // 1 to 5
  interest: number;  // 1 to 5
  keyConcerns: string;
  customStrategy?: string;
}

export type QuadrantType = 'key_players' | 'keep_satisfied' | 'keep_informed' | 'monitor';

export interface SystemFactor {
  id: string;
  name: string;
  category: 'operational' | 'technical' | 'human' | 'economic' | 'environmental';
  description: string;
  x: number;
  y: number;
}

export interface CausalRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  polarity: '+' | '-'; // '+' means same direction (reinforcing step), '-' means opposite direction (balancing step)
  description: string;
  delay?: boolean;
}

export interface FeedbackLoop {
  id: string;
  code: string; // e.g. R1, B1
  name: string;
  type: 'reinforcing' | 'balancing';
  factorIds: string[];
  explanation: string;
  systemImpact: string;
}

export interface LeveragePoint {
  id: string;
  meadowsLevel: number; // 1 to 12
  levelName: string;
  factorId?: string;
  interventionTitle: string;
  description: string;
  whyItHasLeverage: string;
  potentialResistance: string;
  impactScore: 'transformative' | 'high' | 'moderate';
}

export interface SolutionAlternative {
  id: string;
  code: string;
  title: string;
  tagline: string;
  description: string;
  keyStrengths: string[];
  keyRisks: string[];
  estimatedCost: string;
  timeToDeploy: string;
  isDemoData?: boolean;
}

export interface AHPCriterion {
  id: string;
  name: string;
  description: string;
}

export interface AHPAnalysisResult {
  criteriaWeights: Record<string, number>;
  criteriaLambdaMax: number;
  criteriaCI: number;
  criteriaCR: number;
  isConsistent: boolean;
  alternativeScoresByCriterion: Record<string, Record<string, number>>; // criterionId -> altId -> localWeight
  overallScores: Record<string, number>; // altId -> globalWeight
  ranking: {
    alternativeId: string;
    score: number;
    scorePct: number;
    rank: number;
  }[];
}

export type InnovationWorkflowStep =
  | 'project_idea'
  | 'stakeholders'
  | 'systems_thinking'
  | 'leverage_points'
  | 'alternatives'
  | 'ahp_analysis'
  | 'report'
  | 'cleanbot_demo_sim';
