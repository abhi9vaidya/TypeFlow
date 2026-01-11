// Build: 20251114
import { useEffect, useCallback, useState } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useHeatmapStore } from "@/store/useHeatmapStore";
import { useGoalsStore } from "@/store/useGoalsStore";
import { generateWords } from "@/utils/words";
import { getRandomQuote, quoteToWords } from "@/utils/quotes";
import { soundPlayer } from "@/utils/sounds";
import { applyTheme } from "@/utils/themes";
import { Header } from "@/components/Header";
import { ModeSelector } from "@/components/ModeSelector";
import { WordStream } from "@/components/WordStream";
import { LiveMetrics } from "@/components/LiveMetrics";
import { ResultsCard } from "@/components/ResultsCard";
import { SettingsPanel } from "@/components/SettingsPanel";
import { KeyboardHeatmap } from "@/components/KeyboardHeatmap";
import { StreakCounter } from "@/components/StreakCounter";
import { SpeedZone } from "@/components/SpeedZone";
import { WordCompletionEffect } from "@/components/WordCompletionEffect";
import { toast } from "@/hooks/use-toast";
import {
  calculateWPM,
  calculateRawWPM,
  calculateAccuracy,
  calculateConsistency,
} from "@/utils/metrics";

export default function TypingTest() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const {
    words,
    isRunning,
    isFinished,
    startTime,
    duration,
    currentWordIndex,
    currentCharIndex,
    correctChars,
    incorrectChars,
    extraChars,
    samples,
    currentResult,
    mode,
    testMode,
    wordCount,
    setWords,
    startTest,
    stopTest,
    resetTest,
    typeChar,
    deleteChar,
    nextWord,
    addSample,
    finishTest,
  } = useTypingStore();

  const {
    theme,
    keySoundEnabled,
    errorSoundEnabled,
    includePunctuation,
    includeNumbers,
    showKeyboardHeatmap,
    showPerfectGlow,
  } = useSettingsStore();

  const { recordKeyPress, recordRealtimeKeyPress } = useHeatmapStore();
  const { goals, updateGoalProgress, unlockAchievement, updateStreak, achievements } = useGoalsStore();

  // Helper to check if achievement exists
  const hasAchievement = (title: string) => {
    return achievements.some(a => a.title === title);
  };

  // Apply theme on mount
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // Initialize words on mount based on current mode
  useEffect(() => {
    if (words.length === 0) {
      let newWords: string[];
      const wordOptions = { includePunctuation, includeNumbers };
      
      if (testMode === "quote") {
        const quote = getRandomQuote();
        newWords = quoteToWords(quote);
      } else if (testMode === "words") {
        newWords = generateWords(wordCount || 25, wordOptions);
      } else if (testMode === "zen") {
        newWords = generateWords(200, wordOptions);
      } else {
        newWords = generateWords(100, wordOptions);
      }
      setWords(newWords);
    }
  }, [includePunctuation, includeNumbers]);

  // Handle test timer and sampling
  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const currentSecond = Math.floor(elapsed);

      // Add sample every second
      if (currentSecond > samples.length) {
        const wpm = calculateWPM(correctChars, elapsed);
        const errorsThisSecond = 0;
        
        addSample({
          t: currentSecond,
          wpm,
          errors: errorsThisSecond,
        });
      }

      // Check completion conditions
      const shouldFinish = 
        (testMode === "time" && elapsed >= duration) ||
        (testMode === "words" && currentWordIndex >= words.length - 1 && currentCharIndex >= words[words.length - 1]?.length) ||
        (testMode === "quote" && currentWordIndex >= words.length - 1 && currentCharIndex >= words[words.length - 1]?.length) ||
        (testMode === "zen" && false); // Zen mode never auto-finishes

      if (shouldFinish) {
        stopTest();
        
        const totalChars = correctChars + incorrectChars + extraChars;
        const wpm = calculateWPM(correctChars, elapsed);
        const accuracy = calculateAccuracy(correctChars, incorrectChars, extraChars);
        
        const result = {
          id: Date.now().toString(),
          mode,
          duration: testMode === "time" ? duration : elapsed,
          timestamp: new Date().toISOString(),
          wpm,
          rawWpm: calculateRawWPM(totalChars, elapsed),
          accuracy,
          consistency: calculateConsistency(samples.map(s => s.wpm)),
          chars: {
            correct: correctChars,
            incorrect: incorrectChars,
            fixed: 0,
            extra: extraChars,
          },
          samples,
          isPB: false,
        };
        
        finishTest(result);
        
        // Update streak
        updateStreak();
        
        // Update goals and check achievements
        goals.forEach((goal) => {
          if (goal.period === "daily") {
            if (goal.type === "wpm" && wpm > goal.current) {
              updateGoalProgress(goal.id, wpm);
            } else if (goal.type === "accuracy" && accuracy > goal.current) {
              updateGoalProgress(goal.id, accuracy);
            } else if (goal.type === "tests") {
              updateGoalProgress(goal.id, goal.current + 1);
            }
            
            // Check if goal just completed
            if (!goal.completed && ((goal.type === "wpm" && wpm >= goal.target) || 
                                   (goal.type === "accuracy" && accuracy >= goal.target) ||
                                   (goal.type === "tests" && goal.current + 1 >= goal.target))) {
              toast({
                title: "🎯 Goal Achieved!",
                description: `You've reached your ${goal.period} ${goal.type} goal!`,
              });
            }
          }
        });
        
        // Check for achievements
        if (wpm >= 100 && !hasAchievement("Century Club")) {
          unlockAchievement("Century Club", "Reached 100 WPM", "💯");
          toast({
            title: "🏆 Achievement Unlocked!",
            description: "Century Club - Reached 100 WPM",
          });
        }
        
        if (accuracy >= 100 && !hasAchievement("Perfect!")) {
          unlockAchievement("Perfect!", "100% accuracy on a test", "✨");
          toast({
            title: "🏆 Achievement Unlocked!",
            description: "Perfect! - 100% accuracy",
          });
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning, startTime, duration, correctChars, samples, testMode, currentWordIndex, currentCharIndex, words, goals, updateGoalProgress, updateStreak, unlockAchievement, achievements]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Tab to restart - regenerate words based on current mode
      if (e.key === "Tab") {
        e.preventDefault();
        
        console.log("Tab pressed - Current testMode:", testMode, "wordCount:", wordCount, "duration:", duration);
        
        const wordOptions = { includePunctuation, includeNumbers };
        let newWords: string[];
        if (testMode === "quote") {
          const quote = getRandomQuote();
          newWords = quoteToWords(quote);
          console.log("Generating quote with", newWords.length, "words");
        } else if (testMode === "words") {
          newWords = generateWords(wordCount || 25, wordOptions);
          console.log("Generating", wordCount || 25, "words for words mode");
        } else if (testMode === "zen") {
          newWords = generateWords(200, wordOptions);
          console.log("Generating 200 words for zen mode");
        } else {
          // time mode
          newWords = generateWords(100, wordOptions);
          console.log("Generating 100 words for time mode");
        }
        
        setWords(newWords);
        resetTest();
        return;
      }

      if (isFinished) return;

      // Escape to toggle settings
      if (e.key === "Escape") {
        e.preventDefault();
        // Debug log to help diagnose why Escape may not be opening the panel
        try {
          // eslint-disable-next-line no-console
          console.log("handleKeyDown: Escape pressed — toggling settings (bubbling)", { isSettingsOpen });
        } catch {}
        setIsSettingsOpen(prev => !prev);
        return;
      }

      // Start test on first keypress and handle the character
      const shouldStartTest = !isRunning && e.key.length === 1 && !e.ctrlKey && !e.metaKey;
      if (shouldStartTest) {
        startTest();
      }

      // Allow typing to continue for the first character
      if (!isRunning && !shouldStartTest) return;

      // Backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        deleteChar();
        return;
      }

      // Space for next word
      if (e.key === " ") {
        e.preventDefault();
        if (currentWordIndex < words.length - 1) {
          nextWord();
        }
        return;
      }

      // Type character (including first character when starting)
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        
        const expectedChar = words[currentWordIndex]?.[currentCharIndex];
        const isCorrect = e.key === expectedChar;
        
        typeChar(e.key);
        
        // Record key press for heatmap with accuracy
        recordRealtimeKeyPress(e.key);
        recordKeyPress(e.key, isCorrect);
        
        // Play sounds
        if (keySoundEnabled) {
          soundPlayer.playKeyClick();
        }
        if (!isCorrect && errorSoundEnabled) {
          soundPlayer.playErrorSound();
        }
      }
    },
    [isRunning, isFinished, currentWordIndex, words, testMode, wordCount, includePunctuation, includeNumbers, setWords, resetTest, typeChar, deleteChar, nextWord, keySoundEnabled, errorSoundEnabled, currentCharIndex, recordKeyPress, recordRealtimeKeyPress]
  );

  useEffect(() => {
    // Primary handler (bubbling phase)
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle Escape key to open/close settings (when not in finished state)
  useEffect(() => {
    const handleEscapeGlobal = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isFinished) {
        e.preventDefault();
        e.stopPropagation();
        setIsSettingsOpen((prev) => !prev);
      }
    };

    // Use capture phase to ensure we catch Escape even if another component tries to stop propagation
    document.addEventListener("keydown", handleEscapeGlobal, true);
    return () => {
      document.removeEventListener("keydown", handleEscapeGlobal, true);
    };
  }, [isFinished]);

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      
      {/* Floating indicators */}
      <StreakCounter />
      <SpeedZone />
      <WordCompletionEffect />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        {!isFinished ? (
          <>
            {!isRunning && (
              <div className="mb-12 animate-fade-in-down">
                <ModeSelector />
              </div>
            )}
            
            {isRunning && testMode !== "zen" && <LiveMetrics />}
            
            <div className="max-w-5xl mx-auto mt-12 relative group">
              <WordStream />
              
              {/* Ambient glow effect when typing perfectly */}
              {isRunning && showPerfectGlow && (
                <div 
                  className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg transition-opacity duration-1000"
                  style={{
                    opacity: correctChars > 20 && incorrectChars === 0 ? 0.4 : 0
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-radial from-primary/40 via-primary/10 to-transparent animate-pulse-glow" />
                </div>
              )}
            </div>

            {!isRunning && (
              <div className="text-center mt-20 space-y-6 animate-fade-in-up">
                <div className="space-y-2">
                  <p className="text-lg font-medium text-foreground/90">
                    Ready to type?
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Press any key to begin your test
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground pt-2">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-panel/50 border border-border/30">
                    <kbd className="px-2 py-1 rounded bg-background border border-border/50 font-mono text-xs font-semibold">Tab</kbd>
                    <span>Restart</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-panel/50 border border-border/30">
                    <kbd className="px-2 py-1 rounded bg-background border border-border/50 font-mono text-xs font-semibold">Esc</kbd>
                    <span>Settings</span>
                  </div>
                </div>
              </div>
            )}

            {showKeyboardHeatmap && (
              <div className="mt-16 animate-fade-in-up">
                <KeyboardHeatmap />
              </div>
            )}
          </>
        ) : (
          currentResult && <ResultsCard result={currentResult} />
        )}
      </main>
    </div>
  );
}

