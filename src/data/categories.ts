import type { Category, CategoryId, Situation } from '@/types';

export const categories: Category[] = [
  {
    id: 'work',
    label: 'Work',
    description: 'Late, missed meetings, deadlines, cancellations',
    icon: 'Briefcase',
    accent: 'from-accent-indigo to-accent-royal-blue',
  },
  {
    id: 'relationship',
    label: 'Relationship',
    description: 'Replying, calling, canceling plans, forgetting',
    icon: 'Heart',
    accent: 'from-accent-pink to-accent-magenta',
  },
  {
    id: 'family',
    label: 'Family',
    description: 'Coming home late, events, commitments, forgetting',
    icon: 'Home',
    accent: 'from-accent-purple to-accent-deep-purple',
  },
];

export const situations: Situation[] = [
  // WORK
  {
    id: 'work-late',
    category: 'work',
    label: 'Running late',
    prompt: "I'm running late to work because…",
    description: 'You need to explain why you are running late',
  },
  {
    id: 'work-cant-come',
    category: 'work',
    label: "Can't come in",
    prompt: "I can't come in today because…",
    description: 'You need to explain why you cannot come in',
  },
  {
    id: 'work-missed-meeting',
    category: 'work',
    label: 'Missed a meeting',
    prompt: 'I missed the meeting because…',
    description: 'You missed a meeting and need to explain',
  },
  {
    id: 'work-leave-early',
    category: 'work',
    label: 'Need to leave early',
    prompt: 'I need to leave early today because…',
    description: 'You need to leave work early',
  },
  {
    id: 'work-missed-deadline',
    category: 'work',
    label: 'Missed a deadline',
    prompt: 'I missed the deadline because…',
    description: 'You missed a deadline and need to explain',
  },
  {
    id: 'work-incomplete',
    category: 'work',
    label: "Didn't complete something",
    prompt: "I didn't complete the task because…",
    description: 'You did not finish something you were supposed to',
  },
  {
    id: 'work-postpone',
    category: 'work',
    label: 'Need to postpone',
    prompt: 'I need to postpone this because…',
    description: 'You need to postpone a work commitment',
  },
  {
    id: 'work-forgot',
    category: 'work',
    label: 'Forgot something',
    prompt: 'I forgot to do something because…',
    description: 'You forgot something important at work',
  },
  {
    id: 'work-cancel',
    category: 'work',
    label: 'Need to cancel a commitment',
    prompt: 'I need to cancel this work commitment because…',
    description: 'You need to cancel a work commitment',
  },

  // RELATIONSHIP
  {
    id: 'rel-no-reply',
    category: 'relationship',
    label: "Didn't reply",
    prompt: "I didn't reply for a while because…",
    description: 'You did not reply to a message',
  },
  {
    id: 'rel-no-call',
    category: 'relationship',
    label: "Didn't call",
    prompt: "I didn't call because…",
    description: 'You did not call when you said you would',
  },
  {
    id: 'rel-forgot',
    category: 'relationship',
    label: 'Forgot something',
    prompt: 'I forgot about something important because…',
    description: 'You forgot something in your relationship',
  },
  {
    id: 'rel-cant-meet',
    category: 'relationship',
    label: "Can't meet",
    prompt: "I can't meet up because…",
    description: 'You cannot meet when you were supposed to',
  },
  {
    id: 'rel-cancel-plans',
    category: 'relationship',
    label: 'Cancel plans',
    prompt: 'I need to cancel our plans because…',
    description: 'You need to cancel plans you made',
  },
  {
    id: 'rel-arrived-late',
    category: 'relationship',
    label: 'Arrived late',
    prompt: 'I arrived late because…',
    description: 'You arrived late to meet someone',
  },
  {
    id: 'rel-no-notice',
    category: 'relationship',
    label: "Didn't notice a message",
    prompt: "I didn't notice your message because…",
    description: 'You did not notice a message for a while',
  },
  {
    id: 'rel-space',
    category: 'relationship',
    label: 'Need some space',
    prompt: 'I need some space because…',
    description: 'You need to ask for some space',
  },
  {
    id: 'rel-forgot-detail',
    category: 'relationship',
    label: 'Forgot an important detail',
    prompt: 'I forgot an important detail because…',
    description: 'You forgot an important detail about someone',
  },

  // FAMILY
  {
    id: 'fam-home-late',
    category: 'family',
    label: 'Coming home late',
    prompt: "I'm coming home late because…",
    description: 'You are coming home later than expected',
  },
  {
    id: 'fam-cant-attend',
    category: 'family',
    label: "Can't attend something",
    prompt: "I can't attend because…",
    description: 'You cannot attend a family event',
  },
  {
    id: 'fam-forgot',
    category: 'family',
    label: 'Forgot something',
    prompt: 'I forgot about something because…',
    description: 'You forgot something for your family',
  },
  {
    id: 'fam-cancel',
    category: 'family',
    label: 'Need to cancel',
    prompt: 'I need to cancel because…',
    description: 'You need to cancel a family commitment',
  },
  {
    id: 'fam-cant-event',
    category: 'family',
    label: "Can't make an event",
    prompt: "I can't make it to the event because…",
    description: 'You cannot make it to a family event',
  },
  {
    id: 'fam-where-were',
    category: 'family',
    label: 'Need to explain where you were',
    prompt: 'I was out because…',
    description: 'You need to explain where you were',
  },
  {
    id: 'fam-postpone',
    category: 'family',
    label: 'Need to postpone',
    prompt: 'I need to postpone this because…',
    description: 'You need to postpone a family commitment',
  },
];

export function getCategory(id: CategoryId): Category | undefined {
  return categories.find((c) => c.id === id);
}

export function getSituationsByCategory(id: CategoryId): Situation[] {
  return situations.filter((s) => s.category === id);
}

export function getSituation(id: string): Situation | undefined {
  return situations.find((s) => s.id === id);
}
