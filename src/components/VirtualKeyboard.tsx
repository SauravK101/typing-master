import { useEffect, useState } from 'react';

interface VirtualKeyboardProps {
  currentKey: string;
  lastPressedKey: string;
  lastWasError: boolean;
}

const KEYBOARD_ROWS = [
  [
    { key: '`', shift: '~', code: 'Backquote' },
    { key: '1', shift: '!', code: 'Digit1' },
    { key: '2', shift: '@', code: 'Digit2' },
    { key: '3', shift: '#', code: 'Digit3' },
    { key: '4', shift: '$', code: 'Digit4' },
    { key: '5', shift: '%', code: 'Digit5' },
    { key: '6', shift: '^', code: 'Digit6' },
    { key: '7', shift: '&', code: 'Digit7' },
    { key: '8', shift: '*', code: 'Digit8' },
    { key: '9', shift: '(', code: 'Digit9' },
    { key: '0', shift: ')', code: 'Digit0' },
    { key: '-', shift: '_', code: 'Minus' },
    { key: '=', shift: '+', code: 'Equal' },
    { key: '⌫', code: 'Backspace', wide: true },
  ],
  [
    { key: 'Tab', code: 'Tab', wide: true },
    { key: 'q', code: 'KeyQ' },
    { key: 'w', code: 'KeyW' },
    { key: 'e', code: 'KeyE' },
    { key: 'r', code: 'KeyR' },
    { key: 't', code: 'KeyT' },
    { key: 'y', code: 'KeyY' },
    { key: 'u', code: 'KeyU' },
    { key: 'i', code: 'KeyI' },
    { key: 'o', code: 'KeyO' },
    { key: 'p', code: 'KeyP' },
    { key: '[', shift: '{', code: 'BracketLeft' },
    { key: ']', shift: '}', code: 'BracketRight' },
    { key: '\\', shift: '|', code: 'Backslash' },
  ],
  [
    { key: 'Caps', code: 'CapsLock', extraWide: true },
    { key: 'a', code: 'KeyA' },
    { key: 's', code: 'KeyS' },
    { key: 'd', code: 'KeyD' },
    { key: 'f', code: 'KeyF' },
    { key: 'g', code: 'KeyG' },
    { key: 'h', code: 'KeyH' },
    { key: 'j', code: 'KeyJ' },
    { key: 'k', code: 'KeyK' },
    { key: 'l', code: 'KeyL' },
    { key: ';', shift: ':', code: 'Semicolon' },
    { key: "'", shift: '"', code: 'Quote' },
    { key: 'Enter', code: 'Enter', extraWide: true },
  ],
  [
    { key: 'Shift', code: 'ShiftLeft', extraWide: true },
    { key: 'z', code: 'KeyZ' },
    { key: 'x', code: 'KeyX' },
    { key: 'c', code: 'KeyC' },
    { key: 'v', code: 'KeyV' },
    { key: 'b', code: 'KeyB' },
    { key: 'n', code: 'KeyN' },
    { key: 'm', code: 'KeyM' },
    { key: ',', shift: '<', code: 'Comma' },
    { key: '.', shift: '>', code: 'Period' },
    { key: '/', shift: '?', code: 'Slash' },
    { key: 'Shift', code: 'ShiftRight', extraWide: true },
  ],
  [
    { key: 'Ctrl', code: 'ControlLeft', wide: true },
    { key: 'Alt', code: 'AltLeft', wide: true },
    { key: 'Space', code: 'Space', space: true },
    { key: 'Alt', code: 'AltRight', wide: true },
    { key: 'Ctrl', code: 'ControlRight', wide: true },
  ],
];

export function VirtualKeyboard({ currentKey, lastPressedKey, lastWasError }: VirtualKeyboardProps) {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setActiveKeys(prev => new Set(prev).add(e.code));
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setActiveKeys(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const getKeyClass = (keyDef: { key: string; code: string; wide?: boolean; extraWide?: boolean; space?: boolean }) => {
    const classes = ['key-cap'];
    if (keyDef.wide) classes.push('wide');
    if (keyDef.extraWide) classes.push('extra-wide');
    if (keyDef.space) classes.push('space');

    const isActive = activeKeys.has(keyDef.code);
    const isCurrent = currentKey.toLowerCase() === keyDef.key.toLowerCase() ||
      (currentKey === ' ' && keyDef.code === 'Space');
    const isLastPressed = lastPressedKey.toLowerCase() === keyDef.key.toLowerCase() ||
      (lastPressedKey === ' ' && keyDef.code === 'Space');

    if (isActive) classes.push('active');
    else if (isLastPressed && lastWasError) classes.push('error');
    else if (isCurrent && !lastWasError) classes.push('focus');

    return classes.join(' ');
  };

  return (
    <div className="flex flex-col items-center gap-1 select-none">
      {KEYBOARD_ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1">
          {row.map((keyDef, keyIndex) => (
            <div
              key={keyIndex}
              className={getKeyClass(keyDef)}
            >
              {keyDef.key}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
