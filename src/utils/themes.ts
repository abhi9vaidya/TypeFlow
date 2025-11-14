// Build: 20251114
import { Theme, CustomColors } from "@/store/useSettingsStore";

interface ThemeColors {
  background: string;
  foreground: string;
  panel: string;
  primary: string;
  secondary: string;
  accent: string;
  muted: string;
  mutedForeground: string;
  border: string;
  success: string;
  destructive: string;
  gold: string;
}

const themes: Record<Theme, ThemeColors> = {
  "purple-glow": {
    background: "240 14% 7%",
    foreground: "214 32% 91%",
    panel: "240 12% 11%",
    primary: "258 90% 66%",
    secondary: "199 89% 68%",
    accent: "258 90% 66%",
    muted: "240 9% 15%",
    mutedForeground: "217 10% 50%",
    border: "240 9% 20%",
    success: "142 76% 60%",
    destructive: "0 84% 70%",
    gold: "45 93% 70%",
  },
  "cyber-blue": {
    background: "220 20% 8%",
    foreground: "200 30% 92%",
    panel: "220 18% 12%",
    primary: "200 100% 60%",
    secondary: "280 100% 70%",
    accent: "200 100% 60%",
    muted: "220 15% 16%",
    mutedForeground: "200 10% 50%",
    border: "220 15% 22%",
    success: "142 76% 60%",
    destructive: "0 84% 70%",
    gold: "45 93% 70%",
  },
  "matrix": {
    background: "120 20% 5%",
    foreground: "120 100% 85%",
    panel: "120 18% 8%",
    primary: "120 100% 50%",
    secondary: "120 100% 70%",
    accent: "120 100% 50%",
    muted: "120 15% 12%",
    mutedForeground: "120 20% 40%",
    border: "120 20% 18%",
    success: "142 76% 60%",
    destructive: "0 84% 70%",
    gold: "45 93% 70%",
  },
  "sunset": {
    background: "340 25% 8%",
    foreground: "340 20% 92%",
    panel: "340 22% 12%",
    primary: "340 100% 65%",
    secondary: "30 100% 60%",
    accent: "340 100% 65%",
    muted: "340 15% 16%",
    mutedForeground: "340 10% 50%",
    border: "340 15% 22%",
    success: "142 76% 60%",
    destructive: "0 84% 70%",
    gold: "45 93% 70%",
  },
  "fire": {
    background: "20 30% 7%",
    foreground: "20 20% 92%",
    panel: "20 25% 11%",
    primary: "15 100% 60%",
    secondary: "35 100% 55%",
    accent: "15 100% 60%",
    muted: "20 20% 15%",
    mutedForeground: "20 10% 50%",
    border: "20 20% 20%",
    success: "142 76% 60%",
    destructive: "0 84% 70%",
    gold: "45 93% 70%",
  },
  "dark": {
    background: "0 0% 5%",
    foreground: "0 0% 90%",
    panel: "0 0% 8%",
    primary: "0 0% 70%",
    secondary: "0 0% 60%",
    accent: "0 0% 70%",
    muted: "0 0% 12%",
    mutedForeground: "0 0% 50%",
    border: "0 0% 18%",
    success: "142 76% 60%",
    destructive: "0 84% 70%",
    gold: "45 93% 70%",
  },
  "custom": {
    background: "240 14% 7%",
    foreground: "214 32% 91%",
    panel: "240 12% 11%",
    primary: "258 90% 66%",
    secondary: "199 89% 68%",
    accent: "258 90% 66%",
    muted: "240 9% 15%",
    mutedForeground: "217 10% 50%",
    border: "240 9% 20%",
    success: "142 76% 60%",
    destructive: "0 84% 70%",
    gold: "45 93% 70%",
  },
};

export function applyTheme(theme: Theme, customColors?: CustomColors) {
  const colors = theme === "custom" && customColors 
    ? {
        ...themes.custom,
        primary: customColors.primary,
        secondary: customColors.secondary,
        accent: customColors.primary,
        success: customColors.success,
        background: customColors.background,
        panel: adjustBrightness(customColors.background, 1.5),
        muted: adjustBrightness(customColors.background, 2),
        border: adjustBrightness(customColors.background, 2.5),
        foreground: getContrastColor(customColors.background),
        mutedForeground: adjustBrightness(getContrastColor(customColors.background), 0.5),
      }
    : themes[theme];
  
  const root = document.documentElement;

  Object.entries(colors).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, "-$1").toLowerCase();
    root.style.setProperty(`--${cssVar}`, value);
  });
}

function adjustBrightness(hsl: string, factor: number): string {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
  return `${h} ${s}% ${Math.min(100, l * factor)}%`;
}

function getContrastColor(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
  return l < 50 ? "0 0% 90%" : "0 0% 10%";
}

