import type { KnowledgeRecord } from './types';

/**
 * Curated knowledge base of generalized communication and excuse patterns.
 *
 * Rules:
 * - Generalizes research/dramatic examples into actionable, human conversational patterns.
 * - Stripped of movie-specific names, dialogue, or non-generalizable tropes.
 * - Adheres strictly to safety: NO fabricated deaths, critical illnesses, police/legal fabrications, or fraud.
 * - Provides realistic believability rules and follow-up consistency guidance.
 */
export const KNOWLEDGE_BASE: KnowledgeRecord[] = [
  // ─── WORK CATEGORY ─────────────────────────────────────────────────────────
  {
    id: 'kb-work-001',
    category: 'work',
    situation: 'Missed a project deadline',
    recipient: 'boss',
    relationship: 'boss',
    userProblem: 'Project deliverable was not submitted on time and manager asked for status',
    reasonStrategy: 'simple_oversight',
    reasonPattern:
      'acknowledge delay promptly → briefly explain technical or scope complexity → state exact delivery commitment',
    deliveryStyle: 'accountable and solution-oriented',
    tone: 'professional',
    detailLevel: 'natural',
    believabilityRule:
      'For workplace deadlines, acknowledging scope complexity and providing an immediate finish time is far more credible than inventing external crises.',
    avoid: [
      'blaming colleagues or team members',
      'inventing dramatic personal emergencies',
      'vague open-ended timeframes like "soon"',
      'sounding defensive',
    ],
    followUpPattern: {
      questionPattern: 'Why was this not flagged before the deadline?',
      responsePattern:
        'Explain that you initially expected to resolve the remaining items quickly, take ownership for not flagging it sooner, and give the current completion percentage.',
    },
    lesson:
      'Accountability coupled with a firm, realistic completion ETA preserves trust better than elaborate excuses.',
    exampleParaphrase:
      "I'm sorry for the delay on this. A couple of sections took more time to verify than I planned for, but I'm finishing the final pass now and will send it over by 3 PM.",
    source: 'workplace-communication-patterns',
    confidence: 0.95,
    tags: ['missed_deadline', 'work', 'boss', 'accountability', 'deliverable', 'scope'],
  },
  {
    id: 'kb-work-002',
    category: 'work',
    situation: 'Running late to work or morning standup',
    recipient: 'boss',
    relationship: 'boss',
    userProblem: 'Delayed in transit during morning commute and will arrive after start time',
    reasonStrategy: 'transportation_problem',
    reasonPattern:
      'give proactive notice → cite commute/transit delay concisely → provide realistic arrival ETA',
    deliveryStyle: 'direct and considerate',
    tone: 'professional',
    detailLevel: 'short',
    believabilityRule:
      'Transit and commute delays are universally understood; keeping the explanation under two sentences with a clear ETA sounds natural and professional.',
    avoid: [
      'over-explaining road details or dramatic accident stories',
      'not giving an estimated time of arrival',
      'passive aggressive complaints about public transport',
    ],
    followUpPattern: {
      questionPattern: 'Will you miss the start of the team meeting?',
      responsePattern:
        'Indicate whether you can dial in on mobile or if you have asked a peer to cover your update.',
    },
    lesson:
      'Giving an ETA before you are officially late transforms an excuse into responsible communication.',
    exampleParaphrase:
      "I'm running about 20 minutes behind due to an unexpected delay on my commute. I should be at my desk by 9:30.",
    source: 'commute-delay-patterns',
    confidence: 0.96,
    tags: ['running_late', 'commute', 'transit', 'boss', 'work', 'eta', 'morning'],
  },
  {
    id: 'kb-work-003',
    category: 'work',
    situation: 'Missed a scheduled 1-on-1 or team meeting',
    recipient: 'boss',
    relationship: 'boss',
    userProblem: 'Did not join a scheduled meeting on time due to conflicting task or calendar oversight',
    reasonStrategy: 'scheduling_conflict',
    reasonPattern:
      'apologize immediately → state the overlapping task or calendar mix-up → request immediate reschedule slot',
    deliveryStyle: 'humble and proactive',
    tone: 'apologetic',
    detailLevel: 'natural',
    believabilityRule:
      'People miss meetings due to urgent work or calendar overlaps; being prompt to reschedule shows you value their time.',
    avoid: [
      'acting as if the meeting did not matter',
      'inventing complicated technological failures',
      'waiting until hours later to reach out',
    ],
    followUpPattern: {
      questionPattern: 'Can we catch up later today?',
      responsePattern:
        'Offer two specific open time windows on your calendar today to make it easy for them.',
    },
    lesson:
      'Offer immediate replacement time slots to neutralize frustration over missed meetings.',
    exampleParaphrase:
      "I'm sorry I missed our meeting. I got pulled into something and lost track of the time. I can make myself available this afternoon if you'd like to reschedule.",
    source: 'workplace-scheduling-patterns',
    confidence: 0.94,
    tags: ['missed_meeting', 'calendar', 'boss', 'manager', 'reschedule', 'urgent_issue'],
    emotionalContext: {
      recipientEmotion: 'inconvenienced by meeting disruption, expecting professional accountability',
      emotionalImpact: 'disrupted schedule or delayed team sync',
      repairNeed: 'immediate ownership, brief reason, availability to reschedule today',
      emotionalIntensity: 'moderate',
    },
    relationshipDynamics: 'Manager-report relationship where respect for time and reliability are paramount',
    communicationPattern: 'acknowledge issue → concise explanation → accountability → next step',
    emotionalRepairPattern: 'restore confidence through promptness and readiness to make up the lost time',
    naturalLanguageSignals: [
      "I'm sorry I missed the meeting",
      'got pulled into',
      'lost track of the time',
      'available this afternoon to reschedule',
    ],
  },
  {
    id: 'kb-work-004',
    category: 'work',
    situation: 'Calling in sick or needing sudden leave',
    recipient: 'boss',
    relationship: 'boss',
    userProblem: 'Woke up unwell or experiencing physical symptoms and cannot perform duties',
    reasonStrategy: 'health_related',
    reasonPattern:
      'state inability to work clearly → cite general illness briefly → outline coverage/urgent handoffs → state return plan',
    deliveryStyle: 'clear and considerate',
    tone: 'polite',
    detailLevel: 'short',
    believabilityRule:
      'Never give graphic medical descriptions; keeping symptoms general (unwell, feverish, food poisoning) is professional and credible.',
    avoid: [
      'graphic or overly detailed medical descriptions',
      'promising to be 100% available while claiming severe illness',
      'leaving colleagues in the dark regarding critical deliverables',
    ],
    followUpPattern: {
      questionPattern: 'Do you expect to be back tomorrow?',
      responsePattern:
        'State that you will check in early tomorrow morning with an update on how you are feeling.',
    },
    lesson:
      'Professional sick notices are concise, cover urgent tasks, and avoid over-explaining bodily symptoms.',
    exampleParaphrase:
      "I'm not feeling well today and won't be able to come in. I've handed off today's critical items to Alex and will update you in the morning regarding tomorrow.",
    source: 'leave-absence-patterns',
    confidence: 0.98,
    tags: ['sick_leave', 'unwell', 'work', 'boss', 'absence', 'health'],
  },
  {
    id: 'kb-work-005',
    category: 'work',
    situation: 'Need to push back on a new task or tight deadline',
    recipient: 'client',
    relationship: 'client',
    userProblem: 'Client requested an unreasonable turnaround time or scope expansion',
    reasonStrategy: 'prior_commitment',
    reasonPattern:
      'affirm the value of the work → explain capacity constraint without complaining → offer achievable timeline',
    deliveryStyle: 'diplomatic and firm',
    tone: 'professional',
    detailLevel: 'natural',
    believabilityRule:
      'Framing a delay as quality control and thoroughness makes postponement sound beneficial to the recipient.',
    avoid: [
      'saying you are overwhelmed or stressed',
      'refusing outright without an alternative date',
      'making promises you know you will break',
    ],
    followUpPattern: {
      questionPattern: 'Is there any way to get a draft sooner?',
      responsePattern:
        'Offer to share an outline or initial structure while keeping the final deliverable date intact.',
    },
    lesson:
      'Frame postponements around ensuring high standards rather than personal chaos.',
    exampleParaphrase:
      "To ensure we give this the attention and depth it needs, we'll need until Thursday to finalize the draft. Would delivering by Thursday end-of-day work for your review?",
    source: 'client-management-patterns',
    confidence: 0.92,
    tags: ['pushback', 'client', 'deadline', 'capacity', 'work', 'reschedule'],
  },

  // ─── RELATIONSHIP / PARTNER CATEGORY ──────────────────────────────────────
  {
    id: 'kb-rel-001',
    category: 'relationship',
    situation: 'Did not reply to messages all day',
    recipient: 'girlfriend',
    relationship: 'partner',
    userProblem: 'Partner is asking why messages were unread or unanswered throughout the day',
    reasonStrategy: 'unexpected_personal_issue',
    reasonPattern:
      'warm emotional reconnection → simple honest reason for being tied up → acknowledge their feeling → express desire to talk now',
    deliveryStyle: 'warm, conversational, attentive',
    tone: 'casual',
    detailLevel: 'natural',
    believabilityRule:
      'For messaging delays with a partner, emotional warmth and immediate presence matter more than an elaborate excuse. Avoid robotic apologies.',
    avoid: [
      'paraphrasing their question ("You asked why I did not text...")',
      'inventing bizarre high-stakes drama',
      'defensive remarks like "I have a life too"',
      'cold formal language like "I apologize for the inconvenience"',
    ],
    followUpPattern: {
      questionPattern: 'Why did you not at least send a quick text?',
      responsePattern:
        'Honestly admit that you got completely absorbed and lost track of time, without making excuses, and focus on catching up now.',
    },
    lesson:
      'When replying late to a partner, prioritize reassurance and affection over defensive justification.',
    exampleParaphrase:
      "Sorry, I know it probably looked like I was ignoring you. I got caught up with a bunch of stuff and completely lost track of my phone. I should've messaged you earlier.",
    source: 'interpersonal-relationship-patterns',
    confidence: 0.97,
    tags: ['late_reply', 'no_response', 'girlfriend', 'partner', 'relationship', 'texting', 'apology'],
    emotionalContext: {
      recipientEmotion: 'hurt, ignored, or disappointed by the extended silence',
      emotionalImpact: 'feeling deprioritized, neglected, or left on read',
      repairNeed: 'acknowledgment of impact, simple grounded reason, gentle responsibility, and reconnection',
      emotionalIntensity: 'moderate',
    },
    relationshipDynamics: 'Romantic partnership with expectation of mutual emotional presence, attentiveness, and warmth',
    communicationPattern: 'acknowledge impact → concise reason → appropriate responsibility → reconnect',
    emotionalRepairPattern: 'warm reassurance, validating how it felt, and expressing desire to connect now',
    naturalLanguageSignals: [
      'Sorry, I know it probably looked like I was ignoring you',
      'got caught up with a bunch of stuff',
      'completely lost track of my phone',
      "I should've messaged you earlier",
    ],
  },
  {
    id: 'kb-rel-004',
    category: 'relationship',
    situation: 'Was online/active but did not reply to girlfriend or boyfriend',
    recipient: 'girlfriend',
    relationship: 'partner',
    userProblem: 'Partner noticed you were online or active on messaging apps but did not reply to their text',
    reasonStrategy: 'communication_failure',
    reasonPattern:
      'acknowledge how it looked directly → explain quick passive check without room to properly reply → validate their frustration → initiate conversation',
    deliveryStyle: 'honest, transparent, reassuring, attuned',
    tone: 'casual',
    detailLevel: 'natural',
    believabilityRule:
      'Admitting you only opened the app briefly for a specific quick check sounds genuine and disarming. Never deny being online or claim someone else had your phone.',
    avoid: [
      'claiming someone else was using your account or phone',
      'getting defensive with "I am allowed to be online"',
      'cold corporate phrasing or arguing over timestamps',
    ],
    followUpPattern: {
      questionPattern: 'Why did you not at least send a quick reaction or note?',
      responsePattern:
        'Honestly admit you thought you would reply properly in just a moment and got pulled away, and take responsibility without making excuses.',
    },
    lesson:
      'When caught active online, acknowledging the optical impact immediately defuses distrust far better than evasion.',
    exampleParaphrase:
      "I know it looked like I was ignoring you since I was active. I opened the app for two seconds to check a quick work message and had to put it right back down. I'm really sorry, I should've sent you a quick note first. Are you free to call?",
    source: 'digital-relationship-patterns',
    confidence: 0.98,
    tags: ['online', 'active', 'girlfriend', 'partner', 'relationship', 'left_on_read', 'texting'],
    emotionalContext: {
      recipientEmotion: 'uniquely hurt or disrespected seeing partner online while left unaddressed',
      emotionalImpact: 'feeling singled out, bypassed, or dismissed',
      repairNeed: 'direct honesty without evasion, acknowledging the optics, and warm reassurance',
      emotionalIntensity: 'high',
    },
    relationshipDynamics: 'Romantic partnership where perceived intentional omission creates immediate emotional friction',
    communicationPattern: 'acknowledge optics → concise reality → take ownership → focus on them now',
    emotionalRepairPattern: 'validate why it looked hurtful and assure them they are a top priority',
    naturalLanguageSignals: [
      'I know it looked like I was ignoring you',
      'I was active',
      "I'm really sorry",
      "I should've sent you a quick note first",
      'free to call?',
    ],
  },
  {
    id: 'kb-rel-002',
    category: 'relationship',
    situation: 'Canceling dinner or date plans at the last minute',
    recipient: 'partner',
    relationship: 'partner',
    userProblem: 'Too drained or overwhelmed to go out as planned tonight and need to reschedule',
    reasonStrategy: 'unexpected_personal_issue',
    reasonPattern:
      'express genuine regret → honestly explain low energy/exhaustion → propose a specific make-up date',
    deliveryStyle: 'sincere and affectionate',
    tone: 'apologetic',
    detailLevel: 'natural',
    believabilityRule:
      'Admitting fatigue and offering a solid alternative shows respect for their time and affection.',
    avoid: [
      'inventing a sudden fake emergency',
      'leaving the rescheduling vague',
      'sounding indifferent or casual about canceling',
    ],
    followUpPattern: {
      questionPattern: 'Are you feeling okay or is something wrong?',
      responsePattern:
        'Reassure them that everything is fine between you, you just need a quiet night to recharge.',
    },
    lesson:
      'Canceling plans with a romantic partner requires immediate alternative planning to prevent feelings of neglect.',
    exampleParaphrase:
      "I hate to do this, but I'm completely wiped out from this week and I want to be fully present when we hang out. Can we make it up with dinner on Saturday instead? My treat.",
    source: 'dating-commitment-patterns',
    confidence: 0.94,
    tags: ['cancel_date', 'partner', 'exhausted', 'dinner', 'relationship', 'reschedule'],
  },
  {
    id: 'kb-rel-003',
    category: 'relationship',
    situation: 'Forgot an anniversary or significant personal request',
    recipient: 'partner',
    relationship: 'partner',
    userProblem: 'Partner noticed you forgot an agreement, chore, or special request',
    reasonStrategy: 'simple_oversight',
    reasonPattern:
      'own the mistake without deflection → validate their disappointment → offer immediate corrective action',
    deliveryStyle: 'direct accountability',
    tone: 'apologetic',
    detailLevel: 'natural',
    believabilityRule:
      'Deflecting or making up a convoluted story when you forgot something makes it worse; admitting a mental slip is far more credible.',
    avoid: [
      'claiming you "actually remembered" when you clearly did not',
      'blaming work or outside factors exclusively',
      'minimizing the importance of what they asked',
    ],
    followUpPattern: {
      questionPattern: 'How could you forget something that mattered to me?',
      responsePattern:
        'Acknowledge that it was careless, apologize sincerely, and do the corrective action immediately.',
    },
    lesson:
      'Taking clean responsibility without arguing is the quickest way to de-escalate forgotten relationship commitments.',
    exampleParaphrase:
      "You're completely right, and I'm really sorry. That totally slipped my mind and I shouldn't have let that happen. Let me take care of it right now.",
    source: 'relationship-accountability-patterns',
    confidence: 0.93,
    tags: ['forgot', 'partner', 'oversight', 'relationship', 'apology', 'accountability'],
  },

  // ─── FAMILY CATEGORY ───────────────────────────────────────────────────────
  {
    id: 'kb-fam-001',
    category: 'family',
    situation: 'Coming home late to parents',
    recipient: 'parents',
    relationship: 'parent',
    userProblem: 'Parents are waiting and asking why you are returning much later than promised',
    reasonStrategy: 'timing_problem',
    reasonPattern:
      'reassure safety first → explain what held you up concisely → apologize for not sending a heads-up → give exact arrival time',
    deliveryStyle: 'reassuring and respectful',
    tone: 'polite',
    detailLevel: 'short',
    believabilityRule:
      'Parents primarily worry about safety; starting with reassurance ("I am safe / on my way") diffuses tension immediately.',
    avoid: [
      'sounding annoyed or dismissive of their concern',
      'giving overly complex itineraries',
      'ignoring their calls while traveling',
    ],
    followUpPattern: {
      questionPattern: 'Why did you not pick up when we called?',
      responsePattern:
        'Explain that you were driving/transit or had your phone tucked in your bag, and apologize for causing worry.',
    },
    lesson:
      'Addressing safety concerns upfront resolves family tension faster than defending your timetable.',
    exampleParaphrase:
      "Sorry I'm late! Things ran longer than expected and I lost track of time. I'm totally fine and heading home now — should be back in about 20 minutes.",
    source: 'family-communication-patterns',
    confidence: 0.96,
    tags: ['coming_home_late', 'parents', 'family', 'curfew', 'reassurance', 'transit'],
    emotionalContext: {
      recipientEmotion: 'worried about safety, anxious over whereabouts, expecting consideration',
      emotionalImpact: 'parental anxiety, waiting, uncertainty',
      repairNeed: 'immediate reassurance of safety, concise reason for delay, exact ETA',
      emotionalIntensity: 'moderate',
    },
    relationshipDynamics: 'Familial bond centered on safety, care, and respectful communication',
    communicationPattern: 'acknowledge concern → explanation → reassurance → practical update',
    emotionalRepairPattern: 'disarm worry immediately before providing logistical details',
    naturalLanguageSignals: [
      "Sorry I'm late!",
      'Things ran longer than expected',
      "I'm totally fine",
      'heading home now',
      'should be back in',
    ],
  },
  {
    id: 'kb-fam-002',
    category: 'family',
    situation: 'Cannot attend family gathering or dinner',
    recipient: 'parent',
    relationship: 'parent',
    userProblem: 'Need to decline or miss a family gathering due to other unavoidable commitments',
    reasonStrategy: 'prior_commitment',
    reasonPattern:
      'express sadness at missing it → explain existing commitment clearly → arrange a separate visit or call',
    deliveryStyle: 'warm and familial',
    tone: 'polite',
    detailLevel: 'natural',
    believabilityRule:
      'Family members want to feel valued; offering a one-on-one visit later prevents them feeling snubbed.',
    avoid: [
      'dismissing the family event as boring or unimportant',
      'giving last-second notice if you knew earlier',
      'failing to offer a visit alternative',
    ],
    followUpPattern: {
      questionPattern: 'Can you not come even for an hour?',
      responsePattern:
        'Gently explain the timing conflict prevents it, but confirm your upcoming visit date.',
    },
    lesson:
      'Softening family cancellations with an explicit follow-up plan maintains family bonds.',
    exampleParaphrase:
      "I'm so sorry, but I won't be able to make it to dinner this Sunday because of a prior commitment I couldn't move. Can I come over next Tuesday evening instead so we can spend proper time together?",
    source: 'family-gathering-patterns',
    confidence: 0.95,
    tags: ['family_dinner', 'gathering', 'parent', 'family', 'absence', 'reschedule'],
  },
  {
    id: 'kb-fam-003',
    category: 'family',
    situation: 'Forgot a family errand or chore',
    recipient: 'parent',
    relationship: 'parent',
    userProblem: 'Forgot to pick up groceries or complete a requested task around the house',
    reasonStrategy: 'simple_oversight',
    reasonPattern:
      'admit the oversight immediately → offer to fix it right away or first thing tomorrow',
    deliveryStyle: 'direct and helpful',
    tone: 'apologetic',
    detailLevel: 'short',
    believabilityRule:
      'Errands are routine; simple forgetfulness with quick remediation is the most credible response.',
    avoid: [
      'arguing about who should have done it',
      'making up fake store closures or complex stories',
    ],
    followUpPattern: {
      questionPattern: 'Can you go get it now?',
      responsePattern:
        'Agree to go immediately if the store is open, or give exact time in the morning.',
    },
    lesson:
      'Admitting forgetfulness on routine chores is faster and more believable than inventing obstacles.',
    exampleParaphrase:
      "I completely forgot to pick that up on my way back, I'm so sorry. I can run out right now and grab it.",
    source: 'family-chores-patterns',
    confidence: 0.94,
    tags: ['errand', 'chore', 'forgot', 'parent', 'family', 'household'],
  },

  // ─── FRIENDSHIP CATEGORY ───────────────────────────────────────────────────
  {
    id: 'kb-frn-001',
    category: 'friendship',
    situation: 'Forgot to call a friend back',
    recipient: 'friend',
    relationship: 'friend',
    userProblem: 'Missed a friend call days ago and forgot to return it',
    reasonStrategy: 'simple_oversight',
    reasonPattern:
      'casual friendly greeting → honest admission of losing track of time → warm inquiry into what is new',
    deliveryStyle: 'unpretentious, casual, open',
    tone: 'casual',
    detailLevel: 'short',
    believabilityRule:
      'Friends appreciate authentic casualness; pretending you had a massive emergency for a missed callback feels fake.',
    avoid: [
      'over-dramatic invented crises',
      'overly formal apologies that sound stiff',
      'waiting another week out of awkwardness',
    ],
    followUpPattern: {
      questionPattern: 'What have you been up to?',
      responsePattern:
        'Share a brief, grounded recap of regular life and turn the conversation back to them.',
    },
    lesson:
      'Casual honesty with friends rebuilds momentum faster than dramatic stories.',
    exampleParaphrase:
      "Sorry, I completely forgot to call you back. Things got a bit hectic and it slipped my mind. Free to chat for a few minutes?",
    source: 'friendship-dynamics-patterns',
    confidence: 0.96,
    tags: ['missed_call', 'friend', 'casual', 'callback', 'oversight', 'friendship', 'forgot'],
    emotionalContext: {
      recipientEmotion: 'might feel slightly forgotten or wondering what happened, receptive to casual contact',
      emotionalImpact: 'mild slip in communication, zero high drama',
      repairNeed: 'casual admission of the slip, zero defensive excuses, friendly warmth',
      emotionalIntensity: 'mild',
    },
    relationshipDynamics: 'Close casual friendship where honesty and warmth trump formal protocol',
    communicationPattern: 'acknowledge delay/problem → simple reason → warmth → continue relationship',
    emotionalRepairPattern: 'express genuine desire to talk without dramatic fabrications',
    naturalLanguageSignals: [
      'Sorry, I completely forgot to call you back',
      'Things got a bit hectic',
      'it slipped my mind',
      'Free to chat',
      "Let's catch up",
    ],
  },
  {
    id: 'kb-frn-002',
    category: 'friendship',
    situation: 'Need to bail on social plans due to social battery / exhaustion',
    recipient: 'friend',
    relationship: 'friend',
    userProblem: 'Invited to a party or night out but feeling burned out and wanting to stay in',
    reasonStrategy: 'unexpected_personal_issue',
    reasonPattern:
      'warm tone → straightforward low energy explanation → offer raincheck for next week',
    deliveryStyle: 'relaxed, friendly, direct',
    tone: 'casual',
    detailLevel: 'short',
    believabilityRule:
      'Saying you are completely drained and need a quiet night is relatable and respected among friends.',
    avoid: [
      'elaborate medical fabrications',
      'ghosting without saying anything',
      'acting like you were never invited',
    ],
    followUpPattern: {
      questionPattern: 'Are you sure? We will not stay out late.',
      responsePattern:
        'Politely reiterate that you are really out of steam, but encourage them to have fun and promise to catch up soon.',
    },
    lesson:
      'Honest social exhaustion is widely accepted when delivered with warmth and a future plan.',
    exampleParaphrase:
      "Hey man, I think I'm gonna sit tonight out — I've had a crazy exhausting week and my social battery is at zero. Have fun tonight and let's grab food next week!",
    source: 'social-battery-patterns',
    confidence: 0.95,
    tags: ['social_battery', 'staying_in', 'friend', 'casual', 'hangout', 'tired'],
  },
  {
    id: 'kb-frn-003',
    category: 'friendship',
    situation: 'Running late to meet a friend at a venue',
    recipient: 'friend',
    relationship: 'friend',
    userProblem: 'Running 15-20 minutes late to meet friends at a restaurant or bar',
    reasonStrategy: 'timing_problem',
    reasonPattern:
      'quick heads up → short reason → offer small gesture (e.g. grabbing first round / ordering for them)',
    deliveryStyle: 'breezy and considerate',
    tone: 'casual',
    detailLevel: 'short',
    believabilityRule:
      'Short messages while en route with a playful compensatory gesture keep the friendship relaxed.',
    avoid: [
      'claiming "I am 2 minutes away" when you are 20 minutes away',
      'giving lengthy excuse paragraphs while they wait alone',
    ],
    followUpPattern: {
      questionPattern: 'Should I grab a table?',
      responsePattern:
        'Tell them yes, give your drink or food preference, and confirm your exact distance.',
    },
    lesson:
      'Accurate ETAs prevent friends from waiting uncomfortably outside or wondering where you are.',
    exampleParaphrase:
      "Running about 15 mins late — got stuck trying to find parking! Grab a table if you're there, first drink is on me.",
    source: 'informal-meetup-patterns',
    confidence: 0.97,
    tags: ['running_late', 'friend', 'meetup', 'casual', 'parking', 'transit'],
  },

  // ─── EVERYDAY SOCIAL / GENERAL CATEGORY ───────────────────────────────────
  {
    id: 'kb-soc-001',
    category: 'everyday_social',
    situation: 'Specific unexpected event (e.g. train stopped between stations)',
    recipient: 'other',
    relationship: 'other',
    userProblem: 'The user has an explicit factual cause (e.g. train breakdown, power cut, car issue)',
    reasonStrategy: 'transportation_problem',
    reasonPattern:
      'state the exact factual event directly → explain current status/expected resolution → state next action',
    deliveryStyle: 'factual and grounded',
    tone: 'direct',
    detailLevel: 'natural',
    believabilityRule:
      'When the user supplies a genuine specific reason (like train stopped), PRESERVE the exact fact. Do not invent an alternative reason.',
    avoid: [
      'substituting the user fact with a generic excuse',
      'paraphrasing with robotic introductory meta-text',
      'exaggerating the situation into a catastrophe',
    ],
    followUpPattern: {
      questionPattern: 'Are they saying when it will start moving?',
      responsePattern:
        'State that the conductor announced a temporary hold and you will message as soon as you are moving.',
    },
    lesson:
      'Always preserve explicit user-provided factual obstacles rather than overriding them with generated ones.',
    exampleParaphrase:
      "My train stopped between two stations, so I'm running late. I'll let you know as soon as we're moving again.",
    source: 'factual-preservation-patterns',
    confidence: 0.99,
    tags: ['train_stopped', 'transit', 'factual_cause', 'delay', 'grounded', 'transportation', 'stations'],
    emotionalContext: {
      recipientEmotion: 'waiting for your arrival or update, expecting timely status',
      emotionalImpact: 'timing delay without hostility',
      repairNeed: 'factual status update, realistic timing, proactive communication',
      emotionalIntensity: 'mild',
    },
    relationshipDynamics: 'General schedule coordination where live facts prevent friction',
    communicationPattern: 'state factual event → give status/impact → promise immediate live update',
    emotionalRepairPattern: 'keep them informed proactively so they are never left wondering',
    naturalLanguageSignals: [
      'My train stopped between two stations',
      "so I'm running late",
      "I'll let you know as soon as we're moving again",
      'stalled',
    ],
  },
  {
    id: 'kb-soc-002',
    category: 'everyday_social',
    situation: 'Declining an invitation to an event or party politely',
    recipient: 'acquaintance',
    relationship: 'other',
    userProblem: 'Received an invitation to an event you do not wish to attend',
    reasonStrategy: 'prior_commitment',
    reasonPattern:
      'thank them for the invite → cite prior commitment or quiet weekend plans → wish them a great event',
    deliveryStyle: 'gracious and polite',
    tone: 'polite',
    detailLevel: 'short',
    believabilityRule:
      'A graceful decline needs only appreciation and a gentle constraint. Long justifications look fabricated.',
    avoid: [
      'excessive apologies that make it awkward',
      'promising to stop by when you have no intention to',
      'elaborate fake scheduling gymnastics',
    ],
    followUpPattern: {
      questionPattern: 'Can you drop by later in the night?',
      responsePattern:
        'Politely maintain your boundary and reiterate best wishes for the event.',
    },
    lesson:
      'Polite brevity is the most effective way to decline casual invitations.',
    exampleParaphrase:
      "Thanks so much for the invite! I already have plans that evening so I won't be able to make it, but hope you all have a fantastic time!",
    source: 'social-etiquette-patterns',
    confidence: 0.95,
    tags: ['decline_invitation', 'party', 'social', 'polite', 'boundary', 'prior_commitment'],
  },
  {
    id: 'kb-soc-003',
    category: 'everyday_social',
    situation: 'Need to leave a social event early',
    recipient: 'host',
    relationship: 'friend',
    userProblem: 'Attending a dinner or gathering and need to head out before it ends',
    reasonStrategy: 'timing_problem',
    reasonPattern:
      'compliment the host/event → mention early morning start or responsibility tomorrow → say quiet goodbye without causing a scene',
    deliveryStyle: 'appreciative and discreet',
    tone: 'polite',
    detailLevel: 'short',
    believabilityRule:
      'Having an early morning commitment is universally respected by hosts and requires zero debate.',
    avoid: [
      'making a big announcement that breaks up the party',
      'complaining about being bored',
      'over-explaining your morning schedule',
    ],
    followUpPattern: {
      questionPattern: 'What time is your thing tomorrow?',
      responsePattern:
        'Briefly mention an early start and thank them again for hosting.',
    },
    lesson:
      'Early departures are best framed around upcoming early morning responsibilities and gratitude to the host.',
    exampleParaphrase:
      "Thank you so much for having me, this was lovely! I have to head out a bit early because of an early morning tomorrow, but let's do this again soon.",
    source: 'social-departure-patterns',
    confidence: 0.94,
    tags: ['leave_early', 'host', 'social', 'party', 'early_morning', 'polite'],
  },
];
