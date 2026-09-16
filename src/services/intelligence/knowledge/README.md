# Excuse AI — Knowledge Base Foundation

The **Knowledge Layer** is an internal situational intelligence subsystem for Excuse AI. It transforms real-world and conversational communication patterns into structured, reusable behavioral guidance.

Rather than generating generic excuses or merely paraphrasing user input, Excuse AI uses this knowledge layer to understand:
$$\text{User Situation} \longrightarrow \text{Social Context} \longrightarrow \text{Reasoning Pattern} \longrightarrow \text{Explanation} \longrightarrow \text{Consistent Follow-up}$$

---

## 1. KnowledgeRecord Structure

Each record is defined in [`types.ts`](./types.ts) and represents a generalized conversational pattern:

```typescript
export interface KnowledgeRecord {
  id: string;                                   // e.g. 'kb-work-001'
  category: KnowledgeCategory;                  // 'work' | 'relationship' | 'family' | 'friendship' | 'everyday_social'
  situation: string;                            // Brief description of the situational context
  recipient: string;                            // Target recipient (e.g. 'boss', 'girlfriend', 'friend')
  relationship: Relationship | string;          // Core relationship taxonomy
  userProblem: string;                          // Underlying dilemma or friction point
  reasonStrategy: ReasonStrategy;               // Strategy taxonomy (e.g. 'transportation_problem', 'simple_oversight')
  reasonPattern: string;                        // Step-by-step communication pattern (e.g. acknowledge -> explain -> propose ETA)
  deliveryStyle: string;                        // Delivery tone and posture guidance
  tone: Tone | string;                          // Expected tone ('casual', 'professional', 'polite', etc.)
  detailLevel: DetailLevel | string;            // 'short' | 'natural' | 'detailed'
  believabilityRule: string;                    // Grounded rule determining what makes the explanation credible
  avoid: string[];                              // Behaviors/phrases to strictly avoid
  followUpPattern: {                            // Realistic follow-up Q&A pattern
    questionPattern: string;
    responsePattern: string;
  } | null;
  lesson: string;                               // Key takeaway
  exampleParaphrase: string;                    // Grounded example paraphrase
  source?: string;                              // Source classification
  confidence?: number;                          // Confidence rating (0.0 - 1.0)
  tags: string[];                               // Retrieval and taxonomy tags
}
```

---

## 2. How Retrieval Works

The knowledge retriever ([`knowledgeRetriever.ts`](./knowledgeRetriever.ts)) computes a composite relevance score for each candidate record:

1. **Category Matching (25 pts)**: Exact match or related category (e.g., relationship $\leftrightarrow$ friendship).
2. **Relationship / Recipient Matching (25 pts)**: Recipient alignment (e.g., boss, coworker, partner).
3. **Reason Strategy Matching (25 pts)**: Matches the inferred or targeted strategy (`scheduling_conflict`, `health_related`, etc.).
4. **Tone Compatibility (10 pts)**: Tone alignment with the user's selected preference.
5. **Keyword & Tag Overlap (up to 35 pts)**: Extracted lexical tokens from the user input against record tags and user problem descriptions.
6. **Factual Cause Preservation (40 pts)**: Special boost when the user provided an explicit event (e.g., "train stopped between stations") to ensure facts are strictly preserved.

Top-ranked patterns are selected (default top-2) and passed to the reasoning analysis pipeline.

---

## 3. How Knowledge Reaches the Prompt Engine

```
User Request
    │
    ▼
Reasoning Engine (analyzeContext)
    │
    ├── Extracts User-Supplied Reason vs Dilemma-Only
    ├── Infers Reason Strategy
    └── Calls retrieveRelevantKnowledge(context)
            │
            ▼
Prompt Engine (buildGenerationPrompt)
    │
    ├── Formats retrieved patterns as BEHAVIORAL GUIDANCE
    │   (Flow, Believability Rule, Avoid list, Follow-up Guide)
    └── Instructs LLM: "Behavioral guides, NOT facts about the user"
            │
            ▼
Groq (GPT-OSS 120B / Llama 3.3)
    │
    ▼
JSON Output Validation & Fallback Handling
```

---

## 4. How to Add a New Knowledge Record

To add a new record to the local dataset, append an entry to `KNOWLEDGE_BASE` in [`knowledgeBase.ts`](./knowledgeBase.ts):

```typescript
{
  id: 'kb-work-006',
  category: 'work',
  situation: 'Unexpected system outage during demo',
  recipient: 'client',
  relationship: 'client',
  userProblem: 'Live demo crashed due to infrastructure error',
  reasonStrategy: 'technical_problem',
  reasonPattern: 'acknowledge outage calmly → clarify recovery ETA → offer recorded walk-through or rescheduled slot',
  deliveryStyle: 'calm and solutions-oriented',
  tone: 'professional',
  detailLevel: 'natural',
  believabilityRule: 'Acknowledging technical disruptions transparently without panicking conveys competence.',
  avoid: ['blaming cloud provider repeatedly', 'promising instant magic fixes'],
  followUpPattern: {
    questionPattern: 'When can we see the finished workflow?',
    responsePattern: 'Commit to sharing a loom video within 2 hours once the server restarts.'
  },
  lesson: 'A calm recovery plan turns a technical failure into a demonstration of composure.',
  exampleParaphrase: 'We are experiencing a temporary server timeout on the staging environment. Let me send a recorded demo shortly and we can reschedule our live review for tomorrow morning.',
  source: 'technical-client-patterns',
  confidence: 0.95,
  tags: ['technical_problem', 'outage', 'demo', 'client', 'work']
}
```

---

## 5. Migrating from Local Retriever to Supabase / Vector Search

The knowledge architecture uses the `IKnowledgeRetriever` interface:

```typescript
export interface IKnowledgeRetriever {
  retrieveRelevantKnowledge(
    context: ExcuseContext,
    limit?: number
  ): Promise<KnowledgeRecord[]> | KnowledgeRecord[];
}
```

### Future Supabase Implementation:
1. Store records in a `knowledge_records` PostgreSQL table with `pgvector` embeddings on `situation + userProblem + tags`.
2. Implement `SupabaseKnowledgeRetriever`:
   ```typescript
   export class SupabaseKnowledgeRetriever implements IKnowledgeRetriever {
     async retrieveRelevantKnowledge(context: ExcuseContext, limit = 3): Promise<KnowledgeRecord[]> {
       // Query Supabase RPC with pgvector match + relational filters
       const { data } = await supabase.rpc('match_knowledge_records', {
         query_embedding: await getEmbedding(context.userInput),
         filter_category: context.category,
         match_limit: limit
       });
       return data;
     }
   }
   ```
3. Swap `localKnowledgeRetriever` in [`knowledgeRetriever.ts`](./knowledgeRetriever.ts) without altering `reasoningEngine.ts`, `promptEngine.ts`, or any UI components.
