import { Mascot } from '@/components/Mascot';
import type { View } from '@/types';

interface FooterProps {
  onNavigate: (view: View) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="relative z-10 mt-20 border-t border-ink-100/60 px-5 py-10 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 md:flex-row">
        <div className="flex items-center gap-3">
          <Mascot size={28} />
          <div>
            <p className="text-sm font-semibold text-ink-900">Excuse AI</p>
            <p className="text-xs text-ink-400">I've got you.</p>
          </div>
        </div>

        <nav className="flex items-center gap-5 text-sm text-ink-400" aria-label="Footer navigation">
          <button onClick={() => onNavigate('situations')} className="transition-colors hover:text-ink-700">Situations</button>
          <button onClick={() => onNavigate('library')} className="transition-colors hover:text-ink-700">Library</button>
          <button onClick={() => onNavigate('examples')} className="transition-colors hover:text-ink-700">Examples</button>
        </nav>

        <p className="text-xs text-ink-300">
          Use responsibly. For everyday social situations only.
        </p>
      </div>
    </footer>
  );
}
