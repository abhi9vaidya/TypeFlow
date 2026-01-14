// Build: 20251114
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { generateWords } from "@/utils/words";
import { getRandomQuote, quoteToWords } from "@/utils/quotes";
import { Clock, FileText, Quote, Infinity } from "lucide-react";

type TestMode = "time" | "words" | "quote" | "zen";

interface ModeOption {
  value: number;
  label: string;
}

const modes = [
  { id: "time" as TestMode, label: "Time", icon: Clock },
  { id: "words" as TestMode, label: "Words", icon: FileText },
  { id: "quote" as TestMode, label: "Quote", icon: Quote },
  { id: "zen" as TestMode, label: "Zen", icon: Infinity },
];

const timeModes: ModeOption[] = [
  { value: 15, label: "15" },
  { value: 30, label: "30" },
  { value: 60, label: "60" },
  { value: 120, label: "120" }
];

const wordModes: ModeOption[] = [
  { value: 10, label: "10" },
  { value: 25, label: "25" },
  { value: 50, label: "50" },
  { value: 100, label: "100" }
];

const timeOptions = [15, 30, 60, 120];
const wordOptions = [10, 25, 50, 100];

export function ModeSelector() {
  const { 
    mode, 
    duration, 
    wordCount,
    testMode,
    setMode, 
    setDuration,
    setWordCount,
    setTestMode,
    setWords,
    resetTest,
    isRunning 
  } = useTypingStore();

  const {
    includePunctuation,
    includeNumbers,
  } = useSettingsStore();

  const handleModeChange = (newMode: TestMode) => {
    if (isRunning) return;
    
    console.log("Mode changing to:", newMode);
    
    // Set both testMode and mode to keep them in sync
    setTestMode(newMode);
    setMode(newMode);
    
    const wordOptions = { includePunctuation, includeNumbers };
    
    // Generate appropriate words based on mode
    let newWords: string[];
    if (newMode === "time") {
      newWords = generateWords(100, wordOptions);
    } else if (newMode === "words") {
      const count = wordCount || 25;
      newWords = generateWords(count, wordOptions);
      console.log("Words mode selected with count:", count);
    } else if (newMode === "quote") {
      const quote = getRandomQuote();
      newWords = quoteToWords(quote);
    } else { // zen
      newWords = generateWords(200, wordOptions);
    }
    
    setWords(newWords);
    resetTest();
  };

  const handleTimeChange = (time: number) => {
    if (isRunning) return;
    console.log("Time duration changing to:", time);
    setDuration(time as 15 | 30 | 60 | 120);
    const wordOptions = { includePunctuation, includeNumbers };
    const newWords = generateWords(100, wordOptions);
    setWords(newWords);
    resetTest();
  };

  const handleWordCountChange = (count: number) => {
    if (isRunning) return;
    console.log("Word count changing to:", count);
    setWordCount(count as 10 | 25 | 50 | 100);
    const wordOptions = { includePunctuation, includeNumbers };
    const newWords = generateWords(count, wordOptions);
    setWords(newWords);
    resetTest();
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 animate-fade-in-down px-2">
      {/* Mode Selector */}
      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-panel/50 backdrop-blur-lg rounded-xl border border-border/40 shadow-lg">
        {modes.map((m) => (
          <button
            key={m.id}
            onClick={() => handleModeChange(m.id)}
            disabled={isRunning}
            className={cn(
              "flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 group touch-manipulation min-h-[44px]",
              "hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed",
              testMode === m.id
                ? "bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground shadow-lg shadow-primary/20 scale-100"
                : "text-muted-foreground hover:text-foreground/80"
            )}
          >
            <m.icon className={cn(
              "h-4 w-4 sm:h-5 sm:w-5 transition-transform duration-200",
              testMode === m.id && "group-hover:scale-110"
            )} />
            <span className="hidden sm:inline">{m.label}</span>
          </button>
        ))}
      </div>

      {/* Options Selector */}
      {testMode === "time" && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-panel/50 backdrop-blur-lg rounded-xl border border-border/40 shadow-lg animate-scale-in">
          {timeOptions.map((t) => (
            <button
              key={t}
              onClick={() => handleTimeChange(t)}
              disabled={isRunning}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-w-[48px] sm:min-w-[56px] min-h-[44px] touch-manipulation",
                "hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed",
                duration === t
                  ? "bg-gradient-to-r from-secondary/90 to-secondary/70 text-secondary-foreground shadow-lg shadow-secondary/20"
                  : "text-muted-foreground hover:text-foreground/80 hover:bg-muted/20"
              )}
            >
              {t}s
            </button>
          ))}
        </div>
      )}

      {testMode === "words" && (
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-panel/50 backdrop-blur-lg rounded-xl border border-border/40 shadow-lg animate-scale-in">
          {wordOptions.map((w) => (
            <button
              key={w}
              onClick={() => handleWordCountChange(w)}
              disabled={isRunning}
              className={cn(
                "px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-w-[48px] sm:min-w-[56px] min-h-[44px] touch-manipulation",
                "hover:bg-muted/30 disabled:opacity-50 disabled:cursor-not-allowed",
                wordCount === w
                  ? "bg-gradient-to-r from-secondary/90 to-secondary/70 text-secondary-foreground shadow-lg shadow-secondary/20"
                  : "text-muted-foreground hover:text-foreground/80 hover:bg-muted/20"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

