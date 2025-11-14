// Build: 20251114
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface KeyStats {
  correct: number;
  incorrect: number;
}

export type KeyboardLayout = "QWERTY" | "Dvorak" | "Colemak";

interface HeatmapState {
  keyPresses: Record<string, number>;
  keyAccuracy: Record<string, KeyStats>;
  sessionKeyPresses: Record<string, number>; // Current session only
  totalPresses: number;
  totalSessionPresses: number;
  lastKeyPressed: string | null;
  lastKeyPressTime: number;
  currentLayout: KeyboardLayout;
  recordKeyPress: (key: string, isCorrect: boolean) => void;
  recordRealtimeKeyPress: (key: string) => void;
  resetSession: () => void;
  resetHeatmap: () => void;
  getKeyFrequency: (key: string, useSession?: boolean) => number;
  getMaxFrequency: (useSession?: boolean) => number;
  getKeyAccuracy: (key: string) => number;
  getMostUsedKeys: (limit?: number, useSession?: boolean) => Array<{ key: string; count: number; accuracy: number }>;
  getLeastAccurateKeys: (limit?: number) => Array<{ key: string; accuracy: number; count: number }>;
  getHandDistribution: () => { left: number; right: number; leftPercent: number; rightPercent: number };
  getKeyImbalance: () => number; // Variance in key usage
  setLayout: (layout: KeyboardLayout) => void;
  getLastKeyPressed: () => { key: string; age: number } | null;
}

export const useHeatmapStore = create<HeatmapState>()(
  persist(
    (set, get) => ({
      keyPresses: {},
      keyAccuracy: {},
      sessionKeyPresses: {},
      totalPresses: 0,
      totalSessionPresses: 0,
      lastKeyPressed: null,
      lastKeyPressTime: 0,
      currentLayout: "QWERTY",

      recordKeyPress: (key: string, isCorrect: boolean) => {
        const normalizedKey = key.toLowerCase();
        set((state) => ({
          keyPresses: {
            ...state.keyPresses,
            [normalizedKey]: (state.keyPresses[normalizedKey] || 0) + 1,
          },
          sessionKeyPresses: {
            ...state.sessionKeyPresses,
            [normalizedKey]: (state.sessionKeyPresses[normalizedKey] || 0) + 1,
          },
          keyAccuracy: {
            ...state.keyAccuracy,
            [normalizedKey]: {
              correct: (state.keyAccuracy[normalizedKey]?.correct || 0) + (isCorrect ? 1 : 0),
              incorrect: (state.keyAccuracy[normalizedKey]?.incorrect || 0) + (isCorrect ? 0 : 1),
            },
          },
          totalPresses: state.totalPresses + 1,
          totalSessionPresses: state.totalSessionPresses + 1,
        }));
      },

      recordRealtimeKeyPress: (key: string) => {
        const normalizedKey = key.toLowerCase();
        set((state) => ({
          lastKeyPressed: normalizedKey,
          lastKeyPressTime: Date.now(),
        }));
      },

      resetSession: () => {
        set({ sessionKeyPresses: {}, totalSessionPresses: 0 });
      },

      resetHeatmap: () => {
        set({ keyPresses: {}, keyAccuracy: {}, sessionKeyPresses: {}, totalPresses: 0, totalSessionPresses: 0 });
      },

      getKeyFrequency: (key: string, useSession = false) => {
        const normalizedKey = key.toLowerCase();
        const source = useSession ? get().sessionKeyPresses : get().keyPresses;
        return source[normalizedKey] || 0;
      },

      getMaxFrequency: (useSession = false) => {
        const source = useSession ? get().sessionKeyPresses : get().keyPresses;
        return Math.max(...Object.values(source), 0);
      },

      getKeyAccuracy: (key: string) => {
        const normalizedKey = key.toLowerCase();
        const stats = get().keyAccuracy[normalizedKey];
        if (!stats) return 0;
        const total = stats.correct + stats.incorrect;
        return total > 0 ? (stats.correct / total) * 100 : 0;
      },

      getMostUsedKeys: (limit = 10, useSession = false) => {
        const source = useSession ? get().sessionKeyPresses : get().keyPresses;
        const { keyAccuracy } = get();
        return Object.entries(source)
          .map(([key, count]) => {
            const stats = keyAccuracy[key];
            const total = stats ? stats.correct + stats.incorrect : 0;
            const accuracy = total > 0 ? (stats.correct / total) * 100 : 0;
            return { key, count, accuracy };
          })
          .sort((a, b) => b.count - a.count)
          .slice(0, limit);
      },

      getLeastAccurateKeys: (limit = 10) => {
        const { keyAccuracy } = get();
        return Object.entries(keyAccuracy)
          .map(([key, stats]) => {
            const total = stats.correct + stats.incorrect;
            const accuracy = total > 0 ? (stats.correct / total) * 100 : 0;
            return { key, accuracy, count: total };
          })
          .filter(item => item.count >= 5)
          .sort((a, b) => a.accuracy - b.accuracy)
          .slice(0, limit);
      },

      getHandDistribution: () => {
        const { keyPresses } = get();
        // Standard QWERTY hand mapping
        const leftHandKeys = new Set(['q', 'w', 'e', 'r', 't', 'a', 's', 'd', 'f', 'g', 'z', 'x', 'c', 'v', 'b']);
        const rightHandKeys = new Set(['y', 'u', 'i', 'o', 'p', 'h', 'j', 'k', 'l', ';', "'", 'n', 'm', ',', '.', '/']);

        let left = 0;
        let right = 0;

        Object.entries(keyPresses).forEach(([key, count]) => {
          if (leftHandKeys.has(key)) left += count;
          if (rightHandKeys.has(key)) right += count;
        });

        const total = left + right || 1;
        return {
          left,
          right,
          leftPercent: (left / total) * 100,
          rightPercent: (right / total) * 100,
        };
      },

      getKeyImbalance: () => {
        const { keyPresses } = get();
        const counts = Object.values(keyPresses);
        if (counts.length === 0) return 0;

        const avg = counts.reduce((a, b) => a + b, 0) / counts.length;
        const variance = counts.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / counts.length;
        return Math.sqrt(variance);
      },

      setLayout: (layout: KeyboardLayout) => {
        set({ currentLayout: layout });
      },

      getLastKeyPressed: () => {
        const { lastKeyPressed, lastKeyPressTime } = get();
        if (!lastKeyPressed) return null;
        const age = Date.now() - lastKeyPressTime;
        return age < 500 ? { key: lastKeyPressed, age } : null; // Only show if within 500ms
      },
    }),
    {
      name: "keyboard-heatmap",
    }
  )
);

