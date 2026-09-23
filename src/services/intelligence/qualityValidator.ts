import type { ExcuseContext } from './types';
import type { GeneratedExcuse } from '../../types';
import { analyzeUserContextInput } from './reasoningEngine';

// ─── Banned Generic AI Language Patterns ─────────────────────────────────────
const BANNED_AI_PATTERNS: Array<{ regex: RegExp; replacement?: string }> = [
  {
    regex: /i\s+want\s+to\s+be\s+upfront\s+about\s+what\s+happened/gi,
    replacement: 'honestly',
  },
  {
    regex: /i\s+would\s+like\s+to\s+explain/gi,
    replacement: 'to be honest',
  },
  {
    regex: /here'?s\s+what\s+happened:?/gi,
    replacement: '',
  },
  {
    regex: /due\s+to\s+unforeseen\s+circumstances/gi,
    replacement: 'something unexpected came up',
  },
  {
    regex: /i\s+encountered\s+an\s+unexpected\s+situation/gi,
    replacement: 'something unexpected came up',
  },
  {
    regex: /the\s+situation\s+arose\s+because/gi,
    replacement: 'what happened was',
  },
  {
    regex: /i\s+sincerely\s+apologize\s+for\s+any\s+inconvenience\s+caused/gi,
    replacement: "I'm really sorry for the delay",
  },
  {
    regex: /i\s+understand\s+that\s+this\s+may\s+have\s+caused\s+inconvenience/gi,
    replacement: 'I know this put you in a tough spot',
  },
  {
    regex: /i\s+am\s+writing\s+to\s+inform\s+you\s+that/gi,
    replacement: 'wanted to let you know that',
  },
];

// Meta-prefixes that should never appear in a direct message
const META_PREFIXES = [
  /^(here\s+is\s+(an?\s+)?(excuse|response|message|text|reply):\s*)/i,
  /^(you\s+could\s+(say|text):\s*)/i,
  /^(i\s+would\s+(say|text):\s*)/i,
  /^(suggested\s+(response|message|excuse):\s*)/i,
  /^(message\s+to\s+send:\s*)/i,
  /^(the\s+reason\s+is:\s*)/i,
  /^(response:\s*)/i,
  /^(reply:\s*)/i,
  /^(message:\s*)/i,
];

