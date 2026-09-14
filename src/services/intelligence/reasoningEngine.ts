import type { ExcuseRequest } from '../../types';
import { getSituation } from '../../data/categories';
import type {
  ExcuseContext,
  ReasonStrategy,
  ReasoningAnalysis,
} from './types';

// ─── Relationship Communication Archetypes ──────────────────────────────────
const RELATIONSHIP_GUIDELINES: Record<
  string,
  { communicationStyle: string; accountabilityLevel: 'high' | 'moderate' | 'personal' | 'informal' }
> = {
  boss: {
    communicationStyle: 'Professional, concise, respectful, accountable, solution-oriented',
    accountabilityLevel: 'high',
  },
  coworker: {
    communicationStyle: 'Collaborative, direct, considerate of shared workload',
    accountabilityLevel: 'moderate',
  },
  partner: {
    communicationStyle: 'Natural, personal, warm, conversational, emotionally attuned',
    accountabilityLevel: 'personal',
  },
  friend: {
    communicationStyle: 'Casual, relaxed, genuine, unpretentious',
    accountabilityLevel: 'informal',
  },
  parent: {
    communicationStyle: 'Natural, respectful, reassuring, considerate',
    accountabilityLevel: 'personal',
  },
  teacher: {
    communicationStyle: 'Polite, deferential, responsible, clear',
    accountabilityLevel: 'high',
  },
  client: {
    communicationStyle: 'Professional, courteous, clear, reassuring, accountable',
    accountabilityLevel: 'high',
  },
  other: {
    communicationStyle: 'Polite, clear, standard conversational courtesy',
    accountabilityLevel: 'moderate',
  },
};

// ─── Outcome Strategy Goals ─────────────────────────────────────────────────
const OUTCOME_GOALS: Record<string, string> = {
  explain: 'Make the situation clearly understandable without being defensive; acknowledge impact.',
  postpone: 'Highlight a reasonable temporary obstacle, propose an alternative time, or offer to reschedule.',
  cancel: 'Provide a clear, polite, respectful reason for withdrawal without over-promising.',
  get_out: 'Offer a clean, believable boundary or constraint with minimal elaboration.',
  soften: 'Prioritize warmth and empathy, reduce friction, and preserve the interpersonal relationship.',
};

// ─── Safety Evaluation ──────────────────────────────────────────────────────
const UNSAFE_PATTERNS = [
  /law enforcement/i,
  /police/i,
  /court/i,
  /fraud/i,
  /forgery/i,
  /fake document/i,
  /medical impersonation/i,
  /financial deception/i,
  /steal/i,
  /harm/i,
];

export function evaluateSafety(input: string): boolean {
  for (const pattern of UNSAFE_PATTERNS) {
    if (pattern.test(input)) {
      return false;
    }
  }
  return true;
}

// ─── User Reason Extraction & Distinction ───────────────────────────────────
export interface ExtractedContextAnalysis {
  isProblemDescriptionOnly: boolean;
  hasUserProvidedReason: boolean;
  userSuppliedReason?: string;
  inferredDilemma: string;
}

