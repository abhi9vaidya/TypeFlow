// Build: 20251114
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type GoalPeriod = "daily" | "weekly" | "monthly";
export type GoalType = "wpm" | "accuracy" | "tests";

export interface Goal {
  id: string;
  type: GoalType;
  period: GoalPeriod;
  target: number;
  current: number;
  completed: boolean;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

interface StreakData {
  current: number;
  longest: number;
  lastPracticeDate: string;
}

interface GoalsState {
  goals: Goal[];
  achievements: Achievement[];
  streak: StreakData;
  
  // Goal management
  addGoal: (type: GoalType, period: GoalPeriod, target: number) => void;
  updateGoalProgress: (id: string, progress: number) => void;
  removeGoal: (id: string) => void;
  resetPeriodGoals: (period: GoalPeriod) => void;
  
  // Achievement management
  unlockAchievement: (title: string, description: string, icon: string) => void;
  
  // Streak management
  updateStreak: () => void;
  
  // Stats
  getGoalsByPeriod: (period: GoalPeriod) => Goal[];
  getTotalAchievements: () => number;
}

export const useGoalsStore = create<GoalsState>()(
  persist(
    (set, get) => ({
      goals: [],
      achievements: [],
      streak: {
        current: 0,
        longest: 0,
        lastPracticeDate: "",
      },

      addGoal: (type, period, target) => {
        const newGoal: Goal = {
          id: `${type}-${period}-${Date.now()}`,
          type,
          period,
          target,
          current: 0,
          completed: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ goals: [...state.goals, newGoal] }));
      },

      updateGoalProgress: (id, progress) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.id === id
              ? {
                  ...goal,
                  current: progress,
                  completed: progress >= goal.target,
                }
              : goal
          ),
        }));
      },

      removeGoal: (id) => {
        set((state) => ({
          goals: state.goals.filter((goal) => goal.id !== id),
        }));
      },

      resetPeriodGoals: (period) => {
        set((state) => ({
          goals: state.goals.map((goal) =>
            goal.period === period
              ? { ...goal, current: 0, completed: false }
              : goal
          ),
        }));
      },

      unlockAchievement: (title, description, icon) => {
        const achievement: Achievement = {
          id: `achievement-${Date.now()}`,
          title,
          description,
          icon,
          unlockedAt: new Date().toISOString(),
        };
        set((state) => ({
          achievements: [...state.achievements, achievement],
        }));
      },

      updateStreak: () => {
        const today = new Date().toDateString();
        const { lastPracticeDate, current, longest } = get().streak;
        const lastDate = lastPracticeDate ? new Date(lastPracticeDate).toDateString() : "";

        if (lastDate === today) {
          // Already practiced today
          return;
        }

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (lastDate === yesterday) {
          // Continuing streak
          const newCurrent = current + 1;
          set({
            streak: {
              current: newCurrent,
              longest: Math.max(newCurrent, longest),
              lastPracticeDate: today,
            },
          });
        } else {
          // Streak broken, start new
          set({
            streak: {
              current: 1,
              longest: Math.max(1, longest),
              lastPracticeDate: today,
            },
          });
        }
      },

      getGoalsByPeriod: (period) => {
        return get().goals.filter((goal) => goal.period === period);
      },

      getTotalAchievements: () => {
        return get().achievements.length;
      },
    }),
    {
      name: "goals-storage",
    }
  )
);

