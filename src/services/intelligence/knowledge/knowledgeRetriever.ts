import type { ExcuseContext } from '../types';
import type {
  IKnowledgeRetriever,
  KnowledgeMatchResult,
  KnowledgeRecord,
} from './types';
import { KNOWLEDGE_BASE } from './knowledgeBase';
import { inferReasonStrategy, analyzeUserContextInput } from '../reasoningEngine';

/**
 * Stopwords to exclude during keyword tokenization
 */
const STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'is',
  'are',
  'was',
  'were',
  'i',
  'my',
  'me',
  'you',
  'your',
  'to',
  'for',
  'in',
  'on',
  'at',
  'by',
  'with',
  'and',
  'or',
  'why',
  'how',
  'what',
  'did',
  'didn\'t',
  'didnt',
  'am',
  'im',
  'i\'m',
  'have',
  'had',
  'asking',
  'tell',
  'need',
  'an',
  'excuse',
]);

function extractKeywords(text: string): string[] {
  if (!text) return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, ' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

/**
 * Evaluates how well a KnowledgeRecord matches the active ExcuseContext.
 * Returns a composite score and matched criteria list.
 */
export function scoreKnowledgeRecord(
  record: KnowledgeRecord,
  context: ExcuseContext,
  inferredStrategy: string,
  userTokens: string[]
): KnowledgeMatchResult {
  let score = 0;
  const matchedCriteria: string[] = [];

  // 1. Category Alignment (Weight: 25)
  const normCategory = context.category.toLowerCase();
  const recCategory = record.category.toLowerCase();
  if (recCategory === normCategory) {
    score += 25;
    matchedCriteria.push('category_exact');
  } else if (
    (normCategory === 'relationship' && (recCategory === 'friendship' || recCategory === 'everyday_social')) ||
    (normCategory === 'work' && recCategory === 'everyday_social')
  ) {
    score += 10;
    matchedCriteria.push('category_related');
  }

  // 2. Relationship / Recipient Alignment (Weight: 25)
  const normRel = context.relationship.toLowerCase();
  const recRel = record.relationship.toLowerCase();
  const recRecipient = record.recipient.toLowerCase();

  if (recRel === normRel || recRecipient === normRel) {
    score += 25;
    matchedCriteria.push('relationship_exact');
  } else if (
    (normRel === 'boss' && (recRel === 'coworker' || recRecipient === 'client')) ||
    (normRel === 'partner' && (recRecipient === 'girlfriend' || recRecipient === 'boyfriend' || recRecipient === 'wife')) ||
    (normRel === 'friend' && recRel === 'other')
  ) {
    score += 15;
    matchedCriteria.push('relationship_compatible');
  }

  // 3. Reason Strategy Alignment (Weight: 25)
  if (record.reasonStrategy === inferredStrategy) {
    score += 25;
    matchedCriteria.push(`strategy_${record.reasonStrategy}`);
  }

  // 4. Tone Compatibility (Weight: 10)
  if (record.tone === context.tone) {
    score += 10;
    matchedCriteria.push('tone_match');
  }

  // 5. Keyword / Tag Overlap (Weight: Up to 35)
  let tagMatchCount = 0;
  const recordSearchText = `${record.situation} ${record.userProblem} ${record.tags.join(' ')} ${record.avoid.join(' ')}`.toLowerCase();

  for (const token of userTokens) {
    // Check if token appears in tags
    if (record.tags.some((tag) => tag.toLowerCase().includes(token) || token.includes(tag.toLowerCase()))) {
      tagMatchCount += 2;
      matchedCriteria.push(`tag_${token}`);
    } else if (recordSearchText.includes(token)) {
      tagMatchCount += 1;
      matchedCriteria.push(`kw_${token}`);
    }
  }

  score += Math.min(35, tagMatchCount * 5);

  // 6. Special Case: Explicit Factual User Reason (e.g. train, flight, flat tire)
  const contextAnalysis = analyzeUserContextInput(context.userInput);
  if (contextAnalysis.hasUserProvidedReason) {
    const rawReason = (contextAnalysis.userSuppliedReason || '').toLowerCase();
    if (
      (rawReason.includes('train') || rawReason.includes('flight') || rawReason.includes('traffic')) &&
      record.id === 'kb-soc-001'
    ) {
      score += 40;
      matchedCriteria.push('preserve_factual_event');
    }
  }

  return {
    record,
    score,
    matchedCriteria,
  };
}

/**
 * Local in-memory knowledge retriever.
 * Deterministically ranks and returns the top relevant records for a given context.
 */
export class LocalKnowledgeRetriever implements IKnowledgeRetriever {
  private records: KnowledgeRecord[];

  constructor(records: KnowledgeRecord[] = KNOWLEDGE_BASE) {
    this.records = records;
  }

  retrieveRelevantKnowledge(
    context: ExcuseContext,
    limit: number = 2
  ): KnowledgeRecord[] {
    if (!this.records || this.records.length === 0) {
      return [];
    }

    const inferredStrategy = inferReasonStrategy(context);
    const userTokens = [
      ...extractKeywords(context.userInput),
      ...extractKeywords(context.situation?.label || ''),
      ...extractKeywords(context.situation?.description || ''),
    ];

    const scored = this.records.map((rec) =>
      scoreKnowledgeRecord(rec, context, inferredStrategy, userTokens)
    );

    // Sort by descending score
    scored.sort((a, b) => b.score - a.score);

    // Take top results above a reasonable relevance baseline
    const topResults = scored
      .filter((s) => s.score > 20)
      .slice(0, Math.max(1, limit))
      .map((s) => s.record);

    // If nothing met the threshold, fallback to best matching category record
    if (topResults.length === 0 && scored.length > 0) {
      return [scored[0].record];
    }

    return topResults;
  }
}

/**
 * Singleton instance for local knowledge retrieval
 */
export const localKnowledgeRetriever = new LocalKnowledgeRetriever();

/**
 * Convenience export for direct functional retrieval
 */
export function retrieveRelevantKnowledge(
  context: ExcuseContext,
  limit: number = 2
): KnowledgeRecord[] {
  return localKnowledgeRetriever.retrieveRelevantKnowledge(context, limit);
}