// Prompt repetition patterns (e.g. model reciting "My girlfriend is asking why...")
const PROMPT_REPETITIONS = [
  /^(my\s+girlfriend\s+is\s+asking\s+why\s+i\s+didn'?t\s+reply(\s+all\s+day)?[,.:]?\s*)/i,
  /^(my\s+boyfriend\s+is\s+asking\s+why\s+i\s+didn'?t\s+reply(\s+all\s+day)?[,.:]?\s*)/i,
  /^(my\s+boss\s+is\s+asking\s+why\s+i\s+missed\s+the\s+meeting[,.:]?\s*)/i,
  /^(my\s+manager\s+is\s+asking\s+why\s+i\s+missed\s+the\s+meeting[,.:]?\s*)/i,
  /^(my\s+parents\s+are\s+asking\s+why\s+i'?m\s+coming\s+home\s+late[,.:]?\s*)/i,
  /^(the\s+user\s+wants\s+to\s+explain\s+that[,.:]?\s*)/i,
];

export interface QualityValidationResult {
  isValid: boolean;
  sanitizedExcuse: string;
  sanitizedFollowUp: { question: string; answer: string } | null;
  issuesDetected: string[];
  metrics: {
    isFirstPerson: boolean;
    isDirectMessage: boolean;
    avoidsAiCliches: boolean;
    preservesUserFacts: boolean;
    followUpConsistent: boolean;
  };
}

/**
 * Validates and cleanses the raw AI generated response against the 12 Excuse AI quality criteria.
 */
export function validateAndSanitizeResponse(
  rawExcuse: GeneratedExcuse,
  context: ExcuseContext
): QualityValidationResult {
  const issuesDetected: string[] = [];
  let excuse = (rawExcuse.excuse || '').trim();

  // 1. Strip surrounding quotes
  if (
    (excuse.startsWith('"') && excuse.endsWith('"')) ||
    (excuse.startsWith('“') && excuse.endsWith('”')) ||
    (excuse.startsWith("'") && excuse.endsWith("'"))
  ) {
    excuse = excuse.slice(1, -1).trim();
  }

  // 2. Strip Meta-prefixes
  for (const prefix of META_PREFIXES) {
    if (prefix.test(excuse)) {
      issuesDetected.push('meta_prefix_removed');
      excuse = excuse.replace(prefix, '').trim();
    }
  }

  // 3. Strip prompt repetitions (e.g. "My girlfriend is asking...")
  for (const rep of PROMPT_REPETITIONS) {
    if (rep.test(excuse)) {
      issuesDetected.push('prompt_repetition_removed');
      excuse = excuse.replace(rep, '').trim();
    }
  }

  // Capitalize first letter if needed after stripping
  if (excuse.length > 0) {
    excuse = excuse.charAt(0).toUpperCase() + excuse.slice(1);
  }

  // 4. Ban generic AI language clichés
  let avoidsAiCliches = true;
  for (const { regex, replacement } of BANNED_AI_PATTERNS) {
    if (regex.test(excuse)) {
      issuesDetected.push('generic_ai_language_detected');
      avoidsAiCliches = false;
      if (replacement !== undefined) {
        excuse = excuse.replace(regex, replacement).trim();
      }
    }
  }

  // Clean up duplicate spaces or punctuation
  excuse = excuse
    .replace(/\s+/g, ' ')
    .replace(/\s([,.!?])/g, '$1')
    .replace(/([.!?]){2,}/g, '$1')
    .trim();

  // 5. First-person verification
  const firstPersonMarkers = /\b(i|i'm|im|i've|ive|i'll|ill|my|mine|me|we|we're|our)\b/i;
  const isFirstPerson = firstPersonMarkers.test(excuse);
  if (!isFirstPerson) {
    issuesDetected.push('not_first_person');
  }

  // 6. Direct message verification (not advisory/meta)
  const advisoryMarkers = /\b(you should|you can tell them|tell them that|say that you|advise them)\b/i;
  const isDirectMessage = !advisoryMarkers.test(excuse);
  if (!isDirectMessage) {
    issuesDetected.push('advisory_language_detected');
    excuse = excuse.replace(advisoryMarkers, '').trim();
  }

  // 7. Preservation of User-Supplied Facts
  let preservesUserFacts = true;
  const contextAnalysis = analyzeUserContextInput(context.userInput);
  if (contextAnalysis.hasUserProvidedReason && contextAnalysis.userSuppliedReason) {
    const rawFact = contextAnalysis.userSuppliedReason.toLowerCase();
    const excuseLower = excuse.toLowerCase();

    // Check specific keywords from user fact
    if (rawFact.includes('train') && !excuseLower.includes('train')) {
      preservesUserFacts = false;
      issuesDetected.push('factual_train_omitted');
    } else if (rawFact.includes('stations') && !excuseLower.includes('station')) {
      preservesUserFacts = false;
      issuesDetected.push('factual_station_omitted');
    } else if (rawFact.includes('battery') && !excuseLower.includes('battery') && !excuseLower.includes('died')) {
      preservesUserFacts = false;
      issuesDetected.push('factual_battery_omitted');
    }
  }

  // 8. Follow-up consistency verification
  let sanitizedFollowUp: { question: string; answer: string } | null = null;
  let followUpConsistent = true;

  if (rawExcuse.followUp && context.detail !== 'short') {
    let q = (rawExcuse.followUp.question || '').trim();
    let a = (rawExcuse.followUp.answer || '').trim();

    // Clean quotes
    if (q.startsWith('"') && q.endsWith('"')) q = q.slice(1, -1).trim();
    if (a.startsWith('"') && a.endsWith('"')) a = a.slice(1, -1).trim();

    // Strip meta-prefixes
    for (const prefix of META_PREFIXES) {
      q = q.replace(prefix, '').trim();
      a = a.replace(prefix, '').trim();
    }

    // Ban generic AI patterns in follow-up answer
    for (const { regex, replacement } of BANNED_AI_PATTERNS) {
      if (regex.test(a) && replacement !== undefined) {
        a = a.replace(regex, replacement).trim();
      }
    }

    // Check consistency: ensure follow-up answer doesn't introduce bizarre contradictory excuses
    const contradictoryExtremes = /\b(hospital|police|car crash|funeral|died|surgery)\b/i;
    if (contradictoryExtremes.test(a) && !contradictoryExtremes.test(context.userInput)) {
      followUpConsistent = false;
      issuesDetected.push('followup_contradictory_extreme_fabrication');
      // Replace with safe, consistent reassurance
      a = "I was tied up handling things and lost track of time. I really should've messaged you sooner.";
    }

    if (q.length > 0 && a.length > 0) {
      sanitizedFollowUp = { question: q, answer: a };
    }
  }

  return {
    isValid: issuesDetected.length === 0,
    sanitizedExcuse: excuse,
    sanitizedFollowUp,
    issuesDetected,
    metrics: {
      isFirstPerson,
      isDirectMessage,
      avoidsAiCliches,
      preservesUserFacts,
      followUpConsistent,
    },
  };
}
