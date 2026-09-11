import { useState, useEffect, useCallback } from 'react';
import { Atmosphere } from '@/components/Atmosphere';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { HomePage } from '@/pages/HomePage';
import { SituationsPage } from '@/pages/SituationsPage';
import { LibraryPage } from '@/pages/LibraryPage';
import { ExamplesPage } from '@/pages/ExamplesPage';
import type { View, Situation } from '@/types';

function App() {
  const [view, setView] = useState<View>('home');
  const [selectedSituation, setSelectedSituation] = useState<Situation | null>(null);

  const navigate = useCallback((v: View) => {
    setView(v);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePickSituation = useCallback((s: Situation) => {
    setSelectedSituation(s);
    setView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSituationUsed = useCallback(() => {
    // Clear the external selection so it doesn't re-apply on re-render
    setSelectedSituation(null);
  }, []);

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view]);

  return (
    <div className="relative min-h-screen">
      <Atmosphere />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header view={view} onNavigate={navigate} />

        <main className="flex-1">
          {view === 'home' && (
            <HomePage
              selectedSituation={selectedSituation}
              onSituationUsed={handleSituationUsed}
            />
          )}
          {view === 'situations' && <SituationsPage onPickSituation={handlePickSituation} />}
          {view === 'library' && <LibraryPage />}
          {view === 'examples' && <ExamplesPage />}
        </main>

        <Footer onNavigate={navigate} />
      </div>
    </div>
  );
}

export default App;
