import { useEffect, useCallback, useState, useRef } from 'react';
import { useTypingEngine } from './hooks/useTypingEngine';
import { generateSentence } from './lib/words';
import { TypingDisplay } from './components/TypingDisplay';
import { MetricsBar } from './components/MetricsBar';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { ResultsOverlay } from './components/ResultsOverlay';
import { ConfigFooter, type TestDuration, type TestMode, type Difficulty } from './components/ConfigFooter';
import { Keyboard, Volume2, VolumeX } from 'lucide-react';

function App() {
  const [duration, setDuration] = useState<TestDuration>(30);
  const [mode, setMode] = useState<TestMode>('time');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [showKeyboard, setShowKeyboard] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [targetText, setTargetText] = useState(() => generateSentence(50, 'medium'));
  const [lastPressedKey, setLastPressedKey] = useState('');
  const [lastWasError, setLastWasError] = useState(false);

  const { state, handleKeyPress, reset } = useTypingEngine({
    targetText,
    duration,
  });

  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context
  useEffect(() => {
    if (soundEnabled) {
      audioContextRef.current = new AudioContext();
    }
    return () => {
      audioContextRef.current?.close();
    };
  }, [soundEnabled]);

  const playSound = useCallback((type: 'correct' | 'error') => {
    if (!soundEnabled || !audioContextRef.current) return;

    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    if (type === 'correct') {
      oscillator.frequency.value = 800;
      gainNode.gain.value = 0.05;
    } else {
      oscillator.frequency.value = 200;
      gainNode.gain.value = 0.08;
    }

    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.05);
  }, [soundEnabled]);

  // Regenerate text when settings change
  const regenerateText = useCallback(() => {
    const wordCount = mode === 'words'
      ? duration === 15 ? 30 : duration === 30 ? 50 : 80
      : 100;
    const newText = generateSentence(wordCount, difficulty);
    setTargetText(newText);
    reset(newText);
  }, [mode, duration, difficulty, reset]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default for space and backspace to avoid scrolling
      if (e.key === ' ' || e.key === 'Backspace') {
        e.preventDefault();
      }

      // Ignore modifier keys
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Ignore Tab, Enter, Escape, and other special keys
      if (e.key.length > 1 && e.key !== 'Backspace') return;

      // Don't process if already finished
      if (state.isFinished) {
        if (e.key === 'Enter' || e.key === ' ') {
          regenerateText();
        }
        return;
      }

      setLastPressedKey(e.key);

      const expectedChar = state.targetText[state.currentIndex];
      const isCorrect = e.key === expectedChar;
      setLastWasError(!isCorrect);

      if (isCorrect) {
        playSound('correct');
      } else {
        playSound('error');
      }

      handleKeyPress(e.key);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress, state.isFinished, state.targetText, state.currentIndex, playSound, regenerateText]);

  // Regenerate text when mode/duration/difficulty changes
  useEffect(() => {
    if (!state.isStarted) {
      regenerateText();
    }
  }, [mode, duration, difficulty]);

  const handleRestart = useCallback(() => {
    regenerateText();
  }, [regenerateText]);

  const handleDurationChange = useCallback((d: TestDuration) => {
    setDuration(d);
  }, []);

  const handleModeChange = useCallback((m: TestMode) => {
    setMode(m);
  }, []);

  const handleDifficultyChange = useCallback((d: Difficulty) => {
    setDifficulty(d);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] relative overflow-hidden flex flex-col">
      {/* Background noise texture */}
      <div
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Top bar with controls */}
      <div className="fixed top-6 right-6 z-50 flex items-center gap-2">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="glass-pill p-2 hover:bg-white/5 transition-colors"
          title={soundEnabled ? 'Disable sound' : 'Enable sound'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#00FF9D]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#F5F5F5]/40" />
          )}
        </button>
        <button
          onClick={() => setShowKeyboard(!showKeyboard)}
          className="glass-pill p-2 hover:bg-white/5 transition-colors"
          title={showKeyboard ? 'Hide keyboard' : 'Show keyboard'}
        >
          <Keyboard className={`w-4 h-4 ${showKeyboard ? 'text-[#00FF9D]' : 'text-[#F5F5F5]/40'}`} />
        </button>
      </div>

      {/* Metrics Bar */}
      <MetricsBar
        stats={state.stats}
        isStarted={state.isStarted}
        isFinished={state.isFinished}
        duration={duration}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pt-24 pb-12">
        {/* Typing Area */}
        <div className="relative mb-12">
          <TypingDisplay
            targetText={state.targetText}
            currentIndex={state.currentIndex}
            errors={state.errors}
            isFinished={state.isFinished}
          />
        </div>

        {/* Virtual Keyboard */}
        {showKeyboard && (
          <div className="transition-all duration-300">
            <VirtualKeyboard
              currentKey={state.currentKey}
              lastPressedKey={lastPressedKey}
              lastWasError={lastWasError}
            />
          </div>
        )}
      </div>

      {/* Instructions (shown when not started) */}
      {!state.isStarted && (
        <div className="fixed left-1/2 bottom-32 -translate-x-1/2 text-center pointer-events-none z-30">
          <p className="text-[#F5F5F5]/20 text-sm font-mono">
            Start typing to begin the test
          </p>
          <p className="text-[#F5F5F5]/10 text-xs font-mono mt-1">
            Press Enter or Space to restart when finished
          </p>
        </div>
      )}

      {/* Config Footer */}
      <ConfigFooter
        duration={duration}
        onDurationChange={handleDurationChange}
        mode={mode}
        onModeChange={handleModeChange}
        difficulty={difficulty}
        onDifficultyChange={handleDifficultyChange}
        onRestart={handleRestart}
        isStarted={state.isStarted}
      />

      {/* Results Overlay */}
      {state.isFinished && (
        <ResultsOverlay
          stats={state.stats}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
