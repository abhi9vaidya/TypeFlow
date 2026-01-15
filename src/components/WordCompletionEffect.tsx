import { useEffect, useState, useCallback, useRef } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { motion, AnimatePresence } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  color: string;
  delay: number;
}

export function WordCompletionEffect() {
  const { currentWordIndex, currentStreak } = useTypingStore();
  const { showParticleEffects } = useSettingsStore();
  const [particles, setParticles] = useState<Particle[]>([]);
  const lastWordIndexRef = useRef(0);

  const createParticles = useCallback(() => {
    // Only trigger at 5+ streak
    if (currentStreak < 5) return [];

    // Get caret position
    const caret = document.getElementById('active-caret');
    let originX = window.innerWidth / 2;
    let originY = window.innerHeight / 2;

    if (caret) {
      const rect = caret.getBoundingClientRect();
      originX = rect.left + rect.width / 2;
      originY = rect.top + rect.height / 2;
    }

    const particleCount = Math.min(6 + Math.floor(currentStreak / 5), 20);
    const newParticles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 50 + Math.random() * 100;
      const x = originX;
      const y = originY;

      // Color based on streak level
      let color;
      if (currentStreak >= 50) {
        color = `hsl(${260 + Math.random() * 60}, 100%, 70%)`; // Purple/Pink (Godlike)
      } else if (currentStreak >= 25) {
        color = `hsl(${40 + Math.random() * 20}, 100%, 60%)`; // Gold (Legendary)
      } else if (currentStreak >= 15) {
        color = `hsl(${10 + Math.random() * 30}, 100%, 60%)`; // Orange/Red (Blazing)
      } else {
        color = `hsl(${200 + Math.random() * 60}, 100%, 70%)`; // Blue/Cyan (Warm)
      }

      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: x, // Percentages work better for random spread, but pixels better for caret origin. 
        // We'll use fixed positioning in pixels for this effect
        y: y,
        size: 4 + Math.random() * 6,
        opacity: 1,
        color,
        delay: Math.random() * 0.1,
      });
    }

    return newParticles;
  }, [currentStreak]);

  useEffect(() => {
    if (!showParticleEffects) return;

    if (currentWordIndex > lastWordIndexRef.current && currentStreak >= 5) {
      const newParticles = createParticles();
      if (newParticles.length > 0) {
        setParticles(prev => [...prev, ...newParticles]);
        lastWordIndexRef.current = currentWordIndex;
      }
    } else if (currentWordIndex < lastWordIndexRef.current) {
      // Reset if restarted
      lastWordIndexRef.current = currentWordIndex;
    }
  }, [currentWordIndex, currentStreak, showParticleEffects, createParticles]);

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            initial={{
              x: particle.x,
              y: particle.y,
              opacity: 1,
              scale: 0
            }}
            animate={{
              x: particle.x + (Math.random() * 200 - 100),
              y: particle.y + (Math.random() * 200 - 100),
              opacity: 0,
              scale: 0
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut"
            }}
            onAnimationComplete={() => {
              setParticles(prev => prev.filter(p => p.id !== particle.id));
            }}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
