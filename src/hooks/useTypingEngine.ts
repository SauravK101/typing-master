import { useState, useCallback, useRef, useEffect } from 'react';

export interface TypingStats {
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctChars: number;
  incorrectChars: number;
  totalChars: number;
  consistency: number;
  timeElapsed: number;
}

export interface TypingState {
  targetText: string;
  currentIndex: number;
  isStarted: boolean;
  isFinished: boolean;
  stats: TypingStats;
  errors: Map<number, boolean>;
  keyPresses: { timestamp: number; correct: boolean }[];
  currentKey: string;
}

interface UseTypingEngineOptions {
  targetText: string;
  duration?: number; // in seconds, 0 means no limit (practice mode)
}

export function useTypingEngine({ targetText, duration = 30 }: UseTypingEngineOptions) {
  const [state, setState] = useState<TypingState>({
    targetText,
    currentIndex: 0,
    isStarted: false,
    isFinished: false,
    stats: {
      wpm: 0,
      rawWpm: 0,
      accuracy: 100,
      correctChars: 0,
      incorrectChars: 0,
      totalChars: 0,
      consistency: 100,
      timeElapsed: 0,
    },
    errors: new Map(),
    keyPresses: [],
    currentKey: targetText[0] || '',
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const keystrokeTimesRef = useRef<number[]>([]);

  const calculateStats = useCallback((
    correctChars: number,
    incorrectChars: number,
    timeElapsed: number,
    keyPresses: { timestamp: number; correct: boolean }[]
  ): TypingStats => {
    const totalChars = correctChars + incorrectChars;
    const minutes = timeElapsed / 60;
    const wpm = minutes > 0 ? Math.round((correctChars / 5) / minutes) : 0;
    const rawWpm = minutes > 0 ? Math.round((totalChars / 5) / minutes) : 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;

    // Calculate consistency (standard deviation of WPM over time)
    let consistency = 100;
    if (keyPresses.length > 10) {
      const windows: number[] = [];
      const windowSize = 10;
      for (let i = 0; i <= keyPresses.length - windowSize; i++) {
        const window = keyPresses.slice(i, i + windowSize);
        const windowTime = (window[windowSize - 1].timestamp - window[0].timestamp) / 1000 / 60;
        const windowCorrect = window.filter(k => k.correct).length;
        const windowWpm = windowTime > 0 ? (windowCorrect / 5) / windowTime : 0;
        windows.push(windowWpm);
      }
      if (windows.length > 1) {
        const mean = windows.reduce((a, b) => a + b, 0) / windows.length;
        const variance = windows.reduce((sum, w) => sum + Math.pow(w - mean, 2), 0) / windows.length;
        const stdDev = Math.sqrt(variance);
        consistency = Math.max(0, Math.min(100, Math.round(100 - (stdDev / mean) * 100)));
      }
    }

    return {
      wpm,
      rawWpm,
      accuracy,
      correctChars,
      incorrectChars,
      totalChars,
      consistency,
      timeElapsed,
    };
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    keystrokeTimesRef.current = [];

    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      setState(prev => {
        if (prev.isFinished) return prev;
        const newStats = calculateStats(
          prev.stats.correctChars,
          prev.stats.incorrectChars,
          elapsed,
          prev.keyPresses
        );
        // Check if duration is reached
        if (duration > 0 && elapsed >= duration) {
          return { ...prev, isFinished: true, stats: newStats };
        }
        return { ...prev, stats: newStats };
      });
    }, 100);
  }, [duration, calculateStats]);

  const handleKeyPress = useCallback((key: string) => {
    setState(prev => {
      if (prev.isFinished) return prev;
      if (prev.currentIndex >= prev.targetText.length) return prev;

      const expectedChar = prev.targetText[prev.currentIndex];
      const isCorrect = key === expectedChar;
      const now = Date.now();

      if (!prev.isStarted) {
        // Start timer on first keypress
        startTimer();
      }

      const newKeyPresses = [...prev.keyPresses, { timestamp: now, correct: isCorrect }];
      keystrokeTimesRef.current.push(now);

      const newErrors = new Map(prev.errors);
      if (!isCorrect) {
        newErrors.set(prev.currentIndex, true);
      }

      const newCorrectChars = prev.stats.correctChars + (isCorrect ? 1 : 0);
      const newIncorrectChars = prev.stats.incorrectChars + (isCorrect ? 0 : 1);
      const newIndex = prev.currentIndex + 1;
      const elapsed = prev.isStarted ? (now - startTimeRef.current) / 1000 : 0;

      const newStats = calculateStats(
        newCorrectChars,
        newIncorrectChars,
        elapsed,
        newKeyPresses
      );

      const isFinished = newIndex >= prev.targetText.length;
      if (isFinished) {
        stopTimer();
      }

      return {
        ...prev,
        currentIndex: newIndex,
        isStarted: true,
        isFinished,
        stats: newStats,
        errors: newErrors,
        keyPresses: newKeyPresses,
        currentKey: prev.targetText[newIndex] || '',
      };
    });
  }, [startTimer, stopTimer, calculateStats]);

  const reset = useCallback((newTargetText?: string) => {
    stopTimer();
    const text = newTargetText || targetText;
    setState({
      targetText: text,
      currentIndex: 0,
      isStarted: false,
      isFinished: false,
      stats: {
        wpm: 0,
        rawWpm: 0,
        accuracy: 100,
        correctChars: 0,
        incorrectChars: 0,
        totalChars: 0,
        consistency: 100,
        timeElapsed: 0,
      },
      errors: new Map(),
      keyPresses: [],
      currentKey: text[0] || '',
    });
  }, [targetText, stopTimer]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      stopTimer();
    };
  }, [stopTimer]);

  return {
    state,
    handleKeyPress,
    reset,
  };
}
