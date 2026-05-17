import { useEffect, useRef, useMemo } from 'react';

interface TypingDisplayProps {
  targetText: string;
  currentIndex: number;
  errors: Map<number, boolean>;
  isFinished: boolean;
}

export function TypingDisplay({ targetText, currentIndex, errors, isFinished }: TypingDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Split text into characters, preserving spaces
  const chars = useMemo(() => {
    return targetText.split('').map((char, i) => ({
      char: char === ' ' ? '\u00A0' : char,
      index: i,
    }));
  }, [targetText]);

  // Update the wave effect
  useEffect(() => {
    charRefs.current.forEach((span, index) => {
      if (!span) return;

      const distance = Math.abs(index - currentIndex);

      if (index < currentIndex) {
        // Already typed
        if (errors.has(index)) {
          span.className = 'char error';
        } else {
          span.className = 'char typed';
        }
        span.style.transform = 'perspective(600px) translateZ(50px)';
        span.style.filter = 'blur(0px)';
        span.style.opacity = '1';
      } else if (index === currentIndex && !isFinished) {
        // Current character
        span.className = 'char current';
        span.style.transform = 'perspective(600px) translateZ(0px)';
        span.style.filter = 'blur(0px)';
        span.style.opacity = '1';
      } else {
        // Upcoming characters
        span.className = 'char';
        const depth = distance * 15;
        const z = -50 - depth;
        const blur = Math.min(distance * 1, 4);
        const opacity = Math.max(1 - distance * 0.05, 0.4);
        span.style.transform = `perspective(600px) translateZ(${z}px)`;
        span.style.filter = `blur(${blur}px)`;
        span.style.opacity = String(opacity);
        span.style.color = '#777777';
      }
    });

    // Auto-scroll to keep current character in view
    const currentSpan = charRefs.current[currentIndex];
    if (currentSpan && containerRef.current) {
      const container = containerRef.current;
      const spanRect = currentSpan.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (spanRect.left < containerRect.left || spanRect.right > containerRect.right) {
        currentSpan.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [currentIndex, errors, isFinished]);

  return (
    <div
      ref={containerRef}
      className="typing-container"
      style={{
        maxHeight: '40vh',
        overflow: 'hidden',
      }}
      spellCheck={false}
      translate="no"
      data-gramm="false"
      data-gramm_editor="false"
      data-enable-grammarly="false"
    >
      {chars.map(({ char, index }) => (
        <span
          key={index}
          ref={el => { charRefs.current[index] = el; }}
          className="char"
        >
          {char}
          {index === currentIndex && !isFinished && (
            <span
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F5F5F5] animate-cursor-blink"
              style={{ marginBottom: '-4px' }}
            />
          )}
        </span>
      ))}
    </div>
  );
}
