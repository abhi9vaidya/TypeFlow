import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestResult } from "@/utils/metrics";
import { Trophy, Timer, FileType2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

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
        label: "Time 15s",
        icon: Timer,
        result: getPB(r => r.mode === 'time' && r.duration === 15)
      },
      {
        label: "Time 30s",
        icon: Timer,
        result: getPB(r => r.mode === 'time' && r.duration === 30)
      },
      {
        label: "Time 60s",
        icon: Timer,
        result: getPB(r => r.mode === 'time' && r.duration === 60)
      },
      {
          label: "Time 120s",
          icon: Timer,
          result: getPB(r => r.mode === 'time' && r.duration === 120)
      },
      {
        label: "Words 10",
        icon: FileType2,
        result: getPB(r => r.mode === 'words' && r.wordCount === 10)
      },
      {
        label: "Words 25",
        icon: FileType2,
        result: getPB(r => r.mode === 'words' && r.wordCount === 25)
      },
      {
        label: "Words 50",
        icon: FileType2,
        result: getPB(r => r.mode === 'words' && r.wordCount === 50)
      },
      {
        label: "Words 100",
        icon: FileType2,
        result: getPB(r => r.mode === 'words' && r.wordCount === 100)
      },
    ];
  }, [history]);

  return (
    <Card className="col-span-1 lg:col-span-2 bg-gradient-to-br from-panel/50 to-panel/30 border-border/50">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Trophy className="h-5 w-5 text-gold" />
          Personal Bests
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((cat, idx) => (
            <div 
              key={idx}
              className={cn(
                "p-3 rounded-lg border flex flex-col items-center justify-center gap-1 transition-all",
                cat.result 
                  ? "bg-primary/5 border-primary/20 hover:bg-primary/10 hover:border-primary/40" 
                  : "bg-muted/10 border-border/30 opacity-60"
              )}
            >
              <div className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1.5 mb-1">
                <cat.icon className="w-3 h-3" />
                {cat.label}
              </div>
              
              {cat.result ? (
                <>
                  <div className="text-2xl font-black text-foreground tabular-nums leading-none">
                    {Math.round(cat.result.wpm)}
                  </div>
                  <div className={cn(
                    "text-[10px] font-medium px-1.5 py-0.5 rounded-full mt-1",
                    cat.result.accuracy >= 98 ? "bg-emerald-500/10 text-emerald-500" :
                    cat.result.accuracy >= 95 ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {cat.result.accuracy}% Acc
                  </div>
                </>
              ) : (
                <div className="text-lg font-bold text-muted-foreground/30 py-1">
                  —
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
