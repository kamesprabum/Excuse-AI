import type {
  AIProviderAdapter,
  ExcuseContext,
  RefinementAction,
} from './types';
import type {
  GeneratedExcuse,
  Tone,
} from '../../types';
import { getSituation } from '../../data/categories';
import { analyzeContext } from './reasoningEngine';
import { validateAndSanitizeResponse } from './qualityValidator';

function hashInput(input: string, variation: number): number {
  let h = 2166136261;
  const s = `${input}:${variation}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

export class FallbackProvider implements AIProviderAdapter {
  id = 'fallback-template';
  name = 'Local Human Communication Engine (Offline Fallback)';

  isAvailable(): boolean {
    return true;
  }

  async generate(
    ctx: ExcuseContext,
    opts: { variation?: number } = {}
  ): Promise<GeneratedExcuse> {
    const variation = opts.variation ?? 0;
    const analysis = analyzeContext(ctx);
    const lowerInput = (ctx.userInput + ' ' + (ctx.situation?.label || '')).toLowerCase();
    const rel = analysis.relationshipDynamics.relationship;

    // Simulate light UX responsiveness latency
    await new Promise((r) => setTimeout(r, 400 + Math.random() * 300));

    const seed = hashInput(
      `${ctx.situationId}|${ctx.userInput}|${ctx.relationship}|${ctx.tone}|${ctx.detail}|${ctx.outcome}|${ctx.severity}`,
      variation
    );

    let excuse = '';
    let followUp: { question: string; answer: string } | null = null;

    // 1. Specific User Factual Reason (e.g. Train Stopped, Traffic, etc.)
    if (analysis.stage1_understanding.hasUserProvidedReason) {
      const fact = analysis.stage1_understanding.userSuppliedReason || ctx.userInput;
      if (lowerInput.includes('train') || lowerInput.includes('stations')) {
        excuse = "My train stopped between two stations, so I'm running late. I'll let you know as soon as we're moving again.";
        followUp = {
          question: 'Are they saying when it will start moving?',
          answer: "The conductor announced a temporary hold on the tracks. I'll message you the second we start rolling.",
        };
      } else if (lowerInput.includes('traffic')) {
        excuse = "I'm stuck in unexpected traffic on the way, so I'm running behind. I should be there in about 20 minutes.";
        followUp = {
          question: 'Is it completely backed up?',
          answer: "Yeah, there's a slow patch ahead, but it looks like it's starting to clear up. I'll keep you posted.",
        };
      } else if (lowerInput.includes('forgot') && lowerInput.includes('call')) {
        excuse = "Sorry, I completely forgot to call you back. Things got a bit hectic and it slipped my mind. Free to chat for a few minutes?";
        followUp = {
          question: 'Everything okay on your end?',
          answer: "Yeah, all good! Just got caught up with chores and work. Let's catch up now.",
        };
      } else {
        excuse = `${fact.charAt(0).toUpperCase() + fact.slice(1)}, so I've been delayed. I wanted to reach out directly to let you know.`;
        followUp = {
          question: 'Will you be able to make it soon?',
          answer: "Working through it now and will give you a concrete update shortly.",
        };
      }
    }
    // 2. Romantic Partner
    else if (rel === 'partner' || lowerInput.includes('girlfriend') || lowerInput.includes('boyfriend')) {
      if (lowerInput.includes('online')) {
        const partnerOnlineOptions = [
          "I know it looked like I was ignoring you since I was active. I opened the app for a second to check a quick message and had to put it right back down. I'm really sorry, I should've sent you a note first. Can I call you now?",
          "Sorry, I know it looked bad seeing me online. I was quickly checking something for work and couldn't sit down to reply properly. I definitely should've said something earlier.",
        ];
        excuse = partnerOnlineOptions[seed % partnerOnlineOptions.length];
        followUp = {
          question: "Why didn't you just send a quick heart or reaction?",
          answer: "I honestly thought I'd be able to reply properly a minute later and lost track of time. I didn't mean to make you feel ignored.",
        };
      } else {
        const partnerLateOptions = [
          "Sorry, I know it probably looked like I was ignoring you. I got caught up with a bunch of stuff and completely lost track of my phone. I should've messaged you earlier.",
          "I'm so sorry, my day got completely chaotic and I barely checked my phone. I know I left you hanging and that's not fair to you. Are you free to talk now?",
          "Sorry for the radio silence today. Got tied up with a ton of things at home and lost track of time. How was your day? Can I call you in a few minutes?",
        ];
        excuse = partnerLateOptions[seed % partnerLateOptions.length];
        followUp = {
          question: "Why didn't you just text me earlier?",
          answer: "I honestly got completely absorbed in what I was doing and didn't realize how much time had passed. I should have checked in.",
        };
      }
    }
    // 3. Manager / Boss
    else if (rel === 'boss' || lowerInput.includes('manager') || lowerInput.includes('meeting')) {
      if (lowerInput.includes('meeting') || lowerInput.includes('sync')) {
        excuse = "I'm sorry I missed the meeting. I got pulled into something and lost track of the time. I can make myself available this afternoon if you'd like to reschedule.";
        followUp = {
          question: 'Can you do 3:30 PM today?',
          answer: "Yes, 3:30 works perfectly. I'll send an updated calendar invite now.",
        };
      } else {
        excuse = "I apologize for the delay. I ran into an urgent item that needed immediate resolution. I'm finishing it now and will deliver an update shortly.";
        followUp = {
          question: 'When should we expect this wrapped up?',
          answer: "I'll have the complete deliverable over to you by 3:00 PM today.",
        };
      }
    }
    // 4. Parents
    else if (rel === 'parent' || lowerInput.includes('parent') || lowerInput.includes('mom') || lowerInput.includes('dad')) {
      excuse = "Sorry I'm late! Things ran longer than expected and I lost track of time. I'm totally fine and heading home now — should be back in about 20 minutes.";
      followUp = {
        question: 'Why didn\'t you let us know sooner?',
        answer: "I'm sorry, I was caught up in conversation and didn't realize how late it had gotten. I won't leave you worrying like that.",
      };
    }
    // 5. Friend
    else if (rel === 'friend' || lowerInput.includes('friend')) {
      excuse = "Sorry, I completely forgot to call you back. Things got a bit hectic and it slipped my mind. Free to chat for a bit?";
      followUp = {
        question: 'What have you been up to?',
        answer: "Just running around with regular work and life errands. How have things been with you?",
      };
    }
    // 6. General Fallback
    else {
      excuse = "I'm really sorry for the delay. I got caught up with something unexpected and lost track of time. I should've let you know earlier.";
      followUp = {
        question: 'Is everything taken care of now?',
        answer: "Yes, all sorted now. Thank you for your patience.",
      };
    }

    // Detail calibration
    if (ctx.detail === 'short') {
      followUp = null;
      // Truncate to first sentence if short
      const firstSentence = excuse.split(/[.?!]\s+/)[0];
      if (firstSentence && firstSentence.length > 10) {
        excuse = firstSentence.endsWith('.') ? firstSentence : firstSentence + '.';
      }
    }

    const rawExcuse: GeneratedExcuse = {
      excuse,
      believability: 5,
      followUp,
    };

    const validated = validateAndSanitizeResponse(rawExcuse, ctx);

    return {
      excuse: validated.sanitizedExcuse,
      believability: 5,
      followUp: validated.sanitizedFollowUp,
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
        return this.generate({ ...ctx, detail: 'natural', tone: 'polite' }, { variation });
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
