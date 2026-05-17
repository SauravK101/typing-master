import { useEffect, useRef, useState } from 'react';
import type { TypingStats } from '../hooks/useTypingEngine';

interface MetricsBarProps {
  stats: TypingStats;
  isStarted: boolean;
  isFinished: boolean;
  duration: number;
}

function AnimatedNumber({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = value;
    const duration = 300;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(start + (end - start) * eased);
      setDisplay(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        prevRef.current = end;
      }
    }

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{display}{suffix}</span>;
}

export function MetricsBar({ stats, isStarted, isFinished, duration }: MetricsBarProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.floor((seconds % 1) * 100);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const remainingTime = Math.max(0, duration - stats.timeElapsed);

  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center items-center gap-4 pointer-events-none">
      {/* WPM */}
      <div className="glass-pill flex items-center gap-3">
        <div>
          <div className="metric-label">Speed</div>
          <div className="metric-value text-glow-mint">
            <AnimatedNumber value={stats.wpm} />
            <span className="text-sm font-normal ml-1 opacity-50">wpm</span>
          </div>
        </div>
      </div>

      {/* Raw WPM */}
      <div className="glass-pill flex items-center gap-3 opacity-70">
        <div>
          <div className="metric-label">Raw</div>
          <div className="metric-value text-[#F5F5F5]/70">
            <AnimatedNumber value={stats.rawWpm} />
          </div>
        </div>
      </div>

      {/* Accuracy */}
      <div className="glass-pill flex items-center gap-3">
        <div>
          <div className="metric-label">Accuracy</div>
          <div className={`metric-value ${stats.accuracy >= 95 ? 'text-glow-mint' : stats.accuracy >= 80 ? 'text-[#F5F5F5]' : 'text-glow-crimson'}`}>
            <AnimatedNumber value={stats.accuracy} suffix="%" />
          </div>
        </div>
      </div>

      {/* Consistency */}
      <div className="glass-pill flex items-center gap-3 opacity-70">
        <div>
          <div className="metric-label">Consistency</div>
          <div className="metric-value text-[#F5F5F5]/70">
            <AnimatedNumber value={stats.consistency} suffix="%" />
          </div>
        </div>
      </div>

      {/* Timer */}
      <div className="glass-pill flex items-center gap-3">
        <div>
          <div className="metric-label">Time</div>
          <div className={`metric-value font-mono ${remainingTime <= 5 && isStarted && !isFinished ? 'text-glow-crimson' : ''}`}>
            {formatTime(isStarted ? remainingTime : duration)}
          </div>
        </div>
      </div>
    </div>
  );
}
