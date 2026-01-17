import { describe, it, expect } from 'vitest';
import { checkAchievements } from './achievements';
import { TestResult } from './metrics';

describe('achievements utils', () => {
  const baseResult: TestResult = {
    id: '1',
    mode: 'time',
    duration: 30,
    timestamp: new Date().toISOString(),
    wpm: 50,
    rawWpm: 55,
    accuracy: 90,
    consistency: 80,
    chars: { correct: 250, incorrect: 10, fixed: 5, extra: 2 },
    samples: [],
    isPB: false
  };

  it('identifies the "Focused" achievement', () => {
    const result = { ...baseResult, consistency: 96 };
    const earned = checkAchievements(result);
    expect(earned.some(a => a.id === 'focused')).toBe(true);
  });

  it('identifies the "Speed Demon" achievement', () => {
    const result = { ...baseResult, wpm: 105 };
    const earned = checkAchievements(result);
    expect(earned.some(a => a.id === 'speed_demon')).toBe(true);
  });

  it('identifies the "Flawless" achievement', () => {
    const result = { ...baseResult, accuracy: 99 };
    const earned = checkAchievements(result);
    expect(earned.some(a => a.id === 'flawless')).toBe(true);
  });

  it('identifies the "Perfectionist" achievement', () => {
    const result = { ...baseResult, accuracy: 100 };
    const earned = checkAchievements(result);
    expect(earned.some(a => a.id === 'perfectionist')).toBe(true);
  });

  it('identifies multiple achievements at once', () => {
    const result = { ...baseResult, wpm: 110, accuracy: 100, consistency: 98 };
    const earned = checkAchievements(result);
    const ids = earned.map(a => a.id);
    expect(ids).toContain('speed_demon');
    expect(ids).toContain('perfectionist');
    expect(ids).toContain('focused');
  });

  it('returns an empty array if no achievements earned', () => {
    const result = { ...baseResult, wpm: 10, accuracy: 50, consistency: 30 };
    const earned = checkAchievements(result);
    expect(earned).toHaveLength(0);
  });
});
