// Build: 20251114
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateWPM } from "@/utils/metrics";
import { TrendingUp, Gauge } from "lucide-react";
import { cn } from "@/lib/utils";

export function SpeedZone() {
  const { correctChars, startTime, isRunning } = useTypingStore();
  const { showSpeedZone } = useSettingsStore();

  if (!isRunning || !startTime || !showSpeedZone) return null;

  const elapsed = (Date.now() - startTime) / 1000;
  const currentWPM = calculateWPM(correctChars, elapsed);

  const getSpeedZone = (wpm: number) => {
    if (wpm >= 100) return { level: "legendary", label: "LEGENDARY", color: "gold" };
    if (wpm >= 80) return { level: "blazing", label: "BLAZING", color: "destructive" };
    if (wpm >= 60) return { level: "fast", label: "FAST", color: "success" };
    if (wpm >= 40) return { level: "good", label: "GOOD", color: "primary" };
    if (wpm >= 20) return { level: "warm", label: "WARMING UP", color: "secondary" };
    return { level: "slow", label: "GETTING STARTED", color: "muted" };
  };

  const zone = getSpeedZone(currentWPM);

  return (
    <div className="fixed top-24 left-8 z-50 animate-scale-in">
      <div className="relative group">
        {/* Animated glow */}
        <div 
          className={cn(
            "absolute inset-0 rounded-2xl blur-xl transition-all duration-500",
            zone.color === "gold" && "bg-gold animate-pulse-glow opacity-70",
            zone.color === "destructive" && "bg-destructive opacity-50",
            zone.color === "success" && "bg-success opacity-40",
            zone.color === "primary" && "bg-primary opacity-40",
            zone.color === "secondary" && "bg-secondary opacity-30"
          )}
        />
        
        {/* Speed zone indicator */}
        <div className={cn(
          "relative flex items-center gap-3 px-6 py-4 rounded-2xl backdrop-blur-md border-2 transition-all duration-300",
          zone.color === "gold" && "bg-gold/20 border-gold/60",
          zone.color === "destructive" && "bg-destructive/20 border-destructive/60",
          zone.color === "success" && "bg-success/20 border-success/60",
          zone.color === "primary" && "bg-primary/20 border-primary/60",
          zone.color === "secondary" && "bg-secondary/20 border-secondary/60"
        )}>
          {/* Icon */}
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300",
            zone.color === "gold" && "bg-gold/30 animate-pulse",
            zone.color === "destructive" && "bg-destructive/30",
            zone.color === "success" && "bg-success/30",
            zone.color === "primary" && "bg-primary/30",
            zone.color === "secondary" && "bg-secondary/30"
          )}>
            {zone.level === "legendary" || zone.level === "blazing" ? (
              <TrendingUp className={cn(
                "w-5 h-5 transition-colors duration-300",
                zone.color === "gold" && "text-gold animate-pulse",
                zone.color === "destructive" && "text-destructive"
              )} />
            ) : (
              <Gauge className={cn(
                "w-5 h-5 transition-colors duration-300",
                zone.color === "success" && "text-success",
                zone.color === "primary" && "text-primary",
                zone.color === "secondary" && "text-secondary"
              )} />
            )}
          </div>

          {/* Zone label */}
          <div className="flex flex-col">
            <span className={cn(
              "text-xs font-bold tracking-wider transition-colors duration-300",
              zone.color === "gold" && "text-gold drop-shadow-[0_0_6px_rgba(250,204,21,0.6)]",
              zone.color === "destructive" && "text-destructive",
              zone.color === "success" && "text-success",
              zone.color === "primary" && "text-primary",
              zone.color === "secondary" && "text-secondary"
            )}>
              {zone.label}
            </span>
            <span className="text-xs text-muted-foreground">
              Speed Zone
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