const PROBLEM_ONLY_PATTERNS = [
  /^(my\s+)?(girlfriend|boyfriend|partner|wife|husband|boss|manager|mom|dad|parents|teacher|friend|client)\s+(is\s+)?(asking|wondering|wants to know|demanding)/i,
  /^(i\s+)?need\s+an\s+excuse\s+for/i,
  /^(how\s+do\s+i\s+explain|what\s+do\s+i\s+say)/i,
  /^(why\s+(did|didn't|am)\s+i)/i,
];

export function analyzeUserContextInput(input: string): ExtractedContextAnalysis {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Check if there is an explicit causal connector like "because ...", "due to ...", "since ..."
  const becauseMatch = trimmed.match(/(?:because|due to|since|as)\s+([^.!?]+)/i);
  if (becauseMatch && becauseMatch[1].trim().length > 3) {
    return {
      isProblemDescriptionOnly: false,
      hasUserProvidedReason: true,
      userSuppliedReason: becauseMatch[1].trim(),
      inferredDilemma: trimmed,
    };
  }

  // Check for specific events stated directly as reasons (e.g. "my train stopped", "my phone died", "got stuck in traffic")
  const directEvents = [
    /train\s+(stopped|delayed|stalled|broken)/i,
    /phone\s+(died|ran out of battery|broke)/i,
    /stuck\s+in\s+traffic/i,
    /flat\s+tire/i,
    /power\s+outage/i,
    /internet\s+(went down|stopped working|died)/i,
    /alarm\s+didn't\s+go\s+off/i,
    /flight\s+(delayed|cancelled)/i,
  ];

  for (const pattern of directEvents) {
    if (pattern.test(lower)) {
      return {
        isProblemDescriptionOnly: false,
        hasUserProvidedReason: true,
        userSuppliedReason: trimmed,
        inferredDilemma: trimmed,
      };
    }
  }

  for (const pattern of PROBLEM_ONLY_PATTERNS) {
    if (pattern.test(lower)) {
      return {
        isProblemDescriptionOnly: true,
        hasUserProvidedReason: false,
        inferredDilemma: trimmed,
      };
    }
  }

  // If the input doesn't clearly contain a cause, treat as problem description needing a generated reason
  return {
    isProblemDescriptionOnly: true,
    hasUserProvidedReason: false,
    inferredDilemma: trimmed,
  };
}

// ─── Strategy Selection Heuristic ───────────────────────────────────────────
export function inferReasonStrategy(ctx: ExcuseContext): ReasonStrategy {
  const text = (ctx.userInput + ' ' + (ctx.situation?.label || '')).toLowerCase();

  if (text.includes('train') || text.includes('traffic') || text.includes('bus') || text.includes('flight') || text.includes('flat tire') || text.includes('car')) {
    return 'transportation_problem';
  }
  if (text.includes('meeting') || text.includes('overlap') || text.includes('double book') || text.includes('schedule') || text.includes('calendar')) {
    return 'scheduling_conflict';
  }
  if (text.includes('wifi') || text.includes('internet') || text.includes('computer') || text.includes('laptop') || text.includes('battery') || text.includes('phone died') || text.includes('phone died')) {
    return 'technical_problem';
  }
  if (text.includes('didn\'t see') || text.includes('missed your call') || text.includes('silent') || text.includes('notification') || text.includes('reply')) {
    return 'communication_failure';
  }
  if (text.includes('sick') || text.includes('headache') || text.includes('doctor') || text.includes('migraine') || text.includes('unwell')) {
    return 'health_related';
  }
  if (text.includes('kid') || text.includes('family') || text.includes('mom') || text.includes('dad') || text.includes('child') || text.includes('parent')) {
    return 'family_responsibility';
  }
  if (text.includes('deadline') || text.includes('client') || text.includes('boss') || text.includes('urgent task') || text.includes('project')) {
    return 'work_responsibility';
  }
  if (text.includes('forgot') || text.includes('slipped my mind') || text.includes('lost track')) {
    return 'simple_oversight';
  }
  if (text.includes('thought you meant') || text.includes('misunderstood') || text.includes('mix up')) {
    return 'misunderstanding';
  }
  if (text.includes('time') || text.includes('running behind') || text.includes('delayed')) {
    return 'timing_problem';
  }

  // Sensible defaults based on category and relationship
  if (ctx.relationship === 'partner' || ctx.category === 'relationship') {
    return 'unexpected_personal_issue';
  }
  if (ctx.relationship === 'boss' || ctx.category === 'work') {
    return ctx.outcome === 'postpone' ? 'scheduling_conflict' : 'work_responsibility';
  }
  if (ctx.relationship === 'parent' || ctx.category === 'family') {
    return 'family_responsibility';
  }
  return 'unexpected_personal_issue';
}

// ─── Create Enriched Context ────────────────────────────────────────────────
export function createExcuseContext(req: ExcuseRequest): ExcuseContext {
  const situation = getSituation(req.situationId) || null;
  return {
    situationId: req.situationId,
    situation,
    category: req.category,
    userInput: req.userInput.trim(),
    relationship: req.relationship,
    tone: req.tone,
    detail: req.detail,
    outcome: req.outcome,
    severity: req.severity,
  };
}

// ─── Perform 7-Stage Reasoning Analysis ─────────────────────────────────────
export function analyzeContext(ctx: ExcuseContext): ReasoningAnalysis {
  const relGuide = RELATIONSHIP_GUIDELINES[ctx.relationship] || RELATIONSHIP_GUIDELINES.other;
  const outcomeGoal = OUTCOME_GOALS[ctx.outcome] || OUTCOME_GOALS.explain;
  const strategy = inferReasonStrategy(ctx);
  const safetyPassed = evaluateSafety(ctx.userInput);
  const contextAnalysis = analyzeUserContextInput(ctx.userInput);

  return {
    stage1_understanding: {
      event: ctx.situation?.label || 'Social situation',
      immediateProblem: contextAnalysis.inferredDilemma || ctx.situation?.description || 'Need an explanation',
      targetPerson: ctx.relationship,
      userIntent: `Aiming to ${ctx.outcome} with ${ctx.tone} tone and ${ctx.detail} detail.`,
    },
    stage2_contextSynthesis: {
      baseSituationLabel: ctx.situation?.label || 'General',
      userSpecificDetails: ctx.userInput,
      primaryFocus: contextAnalysis.hasUserProvidedReason
        ? `Use user-supplied reason: "${contextAnalysis.userSuppliedReason}" directly in the message`
        : `User described a dilemma without a specific cause; generate a believable ${strategy} reason`,
    },
    stage3_relationshipNuance: {
      relationship: ctx.relationship,
      communicationStyle: relGuide.communicationStyle,
      accountabilityLevel: relGuide.accountabilityLevel,
    },
    stage4_severityCalibration: {
      severity: ctx.severity,
      plausibilityRequirement:
        ctx.severity === 'critical'
          ? 'Requires utmost sincerity, high accountability, and believable constraints.'
          : ctx.severity === 'moderate'
          ? 'Requires clear reasoning, acknowledgement of delay/impact, and polite recovery.'
          : 'Keep light, simple, conversational, and avoid over-apologizing.',
      cautionLevel: ctx.severity === 'critical' ? 'high' : ctx.severity === 'moderate' ? 'moderate' : 'low',
    },
    stage5_outcomeAlignment: {
      outcome: ctx.outcome,
      strategyGoal: outcomeGoal,
    },
    stage6_toneAdjustment: {
      tone: ctx.tone,
      formality: `Align with ${ctx.tone} without overriding relationship accountability.`,
    },
    stage7_detailConstraint: {
      detail: ctx.detail,
      lengthGuidance:
        ctx.detail === 'short'
          ? '1 concise, punchy sentence without fluff.'
          : ctx.detail === 'detailed'
          ? '2-3 sentences with clear context and follow-through, avoiding fabricated unprovided facts.'
          : '1-2 natural, flowing conversational sentences.',
    },
    selectedStrategy: strategy,
    safetyCheckPassed: safetyPassed,
  };
}
