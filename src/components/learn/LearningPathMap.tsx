import { useState } from 'react';
import { CheckCircle2, Lock, Star, Clock, ChevronRight, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { TopicContent, YearData } from '../../data/subjects';
import { useStudentProgress } from '../../hooks/useStudentProgress';

interface LearningPathMapProps {
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  accentColor: string;
  years: YearData[];
}

type NodeStatus = 'completed' | 'active' | 'locked';

function getNodeStatus(topicId: string, completedTopics: string[], isFirst: boolean): NodeStatus {
  if (completedTopics.includes(topicId)) return 'completed';
  if (isFirst || completedTopics.length > 0) return 'active'; // simplified: first unlocked or any completed
  return 'locked';
}

interface PathNodeProps {
  topic: TopicContent;
  status: NodeStatus;
  subjectId: string;
  accentColor: string;
  isLast: boolean;
  index: number;
}

function PathNode({ topic, status, subjectId, accentColor, isLast, index }: PathNodeProps) {
  const isBoss = topic.estimatedMinutes >= 60;

  const nodeColors = {
    completed: { bg: '#10B981', border: '#10B981', shadow: 'rgba(16,185,129,0.5)', text: 'text-emerald-400' },
    active:    { bg: accentColor, border: accentColor, shadow: `rgba(14,165,233,0.6)`, text: 'text-nexus-blue-light' },
    locked:    { bg: 'transparent', border: 'rgba(255,255,255,0.1)', shadow: 'transparent', text: 'text-gray-600' },
  };
  const colors = nodeColors[status];

  const NodeWrapper = status === 'locked'
    ? ({ children }: { children: React.ReactNode }) => <div className="group relative flex flex-col items-center">{children}</div>
    : ({ children }: { children: React.ReactNode }) => (
        <Link to={`/aprender/${subjectId}`} className="group relative flex flex-col items-center">
          {children}
        </Link>
      );

  return (
    <div className={`flex flex-col items-center relative animate-reveal animation-delay-${Math.min((index + 1) * 100, 800)}`}>
      <NodeWrapper>
        {/* Connector line going right (not on last) */}
        {!isLast && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 w-8 md:w-12 z-0 pointer-events-none">
            <div className={`h-0.5 w-full ${status === 'completed' ? 'bg-emerald-500/60' : 'bg-white/10'} rounded-full`} />
          </div>
        )}

        {/* Node circle */}
        <div
          className={`
            relative z-10 flex items-center justify-center rounded-full border-2 transition-all duration-300
            ${isBoss ? 'w-14 h-14' : 'w-11 h-11'}
            ${status === 'active' ? 'animate-node-pulse' : ''}
            ${status === 'locked' ? 'opacity-40 cursor-not-allowed' : 'group-hover:scale-110 cursor-pointer'}
          `}
          style={{
            background: status === 'completed' ? colors.bg : status === 'active' ? `${colors.bg}20` : 'rgba(255,255,255,0.03)',
            borderColor: colors.border,
            boxShadow: status !== 'locked' ? `0 0 16px ${colors.shadow}` : 'none',
          }}
        >
          {status === 'completed' && <CheckCircle2 className="w-5 h-5 text-white" />}
          {status === 'active' && (
            <div
              className="w-4 h-4 rounded-full animate-pulse"
              style={{ background: colors.bg }}
            />
          )}
          {status === 'locked' && <Lock className="w-4 h-4 text-gray-600" />}
          {isBoss && status !== 'locked' && (
            <div className="absolute -top-1 -right-1 text-[10px]">⭐</div>
          )}
        </div>

        {/* Tooltip on hover */}
        <div className={`
          absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-20
          w-44 p-3 rounded-xl bg-[#0a0c18] border border-white/10
          opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none
          shadow-2xl
        `}>
          <p className={`text-xs font-black ${colors.text} mb-0.5 leading-tight`}>{topic.title}</p>
          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-mono">
            <Clock className="w-2.5 h-2.5" />
            <span>{topic.estimatedMinutes} min</span>
            {topic.bncc && (
              <span className="px-1.5 py-0.5 rounded bg-white/5 text-[9px]">{topic.bncc}</span>
            )}
          </div>
        </div>

        {/* Label below */}
        <p className={`mt-2.5 text-[10px] font-bold text-center max-w-[80px] leading-tight ${status === 'locked' ? 'text-gray-600' : 'text-gray-400 group-hover:text-white transition-colors'}`}>
          {topic.title.length > 20 ? topic.title.slice(0, 18) + '…' : topic.title}
        </p>
      </NodeWrapper>
    </div>
  );
}

