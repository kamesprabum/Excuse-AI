import { useState } from 'react';
import { Copy, Check, RefreshCw, Scissors, Sparkles, MessageCircle, Repeat } from 'lucide-react';
import type { GeneratedExcuse, ExcuseRequest } from '@/types';
import { refineExcuse, type RefinementAction } from '@/services/generator';
import { Mascot } from '@/components/Mascot';

interface ResultCardProps {
  excuse: GeneratedExcuse;
  request: ExcuseRequest;
  onRegenerate: () => void;
  onRefined: (excuse: GeneratedExcuse) => void;
  variation: number;
}

export function ResultCard({ excuse, request, onRegenerate, onRefined, variation }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const [refining, setRefining] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(excuse.excuse);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = excuse.excuse;
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRefine = async (action: RefinementAction) => {
    setRefining(true);
    try {
      const refined = await refineExcuse(excuse, action, request, { variation });
      onRefined(refined);
    } finally {
      setRefining(false);
    }
  };

  const actions: { label: string; icon: typeof Scissors; action: RefinementAction }[] = [
    { label: 'Shorter', icon: Scissors, action: 'shorter' },
    { label: 'More casual', icon: Sparkles, action: 'more_casual' },
    { label: 'More believable', icon: MessageCircle, action: 'more_believable' },
    { label: 'Change tone', icon: Repeat, action: 'change_tone' },
  ];

  return (
    <div className="animate-scale-in rounded-2xl bg-ink-900/95 p-6 text-white shadow-2xl shadow-ink-900/20 backdrop-blur-sm md:p-8">
      {/* Header row */}
      <div className="mb-4 flex items-center gap-3">
        <Mascot size={36} expression="happy" />
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">Your excuse</p>
          <p className="text-xs text-ink-400">Here's something you can say</p>
        </div>
      </div>

      {/* The excuse */}
      <blockquote className="mb-6 border-l-2 border-accent-pink/70 pl-4 text-lg leading-relaxed text-white/95 md:text-xl">
        "{excuse.excuse}"
      </blockquote>

      {/* Believability indicator */}
      <div className="mb-6 flex items-center gap-3">
        <span className="text-xs text-ink-400">Believability</span>
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i < excuse.believability ? 'bg-accent-pink' : 'bg-ink-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          onClick={handleCopy}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
            copied
              ? 'bg-green-500/20 text-green-300'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
          {copied ? 'Copied' : 'Copy'}
        </button>

        <button
          onClick={onRegenerate}
          disabled={refining}
          className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:bg-white/20 active:scale-95 disabled:opacity-50"
        >
          <RefreshCw size={16} className={refining ? 'animate-spin' : ''} />
          Regenerate
        </button>
      </div>

      {/* Refinement actions */}
      <div className="mb-6 flex flex-wrap gap-2 border-t border-ink-700 pt-4">
        {actions.map((a) => (
          <button
            key={a.action}
            onClick={() => handleRefine(a.action)}
            disabled={refining}
            className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 px-3 py-2 text-xs font-medium text-ink-200 transition-all duration-200 hover:border-ink-500 hover:text-white active:scale-95 disabled:opacity-50"
          >
            <a.icon size={14} />
            {a.label}
          </button>
        ))}
      </div>

      {/* Follow-up */}
      {excuse.followUp && (
        <div className="rounded-xl bg-ink-800/80 p-4">
          <button
            onClick={() => setShowFollowUp((s) => !s)}
            className="flex w-full items-center justify-between text-left"
          >
            <div className="flex items-center gap-2">
              <MessageCircle size={16} className="text-accent-cyan" />
              <span className="text-xs font-semibold uppercase tracking-wide text-ink-300">
                If they follow up
              </span>
            </div>
            <span className="text-xs text-ink-400">{showFollowUp ? 'Hide' : 'Show'}</span>
          </button>

          {showFollowUp && (
            <div className="mt-3 animate-fade-in">
              <p className="text-sm text-ink-300">
                <span className="font-medium text-ink-200">If they ask:</span> "{excuse.followUp.question}"
              </p>
              <p className="mt-2 text-sm text-white/90">
                <span className="font-medium text-ink-200">You could say:</span> "{excuse.followUp.answer}"
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
