// Build: 20251114
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "purple-glow" | "cyber-blue" | "matrix" | "sunset" | "fire" | "dark" | "custom";
export type CaretStyle = "line" | "block" | "underline";
export type FontFamily = 
  | "jetbrains" 
  | "roboto-mono" 
  | "fira-code" 
  | "space-mono" 
  | "vt323" 
  | "lexend";

export interface CustomColors {
  primary: string;
  secondary: string;
  success: string;
  background: string;
}

interface SettingsState {
  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;
  customColors: CustomColors;
  setCustomColors: (colors: CustomColors) => void;

  // Sound
  keySoundEnabled: boolean;
  errorSoundEnabled: boolean;
  setKeySound: (enabled: boolean) => void;
  setErrorSound: (enabled: boolean) => void;

  // Display
  showKeyboardHeatmap: boolean;
  blurUnusedWords: boolean;
  setShowKeyboardHeatmap: (show: boolean) => void;
  setBlurUnusedWords: (blur: boolean) => void;

  // Visual Effects
  showStreakCounter: boolean;
  showSpeedZone: boolean;
  showParticleEffects: boolean;
  showCircularProgress: boolean;
  showPerfectGlow: boolean;
  showCharacterGlow: boolean;
  setShowStreakCounter: (show: boolean) => void;
  setShowSpeedZone: (show: boolean) => void;
  setShowParticleEffects: (show: boolean) => void;
  setShowCircularProgress: (show: boolean) => void;
  setShowPerfectGlow: (show: boolean) => void;
  setShowCharacterGlow: (show: boolean) => void;

  // Typing
  includePunctuation: boolean;
  includeNumbers: boolean;
  setIncludePunctuation: (include: boolean) => void;
  setIncludeNumbers: (include: boolean) => void;

  // Caret
  caretStyle: CaretStyle;
  setCaretStyle: (style: CaretStyle) => void;

  // Typography
  fontFamily: FontFamily;
  setFontFamily: (font: FontFamily) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      // Theme
      theme: "purple-glow",
      setTheme: (theme) => set({ theme }),
      customColors: {
        primary: "258 90% 66%",
        secondary: "199 89% 68%",
        success: "142 76% 60%",
        background: "240 14% 7%",
      },
      setCustomColors: (colors) => set({ customColors: colors }),

      // Sound
      keySoundEnabled: false,
      errorSoundEnabled: false,
      setKeySound: (enabled) => set({ keySoundEnabled: enabled }),
      setErrorSound: (enabled) => set({ errorSoundEnabled: enabled }),

      // Display
      showKeyboardHeatmap: false,
      blurUnusedWords: false,
      setShowKeyboardHeatmap: (show) => set({ showKeyboardHeatmap: show }),
      setBlurUnusedWords: (blur) => set({ blurUnusedWords: blur }),

      // Visual Effects
      showStreakCounter: false,
      showSpeedZone: false,
      showParticleEffects: false,
      showCircularProgress: false,
      showPerfectGlow: false,
      showCharacterGlow: false,
      setShowStreakCounter: (show) => set({ showStreakCounter: show }),
      setShowSpeedZone: (show) => set({ showSpeedZone: show }),
      setShowParticleEffects: (show) => set({ showParticleEffects: show }),
      setShowCircularProgress: (show) => set({ showCircularProgress: show }),
      setShowPerfectGlow: (show) => set({ showPerfectGlow: show }),
      setShowCharacterGlow: (show) => set({ showCharacterGlow: show }),

      // Typing
      includePunctuation: false,
      includeNumbers: false,
      setIncludePunctuation: (include) => set({ includePunctuation: include }),
      setIncludeNumbers: (include) => set({ includeNumbers: include }),

      // Caret
      caretStyle: "line",
      setCaretStyle: (style) => set({ caretStyle: style }),

      // Typography
      fontFamily: "jetbrains",
      setFontFamily: (font) => set({ fontFamily: font }),
      fontSize: 24,
      setFontSize: (size) => set({ fontSize: size }),
    }),
    {
      name: "typeflow-settings",
    }
  )
);

