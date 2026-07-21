import { Link } from 'react-router-dom';
import { BookOpen, CalendarCheck, Target, ArrowRight, Calculator, Sparkles, Zap, Shield, Microscope, PenTool } from 'lucide-react';
import { subjects } from '../data/subjects';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-nexus-bg overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-16 lg:py-40 flex items-center justify-center">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-nexus-blue-dark via-nexus-blue to-indigo-600 blur-[100px] rounded-full mix-blend-screen"></div>
        </div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-10 right-20 w-96 h-96 bg-nexus-blue-dark/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-nexus-blue-light text-sm font-medium mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4" /> Plataforma de Aprendizado 2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter mb-6 lg:mb-8 leading-[1.1]">
            Estude de forma <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
              inteligente e visual.
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
            Uma experiência imersiva para alunos do Ensino Fundamental. 
            Teoria interativa, prática gamificada e gestão de rotina num só lugar.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6 w-full max-w-lg mx-auto">
            <Link to="/aprender" className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4.5 bg-nexus-blue hover:bg-nexus-blue-light rounded-2xl text-white font-bold text-lg shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-all transform hover:-translate-y-1">
              Começar a Estudar
              <BookOpen className="w-5 h-5" />
            </Link>
            <Link to="/organizar" className="flex-1 inline-flex items-center justify-center gap-3 px-8 py-4.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold text-lg hover:bg-white/10 hover:border-white/20 backdrop-blur-md transition-all">
              Minha Rotina
              <CalendarCheck className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Bento Grid */}
      <section className="py-12 lg:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 p-10 bg-gradient-to-br from-nexus-card/80 to-nexus-bg border border-white/5 rounded-[32px] hover:border-nexus-blue/30 transition-colors group relative overflow-hidden">
               <div className="absolute right-0 top-0 w-64 h-64 bg-nexus-blue/10 blur-3xl rounded-full group-hover:bg-nexus-blue/20 transition-colors"></div>
               <div className="w-14 h-14 bg-nexus-blue/20 rounded-2xl flex items-center justify-center mb-6 border border-nexus-blue/30">
                 <Zap className="w-7 h-7 text-nexus-blue-light" />
               </div>
               <h3 className="text-3xl font-bold mb-4 text-white">Aprenda na Velocidade da Luz</h3>
               <p className="text-gray-400 text-lg leading-relaxed max-w-md">
                 Nossa metodologia transforma textos chatos em pílulas de conhecimento imersivas, com vídeos, slides e quizzes dinâmicos na mesma tela.
               </p>
            </div>

            <div className="p-10 bg-gradient-to-br from-[#2a2560]/80 to-nexus-bg border border-white/5 rounded-[32px] hover:border-indigo-500/30 transition-colors group relative overflow-hidden">
               <div className="absolute left-0 bottom-0 w-40 h-40 bg-indigo-500/10 blur-2xl rounded-full group-hover:bg-indigo-500/20 transition-colors"></div>
               <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                 <Shield className="w-7 h-7 text-indigo-400" />
               </div>
               <h3 className="text-2xl font-bold mb-4 text-white">Foco Total</h3>
               <p className="text-gray-400 leading-relaxed">
                 Ferramentas de Pomodoro e Metas integradas para evitar a procrastinação.
               </p>
            </div>

          </div>
        </div>
      </section>


      {/* Premium Subjects Showcase */}
      <section className="py-32 relative z-10 bg-nexus-dark/80 border-t border-white/5">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop')] opacity-[0.03] bg-cover bg-center pointer-events-none mix-blend-screen"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nexus-blue/10 border border-nexus-blue/20 text-nexus-blue-light text-sm font-medium mb-6 animate-float">
              <Target className="w-4 h-4" /> Ensino Fundamental 2
            </div>
            <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
              Nossas <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">Disciplinas</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Domine as matérias mais importantes do 6º ao 9º ano com trilhas imersivas, conteúdos visuais de alta definição e exercícios dinâmicos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Ambient Background Behind Cards */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-nexus-blue/20 blur-[150px] rounded-full pointer-events-none"></div>
            
            {subjects.map((sub, idx) => {
              const Icon = sub.icon;
              return (
                <div key={sub.id} className={`super-glass rounded-[40px] p-10 flex flex-col transition-all duration-700 cursor-default group relative overflow-hidden transform hover:-translate-y-4 hover:shadow-[0_40px_100px_rgba(0,0,0,0.8)] ${sub.borderColor}`} style={{ animationDelay: `${idx * 200}ms` }}>
                  {/* Glow layer */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${sub.color} opacity-0 group-hover:opacity-10 blur-3xl transition-opacity duration-700`}></div>
                  
                  {/* Floating geometric blob */}
                  <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 ${sub.glow} animate-pulse-slow`}></div>

                  <div className="relative z-10 flex flex-col h-full">
                    <div
                      className={`w-24 h-24 rounded-[32px] flex items-center justify-center bg-gradient-to-br ${sub.color} mb-8 group-hover:scale-110 transition-transform duration-500 group-hover:rotate-6`}
                      style={{ boxShadow: `0 8px 32px ${sub.shadowColor}` }}
                    >
                      <Icon className="w-12 h-12 text-white drop-shadow-lg" />
                    </div>
                    
                    <h3 className="text-4xl font-black mb-4 text-white tracking-tight">{sub.name}</h3>
                    <p className="text-lg text-gray-400 leading-relaxed mb-10 group-hover:text-gray-300 transition-colors font-medium">
                      {sub.description}
                    </p>
                    
                    <div className="mt-auto pt-8 border-t border-white/10">
                      <Link to={`/aprender/${sub.id}`} className="flex items-center justify-between w-full group/btn">
                        <span className="font-bold text-white group-hover/btn:text-nexus-blue-light transition-colors text-lg">Acessar Aulas</span>
                        <div className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover/btn:bg-gradient-to-r ${sub.color} transition-all duration-300 border border-white/10 group-hover/btn:scale-110`}>
                          <ArrowRight className="w-5 h-5 text-white" />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
        </div>
      </section>
    </div>
  );
}
