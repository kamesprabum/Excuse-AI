import type {
  CategoryId,
  DetailLevel,
  Relationship,
  Severity,
  Tone,
  DesiredOutcome,
} from '../../../types';
import type { ReasonStrategy, ExcuseContext } from '../types';

export type KnowledgeCategory =
  | CategoryId
  | 'friendship'
  | 'everyday_social'
  | 'academic'
  | 'work'
  | 'relationship'
  | 'family';

export interface FollowUpPattern {
  questionPattern: string;
  responsePattern: string;
}

/**
 * Reusable conversational knowledge record representing a generalized
 * social reasoning pattern derived from situational research.
 *
 * Database-friendly structure compatible with direct persistence in Postgres/Supabase.
 */
export interface KnowledgeRecord {
  id: string;
  category: KnowledgeCategory;
  situation: string;
  recipient: string;
  relationship: Relationship | string;
  userProblem: string;
  reasonStrategy: ReasonStrategy;
  reasonPattern: string;
  deliveryStyle: string;
  tone: Tone | string;
  detailLevel: DetailLevel | string;
  believabilityRule: string;
  avoid: string[];
  followUpPattern: FollowUpPattern | null;
  lesson: string;
  exampleParaphrase: string;
  source?: string;
  confidence?: number; // 0.0 to 1.0
  tags: string[];

  // Emotional communication additions
  emotionalContext?: {
    recipientEmotion?: string;
    userEmotion?: string;
    emotionalImpact?: string;
    repairNeed?: string;
    reassuranceNeed?: string;
    accountabilityNeed?: string;
    emotionalIntensity?: 'mild' | 'moderate' | 'high' | 'deep';
  };
  relationshipDynamics?: string;
  communicationPattern?: string;
  emotionalRepairPattern?: string;
  naturalLanguageSignals?: string[];
}

export interface KnowledgeRetrievalQuery {
  category?: string;
  situation?: string;
  recipient?: string;
  relationship?: string;
  reasonStrategy?: ReasonStrategy;
  tone?: string;
  severity?: Severity;
  outcome?: DesiredOutcome;
  userInput?: string;
  keywords?: string[];
  limit?: number;
}

export interface KnowledgeMatchResult {
  record: KnowledgeRecord;
  score: number;
  matchedCriteria: string[];
}

/**
 * Abstract interface for knowledge retrievers to support swapping
 * local in-memory retrieval with Supabase / vector embeddings in future.
 */
export interface IKnowledgeRetriever {
  retrieveRelevantKnowledge(
    context: ExcuseContext,
    limit?: number
  ): Promise<KnowledgeRecord[]> | KnowledgeRecord[];
}
