// Build: 20260115 - Refined: Removed redundant WPM, now shows useful typing stats
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateWPM } from "@/utils/metrics";
import { Rocket, Gauge, Zap, Trophy, Timer, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function SpeedZone() {
  const { correctChars, incorrectChars, startTime, isRunning, currentWordIndex } = useTypingStore();
  const { showSpeedZone } = useSettingsStore();
  const [displayWPM, setDisplayWPM] = useState(0);

  // Smooth WPM calculation
  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const wpm = calculateWPM(correctChars, elapsed);
      setDisplayWPM(wpm);
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, startTime, correctChars]);

  if (!isRunning || !startTime || !showSpeedZone) return null;

  const getSpeedZone = (wpm: number) => {
    if (wpm >= 120) return { level: "insane", label: "INSANE" };
    if (wpm >= 100) return { level: "legendary", label: "LEGENDARY" };
    if (wpm >= 80) return { level: "blazing", label: "BLAZING" };
    if (wpm >= 60) return { level: "fast", label: "FAST" };
    if (wpm >= 40) return { level: "steady", label: "STEADY" };
    if (wpm >= 20) return { level: "warm", label: "WARMING UP" };
    return { level: "slow", label: "STARTING" };
  };

  const zone = getSpeedZone(displayWPM);

  const levelConfig: Record<string, any> = {
    insane: {
      gradient: "from-fuchsia-500 via-purple-500 to-pink-500",
      bg: "bg-fuchsia-500/10",
      text: "text-fuchsia-400",
      icon: Trophy,
    },
    legendary: {
      gradient: "from-amber-400 via-yellow-300 to-amber-500",
      bg: "bg-amber-500/10",
      text: "text-amber-400",
      icon: Trophy,
    },
    blazing: {
      gradient: "from-orange-500 to-red-500",
      bg: "bg-orange-500/10",
      text: "text-orange-400",
      icon: Rocket,
    },
    fast: {
      gradient: "from-emerald-500 to-green-500",
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      icon: Zap,
    },
    steady: {
      gradient: "from-primary to-violet-500",
      bg: "bg-primary/10",
      text: "text-primary",
      icon: Gauge,
    },
    warm: {
      gradient: "from-secondary to-blue-500",
      bg: "bg-secondary/10",
      text: "text-secondary",
      icon: Timer,
    },
    slow: {
      gradient: "from-slate-500 to-slate-600",
      bg: "bg-slate-500/10",
      text: "text-slate-400",
      icon: Timer,
    },
  };

  const config = levelConfig[zone.level] || levelConfig.slow;
  const Icon = config.icon;

  // Calculate useful stats instead of showing WPM again
  const totalChars = correctChars + incorrectChars;
  const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
  const wordsTyped = currentWordIndex;

  return (
    <div className="fixed top-24 left-6 z-50 animate-spring-in">
      <div className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl",
        "bg-background/80 backdrop-blur-xl",
        "border border-white/10",
        "shadow-lg shadow-black/20",
        "transition-all duration-300"
      )}>
        {/* Zone icon with gradient background */}
        <div className={cn(
          "flex items-center justify-center w-10 h-10 rounded-lg",
          "bg-gradient-to-br",
          config.gradient
        )}>
          <Icon className="w-5 h-5 text-white" />
        </div>

        {/* Zone label + useful info */}
        <div className="flex flex-col">
          <span className={cn(
            "text-xs font-bold tracking-wider",
            config.text
          )}>
            {zone.label}
          </span>

          {/* Show useful info: words typed instead of duplicate WPM */}
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground/70">
            <span className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              {wordsTyped} words
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
