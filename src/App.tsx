import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Aprender from './pages/Aprender';
import Materia from './pages/Materia';
import Organizar from './pages/Organizar';
import OnboardingFlow from './components/auth/OnboardingFlow';
import { useUser } from './contexts/UserContext';
import { Sparkles } from 'lucide-react';

export default function App() {
  const { isAuthenticated, setIsAuthenticated, authLoading } = useUser();

  // This state controls whether to show the onboarding flow.
  // It is ONLY set to false by:
  //   1. onComplete() being explicitly called (user finished the flow)
  //   2. authLoading finishes and user is already authenticated (returning user)
  // It does NOT change just because Firebase fires onAuthStateChanged mid-registration.
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Once the initial Firebase auth check is done, if the user is ALREADY
    // authenticated (returning user / remembered session), skip the onboarding.
    if (!authLoading && isAuthenticated) {
      setShowOnboarding(false);
    }
    // If authLoading finishes and user is NOT authenticated, keep showOnboarding = true
    if (!authLoading && !isAuthenticated) {
      setShowOnboarding(true);
    }
  }, [authLoading]); // Only runs when authLoading changes (i.e., once on page load)

  const handleOnboardingComplete = () => {
    setIsAuthenticated(true);
    setShowOnboarding(false);
  };

  // While Firebase checks auth state, show a splash screen
  if (authLoading) {
    return (
      <div className="w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/15 mix-blend-screen blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-fuchsia-500/15 mix-blend-screen blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin shadow-[0_0_30px_rgba(34,211,238,0.5)]"></div>
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-fuchsia-500 border-l-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-6 bg-black rounded-full flex items-center justify-center border border-white/20">
            <Sparkles className="w-6 h-6 text-white animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-400 tracking-widest uppercase">
          NEX ESTUDO
        </h2>
      </div>
    );
  }

  // Wrap everything in Router so hooks like useLocation always work
  return (
    <Router>
      {showOnboarding ? (
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      ) : (
        <div className="min-h-screen flex flex-col bg-nexus-bg text-white">
          <Header />
          <main className="flex-grow flex flex-col">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/aprender" element={<Aprender />} />
              <Route path="/aprender/:materiaId" element={<Materia />} />
              <Route path="/organizar" element={<Organizar />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      )}
    </Router>
  );
}
