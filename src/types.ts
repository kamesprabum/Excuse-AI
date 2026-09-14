export type CategoryId = 'work' | 'relationship' | 'family';

export interface Category {
  id: CategoryId;
  label: string;
  description: string;
  icon: string; // lucide icon name
  accent: string; // tailwind gradient classes
}

export interface Situation {
  id: string;
  category: CategoryId;
  label: string;
  prompt: string; // suggested input placeholder
  description: string;
}

export type Relationship =
  | 'boss'
  | 'coworker'
  | 'partner'
  | 'friend'
  | 'parent'
  | 'teacher'
  | 'client'
  | 'other';

export type Tone = 'casual' | 'professional' | 'polite' | 'direct' | 'apologetic';

export type DetailLevel = 'short' | 'natural' | 'detailed';

export type DesiredOutcome =
  | 'explain'
  | 'postpone'
  | 'cancel'
  | 'get_out'
  | 'soften';

export type Severity = 'mild' | 'moderate' | 'critical';

export interface ExcuseRequest {
  situationId: string;
  category: CategoryId;
  userInput: string;
  relationship: Relationship;
  tone: Tone;
  detail: DetailLevel;
  outcome: DesiredOutcome;
  severity: Severity;
}

export interface GeneratedExcuse {
  excuse: string;
  followUp: {
    question: string;
    answer: string;
  } | null;
  believability: number; // 1-5
}

export interface LibraryExcuse {
  id: string;
  category: CategoryId;
  situation: string;
  relationship: string;
  tone: Tone;
  excuse: string;
  followUp: { question: string; answer: string } | null;
  tags: string[];
}

export interface ExampleItem {
  category: CategoryId;
  situation: string;
  context: string;
  excuse: string;
  followUp: { question: string; answer: string } | null;
}

export type View = 'home' | 'situations' | 'library' | 'examples';

export type {
  ExcuseContext,
  ReasonStrategy,
  ReasoningAnalysis,
  AIExcusePayload,
  PromptPayload,
  AIProviderAdapter,
} from '@/services/intelligence/types';
