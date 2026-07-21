import { useState, useEffect } from 'react';
import { Play, Sparkles, Brain, BookOpen, Target, ChevronRight, User, Lock, Mail, ArrowRight, UserPlus, LogIn, AlertCircle, Loader2 } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';

interface OnboardingFlowProps {
  onComplete: () => void;
}

export default function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const { updateUser, loginWithEmail, registerWithEmail, authError, setAuthError } = useUser();
  const [step, setStep] = useState<number>(0);
  const [animateOut, setAnimateOut] = useState(false);

  const nextStep = (targetStep: number) => {
    setAnimateOut(true);
    setTimeout(() => {
      setStep(targetStep);
      setAnimateOut(false);
    }, 500);
  };

  // Step 0: Initial Loading
  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => nextStep(1), 2500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Step 2: Loading between login and questionnaire
  useEffect(() => {
    if (step === 2) {
      const timer = setTimeout(() => nextStep(3), 2000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  // Step 4: Final loading → App
  useEffect(() => {
    if (step === 4) {
      const timer = setTimeout(() => onComplete(), 2500);
      return () => clearTimeout(timer);
    }
  }, [step, onComplete]);

  const LoadingScreen = ({ message }: { message: string }) => (
    <div className={`w-full h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden transition-opacity duration-500 ${animateOut ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-500/20 mix-blend-screen blur-[100px] rounded-full animate-pulse-slow"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-500/20 mix-blend-screen blur-[100px] rounded-full animate-spin-slow" style={{ transformOrigin: '40% 60%' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-yellow-500/20 mix-blend-screen blur-[80px] rounded-full animate-blob"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin shadow-[0_0_30px_rgba(34,211,238,0.5)]"></div>
          <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-fuchsia-500 border-l-pink-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
          <div className="absolute inset-6 rounded-full border-4 border-transparent border-t-yellow-400 border-r-orange-500 animate-spin shadow-[0_0_20px_rgba(250,204,21,0.4)]" style={{ animationDuration: '2s' }}></div>
          <div className="absolute inset-12 bg-gradient-to-br from-fuchsia-500 via-cyan-500 to-yellow-500 rounded-full animate-strong-pulse blur-[8px] opacity-70"></div>
          <div className="absolute inset-14 bg-black rounded-full flex items-center justify-center border border-white/20 z-10">
            <Sparkles className="w-10 h-10 text-white animate-pulse" />
          </div>
        </div>
        <div className="relative flex flex-col items-center">
          <h2 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-yellow-400 tracking-[0.2em] uppercase mb-6 drop-shadow-2xl animate-text-shimmer bg-[length:200%_auto] text-center">
            {message}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-cyan-400 animate-bounce shadow-[0_0_10px_rgba(34,211,238,0.8)]" style={{ animationDelay: '0s' }}></div>
            <div className="w-3 h-3 rounded-full bg-fuchsia-400 animate-bounce shadow-[0_0_10px_rgba(232,121,249,0.8)]" style={{ animationDelay: '0.15s' }}></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400 animate-bounce shadow-[0_0_10px_rgba(250,204,21,0.8)]" style={{ animationDelay: '0.3s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  const LoginScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const handleSubmit = async () => {
      setLocalError(null);
      setAuthError(null);

      if (!email.trim() || !password.trim()) {
        setLocalError('Preencha email e senha.');
        return;
      }
      if (!isLogin && !name.trim()) {
        setLocalError('Informe seu nome.');
        return;
      }
      if (password.length < 6) {
        setLocalError('A senha deve ter pelo menos 6 caracteres.');
        return;
      }

      setLoading(true);
      try {
        if (isLogin) {
          await loginWithEmail(email, password);
          // For login: user already has profile, skip questionnaire
          nextStep(4);
        } else {
          await registerWithEmail(name, email, password);
          // For new users: show questionnaire
          nextStep(2);
        }
      } catch {
        // Error is handled in UserContext and set in authError
        setLoading(false);
      }
    };

    const displayError = localError || authError;

    return (
      <div className={`w-full h-screen bg-black flex relative overflow-hidden transition-opacity duration-700 ${animateOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
        {/* Animated Mesh Gradient Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-fuchsia-600/40 mix-blend-screen blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] -right-[10%] w-[60%] h-[80%] rounded-full bg-cyan-500/40 mix-blend-screen blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-[20%] left-[20%] w-[60%] h-[60%] rounded-full bg-yellow-500/30 mix-blend-screen blur-[120px] animate-blob animation-delay-4000"></div>
        </div>

        {/* Left Side */}
        <div className="hidden lg:flex w-1/2 relative items-center justify-center p-12">
          <div className="relative z-10 w-full max-w-lg aspect-square flex items-center justify-center">
            <div className="absolute z-20 w-80 h-96 bg-white/10 backdrop-blur-3xl rounded-[40px] border border-white/20 shadow-[0_0_80px_rgba(255,255,255,0.1)] flex flex-col items-center justify-center p-8 animate-float">
              <div className="w-24 h-24 bg-gradient-to-br from-fuchsia-500 to-orange-500 rounded-3xl flex items-center justify-center shadow-2xl mb-6">
                <Sparkles className="w-12 h-12 text-white drop-shadow-md" />
              </div>
              <h2 className="text-4xl font-black text-white text-center tracking-tight leading-none mb-2 drop-shadow-lg">
                NEX<span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">ESTUDO</span>
              </h2>
              <p className="text-white/70 font-medium text-center text-sm mt-2">O futuro do aprendizado é agora.</p>
            </div>
            <div className="absolute z-10 top-10 right-10 w-32 h-32 bg-cyan-500/20 backdrop-blur-2xl rounded-3xl border border-cyan-400/30 flex items-center justify-center animate-bounce shadow-2xl" style={{ animationDuration: '4s' }}>
              <Brain className="w-12 h-12 text-cyan-300 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
            </div>
            <div className="absolute z-30 bottom-16 left-4 w-40 h-28 bg-fuchsia-500/20 backdrop-blur-2xl rounded-3xl border border-fuchsia-400/30 flex flex-col items-center justify-center animate-float shadow-2xl" style={{ animationDelay: '1s' }}>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-6 h-6 text-fuchsia-300" />
                <span className="text-white font-black">+500 XP</span>
              </div>
              <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-gradient-to-r from-fuchsia-400 to-pink-500 rounded-full"></div>
              </div>
            </div>
            <div className="absolute inset-0 border-[2px] border-dashed border-white/20 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-8 border-[1px] border-white/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse', animationDuration: '15s' }}></div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-6 relative z-20">
          <div className="w-full max-w-[460px] bg-white/10 backdrop-blur-2xl p-6 md:p-10 rounded-[32px] md:rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] border border-white/20 relative overflow-hidden group">
            <div className="absolute -top-32 -right-32 w-64 h-64 bg-fuchsia-500/30 blur-[80px] rounded-full pointer-events-none group-hover:bg-cyan-500/30 transition-colors duration-1000"></div>

            {/* Toggle Login/Register */}
            <div className="flex bg-black/20 p-1.5 rounded-2xl border border-white/10 mb-8 relative z-20">
              <button
                onClick={() => { setIsLogin(true); setLocalError(null); setAuthError(null); }}
                className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${isLogin ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_5px_15px_rgba(6,182,212,0.4)]' : 'text-white/50 hover:text-white'}`}
              >
                <LogIn className="w-4 h-4" /> Entrar
              </button>
              <button
                onClick={() => { setIsLogin(false); setLocalError(null); setAuthError(null); }}
                className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${!isLogin ? 'bg-gradient-to-r from-fuchsia-500 to-pink-500 text-white shadow-[0_5px_15px_rgba(217,70,239,0.4)]' : 'text-white/50 hover:text-white'}`}
              >
                <UserPlus className="w-4 h-4" /> Cadastrar
              </button>
            </div>

            <div className="mb-6 text-center lg:text-left relative z-10">
              <h2 className="text-3xl font-black text-white mb-1 tracking-tight drop-shadow-md">
                {isLogin ? 'Que bom te ver!' : 'Junte-se à Revolução'}
              </h2>
              <p className="text-white/60 font-medium text-sm">
                {isLogin ? 'Sua jornada de conhecimento continua.' : 'Crie sua conta e explore um novo universo.'}
              </p>
            </div>

            {/* Error message */}
            {displayError && (
              <div className="mb-4 flex items-center gap-3 bg-red-500/20 border border-red-500/40 rounded-2xl px-4 py-3 relative z-10">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-sm text-red-300 font-medium">{displayError}</p>
              </div>
            )}

            <div className="space-y-4 relative z-10">
              {!isLogin && (
                <div className="space-y-1.5 animate-in fade-in duration-500">
                  <label className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-2">Qual o seu nome?</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-fuchsia-400 transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Ana Luiza"
                      className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-white/30 focus:outline-none focus:border-fuchsia-400 focus:ring-4 focus:ring-fuchsia-400/20 transition-all font-bold shadow-inner"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-white/60 uppercase tracking-widest pl-2">Seu E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="aluno@nexestudo.com"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-white/30 focus:outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/20 transition-all font-bold shadow-inner"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between pl-2">
                  <label className="text-[10px] font-black text-white/60 uppercase tracking-widest">Sua Senha</label>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-yellow-400 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="••••••••"
                    className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-14 pr-5 text-white placeholder:text-white/30 focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-400/20 transition-all font-bold shadow-inner"
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className={`w-full py-5 mt-2 text-white rounded-2xl font-black uppercase tracking-[0.2em] transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3 shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 ${isLogin ? 'bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]' : 'bg-gradient-to-r from-fuchsia-500 to-orange-500 hover:shadow-[0_0_30px_rgba(217,70,239,0.6)]'}`}
              >
                {loading ? (
                  <><Loader2 className="w-5 h-5 animate-spin" /> Aguarde...</>
                ) : (
                  <>{isLogin ? 'Acessar Portal' : 'Explorar Agora'} <ArrowRight className="w-5 h-5" /></>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuestionnaireScreen = () => {
    const [selected, setSelected] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);

    const methods = [
      { id: 1, title: 'Visual', desc: 'Aulas em Vídeo e Diagramas', icon: Play, color: 'text-blue-400', bg: 'bg-blue-500/10', name: 'Visual' },
      { id: 2, title: 'Leitura', desc: 'Textos Profundos e Resumos', icon: BookOpen, color: 'text-emerald-400', bg: 'bg-emerald-500/10', name: 'Leitura' },
      { id: 3, title: 'Prático', desc: 'Exercícios e Resoluções', icon: Target, color: 'text-purple-400', bg: 'bg-purple-500/10', name: 'Prático' }
    ];

    const handleContinue = async () => {
      const selectedMethod = methods.find(m => m.id === selected);
      if (selectedMethod) {
        setSaving(true);
        await updateUser({ learningPreference: selectedMethod.name as any });
      }
      nextStep(4);
    };

    return (
      <div className={`w-full h-screen bg-gradient-to-br from-[#09090b] via-[#09090b] to-[#18181b] flex items-center justify-center relative overflow-hidden transition-opacity duration-500 ${animateOut ? 'opacity-0' : 'opacity-100'}`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-nexus-blue/10 blur-[200px] rounded-full pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-5xl px-8 flex flex-col items-center">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 mb-10 shadow-inner">
            <Brain className="w-5 h-5 text-nexus-blue" />
            <span className="text-xs font-black uppercase tracking-widest text-gray-300">Personalização de Perfil</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white text-center mb-6 tracking-tighter drop-shadow-2xl">
            Como você prefere <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">aprender?</span>
          </h1>
          <p className="text-xl text-gray-400 text-center max-w-2xl mb-16 font-medium">Vamos adaptar sua experiência. Escolha o formato que mais funciona para você.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
            {methods.map((method) => {
              const Icon = method.icon;
              const isSelected = selected === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => setSelected(method.id)}
                  className={`relative p-10 rounded-[32px] border-2 text-left transition-all duration-500 group overflow-hidden ${isSelected ? 'border-white bg-white/10 shadow-[0_20px_50px_rgba(255,255,255,0.1)] scale-105' : 'border-white/5 bg-[#18181b] hover:border-white/20 hover:bg-[#27272a]'}`}
                >
                  {isSelected && <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent"></div>}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 relative z-10 transition-colors ${isSelected ? method.bg : 'bg-[#09090b]/80'}`}>
                    <Icon className={`w-8 h-8 ${isSelected ? method.color : 'text-gray-500'}`} />
                  </div>
                  <h3 className={`text-3xl font-black tracking-tight mb-2 relative z-10 transition-colors ${isSelected ? 'text-white' : 'text-gray-300'}`}>{method.title}</h3>
                  <p className={`font-medium relative z-10 transition-colors ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>{method.desc}</p>
                </button>
              );
            })}
          </div>
          <div className={`mt-16 transition-all duration-500 ${selected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}>
            <button
              onClick={handleContinue}
              disabled={saving}
              className="px-12 py-5 bg-nexus-blue text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:shadow-[0_0_50px_rgba(56,189,248,0.8)] hover:bg-nexus-blue-light flex items-center gap-4 transition-all duration-300 hover:scale-105 disabled:opacity-70"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Continuar <ChevronRight className="w-5 h-5" /></>}
            </button>
          </div>
        </div>
      </div>
    );
  };

  switch (step) {
    case 0: return <LoadingScreen message="Iniciando Sistemas" />;
    case 1: return <LoginScreen />;
    case 2: return <LoadingScreen message="Autenticando" />;
    case 3: return <QuestionnaireScreen />;
    case 4: return <LoadingScreen message="Personalizando Perfil" />;
    default: return null;
  }
}
