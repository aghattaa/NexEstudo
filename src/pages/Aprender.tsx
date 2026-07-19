import { Sparkles, GraduationCap } from 'lucide-react';
import { subjects } from '../data/subjects';
import SubjectCard from '../components/learn/SubjectCard';

// ─── Section divider ─────────────────────────────────────────────────────────
function SectionDivider() {
  return <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent my-1" />;
}

export default function Aprender() {
  return (
    <div className="relative flex-1 w-full bg-nexus-bg min-h-screen overflow-x-hidden flex flex-col">

      {/* ── COSMIC BACKGROUND ── */}
      <div className="pointer-events-none fixed inset-0 z-0">
        {/* Gradient grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

        {/* Ambient orbs */}
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full blur-[150px] opacity-10 animate-orb"
          style={{ background: 'radial-gradient(circle, #0EA5E9, transparent 70%)' }} />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-10 animate-orb pointer-events-none"
          style={{ animationDelay: '-4s', background: 'radial-gradient(circle, #8B5CF6, transparent 70%)' }} />
      </div>

      {/* ── CONTENT ── */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 space-y-12 w-full flex-1 flex flex-col justify-center">

        {/* ── PAGE HEADER ── */}
        <div className="text-center animate-reveal flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 shadow-inner">
            <GraduationCap className="w-4 h-4 text-nexus-blue" />
            <span className="text-xs font-mono text-gray-300 uppercase tracking-widest">Trilhas de Conhecimento</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none mb-6">
            Escolha sua{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500 animate-text-shimmer drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]">
              Jornada
            </span>
          </h1>
          
          <p className="text-xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
            Selecione uma disciplina para mergulhar no universo do aprendizado. Módulos completos com videoaulas HD, materiais em PDF e exercícios interativos.
          </p>
        </div>

        <div className="py-8">
          <SectionDivider />
        </div>

        {/* ── SUBJECT CARDS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-20">
          {subjects.map((subject, index) => (
            <div key={subject.id} className="h-full">
              {/* Force featured variant for all of them so they look massive and colorful */}
              <SubjectCard subject={subject} variant="featured" index={index} />
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
