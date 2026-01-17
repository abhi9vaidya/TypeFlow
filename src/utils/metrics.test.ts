import { describe, it, expect } from 'vitest';
import { calculateWPM, calculateRawWPM, calculateAccuracy, calculateConsistency, getMovingAverage } from './metrics';

describe('metrics utils', () => {
  describe('calculateWPM', () => {
    it('calculates WPM correctly', () => {
      // 100 correct chars in 60 seconds = 20 WPM
      expect(calculateWPM(100, 60)).toBe(20);
    });

    it('returns 0 if time is 0', () => {
      expect(calculateWPM(100, 0)).toBe(0);
    });
  });

  describe('calculateRawWPM', () => {
    it('calculates raw WPM correctly', () => {
      // 150 total chars in 60 seconds = 30 raw WPM
      expect(calculateRawWPM(150, 60)).toBe(30);
    });
  });

  describe('calculateAccuracy', () => {
    it('calculates accuracy correctly', () => {
      expect(calculateAccuracy(90, 5, 5)).toBe(90); // 90 / (90+5+5) = 90%
    });

    it('returns 100 if no characters were typed', () => {
      expect(calculateAccuracy(0, 0, 0)).toBe(100);
    });
  });

  describe('calculateConsistency', () => {
    it('returns 100 for a single sample', () => {
      expect(calculateConsistency([100])).toBe(100);
    });

    it('calculates consistency correctly for stable typing', () => {
      // Very stable: 100, 100, 100
      expect(calculateConsistency([100, 100, 100])).toBe(100);
    });

    it('calculates consistency correctly for variable typing', () => {
      // Less stable
      const consistency = calculateConsistency([100, 50, 150]);
      expect(consistency).toBeLessThan(100);
    });
  });

  describe('getMovingAverage', () => {
    it('returns original samples if count is less than window size', () => {
      const samples = [
        { t: 1, wpm: 100, errors: 0 },
        { t: 2, wpm: 110, errors: 1 }
      ];
      expect(getMovingAverage(samples, 5)).toEqual(samples);
    });

    it('calculates moving average correctly', () => {
      const samples = [
        { t: 1, wpm: 100, errors: 0 },
        { t: 2, wpm: 110, errors: 0 },
        { t: 3, wpm: 120, errors: 0 }
      ];
      const result = getMovingAverage(samples, 2);
      expect(result[1].wpm).toBe(105); // (100 + 110) / 2
      expect(result[2].wpm).toBe(115); // (110 + 120) / 2
    });
  });
});
