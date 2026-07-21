import { useState, useEffect, useCallback, useRef } from 'react';
import { Target, Clock, Calendar as CalendarIcon, GraduationCap, Grid, Play, Pause, RotateCcw, Plus, CheckCircle2, TrendingUp, Briefcase, PlusCircle, Check, LayoutDashboard, CalendarDays, BookOpen, Calculator, ChevronRight, ChevronLeft, Save, Edit3, Trash2 } from 'lucide-react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useUser } from '../contexts/UserContext';

type TabType = 'overview' | 'schedule' | 'calendar' | 'grades';

export default function Organizar() {
  const { firebaseUser } = useUser();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [dataLoaded, setDataLoaded] = useState(false);


  // --- OVERVIEW / POMODORO STATE ---
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerTab, setTimerTab] = useState<'study' | 'short' | 'long'>('study');
  const [isRunning, setIsRunning] = useState(false);
  const [newGoalText, setNewGoalText] = useState('');
  const [goals, setGoals] = useState([
    { id: 1, title: 'Revisar conteúdo de História', done: false, category: 'Estudo' },
    { id: 2, title: 'Fazer lista de Matemática', done: true, category: 'Tarefa' },
  ]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleTimerChange = (mode: 'study' | 'short' | 'long') => {
    setTimerTab(mode);
    setIsRunning(false);
    if (mode === 'study') setTimeLeft(25 * 60);
    if (mode === 'short') setTimeLeft(5 * 60);
    if (mode === 'long') setTimeLeft(15 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  const toggleGoal = (id: number) => setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  const addGoal = () => {
    if(!newGoalText.trim()) return;
    setGoals([{ id: Date.now(), title: newGoalText, done: false, category: 'Estudo' }, ...goals]);
    setNewGoalText('');
  };
  const deleteGoal = (id: number, e: any) => {
    e.stopPropagation();
    setGoals(goals.filter(g => g.id !== id));
  }

  // --- SCHEDULE STATE ---
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'] as const;

  type ScheduleRow = { id: number; time: string; Segunda: string; Terça: string; Quarta: string; Quinta: string; Sexta: string };

  const defaultRows = (): ScheduleRow[] => [
    { id: 1, time: '', Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' },
    { id: 2, time: '', Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' },
    { id: 3, time: '', Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' },
    { id: 4, time: '', Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' },
    { id: 5, time: '', Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' },
  ];

  const [scheduleRows, setScheduleRows] = useState<ScheduleRow[]>(defaultRows);

  // --- GRADES STATE ---
  const [grades, setGrades] = useState<{ id: number, subject: string, b1: string, b2: string, b3: string, b4: string }[]>([
    { id: 1, subject: 'Matemática', b1: '', b2: '', b3: '', b4: '' },
    { id: 2, subject: 'Português', b1: '', b2: '', b3: '', b4: '' },
    { id: 3, subject: 'Ciências', b1: '', b2: '', b3: '', b4: '' },
    { id: 4, subject: 'História', b1: '', b2: '', b3: '', b4: '' },
  ]);

  // --- CALENDAR STATE ---
  const [events, setEvents] = useState<{ id: number, title: string, date: string, type: string, urgency: string, color: string }[]>([]);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('');

  // --- LOAD FROM FIRESTORE ON MOUNT ---
  useEffect(() => {
    if (!firebaseUser) return;
    const loadData = async () => {
      try {
        const snap = await getDoc(doc(db, 'users', firebaseUser.uid, 'organizer', 'data'));
        if (snap.exists()) {
          const d = snap.data();
          if (d.scheduleRows && d.scheduleRows.length > 0) setScheduleRows(d.scheduleRows);
          if (d.grades && d.grades.length > 0) setGrades(d.grades);
          if (d.events) setEvents(d.events);
        }
      } catch (err) {
        console.error('Error loading organizer data:', err);
      } finally {
        setDataLoaded(true);
      }
    };
    loadData();
  }, [firebaseUser]);

  // --- DEBOUNCED SAVE TO FIRESTORE ---
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  const saveToFirestore = useCallback((data: { scheduleRows?: ScheduleRow[], grades?: any[], events?: any[] }) => {
    if (!firebaseUser) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(async () => {
      try {
        await setDoc(
          doc(db, 'users', firebaseUser.uid, 'organizer', 'data'),
          data,
          { merge: true }
        );
      } catch (err) {
        console.error('Error saving organizer data:', err);
      }
    }, 1000);
  }, [firebaseUser]);

  // Auto-save when data changes (only after initial load)
  useEffect(() => {
    if (!dataLoaded) return;
    saveToFirestore({ scheduleRows });
  }, [scheduleRows, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    saveToFirestore({ grades });
  }, [grades, dataLoaded]);

  useEffect(() => {
    if (!dataLoaded) return;
    saveToFirestore({ events });
  }, [events, dataLoaded]);

  // --- SCHEDULE ACTIONS ---
  const updateScheduleCell = (id: number, field: keyof ScheduleRow, value: string) => {
    setScheduleRows(prev => prev.map(row => row.id === id ? { ...row, [field]: value } : row));
  };

  const addScheduleRow = () => {
    setScheduleRows(prev => [...prev, { id: Date.now(), time: '', Segunda: '', Terça: '', Quarta: '', Quinta: '', Sexta: '' }]);
  };

  const deleteScheduleRow = (id: number) => {
    setScheduleRows(prev => prev.filter(row => row.id !== id));
  };

  const clearSchedule = () => {
    setScheduleRows(defaultRows());
  };

  // --- GRADES ACTIONS ---
  const updateGrade = (id: number, field: 'b1'|'b2'|'b3'|'b4'|'subject', value: string) => {
    setGrades(grades.map(g => g.id === id ? { ...g, [field]: value } : g));
  };
  const addNewGradeSubject = () => {
    setGrades([...grades, { id: Date.now(), subject: 'Nova Disciplina', b1: '', b2: '', b3: '', b4: '' }]);
  };
  const deleteGradeSubject = (id: number) => {
    setGrades(grades.filter(g => g.id !== id));
  };

  const calculateAverage = (g: any) => {
    const scores = [parseFloat(g.b1), parseFloat(g.b2), parseFloat(g.b3), parseFloat(g.b4)].filter(n => !isNaN(n));
    if (scores.length === 0) return '-';
    return (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1);
  };

  // --- EVENTS ACTIONS ---
  const addEvent = () => {
    if(!newEventTitle || !newEventDate) return;
    setEvents([...events, { id: Date.now(), title: newEventTitle, date: newEventDate, type: 'Tarefa', urgency: 'Média', color: 'blue' }]);
    setNewEventTitle('');
    setNewEventDate('');
  };

  const deleteEvent = (id: number) => {
    setEvents(events.filter(e => e.id !== id));
  };


  // Colorful Backgrounds per active tab
  const getTabColor = () => {
    switch(activeTab) {
      case 'overview': return 'from-purple-900/40 via-nexus-bg to-indigo-900/20';
      case 'schedule': return 'from-blue-900/40 via-nexus-bg to-cyan-900/20';
      case 'calendar': return 'from-rose-900/40 via-nexus-bg to-orange-900/20';
      case 'grades': return 'from-emerald-900/40 via-nexus-bg to-teal-900/20';
      default: return 'from-nexus-bg to-nexus-bg';
    }
  }

  return (
    <div className={`flex-1 flex flex-col md:flex-row min-h-screen bg-gradient-to-br transition-colors duration-1000 ${getTabColor()}`}>
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 lg:w-72 premium-glass p-4 md:p-6 flex flex-col z-20 shadow-xl md:shadow-2xl border-b md:border-b-0 md:border-r border-white/10">
        <h2 className="hidden md:block text-3xl font-black mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-200 to-purple-400 drop-shadow-sm">
          Gestão Escolar
        </h2>
        <nav className="flex overflow-x-auto md:flex-col space-x-3 md:space-x-0 md:space-y-3 flex-1 pb-2 md:pb-0 scrollbar-hide">
          <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all font-bold whitespace-nowrap flex-shrink-0 ${activeTab === 'overview' ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(139,92,246,0.4)] scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            <LayoutDashboard className="w-5 h-5 md:w-6 md:h-6" /> Visão Geral
          </button>
          <button onClick={() => setActiveTab('schedule')} className={`flex items-center gap-2 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all font-bold whitespace-nowrap flex-shrink-0 ${activeTab === 'schedule' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.4)] scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            <Grid className="w-5 h-5 md:w-6 md:h-6" /> Grade de Aulas
          </button>
          <button onClick={() => setActiveTab('calendar')} className={`flex items-center gap-2 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all font-bold whitespace-nowrap flex-shrink-0 ${activeTab === 'calendar' ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.4)] scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            <CalendarDays className="w-5 h-5 md:w-6 md:h-6" /> Agenda Escolar
          </button>
          <button onClick={() => setActiveTab('grades')} className={`flex items-center gap-2 md:gap-4 px-4 md:px-5 py-3 md:py-4 rounded-xl md:rounded-2xl transition-all font-bold whitespace-nowrap flex-shrink-0 ${activeTab === 'grades' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}>
            <GraduationCap className="w-5 h-5 md:w-6 md:h-6" /> Boletim & Notas
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 overflow-y-auto custom-scrollbar relative z-10">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Produtividade 🚀</h1>
              <p className="text-gray-300 text-lg md:text-xl font-medium">Mantenha o foco absoluto e não perca suas metas.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
              {/* Pomodoro */}
              <section className="premium-glass bg-gradient-to-br from-indigo-900/50 to-purple-900/50 rounded-[32px] p-10 shadow-[0_0_50px_rgba(139,92,246,0.2)] border border-purple-500/30 flex flex-col justify-between">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-purple-400/30">
                    <Clock className="w-5 h-5 text-purple-400" />
                    <span className="text-sm font-bold uppercase tracking-wider text-purple-100">Timer</span>
                  </div>
                </div>
                <div className="flex bg-black/30 p-1.5 rounded-2xl w-fit mx-auto mb-10 border border-white/10 shadow-inner">
                  <button onClick={() => handleTimerChange('study')} className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${timerTab === 'study' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Estudo</button>
                  <button onClick={() => handleTimerChange('short')} className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${timerTab === 'short' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Pausa Curta</button>
                  <button onClick={() => handleTimerChange('long')} className={`px-6 py-2 text-sm font-bold rounded-xl transition-all ${timerTab === 'long' ? 'bg-purple-600 text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}>Pausa Longa</button>
                </div>
                <div className="text-center mb-10">
                  <div className="text-8xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-purple-200 drop-shadow-2xl tabular-nums">
                    {formatTime(timeLeft)}
                  </div>
                </div>
                <div className="flex gap-4 w-full">
                  <button onClick={() => setIsRunning(!isRunning)} className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-extrabold py-5 rounded-2xl text-xl shadow-[0_10px_30px_rgba(139,92,246,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-3">
                    {isRunning ? <><Pause className="w-7 h-7" /> Pausar Foco</> : <><Play className="w-7 h-7 fill-current" /> Iniciar Foco</>}
                  </button>
                  <button onClick={() => handleTimerChange(timerTab)} className="w-20 bg-white/10 hover:bg-white/20 text-white py-5 rounded-2xl transition-all flex items-center justify-center backdrop-blur-md border border-white/20">
                    <RotateCcw className="w-6 h-6" />
                  </button>
                </div>
              </section>

              {/* Metas */}
              <section className="premium-glass bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-[32px] p-10 border border-emerald-500/30 flex flex-col relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10">
                  <div className="p-3 bg-emerald-500 rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                    <Target className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-black text-white">Metas do Dia</h2>
                </div>
                
                <div className="flex gap-3 mb-6">
                  <input 
                    type="text" 
                    value={newGoalText}
                    onChange={(e) => setNewGoalText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addGoal()}
                    placeholder="Adicionar nova meta..." 
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-5 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                  <button onClick={addGoal} className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                    <Plus className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  {goals.map(goal => (
                    <div key={goal.id} className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-black/30 hover:bg-black/50 transition-colors cursor-pointer group" onClick={() => toggleGoal(goal.id)}>
                      <button className={`shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${goal.done ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'border-white/40'}`}>
                        {goal.done && <Check className="w-4 h-4 text-white" />}
                      </button>
                      <div className="flex-1">
                        <p className={`font-bold text-lg transition-colors ${goal.done ? 'text-gray-500 line-through' : 'text-gray-100'}`}>{goal.title}</p>
                      </div>
                      <button onClick={(e) => deleteGoal(goal.id, e)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  {goals.length === 0 && <p className="text-gray-400 text-center py-6 font-medium">Nenhuma meta. Adicione uma acima!</p>}
                </div>
              </section>
            </div>
          </div>
        )}

        {/* SCHEDULE TAB (Grade de Aulas) */}
        {activeTab === 'schedule' && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Grade de Aulas 📅</h1>
              <p className="text-gray-300 text-lg md:text-xl font-medium">Configure seu horário exatamente como é na escola.</p>
            </header>
            <div className="flex gap-3 flex-wrap mb-6">
              <button onClick={addScheduleRow} className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all">
                <Plus className="w-5 h-5" /> Adicionar Linha
              </button>
              <button onClick={clearSchedule} className="px-5 py-3 bg-rose-700/70 hover:bg-rose-600 text-white rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all">
                <Trash2 className="w-5 h-5" /> Limpar Tudo
              </button>
            </div>

            <div className="premium-glass bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(59,130,246,0.2)] border border-blue-500/30">
              <div className="w-full overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr>
                      <th className="p-4 border-b border-blue-500/20 text-blue-300 font-bold uppercase tracking-widest text-xs w-32 bg-blue-950/40 rounded-tl-xl">Horário</th>
                      {days.map(d => <th key={d} className="p-4 border-b border-blue-500/20 text-blue-300 font-bold uppercase tracking-widest text-xs text-center bg-blue-950/40">{d}</th>)}
                      <th className="p-4 border-b border-blue-500/20 bg-blue-950/40 rounded-tr-xl w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleRows.map((row) => (
                      <tr key={row.id} className="border-b border-blue-500/10 hover:bg-blue-500/5 transition-colors group">
                        <td className="p-3 border-r border-blue-500/10">
                          <input
                            type="text"
                            value={row.time}
                            onChange={(e) => updateScheduleCell(row.id, 'time', e.target.value)}
                            placeholder="07:00"
                            className="w-full bg-blue-950/60 border-2 border-blue-500/40 rounded-lg px-3 py-2 text-white font-bold text-center focus:outline-none focus:border-blue-400 focus:bg-blue-950/80 transition-all text-sm"
                          />
                        </td>
                        {days.map(day => (
                          <td key={day} className="p-3 border-r border-blue-500/10">
                            <input
                              type="text"
                              value={row[day as keyof ScheduleRow]}
                              onChange={(e) => updateScheduleCell(row.id, day as keyof ScheduleRow, e.target.value)}
                              placeholder="Matéria"
                              className="w-full bg-blue-950/60 border-2 border-blue-500/40 rounded-lg px-3 py-2 text-white font-semibold text-center placeholder-blue-600 focus:outline-none focus:border-blue-400 focus:bg-blue-950/80 transition-all text-sm"
                            />
                          </td>
                        ))}
                        <td className="p-3 text-center">
                          <button onClick={() => deleteScheduleRow(row.id)} className="text-red-500/60 hover:text-red-400 transition-colors p-1">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="text-center text-blue-400/60 text-sm mt-4 font-medium">✏️ Clique em qualquer campo para editar • As alterações são salvas automaticamente</p>
          </div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="mb-10 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Agenda & Entregas 📝</h1>
              <p className="text-gray-300 text-lg md:text-xl font-medium">Controle total dos seus trabalhos e provas.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Event List */}
              <div className="lg:col-span-1 space-y-6">
                <div className="premium-glass bg-rose-950/30 p-6 rounded-3xl border border-rose-500/30 mb-6">
                  <h3 className="font-bold text-white mb-4 flex items-center gap-2 text-lg"><PlusCircle className="w-5 h-5 text-rose-400" /> Novo Evento</h3>
                  <input type="text" placeholder="Nome do Evento (ex: Prova)" value={newEventTitle} onChange={(e) => setNewEventTitle(e.target.value)} className="w-full bg-black/40 border border-rose-500/30 rounded-xl px-4 py-3 text-white mb-3 focus:outline-none focus:border-rose-400" />
                  <input type="text" placeholder="Data (ex: 25 Mai)" value={newEventDate} onChange={(e) => setNewEventDate(e.target.value)} className="w-full bg-black/40 border border-rose-500/30 rounded-xl px-4 py-3 text-white mb-4 focus:outline-none focus:border-rose-400" />
                  <button onClick={addEvent} className="w-full py-3 bg-gradient-to-r from-rose-600 to-orange-500 hover:from-rose-500 hover:to-orange-400 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(244,63,94,0.4)] transition-all">
                    Adicionar à Agenda
                  </button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-xl text-white flex items-center gap-2"><CalendarIcon className="w-6 h-6 text-rose-400" /> Eventos Salvos</h3>
                  {events.map(ev => (
                    <div key={ev.id} className="p-6 rounded-3xl premium-glass bg-black/30 border border-white/10 hover:border-rose-500/50 transition-colors relative overflow-hidden group">
                      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${ev.color === 'red' ? 'bg-red-500' : ev.color === 'amber' ? 'bg-amber-500' : ev.color === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'}`}></div>
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-sm font-black uppercase tracking-wider text-${ev.color}-400`}>{ev.date}</span>
                        <button onClick={() => deleteEvent(ev.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <h4 className="text-xl font-bold text-white mb-2">{ev.title}</h4>
                      <p className="text-sm text-gray-400 flex items-center gap-2 font-medium">
                        <Briefcase className="w-4 h-4" /> {ev.type}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Faux Calendar View */}
              <div className="lg:col-span-2 premium-glass bg-gradient-to-br from-rose-900/20 to-orange-900/20 rounded-[32px] p-8 shadow-[0_0_50px_rgba(244,63,94,0.15)] border border-rose-500/20">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-4xl font-black text-white">Maio 2026</h3>
                  <div className="flex gap-3">
                    <button className="p-3 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/40 transition-colors"><ChevronLeft className="w-6 h-6" /></button>
                    <button className="p-3 bg-rose-500/20 text-rose-300 rounded-xl hover:bg-rose-500/40 transition-colors"><ChevronRight className="w-6 h-6" /></button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 md:gap-3">
                  {['DOM','SEG','TER','QUA','QUI','SEX','SAB'].map(d => (
                    <div key={d} className="text-center font-black text-rose-300/60 pb-2 md:pb-4 text-[10px] md:text-sm tracking-widest">{d}</div>
                  ))}
                  {Array.from({ length: 31 }).map((_, i) => {
                    const day = i + 1;
                    const hasEvent = events.some(e => e.date.includes(day.toString()));
                    return (
                      <div key={day} className={`aspect-square rounded-2xl flex flex-col items-center justify-center text-lg font-bold border-2 transition-all cursor-pointer ${hasEvent ? 'bg-gradient-to-br from-rose-600 to-orange-500 border-transparent text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] scale-105 z-10' : 'bg-black/20 border-white/5 text-gray-300 hover:border-rose-400/50 hover:bg-rose-900/30'}`}>
                        {day}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* GRADES TAB */}
        {activeTab === 'grades' && (
          <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
            <header className="mb-10 flex flex-col md:flex-row justify-between items-center md:items-end gap-4 text-center md:text-left">
              <div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">Boletim Escolar 🎓</h1>
                <p className="text-gray-300 text-lg md:text-xl font-medium">Suas notas calculadas automaticamente.</p>
              </div>
              <button onClick={addNewGradeSubject} className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all flex items-center gap-2">
                <Plus className="w-5 h-5" /> Nova Disciplina
              </button>
            </header>

            <div className="premium-glass bg-gradient-to-br from-emerald-900/30 to-teal-900/30 rounded-[32px] overflow-hidden shadow-[0_0_50px_rgba(16,185,129,0.2)] border border-emerald-500/30 mb-8">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr>
                      <th className="p-6 border-b border-r border-emerald-500/20 bg-emerald-950/50 font-black text-white text-lg">Disciplina</th>
                      <th className="p-6 border-b border-emerald-500/20 bg-emerald-950/50 font-bold text-center text-emerald-200">1º Bim</th>
                      <th className="p-6 border-b border-emerald-500/20 bg-emerald-950/50 font-bold text-center text-emerald-200">2º Bim</th>
                      <th className="p-6 border-b border-emerald-500/20 bg-emerald-950/50 font-bold text-center text-emerald-200">3º Bim</th>
                      <th className="p-6 border-b border-emerald-500/20 bg-emerald-950/50 font-bold text-center text-emerald-200">4º Bim</th>
                      <th className="p-6 border-b border-l border-emerald-500/20 bg-emerald-900/60 font-black text-center text-white text-lg">Média</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grades.map((g) => {
                      const avg = calculateAverage(g);
                      const isPassing = avg !== '-' && parseFloat(avg) >= 6.0;
                      return (
                        <tr key={g.id} className="hover:bg-emerald-900/20 transition-colors group">
                          <td className="p-4 border-b border-r border-emerald-500/20 font-bold text-white">
                            <div className="flex items-center gap-3">
                              <BookOpen className="w-5 h-5 text-emerald-400" />
                              <input type="text" value={g.subject} onChange={(e) => updateGrade(g.id, 'subject', e.target.value)} className="bg-transparent border-b border-transparent focus:border-emerald-400 focus:outline-none w-full text-lg" />
                              <button onClick={() => deleteGradeSubject(g.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-auto">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                          {['b1', 'b2', 'b3', 'b4'].map((bim) => (
                            <td key={bim} className="p-4 border-b border-emerald-500/20 text-center">
                              <input 
                                type="text" 
                                value={(g as any)[bim]} 
                                onChange={(e) => updateGrade(g.id, bim as any, e.target.value)}
                                placeholder="-"
                                className="w-16 text-center bg-black/40 border border-emerald-500/30 rounded-lg py-2 font-mono text-lg text-white focus:outline-none focus:border-emerald-400 focus:bg-black/60 transition-colors"
                              />
                            </td>
                          ))}
                          <td className="p-4 border-b border-l border-emerald-500/20 text-center">
                            <span className={`inline-flex items-center justify-center px-4 py-2 rounded-xl font-mono font-black text-xl shadow-inner ${avg === '-' ? 'bg-white/5 text-gray-500' : isPassing ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                              {avg}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Status Geral */}
            <div className="premium-glass bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-400/30 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
               <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.5)] shrink-0">
                 <Calculator className="w-8 h-8 text-white" />
               </div>
               <div>
                 <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Simulador Ativo</h3>
                 <p className="text-emerald-100/80 text-base md:text-lg">As médias são calculadas em tempo real. Digite suas notas acima para prever se você vai passar de ano!</p>
               </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
