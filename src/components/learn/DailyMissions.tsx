import { useState } from 'react';
import { CheckCircle2, Clock, Zap, ArrowRight, Trophy, Lock } from 'lucide-react';
import { useStudentProgress } from '../../hooks/useStudentProgress';

export default function DailyMissions() {
  const { progress, completeMissionAction, getMissionTimeLeft } = useStudentProgress();
  const [justCompleted, setJustCompleted] = useState<string | null>(null);

  const handleComplete = (missionId: string) => {
    completeMissionAction(missionId);
    setJustCompleted(missionId);
    setTimeout(() => setJustCompleted(null), 1200);
  };

  const completedCount = progress.dailyMissions.filter(m => m.completed).length;
  const allDone = completedCount === progress.dailyMissions.length;

  const missionColors: Record<string, { bg: string; border: string; icon: string; glow: string }> = {
    'mission_exercise': {
      bg: 'from-orange-500/10 to-red-600/5',
      border: 'border-orange-500/20 hover:border-orange-500/40',
      icon: 'bg-orange-500/20 text-orange-400',
      glow: 'shadow-[0_0_20px_rgba(249,115,22,0.15)]',
    },
    'mission_read': {
      bg: 'from-emerald-500/10 to-teal-600/5',
      border: 'border-emerald-500/20 hover:border-emerald-500/40',
      icon: 'bg-emerald-500/20 text-emerald-400',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
    },
    'mission_quiz': {
      bg: 'from-violet-500/10 to-indigo-600/5',
      border: 'border-violet-500/20 hover:border-violet-500/40',
      icon: 'bg-violet-500/20 text-violet-400',
      glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]',
    },
  };

  return (
    <div className="animate-reveal animation-delay-200">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-400" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">Missões do Dia</h2>
            <p className="text-[11px] font-mono text-gray-500 tracking-wide">
              {completedCount}/{progress.dailyMissions.length} concluídas
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/4 border border-white/6">
          <Clock className="w-3 h-3 text-gray-500" />
          <span className="text-[11px] font-mono text-gray-500 tracking-wide">
            Reset em {getMissionTimeLeft()}
          </span>
        </div>
      </div>

      {/* Progress bar for all missions */}
      <div className="h-1 w-full bg-white/5 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-700"
          style={{ width: `${(completedCount / progress.dailyMissions.length) * 100}%` }}
        />
      </div>

      {/* All done banner */}
      {allDone && (
        <div className="mb-4 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-yellow-400/10 border border-amber-500/25 flex items-center gap-3 animate-reveal">
          <Trophy className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-sm font-black text-amber-300">Todas as missões concluídas! 🎉</p>
            <p className="text-xs text-gray-400">Você ganhou +150 XP de bônus hoje!</p>
          </div>
        </div>
      )}

      {/* Missions grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {progress.dailyMissions.map((mission, idx) => {
          const colors = missionColors[mission.id] ?? missionColors['mission_exercise'];
          const isJustDone = justCompleted === mission.id;

          return (
            <div
              key={mission.id}
              className={`
                relative overflow-hidden rounded-2xl border p-5 transition-all duration-500 cursor-default
                bg-gradient-to-br ${colors.bg} ${colors.border}
                ${mission.completed ? 'opacity-70' : `${colors.glow} hover:-translate-y-0.5`}
                animate-reveal animation-delay-${(idx + 1) * 100}
              `}
            >
              {/* Completed overlay */}
              {mission.completed && (
                <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
                  <CheckCircle2 className={`w-8 h-8 text-emerald-400 ${isJustDone ? 'animate-mission-tick' : ''}`} />
                </div>
              )}

              <div className={`flex items-start gap-3 ${mission.completed ? 'opacity-50' : ''}`}>
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${colors.icon}`}>
                  {mission.emoji}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-white leading-tight mb-0.5">{mission.title}</h3>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{mission.description}</p>

                  {/* Progress: currentCount / targetCount */}
                  {mission.targetCount > 1 && (
                    <div className="mb-3">
                      <div className="flex justify-between text-[10px] font-mono text-gray-500 mb-1">
                        <span>{mission.currentCount}/{mission.targetCount}</span>
                      </div>
                      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-current to-current rounded-full transition-all duration-500"
                          style={{ width: `${(mission.currentCount / mission.targetCount) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Reward */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span className="text-xs font-black text-amber-400">+{mission.xpReward} XP</span>
                      {mission.badgeReward && (
                        <span className="text-xs text-violet-400 font-bold ml-1">+ badge</span>
                      )}
                    </div>

                    {!mission.completed && (
                      <button
                        onClick={() => handleComplete(mission.id)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/8 border border-white/10 hover:bg-white/15 transition-all text-[10px] font-black text-white uppercase tracking-wider"
                      >
                        Ir <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
