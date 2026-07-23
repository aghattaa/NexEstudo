import { createContext, useContext, useState, useEffect, useRef, useCallback, ReactNode } from 'react';

type TimerMode = 'study' | 'short' | 'long';

interface PomodoroContextType {
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

export function PomodoroProvider({ children }: { children: ReactNode }) {
  const [timerMode, setTimerModeState] = useState<TimerMode>('study');
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.study);
  const [isRunning, setIsRunning] = useState(false);
  const [hasShownRestReminder, setHasShownRestReminder] = useState(false);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Tick the timer every second
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const toggleRunning = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  const setTimerMode = useCallback((mode: TimerMode) => {
    setTimerModeState(mode);
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
    setHasShownRestReminder(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[timerMode]);
    setHasShownRestReminder(false);
  }, [timerMode]);

  const setReminderShown = useCallback((shown: boolean) => {
    setHasShownRestReminder(shown);
  }, []);

  return (
    <PomodoroContext.Provider value={{
      timeLeft,
      timerMode,
      isRunning,
      hasShownRestReminder,
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
