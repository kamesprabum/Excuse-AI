import type {
  AIProviderAdapter,
  ExcuseContext,
  RefinementAction,
} from './types';
import type { GeneratedExcuse } from '../../types';

export class GroqProvider implements AIProviderAdapter {
  id = 'groq';
  name = 'Groq AI (Llama 3.3 / GPT-OSS)';

  isAvailable(): boolean {
    return true;
  }

  async generate(
    context: ExcuseContext,
    opts: { variation?: number } = {}
  ): Promise<GeneratedExcuse> {
    const res = await fetch('/api/generate-excuse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action: 'generate',
        context,
        opts,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(
        errBody.error || `Server generation request failed with status ${res.status}`
      );
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Invalid response received from generation API');
    }

    return json.data as GeneratedExcuse;
  }

  async refine(
    current: GeneratedExcuse,
    action: RefinementAction,
    context: ExcuseContext,
    opts: { variation?: number } = {}
  ): Promise<GeneratedExcuse> {
    const res = await fetch('/api/generate-excuse', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        current,
        context,
        opts,
      }),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(
        errBody.error || `Server refinement request failed with status ${res.status}`
      );
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      throw new Error(json.error || 'Invalid response received from refinement API');
    }

    return json.data as GeneratedExcuse;
  }
}
