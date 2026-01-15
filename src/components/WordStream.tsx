import { useEffect, useRef, memo } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore, FontFamily } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const FONT_CLASSES: Record<FontFamily, string> = {
  "jetbrains": "font-jetbrains",
  "roboto-mono": "font-roboto-mono",
  "fira-code": "font-fira-code",
  "space-mono": "font-space-mono",
  "vt323": "font-vt323",
  "lexend": "font-lexend",
};

interface WordProps {
  word: string;
  wordIdx: number;
  typed: string[];
  isCurrent: boolean;
  isPast: boolean;
  isFuture: boolean;
  blurUnusedWords: boolean;
  showCharacterGlow: boolean;
  activeCharIndex: number;
}

const Word = memo(({
  word,
  wordIdx,
  typed,
  isCurrent,
  isPast,
  isFuture,
  blurUnusedWords,
  showCharacterGlow,
  activeCharIndex
}: WordProps) => {
  return (
    <div
      data-word-index={wordIdx}
      className={cn(
        "relative transition-all duration-175 will-change-opacity",
        isFuture && !blurUnusedWords && "opacity-35",
        isFuture && blurUnusedWords && "opacity-20 blur-[2px]",
        isPast && "opacity-40",
        isCurrent && "opacity-100 font-medium"
      )}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.4, 0.25, 0.46, 0.88)'
      }}
    >
      {word.split("").map((char, charIdx) => {
        const typedChar = typed[charIdx];
        const isCorrect = typedChar === char;
        const isIncorrect = typedChar !== undefined && !isCorrect;
        const isTyped = typedChar !== undefined;
        // activeCharIndex is -1 if not current word, so this is safe
        const isCurrentChar = isCurrent && charIdx === activeCharIndex;

        return (
          <span
            key={charIdx}
            data-char-index={charIdx}
            className={cn(
              "relative inline-block transition-all duration-125 will-change-colors",
              isCorrect && showCharacterGlow && "text-primary font-medium drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]",
              isCorrect && !showCharacterGlow && "text-primary/90 font-medium",
              isIncorrect && "text-destructive/90 animate-shake font-medium",
              !isTyped && isCurrent && "text-foreground/70",
              !isTyped && isFuture && "text-muted-foreground/40",
              !isTyped && !isCurrent && "text-muted-foreground/35",
              isCurrentChar && "relative"
            )}
            style={{
              transitionTimingFunction: 'cubic-bezier(0.4, 0.25, 0.46, 0.88)'
            }}
          >
            {char}
            {/* Subtle glow on correct chars */}
            {isCorrect && isCurrent && showCharacterGlow && (
              <span className="absolute inset-0 bg-primary/30 blur-sm animate-pulse-glow pointer-events-none" />
            )}
            {isIncorrect && (
              <>
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-destructive/80 rounded-full animate-pulse pointer-events-none" />
                <span className="absolute -top-2 -right-1 text-[8px] text-destructive/70 pointer-events-none">✕</span>
              </>
            )}
          </span>
        );
      })}

      {/* Extra characters */}
      {typed.length > word.length &&
        typed.slice(word.length).map((char, idx) => (
          <span
            key={`extra-${idx}`}
            data-char-index={word.length + idx}
            className="text-destructive/80 font-medium"
          >
            {char}
          </span>
        ))}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to ensure strict performance
  return (
    prevProps.isCurrent === nextProps.isCurrent &&
    prevProps.isPast === nextProps.isPast &&
    prevProps.isFuture === nextProps.isFuture &&
    prevProps.activeCharIndex === nextProps.activeCharIndex &&
    prevProps.blurUnusedWords === nextProps.blurUnusedWords &&
    prevProps.showCharacterGlow === nextProps.showCharacterGlow &&
    prevProps.word === nextProps.word &&
    // Shallow compare typed array is usually enough if reference changes, 
    // but deeper check avoids re-render if array content is same but ref diff (though zustand usually handles this well).
    // For now, strict equality on reference is fastest.
    prevProps.typed === nextProps.typed
  );
});
Word.displayName = 'MemoizedWord';

import { useShallow } from "zustand/react/shallow";

// ... existing imports

