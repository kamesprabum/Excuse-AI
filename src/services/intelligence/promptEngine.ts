import type { ExcuseContext, PromptPayload, RefinementAction } from './types';
import { analyzeContext } from './reasoningEngine';
import type { GeneratedExcuse } from '../../types';

// ─── Token-Efficient, High-Precision System Prompt ───────────────────────────
const SYSTEM_PROMPT = `You are Excuse AI — an advanced situational intelligence and human communication engine.

PRIMARY MISSION:
You generate the EXACT, NATURAL FIRST-PERSON MESSAGE the user can directly say or text to the recipient.
You are NOT an assistant giving advice.
You do NOT explain what the user should say.
You do NOT provide meta-commentary, preambles, or analysis in "excuse".

CRITICAL PRINCIPLES:

1. DIRECT 1ST-PERSON COMMUNICATION:
   - Output ONLY the words the user sends to the recipient (e.g., "Sorry, I got caught up with stuff and completely lost track of my phone. I should've messaged you earlier.").
   - NEVER repeat or paraphrase the user's situation prompt (NEVER start with "My girlfriend is asking why...", "My manager noticed...", "The user wanted...", or "The situation arose because...").
   - NEVER include meta-prefixes (no "Here is a message:", "You could say:", "Suggested response:").

2. STRICTLY BAN GENERIC AI LANGUAGE & CORPORATE CLICHÉS:
   - The message must sound like a REAL PERSON talking or texting, never an AI assistant.
   - BANNED PHRASES:
     * "I want to be upfront about what happened"
     * "I would like to explain"
     * "Here's what happened"
     * "I understand that this may have caused"
     * "Due to unforeseen circumstances"
     * "I encountered an unexpected situation"
     * "The situation arose because"
     * "I sincerely apologize for any inconvenience caused"
     * "I am writing to inform you"
   - Use natural conversational rhythm, contractions ("I'm", "didn't", "should've", "wasn't"), and everyday wording.
   - Conversational words ("yeah", "honestly", "actually", "sorry", "I know", "I should've", "I didn't mean to") should only be used when they fit naturally. Never insert fillers mechanically.

3. EMOTIONAL CALIBRATION & REPAIR (NO MANIPULATION):
   - Calibrate emotional intensity to match the relationship and situation severity.
   - Do NOT maximize drama or grovel for small issues (e.g. for a routine late text, a simple grounded apology is best, NOT "I feel terrible for hurting your soul").
   - Optimize for sincerity, empathy, relationship awareness, and emotional repair — NEVER psychological manipulation, guilt-tripping, or fake emergencies.

4. PRESERVE USER-PROVIDED FACTS & GROUND UNPROVIDED REASONS:
   - If user input specifies an actual factual event (e.g., "train stopped between stations", "phone battery died", "stuck in traffic"): PRESERVE that exact factual reason. Do NOT replace or contradict it.
   - If user input is only a dilemma (e.g., "My girlfriend is asking why I didn't reply all day"): Generate a simple, grounded, plausible everyday reason (e.g., tied up dealing with something at home, got caught up and lost track of phone). Do NOT invent dramatic catastrophes (hospital visits, deaths, accidents) unless user stated them.

5. SEPARATE & CONSISTENT FOLLOW-UP:
   - "followUp.question": A realistic follow-up question the recipient might ask (e.g., "Why didn't you just text me?" or "Can we reschedule this afternoon?").
   - "followUp.answer": A natural, consistent response that addresses their emotional concern and reinforces the EXACT SAME reason without introducing conflicting excuses.

JSON OUTPUT SCHEMA:
{
  "excuse": "Direct message to send to recipient.",
  "believability": 5,
  "reasonStrategy": "unexpected_personal_issue",
  "followUp": {
    "question": "Realistic follow-up question",
    "answer": "Consistent answer reinforcing same reason"
  },
  "reasoningNotes": "Brief 1-sentence note on emotional calibration"
}
If detail is 'short', followUp can be null.`;

