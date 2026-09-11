import type { LibraryExcuse } from '@/types';

export const libraryExcuses: LibraryExcuse[] = [
  // WORK
  {
    id: 'lib-w-1',
    category: 'work',
    situation: 'Running late',
    relationship: 'Boss',
    tone: 'professional',
    excuse:
      "I'm running a bit behind this morning — my commute hit unexpected delays. I'll be there as soon as I can and should arrive within the next 20 minutes. Sorry for the inconvenience.",
    followUp: {
      question: "Is everything okay?",
      answer: "Yes, everything's fine — just a traffic issue. I'll be there shortly.",
    },
    tags: ['commute', 'morning', 'delayed'],
  },
  {
    id: 'lib-w-2',
    category: 'work',
    situation: 'Missed a meeting',
    relationship: 'Coworker',
    tone: 'apologetic',
    excuse:
      "I'm really sorry I missed our meeting. I got pulled into an urgent call that ran over and I completely lost track of time. Can we reschedule for sometime this afternoon? I want to make sure we cover everything.",
    followUp: {
      question: "What was the urgent call?",
      answer: "A client issue that needed immediate attention. It's handled now.",
    },
    tags: ['meeting', 'urgent', 'reschedule'],
  },
  {
    id: 'lib-w-3',
    category: 'work',
    situation: "Can't come in",
    relationship: 'Boss',
    tone: 'professional',
    excuse:
      "I won't be able to come in today. I'm not feeling well and think it's best to rest and recover so I'm back to full speed tomorrow. I'll keep an eye on messages for anything urgent.",
    followUp: {
      question: "Will you be in tomorrow?",
      answer: "I'm hoping so — I'll update you first thing in the morning.",
    },
    tags: ['sick', 'absence', 'remote'],
  },
  {
    id: 'lib-w-4',
    category: 'work',
    situation: 'Missed a deadline',
    relationship: 'Boss',
    tone: 'polite',
    excuse:
      "I want to be upfront — I'm going to miss today's deadline. A piece of the work turned out to be more complex than I expected, and rather than rush it I'd rather take an extra day to get it right. I'll have it to you by tomorrow afternoon.",
    followUp: {
      question: "Why didn't you flag it earlier?",
      answer:
        "I thought I could make up the time, and I should have communicated sooner. I'll do better about that next time.",
    },
    tags: ['deadline', 'delay', 'transparency'],
  },
  {
    id: 'lib-w-5',
    category: 'work',
    situation: 'Need to leave early',
    relationship: 'Boss',
    tone: 'professional',
    excuse:
      "I need to leave a bit early today for a personal appointment. I'll make sure everything urgent is wrapped up before I go and I'll be reachable on my phone if anything comes up.",
    followUp: {
      question: "Everything okay?",
      answer: "Yes, just a scheduling thing I can't move. Thanks for understanding.",
    },
    tags: ['leave-early', 'appointment', 'flexible'],
  },
  {
    id: 'lib-w-6',
    category: 'work',
    situation: 'Need to postpone',
    relationship: 'Client',
    tone: 'polite',
    excuse:
      "I wanted to reach out about our scheduled call tomorrow. Something has come up on my end and I'd like to move it to later in the week if possible. Would Thursday or Friday work for you? Apologies for the short notice.",
    followUp: {
      question: "Is there an issue with the project?",
      answer:
        "Not at all — the project is on track. It's just a scheduling conflict on my side.",
    },
    tags: ['postpone', 'client', 'reschedule'],
  },

  // RELATIONSHIP
  {
    id: 'lib-r-1',
    category: 'relationship',
    situation: "Didn't reply",
    relationship: 'Partner',
    tone: 'apologetic',
    excuse:
      "I'm sorry I didn't reply earlier. I saw your message and meant to respond, then got pulled into something and completely forgot to come back to it. That's on me — I'm here now. What were you saying?",
    followUp: {
      question: "Were you ignoring me?",
      answer:
        "No, not at all. I genuinely got distracted and didn't realize how long it had been. I'm sorry.",
    },
    tags: ['reply', 'partner', 'distracted'],
  },
  {
    id: 'lib-r-2',
    category: 'relationship',
    situation: 'Cancel plans',
    relationship: 'Partner',
    tone: 'apologetic',
    excuse:
      "I feel terrible doing this, but I need to cancel tonight. I'm completely drained and I don't think I'll be very good company. I'd rather be honest than show up and be half there. Can we do tomorrow instead?",
    followUp: {
      question: "Are you okay?",
      answer:
        "I'm fine, just genuinely exhausted. A quiet night is what I need. I'll be back to myself tomorrow.",
    },
    tags: ['cancel', 'plans', 'tired'],
  },
  {
    id: 'lib-r-3',
    category: 'relationship',
    situation: "Didn't call",
    relationship: 'Partner',
    tone: 'casual',
    excuse:
      "I know I said I'd call and I didn't — I'm sorry. The evening got away from me and by the time I realized it was already late. Can I call you now, or tomorrow morning?",
    followUp: {
      question: "What kept you busy?",
      answer:
        "Honestly, nothing important — I just lost track of time. Not a great excuse, I know.",
    },
    tags: ['call', 'forgot', 'evening'],
  },
  {
    id: 'lib-r-4',
    category: 'relationship',
    situation: 'Arrived late',
    relationship: 'Friend',
    tone: 'casual',
    excuse:
      "So sorry I'm late — I underestimated how long it would take to get here. I'm about five minutes away. The first round is on me.",
    followUp: {
      question: "Did you just leave?",
      answer:
        "I left later than I should have, yeah. My bad — I'll plan better next time.",
    },
    tags: ['late', 'friend', 'commute'],
  },
  {
    id: 'lib-r-5',
    category: 'relationship',
    situation: 'Need some space',
    relationship: 'Partner',
    tone: 'polite',
    excuse:
      "I want to be honest with you — I've been feeling overwhelmed lately and I think I need a little space to clear my head. It's not about you, it's about me getting back to a better place. Can we take this weekend as some breathing room and talk properly on Monday?",
    followUp: {
      question: "Are we okay?",
      answer:
        "We're okay. I just need to reset a bit. I'll reach out Monday and we can talk things through.",
    },
    tags: ['space', 'overwhelmed', 'honest'],
  },

  // FAMILY
  {
    id: 'lib-f-1',
    category: 'family',
    situation: 'Coming home late',
    relationship: 'Parent',
    tone: 'polite',
    excuse:
      "Sorry I'm late — I lost track of time and should have called. Everything's fine, I'm on my way now and should be home in about 20 minutes. I'll text you next time so you don't worry.",
    followUp: {
      question: "Where were you?",
      answer: "I was at a friend's place. I should have kept an eye on the time.",
    },
    tags: ['late', 'parent', 'communication'],
  },
  {
    id: 'lib-f-2',
    category: 'family',
    situation: "Can't attend",
    relationship: 'Parent',
    tone: 'apologetic',
    excuse:
      "I'm really sorry, but I won't be able to make it this weekend. Something came up that I can't move. I know it's disappointing and I feel bad about it. Can we plan something for next week instead?",
    followUp: {
      question: "What came up?",
      answer:
        "Something I committed to a while ago that I can't reschedule. I'd rather not get into it, but it's just this one weekend.",
    },
    tags: ['attend', 'family-event', 'apologize'],
  },
  {
    id: 'lib-f-3',
    category: 'family',
    situation: 'Forgot something',
    relationship: 'Parent',
    tone: 'apologetic',
    excuse:
      "I completely forgot, and I'm sorry. I should have remembered and I didn't. Is there anything I can do to help now, or make it up to you this week?",
    followUp: {
      question: "How did you forget?",
      answer:
        "I've had a lot going on and it slipped my mind. I know that's not a great reason, but I'm going to be more on top of things.",
    },
    tags: ['forgot', 'parent', 'apologize'],
  },
  {
    id: 'lib-f-4',
    category: 'family',
    situation: "Can't make an event",
    relationship: 'Parent',
    tone: 'polite',
    excuse:
      "I'm gutted, but I can't make it to the event. I have a commitment I can't get out of. I really wanted to be there — can I take you out for dinner instead sometime this week to make up for it?",
    followUp: {
      question: "What commitment?",
      answer:
        "Something at work that came up last minute. I tried to move it but couldn't.",
    },
    tags: ['event', 'cancel', 'make-up'],
  },
  {
    id: 'lib-f-5',
    category: 'family',
    situation: 'Need to explain where you were',
    relationship: 'Parent',
    tone: 'casual',
    excuse:
      "I was at a friend's place working on a project together. I should have let you know before I went — that's on me. Nothing serious, just lost track of time.",
    followUp: {
      question: "Which friend?",
      answer: "Jamie — we've been working on something together. I'll text you next time I go over.",
    },
    tags: ['whereabouts', 'friend', 'project'],
  },
];
