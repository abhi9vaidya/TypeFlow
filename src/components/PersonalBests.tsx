import { Card, CardContent } from "@/components/ui/card";
import { TestResult } from "@/utils/metrics";
import { Trophy, Timer, FileType2, Crown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { motion } from "framer-motion";

interface PersonalBestsProps {
  history: TestResult[];
}

export function PersonalBests({ history }: PersonalBestsProps) {
  const categories = useMemo(() => {
    // Helper to find PB for a specific filter
    const getPB = (filter: (r: TestResult) => boolean) => {
      const matches = history.filter(filter);
      if (matches.length === 0) return null;
      // Sort by WPM descending
      return [...matches].sort((a, b) => b.wpm - a.wpm)[0];
    };

    return [
      {
        label: "15s Time",
        icon: Timer,
        group: "Time",
        result: getPB(r => r.mode === 'time' && r.duration === 15)
      },
      {
        label: "30s Time",
        icon: Timer,
        group: "Time",
        result: getPB(r => r.mode === 'time' && r.duration === 30)
      },
      {
        label: "60s Time",
        icon: Timer,
        group: "Time",
        result: getPB(r => r.mode === 'time' && r.duration === 60)
      },
      {
        label: "10 Words",
        icon: FileType2,
        group: "Words",
        result: getPB(r => r.mode === 'words' && r.wordCount === 10)
      },
      {
        label: "25 Words",
        icon: FileType2,
        group: "Words",
        result: getPB(r => r.mode === 'words' && r.wordCount === 25)
      },
      {
        label: "50 Words",
        icon: FileType2,
        group: "Words",
        result: getPB(r => r.mode === 'words' && r.wordCount === 50)
      },
    ];
  }, [history]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Crown className="w-5 h-5 text-amber-500" />
          <h3 className="text-xl font-black italic tracking-tight">HALL OF FAME</h3>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((cat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={cn(
              "relative overflow-hidden border-border/50 transition-all duration-300 group h-full",
              cat.result ? "bg-panel/30 hover:border-amber-500/50" : "bg-panel/5 opacity-50"
            )}>
              {cat.result && (
                <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Trophy className="w-12 h-12" />
                </div>
              )}
              <CardContent className="p-4 pt-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "p-1.5 rounded-lg",
                      cat.result ? "bg-amber-500/10 text-amber-500" : "bg-muted text-muted-foreground"
                    )}>
                      <cat.icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      {cat.label}
                    </span>
                  </div>

                  {cat.result ? (
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black italic tracking-tighter text-foreground leading-none">
                          {Math.round(cat.result.wpm)}
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">WPM</span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] font-bold">
                        <span className="text-emerald-500">{Math.round(cat.result.accuracy)}% ACC</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-2">
                      <div className="text-sm font-bold text-muted-foreground/30 italic">Not set yet</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

