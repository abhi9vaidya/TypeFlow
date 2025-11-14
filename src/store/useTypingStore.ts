// Build: 20251114
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { TestResult, LiveSample, CharStats } from '@/utils/metrics';

interface TypingState {
  // Test config
  mode: 'time' | 'words' | 'quote' | 'zen';
  testMode: 'time' | 'words' | 'quote' | 'zen';
  duration: 15 | 30 | 60 | 120;
  wordCount: 10 | 25 | 50 | 100;
  
  // Test state
  isRunning: boolean;
  isFinished: boolean;
  startTime: number | null;
  endTime: number | null;
  
  // Typing data
  words: string[];
  currentWordIndex: number;
  currentCharIndex: number;
  typedChars: string[][];
  correctChars: number;
  incorrectChars: number;
  extraChars: number;
  currentStreak: number;
  maxStreak: number;
  
  // Live metrics
  samples: LiveSample[];
  lastSampleTime: number;
  
  // History
  history: TestResult[];
  currentResult: TestResult | null;
  
  // Actions
  setMode: (mode: 'time' | 'words' | 'quote' | 'zen') => void;
  setTestMode: (mode: 'time' | 'words' | 'quote' | 'zen') => void;
  setDuration: (duration: 15 | 30 | 60 | 120) => void;
  setWordCount: (count: 10 | 25 | 50 | 100) => void;
  setWords: (words: string[]) => void;
  startTest: () => void;
  stopTest: () => void;
  resetTest: () => void;
  typeChar: (char: string) => void;
  deleteChar: () => void;
  nextWord: () => void;
  addSample: (sample: LiveSample) => void;
  finishTest: (result: TestResult) => void;
  clearHistory: () => void;
}

export const useTypingStore = create<TypingState>()(
  persist(
    (set, get) => ({
      // Initial state
      mode: 'time',
      testMode: 'time',
      duration: 30,
      wordCount: 25,
      isRunning: false,
      isFinished: false,
      startTime: null,
      endTime: null,
      words: [],
      currentWordIndex: 0,
      currentCharIndex: 0,
      typedChars: [],
      correctChars: 0,
      incorrectChars: 0,
      extraChars: 0,
      currentStreak: 0,
      maxStreak: 0,
      samples: [],
      lastSampleTime: 0,
      history: [],
      currentResult: null,

      // Actions
      setMode: (mode) => set({ mode }),
      
      setTestMode: (testMode) => set({ testMode }),
      
      setDuration: (duration) => set({ duration }),
      
      setWordCount: (wordCount) => set({ wordCount }),
      
      setWords: (words) => set({ 
        words,
        typedChars: words.map(() => []),
      }),
      
      startTest: () => set({ 
        isRunning: true,
        isFinished: false,
        startTime: Date.now(),
        samples: [],
        lastSampleTime: Date.now(),
      }),
      
      stopTest: () => set({ 
        isRunning: false,
        endTime: Date.now(),
      }),
      
      resetTest: () => {
        const { mode, duration, words } = get();
        set({
          isRunning: false,
          isFinished: false,
          startTime: null,
          endTime: null,
          currentWordIndex: 0,
          currentCharIndex: 0,
          typedChars: words.map(() => []),
          correctChars: 0,
          incorrectChars: 0,
          extraChars: 0,
          currentStreak: 0,
          maxStreak: 0,
          samples: [],
          lastSampleTime: 0,
          currentResult: null,
        });
      },
      
      typeChar: (char) => {
        const state = get();
        if (!state.isRunning || state.isFinished) return;
        
        const word = state.words[state.currentWordIndex];
        const typed = [...state.typedChars[state.currentWordIndex], char];
        const newTypedChars = [...state.typedChars];
        newTypedChars[state.currentWordIndex] = typed;
        
        let correct = state.correctChars;
        let incorrect = state.incorrectChars;
        let extra = state.extraChars;
        
        if (state.currentCharIndex < word.length) {
          if (char === word[state.currentCharIndex]) {
            correct++;
          } else {
            incorrect++;
          }
        } else {
          extra++;
        }
        
        set({
          typedChars: newTypedChars,
          currentCharIndex: state.currentCharIndex + 1,
          correctChars: correct,
          incorrectChars: incorrect,
          extraChars: extra,
        });
      },
      
      deleteChar: () => {
        const state = get();
        if (!state.isRunning || state.currentCharIndex === 0) return;
        
        const typed = state.typedChars[state.currentWordIndex].slice(0, -1);
        const newTypedChars = [...state.typedChars];
        newTypedChars[state.currentWordIndex] = typed;
        
        const word = state.words[state.currentWordIndex];
        const lastCharIndex = state.currentCharIndex - 1;
        const lastChar = state.typedChars[state.currentWordIndex][lastCharIndex];
        
        let correct = state.correctChars;
        let incorrect = state.incorrectChars;
        let extra = state.extraChars;
        
        if (lastCharIndex < word.length) {
          if (lastChar === word[lastCharIndex]) {
            correct--;
          } else {
            incorrect--;
          }
        } else {
          extra--;
        }
        
        set({
          typedChars: newTypedChars,
          currentCharIndex: state.currentCharIndex - 1,
          correctChars: correct,
          incorrectChars: incorrect,
          extraChars: extra,
        });
      },
      
      nextWord: () => {
        const state = get();
        if (state.currentWordIndex < state.words.length - 1) {
          // Check if current word was typed correctly (no errors)
          const currentWord = state.words[state.currentWordIndex];
          const typedWord = state.typedChars[state.currentWordIndex];
          const isWordCorrect = 
            typedWord.length === currentWord.length &&
            typedWord.every((char, idx) => char === currentWord[idx]);
          
          const newStreak = isWordCorrect ? state.currentStreak + 1 : 0;
          const newMaxStreak = Math.max(newStreak, state.maxStreak);
          
          set({
            currentWordIndex: state.currentWordIndex + 1,
            currentCharIndex: 0,
            currentStreak: newStreak,
            maxStreak: newMaxStreak,
          });
        }
      },
      
      addSample: (sample) => set((state) => ({
        samples: [...state.samples, sample],
        lastSampleTime: Date.now(),
      })),
      
      finishTest: (result) => {
        const state = get();
        
        // Check if it's a personal best
        const existingPBs = state.history
          .filter(r => r.mode === result.mode && r.duration === result.duration)
          .sort((a, b) => b.wpm - a.wpm);
        
        const isPB = existingPBs.length === 0 || result.wpm > existingPBs[0].wpm;
        
        const finalResult = { ...result, isPB };
        
        set({
          isRunning: false,
          isFinished: true,
          endTime: Date.now(),
          currentResult: finalResult,
          history: [finalResult, ...state.history],
        });
      },
      
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'typing-storage',
      partialize: (state) => ({
        mode: state.mode,
        testMode: state.testMode,
        duration: state.duration,
        wordCount: state.wordCount,
        history: state.history,
      }),
    }
  )
);

