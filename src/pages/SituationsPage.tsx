import { Briefcase, Heart, Home, ArrowRight } from 'lucide-react';
import { categories, getSituationsByCategory } from '@/data/categories';
import type { CategoryId, Situation } from '@/types';

interface SituationsPageProps {
  onPickSituation: (s: Situation) => void;
}

const iconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Heart,
  Home,
};

export function SituationsPage({ onPickSituation }: SituationsPageProps) {
  return (
    <div className="relative z-10 mx-auto max-w-4xl px-5 py-12 md:px-8">
      <div className="mb-10 animate-fade-in-up">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          Situations
        </h1>
        <p className="text-lg text-ink-400">
          Pick a category, then choose the situation that fits. I'll help you handle it.
        </p>
      </div>

      <div className="space-y-10">
        {categories.map((cat, idx) => {
          const Icon = iconMap[cat.icon] ?? Briefcase;
          const situations = getSituationsByCategory(cat.id);
          return (
            <section key={cat.id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 * (idx + 1)}s` }}>
              <div className="mb-4 flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${cat.accent} shadow-lg`}>
                  <Icon size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-ink-900">{cat.label}</h2>
                  <p className="text-sm text-ink-400">{cat.description}</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {situations.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onPickSituation(s)}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-ink-100/80 bg-white/60 p-4 text-left backdrop-blur-sm transition-all duration-200 hover:border-ink-200 hover:bg-white hover:shadow-md active:scale-[0.98]"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink-800">{s.label}</p>
                      <p className="mt-0.5 text-xs text-ink-400">{s.description}</p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-ink-300 transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-ink-700"
                    />
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

export type { CategoryId };
