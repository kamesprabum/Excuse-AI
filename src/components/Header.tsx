import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { MascotLogo } from '@/components/Mascot';
import type { View } from '@/types';

interface HeaderProps {
  view: View;
  onNavigate: (view: View) => void;
}

const navItems: { label: string; view: View }[] = [
  { label: 'Situations', view: 'situations' },
  { label: 'Excuse Library', view: 'library' },
  { label: 'Examples', view: 'examples' },
];

export function Header({ view, onNavigate }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (v: View) => {
    onNavigate(v);
    setMobileOpen(false);
  };

  return (
    <header className="relative z-30 w-full">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        {/* Left: logo */}
        <button onClick={() => handleNav('home')} className="flex items-center transition-opacity hover:opacity-80" aria-label="Excuse AI home">
          <MascotLogo size={32} />
        </button>

        {/* Center: nav (desktop) */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNav(item.view)}
              className={`relative rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                view === item.view
                  ? 'text-ink-900'
                  : 'text-ink-400 hover:text-ink-700 hover:bg-ink-100/60'
              }`}
            >
              {item.label}
              {view === item.view && (
                <span className="absolute bottom-0 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent-pink" />
              )}
            </button>
          ))}
        </nav>

        {/* Right: auth (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <button className="btn-ghost">Log in</button>
          <button className="btn-primary">Get Started</button>
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-ink-700 transition-colors hover:bg-ink-100 md:hidden"
          onClick={() => setMobileOpen((s) => !s)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="absolute left-0 right-0 top-full z-40 mx-3 mt-1 rounded-2xl border border-ink-100 bg-white/90 p-3 shadow-lg backdrop-blur-md md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <button
                key={item.view}
                onClick={() => handleNav(item.view)}
                className={`rounded-lg px-4 py-3 text-left text-sm font-medium transition-colors ${
                  view === item.view
                    ? 'bg-ink-900 text-white'
                    : 'text-ink-600 hover:bg-ink-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="my-2 h-px bg-ink-100" />
            <button className="rounded-lg px-4 py-3 text-left text-sm font-medium text-ink-600 hover:bg-ink-100">
              Log in
            </button>
            <button className="btn-primary mt-1 w-full">Get Started</button>
          </nav>
        </div>
      )}
    </header>
  );
}
