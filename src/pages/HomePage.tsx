import { Mascot } from '@/components/Mascot';
import { ExcuseGenerator } from '@/components/ExcuseGenerator';
import type { Situation } from '@/types';

interface HomePageProps {
  selectedSituation: Situation | null;
  onSituationUsed: () => void;
}

export function HomePage({ selectedSituation, onSituationUsed }: HomePageProps) {
  return (
    <div className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-5 py-12 md:px-8">
      {/* Mascot */}
      <div className="mb-6 animate-fade-in-up">
        <Mascot size={56} />
      </div>

      {/* Headline */}
      <h1 className="mb-3 max-w-2xl text-center text-4xl font-bold leading-tight tracking-tight text-ink-900 animate-fade-in-up md:text-5xl lg:text-6xl" style={{ animationDelay: '0.05s' }}>
        Need an excuse?
      </h1>
      <p className="mb-10 max-w-md text-center text-lg text-ink-400 animate-fade-in-up md:text-xl" style={{ animationDelay: '0.1s' }}>
        Tell me what happened. I've got you.
      </p>

      {/* Generator */}
      <div className="w-full max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
        <ExcuseGenerator initialSituation={selectedSituation} onSituationUsed={onSituationUsed} />
      </div>

      {/* Hint */}
      <p className="mt-6 text-xs text-ink-300 animate-fade-in" style={{ animationDelay: '0.3s' }}>
        Press the + to pick a situation, or just start typing.
      </p>
    </div>
  );
}
