// Build: 20251114
import { useEffect, useState, useCallback } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { calculateWPM, calculateAccuracy } from "@/utils/metrics";
import { cn } from "@/lib/utils";

export function LiveMetrics() {
  const {
    isRunning,
    startTime,
    duration,
    correctChars,
    incorrectChars,
    extraChars,
    totalErrors,
  } = useTypingStore();

  const { showCircularProgress } = useSettingsStore();

  const [elapsed, setElapsed] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  // Memoize calculation to prevent unnecessary updates
  const updateMetrics = useCallback(() => {
    if (!isRunning || !startTime) return;

    const now = Date.now();
    const elapsedSeconds = (now - startTime) / 1000;
    setElapsed(Math.floor(elapsedSeconds));

    const currentWpm = calculateWPM(correctChars, elapsedSeconds);
    // Use totalErrors for accuracy calculation to mimic Monkeytype behavior (penalize corrected errors)
    const currentAccuracy = calculateAccuracy(correctChars, totalErrors, 0);

    setWpm(currentWpm);
    setAccuracy(currentAccuracy);
  }, [isRunning, startTime, correctChars, incorrectChars, extraChars, totalErrors]);

  useEffect(() => {
    if (!isRunning || !startTime) return;

    // Use RAF for smoother updates while minimizing repaints
    const interval = setInterval(updateMetrics, 100);
    return () => clearInterval(interval);
  }, [isRunning, startTime, updateMetrics]);

  if (!isRunning) {
    return null;
  }

  const remaining = Math.max(0, duration - elapsed);
  const progress = duration > 0 ? ((duration - remaining) / duration) * 100 : 0;

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 mb-8 sm:mb-12 animate-spring-in will-change-contents px-4">
      {/* WPM Metric */}
      <div className="relative text-center group flex-shrink-0">
        <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="relative glass-premium rounded-2xl p-4 md:p-6">
          <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gradient-animated tabular-nums tracking-tight">
            {wpm}
          </div>
          <div className="text-[10px] sm:text-xs md:text-sm text-muted-foreground uppercase tracking-widest mt-1 sm:mt-2 font-bold opacity-80">
            WPM
          </div>
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="h-16 sm:h-20 md:h-24 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent flex-shrink-0" />

      {/* Accuracy Metric */}
      <div className="relative text-center group flex-shrink-0">
        <div className={cn(
          "absolute inset-0 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none",
          accuracy >= 95 ? "bg-success/15" : accuracy >= 85 ? "bg-gold/15" : "bg-destructive/15"
        )} />
        <div className="relative">
          {/* Circular progress ring */}
          {showCircularProgress && (
            <div className="absolute -inset-6 md:-inset-8 opacity-40 will-change-transform">
              <svg className="w-24 h-24 md:w-32 md:h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className={cn(
                    "transition-all duration-300 will-change-auto",
                    accuracy >= 95 ? "text-success/30" : accuracy >= 85 ? "text-gold/30" : "text-destructive/30"
                  )}
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className={cn(
                    accuracy >= 95 ? "text-success" : accuracy >= 85 ? "text-gold" : "text-destructive",
                    "transition-all duration-300"
                  )}
                  strokeDasharray={`${(accuracy / 100) * 351.86} 351.86`}
                  style={{ transition: "stroke-dasharray 0.25s cubic-bezier(0.4, 0, 0.2, 1)" }}
                />
              </svg>
            </div>
          )}

          <div className={cn(
            "text-5xl md:text-6xl lg:text-7xl font-bold tabular-nums tracking-tight transition-all duration-300 will-change-auto",
            accuracy >= 95 ? "text-success drop-shadow-[0_0_16px_rgba(34,197,94,0.5)]" :
              accuracy >= 85 ? "text-gold drop-shadow-[0_0_16px_rgba(250,204,21,0.5)]" :
                "text-destructive drop-shadow-[0_0_16px_rgba(239,68,68,0.5)]"
          )}>
            {accuracy}%
          </div>
          <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mt-2 font-bold opacity-80">
            Accuracy
          </div>
        </div>
      </div>

      {/* Vertical Separator */}
      <div className="h-20 md:h-24 w-px bg-gradient-to-b from-transparent via-border/50 to-transparent flex-shrink-0" />

      {/* Timer Metric */}
      <div className="relative text-center group flex-shrink-0">
        <div className="absolute inset-0 bg-secondary/15 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        <div className="relative">
          {/* Circular countdown ring */}
          {showCircularProgress && (
            <div className="absolute -inset-6 md:-inset-8 will-change-transform">
              <svg className="w-24 h-24 md:w-32 md:h-32 transform -rotate-90" viewBox="0 0 128 128">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className="text-border/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="3"
                  fill="none"
                  className={cn(
                    "transition-all duration-300 will-change-auto",
                    remaining <= 10 ? "text-destructive" : remaining <= 30 ? "text-gold" : "text-secondary"
                  )}
                  strokeDasharray={`${(progress / 100) * 351.86} 351.86`}
                  style={{ transition: "stroke-dasharray 0.1s linear" }}
                />
              </svg>
            </div>
          )}

          <div className={cn(
            "text-5xl md:text-6xl lg:text-7xl font-bold font-mono tabular-nums tracking-tight transition-all duration-300 will-change-auto",
            remaining <= 10 ? "text-destructive drop-shadow-[0_0_16px_rgba(239,68,68,0.5)] animate-pulse" :
              remaining <= 30 ? "text-gold drop-shadow-[0_0_16px_rgba(250,204,21,0.5)]" :
                "text-secondary drop-shadow-[0_0_16px_rgba(96,165,250,0.5)]"
          )}>
            {remaining}
          </div>
          <div className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest mt-2 font-bold opacity-80">
            Seconds
          </div>
        </div>
      </div>
    </div>
  );
}

