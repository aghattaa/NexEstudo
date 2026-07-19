import { useState, useCallback, useEffect } from 'react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  rarity: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  unlockedAt?: Date;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  xpReward: number;
  badgeReward?: string;
  subjectId: string;
  targetCount: number;
  currentCount: number;
  completed: boolean;
  type: 'quiz' | 'read' | 'exercise';
}

export interface StudentProgress {
  name: string;
  level: number;
  levelName: string;
  xp: number;
  xpNextLevel: number;
  streak: number;
  lastStudied: string | null;
  completedTopics: string[];
  dailyMissions: DailyMission[];
  achievements: Achievement[];
  lastMissionReset: string | null;
}

const LEVEL_NAMES: Record<number, string> = {
  1: 'Aprendiz Iniciante',
  2: 'Explorador Curioso',
  3: 'Estudante Dedicado',
  4: 'Pesquisador Júnior',
  5: 'Analista em Formação',
  6: 'Cientista Aprendiz',
  7: 'Estrategista do Saber',
  8: 'Mestre das Ideias',
  9: 'Navegador do Conhecimento',
  10: 'Arquiteto do Futuro',
  11: 'Guardião do Saber',
  12: 'Pioneiro Acadêmico',
  13: 'Vanguarda Científica',
  14: 'Explorador Galáctico',
  15: 'Lenda do Conhecimento',
};

const XP_PER_LEVEL = (level: number) => 500 + level * 250;

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'streak_7', title: 'Imparável', description: '7 dias de estudo seguidos', emoji: '🔥', rarity: 'bronze' },
  { id: 'topics_10', title: 'Leitor Voraz', description: '10 tópicos lidos no total', emoji: '📚', rarity: 'bronze' },
  { id: 'first_quiz', title: 'Primeiro Teste', description: 'Completou seu primeiro quiz', emoji: '✅', rarity: 'bronze' },
  { id: 'quiz_perfect', title: 'Relâmpago', description: 'Quiz 100% em menos de 1 min', emoji: '⚡', rarity: 'silver' },
  { id: 'mat_50', title: 'Mestre dos Números', description: '50 questões de Matemática', emoji: '🧮', rarity: 'silver' },
  { id: 'all_subjects', title: 'Explorador', description: 'Todas as disciplinas iniciadas', emoji: '🌌', rarity: 'gold' },
  { id: 'complete_trail', title: 'Campeão', description: 'Completou uma trilha inteira', emoji: '🏆', rarity: 'platinum' },
  { id: 'streak_30', title: 'Inabalável', description: '30 dias de estudo consecutivos', emoji: '💎', rarity: 'legendary' },
];

const generateDailyMissions = (): DailyMission[] => [
  {
    id: 'mission_exercise',
    title: 'Resolver 5 Questões',
    description: 'Complete 5 exercícios de Matemática',
    emoji: '🔥',
    xpReward: 50,
    subjectId: 'matematica',
    targetCount: 5,
    currentCount: 0,
    completed: false,
    type: 'exercise',
  },
  {
    id: 'mission_read',
    title: 'Ler 1 Tópico',
    description: 'Estude um novo tópico de Ciências',
    emoji: '📖',
    xpReward: 30,
    subjectId: 'ciencias',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    type: 'read',
  },
  {
    id: 'mission_quiz',
    title: 'Completar Quiz',
    description: 'Faça o quiz de Português e tire nota máxima',
    emoji: '🎯',
    xpReward: 70,
    badgeReward: 'quiz_perfect',
    subjectId: 'portugues',
    targetCount: 1,
    currentCount: 0,
    completed: false,
    type: 'quiz',
  },
];

