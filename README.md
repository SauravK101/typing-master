# Typing Master Game ⌨️

A modern, highly interactive typing speed test application built with React, TypeScript, and Vite. Designed with a sleek, minimalist glassmorphism UI, a dynamic 3D text perspective effect, and detailed metrics tracking to help you improve your typing speed and accuracy.

## ✨ Features

- **Live Typing Metrics**: Real-time tracking of Speed (WPM), Raw WPM, Accuracy (%), and Consistency.
- **Dynamic 3D Text Display**: Immersive CSS 3D perspective effect for typed and upcoming text, featuring smart blur and opacity gradients.
- **Multiple Game Modes**: 
  - **Time Mode**: Test your speed in 15s, 30s, 60s, or custom durations.
  - **Word Mode**: Type a specific number of words as fast as you can.
- **Difficulty Levels**: Adjust the complexity of the generated text (Easy, Medium, Hard).
- **Virtual Keyboard**: On-screen keyboard that highlights your key presses and flags errors in real-time.
- **Sound Feedback**: Optional mechanical/digital sound effects for correct keystrokes and errors.
- **Detailed Results**: After each session, view a comprehensive breakdown of your performance.
- **Anti-Cheat & Distraction Free**: Built-in protections against Grammarly and other spell-check extensions to ensure a pristine typing experience without disruptive popups.

## 🚀 Tech Stack

- **Frontend Framework**: [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + Custom CSS for 3D transforms and animations
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animation/3D (Optional/Advanced Features)**: GSAP, Three.js, React Three Fiber

## 📦 Getting Started

### Prerequisites

Make sure you have Node.js and npm (or pnpm/yarn) installed on your system.

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd "Typing Master Game/app"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit `http://localhost:5173` to start typing!

## 🛠️ Build for Production

To build the application for production deployment:

```bash
npm run build
```

The optimized static files will be generated in the `dist` directory.

## 🎮 How to Play

1. Select your preferred test settings from the bottom configuration bar (Time/Words, Duration, Difficulty).
2. The timer (or word count) starts automatically as soon as you press your first key.
3. Type the highlighted text as quickly and accurately as possible.
4. If you make a mistake, the character will turn red.
5. Once the test is complete, a results overlay will appear with your final statistics. Press `Enter` or `Space` (or click the restart button) to try again!

## 📄 License

This project is open-source and available for anyone to use, modify, and distribute.
