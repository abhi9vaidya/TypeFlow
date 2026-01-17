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
    if (samples.length === 0) return { charIndex: 0, wordIndex: 0, wpm: 0, isActive: true };

    // Find the two samples surrounding the current time for interpolation
    let prevSample = samples[0];
    let nextSample = samples[samples.length - 1];
    
    // If we are before the first sample (0-1 second)
    if (elapsedTime < samples[0].t) {
        prevSample = { t: 0, wpm: 0, errors: 0 };
        nextSample = samples[0];
    } else {
        // Find the specific window
        for (let i = 0; i < samples.length - 1; i++) {
            if (samples[i].t <= elapsedTime && samples[i+1].t > elapsedTime) {
                prevSample = samples[i];
                nextSample = samples[i+1];
                break;
            }
        }
        
        // If we are past the last sample
        if (elapsedTime >= samples[samples.length - 1].t) {
            prevSample = samples[samples.length - 1];
            nextSample = samples[samples.length - 1]; // No interpolation, just hold
        }
    }

    // Calculate exact char count for prev and next points
    // Formula: chars = (WPM * time) / 12
    const prevChars = (prevSample.wpm * prevSample.t) / 12;
    const nextChars = (nextSample.wpm * nextSample.t) / 12;

    // Interpolate
    let totalChars = prevChars;
    
    if (nextSample.t > prevSample.t) {
        const progress = (elapsedTime - prevSample.t) / (nextSample.t - prevSample.t);
        totalChars = prevChars + (nextChars - prevChars) * progress;
    }

    // Current WPM to display (also interpolated for smoothness)
    // Avoid division by zero
    const currentWpmDisplay = Math.round(
      prevSample.wpm + (nextSample.wpm - prevSample.wpm) * 
      (nextSample.t > prevSample.t ? (elapsedTime - prevSample.t) / (nextSample.t - prevSample.t) : 0)
    );
    
    // specific word logic
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
      wpm: currentWpmDisplay,
      isActive: true
    };
  }, [pbResult, elapsedTime, words]);

  return ghostProgress;
}
