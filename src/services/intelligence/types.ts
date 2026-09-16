import type {
  CategoryId,
  DesiredOutcome,
  DetailLevel,
  ExcuseRequest,
  GeneratedExcuse,
  Relationship,
  Severity,
  Situation,
  Tone,
} from '../../types';

// ─── Reason Strategy Taxonomy ────────────────────────────────────────────────
export type ReasonStrategy =
  | 'scheduling_conflict'
  | 'unexpected_personal_issue'
  | 'transportation_problem'
  | 'timing_problem'
  | 'family_responsibility'
  | 'work_responsibility'
  | 'communication_failure'
  | 'technical_problem'
  | 'health_related'
  | 'prior_commitment'
  | 'logistical_problem'
  | 'misunderstanding'
  | 'simple_oversight';

// ─── Enriched Excuse Context ─────────────────────────────────────────────────
export interface ExcuseContext {
  situationId: string;
  situation: Situation | null;
  category: CategoryId;
  userInput: string;
  relationship: Relationship;
  tone: Tone;
  detail: DetailLevel;
  outcome: DesiredOutcome;
  severity: Severity;
}

// ─── Reasoning Pipeline Stages ───────────────────────────────────────────────
export interface ReasoningAnalysis {
  stage1_understanding: {
    event: string;
    immediateProblem: string;
    targetPerson: string;
    userIntent: string;
  };
  stage2_contextSynthesis: {
    baseSituationLabel: string;
    userSpecificDetails: string;
    primaryFocus: string;
  };
  stage3_relationshipNuance: {
    relationship: Relationship;
    communicationStyle: string;
    accountabilityLevel: 'high' | 'moderate' | 'personal' | 'informal';
  };
  stage4_severityCalibration: {
    severity: Severity;
    plausibilityRequirement: string;
    cautionLevel: 'low' | 'moderate' | 'high';
  };
  stage5_outcomeAlignment: {
    outcome: DesiredOutcome;
    strategyGoal: string;
  };
  stage6_toneAdjustment: {
    tone: Tone;
    formality: string;
  };
  stage7_detailConstraint: {
    detail: DetailLevel;
    lengthGuidance: string;
  };
  selectedStrategy: ReasonStrategy;
  safetyCheckPassed: boolean;
  retrievedKnowledge?: import('./knowledge/types').KnowledgeRecord[];
}

export * from './knowledge/types';

// ─── Structured AI Response Schema ───────────────────────────────────────────
export interface AIExcusePayload {
  excuse: string;
  believability: number; // 1-5
  reasonStrategy: ReasonStrategy;
  followUp: {
    question: string;
    answer: string;
  } | null;
  reasoningNotes?: string;
}

// ─── Prompt Payload Contract ────────────────────────────────────────────────
export interface PromptPayload {
  systemPrompt: string;
  userPrompt: string;
  temperature?: number;
  maxTokens?: number;
}

// ─── Refinement Actions ─────────────────────────────────────────────────────
export type RefinementAction =
  | 'shorter'
  | 'more_casual'
  | 'more_believable'
  | 'change_tone';

// ─── AI Provider Adapter Contract ───────────────────────────────────────────
export interface AIProviderAdapter {
  id: string;
  name: string;
  isAvailable(): boolean;
  generate(context: ExcuseContext, opts?: { variation?: number }): Promise<GeneratedExcuse>;
  refine(
    current: GeneratedExcuse,
    action: RefinementAction,
    context: ExcuseContext,
    opts?: { variation?: number }
  ): Promise<GeneratedExcuse>;
}
