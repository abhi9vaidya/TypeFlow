// Simple confetti animation utility
export function triggerConfetti() {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  
  const confettiCount = 50;
  const confettiElements: HTMLElement[] = [];

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.width = '10px';
    confetti.style.height = '10px';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = '50%';
    confetti.style.top = '50%';
    confetti.style.opacity = '1';
    confetti.style.pointerEvents = 'none';
    confetti.style.zIndex = '1000';
    confetti.style.borderRadius = '50%';
    
    const angle = randomInRange(0, 360);
    const velocity = randomInRange(15, 30);
    const vx = Math.cos(angle * Math.PI / 180) * velocity;
    const vy = Math.sin(angle * Math.PI / 180) * velocity;
    
    confetti.dataset.vx = vx.toString();
    confetti.dataset.vy = vy.toString();
    confetti.dataset.x = '0';
    confetti.dataset.y = '0';
    
    document.body.appendChild(confetti);
    confettiElements.push(confetti);
  }

  const interval = setInterval(() => {
    const now = Date.now();
    
    if (now > animationEnd) {
      clearInterval(interval);
      confettiElements.forEach(el => el.remove());
      return;
    }

    confettiElements.forEach(confetti => {
      let x = parseFloat(confetti.dataset.x || '0');
      let y = parseFloat(confetti.dataset.y || '0');
      const vx = parseFloat(confetti.dataset.vx || '0');
      let vy = parseFloat(confetti.dataset.vy || '0');
      
      // Apply gravity
      vy += 0.5;
      x += vx;
      y += vy;
      
      // Fade out
      const progress = (now - (animationEnd - duration)) / duration;
      confetti.style.opacity = (1 - progress).toString();
      
      confetti.style.transform = `translate(${x}px, ${y}px) rotate(${x * 2}deg)`;
      
      confetti.dataset.x = x.toString();
      confetti.dataset.y = y.toString();
      confetti.dataset.vy = vy.toString();
    });
  }, 16);
}
