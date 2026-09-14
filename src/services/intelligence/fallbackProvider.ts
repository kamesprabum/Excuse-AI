import type {
  AIProviderAdapter,
  ExcuseContext,
  RefinementAction,
} from './types';
import type {
  CategoryId,
  DesiredOutcome,
  DetailLevel,
  GeneratedExcuse,
  Relationship,
  Situation,
  Tone,
} from '../../types';
import { getSituation } from '../../data/categories';

// ─── Local Rule & Template Implementation ───────────────────────────────────

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
  explain: () => `I want to be upfront about what happened`,
  postpone: () => `I need to move something to a later time`,
  cancel: () => `I have to cancel`,
  get_out: () => `I need to step away from this`,
  soften: () => `I want to talk about something, and I hope you'll understand`,
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

import { analyzeUserContextInput } from './reasoningEngine';

function extractSubject(input: string, category: CategoryId): string {
  const trimmed = input.trim().replace(/\.$/, '');
  if (!trimmed) return 'something unexpected came up';

  const analysis = analyzeUserContextInput(trimmed);
  if (analysis.hasUserProvidedReason && analysis.userSuppliedReason) {
    const reason = analysis.userSuppliedReason;
    return reason.charAt(0).toUpperCase() + reason.slice(1);
  }

  // If input was just a dilemma (e.g. "My girlfriend is asking why..."), supply a natural reason
  if (category === 'relationship') {
    return 'I got caught up dealing with something at home and lost track of my phone';
  }
  if (category === 'family') {
    return 'Things ran a bit later than expected and I got held up on my way';
  }
  return 'An urgent issue came up that required my immediate attention';
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
  ctx: ExcuseContext,
  situation: Situation,
  seed: number
): Template {
  const rel = relationshipMap[ctx.relationship];
  const subject = extractSubject(ctx.userInput, ctx.category) || 'something unexpected came up';
  const openerFn = outcomeOpeners[ctx.outcome];
  const opener = openerFn(ctx.relationship);

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

  const cores = categoryCores[ctx.category];
  const core = cores[seed % cores.length];

  const closer =
    ctx.outcome === 'cancel' || ctx.outcome === 'postpone'
      ? 'Can we figure out another time that works'
      : ctx.outcome === 'get_out'
      ? "I'll follow up as soon as I'm able to"
      : "It won't happen the same way again";

  const follow = categoryFollowUps[ctx.category];

  return {
    opener,
    core,
    closer,
    followQ: follow.q,
    followA: follow.a,
  };
}

function assembleExcuse(ctx: ExcuseContext, template: Template): string {
  const flavor = toneFlavor[ctx.tone];
  const coreExpanded = detailExpansion[ctx.detail](template.core);

  let excuse = `${flavor.prefix}${template.opener} — ${coreExpanded}. ${template.closer}.${flavor.suffix}`;
  excuse = excuse.replace(/\.\./g, '.').replace(/\s+/g, ' ').trim();
  if (!excuse.endsWith('.')) excuse += '.';

  return excuse;
}

function hashInput(input: string, variation: number): number {
  let h = 2166136261;
  const s = `${input}:${variation}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

// ─── Fallback Provider Class ────────────────────────────────────────────────
export class FallbackProvider implements AIProviderAdapter {
  id = 'fallback-template';
  name = 'Local Template Generator (Offline Fallback)';

  isAvailable(): boolean {
    return true;
  }

  async generate(
    ctx: ExcuseContext,
    opts: { variation?: number } = {}
  ): Promise<GeneratedExcuse> {
    const variation = opts.variation ?? 0;
    const situation =
      ctx.situation ||
      getSituation(ctx.situationId) || {
        id: ctx.situationId || 'custom',
        category: ctx.category || 'work',
        label: 'General situation',
        prompt: '',
        description: 'General explanation',
      };

    // UX latency simulation
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));

    const seed = hashInput(
      `${ctx.situationId}|${ctx.userInput}|${ctx.relationship}|${ctx.tone}|${ctx.detail}|${ctx.outcome}|${ctx.severity}`,
      variation
    );

    const template = buildTemplate(ctx, situation, seed);
    const excuse = assembleExcuse(ctx, template);
    const believability = 3 + (seed % 3);

    return {
      excuse,
      followUp:
        ctx.detail !== 'short'
          ? { question: template.followQ, answer: template.followA }
          : null,
      believability,
    };
  }

  async refine(
    current: GeneratedExcuse,
    action: RefinementAction,
    ctx: ExcuseContext,
    opts: { variation?: number } = {}
  ): Promise<GeneratedExcuse> {
    const variation = (opts.variation ?? 0) + 1;

    switch (action) {
      case 'shorter':
        return this.generate({ ...ctx, detail: 'short' }, { variation });
      case 'more_casual':
        return this.generate({ ...ctx, tone: 'casual' }, { variation });
      case 'more_believable':
        return this.generate({ ...ctx, detail: 'detailed', tone: 'polite' }, { variation });
      case 'change_tone': {
        const tones: Tone[] = ['casual', 'professional', 'polite', 'direct', 'apologetic'];
        const next = tones[(tones.indexOf(ctx.tone) + 1) % tones.length];
        return this.generate({ ...ctx, tone: next }, { variation });
      }
      default:
        return current;
    }
  }
}
