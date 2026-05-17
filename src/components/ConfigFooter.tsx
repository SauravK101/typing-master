import { Settings, Timer, Type, Gauge } from 'lucide-react';

export type TestDuration = 15 | 30 | 60;
export type TestMode = 'time' | 'words';
export type Difficulty = 'easy' | 'medium' | 'hard';

interface ConfigFooterProps {
  duration: TestDuration;
  onDurationChange: (duration: TestDuration) => void;
  mode: TestMode;
  onModeChange: (mode: TestMode) => void;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
  onRestart: () => void;
  isStarted: boolean;
}

const durations: { value: TestDuration; label: string }[] = [
  { value: 15, label: '15s' },
  { value: 30, label: '30s' },
  { value: 60, label: '60s' },
];

const modes: { value: TestMode; label: string }[] = [
  { value: 'time', label: 'Time' },
  { value: 'words', label: 'Words' },
];

const difficulties: { value: Difficulty; label: string }[] = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

export function ConfigFooter({
  duration,
  onDurationChange,
  mode,
  onModeChange,
  difficulty,
  onDifficultyChange,
  onRestart,
  isStarted,
}: ConfigFooterProps) {
  return (
    <div className="fixed bottom-6 left-0 right-0 z-50 flex justify-center">
      <div className="glass-card px-6 py-3 flex items-center gap-6">
        {/* Mode Selector */}
        <div className="flex items-center gap-2">
          <Type className="w-4 h-4 text-[#F5F5F5]/40" />
          <div className="flex gap-1">
            {modes.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => !isStarted && onModeChange(value)}
                disabled={isStarted}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  mode === value
                    ? 'bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30'
                    : 'text-[#F5F5F5]/40 hover:text-[#F5F5F5]/70 border border-transparent'
                } ${isStarted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Duration Selector */}
        <div className="flex items-center gap-2">
          <Timer className="w-4 h-4 text-[#F5F5F5]/40" />
          <div className="flex gap-1">
            {durations.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => !isStarted && onDurationChange(value)}
                disabled={isStarted}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  duration === value
                    ? 'bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30'
                    : 'text-[#F5F5F5]/40 hover:text-[#F5F5F5]/70 border border-transparent'
                } ${isStarted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Difficulty Selector */}
        <div className="flex items-center gap-2">
          <Gauge className="w-4 h-4 text-[#F5F5F5]/40" />
          <div className="flex gap-1">
            {difficulties.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => !isStarted && onDifficultyChange(value)}
                disabled={isStarted}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  difficulty === value
                    ? 'bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30'
                    : 'text-[#F5F5F5]/40 hover:text-[#F5F5F5]/70 border border-transparent'
                } ${isStarted ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="w-px h-6 bg-white/10" />

        {/* Restart */}
        <button
          onClick={onRestart}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#F5F5F5]/60 hover:text-[#F5F5F5] hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/10"
        >
          <Settings className="w-3.5 h-3.5" />
          Restart
        </button>
      </div>
    </div>
  );
}
