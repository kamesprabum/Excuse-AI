import type {
  CategoryId,
  DesiredOutcome,
  DetailLevel,
  ExcuseRequest,
  GeneratedExcuse,
  Relationship,
  Situation,
  Tone,
} from '@/types';
import { getSituation } from '@/data/categories';
import { situations } from '@/data/categories';

// ─── Templates ──────────────────────────────────────────────────────────────
// The template engine builds believable excuses from contextual fragments.
// This is the mock generation layer — designed to be replaced by a real AI API
// without changing the public interface of `generateExcuse`.

interface Template {
  opener: string;
  core: string;
  closer: string;
  followQ: string;
  followA: string;
}

const relationshipMap: Record<Relationship, string> = {
  boss: 'my manager',
  coworker: 'the team',
  partner: 'you',
  friend: 'you',
  parent: 'you',
  teacher: 'you',
  client: 'you',
  other: 'you',
};

const outcomeOpeners: Record<DesiredOutcome, (r: Relationship) => string> = {
  explain: (r) => `I want to be upfront about what happened`,
  postpone: () => `I need to move something to a later time`,
  cancel: () => `I have to cancel`,
  get_out: () => `I need to step away from this`,
  soften: (r) => `I want to talk about something, and I hope you'll understand`,
};

const toneFlavor: Record<Tone, { prefix: string; suffix: string }> = {
  casual: { prefix: '', suffix: '' },
  professional: {
    prefix: '',
    suffix: ' I appreciate your understanding.',
  },
  polite: { prefix: '', suffix: ' Thank you for understanding.' },
  direct: { prefix: '', suffix: '' },
  apologetic: { prefix: "I'm sorry — ", suffix: ' I really am sorry about this.' },
};

const detailExpansion: Record<DetailLevel, (base: string) => string> = {
  short: (base) => base,
  natural: (base) => `${base}. I should have let you know earlier`,
  detailed: (base) =>
    `${base}. I should have communicated this earlier and I take full responsibility for that. Going forward, I'll make sure this doesn't happen the same way`,
};

// ─── Category-specific core lines ───────────────────────────────────────────

function extractSubject(input: string): string {
  const trimmed = input.trim().replace(/\.$/, '');
  if (!trimmed) return 'something unexpected came up';
  const lower = trimmed.toLowerCase();
  if (lower.startsWith("i can't") || lower.startsWith("i couldn't"))
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (lower.startsWith("i'm") || lower.startsWith("i am"))
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  if (lower.startsWith('i '))
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
}

const categoryFollowUps: Record<CategoryId, { q: string; a: string }> = {
  work: {
    q: 'What was it exactly?',
    a: "It was something time-sensitive that I had to handle before I could step away. It's taken care of now.",
  },
  relationship: {
    q: 'Is everything okay?',
    a: "Yeah, everything's fine — I just got caught up. Nothing serious.",
  },
  family: {
    q: "What kept you?",
    a: "Nothing serious — just something I needed to take care of. I should have let you know sooner.",
  },
};

function buildTemplate(
  req: ExcuseRequest,
  situation: Situation,
  seed: number
): Template {
  const rel = relationshipMap[req.relationship];
  const subject = extractSubject(req.userInput) || 'something unexpected came up';
  const openerFn = outcomeOpeners[req.outcome];
  const opener = openerFn(req.relationship);

  const categoryCores: Record<CategoryId, string[]> = {
    work: [
      `${subject}, and I realize this affects ${rel}. I should have flagged it sooner rather than letting it slip`,
      `${subject}. I know this creates an inconvenience for ${rel}, and I didn't plan for it to happen this way`,
      `I ran into a situation where ${subject.toLowerCase()}, which put me behind. I want to make sure ${rel} isn't left waiting`,
    ],
    relationship: [
      `${subject}. I know that's not a great reason, and I don't want to make it sound like it's nothing — it mattered to ${rel} and I should have been more present`,
      `${subject}. I wasn't trying to ignore ${rel}, and I can see why it felt that way. I should have said something sooner`,
      `${subject}, and by the time I realized, more time had passed than I expected. I know that's not fair to ${rel}`,
    ],
    family: [
      `${subject}. I know ${rel} was expecting me, and I should have been more communicative about it`,
      `${subject}, and I didn't mean to worry ${rel}. I should have picked up the phone`,
      `${subject}. I lost track of time, and I know ${rel} would have appreciated a heads-up`,
    ],
  };

  const cores = categoryCores[req.category];
  const core = cores[seed % cores.length];

  const closer =
    req.outcome === 'cancel' || req.outcome === 'postpone'
      ? 'Can we figure out another time that works'
      : req.outcome === 'get_out'
        ? "I'll follow up as soon as I'm able to"
        : "It won't happen the same way again";

  const follow = categoryFollowUps[req.category];

  return {
    opener,
    core,
    closer,
    followQ: follow.q,
    followA: follow.a,
  };
}

