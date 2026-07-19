import { Link } from 'react-router-dom';
import { ArrowRight, Zap, BookOpen, Clock, TrendingUp, Star } from 'lucide-react';
import type { Subject } from '../../data/subjects';

interface SubjectCardProps {
  subject: Subject;
  variant?: 'featured' | 'compact';
  index?: number;
}

export default function SubjectCard({ subject, variant = 'compact', index = 0 }: SubjectCardProps) {
  const Icon = subject.icon;
  const delay = `animation-delay-${Math.min((index + 1) * 100, 800)}`;

  if (variant === 'featured') {
    return (
      <Link
        to={`/aprender/${subject.id}`}
        className={`
          group relative overflow-hidden rounded-[36px] flex flex-col h-full min-h-[420px]
          deep-glass border border-white/6 hover:border-white/14
          transition-all duration-500 hover:-translate-y-2
          animate-reveal ${delay}
        `}
        style={{ boxShadow: `0 0 0 1px rgba(255,255,255,0.04), 0 40px 80px rgba(0,0,0,0.5)` }}
      >
        {/* Background gradient layer */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${subject.color} opacity-0 group-hover:opacity-8 transition-opacity duration-700`}
        />

        {/* Animated glow orb */}
        <div
          className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-[80px] opacity-25 group-hover:opacity-40 transition-opacity duration-700 animate-orb pointer-events-none"
          style={{ background: `radial-gradient(circle, ${subject.accentColor}, transparent 70%)` }}
        />

        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden rounded-[36px] pointer-events-none">
          <div className="animate-scan absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Floating particles */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-0 group-hover:opacity-60 animate-particle pointer-events-none"
            style={{
              background: subject.accentColor,
              top: `${20 + i * 18}%`,
              right: `${8 + i * 5}%`,
              animationDelay: `${i * 1.5}s`,
            }}
          />
        ))}

        <div className="relative z-10 p-9 flex flex-col flex-1">
          {/* Top row: icon + badge */}
          <div className="flex items-start justify-between mb-auto">
            <div className="relative">
              <div
                className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${subject.color} flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                style={{ boxShadow: `0 12px 40px ${subject.shadowColor}` }}
              >
                <Icon className="w-10 h-10 text-white drop-shadow-lg" />
              </div>
              {/* Orbit ring */}
              <div
                className="absolute inset-0 -m-3 rounded-full border border-dashed opacity-0 group-hover:opacity-30 transition-opacity duration-700 animate-spin-slow"
                style={{ borderColor: subject.accentColor }}
              />
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="px-3 py-1.5 rounded-full bg-white/6 border border-white/8 text-xs font-black text-white/70 uppercase tracking-wider">
                📍 Onde você parou
              </div>
              <div className="px-2.5 py-1 rounded-full bg-white/5 border border-white/6 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                {subject.difficulty}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="mt-8">
            {/* Breadcrumb: last topic */}
            <p className="text-[11px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              Último tópico estudado
            </p>
            <p className="text-sm font-bold text-gray-300 mb-5 truncate">{subject.lastTopic}</p>

            {/* Subject name */}
            <h3 className="text-4xl font-black text-white tracking-tight mb-2 leading-none">{subject.name}</h3>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">{subject.description}</p>

            {/* Stats row */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-400">
                  <span className="font-bold text-white">{subject.completedTopics}</span>/{subject.totalTopics} tópicos
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-500" />
                <span className="text-xs text-gray-400">{subject.estimatedHours}h estimadas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-xs font-bold text-amber-400">{subject.xpTotal.toLocaleString('pt-BR')} XP</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-7">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest">Progresso</span>
                <span className="text-sm font-black text-white">{subject.progress}%</span>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${subject.progressColor} relative overflow-hidden transition-all duration-1000`}
                  style={{ width: `${subject.progress}%` }}
                >
                  <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                </div>
              </div>
            </div>

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-7">
              {subject.tags.map(tag => (
                <span key={tag} className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/8 text-[10px] font-mono text-gray-500 uppercase tracking-wider">
                  {tag}
                </span>
              ))}
            </div>

            {/* CTA */}
            <div
              className="flex items-center justify-between px-6 py-4 rounded-2xl bg-white text-black group-hover:bg-gray-100 transition-colors font-black text-sm uppercase tracking-widest"
              style={{ boxShadow: `0 8px 24px rgba(255,255,255,0.1)` }}
            >
              <span>Continuar Trilha</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Compact variant
  return (
    <Link
      to={`/aprender/${subject.id}`}
      className={`
        group relative overflow-hidden rounded-2xl
        deep-glass border border-white/6
        transition-all duration-400 hover:-translate-y-1 hover:border-white/15
        p-5 flex flex-col gap-4
        animate-reveal ${delay}
      `}
      style={{
        boxShadow: `0 4px 24px rgba(0,0,0,0.4)`,
      }}
    >
      {/* Glow on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 20% 50%, ${subject.accentColor}10, transparent 70%)`,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${subject.color} flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:rotate-2 transition-all duration-300`}
            style={{ boxShadow: `0 6px 20px ${subject.shadowColor}` }}
          >
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-black text-white truncate">{subject.name}</h3>
            <p className="text-[11px] font-mono text-gray-500 truncate">{subject.recentActivity}</p>
          </div>
          <div className="shrink-0">
            <span className="text-lg font-black text-white">{subject.progress}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
          <div
            className={`h-full rounded-full ${subject.progressColor} transition-all duration-700`}
            style={{ width: `${subject.progress}%` }}
          />
        </div>

        {/* Bottom stats */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-xs font-bold text-amber-400">+{subject.xpTotal.toLocaleString('pt-BR')} XP</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-gray-500 group-hover:text-gray-300 transition-colors font-medium">
            Ver trilha <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </div>
      </div>
    </Link>
  );
}
