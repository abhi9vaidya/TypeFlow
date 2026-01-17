// Build: 20251114
export interface CharStats {
  correct: number;
  incorrect: number;
  fixed: number;
  extra: number;
}

export interface LiveSample {
  t: number; // seconds since start
  wpm: number;
  errors: number;
}

export interface TestResult {
  id: string;
  mode: "time" | "words" | "quote" | "zen";
  duration: number;
  wordCount?: number;
  timestamp: string;
  wpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  chars: CharStats;
  samples: LiveSample[];
  isPB: boolean;
}

export function calculateWPM(correctChars: number, timeSeconds: number): number {
  if (timeSeconds === 0) return 0;
  const words = correctChars / 5;
  const minutes = timeSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateRawWPM(totalChars: number, timeSeconds: number): number {
  if (timeSeconds === 0) return 0;
  const words = totalChars / 5;
  const minutes = timeSeconds / 60;
  return Math.round(words / minutes);
}

export function calculateAccuracy(correct: number, incorrect: number, extra: number): number {
  const total = correct + incorrect + extra;
  if (total === 0) return 100;
  return Math.round((correct / total) * 100);
}

export function calculateConsistency(wpmSamples: number[]): number {
  if (wpmSamples.length < 2) return 100;
  
  const mean = wpmSamples.reduce((a, b) => a + b, 0) / wpmSamples.length;
  const variance = wpmSamples.reduce((sum, wpm) => sum + Math.pow(wpm - mean, 2), 0) / wpmSamples.length;
  const stdDev = Math.sqrt(variance);
  
  const consistency = 100 - (stdDev / mean) * 100;
  return Math.max(0, Math.min(100, Math.round(consistency)));
}

export function getMovingAverage(samples: LiveSample[], windowSize: number = 5): LiveSample[] {
  if (samples.length < windowSize) return samples;
  
  return samples.map((sample, i) => {
    const start = Math.max(0, i - windowSize + 1);
    const window = samples.slice(start, i + 1);
    const avgWpm = window.reduce((sum, s) => sum + s.wpm, 0) / window.length;
    
    return {
      t: sample.t,
      wpm: Math.round(avgWpm),
      errors: sample.errors,
    };
  });
}

