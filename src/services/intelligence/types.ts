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

// ─── Emotional Context Inference ─────────────────────────────────────────────
export interface EmotionalContext {
  recipientEmotion: string; // Cautious inference (e.g. "likely hurt, ignored, or disappointed")
  userEmotion: string; // Cautious inference (e.g. "anxious, guilty, rushed, or apologetic")
  emotionalImpact: string; // Likely effect on recipient (e.g. "feeling deprioritized, neglected, or left waiting")
  relationshipDynamic: string; // Dynamic description (e.g. "romantic partner — mutual trust, expectation of warmth and presence")
  trustSensitivity: 'low' | 'moderate' | 'high' | 'critical';
  repairNeed: string; // Core emotional repair (e.g. "reassurance, validation, and warm reconnection")
  reassuranceNeed: string; // Reassurance detail (e.g. "confirming care and priority without defensiveness")
  accountabilityNeed: string; // Ownership requirement (e.g. "acknowledging delay cleanly without excuses")
  emotionalIntensity: 'mild' | 'moderate' | 'high' | 'deep';
}

// ─── User Goal Taxonomy ───────────────────────────────────────────────────────
export type UserGoalType =
  | 'explain'
  | 'apologize'
  | 'postpone'
  | 'cancel'
  | 'soften'
  | 'reconnect'
  | 'reassure'
  | 'set_a_boundary'
  | 'reduce_conflict'
  | 'ask_for_another_chance'
  | 'escape_awkward_situation';

export interface UserGoalAnalysis {
  dominantGoal: UserGoalType;
  secondaryGoal?: UserGoalType;
  goalRationale: string;
}

// ─── Relationship Dynamics ───────────────────────────────────────────────────
export interface RelationshipDynamicDetails {
  relationship: Relationship;
  dynamicName: string;
  coreValues: string[];
  communicationStyle: string;
  accountabilityLevel: 'high' | 'moderate' | 'personal' | 'informal';
  communicationDos: string[];
  communicationDonts: string[];
}

// ─── Emotional Response Structure ────────────────────────────────────────────
export interface EmotionalResponseStructure {
  archetype: 'relationship' | 'work' | 'family' | 'friend' | 'academic' | 'client' | 'general';
  flowSteps: string[];
  structureDescription: string;
  calibrationLevel: 'understated' | 'balanced' | 'sensitive' | 'high_accountability';
}

// ─── Natural Communication Guidance ──────────────────────────────────────────
export interface NaturalCommunicationGuidance {
  sentenceLengthGuidance: string;
  cadence: string;
  contractionsPreferred: boolean;
  allowedNaturalPhrases: string[];
  bannedPhrases: string[];
  hesitationGuidance: string;
  overExplanationTrap: string;
}

// ─── Reasoning Pipeline Stages ───────────────────────────────────────────────
export interface ReasoningAnalysis {
  stage1_understanding: {
    event: string;
    immediateProblem: string;
    targetPerson: string;
    userIntent: string;
    isProblemDescriptionOnly: boolean;
    hasUserProvidedReason: boolean;
    userSuppliedReason?: string;
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
  // Deeper reasoning layers
  relationshipDynamics: RelationshipDynamicDetails;
  emotionalContext: EmotionalContext;
  userGoal: UserGoalAnalysis;
  emotionalResponseStructure: EmotionalResponseStructure;
  naturalCommunication: NaturalCommunicationGuidance;
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