export function WordStream() {
  const { words, currentWordIndex, currentCharIndex, typedChars } = useTypingStore(
    useShallow((state) => ({
      words: state.words,
      currentWordIndex: state.currentWordIndex,
      currentCharIndex: state.currentCharIndex,
      typedChars: state.typedChars,
    }))
  );

  const {
    caretStyle,
    blurUnusedWords,
    showCharacterGlow,
    fontFamily,
    fontSize
  } = useSettingsStore(
    useShallow((state) => ({
      caretStyle: state.caretStyle,
      blurUnusedWords: state.blurUnusedWords,
      showCharacterGlow: state.showCharacterGlow,
      fontFamily: state.fontFamily,
      fontSize: state.fontSize,
    }))
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const containerStyleRef = useRef<{ paddingLeft: number; paddingTop: number } | null>(null);

  // Motion values for smooth caret
  const caretX = useMotionValue(0);
  const caretY = useMotionValue(0);

  // Spring physics for "gliding" feel
  const springConfig = { stiffness: 500, damping: 28, mass: 0.5 };
  const springX = useSpring(caretX, springConfig);
  const springY = useSpring(caretY, springConfig);

  // Cache container styles on mount/resize
  useEffect(() => {
    if (!containerRef.current) return;

    const updateContainerMetrics = () => {
      if (!containerRef.current) return;
      const computedStyle = window.getComputedStyle(containerRef.current);
      containerStyleRef.current = {
        paddingLeft: parseFloat(computedStyle.paddingLeft),
        paddingTop: parseFloat(computedStyle.paddingTop)
      };
    };

    updateContainerMetrics();
    window.addEventListener('resize', updateContainerMetrics);
    return () => window.removeEventListener('resize', updateContainerMetrics);
  }, []);

  // Update caret position with optimized performance
  useEffect(() => {
    if (!containerRef.current) return;

    // Use requestAnimationFrame to ensure DOM is ready
    const updateCaret = () => {
      const wordElement = containerRef.current?.querySelector(
        `[data-word-index="${currentWordIndex}"]`
      );

      if (!wordElement) return;

      const charElement = wordElement.querySelector(
        `[data-char-index="${currentCharIndex}"]`
      ) as HTMLElement;

      if (charElement) {
        const rect = charElement.getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();

        // Use cached styles or fallback
        const paddingLeft = containerStyleRef.current?.paddingLeft ?? 0;
        const paddingTop = containerStyleRef.current?.paddingTop ?? 0;

        // Calculate position relative to container's content area (after padding)
        const x = rect.left - containerRect.left - paddingLeft;
        const y = rect.top - containerRect.top - paddingTop;

        // Update motion values instead of direct DOM manipulation
        caretX.set(x);
        caretY.set(y);
      }
    };

    const rafId = requestAnimationFrame(updateCaret);
    return () => cancelAnimationFrame(rafId);
  }, [currentWordIndex, currentCharIndex, caretX, caretY]);

  return (
    <div
      ref={containerRef}
      style={{ fontSize: `${window.innerWidth < 640 ? Math.min(fontSize, 20) : fontSize}px` }}
      className={cn(
        "relative max-w-5xl mx-auto p-4 md:p-8 typing-text leading-relaxed select-none",
        "glass-premium rounded-2xl shadow-xl shadow-primary/5",
        "border-gradient animate-border-glow",
        "transition-all duration-500",
        FONT_CLASSES[fontFamily]
      )}
    >
      {/* Enhanced Caret with different styles */}
      <motion.div
        id="active-caret"
        className={cn(
          "absolute transition-colors duration-150 animate-caret-pulse",
          caretStyle === "line" && "bg-gradient-to-b from-primary via-primary to-primary/60 rounded-full",
          caretStyle === "block" && "bg-primary/40 border-2 border-primary rounded-sm",
          caretStyle === "underline" && "bg-primary rounded-full"
        )}
        style={{
          x: springX,
          y: springY,
          ...(caretStyle === "line"
            ? {
              width: '3px',
              height: '1.2em',
              boxShadow: '0 0 12px hsl(var(--primary) / 0.8), 0 0 24px hsl(var(--primary) / 0.4)',
              filter: 'drop-shadow(0 0 8px hsl(var(--primary) / 0.6))',
            }
            : caretStyle === "block"
              ? {
                width: '0.6em',
                height: '1.2em',
                boxShadow: '0 0 8px hsl(var(--primary) / 0.6)',
              }
              : {
                width: '0.6em',
                height: '0.15em',
                marginTop: '1.1em',
                boxShadow: '0 0 8px hsl(var(--primary) / 0.8)',
              }),
        }}
      />

      {/* Words with improved wrapping and performance */}
      <div className="flex flex-wrap gap-x-4 gap-y-3">
        {words.map((word, wordIdx) => {
          const isCurrent = wordIdx === currentWordIndex;

          return (
            <Word
              key={wordIdx}
              word={word}
              wordIdx={wordIdx}
              typed={typedChars[wordIdx] || []}
              isCurrent={isCurrent}
              isPast={wordIdx < currentWordIndex}
              isFuture={wordIdx > currentWordIndex}
              blurUnusedWords={blurUnusedWords}
              showCharacterGlow={showCharacterGlow}
              // Only pass the changing char index to the current word.
              // For all other words, this stays -1, preventing re-renders on keystrokes.
              activeCharIndex={isCurrent ? currentCharIndex : -1}
            />
          );
        })}
      </div>

      {/* Keyboard Shortcuts Tooltip */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground/40 hover:text-muted-foreground/60 transition-colors">
              <Info className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-panel border-border/50">
            <div className="text-xs space-y-1">
              <p><kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground">Tab</kbd> - Restart test</p>
              <p><kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground">Esc</kbd> - Settings</p>
              <p><kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground">Space</kbd> - Next word</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

