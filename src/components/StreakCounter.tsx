// Build: 20260115 - Polished version
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Flame, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakCounter() {
  const { currentStreak, maxStreak, isRunning } = useTypingStore();
  const { showStreakCounter } = useSettingsStore();

  if (!isRunning || currentStreak === 0 || !showStreakCounter) return null;

  const getStreakLevel = (streak: number) => {
    if (streak >= 25) return "legendary";
    if (streak >= 15) return "blazing";
    if (streak >= 8) return "fire";
    if (streak >= 4) return "hot";
    return "warm";
  };

  const level = getStreakLevel(currentStreak);

  const levelConfig = {
    legendary: {
      gradient: "from-amber-400 via-yellow-300 to-amber-500",
      glow: "shadow-[0_0_40px_rgba(251,191,36,0.6),0_0_80px_rgba(251,191,36,0.3)]",
      border: "border-amber-400/60",
      bg: "bg-gradient-to-br from-amber-500/20 via-yellow-500/10 to-amber-600/20",
      text: "text-amber-300",
      icon: Star,
      pulse: true,
    },
    blazing: {
      gradient: "from-orange-500 via-red-500 to-orange-600",
      glow: "shadow-[0_0_30px_rgba(249,115,22,0.5),0_0_60px_rgba(239,68,68,0.3)]",
      border: "border-orange-500/60",
      bg: "bg-gradient-to-br from-orange-500/20 via-red-500/10 to-orange-600/20",
      text: "text-orange-400",
      icon: Flame,
      pulse: true,
    },
    fire: {
      gradient: "from-red-500 to-orange-500",
      glow: "shadow-[0_0_25px_rgba(239,68,68,0.4)]",
      border: "border-red-500/50",
      bg: "bg-gradient-to-br from-red-500/15 to-orange-500/10",
      text: "text-red-400",
      icon: Flame,
      pulse: false,
    },
    hot: {
      gradient: "from-primary to-purple-500",
      glow: "shadow-[0_0_20px_rgba(168,85,247,0.3)]",
      border: "border-primary/50",
      bg: "bg-gradient-to-br from-primary/15 to-purple-500/10",
      text: "text-primary",
      icon: Zap,
      pulse: false,
    },
    warm: {
      gradient: "from-secondary to-cyan-500",
      glow: "shadow-[0_0_15px_rgba(96,165,250,0.25)]",
      border: "border-secondary/40",
      bg: "bg-gradient-to-br from-secondary/10 to-cyan-500/5",
      text: "text-secondary",
      icon: Zap,
      pulse: false,
    },
  };

  const config = levelConfig[level];
  const Icon = config.icon;
  const multiplier = Math.floor(currentStreak / 5);

  return (
    <div className="fixed top-24 right-6 z-50 animate-spring-in">
      <div className={cn(
        "relative rounded-2xl overflow-hidden",
        config.glow,
        "transition-all duration-500"
      )}>
        {/* Animated gradient border */}
        <div className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-r p-[1px]",
          config.gradient,
          config.pulse && "animate-pulse"
        )}>
          <div className="absolute inset-[1px] rounded-2xl bg-background/95 backdrop-blur-xl" />
        </div>

        {/* Content */}
        <div className={cn(
          "relative flex items-center gap-4 px-5 py-3.5",
          config.bg
        )}>
          {/* Animated icon container */}
          <div className={cn(
            "relative flex items-center justify-center w-11 h-11 rounded-xl",
            "bg-gradient-to-br",
            config.gradient,
            "shadow-lg",
            config.pulse && "animate-pulse"
          )}>
            <Icon className="w-5 h-5 text-white drop-shadow-lg" />

            {/* Sparkle effect for high streaks */}
            {level === "legendary" && (
              <>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full animate-ping opacity-75" />
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-yellow-200 rounded-full animate-ping opacity-60" style={{ animationDelay: "0.5s" }} />
              </>
            )}
          </div>

          {/* Streak info */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-3xl font-black tabular-nums tracking-tight",
                config.text,
                level === "legendary" && "text-gradient-animated"
              )}>
                {currentStreak}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                streak
              </span>
            </div>

            {/* Progress to next multiplier */}
            {multiplier > 0 && (
              <div className="flex items-center gap-2 mt-1">
                <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full bg-gradient-to-r", config.gradient)}
                    style={{ width: `${(currentStreak % 5) * 20}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Multiplier badge */}
          {multiplier > 0 && (
            <div className={cn(
              "absolute -top-2 -right-2 flex items-center justify-center",
              "w-8 h-8 rounded-full",
              "bg-gradient-to-br",
              config.gradient,
              "text-white text-xs font-bold",
              "shadow-lg border-2 border-background",
              config.pulse && "animate-bounce"
            )}>
              ×{multiplier}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
