import type { ExampleItem } from '@/types';

export const examples: ExampleItem[] = [
  {
    category: 'work',
    situation: "You're late to a meeting.",
    context: 'Your manager is asking what happened.',
    excuse:
      "I got caught up resolving an urgent issue with a client deliverable and completely lost track of time. I should have messaged ahead — sorry for keeping everyone waiting. I'm ready to jump in now if the meeting is still going.",
    followUp: {
      question: "What was the issue?",
      answer:
        "One of the client files came through corrupted and I had to regenerate it before the handoff deadline. It's sorted now.",
    },
  },
  {
    category: 'work',
    situation: "You can't come in today.",
    context: "It's a busy day and your team needs you.",
    excuse:
      "I'm not going to be able to make it in today. I woke up feeling unwell and don't want to risk spreading it around the team. I've already updated my status and flagged anything urgent to Priya. I'll be monitoring messages if anything critical comes up.",
    followUp: {
      question: "Will you be in tomorrow?",
      answer:
        "I'm hoping to be back tomorrow — I'll let you know first thing in the morning either way.",
    },
  },
  {
    category: 'work',
    situation: 'You missed a deadline.',
    context: 'Your boss noticed the deliverable was not submitted.',
    excuse:
      "I want to be upfront — I didn't hit yesterday's deadline. Part of the scope turned out to be more involved than I estimated, and I should have flagged it earlier rather than pushing through. I'm finishing up now and will have it to you by end of day. I'll also send a quick breakdown of what took longer so we can plan better next time.",
    followUp: {
      question: "How much longer do you need?",
      answer:
        "A couple of hours at most — the core work is done, I'm just doing the final review.",
    },
  },
  {
    category: 'relationship',
    situation: "You didn't reply for several hours.",
    context: 'Your partner noticed you were online.',
    excuse:
      "I'm sorry I went quiet. I had the chat open on my laptop and got pulled into something, so it looked like I was around but I wasn't actually checking my phone. That wasn't fair to you. I'm here now — what's up?",
    followUp: {
      question: "What were you doing?",
      answer:
        "Just dealing with some stuff I'd been putting off. Nothing important, but it ate up more time than I expected.",
    },
  },
  {
    category: 'relationship',
    situation: 'You need to cancel plans tonight.',
    context: 'You already agreed to go out with your partner.',
    excuse:
      "I hate to do this, but I need to cancel tonight. I've been running on empty all week and I don't think I'll be very good company — I'd rather be honest than drag you out and be half-present. Can we do tomorrow instead? I'll plan something nice.",
    followUp: {
      question: "Are you okay?",
      answer:
        "Yeah, I'm fine — just genuinely exhausted. A quiet night in is what I need. Tomorrow I'll be back to normal.",
    },
  },
  {
    category: 'relationship',
    situation: "You forgot an important detail.",
    context: 'Your partner brought up something you should have remembered.',
    excuse:
      "You're right, and I'm sorry — that completely slipped my mind. It's not because it doesn't matter to me, I just didn't write it down and it fell through the cracks. Tell me again and this time I'll make sure I don't forget.",
    followUp: {
      question: "How did you forget something like that?",
      answer:
        "Honestly, the last few days have been a blur and I didn't keep track of things the way I should have. Not an excuse — just what happened.",
    },
  },
  {
    category: 'family',
    situation: "You're getting home late.",
    context: 'A parent asks where you were.',
    excuse:
      "Sorry I'm late — I lost track of time at a friend's place and should have called ahead. Everything's fine, I just wasn't paying attention to the clock. I'll text next time so you don't worry.",
    followUp: {
      question: "Whose house were you at?",
      answer:
        "I was at Jamie's. We were working on something and it ran later than I expected.",
    },
  },
  {
    category: 'family',
    situation: "You can't make it to a family event.",
    context: 'Your family is expecting you at a gathering.',
    excuse:
      "I'm really sorry, but I won't be able to make it this weekend. Something came up that I can't move, and I'm gutted because I was looking forward to it. Can we plan something for next week instead? I'd love to make it up to you.",
    followUp: {
      question: "What came up?",
      answer:
        "Something at work I have to handle. I'd rather not get into the details, but it's just this one weekend.",
    },
  },
  {
    category: 'family',
    situation: 'You forgot about a family commitment.',
    context: 'A family member reminds you of something you agreed to.',
    excuse:
      "I completely forgot, and I'm sorry. I should have put it in my calendar the moment we talked about it. I know that's disappointing — is there any way I can still help, or make it up to you this week?",
    followUp: {
      question: "How did you forget?",
      answer:
        "I've had a lot on my plate lately and I just didn't keep track of it. I know that's not a great reason, but I'm going to be more careful from now on.",
    },
  },
];
