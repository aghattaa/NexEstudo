import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

type TimerMode = 'study' | 'short' | 'long';

export interface PomodoroContextType {
  timeLeft: number;
  timerMode: TimerMode;
  isRunning: boolean;
  hasShownRestReminder: boolean;
  setTimerMode: (mode: TimerMode) => void;
  toggleRunning: () => void;
  resetTimer: () => void;
  setReminderShown: (shown: boolean) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

const MODE_DURATIONS: Record<TimerMode, number> = {
  study: 30 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const LS_KEY = 'nexestudo_pomodoro_v2';

interface PersistedState {
  endTime: number | null;   // wall-clock ms when timer should hit 0 (null = stopped/paused)
  frozenLeft: number;       // seconds remaining when paused
  mode: TimerMode;
  hasShownRestReminder: boolean;
}

function load(): PersistedState {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw) as PersistedState;
  } catch { /* ignore */ }
  return { endTime: null, frozenLeft: MODE_DURATIONS.study, mode: 'study', hasShownRestReminder: false };
}

function save(s: PersistedState) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}

function secondsLeft(s: PersistedState): number {
  if (s.endTime === null) return s.frozenLeft;
  return Math.max(0, Math.round((s.endTime - Date.now()) / 1000));
}

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [persisted, setPersisted] = useState<PersistedState>(load);
  const [displayLeft, setDisplayLeft] = useState(() => secondsLeft(load()));

  const isRunning = persisted.endTime !== null && persisted.endTime > Date.now();

  // Display update loop — only updates the number on screen, NOT the source of truth
  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      const s = load();
      const tl = secondsLeft(s);
      setDisplayLeft(tl);
      if (tl <= 0 && s.endTime !== null) {
        const stopped: PersistedState = { ...s, endTime: null, frozenLeft: 0 };
        save(stopped);
        setPersisted(stopped);
      }
    };

    tick(); // immediate
    const id = setInterval(tick, 500);
    return () => clearInterval(id);
  }, [isRunning]);

  // When user switches back to this tab, immediately resync from wall clock
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState !== 'visible') return;
      const s = load();
      const tl = secondsLeft(s);
      setDisplayLeft(tl);
      if (tl <= 0 && s.endTime !== null) {
        const stopped: PersistedState = { ...s, endTime: null, frozenLeft: 0 };
        save(stopped);
        setPersisted(stopped);
      } else {
        setPersisted({ ...s }); // trigger re-render so isRunning recalculates
      }
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => document.removeEventListener('visibilitychange', onVisible);
  }, []);

  const toggleRunning = useCallback(() => {
    const s = load();
    const running = s.endTime !== null && s.endTime > Date.now();

    if (!running) {
      // START: anchor endTime to now + frozen seconds
      const newState: PersistedState = {
        ...s,
        endTime: Date.now() + s.frozenLeft * 1000,
      };
      save(newState);
      setPersisted(newState);
    } else {
      // PAUSE: capture exact seconds remaining
      const tl = secondsLeft(s);
      const newState: PersistedState = { ...s, endTime: null, frozenLeft: tl };
      save(newState);
      setDisplayLeft(tl);
      setPersisted(newState);
    }
  }, []);

  const setTimerMode = useCallback((mode: TimerMode) => {
    const newState: PersistedState = {
      endTime: null,
      frozenLeft: MODE_DURATIONS[mode],
      mode,
      hasShownRestReminder: false,
    };
    save(newState);
    setPersisted(newState);
    setDisplayLeft(MODE_DURATIONS[mode]);
  }, []);

  const resetTimer = useCallback(() => {
    const s = load();
    const newState: PersistedState = {
      endTime: null,
      frozenLeft: MODE_DURATIONS[s.mode],
      mode: s.mode,
      hasShownRestReminder: false,
    };
    save(newState);
    setPersisted(newState);
    setDisplayLeft(MODE_DURATIONS[s.mode]);
  }, []);

  const setReminderShown = useCallback((shown: boolean) => {
    const s = load();
    const newState = { ...s, hasShownRestReminder: shown };
    save(newState);
    setPersisted(newState);
  }, []);

  return (
    <PomodoroContext.Provider value={{
      timeLeft: displayLeft,
      timerMode: persisted.mode,
      isRunning,
      hasShownRestReminder: persisted.hasShownRestReminder,
      setTimerMode,
      toggleRunning,
      resetTimer,
      setReminderShown,
    }}>
      {children}
    </PomodoroContext.Provider>
  );
}

export function usePomodoro() {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used within PomodoroProvider');
  return ctx;
}