// ─── Build Generation Prompt ────────────────────────────────────────────────
export function buildGenerationPrompt(ctx: ExcuseContext): PromptPayload {
  const analysis = analyzeContext(ctx);
  const {
    stage1_understanding,
    relationshipDynamics,
    emotionalContext,
    userGoal,
    emotionalResponseStructure,
    naturalCommunication,
    selectedStrategy,
    retrievedKnowledge,
  } = analysis;

  // 1. Fact vs Dilemma Guidance
  const factGuidance = stage1_understanding.hasUserProvidedReason
    ? `USER SUPPLIED FACTUAL REASON: "${stage1_understanding.userSuppliedReason}". Preserving this factual reason is MANDATORY. Do NOT invent an alternative.`
    : `USER DESCRIBED A DILEMMA WITHOUT SPECIFIC CAUSE. Generate a simple, believable everyday ${selectedStrategy} reason. Avoid fabricated high-drama crises.`;

  // 2. Behavioral Knowledge Guidance (if retrieved)
  let knowledgeSection = '';
  if (retrievedKnowledge && retrievedKnowledge.length > 0) {
    const topGuidance = retrievedKnowledge
      .map(
        (k, i) =>
          `[Pattern ${i + 1} — ${k.situation}]:
  - Structure: ${k.communicationPattern || k.reasonPattern}
  - Believability Rule: ${k.believabilityRule}
  - Avoid: ${k.avoid.join(', ')}
  ${k.emotionalRepairPattern ? `- Emotional Repair: ${k.emotionalRepairPattern}` : ''}
  ${k.naturalLanguageSignals ? `- Natural Signals: ${k.naturalLanguageSignals.join(' | ')}` : ''}
  ${k.followUpPattern ? `- Follow-up Guidance: If asked "${k.followUpPattern.questionPattern}", reply: "${k.followUpPattern.responsePattern}"` : ''}`
      )
      .join('\n');

    knowledgeSection = `\n8. RETRIEVED KNOWLEDGE PATTERNS (Behavioral guides — NOT facts about the user):\n${topGuidance}\n`;
  }

  const userPrompt = `Generate the exact first-person response message the user can send or say:

1. SITUATION UNDERSTANDING:
- User Context: "${ctx.userInput || ctx.situation?.prompt || 'Unexpected situation'}"
- Factual Status: ${factGuidance}

2. RELATIONSHIP DYNAMICS:
- Recipient: ${relationshipDynamics.relationship} (${relationshipDynamics.dynamicName})
- Core Dynamics: ${relationshipDynamics.coreValues.join(', ')}
- Style: ${relationshipDynamics.communicationStyle}
- Dos: ${relationshipDynamics.communicationDos.join('; ')}
- Don'ts: ${relationshipDynamics.communicationDonts.join('; ')}

3. POSSIBLE EMOTIONAL CONTEXT (Cautious Probabilistic Inferences):
- Recipient Feeling: ${emotionalContext.recipientEmotion}
- Emotional Impact: ${emotionalContext.emotionalImpact}
- User Emotional State: ${emotionalContext.userEmotion}
- Repair Need: ${emotionalContext.repairNeed}
- Emotional Intensity: ${emotionalContext.emotionalIntensity} (Calibrate — do not over-dramatize or under-acknowledge)

4. USER GOAL:
- Dominant Goal: ${userGoal.dominantGoal}
- Secondary Goal: ${userGoal.secondaryGoal || 'none'}
- Goal Rationale: ${userGoal.goalRationale}

5. REASON STRATEGY:
- Selected Strategy: ${selectedStrategy}

6. EMOTIONAL RESPONSE STRUCTURE:
- Archetype: ${emotionalResponseStructure.archetype}
- Sequence: ${emotionalResponseStructure.flowSteps.join(' → ')}
- Flow Description: ${emotionalResponseStructure.structureDescription}

7. NATURAL COMMUNICATION GUIDANCE:
- Cadence: ${naturalCommunication.cadence}
- Length: ${naturalCommunication.sentenceLengthGuidance}
- Allowed Natural Expressions: ${naturalCommunication.allowedNaturalPhrases.join(', ')}
- Anti-Patterns: ${naturalCommunication.overExplanationTrap}
- Tone Setting: ${ctx.tone} | Detail Setting: ${ctx.detail}
${knowledgeSection}
Generate valid JSON matching the schema. The "excuse" field MUST contain the direct message to send.`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.7,
    maxTokens: 450,
  };
}

// ─── Build Refinement Prompt ────────────────────────────────────────────────
export function buildRefinementPrompt(
  current: GeneratedExcuse,
  action: RefinementAction,
  ctx: ExcuseContext
): PromptPayload {
  const analysis = analyzeContext(ctx);
  let transformationDirective = '';

  switch (action) {
    case 'shorter':
      transformationDirective =
        'Make the excuse punchier and significantly shorter (1 concise sentence). Preserve the exact core reason and relationship warmth. Set followUp to null.';
      break;
    case 'more_casual':
      transformationDirective =
        'Make the message more casual, relaxed, and conversational. Use natural contractions and soften any stiff wording while preserving the core reason.';
      break;
    case 'more_believable':
      transformationDirective =
        'Enhance believability. Remove any slight over-explanation or unnecessary elaboration. Ground it in simple everyday reality.';
      break;
    case 'change_tone':
      transformationDirective = `Shift the tone of the message to '${ctx.tone}', maintaining the exact same underlying reason and relationship accountability.`;
      break;
  }

  const userPrompt = `Refine this response message:

Current: "${current.excuse}"
Refinement Action: ${transformationDirective}
Recipient: ${ctx.relationship} (${analysis.relationshipDynamics.communicationStyle})
User Goal: ${analysis.userGoal.dominantGoal}
Core Reason: Preserve the original reason without introducing contradictory excuses.

Return refined response in the same JSON format. Direct 1st-person message only in "excuse".`;

  return {
    systemPrompt: SYSTEM_PROMPT,
    userPrompt,
    temperature: 0.7,
    maxTokens: 450,
  };
}
