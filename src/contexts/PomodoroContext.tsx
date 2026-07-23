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
  // timeLeft is the "remaining seconds" we display
  const [timeLeft, setTimeLeft] = useState(MODE_DURATIONS.study);
  const [isRunning, setIsRunning] = useState(false);
  const [hasShownRestReminder, setHasShownRestReminder] = useState(false);

  // We track the real-world start anchor so paused/throttled tabs catch up correctly.
  // startAnchor = { wallTime: Date.now(), remainingAtStart: seconds }
  const startAnchor = useRef<{ wallTime: number; remainingAtStart: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  // Use requestAnimationFrame + visibility change to keep the timer accurate
  const tick = useCallback(() => {
    if (!startAnchor.current) return;
    const elapsedMs = Date.now() - startAnchor.current.wallTime;
    const elapsedSec = Math.floor(elapsedMs / 1000);
    const newTimeLeft = Math.max(0, startAnchor.current.remainingAtStart - elapsedSec);
    setTimeLeft(newTimeLeft);

    if (newTimeLeft > 0) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      // Timer reached zero — stop
      setIsRunning(false);
      startAnchor.current = null;
    }
  }, []);

  // When running state changes, start or stop the RAF loop
  useEffect(() => {
    if (isRunning) {
      // Anchor to current wall time
      startAnchor.current = { wallTime: Date.now(), remainingAtStart: timeLeft };
      rafRef.current = requestAnimationFrame(tick);
    } else {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startAnchor.current = null;
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // We intentionally do NOT include `timeLeft` here so toggling pause doesn't re-trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRunning, tick]);

  // When the tab becomes visible again, re-anchor so the timer catches up immediately
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning && startAnchor.current) {
        // Cancel old RAF and restart from current wall time with the current remaining time
        if (rafRef.current) cancelAnimationFrame(rafRef.current);

        // Recalculate what's left based on wall clock
        const elapsedMs = Date.now() - startAnchor.current.wallTime;
        const elapsedSec = Math.floor(elapsedMs / 1000);
        const catchUpTimeLeft = Math.max(0, startAnchor.current.remainingAtStart - elapsedSec);

        // Update anchor to now so the tick continues cleanly
        startAnchor.current = { wallTime: Date.now(), remainingAtStart: catchUpTimeLeft };
        setTimeLeft(catchUpTimeLeft);

        if (catchUpTimeLeft > 0) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setIsRunning(false);
          startAnchor.current = null;
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, tick]);

  const toggleRunning = useCallback(() => {
    setIsRunning(prev => {
      if (!prev) {
        // About to START — anchor will be set in the useEffect above
        return true;
      } else {
        // About to PAUSE — capture current remaining time
        if (startAnchor.current) {
          const elapsedMs = Date.now() - startAnchor.current.wallTime;
          const elapsedSec = Math.floor(elapsedMs / 1000);
          const paused = Math.max(0, startAnchor.current.remainingAtStart - elapsedSec);
          setTimeLeft(paused);
          startAnchor.current = null;
        }
        return false;
      }
    });
  }, []);

  const setTimerMode = useCallback((mode: TimerMode) => {
    setTimerModeState(mode);
    setIsRunning(false);
    setTimeLeft(MODE_DURATIONS[mode]);
    setHasShownRestReminder(false);
    startAnchor.current = null;
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setTimerModeState(prev => {
      setTimeLeft(MODE_DURATIONS[prev]);
      return prev;
    });
    setHasShownRestReminder(false);
    startAnchor.current = null;
  }, []);

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
