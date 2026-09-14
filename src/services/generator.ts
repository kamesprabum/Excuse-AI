import type {
  CategoryId,
  ExcuseRequest,
  GeneratedExcuse,
  Situation,
} from '@/types';
import { situations } from '@/data/categories';
import {
  intelligenceService,
  type RefinementAction,
} from './intelligence';

export type { RefinementAction };

export interface GenerateOptions {
  variation?: number;
}

// ─── Public Generator API ───────────────────────────────────────────────────
// Delegates to the modular Excuse AI intelligence layer, which manages
// provider adapters (e.g. Groq in future) with automatic local template fallback.

export async function generateExcuse(
  req: ExcuseRequest,
  opts: GenerateOptions = {}
): Promise<GeneratedExcuse> {
  return intelligenceService.generateWithIntelligence(req, opts);
}

export async function refineExcuse(
  current: GeneratedExcuse,
  action: RefinementAction,
  req: ExcuseRequest,
  opts: GenerateOptions = {}
): Promise<GeneratedExcuse> {
  return intelligenceService.refineWithIntelligence(current, action, req, opts);
}

// ─── Situation suggestions for input ────────────────────────────────────────

export function getSuggestionsForCategory(category: CategoryId): Situation[] {
  return situations.filter((s) => s.category === category);
}

