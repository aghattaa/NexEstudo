import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Aprender from './pages/Aprender';
import Materia from './pages/Materia';
import Organizar from './pages/Organizar';
import OnboardingFlow from './components/auth/OnboardingFlow';
import { useUser } from './contexts/UserContext';

export default function App() {
  const { isAuthenticated, setIsAuthenticated } = useUser();

  if (!isAuthenticated) {
    return <OnboardingFlow onComplete={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-nexus-bg text-white">
        <Header />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/aprender" element={<Aprender />} />
            <Route path="/aprender/:materiaId" element={<Materia />} />
            <Route path="/organizar" element={<Organizar />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
