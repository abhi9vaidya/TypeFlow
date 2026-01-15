// Build: 20260115 - Particles spread throughout typing area
import { useEffect, useState, useCallback, useRef } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";

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

    // Spread particles throughout the screen (typing area region)
    const particleCount = Math.min(4 + Math.floor(currentStreak / 5), 12);
    const newParticles: Particle[] = [];

    // Typing area is roughly in the center-bottom half of the screen
    // Spread particles across different regions
    const regions = [
      { xMin: 15, xMax: 35, yMin: 35, yMax: 55 },   // Left side
      { xMin: 35, xMax: 65, yMin: 30, yMax: 50 },   // Center
      { xMin: 65, xMax: 85, yMin: 35, yMax: 55 },   // Right side
      { xMin: 25, xMax: 75, yMin: 50, yMax: 70 },   // Lower area
    ];

    for (let i = 0; i < particleCount; i++) {
      const region = regions[i % regions.length];
      const x = region.xMin + Math.random() * (region.xMax - region.xMin);
      const y = region.yMin + Math.random() * (region.yMax - region.yMin);

      // Color based on streak level
      let color;
      if (currentStreak >= 20) {
        color = `rgba(251, 191, 36, ${0.5 + Math.random() * 0.3})`; // Gold
      } else if (currentStreak >= 10) {
        color = `rgba(249, 115, 22, ${0.4 + Math.random() * 0.3})`; // Orange
      } else {
        color = `rgba(168, 85, 247, ${0.4 + Math.random() * 0.2})`; // Purple
      }

      newParticles.push({
        id: Date.now() + i + Math.random(),
        x,
        y,
        size: 3 + Math.random() * 4,
        opacity: 1,
        color,
        delay: i * 0.03, // Staggered appearance
      });
    }

    return newParticles;
  }, [currentStreak]);

  useEffect(() => {
    if (!showParticleEffects) return;

    if (currentWordIndex > lastWordIndexRef.current && currentStreak >= 5) {
      const newParticles = createParticles();
      if (newParticles.length > 0) {
        setParticles(newParticles);
        lastWordIndexRef.current = currentWordIndex;

        // Clear after animation
        const timeout = setTimeout(() => {
          setParticles([]);
        }, 800);

        return () => clearTimeout(timeout);
      }
    }

    lastWordIndexRef.current = currentWordIndex;
  }, [currentWordIndex, currentStreak, showParticleEffects, createParticles]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            animation: `particle-float 0.8s ease-out forwards`,
            animationDelay: `${particle.delay}s`,
            opacity: 0,
          }}
        />
      ))}

      {/* Inline keyframes for the particle animation */}
      <style>{`
        @keyframes particle-float {
          0% {
            opacity: 0;
            transform: translateY(0) scale(0.5);
          }
          30% {
            opacity: 1;
            transform: translateY(-10px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translateY(-30px) scale(0.3);
          }
        }
      `}</style>
    </div>
  );
}
