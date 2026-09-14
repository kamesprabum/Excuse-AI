import type { ExcuseContext, PromptPayload, RefinementAction } from './types';
import { analyzeContext, analyzeUserContextInput } from './reasoningEngine';
import type { GeneratedExcuse } from '../../types';

// ─── Token-Efficient, High-Precision System Prompt ───────────────────────────
const SYSTEM_PROMPT = `You are Excuse AI — an advanced situational intelligence engine.

CRITICAL INSTRUCTION:
Excuse AI is a SITUATION-TO-RESPONSE system, NOT a paraphrasing system.
The user's input describes the social situation or problem they face. Your job is to output the exact, believable message the user can COPY AND SEND directly to the recipient.

RULES:
1. DIRECT 1ST-PERSON VOICE:
   - Output ONLY the message sent TO the recipient (e.g. "I'm so sorry, I got caught up...").
   - NEVER repeat or paraphrase the user's situation (e.g. NEVER say "My girlfriend is asking why..." or "I want to be upfront that...").
   - NO meta-commentary (no "You could say:", "Here is an excuse:", "The reason is:").

2. SITUATION VS REASON:
   - If user input is only a dilemma with NO reason (e.g. "My girlfriend is asking why I didn't reply all day"): Generate a plausible, simple everyday reason (distracted with urgent home task, phone on silent, etc.).
   - If user input includes an explicit cause (e.g. "phone died", "train stopped"): Use that exact cause in the message. Do not invent a different story.

3. BELIEVABILITY & SIMPLICITY:
   - Keep reasons ordinary and natural. Do not invent complex fake specifics (no fake street names, fake timestamps, or fake documents).

4. SEPARATE FOLLOW-UP:
   - Keep follow-up in the "followUp" object.
   - "followUp.question": Realistic question the recipient might ask.
   - "followUp.answer": Consistent response reinforcing the EXACT same reason.

JSON OUTPUT SCHEMA:
{
  "excuse": "Direct message to send to recipient.",
  "believability": 5,
  "reasonStrategy": "unexpected_personal_issue",
  "followUp": {
    "question": "Realistic follow-up question",
    "answer": "Consistent answer reinforcing same reason"
  },
  "reasoningNotes": "Brief 1-sentence note"
}
If detail is 'short', followUp can be null.`;

// ─── Build Generation Prompt ────────────────────────────────────────────────
export function buildGenerationPrompt(ctx: ExcuseContext): PromptPayload {
  const analysis = analyzeContext(ctx);
  const contextAnalysis = analyzeUserContextInput(ctx.userInput);

  const reasonGuidance = contextAnalysis.hasUserProvidedReason
    ? `User supplied cause: "${contextAnalysis.userSuppliedReason}". Use this cause directly.`
    : `User gave dilemma only. Generate a plausible ${analysis.selectedStrategy} reason. Do NOT repeat the prompt.`;

  const userPrompt = `Generate a direct excuse message to send:

- User Context / Situation: "${ctx.userInput || ctx.situation?.prompt || 'Unexpected situation'}"
- Guidance: ${reasonGuidance}
- Recipient: ${ctx.relationship} (${analysis.stage3_relationshipNuance.communicationStyle})
- Severity: ${ctx.severity} | Tone: ${ctx.tone} | Detail: ${ctx.detail} (${analysis.stage7_detailConstraint.lengthGuidance}) | Outcome: ${ctx.outcome}

Return valid JSON. Output ONLY the message to the recipient in "excuse".`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.7,
    maxTokens: 400,
  };
}

// ─── Build Refinement Prompt ────────────────────────────────────────────────
export function buildRefinementPrompt(
  current: GeneratedExcuse,
  action: RefinementAction,
  ctx: ExcuseContext
): PromptPayload {
  let transformationDirective = '';

  switch (action) {
    case 'shorter':
      transformationDirective =
        'Make the excuse punchier and significantly shorter (1 concise sentence). Preserve the exact core reason. Set followUp to null.';
      break;
    case 'more_casual':
      transformationDirective =
        'Make the excuse more casual, relaxed, and conversational. Soften any stiff wording while preserving the core reason.';
      break;
    case 'more_believable':
      transformationDirective =
        'Enhance plausibility. Remove any slight over-explanation. Make it sound 100% grounded and understated.';
      break;
    case 'change_tone':
      transformationDirective = `Shift the tone of the excuse to '${ctx.tone}', maintaining the same underlying reason.`;
      break;
  }

  const userPrompt = `Refine this excuse:

Current: "${current.excuse}"
Action: ${transformationDirective}
Recipient: ${ctx.relationship} | Severity: ${ctx.severity} | Outcome: ${ctx.outcome}

Return refined excuse in the same JSON format. Keep reason chain consistent.`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.7,
    maxTokens: 400,
  };
}
