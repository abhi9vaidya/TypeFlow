# TypeFlow - Beautiful Typing Speed Test

**Created by**: Abhinav Vaidya

A beautiful, minimalist typing speed test application built with modern web technologies. Test and improve your typing speed with real-time metrics, performance graphs, and a stunning dark mode interface.

## Features

- ⚡ **Real-time Typing Metrics** - WPM, accuracy, and consistency tracking
- 📊 **Performance Graphs** - Visual representation of your typing performance
- 🎨 **Multiple Themes** - Beautiful color schemes to choose from
- ⌨️ **Keyboard Heatmap** - See which keys you use most frequently
- 🎯 **Multiple Test Modes** - Words, quotes, and zen modes
- 🔊 **Audio Feedback** - Optional sound effects for key presses
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- ✨ **Smooth Animations** - GPU-accelerated transitions and effects

## Getting Started

### Prerequisites

- Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd typeflow

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

The application will be available at `http://localhost:8080/`

### Building for Production

```sh
npm run build
```

This generates an optimized production build in the `dist/` directory.

## Technologies Used

- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: shadcn-ui (Radix UI primitives)
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form

## Project Structure

```
src/
├── components/        # React components
│   ├── ui/           # shadcn-ui components
│   ├── Header.tsx
│   ├── WordStream.tsx
│   ├── SettingsPanel.tsx
│   └── ...
├── pages/            # Page components
├── store/            # Zustand stores
├── utils/            # Utility functions
├── lib/              # Library functions
└── hooks/            # Custom hooks
```

## How to Edit

### Using Your IDE

Edit files directly in your preferred code editor:

```sh
npm run dev      # Start development server with hot reload
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Edit in GitHub

- Navigate to the desired file
- Click the "Edit" button (pencil icon)
- Make your changes and commit

### Using GitHub Codespaces

- Click "Code" (green button) on the repository
- Select "Codespaces" tab
- Click "New codespace" to start editing

## Keyboard Shortcuts

- **Esc** - Open/close settings panel
- **Tab** - Restart the current test
- **Any key** - Begin typing test

## Customization

### Themes

Choose from multiple pre-built themes including:
- Purple Glow
- Cyber Blue
- Matrix
- Sunset
- Fire
- Dark Mode
- Custom (create your own)

### Settings

Customize your experience with options for:
- Sound effects
- Keyboard heatmap display
- Visual effects (particle effects, glow, progress rings)
- Caret style (line, block, underline)
- Test options (punctuation, numbers)