const DEFAULT_STATE: StudentProgress = {
  name: 'Gabriel Souza',
  level: 14,
  levelName: LEVEL_NAMES[14],
  xp: 780,
  xpNextLevel: XP_PER_LEVEL(14),
  streak: 7,
  lastStudied: null,
  completedTopics: [],
  dailyMissions: generateDailyMissions(),
  achievements: [
    { ...ALL_ACHIEVEMENTS[0], unlockedAt: new Date(Date.now() - 86400000 * 2) },
    { ...ALL_ACHIEVEMENTS[1], unlockedAt: new Date(Date.now() - 86400000 * 5) },
    { ...ALL_ACHIEVEMENTS[2], unlockedAt: new Date(Date.now() - 86400000 * 10) },
  ],
  lastMissionReset: new Date().toDateString(),
};

const STORAGE_KEY = 'nexus_student_progress';

function loadProgress(): StudentProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    // ignore parse errors
  }
  return DEFAULT_STATE;
}

function saveProgress(state: StudentProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore storage errors
  }
}

export function useStudentProgress() {
  const [progress, setProgress] = useState<StudentProgress>(() => loadProgress());

  // Persist on every change
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Check for mission reset (new day)
  useEffect(() => {
    const today = new Date().toDateString();
    if (progress.lastMissionReset !== today) {
      setProgress(p => ({
        ...p,
        dailyMissions: generateDailyMissions(),
        lastMissionReset: today,
      }));
    }
  }, []);

  const getGreeting = useCallback((): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  }, []);

  const getXpPercent = useCallback((): number => {
    return Math.min(100, Math.round((progress.xp / progress.xpNextLevel) * 100));
  }, [progress.xp, progress.xpNextLevel]);

  const completeTopicAction = useCallback((topicId: string, xpGained = 40) => {
    setProgress(p => {
      if (p.completedTopics.includes(topicId)) return p;
      const newXp = p.xp + xpGained;
      const newCompleted = [...p.completedTopics, topicId];
      let newLevel = p.level;
      let remainingXp = newXp;

      // Level up check
      while (remainingXp >= XP_PER_LEVEL(newLevel)) {
        remainingXp -= XP_PER_LEVEL(newLevel);
        newLevel++;
      }

      // Achievement checks
      const newAchievements = [...p.achievements];
      if (newCompleted.length >= 10 && !newAchievements.find(a => a.id === 'topics_10')) {
        newAchievements.push({ ...ALL_ACHIEVEMENTS[1], unlockedAt: new Date() });
      }

      return {
        ...p,
        xp: remainingXp,
        level: newLevel,
        levelName: LEVEL_NAMES[newLevel] ?? p.levelName,
        xpNextLevel: XP_PER_LEVEL(newLevel),
        completedTopics: newCompleted,
        achievements: newAchievements,
        lastStudied: new Date().toISOString(),
      };
    });
  }, []);

  const completeMissionAction = useCallback((missionId: string) => {
    setProgress(p => {
      const missions = p.dailyMissions.map(m => {
        if (m.id !== missionId || m.completed) return m;
        return { ...m, completed: true, currentCount: m.targetCount };
      });
      const mission = missions.find(m => m.id === missionId);
      const xpGained = mission?.xpReward ?? 0;
      const newXp = p.xp + xpGained;

      return { ...p, dailyMissions: missions, xp: Math.min(newXp, p.xpNextLevel - 1) };
    });
  }, []);

  const advanceMissionProgress = useCallback((missionId: string) => {
    setProgress(p => {
      const missions = p.dailyMissions.map(m => {
        if (m.id !== missionId || m.completed) return m;
        const newCount = m.currentCount + 1;
        const completed = newCount >= m.targetCount;
        return { ...m, currentCount: newCount, completed };
      });
      return { ...p, dailyMissions: missions };
    });
  }, []);

  const getMissionTimeLeft = useCallback((): string => {
    const now = new Date();
    const midnight = new Date();
    midnight.setHours(24, 0, 0, 0);
    const diffMs = midnight.getTime() - now.getTime();
    const hours = Math.floor(diffMs / 3_600_000);
    const mins = Math.floor((diffMs % 3_600_000) / 60_000);
    return `${hours}h ${mins}m`;
  }, []);

  return {
    progress,
    getGreeting,
    getXpPercent,
    completeTopicAction,
    completeMissionAction,
    advanceMissionProgress,
    getMissionTimeLeft,
  };
}