export default function LearningPathMap({ subjectId, subjectName, subjectColor, accentColor, years }: LearningPathMapProps) {
  const { progress } = useStudentProgress();
  const [activeYear, setActiveYear] = useState(0);
  const currentYear = years[activeYear];

  return (
    <div className="animate-reveal animation-delay-400">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}
          >
            <Trophy className="w-4 h-4" style={{ color: accentColor }} />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-tight">Mapa de Trilha</h2>
            <p className="text-[11px] font-mono text-gray-500 tracking-wide">{subjectName}</p>
          </div>
        </div>

        {/* Year selector - Premium Segmented Control */}
        <div className="flex p-1 bg-[#0a0a0a]/80 border border-white/5 rounded-2xl backdrop-blur-xl shadow-inner overflow-x-auto custom-scrollbar max-w-[full]">
          {years.map((y, i) => {
            const isActive = activeYear === i;
            return (
              <button
                key={y.year}
                onClick={() => setActiveYear(i)}
                className={`relative px-5 py-2.5 rounded-[14px] text-[11px] font-black uppercase tracking-widest transition-all duration-300 shrink-0 ${
                  isActive ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {isActive && (
                  <div 
                    className="absolute inset-0 rounded-[14px] border border-white/10 z-0"
                    style={{ 
                      boxShadow: `0 0 20px ${accentColor}40, inset 0 0 10px ${accentColor}20`,
                      background: `linear-gradient(180deg, rgba(255,255,255,0.05) 0%, ${accentColor}20 100%)` 
                    }}
                  />
                )}
                <span className="relative z-10">{y.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Map container */}
      <div className="deep-glass rounded-2xl p-6 overflow-x-auto custom-scrollbar">
        <div className="flex items-start gap-4 min-w-max px-2">
          {/* Start node */}
          <div className="flex flex-col items-center shrink-0">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-nexus-blue/30 to-indigo-500/20 border-2 border-nexus-blue/30 flex items-center justify-center">
              <Star className="w-4 h-4 text-nexus-blue" />
            </div>
            <p className="mt-2.5 text-[10px] font-mono text-gray-600 tracking-widest">Início</p>
          </div>

          {/* Connector */}
          <div className="flex items-center self-start mt-5">
            <div className="w-8 h-0.5 bg-gradient-to-r from-nexus-blue/30 to-white/10 rounded-full" />
          </div>

          {/* Topic nodes */}
          {currentYear.topics.map((topic, i) => {
            const status = getNodeStatus(topic.id, progress.completedTopics, i === 0);
            const isLast = i === currentYear.topics.length - 1;

            return (
              <PathNode
                key={topic.id}
                topic={topic}
                status={status}
                subjectId={subjectId}
                accentColor={accentColor}
                isLast={isLast}
                index={i}
              />
            );
          })}

          {/* Boss / End node */}
          <div className="flex items-center self-start mt-5">
            <div className="w-8 h-0.5 bg-white/5 rounded-full" />
          </div>
          <div className="flex flex-col items-center shrink-0 opacity-50">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center">
              <span className="text-xl">🏆</span>
            </div>
            <p className="mt-2.5 text-[10px] font-mono text-gray-600 text-center tracking-wide">Fim do<br/>Ano</p>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-5 pt-4 border-t border-white/5 flex flex-wrap gap-4">
          {[
            { color: '#10B981', label: 'Concluído' },
            { color: accentColor, label: 'Disponível', pulse: true },
            { color: 'rgba(255,255,255,0.15)', label: 'Bloqueado' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full border border-white/20 ${item.pulse ? 'animate-pulse' : ''}`}
                style={{ background: item.color }}
              />
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">{item.label}</span>
            </div>
          ))}
          <Link
            to={`/aprender/${subjectId}`}
            className="ml-auto flex items-center gap-1.5 text-[11px] font-bold text-nexus-blue-light hover:text-white transition-colors"
          >
            Ver trilha completa <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}


