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

  // The absolute wall-clock moment when the timer should hit zero.
  // This is the ONLY source of truth — not a counter.
  const endTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Reads the wall clock and returns how many seconds remain
  const getSecondsLeft = () => {
    if (!endTimeRef.current) return timeLeft;
    return Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
  };

  // Starts the display-update interval (runs every 500ms to keep display accurate)
  const startDisplayInterval = useCallback((onZero: () => void) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      const tl = Math.max(0, Math.round(((endTimeRef.current ?? Date.now()) - Date.now()) / 1000));
      setTimeLeft(tl);
      if (tl <= 0) {
        clearInterval(intervalRef.current!);
        intervalRef.current = null;
        onZero();
      }
    }, 500);
  }, []);

  const handleTimerZero = useCallback(() => {
    endTimeRef.current = null;
    setIsRunning(false);
  }, []);

  const toggleRunning = useCallback(() => {
    setIsRunning(prev => {
      if (!prev) {
        // STARTING: compute endTime from current timeLeft
        const currentLeft = getSecondsLeft();
        endTimeRef.current = Date.now() + currentLeft * 1000;
        startDisplayInterval(handleTimerZero);
        return true;
      } else {
        // PAUSING: freeze timeLeft at current wall-clock value
        const frozen = getSecondsLeft();
        setTimeLeft(frozen);
        endTimeRef.current = null;
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        return false;
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDisplayInterval, handleTimerZero]);

  // When tab becomes visible again: resync display from wall clock and restart interval
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && endTimeRef.current) {
        const tl = Math.max(0, Math.round((endTimeRef.current - Date.now()) / 1000));
        setTimeLeft(tl);
        if (tl <= 0) {
          endTimeRef.current = null;
          setIsRunning(false);
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
        } else {
          // Restart display interval — the endTime is already correct
          startDisplayInterval(handleTimerZero);
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [startDisplayInterval, handleTimerZero]);

  const setTimerMode = useCallback((mode: TimerMode) => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    endTimeRef.current = null;
    setTimerModeState(mode);
    setTimeLeft(MODE_DURATIONS[mode]);
    setIsRunning(false);
    setHasShownRestReminder(false);
  }, []);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
    endTimeRef.current = null;
    setIsRunning(false);
    setHasShownRestReminder(false);
    setTimerModeState(prev => { setTimeLeft(MODE_DURATIONS[prev]); return prev; });
  }, []);

  const setReminderShown = useCallback((shown: boolean) => setHasShownRestReminder(shown), []);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

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
