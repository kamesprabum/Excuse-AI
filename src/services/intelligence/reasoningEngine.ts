import type { ExcuseRequest, Relationship, CategoryId, Severity, Tone, DetailLevel, DesiredOutcome } from '../../types';
import { getSituation } from '../../data/categories';
import type {
  ExcuseContext,
  ReasonStrategy,
  ReasoningAnalysis,
  EmotionalContext,
  UserGoalAnalysis,
  UserGoalType,
  RelationshipDynamicDetails,
  EmotionalResponseStructure,
  NaturalCommunicationGuidance,
} from './types';
import { retrieveRelevantKnowledge } from './knowledge/knowledgeRetriever';

// ─── Relationship Dynamics Definitions ───────────────────────────────────────
const RELATIONSHIP_DYNAMICS_MAP: Record<
  Relationship,
  {
    dynamicName: string;
    coreValues: string[];
    communicationStyle: string;
    accountabilityLevel: 'high' | 'moderate' | 'personal' | 'informal';
    communicationDos: string[];
    communicationDonts: string[];
  }
> = {
  partner: {
    dynamicName: 'romantic_partner',
    coreValues: ['warmth', 'acknowledgment', 'reassurance', 'connection'],
    communicationStyle: 'Natural, personal, warm, conversational, emotionally attuned, validating',
    accountabilityLevel: 'personal',
    communicationDos: [
      'Acknowledge how it likely felt or looked to them',
      'Keep the reason simple, grounded, and human',
      'Offer genuine warmth, affection, and reconnection',
    ],
    communicationDonts: [
      'Cold corporate or stiff apologies',
      'Defensive justifications like "I have a life too"',
      'Over-dramatizing or inventing extreme crises',
    ],
  },
  boss: {
    dynamicName: 'professional_leadership',
    coreValues: ['clarity', 'accountability', 'respect', 'next step'],
    communicationStyle: 'Professional, concise, respectful, accountable, solution-oriented',
    accountabilityLevel: 'high',
    communicationDos: [
      'Acknowledge the issue promptly without dodging',
      'Give a concise, factual explanation without fluff',
      'Propose an immediate, actionable next step or reschedule window',
    ],
    communicationDonts: [
      'Over-sharing personal home drama',
      'Blaming coworkers, clients, or external parties',
      'Vague timeframes like "sometime later"',
    ],
  },
  friend: {
    dynamicName: 'close_friend',
    coreValues: ['casual accountability', 'warmth', 'less formality', 'continuity'],
    communicationStyle: 'Casual, relaxed, genuine, unpretentious, friendly',
    accountabilityLevel: 'informal',
    communicationDos: [
      'Admit the slip-up simply and casually',
      'Keep the tone unforced and lighthearted where appropriate',
      'Segway naturally into hanging out or catching up',
    ],
    communicationDonts: [
      'Stiff corporate language ("I apologize for any inconvenience")',
      'Elaborate fabricated excuses',
      'Ghosting or going silent after acknowledging',
    ],
  },
  parent: {
    dynamicName: 'parent_family',
    coreValues: ['reassurance', 'safety', 'concise explanation', 'respect'],
    communicationStyle: 'Considerate, respectful, reassuring of safety and wellbeing',
    accountabilityLevel: 'personal',
    communicationDos: [
      'Explicitly reassure them of your safety first',
      'Provide a simple, clear explanation',
      'Give a concrete ETA or status update',
    ],
    communicationDonts: [
      'Snapping with irritation or being dismissive',
      'Leaving them wondering where you are',
      'Cold one-word evasions',
    ],
  },
  teacher: {
    dynamicName: 'academic_authority',
    coreValues: ['respect', 'accountability', 'appropriate detail', 'academic integrity'],
    communicationStyle: 'Polite, deferential, responsible, clear',
    accountabilityLevel: 'high',
    communicationDos: [
      'Polite and respectful address',
      'Take clean ownership of missed class or assignment',
      'Inquire politely about make-up options or next steps',
    ],
    communicationDonts: [
      'Slang or excessive informality',
      'Blaming internet/tech unless genuinely true',
      'Assuming automatic extension without asking',
    ],
  },
  client: {
    dynamicName: 'commercial_client',
    coreValues: ['professionalism', 'clarity', 'confidence', 'solution'],
    communicationStyle: 'Professional, courteous, solution-driven, protective of trust',
    accountabilityLevel: 'high',
    communicationDos: [
      'Clear, transparent status update',
      'Confidence-building solution and timeline',
      'Show high respect for their business and time',
    ],
    communicationDonts: [
      'Amateurish excuses or exposing internal chaos',
      'Over-apologizing to the point of appearing incompetent',
    ],
  },
  coworker: {
    dynamicName: 'peer_colleague',
    coreValues: ['collaboration', 'directness', 'consideration of shared workload'],
    communicationStyle: 'Collaborative, direct, considerate of shared workflow',
    accountabilityLevel: 'moderate',
    communicationDos: [
      'Brief, direct update on the task status',
      'Keep shared deliverables unblocked',
      'Appreciation for their patience',
    ],
    communicationDonts: [
      'Leaving teammates waiting without notice',
      'Defensive posturing',
    ],
  },
  other: {
    dynamicName: 'general_courtesy',
    coreValues: ['clarity', 'politeness', 'basic accountability'],
    communicationStyle: 'Polite, clear, standard conversational courtesy',
    accountabilityLevel: 'moderate',
    communicationDos: ['Courteous communication', 'Clear concise explanation'],
    communicationDonts: ['Over-complicating or over-explaining'],
  },
};

