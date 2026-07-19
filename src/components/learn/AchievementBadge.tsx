import type { Achievement } from '../../hooks/useStudentProgress';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

const RARITY_CONFIG = {
  bronze: {
    bg: 'from-amber-800/40 to-yellow-900/20',
    border: 'border-amber-700/40',
    glow: 'rgba(180, 83, 9, 0.3)',
    label: 'Bronze',
    labelColor: 'text-amber-700',
    ring: 'ring-amber-700/30',
  },
  silver: {
    bg: 'from-slate-400/20 to-slate-500/10',
    border: 'border-slate-400/30',
    glow: 'rgba(148, 163, 184, 0.3)',
    label: 'Prata',
    labelColor: 'text-slate-400',
    ring: 'ring-slate-400/30',
  },
  gold: {
    bg: 'from-yellow-400/20 to-amber-500/10',
    border: 'border-yellow-400/40',
    glow: 'rgba(250, 204, 21, 0.35)',
    label: 'Ouro',
    labelColor: 'text-yellow-400',
    ring: 'ring-yellow-400/30',
  },
  platinum: {
    bg: 'from-cyan-300/20 to-sky-400/10',
    border: 'border-cyan-300/40',
    glow: 'rgba(103, 232, 249, 0.3)',
    label: 'Platina',
    labelColor: 'text-cyan-300',
    ring: 'ring-cyan-300/30',
  },
  legendary: {
    bg: 'from-violet-500/30 via-fuchsia-500/20 to-pink-500/20',
    border: 'border-violet-400/50',
    glow: 'rgba(167, 139, 250, 0.45)',
    label: 'Lendário',
    labelColor: 'text-violet-300',
    ring: 'ring-violet-400/40',
  },
};

const SIZE_CONFIG = {
  sm: { wrapper: 'w-12 h-12', emoji: 'text-xl', ring: 'ring-1' },
  md: { wrapper: 'w-16 h-16', emoji: 'text-3xl', ring: 'ring-2' },
  lg: { wrapper: 'w-20 h-20', emoji: 'text-4xl', ring: 'ring-2' },
};

export default function AchievementBadge({
  achievement,
  size = 'md',
  showLabel = false,
  animate = true,
}: AchievementBadgeProps) {
  const rarity = RARITY_CONFIG[achievement.rarity];
  const sizeConf = SIZE_CONFIG[size];

  return (
    <div
      className={`group flex flex-col items-center gap-2 ${animate ? 'animate-badge-pop' : ''}`}
      title={`${achievement.title}: ${achievement.description}`}
    >
      {/* Badge circle */}
      <div
        className={`
          relative ${sizeConf.wrapper} rounded-full
          flex items-center justify-center
          bg-gradient-to-br ${rarity.bg}
          border ${rarity.border}
          ${sizeConf.ring} ${rarity.ring}
          cursor-default transition-transform duration-300 group-hover:scale-110
        `}
        style={{ boxShadow: `0 0 20px ${rarity.glow}, inset 0 1px 0 rgba(255,255,255,0.1)` }}
      >
        {/* Legendary shimmer overlay */}
        {achievement.rarity === 'legendary' && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          </div>
        )}

        <span className={`${sizeConf.emoji} relative z-10`}>{achievement.emoji}</span>
      </div>

      {/* Label */}
      {showLabel && (
        <div className="text-center">
          <p className="text-xs font-black text-white leading-tight">{achievement.title}</p>
          <p className={`text-[10px] font-mono uppercase tracking-wider ${rarity.labelColor}`}>
            {rarity.label}
          </p>
        </div>
      )}
    </div>
  );
}

/* Compact row version for listing */
export function AchievementRow({ achievement }: { achievement: Achievement }) {
  const rarity = RARITY_CONFIG[achievement.rarity];

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/5 hover:border-white/10 transition-all group">
      <AchievementBadge achievement={achievement} size="sm" animate={false} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-black text-white leading-tight truncate">{achievement.title}</p>
        <p className="text-[11px] text-gray-500 truncate">{achievement.description}</p>
      </div>
      <span className={`text-[10px] font-mono font-black uppercase tracking-widest ${rarity.labelColor} shrink-0`}>
        {rarity.label}
      </span>
    </div>
  );
}
