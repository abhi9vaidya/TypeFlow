// Build: 20251114
import { useEffect, useRef } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore, FontFamily } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";

const FONT_CLASSES: Record<FontFamily, string> = {
  "jetbrains": "font-jetbrains",
  "roboto-mono": "font-roboto-mono",
  "fira-code": "font-fira-code",
  "space-mono": "font-space-mono",
  "vt323": "font-vt323",
  "lexend": "font-lexend",
};

export function WordStream() {
  const { words, currentWordIndex, currentCharIndex, typedChars } = useTypingStore();
  const { 
    caretStyle, 
    blurUnusedWords, 
    showCharacterGlow, 
    fontFamily, 
    fontSize 
  } = useSettingsStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLDivElement>(null);

  // Update caret position with optimized performance
  useEffect(() => {
    if (!caretRef.current || !containerRef.current) return;

    const wordElement = containerRef.current.querySelector(
      `[data-word-index="${currentWordIndex}"]`
    );
    
    if (!wordElement) return;

    const charElement = wordElement.querySelector(
      `[data-char-index="${currentCharIndex}"]`
    ) as HTMLElement;

    if (charElement) {
      const rect = charElement.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(containerRef.current);
      const paddingLeft = parseFloat(computedStyle.paddingLeft);
      const paddingTop = parseFloat(computedStyle.paddingTop);
      
      // Calculate position relative to container's content area (after padding)
      const x = rect.left - containerRect.left - paddingLeft;
      const y = rect.top - containerRect.top - paddingTop;
      
      // Apply full position transformation
      caretRef.current.style.transform = `translate(${x}px, ${y}px)`;
      caretRef.current.style.willChange = 'transform';
    }
  }, [currentWordIndex, currentCharIndex]);

  return (
    <div
      ref={containerRef}
      style={{ fontSize: `${fontSize}px` }}
      className={cn(
        "relative max-w-5xl mx-auto p-8 typing-text leading-relaxed select-none bg-gradient-subtle rounded-xl border border-border/30 shadow-lg transition-all duration-300",
        FONT_CLASSES[fontFamily]
      )}
    >
      {/* Enhanced Caret with different styles */}
      <div
        ref={caretRef}
        className={cn(
          "absolute transition-transform duration-150 cubic-bezier-smooth animate-caret-pulse",
          caretStyle === "line" && "bg-gradient-to-b from-primary via-primary to-primary/60 rounded-full",
          caretStyle === "block" && "bg-primary/40 border-2 border-primary rounded-sm",
          caretStyle === "underline" && "bg-primary rounded-full"
        )}
        style={{
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
          willChange: 'transform',
          transitionTimingFunction: 'cubic-bezier(0.4, 0.25, 0.46, 0.88)'
        }}
      />

      {/* Words with improved wrapping and performance */}
      <div className="flex flex-wrap gap-x-4 gap-y-3">
        {words.map((word, wordIdx) => {
          const typed = typedChars[wordIdx] || [];
          const isCurrentWord = wordIdx === currentWordIndex;
          const isPastWord = wordIdx < currentWordIndex;
          const isFutureWord = wordIdx > currentWordIndex;

          return (
            <div
              key={wordIdx}
              data-word-index={wordIdx}
              className={cn(
                "relative transition-all duration-175 will-change-opacity",
                isFutureWord && !blurUnusedWords && "opacity-35",
                isFutureWord && blurUnusedWords && "opacity-20 blur-[2px]",
                isPastWord && "opacity-40",
                isCurrentWord && "opacity-100 font-medium"
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
                const isCurrentChar = isCurrentWord && charIdx === currentCharIndex;

                return (
                  <span
                    key={charIdx}
                    data-char-index={charIdx}
                    className={cn(
                      "relative inline-block transition-all duration-125 will-change-colors",
                      isCorrect && showCharacterGlow && "text-primary font-medium drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]",
                      isCorrect && !showCharacterGlow && "text-primary/90 font-medium",
                      isIncorrect && "text-destructive/90 animate-shake font-medium",
                      !isTyped && isCurrentWord && "text-foreground/70",
                      !isTyped && isFutureWord && "text-muted-foreground/40",
                      !isTyped && !isCurrentWord && "text-muted-foreground/35",
                      isCurrentChar && "relative"
                    )}
                    style={{
                      transitionTimingFunction: 'cubic-bezier(0.4, 0.25, 0.46, 0.88)'
                    }}
                  >
                    {char}
                    {/* Subtle glow on correct chars */}
                    {isCorrect && isCurrentWord && showCharacterGlow && (
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
        })}
      </div>
    </div>
  );
}

