import { TestResult } from "@/utils/metrics";
import { ResultsChart } from "./ResultsChart";
import { Button } from "@/components/ui/button";
import { motion, useSpring, useTransform, useMotionValue, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import {
  Share2,
  Copy,
  RotateCcw,
  Trophy,
  Download,
  Sparkles,
  Target,
  Zap,
  Activity,
  Timer,
  CheckCircle2,
  AlertCircle,
  PlusCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTypingStore } from "@/store/useTypingStore";
import { generateWords } from "@/utils/words";
import { getRandomQuote, quoteToWords } from "@/utils/quotes";
import { checkAchievements } from "@/utils/achievements";
import { useToast } from "@/hooks/use-toast";
import { triggerConfetti } from "@/utils/confetti";
import { soundPlayer } from "@/utils/sounds";
import { cn } from "@/lib/utils";

interface ResultsCardProps {
  result: TestResult;
}


function AnimatedNumber({ value, className, format = (v: number) => Math.round(v).toString() }: { value: number, className?: string, format?: (v: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const displayValue = useTransform(springValue, (latest) => format(latest));

  useEffect(() => {
    animate(motionValue, value, { duration: 1, ease: "easeOut" });
  }, [value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = format(latest);
      }
    });
  }, [springValue, format]);

  return <span ref={ref} className={className} />;
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

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="w-full max-w-6xl mx-auto p-3 sm:p-4 md:p-8 space-y-8"
    >
      {/* Header with PB badge and achievements */}
      {(result.isPB || earnedAchievements.length > 0) && (
        <motion.div variants={itemVariants} className="flex flex-col items-center gap-6">
          {result.isPB && (
            <div className="relative group animate-bounce-slow">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold via-yellow-400 to-gold rounded-full blur opacity-40 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex items-center gap-4 px-8 py-3 bg-[#111] border border-gold/30 rounded-full">
                <Trophy className="h-6 w-6 text-gold animate-pulse" />
                <span className="text-gold font-bold text-xl tracking-wider uppercase">
                  New Personal Best
                </span>
              </div>
            </div>
          )}

          {earnedAchievements.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-3">
              {earnedAchievements.map((achievement) => (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  key={achievement.id}
                  className="flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-lg"
                >
                  <span className="text-xl">{achievement.icon}</span>
                  <span className="text-xs font-semibold text-primary-foreground/80 lowercase tracking-tight">
                    {achievement.name}
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Main Hero Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* WPM Display */}
        <motion.div variants={itemVariants} className="lg:col-span-4 flex flex-col items-center justify-center p-8 rounded-3xl glass-premium relative overflow-hidden group card-hover-lift">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
            <Zap className="h-24 w-24 text-primary" strokeWidth={1} />
          </div>

          <div className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mb-2">
            Words Per Minute
          </div>
          <div className="text-8xl md:text-9xl font-black text-gradient-animated tracking-tighter tabular-nums">
            <AnimatedNumber value={result.wpm} />
          </div>

          <div className="flex gap-8 mt-8 w-full">
            <div className="flex-1 text-center">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-secondary tabular-nums drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]">
                <AnimatedNumber value={result.accuracy} format={(v) => Math.round(v) + '%'} />
              </div>
            </div>
            <div className="w-px h-10 bg-gradient-to-b from-transparent via-white/10 to-transparent self-end" />
            <div className="flex-1 text-center">
              <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Consistency</div>
              <div className="text-2xl font-bold text-gold tabular-nums drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]">
                <AnimatedNumber value={result.consistency} format={(v) => Math.round(v) + '%'} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Chart Area */}
        <motion.div variants={itemVariants} className="lg:col-span-8 p-6 md:p-8 rounded-3xl glass-premium flex flex-col justify-center card-hover-lift">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
              <Activity className="h-3 w-3 text-primary" />
              Speed Over Time
            </div>
            <div className="text-[10px] text-muted-foreground/60 font-mono">
              Peak: <span className="text-primary font-bold drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]">{Math.max(...result.samples.map(s => s.wpm))} WPM</span>
            </div>
          </div>
          <ResultsChart samples={result.samples} isPB={result.isPB} />
        </motion.div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatBox label="Mode" value={result.mode} icon={<Target className="h-3 w-3" />} />
        <StatBox label="Raw WPM" value={result.rawWpm} icon={<Zap className="h-3 w-3" />} />
        <StatBox label="Time" value={`${result.duration}s`} icon={<Timer className="h-3 w-3" />} />
        <StatBox label="Correct" value={result.chars.correct} icon={<CheckCircle2 className="h-3 w-3" />} color="text-success" />
        <StatBox label="Errors" value={result.chars.incorrect} icon={<AlertCircle className="h-3 w-3" />} color="text-destructive" />
        <StatBox label="Extras" value={result.chars.extra} icon={<PlusCircle className="h-3 w-3" />} color="text-gold" />
      </motion.div>

      {/* Unified Action Footer */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <div className="flex items-center gap-2 p-1.5 bg-panel/50 border border-white/5 rounded-2xl">
          <Button
            variant="ghost"
            onClick={() => navigate("/history")}
            className="flex items-center gap-2 px-6 h-12 rounded-xl hover:bg-white/5 transition-all text-sm font-medium"
          >
            <RotateCcw className="h-4 w-4 text-muted-foreground" />
            History
          </Button>
          <Button
            variant="ghost"
            onClick={handleCopyStats}
            className="flex items-center gap-2 px-6 h-12 rounded-xl hover:bg-white/5 transition-all text-sm font-medium"
          >
            <Copy className="h-4 w-4 text-muted-foreground" />
            Copy Link
          </Button>
        </div>

        <Button
          onClick={handleNextTest}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 rounded-2xl font-bold text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] group"
        >
          <Sparkles className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
          Start New Race
        </Button>
      </motion.div>
    </motion.div>
  );
}

function StatBox({ label, value, icon, color = "text-foreground" }: { label: string, value: string | number, icon: React.ReactNode, color?: string }) {
  return (
    <div className="group p-5 rounded-2xl glass-premium card-hover-lift text-center flex flex-col items-center space-y-2">
      <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60 group-hover:opacity-100 transition-opacity duration-300">
        {icon}
        {label}
      </div>
      <div className={cn("text-xl font-bold tabular-nums", color)}>
        {value}
      </div>
    </div>
  );
}

