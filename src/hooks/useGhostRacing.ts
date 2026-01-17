import { useMemo } from 'react';
import { useTypingStore } from '@/store/useTypingStore';
import { useSettingsStore } from '@/store/useSettingsStore';
import { LiveSample } from '@/utils/metrics';

export interface GhostState {
  charIndex: number;
  wordIndex: number;
  wpm: number;
  isActive: boolean;
}

export function useGhostRacing(elapsedTime: number) {
  const { history, mode, duration, wordCount, words } = useTypingStore();
  const { showGhost } = useSettingsStore();

  const pbResult = useMemo(() => {
    if (!showGhost || history.length === 0) return null;

    // Find the PB for current configuration
    const filtered = history.filter(h => 
      h.mode === mode && 
      (mode === 'time' ? h.duration === duration : true) &&
      (mode === 'words' ? h.wordCount === wordCount : true)
    );

    if (filtered.length === 0) return null;

    return filtered.reduce((prev, current) => (prev.wpm > current.wpm) ? prev : current);
  }, [history, mode, duration, wordCount, showGhost]);

  const ghostProgress = useMemo((): GhostState => {
    if (!pbResult || !pbResult.samples || pbResult.samples.length === 0) {
      return { charIndex: 0, wordIndex: 0, wpm: 0, isActive: false };
    }

    const samples = pbResult.samples;
    // Find the sample closest to current elapsed time
    let currentSample: LiveSample | null = null;
    
    for (let i = 0; i < samples.length; i++) {
        if (samples[i].t <= elapsedTime) {
            currentSample = samples[i];
        } else {
            // Interpolate between samples[i-1] and samples[i] if we want to be smooth
            // For now, let's just take the last passed sample for simplicity
            break;
        }
    }

    if (!currentSample) {
        return { charIndex: 0, wordIndex: 0, wpm: 0, isActive: true };
    }

    // Calculate characters typed at this WPM and time
    // Chars = (WPM * time * 5) / 60 = (WPM * time) / 12
    const totalChars = (currentSample.wpm * currentSample.t) / 12;
    
    // Convert totalChars to wordIndex and charIndex based on the CURRENT test words
    // Note: The words might be different from the PB, but we want to show where 
    // the ghost WOULD be in terms of progress.
    let remainingChars = Math.floor(totalChars);
    let wordIdx = 0;
    let charIdx = 0;

    while (wordIdx < words.length && remainingChars >= words[wordIdx].length + 1) {
        remainingChars -= (words[wordIdx].length + 1); // +1 for space
        wordIdx++;
    }
    charIdx = remainingChars;

    return {
      charIndex: charIdx,
      wordIndex: wordIdx,
      wpm: currentSample.wpm,
      isActive: true
    };
  }, [pbResult, elapsedTime, words]);

  return ghostProgress;
}
