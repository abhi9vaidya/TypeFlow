// Build: 20251114
import { TestResult } from "./metrics";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (result: TestResult) => boolean;
}

export const achievements: Achievement[] = [
  {
    id: "focused",
    name: "Focused",
    description: "Achieve 95%+ consistency",
    icon: "🎯",
    condition: (result) => result.consistency >= 95
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Type 100+ WPM",
    icon: "⚡",
    condition: (result) => result.wpm >= 100
  },
  {
    id: "flawless",
    name: "Flawless",
    description: "Achieve 98%+ accuracy",
    icon: "✨",
    condition: (result) => result.accuracy >= 98
  },
  {
    id: "lightning",
    name: "Lightning",
    description: "Type 120+ WPM",
    icon: "⚡",
    condition: (result) => result.wpm >= 120
  },
  {
    id: "perfectionist",
    name: "Perfectionist",
    description: "100% accuracy",
    icon: "💎",
    condition: (result) => result.accuracy === 100
  },
  {
    id: "marathon",
    name: "Marathon",
    description: "Complete 120s test",
    icon: "🏃",
    condition: (result) => result.duration === 120
  }
];

export function checkAchievements(result: TestResult): Achievement[] {
  return achievements.filter(achievement => achievement.condition(result));
}

