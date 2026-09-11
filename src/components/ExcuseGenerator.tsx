import { useState, useRef, useEffect } from 'react';
import { ArrowUp, ChevronDown, Sliders } from 'lucide-react';
import type {
  Situation,
  Relationship,
  Tone,
  DetailLevel,
  DesiredOutcome,
  ExcuseRequest,
  GeneratedExcuse,
} from '@/types';
import { SituationSelector } from '@/components/SituationSelector';
import { ContextControls } from '@/components/ContextControls';
import { ResultCard } from '@/components/ResultCard';
import { Mascot } from '@/components/Mascot';
import { generateExcuse } from '@/services/generator';

interface ExcuseGeneratorProps {
  initialSituation?: Situation | null;
  onSituationUsed?: () => void;
}

const DEFAULT_RELATIONSHIP: Relationship = 'other';
const DEFAULT_TONE: Tone = 'natural' as Tone;
const DEFAULT_DETAIL: DetailLevel = 'natural';
const DEFAULT_OUTCOME: DesiredOutcome = 'explain';

export function ExcuseGenerator({ initialSituation, onSituationUsed }: ExcuseGeneratorProps) {
  const [situation, setSituation] = useState<Situation | null>(initialSituation ?? null);
  const [input, setInput] = useState('');
  const [showControls, setShowControls] = useState(false);

  const [relationship, setRelationship] = useState<Relationship>(DEFAULT_RELATIONSHIP);
  const [tone, setTone] = useState<Tone>('polite');
  const [detail, setDetail] = useState<DetailLevel>(DEFAULT_DETAIL);
  const [outcome, setOutcome] = useState<DesiredOutcome>(DEFAULT_OUTCOME);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GeneratedExcuse | null>(null);
  const [variation, setVariation] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle external situation selection
  useEffect(() => {
    if (initialSituation) {
      setSituation(initialSituation);
      setInput(initialSituation.prompt);
      // Set sensible defaults based on category
      if (initialSituation.category === 'work') {
        setRelationship('boss');
        setTone('professional');
        setOutcome('explain');
      } else if (initialSituation.category === 'relationship') {
        setRelationship('partner');
        setTone('casual');
        setOutcome('soften');
      } else {
        setRelationship('parent');
        setTone('polite');
        setOutcome('explain');
      }
      onSituationUsed?.();
      textareaRef.current?.focus();
    }
  }, [initialSituation, onSituationUsed]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSituationChange = (s: Situation | null) => {
    setSituation(s);
    if (s && !input.trim()) {
      setInput(s.prompt);
    }
  };

  const canGenerate = situation && input.trim().length > 0 && !loading;

  const handleGenerate = async () => {
    if (!situation || !input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    const req: ExcuseRequest = {
      situationId: situation.id,
      category: situation.category,
      userInput: input.trim(),
      relationship,
      tone,
      detail,
      outcome,
    };

    try {
      const generated = await generateExcuse(req, { variation });
      setResult(generated);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    const nextVar = variation + 1;
    setVariation(nextVar);

    const req: ExcuseRequest = {
      situationId: situation!.id,
      category: situation!.category,
      userInput: input.trim(),
      relationship,
      tone,
      detail,
      outcome,
    };

    setLoading(true);
    setError(null);
    try {
      const generated = await generateExcuse(req, { variation: nextVar });
      setResult(generated);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="w-full">
      {/* Main input card */}
      <div className="relative rounded-2xl bg-ink-900/95 p-3 shadow-2xl shadow-ink-900/20 backdrop-blur-sm md:p-4">
        <div className="flex items-end gap-3">
          <SituationSelector selectedSituation={situation} onSelect={handleSituationChange} />

          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={situation?.prompt ?? "Tell me what happened…"}
            rows={1}
            className="flex-1 resize-none bg-transparent py-2.5 text-base text-white placeholder:text-ink-300 focus:outline-none md:text-lg"
            style={{ minHeight: '44px', maxHeight: '200px' }}
            aria-label="Describe what happened"
          />

          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-accent-violet to-accent-indigo text-white transition-all duration-200 hover:shadow-lg hover:shadow-accent-violet/30 active:scale-90 disabled:cursor-not-allowed disabled:opacity-30 md:h-11 md:w-11"
            aria-label="Generate excuse"
          >
            <ArrowUp size={20} />
          </button>
        </div>

        {/* Context toggle */}
        <div className="mt-2 flex items-center gap-2 border-t border-ink-700/50 pt-2">
          <button
            onClick={() => setShowControls((s) => !s)}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-ink-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            <Sliders size={13} />
            More context
            <ChevronDown size={13} className={`transition-transform ${showControls ? 'rotate-180' : ''}`} />
          </button>

          {situation && (
            <span className="ml-auto text-xs text-ink-400">
              <span className="text-ink-300">{situation.label}</span>
            </span>
          )}
        </div>
      </div>

      {/* Context controls */}
      {showControls && (
        <div className="mt-3 animate-fade-in-up">
          <ContextControls
            relationship={relationship}
            tone={tone}
            detail={detail}
            outcome={outcome}
            onRelationshipChange={setRelationship}
            onToneChange={setTone}
            onDetailChange={setDetail}
            onOutcomeChange={setOutcome}
          />
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="mt-6 flex items-center gap-4 animate-fade-in rounded-2xl bg-ink-900/90 p-6 text-white shadow-xl backdrop-blur-sm">
          <Mascot size={40} expression="thinking" />
          <div className="flex-1">
            <p className="shimmer-text text-base font-medium">Crafting your excuse…</p>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-ink-700">
              <div className="h-full w-1/3 animate-pulse-soft rounded-full bg-gradient-to-r from-accent-violet to-accent-indigo" />
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="mt-6 animate-fade-in rounded-xl border border-red-200 bg-red-50/80 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="mt-6">
          <ResultCard
            excuse={result}
            request={{
              situationId: situation!.id,
              category: situation!.category,
              userInput: input.trim(),
              relationship,
              tone,
              detail,
              outcome,
            }}
            onRegenerate={handleRegenerate}
            onRefined={setResult}
            variation={variation}
          />
        </div>
      )}
    </div>
  );
}
