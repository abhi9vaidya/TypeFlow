import confetti from 'canvas-confetti';

/**
 * Triggers an intense, high-performance confetti animation with dual side cannons.
 * Optimized for Personal Best celebrations.
 */
export function triggerConfetti() {
  console.log("Personal Best detected! Launching confetti cannons...");
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  
  const colors = [
    '#3b82f6', '#60a5fa', '#8b5cf6', '#a78bfa',
    '#ec4899', '#f472b6', '#ef4444', '#f87171',
    '#f59e0b', '#fbbf24', '#10b981', '#34d399',
    '#06b6d4', '#22d3ee', '#ffffff'
  ];

  const frame = () => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) return;

    // Fire particles per frame for the cannon effect
    const particleCount = 4;
    
    // Left side cannon - Exactly matching the user's reference snippet
    confetti({
      particleCount,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
      zIndex: 999999,
      disableForReducedMotion: true
    });
    
    // Right side cannon - Exactly matching the user's reference snippet
    confetti({
      particleCount,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
      zIndex: 999999,
      disableForReducedMotion: true
    });

    if (timeLeft > 0) {
      requestAnimationFrame(frame);
    }
  };

  frame();
}
