import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Calendar, Rocket, UserIcon, LogOut, Settings, ChevronDown, Home as HomeIcon } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

export default function Header() {
  const location = useLocation();
  const { user, logout } = useUser();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path: string) => {
    return location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
  };

  const navLinkClass = (path: string) =>
    `transition-colors uppercase tracking-widest ${
      isActive(path)
        ? 'text-nexus-blue-light border-b-2 border-nexus-blue-dark pb-1'
        : 'hover:text-white pb-1 border-b-2 border-transparent'
    }`;

  const mobileNavClass = (path: string) => 
    `flex flex-col items-center justify-center w-full h-full space-y-1 ${
      isActive(path) ? 'text-nexus-blue-light' : 'text-gray-500 hover:text-gray-300'
    }`;

  return (
    <>
      <header className="h-16 md:h-20 border-b border-nexus-blue-dark/20 px-4 md:px-8 flex items-center justify-between bg-nexus-dark/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-nexus-blue-dark to-nexus-blue-gradient-dark rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(124,58,237,0.4)]">
              <Rocket className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">
              NEX ESTUDO
            </span>
          </Link>

          <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-400 items-center">
            <Link to="/" className={navLinkClass('/')}>
              Início
            </Link>
            <Link to="/aprender" className={navLinkClass('/aprender')}>
              Aprender
            </Link>
            <Link to="/organizar" className={navLinkClass('/organizar')}>
              Organizar
            </Link>
          </nav>

          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <div className="hidden md:block text-right">
              <p className="text-xs text-gray-400 uppercase tracking-tighter">
                {user?.learningPreference ? `Estilo ${user.learningPreference}` : 'Nível 1 • Aluno'}
              </p>
              <p className="text-sm font-bold text-white">
                {user?.name || 'Visitante Premium'}
              </p>
            </div>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity focus:outline-none"
            >
              <div className="w-9 h-9 md:w-11 md:h-11 rounded-full border-2 border-nexus-blue-dark bg-nexus-card overflow-hidden flex items-center justify-center transition-transform hover:scale-105 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-nexus-blue-dark/20 flex items-center justify-center text-xl text-nexus-blue-light">
                    <UserIcon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-300 hidden md:block ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* User Profile Dropdown */}
            <div className={`absolute top-14 md:top-16 right-0 w-64 md:w-72 bg-[#18181b] border border-white/10 rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.8)] p-5 md:p-6 transition-all duration-300 origin-top-right ${isDropdownOpen ? 'opacity-100 scale-100 visible' : 'opacity-0 scale-95 invisible'}`}>
              <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-6">
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-nexus-blue bg-nexus-blue/10 flex items-center justify-center shrink-0">
                  <UserIcon className="w-5 h-5 md:w-6 md:h-6 text-nexus-blue-light" />
                </div>
                <div className="overflow-hidden">
                  <h4 className="text-white font-black truncate text-sm md:text-base">{user?.name || 'Visitante'}</h4>
                  <p className="text-xs text-gray-400 truncate">{user?.email || 'aluno@nexusedu.com'}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl">
                  <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Estilo</span>
                  <span className="text-xs md:text-sm font-black text-nexus-blue-light">{user?.learningPreference || 'Geral'}</span>
                </div>
                <div className="flex justify-between items-center bg-white/5 px-4 py-3 rounded-2xl">
                  <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">Nível</span>
                  <span className="text-xs md:text-sm font-black text-emerald-400">14 Mestre</span>
                </div>
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-all font-medium text-sm">
                  <Settings className="w-4 h-4" /> Configurações
                </button>
                <button 
                  onClick={() => { setIsDropdownOpen(false); logout(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-all font-medium text-sm"
                >
                  <LogOut className="w-4 h-4" /> Sair da Conta
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-nexus-dark/90 backdrop-blur-xl border-t border-white/10 z-50 flex items-center justify-around px-2 pb-safe">
        <Link to="/" className={mobileNavClass('/')} onClick={() => setIsDropdownOpen(false)}>
          <HomeIcon className={`w-5 h-5 ${isActive('/') ? 'text-nexus-blue-light' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider">Início</span>
        </Link>
        <Link to="/aprender" className={mobileNavClass('/aprender')} onClick={() => setIsDropdownOpen(false)}>
          <BookOpen className={`w-5 h-5 ${isActive('/aprender') ? 'text-nexus-blue-light' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider">Aprender</span>
        </Link>
        <Link to="/organizar" className={mobileNavClass('/organizar')} onClick={() => setIsDropdownOpen(false)}>
          <Calendar className={`w-5 h-5 ${isActive('/organizar') ? 'text-nexus-blue-light' : ''}`} />
          <span className="text-[10px] font-bold tracking-wider">Organizar</span>
        </Link>
      </div>
    </>
  );
}

