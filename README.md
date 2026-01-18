# TypeFlow

<div align="center">
  <h3>Minimal Typing Speed Test with Real-time Metrics & Stunning Visuals</h3>
  <p>Practice. Improve. Compete. Glow.</p>

  [![CI](https://github.com/abhi9vaidya/TypeFlow/actions/workflows/ci.yml/badge.svg)](https://github.com/abhi9vaidya/TypeFlow/actions/workflows/ci.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
</div>

---

**TypeFlow** is a modern, performance-focused typing speed test application. Built with **React 18**, **TypeScript**, and **Tailwind CSS**, it offers a seamless experience with real-time feedback, detailed analytics, and a highly customizable interface. Whether you're a casual typist or a speed-typing enthusiast, TypeFlow provides the tools you need to reach your peak performance.

## ✨ Features

### ⌨️ Core Experience
- **Real-time Metrics**: Track WPM, accuracy, and consistency as you type.
- **Multiple Modes**: Switch between Words, Quotes, and a distraction-free Zen mode.
- **Advanced Caret Styles**: Choose from Line, Block, or Underline to match your preference.

### 📊 Analytics & Insights
- **Performance Graphs**: High-resolution charts showing your speed trends over time.
- **Keyboard Heatmap**: Visualize which keys are your strongest and which need work.
- **History Tracking**: Automatically save your best sessions (Supabase integrated).
- **Personal Bests & Goals**: Set targets and beat your records.

### 🎮 Gamification & Social
- **Multiplayer Racing**: Compete in real-time with friends in custom race rooms.
- **Achievements**: Unlock milestones as you progress.
- **Friends System**: Keep track of your typing buddies.
- **Leaderboards**: See how you stack up against the community.

### 🎨 Personalization
- **Theme Editor**: Create and save your custom themes with the built-in editor.
- **Visual Effects**: Toggle particle effects, glow animations, and progress rings.
- **Audio Feedback**: Satisfying keypress sounds (optional).

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.x or later)
- [Bun](https://bun.sh/) or `npm` / `yarn` / `pnpm`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/abhi9vaidya/TypeFlow.git
   cd typeflow
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Start development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. **Open the App**
   Navigate to `http://localhost:5173/`

## 🛠️ Tech Stack

- **Frontend**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [React Query](https://tanstack.com/query/latest)
- **Backend**: [Supabase](https://supabase.com/) (Auth, Database, Realtime)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI widgets & functional components
│   └── ui/         # Base shadcn-ui primitives
├── pages/          # Core views (History, Multiplayer, TypingTest, etc.)
├── store/          # Zustand state definitions
├── hooks/          # Custom React hooks (GhostRacing, metrics, etc.)
├── utils/          # Math, formatting, and constants
└── lib/            # Third-party integrations (Supabase, utils)
```

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

## 🌟 Acknowledgments

- Inspired by Monkeytype and other typing speed tests.
- UI components powered by [shadcn/ui](https://ui.shadcn.com/).
- Icons by [Lucide](https://lucide.dev/).

---
<p align="center">Made with ❤️ by Abhinav Vaidya</p>
