// Build: 20251114
import { useEffect, useState } from "react";
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";

interface ParticleType {
  id: number;
  x: number;
  y: number;
  velocity: { x: number; y: number };
  color: string;
  size: number;
}

export function WordCompletionEffect() {
  const { currentWordIndex, currentStreak } = useTypingStore();
  const { showParticleEffects } = useSettingsStore();
  const [particles, setParticles] = useState<ParticleType[]>([]);
  const [lastWordIndex, setLastWordIndex] = useState(0);

  useEffect(() => {
    if (!showParticleEffects) return;
    
    // Detect when a word is completed
    if (currentWordIndex > lastWordIndex && currentStreak > 0) {
      // Create particles based on streak
      const particleCount = Math.min(currentStreak, 8);
      const newParticles: ParticleType[] = [];
      
      const colors = currentStreak >= 10 
        ? ["hsl(var(--gold))", "hsl(var(--destructive))"] 
        : ["hsl(var(--primary))", "hsl(var(--secondary))"];

      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount;
        const speed = 2 + Math.random() * 2;
        
        newParticles.push({
          id: Date.now() + i,
          x: 50, // Center
          y: 50,
          velocity: {
            x: Math.cos(angle) * speed,
            y: Math.sin(angle) * speed,
          },
          color: colors[Math.floor(Math.random() * colors.length)],
          size: 4 + Math.random() * 4,
        });
      }

      setParticles(newParticles);

      // Animate and remove particles
      const animationInterval = setInterval(() => {
        setParticles(prev => 
          prev
            .map(p => ({
              ...p,
              x: p.x + p.velocity.x,
              y: p.y + p.velocity.y,
              velocity: {
                x: p.velocity.x * 0.95,
                y: p.velocity.y * 0.95 + 0.2, // Gravity
              },
              size: p.size * 0.95,
            }))
            .filter(p => p.size > 0.5)
        );
      }, 16);

      setTimeout(() => {
        clearInterval(animationInterval);
        setParticles([]);
      }, 1000);

      setLastWordIndex(currentWordIndex);
    }
  }, [currentWordIndex, currentStreak, lastWordIndex, showParticleEffects]);

  if (particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute rounded-full blur-[1px]"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}`,
            transform: "translate(-50%, -50%)",
            transition: "none",
          }}
        />
      ))}
    </div>
  );
}

