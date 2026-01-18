import * as confettiModule from 'canvas-confetti';

const confetti = (confettiModule as unknown as { default: typeof confettiModule }).default || confettiModule;

export function triggerConfetti() {
  const rainbowColors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff7b00', '#7b00ff', '#00ff7b', '#ff007b', '#7bff00', '#007bff',
    '#ffffff', '#ff00bb', '#bbff00', '#00bbff', '#ff5500', '#55ff00'
  ];

  const duration = 2 * 1000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: rainbowColors,
      zIndex: 1000000
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.8 },
      colors: rainbowColors,
      zIndex: 1000000
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}
