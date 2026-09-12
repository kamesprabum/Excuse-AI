import { useState, useRef, useEffect } from 'react';
import { Plus, Check, Briefcase, Heart, Home } from 'lucide-react';
import type { CategoryId, Situation } from '@/types';
import { categories, getSituationsByCategory } from '@/data/categories';

interface SituationSelectorProps {
  selectedSituation: Situation | null;
  onSelect: (situation: Situation | null) => void;
}

const iconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Heart,
  Home,
};

export function SituationSelector({ selectedSituation, onSelect }: SituationSelectorProps) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setActiveCategory(null);
      }
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const toggle = () => {
    setOpen((s) => !s);
    if (open) setActiveCategory(null);
  };

  const handleSituationPick = (s: Situation) => {
    onSelect(s);
    setOpen(false);
    setActiveCategory(null);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={toggle}
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-200 active:scale-90 ${
          selectedSituation
            ? 'bg-accent-pink/15 text-accent-pink'
            : 'bg-white/10 text-ink-200 hover:bg-white/20'
        }`}
        aria-label={selectedSituation ? `Situation: ${selectedSituation.label}. Click to change.` : 'Choose a situation'}
        aria-expanded={open}
      >
        {selectedSituation ? <Check size={18} /> : <Plus size={20} />}
      </button>

      {selectedSituation && !open && (
        <span className="absolute top-full left-0 mt-2 whitespace-nowrap rounded-lg bg-ink-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          {selectedSituation.label}
        </span>
      )}

      {open && (
        <div className="absolute bottom-full left-0 mb-3 w-80 origin-bottom-left animate-scale-in rounded-2xl border border-ink-100 bg-white p-3 shadow-2xl shadow-ink-900/10 md:w-96">
          {!activeCategory ? (
            <>
              <p className="mb-3 px-1 text-xs font-semibold uppercase tracking-wide text-ink-400">
                Choose a category
              </p>
              <div className="grid gap-2">
                {categories.map((cat) => {
                  const Icon = iconMap[cat.icon] ?? Briefcase;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className="group flex items-center gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:bg-ink-50"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${cat.accent}`}>
                        <Icon size={18} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink-900">{cat.label}</p>
                        <p className="text-xs text-ink-400">{cat.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={() => setActiveCategory(null)}
                  className="rounded-lg px-2 py-1 text-xs font-medium text-ink-400 transition-colors hover:bg-ink-100 hover:text-ink-700"
                >
                  ← Back
                </button>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  {categories.find((c) => c.id === activeCategory)?.label} situations
                </p>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {getSituationsByCategory(activeCategory).map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSituationPick(s)}
                    className={`flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition-all duration-150 hover:bg-ink-50 ${
                      selectedSituation?.id === s.id ? 'bg-ink-50' : ''
                    }`}
                  >
                    <div className={`h-2 w-2 shrink-0 rounded-full bg-gradient-to-br ${categories.find((c) => c.id === activeCategory)?.accent}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-ink-800">{s.label}</p>
                      <p className="text-xs text-ink-400">{s.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
