import {
  buildGenerationPrompt,
  buildRefinementPrompt,
} from '../src/services/intelligence/promptEngine';
import type {
  ExcuseContext,
  RefinementAction,
} from '../src/services/intelligence/types';
import type { GeneratedExcuse } from '../src/types';

export interface GroqServerResponse {
  status: number;
  body: {
    success: boolean;
    data?: GeneratedExcuse;
    error?: string;
    code?: string;
  };
}

const VALID_CATEGORIES = new Set(['work', 'relationship', 'family']);
const VALID_RELATIONSHIPS = new Set([
  'boss',
  'coworker',
  'partner',
  'friend',
  'parent',
  'teacher',
  'client',
  'other',
]);
const VALID_TONES = new Set(['casual', 'professional', 'polite', 'direct', 'apologetic']);
const VALID_DETAILS = new Set(['short', 'natural', 'detailed']);
const VALID_OUTCOMES = new Set(['explain', 'postpone', 'cancel', 'get_out', 'soften']);
const VALID_SEVERITIES = new Set(['mild', 'moderate', 'critical']);
const VALID_ACTIONS = new Set([
  'generate',
  'shorter',
  'more_casual',
  'more_believable',
  'change_tone',
]);

export function validateExcuseContext(ctx: any): ctx is ExcuseContext {
  if (!ctx || typeof ctx !== 'object') return false;
  if (typeof ctx.userInput !== 'string') return false;
  if (!VALID_CATEGORIES.has(ctx.category)) return false;
  if (!VALID_RELATIONSHIPS.has(ctx.relationship)) return false;
  if (!VALID_TONES.has(ctx.tone)) return false;
  if (!VALID_DETAILS.has(ctx.detail)) return false;
  if (!VALID_OUTCOMES.has(ctx.outcome)) return false;
  if (!VALID_SEVERITIES.has(ctx.severity)) return false;
  return true;
}

export async function handleGroqGenerateRequest(
  payload: any,
  apiKeyOverride?: string,
  modelOverride?: string
): Promise<GroqServerResponse> {
  const apiKey = (apiKeyOverride || process.env.GROQ_API_KEY || '').trim();

  if (!apiKey) {
    return {
      status: 503,
      body: {
        success: false,
        error: 'GROQ_API_KEY is not configured on the server. Using local fallback.',
        code: 'KEY_MISSING',
      },
    };
  }

  const action = payload?.action;
  if (!action || !VALID_ACTIONS.has(action)) {
    return {
      status: 400,
      body: {
        success: false,
        error: `Invalid or missing action. Must be one of: ${Array.from(VALID_ACTIONS).join(', ')}`,
        code: 'INVALID_ACTION',
      },
    };
  }

  const context = payload?.context;
  if (!validateExcuseContext(context)) {
    return {
      status: 400,
      body: {
        success: false,
        error: 'Invalid or incomplete ExcuseContext payload.',
        code: 'INVALID_CONTEXT',
      },
    };
  }

  let promptPayload;
  if (action === 'generate') {
    promptPayload = buildGenerationPrompt(context);
  } else {
    const current = payload?.current as GeneratedExcuse;
    if (!current || typeof current.excuse !== 'string') {
      return {
        status: 400,
        body: {
          success: false,
          error: 'Missing or invalid current excuse for refinement.',
          code: 'INVALID_REFINEMENT_TARGET',
        },
      };
    }
    promptPayload = buildRefinementPrompt(current, action as RefinementAction, context);
  }

  const model =
    (modelOverride || process.env.GROQ_MODEL || 'openai/gpt-oss-120b').trim();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

function extractJsonObject(text: string): any {
  if (!text || typeof text !== 'string') return null;
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {}

  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    try {
      return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
    } catch {}
  }

  return null;
}

    let res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: promptPayload.systemPrompt },
          { role: 'user', content: promptPayload.userPrompt },
        ],
        temperature: promptPayload.temperature ?? 0.7,
        max_tokens: promptPayload.maxTokens ?? 400,
        response_format: { type: 'json_object' },
      }),
      signal: controller.signal,
    });

    // If Groq strict json_object validator returned 400, retry once without strict json_object constraint
    if (!res.ok && res.status === 400) {
      res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: promptPayload.systemPrompt },
            { role: 'user', content: promptPayload.userPrompt },
          ],
          temperature: promptPayload.temperature ?? 0.7,
          max_tokens: promptPayload.maxTokens ?? 400,
        }),
        signal: controller.signal,
      });
    }

    clearTimeout(timeout);

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      console.warn(`[Groq Server] API returned status ${res.status}: ${errText.slice(0, 200)}`);
      return {
        status: 502,
        body: {
          success: false,
          error: `Groq API responded with status ${res.status}`,
          code: 'GROQ_API_ERROR',
        },
      };
    }

    const data = await res.json();
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent || typeof rawContent !== 'string') {
      return {
        status: 502,
        body: {
          success: false,
          error: 'Groq API returned an empty completion content.',
          code: 'EMPTY_RESPONSE',
        },
      };
    }

    const parsed = extractJsonObject(rawContent);
    if (!parsed || !parsed.excuse || typeof parsed.excuse !== 'string') {
      return {
        status: 502,
        body: {
          success: false,
          error: 'Failed to extract valid excuse structure from AI response.',
          code: 'INVALID_PAYLOAD_STRUCTURE',
        },
      };
    }

    let excuse = parsed.excuse.trim();
    if (
      (excuse.startsWith('"') && excuse.endsWith('"')) ||
      (excuse.startsWith('“') && excuse.endsWith('”'))
    ) {
      excuse = excuse.slice(1, -1).trim();
    }

    const metaPrefixes = [
      /^(here\s+is\s+(an\s+)?(excuse|response|message|text):\s*)/i,
      /^(you\s+could\s+(say|text):\s*)/i,
      /^(i\s+would\s+(say|text):\s*)/i,
      /^(suggested\s+(response|message|excuse):\s*)/i,
      /^(message\s+to\s+send:\s*)/i,
      /^(the\s+reason\s+is:\s*)/i,
      /^(response:\s*)/i,
    ];

    for (const regex of metaPrefixes) {
      excuse = excuse.replace(regex, '').trim();
    }

    const believability = Math.max(
      1,
      Math.min(5, Math.round(Number(parsed.believability) || 4))
    );

    let followUp = null;
    if (
      parsed.followUp &&
      typeof parsed.followUp.question === 'string' &&
      typeof parsed.followUp.answer === 'string' &&
      context.detail !== 'short'
    ) {
      followUp = {
        question: parsed.followUp.question.trim(),
        answer: parsed.followUp.answer.trim(),
      };
    }

    return {
      status: 200,
      body: {
        success: true,
        data: {
          excuse,
          believability,
          followUp,
        },
      },
    };
  } catch (err: any) {
    const isTimeout = err?.name === 'AbortError';
    console.warn(
      `[Groq Server] Request failed: ${isTimeout ? 'Request timed out after 12s' : err?.message}`
    );
    return {
      status: isTimeout ? 504 : 500,
      body: {
        success: false,
        error: isTimeout ? 'AI generation request timed out' : 'Internal generation error',
        code: isTimeout ? 'TIMEOUT' : 'SERVER_ERROR',
      },
    };
  }
}
