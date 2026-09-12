import { useState, useMemo } from 'react';
import { Search, Briefcase, Heart, Home, Tag, Copy, Check } from 'lucide-react';
import { categories } from '@/data/categories';
import { libraryExcuses } from '@/data/library';
import type { CategoryId } from '@/types';

const iconMap: Record<string, typeof Briefcase> = {
  Briefcase,
  Heart,
  Home,
};

type Filter = 'all' | CategoryId;

export function LibraryPage() {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return libraryExcuses.filter((e) => {
      const matchesFilter = filter === 'all' || e.category === filter;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        e.situation.toLowerCase().includes(q) ||
        e.excuse.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.relationship.toLowerCase().includes(q);
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  const handleCopy = async (id: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative z-10 mx-auto max-w-4xl px-5 py-12 md:px-8">
      <div className="mb-8 animate-fade-in-up">
        <h1 className="mb-3 text-3xl font-bold tracking-tight text-ink-900 md:text-4xl">
          Excuse Library
        </h1>
        <p className="text-lg text-ink-400">
          Browse real excuses for common situations. Copy one and use it right away.
        </p>
      </div>

      {/* Search + filters */}
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-300" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search excuses, situations, tags…"
            className="w-full rounded-xl border border-ink-100 bg-white/70 py-3 pl-12 pr-4 text-sm text-ink-800 placeholder:text-ink-300 backdrop-blur-sm transition-all focus:border-ink-300 focus:outline-none focus:ring-2 focus:ring-accent-pink/25"
            aria-label="Search the excuse library"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`chip ${filter === 'all' ? 'chip-active' : 'chip-inactive'}`}
          >
            All
          </button>
          {categories.map((cat) => {
            const Icon = iconMap[cat.icon] ?? Briefcase;
            return (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`chip ${filter === cat.id ? 'chip-active' : 'chip-inactive'}`}
              >
                <Icon size={13} />
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-ink-100/80 bg-white/50 p-12 text-center backdrop-blur-sm">
          <p className="text-sm text-ink-400">No excuses found. Try a different search or filter.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((e, idx) => {
            const cat = categories.find((c) => c.id === e.category)!;
            const Icon = iconMap[cat.icon] ?? Briefcase;
            return (
              <article
                key={e.id}
                className="group flex flex-col rounded-2xl border border-ink-100/80 bg-white/60 p-5 backdrop-blur-sm transition-all duration-200 hover:border-ink-200 hover:shadow-lg animate-fade-in-up"
                style={{ animationDelay: `${Math.min(idx * 0.05, 0.4)}s` }}
              >
                <div className="mb-3 flex items-center gap-2">
                  <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${cat.accent}`}>
                    <Icon size={14} className="text-white" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                    {e.situation}
                  </span>
                </div>

                <blockquote className="mb-4 flex-1 text-sm leading-relaxed text-ink-700">
                  "{e.excuse}"
                </blockquote>

                {e.followUp && (
                  <div className="mb-4 rounded-lg bg-ink-50/80 p-3">
                    <p className="text-xs text-ink-400">
                      <span className="font-medium text-ink-500">If asked:</span> "{e.followUp.question}"
                    </p>
                    <p className="mt-1 text-xs text-ink-600">
                      <span className="font-medium text-ink-500">Say:</span> "{e.followUp.answer}"
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {e.tags.slice(0, 3).map((t) => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-md bg-ink-100/80 px-2 py-0.5 text-xs text-ink-400">
                        <Tag size={10} />
                        {t}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => handleCopy(e.id, e.excuse)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 active:scale-95 ${
                      copiedId === e.id
                        ? 'bg-green-500/10 text-green-600'
                        : 'text-ink-400 hover:bg-ink-100 hover:text-ink-700'
                    }`}
                  >
                    {copiedId === e.id ? <Check size={13} /> : <Copy size={13} />}
                    {copiedId === e.id ? 'Copied' : 'Copy'}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
