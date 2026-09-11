import { Briefcase, Heart, Home, Quote } from 'lucide-react';
import { categories } from '@/data/categories';
import { examples } from '@/data/examples';
import type { CategoryId } from '@/types';

const iconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Heart,
  Home,
};

const sectionLabels: Record<CategoryId, string> = {
  work: 'Work',
  relationship: 'Relationship',
  family: 'Family',
};

export function ExamplesPage() {
  return (
    <div className="relative z-10 mx-auto max-w-3xl px-5 py-12 md:px-8">
      <div className="mb-10 animate-fade-in-up">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          Examples
        </h1>
        <p className="text-lg text-ink-400">
          Real situations and the excuses Excuse AI would produce. These show how context shapes the response.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map((cat, catIdx) => {
          const Icon = iconMap[cat.icon] ?? Briefcase;
          const catExamples = examples.filter((e) => e.category === cat.id);
          return (
            <section key={cat.id} className="animate-fade-in-up" style={{ animationDelay: `${0.1 * (catIdx + 1)}s` }}>
              <div className="mb-5 flex items-center gap-3">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${cat.accent} shadow-lg`}>
                  <Icon size={18} className="text-white" />
                </div>
                <h2 className="text-xl font-bold text-ink-900">{sectionLabels[cat.id]}</h2>
              </div>

              <div className="space-y-4">
                {catExamples.map((ex, idx) => (
                  <article
                    key={`${cat.id}-${idx}`}
                    className="overflow-hidden rounded-2xl border border-ink-100/80 bg-white/60 backdrop-blur-sm transition-all duration-200 hover:shadow-md"
                  >
                    {/* Situation + Context */}
                    <div className="border-b border-ink-100/60 p-5">
                      <div className="mb-3">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Situation</p>
                        <p className="text-sm font-medium text-ink-800">{ex.situation}</p>
                      </div>
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-ink-400">Context</p>
                        <p className="text-sm text-ink-500">{ex.context}</p>
                      </div>
                    </div>

                    {/* Excuse */}
                    <div className="bg-ink-900/95 p-5 text-white">
                      <div className="mb-2 flex items-center gap-2">
                        <Quote size={14} className="text-accent-violet" />
                        <p className="text-xs font-semibold uppercase tracking-wide text-ink-300">Excuse</p>
                      </div>
                      <blockquote className="text-base leading-relaxed text-white/95">
                        "{ex.excuse}"
                      </blockquote>

                      {ex.followUp && (
                        <div className="mt-4 rounded-lg bg-ink-800/80 p-3">
                          <p className="text-xs text-ink-300">
                            <span className="font-medium text-ink-200">If asked "{ex.followUp.question}":</span>
                          </p>
                          <p className="mt-1 text-sm text-white/90">"{ex.followUp.answer}"</p>
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
