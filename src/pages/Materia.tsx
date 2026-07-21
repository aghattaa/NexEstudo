import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, CheckCircle2, ArrowLeft, Presentation, BookOpen, Video, Download, MessageSquare, Sparkles, Target, Play, Clock, FileText } from 'lucide-react';
import { subjects, subjectData, TopicContent } from '../data/subjects';

export default function Materia() {
  const { materiaId } = useParams();
  const subject = subjects.find(s => s.id === materiaId);
  const data = subjectData[materiaId as keyof typeof subjectData];

  const [selectedYear, setSelectedYear] = useState<number | null>(data ? data.anosFinais[0].year : null);
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(data ? data.anosFinais[0].topics[0].id : null);

  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [activeTab, setActiveTab] = useState<'video' | 'slides' | 'text'>('video');

  const handleQuizSubmit = (index: number) => {
    if (hasAnswered) return;
    setQuizAnswer(index);
    setHasAnswered(true);
  };

  if (!subject) return <div className="p-10 text-white font-bold text-xl">Matéria não encontrada!</div>;
  if (!data) return <div className="p-10 text-white font-bold text-xl">Conteúdo em construção...</div>;

  let currentTopic: TopicContent | null = null;
  const allYears = [...data.anosFinais];
  for (const yearData of allYears) {
    if (yearData.year === selectedYear) {
      const found = yearData.topics.find(t => t.id === selectedTopicId);
      if (found) { currentTopic = found; break; }
    }
  }

  const handleTopicClick = (year: number, topicId: string) => {
    setSelectedYear(year);
    setSelectedTopicId(topicId);
    setHasAnswered(false);
    setQuizAnswer(null);
  };

  return (
    <div className="flex flex-col md:flex-row flex-1 border-t border-white/10 h-full bg-transparent overflow-y-auto md:overflow-hidden pb-16 md:pb-0">

      {/* Ultra Premium Sidebar */}
      <aside className="w-full h-[35vh] md:h-auto md:w-[360px] lg:w-[400px] flex flex-col shrink-0 bg-[#09090b]/90 backdrop-blur-3xl border-b md:border-b-0 md:border-r border-white/10 relative z-20 shadow-[30px_0_60px_rgba(0,0,0,0.6)] overflow-hidden">
        {/* Intense Animated Glow Background */}
        <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[500px] opacity-30 animate-pulse-slow pointer-events-none" style={{ background: `radial-gradient(ellipse at top center, ${subject.accentColor}, transparent 70%)`, filter: 'blur(60px)' }}></div>
        <div className="absolute bottom-0 right-0 w-full h-[300px] opacity-10 pointer-events-none" style={{ background: `radial-gradient(circle at bottom right, ${subject.color.split(' ')[1]?.replace('from-', '') || subject.accentColor}, transparent 70%)`, filter: 'blur(50px)' }}></div>

        <div className="p-4 md:p-8 pb-4 md:pb-6 relative z-10 flex flex-col shrink-0">
          <Link to="/aprender" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-4 md:mb-8 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all hover:-translate-x-1 w-fit bg-white/5 px-3 md:px-4 py-1.5 md:py-2 rounded-full border border-white/5 hover:bg-white/10">
            <ArrowLeft className="w-3.5 h-3.5" /> Voltar
          </Link>

          <div className="flex items-center gap-5">
            <div className={`w-16 h-16 shrink-0 rounded-[20px] bg-gradient-to-br ${subject.color.split(' shadow')[0]} flex items-center justify-center ring-2 ring-white/30 relative group shadow-2xl`} style={{ boxShadow: `0 0 40px ${subject.shadowColor}, inset 0 0 30px rgba(255,255,255,0.4)` }}>
              <div className="absolute inset-0 rounded-[20px] animate-ping opacity-20" style={{ boxShadow: `0 0 50px ${subject.shadowColor}` }}></div>
              <div className="absolute inset-0 rounded-[20px] animate-pulse-slow opacity-60" style={{ boxShadow: `0 0 30px ${subject.shadowColor}` }}></div>
              <subject.icon className="w-8 h-8 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div>
              <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gray-500 block mb-1">Disciplina</span>
              <h2 className="text-3xl font-black tracking-tight text-white leading-none">{subject.name}</h2>
            </div>
          </div>
        </div>

        {/* Compact Year Selector (Tabs) */}
        <div className="px-6 mb-4 relative z-10">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2">
            {data.anosFinais.map(ano => {
              const isActive = selectedYear === ano.year;
              return (
                <button
                  key={ano.year}
                  onClick={() => {
                    setSelectedYear(ano.year);
                    setSelectedTopicId(ano.topics[0].id);
                    setHasAnswered(false);
                    setQuizAnswer(null);
                  }}
                  className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 shrink-0 border relative overflow-hidden ${isActive
                      ? 'text-white bg-white/10 scale-105'
                      : 'text-gray-500 border-white/5 bg-black/40 hover:text-white hover:border-white/20'
                    }`}
                  style={isActive ? {
                    boxShadow: `0 0 30px ${subject.accentColor}60, inset 0 0 15px ${subject.accentColor}40`,
                    borderColor: `${subject.accentColor}90`,
                    textShadow: `0 0 10px ${subject.accentColor}`,
                    background: `linear-gradient(180deg, rgba(255,255,255,0.1) 0%, ${subject.accentColor}30 100%)`
                  } : undefined}
                >
                  {isActive && <div className="absolute inset-0 bg-white/10 animate-shimmer"></div>}
                  <span className="relative z-10">{ano.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Topics List for SELECTED year only */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-10 relative z-10">
          {(() => {
            const currentYearData = data.anosFinais.find(a => a.year === selectedYear) || data.anosFinais[0];
            return (
              <div className="relative pt-2">
                {/* Vertical track line */}
                <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-white/10 via-white/5 to-transparent rounded-full z-0"></div>

                <div className="space-y-3">
                  {currentYearData.topics.map((topic) => {
                    const isActive = selectedTopicId === topic.id;
                    const isCompleted = false;

                    return (
                      <button
                        key={topic.id}
                        onClick={() => handleTopicClick(currentYearData.year, topic.id)}
                        className={`w-full text-left p-3.5 rounded-[20px] transition-all duration-500 flex items-start gap-4 relative z-10 group ${isActive
                            ? 'bg-[#0a0c14]/90 border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transform translate-x-2 backdrop-blur-xl'
                            : 'bg-black/20 hover:bg-white/10 border border-transparent hover:border-white/20'
                          }`}
                        style={isActive ? {
                          boxShadow: `0 15px 50px ${subject.accentColor}40, inset 0 0 20px ${subject.accentColor}30, 0 0 0 1px ${subject.accentColor}80`,
                          backgroundImage: `linear-gradient(90deg, transparent, ${subject.accentColor}10)`
                        } : undefined}
                      >
                        {/* Topic Status Icon (on track) */}
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all duration-500 relative ${isActive
                            ? 'bg-white text-black scale-125 ring-4 ring-black/50'
                            : isCompleted
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-black/80 text-gray-600 border border-white/10 group-hover:border-white/40 group-hover:scale-110'
                          }`}
                          style={isActive ? {
                            backgroundColor: '#fff',
                            color: subject.accentColor,
                            boxShadow: `0 0 30px ${subject.accentColor}, 0 0 60px ${subject.accentColor}`
                          } : undefined}
                        >
                          {isActive && <div className="absolute inset-0 rounded-full animate-ping opacity-40" style={{ backgroundColor: subject.accentColor }}></div>}
                          {isActive ? <Play className="w-3.5 h-3.5 fill-current ml-0.5 relative z-10" /> : isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-1.5 h-1.5 rounded-full bg-gray-600 group-hover:bg-white transition-colors"></div>}
                        </div>

                        <div className="flex-1 pt-1">
                          <p className={`text-[14px] font-black leading-snug mb-1.5 transition-colors duration-300 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} style={isActive ? { textShadow: `0 0 10px ${subject.accentColor}80` } : undefined}>
                            {topic.title}
                          </p>
                          <div className={`flex items-center gap-3 text-[10px] font-mono font-bold transition-colors ${isActive ? 'text-white/70' : 'text-gray-600'}`}>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {topic.estimatedMinutes}m</span>
                            <span className={`px-2 py-0.5 rounded-md border uppercase tracking-widest transition-colors ${isActive ? 'bg-white/20 border-white/30 text-white' : 'border-white/10 bg-black/50 group-hover:bg-white/20 group-hover:text-white'}`}>{topic.bncc}</span>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto bg-transparent relative custom-scrollbar z-10 scroll-smooth">
        {/* Cinematic Ambient Backgrounds */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-nexus-blue rounded-full blur-[200px] opacity-[0.15] pointer-events-none animate-pulse-slow"></div>
        <div className="absolute top-[30%] left-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[200px] opacity-[0.08] pointer-events-none animate-float"></div>

        {!currentTopic ? (
          <div className="flex-1 flex flex-col items-center justify-center h-full">
            <Sparkles className="w-12 h-12 text-nexus-blue/50 mb-4 animate-pulse" />
            <h2 className="text-2xl text-gray-400 font-medium tracking-tight">Selecione um tópico na trilha ao lado para iniciar.</h2>
          </div>
        ) : (
          <div className="max-w-[1000px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out pb-20">

            {/* Topic Header */}
            <div className="mb-12">
              <div className="inline-flex items-center gap-3 text-xs text-nexus-blue-light font-black tracking-[0.2em] uppercase mb-8 bg-nexus-blue-dark/20 px-5 py-2.5 rounded-full border border-nexus-blue/30 shadow-[0_0_20px_rgba(14,165,233,0.1)]">
                <span className="flex items-center gap-2"><Target className="w-4 h-4" /> {selectedYear}º ano</span>
                <ChevronRight className="w-3 h-3 text-nexus-blue-light/50" />
                <span>{subject.name}</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 leading-[1.1] drop-shadow-2xl">
                {currentTopic.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center px-5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-mono font-bold text-gray-300 shadow-inner backdrop-blur-md">
                  <span className="text-nexus-blue mr-3 uppercase tracking-widest text-[10px]">Cód BNCC</span>
                  {currentTopic.bncc}
                </div>
                <div className="inline-flex items-center px-5 py-2.5 bg-black/40 border border-white/10 rounded-xl text-xs font-bold text-gray-300 shadow-inner backdrop-blur-md gap-2">
                  <Clock className="w-4 h-4 text-nexus-blue-light" />
                  <span className="uppercase tracking-widest">{currentTopic.estimatedMinutes} minutos</span>
                </div>
              </div>
            </div>

            {/* Smart Content Selector (Intelligent Interface) */}
            <div className="flex bg-[#18181b]/80 p-2 rounded-[24px] border border-white/10 mb-10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl relative z-20 w-full max-w-3xl mx-auto ring-1 ring-white/5">
              {[
                { id: 'video', label: 'Videoaula HD', icon: Video },
                { id: 'text', label: 'Explicação Profunda', icon: FileText },
                { id: 'slides', label: 'Material (PDF)', icon: Presentation },
              ].map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'video' | 'slides' | 'text')}
                    className={`flex-1 py-4 flex flex-col items-center justify-center gap-2 font-black transition-all duration-500 rounded-[18px] relative overflow-hidden ${isActive
                        ? 'text-white'
                        : 'text-gray-500 hover:text-white/80 hover:bg-white/5'
                      }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-b from-white/15 to-transparent border border-white/20 rounded-[18px] shadow-[0_0_30px_rgba(255,255,255,0.1)] z-0"></div>
                    )}
                    <Icon className={`w-5 h-5 relative z-10 transition-transform duration-500 ${isActive ? 'scale-110 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]' : ''}`} />
                    <span className="text-[10px] uppercase tracking-[0.2em] relative z-10">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Content Area */}
            <div className="animate-in fade-in zoom-in-95 duration-500 relative z-10">
              {activeTab === 'video' && (
                <div className="rounded-[40px] p-1.5 bg-gradient-to-b from-white/10 via-white/5 to-transparent shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative group/player ring-1 ring-white/10">
                  <div className="absolute inset-0 bg-[#18181b] rounded-[40px] z-0"></div>

                  <div className="relative z-10 rounded-[36px] overflow-hidden bg-black flex flex-col">

                    {/* Floating HD Badge */}
                    <div className="absolute top-6 left-6 z-30 pointer-events-none">
                      <div className="bg-black/40 backdrop-blur-2xl px-5 py-3 rounded-2xl border border-white/10 shadow-2xl flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        <span className="text-white text-xs font-black tracking-widest uppercase">Aula em HD</span>
                      </div>
                    </div>

                    {/* Player Content Area */}
                    <div className="w-full flex flex-col gap-10">
                      {currentTopic.videoUrls && currentTopic.videoUrls.length > 0 ? (
                        currentTopic.videoUrls.map((url, index) => (
                          <div key={index} className="flex flex-col gap-0">
                            <div className="aspect-video relative flex items-center justify-center w-full">
                              <iframe
                                className="absolute inset-0 w-full h-full rounded-[36px] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
                                src={url}
                                title={`${currentTopic.videoTitle} - Parte ${index + 1}`}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                referrerPolicy="strict-origin-when-cross-origin"
                                allowFullScreen
                              ></iframe>
                            </div>
                            {currentTopic.videoMetas && currentTopic.videoMetas[index] && (
                              <div className="flex flex-wrap items-center gap-3 px-6 py-4 mt-2">
                                <svg className="w-5 h-5 text-red-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                                <a
                                  href={currentTopic.videoMetas[index].videoLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-bold text-nexus-blue-light hover:text-white transition-colors underline underline-offset-4 decoration-nexus-blue/40 hover:decoration-white/60"
                                >
                                  {currentTopic.videoMetas[index].videoLink}
                                </a>
                                <span className="text-gray-600 text-xs">•</span>
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/10">
                                  {currentTopic.videoMetas[index].channelName}
                                </span>
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="aspect-video relative flex items-center justify-center w-full">
                          {/* Background Image */}
                          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center opacity-30"></div>

                          {/* Glow Overlays */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-10"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10"></div>
                          
                          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none text-center p-8">
                            <div className="w-24 h-24 bg-white/5 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center shadow-2xl mb-8">
                               <Video className="w-10 h-10 text-white/40" />
                            </div>
                            <h3 className="text-3xl lg:text-4xl font-black text-white mb-4 drop-shadow-2xl tracking-tight">
                              Aula em Produção
                            </h3>
                            <p className="text-gray-400 font-medium text-lg max-w-md">
                              O conteúdo em vídeo para este tópico estará disponível em breve.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'text' && (
                <div className="rounded-[40px] bg-[#18181b] shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-nexus-blue/10 blur-[100px] rounded-full pointer-events-none"></div>

                  <div className="max-w-4xl mx-auto p-12 pt-16 pb-24 relative z-10">
                    <div className="mb-10 text-center">
                      <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-white/10 bg-white/5 text-[10px] font-mono font-bold tracking-widest text-nexus-blue-light uppercase mb-8 shadow-inner backdrop-blur-md">
                        <FileText className="w-3.5 h-3.5" /> Leitura Aprofundada
                      </span>
                      <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl mb-8 leading-[1.1]">
                        {currentTopic.title}
                      </h2>
                      <div className="flex items-center justify-center gap-6 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-nexus-blue" /> 12 min</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                        <span className="flex items-center gap-2"><BookOpen className="w-4 h-4 text-nexus-blue" /> {subject.name}</span>
                      </div>
                    </div>

                    <div className="prose prose-invert prose-xl prose-blue max-w-none text-gray-300 font-medium leading-relaxed bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[40px] p-10 md:p-16 shadow-2xl">
                      <p className="text-2xl text-white leading-relaxed font-semibold mb-10 border-l-4 border-nexus-blue pl-6">
                        A base de tudo começa pela compreensão profunda dos conceitos fundamentais que regem nossa análise e nossas decisões no dia a dia acadêmico.
                      </p>
                      <p>
                        Neste módulo, exploraremos as principais teorias e aplicações de <strong>{currentTopic.title}</strong>, garantindo que você possua o conhecimento necessário não só para absorver a técnica, mas também para dominá-la em profundidade. Quando nos debruçamos sobre este tema, encontramos ligações diretas com o {subject.name} moderno.
                      </p>
                      <div className="my-12 p-10 rounded-[32px] bg-gradient-to-r from-nexus-blue-dark/30 to-transparent border border-nexus-blue/30 relative overflow-hidden group/quote">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover/quote:opacity-20 transition-opacity">
                          <MessageSquare className="w-24 h-24 text-nexus-blue" />
                        </div>
                        <h4 className="text-nexus-blue-light font-black uppercase tracking-[0.3em] text-xs mb-4 mt-0 relative z-10">Conceito Central</h4>
                        <p className="text-white font-medium text-xl m-0 relative z-10">"A verdadeira maestria se atinge quando a complexidade se dissolve na intuição. Domine a base, e todo o resto será consequência natural do seu estudo."</p>
                      </div>
                      <p>
                        Muitos estudantes enfrentam desafios porque tentam decorar os passos em vez de entender os mecanismos. Nosso objetivo aqui é desconstruir as ideias complexas em blocos simples, utilizando analogias do mundo real e aplicando raciocínio lógico em cada etapa do processo.
                      </p>
                      <ul className="space-y-5 my-10 text-gray-300 bg-white/5 p-8 rounded-3xl border border-white/5">
                        <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-1 shadow-[0_0_15px_rgba(52,211,153,0.5)] rounded-full" /> <span className="pt-0.5">Compreensão detalhada da estrutura teórica e suas variantes.</span></li>
                        <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-1 shadow-[0_0_15px_rgba(52,211,153,0.5)] rounded-full" /> <span className="pt-0.5">Aplicação das regras em cenários simulados para fixação.</span></li>
                        <li className="flex items-start gap-4"><CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-1 shadow-[0_0_15px_rgba(52,211,153,0.5)] rounded-full" /> <span className="pt-0.5">Análise de resolução de problemas comuns e atalhos mentais.</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'slides' && (
                <div className="rounded-[40px] p-1.5 bg-gradient-to-b from-white/10 via-white/5 to-transparent shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative ring-1 ring-white/10">
                  <div className="absolute inset-0 bg-[#18181b] rounded-[40px] z-0"></div>
                  <div className="relative z-10 rounded-[36px] overflow-hidden bg-black aspect-video flex items-center justify-center">
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#080a10] via-[#050608] to-black p-10 text-center relative overflow-hidden z-10">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-nexus-blue/10 blur-[120px] rounded-full pointer-events-none"></div>

                      <div className="relative mb-10 group/pdf">
                        <div className="absolute inset-0 bg-nexus-blue-light/20 blur-2xl rounded-full animate-pulse-slow"></div>
                        <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center backdrop-blur-xl shadow-2xl relative z-10 group-hover/pdf:scale-105 transition-transform duration-500 group-hover/pdf:rotate-3">
                          <Download className="w-16 h-16 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]" />
                        </div>
                      </div>

                      <h3 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight drop-shadow-xl relative z-10">Material de Apoio</h3>
                      <p className="text-lg text-gray-400 max-w-2xl mb-12 font-medium leading-relaxed relative z-10">
                        Baixe o guia completo desta aula em alta resolução. Contém mapas mentais, resumos teóricos e exercícios extras.
                      </p>

                      <button className="px-12 py-6 bg-white text-black hover:bg-nexus-blue-light hover:text-black rounded-[24px] font-black flex items-center gap-4 transition-all duration-300 shadow-[0_20px_50px_rgba(255,255,255,0.15)] hover:shadow-[0_20px_50px_rgba(14,165,233,0.3)] hover:-translate-y-1 uppercase tracking-widest text-sm relative z-10 group/btn">
                        <span>Baixar Arquivo PDF</span>
                        <div className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center group-hover/btn:bg-black/20 transition-colors">
                          <ArrowLeft className="w-4 h-4 -rotate-90" />
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Split Content Area: Theory & Practice */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

              {/* Theory Block */}
              <div className="lg:col-span-3 prose prose-invert prose-xl prose-blue max-w-none super-glass p-12 rounded-[40px] relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none"></div>
                <h2 className="text-3xl font-black flex items-center gap-4 mb-10 border-b border-white/10 pb-6 text-white tracking-tight">
                  <BookOpen className="w-8 h-8 text-nexus-blue" />
                  Teoria Completa
                </h2>

                <p className="text-2xl text-nexus-blue-light font-bold leading-relaxed mb-8 drop-shadow-md">
                  {currentTopic.introText}
                </p>

                <div className="space-y-6 text-gray-300 font-medium">
                  {currentTopic.detailedText.map((paragraph, idx) => {
                    const formattedText = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-black bg-nexus-blue/10 px-2 py-0.5 rounded-md">$1</strong>');
                    return (
                      <p key={idx} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedText }}></p>
                    );
                  })}
                </div>
              </div>

              {/* Practical Example Block */}
              <div className="lg:col-span-2 bg-gradient-to-br from-nexus-blue-dark/30 to-[#0f172a] border border-nexus-blue/30 rounded-[40px] p-10 relative overflow-hidden flex flex-col justify-center shadow-[0_20px_50px_rgba(14,165,233,0.1)] group/prat">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-nexus-blue rounded-full blur-[80px] opacity-40 group-hover/prat:opacity-60 transition-opacity duration-700"></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-nexus-blue flex items-center justify-center mb-8 shadow-[0_0_30px_rgba(14,165,233,0.5)]">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-6 tracking-tight">
                    {currentTopic.practicalExample.title}
                  </h3>
                  <p className="text-lg text-blue-100/80 leading-relaxed font-medium">
                    {currentTopic.practicalExample.text}
                  </p>
                </div>
              </div>
            </div>

            {/* Interactive Quiz Station */}
            <div className="bg-[#0A0F1C] border border-white/5 rounded-[40px] p-10 lg:p-16 relative overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.6)]">
              <div className="absolute bottom-0 right-0 w-full h-[400px] bg-gradient-to-t from-nexus-blue/10 to-transparent pointer-events-none"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 relative z-10 gap-6">
                <div>
                  <span className="inline-flex items-center gap-2 text-nexus-blue-light text-xs font-black tracking-[0.2em] uppercase mb-3 bg-nexus-blue/10 px-4 py-2 rounded-full border border-nexus-blue/20">
                    <Target className="w-4 h-4" /> Estação de Treinamento
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black text-white tracking-tight">Prove Seu Domínio</h3>
                </div>
                <div className="w-20 h-20 rounded-full bg-[#18181b] flex items-center justify-center border-4 border-nexus-blue text-2xl text-white font-black shadow-[0_0_30px_var(--color-nexus-blue-glow)] shrink-0">
                  1<span className="text-gray-500 text-lg">/1</span>
                </div>
              </div>

              <div className="super-glass p-8 rounded-[32px] mb-12 border-l-4 border-l-nexus-blue relative z-10">
                <p className="text-2xl text-white leading-relaxed font-bold">
                  {currentTopic.quiz.question}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                {currentTopic.quiz.options.map((option, index) => {
                  const isCorrect = option.isCorrect;
                  const isSelected = quizAnswer === index;

                  let btnClass = 'bg-[#0f172a] border-white/10 hover:border-nexus-blue hover:bg-nexus-blue/10 text-gray-300 hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(14,165,233,0.15)]';

                  if (hasAnswered) {
                    if (isSelected && isCorrect) {
                      btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-100 shadow-[0_0_40px_rgba(16,185,129,0.3)] ring-2 ring-emerald-500 transform scale-[1.03] z-10';
                    } else if (isSelected && !isCorrect) {
                      btnClass = 'bg-rose-500/20 border-rose-500 text-rose-100 ring-2 ring-rose-500/50 opacity-90';
                    } else if (!isSelected && isCorrect) {
                      btnClass = 'bg-emerald-500/5 border-emerald-500/30 text-emerald-300/70';
                    } else {
                      btnClass = 'bg-[#18181b] border-white/5 opacity-30 cursor-not-allowed text-gray-500';
                    }
                  }

                  return (
                    <button
                      key={index}
                      disabled={hasAnswered}
                      onClick={() => handleQuizSubmit(index)}
                      className={`w-full text-left px-8 py-6 rounded-3xl border-2 transition-all duration-300 font-bold flex justify-between items-center group ${btnClass}`}
                    >
                      <span className="text-lg lg:text-xl leading-relaxed">{option.text}</span>
                      <div className={`w-8 h-8 rounded-full border-2 shrink-0 ml-6 flex items-center justify-center transition-all duration-500 ${hasAnswered
                          ? (isSelected && isCorrect) || (!isSelected && isCorrect) ? 'border-emerald-500 bg-emerald-500 text-white' : isSelected && !isCorrect ? 'border-rose-500 bg-rose-500 text-white' : 'border-transparent'
                          : 'border-white/20 group-hover:border-nexus-blue group-hover:bg-nexus-blue/20'
                        }`}>
                        {hasAnswered && isCorrect && <CheckCircle2 className="w-5 h-5" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {hasAnswered && quizAnswer !== null && (
                <div className={`mt-12 p-8 rounded-[32px] font-medium flex items-start gap-6 border-2 animate-in fade-in slide-in-from-bottom-8 duration-700 shadow-2xl ${currentTopic.quiz.options[quizAnswer].isCorrect
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-900/20 border-emerald-500/50 text-emerald-100'
                    : 'bg-gradient-to-r from-rose-500/20 to-rose-900/20 border-rose-500/50 text-rose-100'
                  }`}>
                  <div className={`p-4 rounded-2xl shrink-0 shadow-inner ${currentTopic.quiz.options[quizAnswer].isCorrect ? 'bg-emerald-500/30' : 'bg-rose-500/30'}`}>
                    <MessageSquare className={`w-8 h-8 ${currentTopic.quiz.options[quizAnswer].isCorrect ? 'text-emerald-400' : 'text-rose-400'}`} />
                  </div>
                  <div className="pt-1">
                    <p className="font-black text-2xl lg:text-3xl mb-3 tracking-tight">
                      {currentTopic.quiz.options[quizAnswer].isCorrect ? 'Resposta Perfeita!' : 'Incorreto.'}
                    </p>
                    <p className="opacity-90 leading-relaxed text-lg lg:text-xl">
                      {currentTopic.quiz.options[quizAnswer].feedback}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Navegação Inferior */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-12 mt-16 pb-20 border-t border-white/10 gap-6">
              <button className="w-full sm:w-auto px-8 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                Voltar ao Tópico Anterior
              </button>
              <button className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-nexus-blue to-nexus-blue-dark hover:from-nexus-blue-light hover:to-nexus-blue text-[#030712] rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(14,165,233,0.4)] hover:shadow-[0_20px_40px_rgba(14,165,233,0.6)] transition-all flex items-center justify-center gap-3 hover:scale-105">
                Avançar Tópico
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
