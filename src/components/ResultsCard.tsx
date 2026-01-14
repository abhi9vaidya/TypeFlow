// Build: 20251114
import { TestResult } from "@/utils/metrics";
import { ResultsChart } from "./ResultsChart";
import { Button } from "@/components/ui/button";
import { Share2, Copy, RotateCcw, Trophy, Download, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTypingStore } from "@/store/useTypingStore";
import { generateWords } from "@/utils/words";
import { getRandomQuote, quoteToWords } from "@/utils/quotes";
import { checkAchievements } from "@/utils/achievements";
import { useToast } from "@/hooks/use-toast";
import { triggerConfetti } from "@/utils/confetti";
import { soundPlayer } from "@/utils/sounds";
import { useEffect } from "react";

interface ResultsCardProps {
  result: TestResult;
}

export function ResultsCard({ result }: ResultsCardProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setWords, resetTest, testMode, wordCount } = useTypingStore();
  
  const earnedAchievements = checkAchievements(result);

  // Celebrate personal best with confetti and sound
  useEffect(() => {
    if (result.isPB) {
      triggerConfetti();
      soundPlayer.playSuccessSound();
    }
  }, [result.isPB]);

  const handleNextTest = () => {
    if (testMode === "quote") {
      const quote = getRandomQuote();
      const newWords = quoteToWords(quote);
      setWords(newWords);
    } else if (testMode === "words") {
      const newWords = generateWords(wordCount || 25);
      setWords(newWords);
    } else {
      const newWords = generateWords(100);
      setWords(newWords);
    }
    resetTest();
  };

  const handleCopyStats = () => {
    const statsText = `TypeFlow Results\nWPM: ${result.wpm} | Accuracy: ${result.accuracy}% | Consistency: ${result.consistency}%`;
    navigator.clipboard.writeText(statsText);
    toast({
      title: "Stats copied!",
      description: "Your results have been copied to clipboard",
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8 animate-scale-in">
      {/* Header with PB badge and achievements */}
      {(result.isPB || earnedAchievements.length > 0) && (
        <div className="flex flex-col items-center gap-4 sm:gap-6">
          {result.isPB && (
            <div className="relative group animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-r from-gold via-gold/80 to-gold blur-xl opacity-60 group-hover:opacity-80 transition-opacity rounded-2xl sm:rounded-3xl" />
              <div className="relative flex items-center gap-3 sm:gap-4 px-6 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-gold/30 via-gold/20 to-gold/10 backdrop-blur-md border-2 border-gold/60 rounded-2xl sm:rounded-3xl">
                <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gold/20 border border-gold/40">
                  <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-gold drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                </div>
                <div className="flex flex-col">
                  <span className="text-gold font-bold text-xl sm:text-2xl tracking-tight drop-shadow-[0_2px_8px_rgba(250,204,21,0.4)]">
                    Personal Best!
                  </span>
                  <span className="text-gold/80 text-[10px] sm:text-xs font-medium">
                    New record achieved
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {earnedAchievements.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 animate-fade-in-up">
              {earnedAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="relative group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/70 to-primary/50 blur-lg opacity-50 group-hover:opacity-70 transition-opacity rounded-2xl" />
                  <div className="relative flex items-center gap-3 px-6 py-4 bg-gradient-to-br from-primary/25 via-primary/15 to-primary/5 backdrop-blur-md border-2 border-primary/50 rounded-2xl">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/40">
                      <span className="text-2xl drop-shadow-[0_0_6px_rgba(168,85,247,0.6)]">
                        {achievement.icon}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-primary font-bold text-base tracking-tight drop-shadow-[0_2px_6px_rgba(168,85,247,0.3)]">
                        {achievement.name}
                      </span>
                      <span className="text-primary/70 text-xs font-medium">
                        {achievement.description}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main stats showcase */}
      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
        {/* Left: Primary metrics */}
        <div className="flex flex-col items-center justify-center space-y-8 sm:space-y-12 p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm border border-border/50">
          <div className="text-center space-y-2 sm:space-y-3">
            <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-widest font-semibold">
              Words per minute
            </div>
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-primary/30 blur-3xl rounded-full scale-150" />
              <div className="relative text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-primary tabular-nums tracking-tighter">
                {result.wpm}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:gap-8 w-full">
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Accuracy
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary tabular-nums">
                {result.accuracy}%
              </div>
            </div>
            
            <div className="text-center space-y-1 sm:space-y-2">
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
                Consistency
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold tabular-nums">
                {result.consistency}%
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chart */}
        <div className="flex items-center justify-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-panel/80 to-panel/40 backdrop-blur-sm border border-border/50">
          <ResultsChart samples={result.samples} isPB={result.isPB} />
        </div>
      </div>

      {/* Detailed stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-xl sm:rounded-2xl bg-panel/60 backdrop-blur-sm border border-border/40 text-center">
          <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wide mb-1 sm:mb-2 font-medium">
            Test Type
          </div>
          <div className="text-sm font-semibold capitalize">
            {result.mode}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-panel/60 backdrop-blur-sm border border-border/40 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            Raw WPM
          </div>
          <div className="text-sm font-semibold tabular-nums">
            {result.rawWpm}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-panel/60 backdrop-blur-sm border border-border/40 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            Duration
          </div>
          <div className="text-sm font-semibold tabular-nums">
            {result.duration}s
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-panel/60 backdrop-blur-sm border border-border/40 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            Correct
          </div>
          <div className="text-sm font-semibold text-success tabular-nums">
            {result.chars.correct}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-panel/60 backdrop-blur-sm border border-border/40 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            Incorrect
          </div>
          <div className="text-sm font-semibold text-destructive tabular-nums">
            {result.chars.incorrect}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-panel/60 backdrop-blur-sm border border-border/40 text-center">
          <div className="text-xs text-muted-foreground uppercase tracking-wide mb-2 font-medium">
            Extra
          </div>
          <div className="text-sm font-semibold text-gold tabular-nums">
            {result.chars.extra}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-4">
        <Button
          variant="outline"
          size="lg"
          onClick={() => navigate("/history")}
          className="gap-2 h-11 sm:h-12 touch-manipulation"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden xs:inline">View</span> History
        </Button>
        
        <Button
          variant="outline"
          size="lg"
          onClick={handleCopyStats}
          className="gap-2 h-11 sm:h-12 touch-manipulation"
        >
          <Copy className="h-4 w-4" />
          <span className="hidden xs:inline">Copy</span> Stats
        </Button>
        
        <Button
          size="lg"
          onClick={handleNextTest}
          className="gap-2 bg-primary hover:bg-primary/90 h-11 sm:h-12 touch-manipulation"
        >
          <Sparkles className="h-4 w-4" />
          Next Test
        </Button>
      </div>
    </div>
  );
}