function assembleExcuse(
  req: ExcuseRequest,
  template: Template
): string {
  const flavor = toneFlavor[req.tone];
  const coreExpanded = detailExpansion[req.detail](template.core);

  let excuse = `${flavor.prefix}${template.opener} — ${coreExpanded}. ${template.closer}.${flavor.suffix}`;

  excuse = excuse.replace(/\.\./g, '.').replace(/\s+/g, ' ').trim();
  if (!excuse.endsWith('.')) excuse += '.';

  return excuse;
}

// ─── Variation seed ─────────────────────────────────────────────────────────
// A simple hash so the same input with "regenerate" (incremented variation)
// produces a different but deterministic result.

function hashInput(input: string, variation: number): number {
  let h = 2166136261;
  const s = `${input}:${variation}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// ─── Public API ─────────────────────────────────────────────────────────────

export interface GenerateOptions {
  variation?: number;
}

export async function generateExcuse(
  req: ExcuseRequest,
  opts: GenerateOptions = {}
): Promise<GeneratedExcuse> {
  const variation = opts.variation ?? 0;
  const situation = getSituation(req.situationId);

  if (!situation) {
    throw new Error(`Unknown situation: ${req.situationId}`);
  }

  // Simulate generation latency for UX transition
  await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));

  const seed = hashInput(
    `${req.situationId}|${req.userInput}|${req.relationship}|${req.tone}|${req.detail}|${req.outcome}`,
    variation
  );

  const template = buildTemplate(req, situation, seed);
  const excuse = assembleExcuse(req, template);

  const believability = 3 + (seed % 3); // 3–5

  return {
    excuse,
    followUp:
      req.detail !== 'short'
        ? { question: template.followQ, answer: template.followA }
        : null,
    believability,
  };
}

// ─── Refinement ─────────────────────────────────────────────────────────────

export type RefinementAction =
  | 'shorter'
  | 'more_casual'
  | 'more_believable'
  | 'change_tone';

export async function refineExcuse(
  current: GeneratedExcuse,
  action: RefinementAction,
  req: ExcuseRequest,
  opts: GenerateOptions = {}
): Promise<GeneratedExcuse> {
  const variation = (opts.variation ?? 0) + 1;

  switch (action) {
    case 'shorter':
      return generateExcuse({ ...req, detail: 'short' }, { variation });
    case 'more_casual':
      return generateExcuse({ ...req, tone: 'casual' }, { variation });
    case 'more_believable':
      return generateExcuse({ ...req, detail: 'detailed', tone: 'polite' }, { variation });
    case 'change_tone': {
      const tones: Tone[] = ['casual', 'professional', 'polite', 'direct', 'apologetic'];
      const next = tones[(tones.indexOf(req.tone) + 1) % tones.length];
      return generateExcuse({ ...req, tone: next }, { variation });
    }
    default:
      return current;
  }
}

// ─── Situation suggestions for input ────────────────────────────────────────

export function getSuggestionsForCategory(category: CategoryId): Situation[] {
  return situations.filter((s) => s.category === category);
}
