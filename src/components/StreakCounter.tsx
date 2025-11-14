// Build: 20251114
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { Flame, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function StreakCounter() {
  const { currentStreak, maxStreak, isRunning } = useTypingStore();
  const { showStreakCounter } = useSettingsStore();

  if (!isRunning || currentStreak === 0 || !showStreakCounter) return null;

  const getStreakLevel = (streak: number) => {
    if (streak >= 20) return "blazing";
    if (streak >= 10) return "fire";
    if (streak >= 5) return "hot";
    return "warm";
  };

  const level = getStreakLevel(currentStreak);

  return (
    <div className="fixed top-24 right-8 z-50 animate-scale-in">
      <div className="relative group">
        {/* Animated glow background */}
        <div 
          className={cn(
            "absolute inset-0 rounded-2xl blur-xl transition-all duration-500",
            level === "blazing" && "bg-gold animate-pulse-glow opacity-80",
            level === "fire" && "bg-destructive opacity-60",
            level === "hot" && "bg-primary opacity-50",
            level === "warm" && "bg-secondary opacity-40"
          )}
        />
        
        {/* Main streak display */}
        <div className={cn(
          "relative flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-md border-2 transition-all duration-300",
          level === "blazing" && "bg-gold/20 border-gold/60",
          level === "fire" && "bg-destructive/20 border-destructive/60",
          level === "hot" && "bg-primary/20 border-primary/60",
          level === "warm" && "bg-secondary/20 border-secondary/60"
        )}>
          {/* Icon */}
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
            level === "blazing" && "bg-gold/30 animate-pulse-glow",
            level === "fire" && "bg-destructive/30",
            level === "hot" && "bg-primary/30",
            level === "warm" && "bg-secondary/30"
          )}>
            {level === "blazing" || level === "fire" ? (
              <Flame className={cn(
                "w-5 h-5 transition-colors duration-300",
                level === "blazing" && "text-gold animate-pulse",
                level === "fire" && "text-destructive"
              )} />
            ) : (
              <Zap className={cn(
                "w-5 h-5 transition-colors duration-300",
                level === "hot" && "text-primary",
                level === "warm" && "text-secondary"
              )} />
            )}
          </div>

          {/* Streak count */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <span className={cn(
                "text-3xl font-bold tabular-nums transition-colors duration-300",
                level === "blazing" && "text-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]",
                level === "fire" && "text-destructive",
                level === "hot" && "text-primary",
                level === "warm" && "text-secondary"
              )}>
                {currentStreak}
              </span>
              <span className={cn(
                "text-sm font-medium transition-colors duration-300",
                level === "blazing" && "text-gold/80",
                level === "fire" && "text-destructive/80",
                level === "hot" && "text-primary/80",
                level === "warm" && "text-secondary/80"
              )}>
                streak
              </span>
            </div>
            
            {/* Max streak indicator */}
            {maxStreak > currentStreak && (
              <span className="text-xs text-muted-foreground">
                Best: {maxStreak}
              </span>
            )}
          </div>

          {/* Combo multiplier effect */}
          {currentStreak >= 5 && (
            <div className={cn(
              "absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md border transition-all duration-300",
              level === "blazing" && "bg-gold/30 border-gold/60 text-gold",
              level === "fire" && "bg-destructive/30 border-destructive/60 text-destructive",
              level === "hot" && "bg-primary/30 border-primary/60 text-primary",
              level === "warm" && "bg-secondary/30 border-secondary/60 text-secondary"
            )}>
              ×{Math.floor(currentStreak / 5)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