// ─── Outcome Strategy Goals ─────────────────────────────────────────────────
const OUTCOME_GOALS: Record<DesiredOutcome, string> = {
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
  /^i\s+was\s+online\s+but\s+didn'?t\s+reply/i,
  /^i\s+missed\s+a\s+meeting/i,
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
    /stuck\s+between\s+(two\s+)?stations/i,
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

  // Check if user mentions an explicit oversight reason like "forgot to call my friend back"
  if (/^i\s+(completely\s+)?forgot\s+to\s+call/i.test(lower) || /^i\s+forgot\s+to\s+(reply|text|call)/i.test(lower)) {
    return {
      isProblemDescriptionOnly: false,
      hasUserProvidedReason: true,
      userSuppliedReason: 'lost track of time and it slipped my mind',
      inferredDilemma: trimmed,
    };
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

// ─── Relationship Dynamics Inference ─────────────────────────────────────────
export function inferRelationshipDynamics(
  relationship: Relationship,
  category: CategoryId,
  userInput: string
): RelationshipDynamicDetails {
  const base = RELATIONSHIP_DYNAMICS_MAP[relationship] || RELATIONSHIP_DYNAMICS_MAP.other;
  const lower = userInput.toLowerCase();

  // Fine-tune dynamic for romantic terms if relationship was set to friend or other but text says girlfriend/boyfriend
  if (lower.includes('girlfriend') || lower.includes('boyfriend') || lower.includes('partner') || lower.includes('wife') || lower.includes('husband')) {
    const partnerBase = RELATIONSHIP_DYNAMICS_MAP.partner;
    return {
      relationship: 'partner',
      dynamicName: partnerBase.dynamicName,
      coreValues: partnerBase.coreValues,
      communicationStyle: partnerBase.communicationStyle,
      accountabilityLevel: partnerBase.accountabilityLevel,
      communicationDos: partnerBase.communicationDos,
      communicationDonts: partnerBase.communicationDonts,
    };
  }

  // Fine-tune dynamic for manager/boss mentions
  if (lower.includes('manager') || lower.includes('boss') || lower.includes('supervisor')) {
    const bossBase = RELATIONSHIP_DYNAMICS_MAP.boss;
    return {
      relationship: 'boss',
      dynamicName: bossBase.dynamicName,
      coreValues: bossBase.coreValues,
      communicationStyle: bossBase.communicationStyle,
      accountabilityLevel: bossBase.accountabilityLevel,
      communicationDos: bossBase.communicationDos,
      communicationDonts: bossBase.communicationDonts,
    };
  }

  // Fine-tune dynamic for parents
  if (lower.includes('parent') || lower.includes('mom') || lower.includes('dad')) {
    const parentBase = RELATIONSHIP_DYNAMICS_MAP.parent;
    return {
      relationship: 'parent',
      dynamicName: parentBase.dynamicName,
      coreValues: parentBase.coreValues,
      communicationStyle: parentBase.communicationStyle,
      accountabilityLevel: parentBase.accountabilityLevel,
      communicationDos: parentBase.communicationDos,
      communicationDonts: parentBase.communicationDonts,
    };
  }

  return {
    relationship,
    dynamicName: base.dynamicName,
    coreValues: base.coreValues,
    communicationStyle: base.communicationStyle,
    accountabilityLevel: base.accountabilityLevel,
    communicationDos: base.communicationDos,
    communicationDonts: base.communicationDonts,
  };
}

// ─── Emotional Context Inference (Cautious Probabilistic Inference) ───────────
export function inferEmotionalContext(
  ctx: ExcuseContext,
  contextAnalysis: ExtractedContextAnalysis,
  relDynamics: RelationshipDynamicDetails
): EmotionalContext {
  const lower = (ctx.userInput + ' ' + (ctx.situation?.label || '')).toLowerCase();
  const rel = relDynamics.relationship;

  // 1. Romantic Partner Scenarios
  if (rel === 'partner' || lower.includes('girlfriend') || lower.includes('boyfriend') || ctx.category === 'relationship') {
    const isOnlineIssue = lower.includes('online') && (lower.includes('reply') || lower.includes('text'));
    const isAllDayDelay = lower.includes('all day') || lower.includes('hours') || lower.includes('didn\'t reply');
    
    let recipientEmotion = 'Possible emotional impact: may feel ignored, wondering if deprioritized or hurt';
    if (isOnlineIssue) {
      recipientEmotion = 'Possible emotional impact: likely feels uniquely ignored, disrespected, or wondering why you were active but not responding to them';
    } else if (isAllDayDelay) {
      recipientEmotion = 'Possible emotional impact: she or he may feel hurt, ignored, or disappointed by the extended silence';
    }

    return {
      recipientEmotion,
      userEmotion: 'Anxious about causing emotional distance, slightly apologetic, eager to reassure and connect',
      emotionalImpact: isOnlineIssue
        ? 'Feeling singled out or deprioritized despite visible activity'
        : 'Feeling neglected, left on read, or disconnected',
      relationshipDynamic: 'Romantic partnership with expectation of mutual emotional presence, attentiveness, and warmth',
      trustSensitivity: isOnlineIssue ? 'critical' : 'high',
      repairNeed: 'Validation of feelings, unpretentious explanation, and affectionate warm reconnection',
      reassuranceNeed: 'Confirming they matter, that the silence was not intentional dismissal, and desiring to talk now',
      accountabilityNeed: 'Gentle, genuine ownership of not messaging earlier without getting defensive',
      emotionalIntensity: ctx.severity === 'critical' ? 'high' : 'moderate',
    };
  }

  // 2. Workplace / Manager Scenarios
  if (rel === 'boss' || lower.includes('manager') || lower.includes('boss') || ctx.category === 'work') {
    const isMissedMeeting = lower.includes('meeting') || lower.includes('1-on-1') || lower.includes('standup');
    const isDeadline = lower.includes('deadline') || lower.includes('deliverable') || lower.includes('project');

    return {
      recipientEmotion: isMissedMeeting
        ? 'Possible emotional impact: likely inconvenienced, frustrated by disruption to schedule, expecting professionalism'
        : isDeadline
        ? 'Possible emotional impact: concerned about delivery timeline, team dependencies, or accountability'
        : 'Possible emotional impact: mildly inconvenienced or expecting a clear status update',
      userEmotion: 'Apologetic, focused on resolving the disruption, eager to maintain professional credibility',
      emotionalImpact: 'Interruption to workplace workflow, schedule uncertainty, or brief friction in reliability',
      relationshipDynamic: 'Professional reporting relationship built on punctuality, predictability, and ownership',
      trustSensitivity: ctx.severity === 'critical' ? 'high' : 'moderate',
      repairNeed: 'Prompt acknowledgment of the issue, concise reason, and an immediate proactive solution or reschedule',
      reassuranceNeed: 'Reassuring professional reliability and that the matter is under control',
      accountabilityNeed: 'Direct accountability without deflecting, blaming peers, or offering over-elaborate excuses',
      emotionalIntensity: ctx.severity === 'critical' ? 'high' : 'moderate',
    };
  }

  // 3. Close Friend Scenarios
  if (rel === 'friend' || lower.includes('friend')) {
    const isForgotCall = lower.includes('call') && (lower.includes('forgot') || lower.includes('didn\'t call'));

    return {
      recipientEmotion: isForgotCall
        ? 'Possible emotional impact: might feel slightly forgotten or wondering what happened, but likely receptive to a casual catch-up'
        : 'Possible emotional impact: might wonder if plans are still on or why there was a delay, low hostility',
      userEmotion: 'Friendly, slightly sheepish about slipping up, eager to catch up unpretentiously',
      emotionalImpact: 'Mild delay or temporary disconnect, easily mended with genuine casual warmth',
      relationshipDynamic: 'Casual friendship where ease, authenticity, and lack of rigid formality are valued',
      trustSensitivity: 'moderate',
      repairNeed: 'Honest casual acknowledgment of the slip, warm tone, and effortless conversational continuation',
      reassuranceNeed: 'Showing the friendship is valued and you genuinely want to talk or hang out',
      accountabilityNeed: 'Simple, candid ownership without stiff corporate apologies',
      emotionalIntensity: 'mild',
    };
  }

  // 4. Parent / Family Scenarios
  if (rel === 'parent' || lower.includes('parent') || lower.includes('mom') || lower.includes('dad') || ctx.category === 'family') {
    const isLateComingHome = lower.includes('coming home') || lower.includes('late') || lower.includes('where are you');

    return {
      recipientEmotion: isLateComingHome
        ? 'Possible emotional impact: likely worried about safety, anxious about whereabouts, or mildly frustrated by the lack of notice'
        : 'Possible emotional impact: concerned about wellbeing, expecting communication and consideration',
      userEmotion: 'Respectful, apologetic for sparking worry, keen to reassure them immediately of safety',
      emotionalImpact: 'Heightened parental anxiety and uncertainty over your status or arrival',
      relationshipDynamic: 'Familial bond centered on safety, care, and respectful communication',
      trustSensitivity: 'high',
      repairNeed: 'Immediate reassurance that you are safe, concise explanation of the holdup, and a concrete ETA',
      reassuranceNeed: 'Confirming safety and that you did not deliberately withhold information',
      accountabilityNeed: 'Acknowledging that they deserved a heads-up and giving reliable timing',
      emotionalIntensity: 'moderate',
    };
  }

  // 5. Transportation / Physical Obstacle (User Fact Provided)
  if (contextAnalysis.hasUserProvidedReason && (lower.includes('train') || lower.includes('traffic') || lower.includes('flight'))) {
    return {
      recipientEmotion: 'Possible emotional impact: waiting for your arrival or update, expecting timely status',
      userEmotion: 'Frustrated by transit holdup, eager to keep recipient in the loop',
      emotionalImpact: 'Timing delay in meeting up or arriving',
      relationshipDynamic: `${relDynamics.dynamicName} with practical coordination requirements`,
      trustSensitivity: 'moderate',
      repairNeed: 'Factual status update, realistic estimated timing, proactive communication',
      reassuranceNeed: 'Confirming you are en route and prioritizing arrival as soon as transit clears',
      accountabilityNeed: 'Prompt proactive communication rather than silence while delayed',
      emotionalIntensity: 'mild',
    };
  }

  // 6. Default / General Scenarios
  return {
    recipientEmotion: 'Possible emotional impact: expecting courtesy, clarity, and an explanation for the disruption',
    userEmotion: 'Polite, considerate, wanting to handle the social situation smoothly',
    emotionalImpact: 'Minor scheduling or communication friction',
    relationshipDynamic: relDynamics.communicationStyle,
    trustSensitivity: 'moderate',
    repairNeed: 'Courteous explanation, appropriate responsibility, and respectful resolution',
    reassuranceNeed: 'Confirming respectful consideration of their time',
    accountabilityNeed: 'Appropriate ownership matching the severity',
    emotionalIntensity: ctx.severity === 'critical' ? 'high' : 'mild',
  };
}

// ─── User Goal Inference ─────────────────────────────────────────────────────
export function inferUserGoal(
  ctx: ExcuseContext,
  contextAnalysis: ExtractedContextAnalysis
): UserGoalAnalysis {
  const lower = (ctx.userInput + ' ' + (ctx.situation?.label || '')).toLowerCase();
  const rel = ctx.relationship;

  // Explicit outcome overrides when set by user
  if (ctx.outcome === 'postpone') {
    return {
      dominantGoal: 'postpone',
      secondaryGoal: 'reassure',
      goalRationale: 'User wants to move an existing commitment to a later time while preserving trust and goodwill.',
    };
  }
  if (ctx.outcome === 'cancel') {
    return {
      dominantGoal: 'cancel',
      secondaryGoal: 'soften',
      goalRationale: 'User needs to withdraw from an agreement politely without causing offense or damage.',
    };
  }
  if (ctx.outcome === 'get_out') {
    return {
      dominantGoal: 'escape_awkward_situation',
      secondaryGoal: 'set_a_boundary',
      goalRationale: 'User wants a believable, clean exit from an uncomfortable situation with minimal friction.',
    };
  }
  if (ctx.outcome === 'soften') {
    return {
      dominantGoal: 'soften',
      secondaryGoal: 'reduce_conflict',
      goalRationale: 'User wants to de-escalate friction, convey warmth, and soften interpersonal tension.',
    };
  }

  // Context-driven goal inference
  if (rel === 'partner' || lower.includes('girlfriend') || lower.includes('boyfriend')) {
    if (lower.includes('online') || lower.includes('all day') || lower.includes('reply') || lower.includes('text')) {
      return {
        dominantGoal: 'reconnect',
        secondaryGoal: 'explain',
        goalRationale: 'Restore emotional warmth, reassure of care, explain the delay simply, and reconnect naturally.',
      };
    }
    return {
      dominantGoal: 'reassure',
      secondaryGoal: 'apologize',
      goalRationale: 'Provide comfort and affection while clarifying the situation.',
    };
  }

  if (rel === 'boss' || lower.includes('manager') || lower.includes('boss')) {
    if (lower.includes('meeting') || lower.includes('deadline')) {
      return {
        dominantGoal: 'explain',
        secondaryGoal: 'apologize',
        goalRationale: 'Explain the missed commitment with full accountability and immediately offer the next action or reschedule.',
      };
    }
    return {
      dominantGoal: 'explain',
      secondaryGoal: 'reassure',
      goalRationale: 'Provide clear, professional context and confirm task continuity.',
    };
  }

  if (rel === 'parent' || lower.includes('parent') || lower.includes('mom') || lower.includes('dad')) {
    return {
      dominantGoal: 'reassure',
      secondaryGoal: 'explain',
      goalRationale: 'Relieve parental worry about safety and location, providing a clear reason and realistic ETA.',
    };
  }

  if (rel === 'friend' || lower.includes('friend')) {
    if (lower.includes('forgot') || lower.includes('call')) {
      return {
        dominantGoal: 'apologize',
        secondaryGoal: 'reconnect',
        goalRationale: 'Own the oversight casually without defensiveness and jump straight into continuing the conversation.',
      };
    }
    return {
      dominantGoal: 'reconnect',
      secondaryGoal: 'explain',
      goalRationale: 'Casual explanation maintaining peer warmth and ongoing rapport.',
    };
  }

  if (contextAnalysis.hasUserProvidedReason && (lower.includes('train') || lower.includes('traffic'))) {
    return {
      dominantGoal: 'explain',
      secondaryGoal: 'reassure',
      goalRationale: 'Communicate the physical transit delay accurately and reassure the recipient with an updated ETA.',
    };
  }

  return {
    dominantGoal: 'explain',
    secondaryGoal: 'apologize',
    goalRationale: 'Explain the context cleanly, acknowledge the disruption, and preserve trust.',
  };
}

// ─── Emotional Response Structure Determination ──────────────────────────────
export function determineEmotionalResponseStructure(
  ctx: ExcuseContext,
  relDynamics: RelationshipDynamicDetails,
  emotionalContext: EmotionalContext,
  userGoal: UserGoalAnalysis
): EmotionalResponseStructure {
  const rel = relDynamics.relationship;

  if (rel === 'partner') {
    return {
      archetype: 'relationship',
      flowSteps: ['acknowledge impact', 'concise reason', 'appropriate responsibility', 'reconnect'],
      structureDescription:
        'Acknowledge how it looked or felt to them → offer a concise grounded reason → take gentle responsibility without defensive excuses → warmly reconnect or offer to talk now',
      calibrationLevel: emotionalContext.trustSensitivity === 'critical' ? 'high_accountability' : 'sensitive',
    };
  }

  if (rel === 'boss' || rel === 'client') {
    return {
      archetype: 'work',
      flowSteps: ['acknowledge issue', 'concise explanation', 'accountability', 'next step'],
      structureDescription:
        'Promptly acknowledge the issue or delay → give a brief factual reason without excuses → demonstrate professional accountability → state the immediate proactive next step or reschedule window',
      calibrationLevel: 'high_accountability',
    };
  }

  if (rel === 'parent') {
    return {
      archetype: 'family',
      flowSteps: ['acknowledge concern', 'explanation', 'reassurance', 'practical update'],
      structureDescription:
        'Acknowledge parental concern → concise reason for holdup → explicit reassurance of safety → practical update with ETA',
      calibrationLevel: 'balanced',
    };
  }

  if (rel === 'friend') {
    return {
      archetype: 'friend',
      flowSteps: ['acknowledge delay/problem', 'simple reason', 'warmth', 'continue relationship'],
      structureDescription:
        'Casually acknowledge the slip-up → provide a simple unforced reason → add genuine warmth → continue the friendship or propose catching up',
      calibrationLevel: 'understated',
    };
  }

  if (rel === 'teacher') {
    return {
      archetype: 'academic',
      flowSteps: ['acknowledge situation', 'clear explanation', 'polite responsibility', 'request guidance'],
      structureDescription:
        'Respectfully acknowledge the issue → give a clear responsible explanation → take ownership → politely ask how best to proceed or submit work',
      calibrationLevel: 'high_accountability',
    };
  }

  return {
    archetype: 'general',
    flowSteps: ['acknowledge situation', 'concise reason', 'courteous ownership', 'resolution'],
    structureDescription:
      'Politely acknowledge the impact → state a clear concise reason → take appropriate ownership → offer courteous next step',
    calibrationLevel: 'balanced',
  };
}

// ─── Natural Communication Guidance (Dedicated Stage) ───────────────────────
export function determineNaturalCommunicationGuidance(
  ctx: ExcuseContext,
  relDynamics: RelationshipDynamicDetails,
  emotionalContext: EmotionalContext
): NaturalCommunicationGuidance {
  const isPersonal = ['partner', 'friend', 'parent'].includes(relDynamics.relationship);

  const allowedNaturalPhrases = isPersonal
    ? [
        'sorry',
        'honestly',
        'actually',
        'I know',
        "I should've",
        "I didn't mean to",
        'got caught up',
        'lost track of my phone',
        'slipped my mind',
        'tied up with stuff',
      ]
    : [
        'sorry',
        'apologies',
        'got pulled into',
        'lost track of time',
        'make myself available',
        'wanted to flag this',
        'appreciate your patience',
      ];

  const bannedPhrases = [
    'I want to be upfront about what happened',
    'I would like to explain',
    "Here's what happened",
    'I understand that this may have caused',
    'Due to unforeseen circumstances',
    'I encountered an unexpected situation',
    'The situation arose because',
    'I sincerely apologize for any inconvenience caused',
    'My girlfriend is asking',
    'My boss is asking',
    'My manager is asking',
    'My parents are asking',
    'The user',
    'As an AI',
    'Here is an excuse',
    'You can send this',
  ];

  let sentenceLengthGuidance = '1 to 2 natural, conversational sentences.';
  if (ctx.detail === 'short') {
    sentenceLengthGuidance = '1 concise, punchy sentence without filler or unnecessary explanation.';
  } else if (ctx.detail === 'detailed') {
    sentenceLengthGuidance = '2 to 3 natural sentences with clear context and follow-through, avoiding fabricated unprovided facts.';
  }

  const cadence = isPersonal
    ? 'Natural casual texting cadence with conversational contractions, unforced rhythm, and authentic warmth.'
    : 'Clear, polite, direct professional phrasing with concise accountability and no corporate jargon.';

  const hesitationGuidance =
    emotionalContext.trustSensitivity === 'high' || emotionalContext.trustSensitivity === 'critical'
      ? 'Acknowledge how it looked naturally (e.g. "I know it probably looked like I was ignoring you") without groveling.'
      : 'Keep direct and simple without excessive hesitation or over-apologizing.';

  const overExplanationTrap =
    'Do not invent elaborate dramatic crises (hospitals, dead pets, complex medical issues) unless the user explicitly stated them. Real people use simple, grounded everyday reasons.';

  return {
    sentenceLengthGuidance,
    cadence,
    contractionsPreferred: true,
    allowedNaturalPhrases,
    bannedPhrases,
    hesitationGuidance,
    overExplanationTrap,
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
  if (text.includes('wifi') || text.includes('internet') || text.includes('computer') || text.includes('laptop') || text.includes('battery') || text.includes('phone died')) {
    return 'technical_problem';
  }
  if (text.includes("didn't see") || text.includes('missed your call') || text.includes('silent') || text.includes('notification') || text.includes('reply') || text.includes('online')) {
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

// ─── Perform Comprehensive Reasoning Analysis Pipeline ──────────────────────
export function analyzeContext(ctx: ExcuseContext): ReasoningAnalysis {
  const strategy = inferReasonStrategy(ctx);
  const safetyPassed = evaluateSafety(ctx.userInput);
  const contextAnalysis = analyzeUserContextInput(ctx.userInput);
  const relDynamics = inferRelationshipDynamics(ctx.relationship, ctx.category, ctx.userInput);
  const emotionalContext = inferEmotionalContext(ctx, contextAnalysis, relDynamics);
  const userGoal = inferUserGoal(ctx, contextAnalysis);
  const emotionalStructure = determineEmotionalResponseStructure(ctx, relDynamics, emotionalContext, userGoal);
  const naturalGuidance = determineNaturalCommunicationGuidance(ctx, relDynamics, emotionalContext);
  const outcomeGoal = OUTCOME_GOALS[ctx.outcome] || OUTCOME_GOALS.explain;
  const retrievedKnowledge = retrieveRelevantKnowledge(ctx, 2);

  return {
    stage1_understanding: {
      event: ctx.situation?.label || 'Social situation',
      immediateProblem: contextAnalysis.inferredDilemma || ctx.situation?.description || 'Need an explanation',
      targetPerson: ctx.relationship,
      userIntent: `Aiming to ${ctx.outcome} with ${ctx.tone} tone and ${ctx.detail} detail. Goal: ${userGoal.dominantGoal}`,
      isProblemDescriptionOnly: contextAnalysis.isProblemDescriptionOnly,
      hasUserProvidedReason: contextAnalysis.hasUserProvidedReason,
      userSuppliedReason: contextAnalysis.userSuppliedReason,
    },
    stage2_contextSynthesis: {
      baseSituationLabel: ctx.situation?.label || 'General',
      userSpecificDetails: ctx.userInput,
      primaryFocus: contextAnalysis.hasUserProvidedReason
        ? `Use user-supplied reason: "${contextAnalysis.userSuppliedReason}" directly in the message`
        : `User described a dilemma without a specific cause; generate a believable everyday ${strategy} reason`,
    },
    stage3_relationshipNuance: {
      relationship: relDynamics.relationship,
      communicationStyle: relDynamics.communicationStyle,
      accountabilityLevel: relDynamics.accountabilityLevel,
    },
    stage4_severityCalibration: {
      severity: ctx.severity,
      plausibilityRequirement:
        ctx.severity === 'critical'
          ? 'Requires utmost sincerity, high accountability, and believable constraints without dramatic fabrication.'
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
      lengthGuidance: naturalGuidance.sentenceLengthGuidance,
    },
    relationshipDynamics: relDynamics,
    emotionalContext,
    userGoal,
    emotionalResponseStructure: emotionalStructure,
    naturalCommunication: naturalGuidance,
    selectedStrategy: strategy,
    safetyCheckPassed: safetyPassed,
    retrievedKnowledge,
  };
}
