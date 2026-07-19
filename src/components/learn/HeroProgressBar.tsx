import { Flame, Star, TrendingUp, ArrowRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudentProgress } from '../../hooks/useStudentProgress';

export default function HeroProgressBar() {
  const { progress, getGreeting, getXpPercent } = useStudentProgress();
  const xpPct = getXpPercent();

  return (
    <div className="relative w-full overflow-hidden rounded-[32px] deep-glass animate-reveal">
      {/* Ambient orbs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-[80px] opacity-20 animate-orb pointer-events-none"
        style={{ background: 'radial-gradient(circle, #0EA5E9, transparent)' }} />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full blur-[70px] opacity-15 animate-orb pointer-events-none"
        style={{ animationDelay: '-6s', background: 'radial-gradient(circle, #8B5CF6, transparent)' }} />

      {/* Subtle scan line */}
      <div className="absolute inset-0 overflow-hidden rounded-[32px] pointer-events-none">
        <div className="animate-scan absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-nexus-blue/40 to-transparent" />
      </div>

      <div className="relative z-10 p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between">

        {/* Left: Greeting + Level */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-gray-500">
              {getGreeting()},
            </span>
            {/* Streak badge */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-streak" />
              <span className="text-xs font-black text-amber-400 tracking-wide">
                {progress.streak} dias seguidos
              </span>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-none mb-1">
            {progress.name}
          </h2>

          <div className="flex items-center gap-2 mt-2">
            <div className="xp-badge flex items-center gap-1.5 px-3 py-1 rounded-full">
              <Star className="w-3 h-3 text-amber-400" />
              <span className="text-xs font-black text-amber-300 tracking-wider">
                Nível {progress.level} — {progress.levelName}
              </span>
            </div>
          </div>

          {/* XP Bar */}
          <div className="mt-5 max-w-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-mono text-gray-500 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3 text-nexus-blue" /> XP
              </span>
              <span className="text-[11px] font-mono text-gray-400">
                {progress.xp.toLocaleString('pt-BR')} / {progress.xpNextLevel.toLocaleString('pt-BR')}
              </span>
            </div>
            <div className="relative h-2.5 rounded-full bg-white/5 overflow-hidden">
              {/* Track glow */}
              <div className="absolute inset-0 rounded-full bg-nexus-blue/5" />
              {/* Fill */}
              <div
                className="h-full rounded-full bg-gradient-to-r from-nexus-blue via-sky-400 to-cyan-300 relative overflow-hidden transition-all duration-1000"
                style={{ width: `${xpPct}%` }}
              >
                <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/30 to-transparent" />
              </div>
            </div>
            <p className="text-[10px] font-mono text-gray-600 mt-1.5 tracking-widest">
              {progress.xpNextLevel - progress.xp} XP para o Nível {progress.level + 1}
            </p>
          </div>
        </div>

        {/* Divider (desktop) */}
        <div className="hidden lg:block w-px h-28 bg-white/5" />

        {/* Right: Stats Grid + CTA */}
        <div className="flex flex-col gap-5 shrink-0">
          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Tópicos', value: progress.completedTopics.length + 13, icon: TrendingUp, color: 'text-nexus-blue' },
              { label: 'Conquistas', value: progress.achievements.length, icon: Star, color: 'text-amber-400' },
              { label: 'Streak', value: `${progress.streak}d`, icon: Flame, color: 'text-orange-400' },
            ].map(stat => (
              <div key={stat.label} className="flex flex-col items-center p-3 rounded-2xl bg-white/3 border border-white/5 min-w-[72px]">
                <stat.icon className={`w-4 h-4 ${stat.color} mb-1`} />
                <span className="text-lg font-black text-white leading-none">{stat.value}</span>
                <span className="text-[10px] text-gray-500 font-mono mt-0.5 tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>

          {/* CTA: Continue where left off */}
          <Link
            to="/aprender/matematica"
            className="group flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-nexus-blue to-sky-400 hover:from-sky-400 hover:to-nexus-blue transition-all duration-300 shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] transform hover:-translate-y-0.5"
          >
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-mono text-white/70 uppercase tracking-[0.2em]">Continuar de onde parou</p>
              <p className="text-sm font-black text-white truncate">Potências e Raízes · Mat.</p>
            </div>
            <ArrowRight className="w-5 h-5 text-white shrink-0 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
