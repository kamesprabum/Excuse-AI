import type { ExcuseRequest, GeneratedExcuse } from '../../types';
import type { AIProviderAdapter, RefinementAction, ExcuseContext } from './types';
import { createExcuseContext } from './reasoningEngine';
import { FallbackProvider } from './fallbackProvider';
import { GroqProvider } from './groqProvider';
import { validateAndSanitizeResponse } from './qualityValidator';

class IntelligenceService {
  private fallbackProvider: AIProviderAdapter = new FallbackProvider();
  private groqProvider: AIProviderAdapter = new GroqProvider();
  private activeProvider: AIProviderAdapter;
  private registeredProviders: Map<string, AIProviderAdapter> = new Map();

  constructor() {
    this.registerProvider(this.fallbackProvider);
    this.registerProvider(this.groqProvider);
    // Groq is set as primary active provider, with automatic FallbackProvider failover
    this.activeProvider = this.groqProvider;
  }

  registerProvider(provider: AIProviderAdapter): void {
    this.registeredProviders.set(provider.id, provider);
  }

  setActiveProvider(providerId: string): boolean {
    const provider = this.registeredProviders.get(providerId);
    if (provider && provider.isAvailable()) {
      this.activeProvider = provider;
      return true;
    }
    return false;
  }

  getActiveProvider(): AIProviderAdapter {
    return this.activeProvider;
  }

  async generateWithIntelligence(
    req: ExcuseRequest,
    opts: { variation?: number } = {}
  ): Promise<GeneratedExcuse> {
    const context = createExcuseContext(req);

    try {
      if (this.activeProvider.isAvailable()) {
        const result = await this.activeProvider.generate(context, opts);
        return this.normalizeResult(result, context);
      }
    } catch (err) {
      console.warn(
        `[ExcuseAI] Active provider '${this.activeProvider.name}' failed. Falling back to local engine.`,
        err
      );
    }

    // Seamless fallback
    const fallbackResult = await this.fallbackProvider.generate(context, opts);
    return this.normalizeResult(fallbackResult, context);
  }

  async refineWithIntelligence(
    current: GeneratedExcuse,
    action: RefinementAction,
    req: ExcuseRequest,
    opts: { variation?: number } = {}
  ): Promise<GeneratedExcuse> {
    const context = createExcuseContext(req);

    try {
      if (this.activeProvider.isAvailable()) {
        const result = await this.activeProvider.refine(current, action, context, opts);
        return this.normalizeResult(result, context);
      }
    } catch (err) {
      console.warn(
        `[ExcuseAI] Active provider '${this.activeProvider.name}' refinement failed. Falling back to local engine.`,
        err
      );
    }

    const fallbackResult = await this.fallbackProvider.refine(current, action, context, opts);
    return this.normalizeResult(fallbackResult, context);
  }

  private normalizeResult(result: GeneratedExcuse, context?: ExcuseContext): GeneratedExcuse {
    let sanitized = result;
    if (context) {
      const v = validateAndSanitizeResponse(result, context);
      sanitized = {
        excuse: v.sanitizedExcuse,
        believability: result.believability,
        followUp: v.sanitizedFollowUp,
      };
    }

    return {
      excuse: sanitized.excuse.trim(),
      believability: Math.max(1, Math.min(5, Math.round(sanitized.believability || 4))),
      followUp: sanitized.followUp
        ? {
            question: sanitized.followUp.question.trim(),
            answer: sanitized.followUp.answer.trim(),
          }
        : null,
    };
  }
}

export const intelligenceService = new IntelligenceService();
