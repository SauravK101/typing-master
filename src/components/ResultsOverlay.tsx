import { useEffect, useState } from 'react';
import { StarfieldCanvas } from './StarfieldCanvas';
import { RotateCcw, Zap, Target, TrendingUp, Clock } from 'lucide-react';
import type { TypingStats } from '../hooks/useTypingEngine';

interface ResultsOverlayProps {
  stats: TypingStats;
  onRestart: () => void;
}

function AnimatedValue({ value, suffix = '', delay = 0 }: { value: number; suffix?: string; delay?: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 800;
      const startTime = performance.now();
      const start = 0;
      const end = value;

      function animate(now: number) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplay(Math.round(start + (end - start) * eased));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      }

      requestAnimationFrame(animate);
    }, delay);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return <span>{display}{suffix}</span>;
}

export function ResultsOverlay({ stats, onRestart }: ResultsOverlayProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const getWpmColor = (wpm: number) => {
    if (wpm >= 80) return 'text-[#00FF9D]';
    if (wpm >= 60) return 'text-[#00FF9D]/80';
    if (wpm >= 40) return 'text-[#F5F5F5]';
    return 'text-[#FF0055]';
  };

  const getAccuracyColor = (acc: number) => {
    if (acc >= 98) return 'text-[#00FF9D]';
    if (acc >= 95) return 'text-[#00FF9D]/80';
    if (acc >= 90) return 'text-[#F5F5F5]';
    return 'text-[#FF0055]';
  };

  return (
    <>
      <StarfieldCanvas />
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center transition-all duration-1000 ${
          visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="glass-card p-12 max-w-lg w-full mx-4 text-center">
          {/* Main WPM */}
          <div className="mb-8">
            <div className="metric-label mb-2">Typing Speed</div>
            <div className={`text-7xl font-bold font-mono ${getWpmColor(stats.wpm)} text-glow-mint`}>
              <AnimatedValue value={stats.wpm} />
            </div>
            <div className="text-sm text-[#F5F5F5]/50 mt-1">words per minute</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="glass-card p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Target className="w-4 h-4 text-[#00FF9D]" />
                <span className="metric-label">Accuracy</span>
              </div>
              <div className={`text-3xl font-bold font-mono ${getAccuracyColor(stats.accuracy)}`}>
                <AnimatedValue value={stats.accuracy} suffix="%" delay={200} />
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-[#00FF9D]" />
                <span className="metric-label">Consistency</span>
              </div>
              <div className="text-3xl font-bold font-mono text-[#F5F5F5]">
                <AnimatedValue value={stats.consistency} suffix="%" delay={300} />
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-[#F5F5F5]/60" />
                <span className="metric-label">Raw CPM</span>
              </div>
              <div className="text-3xl font-bold font-mono text-[#F5F5F5]/70">
                <AnimatedValue value={stats.rawWpm * 5} delay={400} />
              </div>
            </div>

            <div className="glass-card p-4">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-[#F5F5F5]/60" />
                <span className="metric-label">Time</span>
              </div>
              <div className="text-3xl font-bold font-mono text-[#F5F5F5]/70">
                {Math.floor(stats.timeElapsed)}s
              </div>
            </div>
          </div>

          {/* Character breakdown */}
          <div className="glass-card p-4 mb-8">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="metric-label">Correct</div>
                <div className="text-2xl font-bold font-mono text-[#00FF9D]">{stats.correctChars}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="metric-label">Incorrect</div>
                <div className="text-2xl font-bold font-mono text-[#FF0055]">{stats.incorrectChars}</div>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="text-center">
                <div className="metric-label">Total</div>
                <div className="text-2xl font-bold font-mono text-[#F5F5F5]">{stats.totalChars}</div>
              </div>
            </div>
          </div>

          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#00FF9D]/10 border border-[#00FF9D]/30 text-[#00FF9D] font-medium hover:bg-[#00FF9D]/20 hover:border-[#00FF9D]/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,255,157,0.2)] active:scale-95"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </button>
        </div>
      </div>
    </>
  );
}
