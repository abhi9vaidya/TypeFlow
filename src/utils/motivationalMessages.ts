// Build: 20251114
interface MotivationalMessage {
  wpm: string;
  accuracy: string;
  general: string[];
}

export const motivationalMessages: MotivationalMessage = {
  wpm: "🔥 You're warming up",
  accuracy: "⚡ Peak focus engaged",
  general: [
    "🧠 Smooth fingers today",
    "⚡ You hit a flow state",
    "🔥 Keep the rhythm going",
    "🎯 Precision typing",
    "⚡ Lightning fast",
    "🧨 You're on fire"
  ]
};

export function getMotivationalMessage(wpm: number, accuracy: number): string {
  if (wpm < 40) return motivationalMessages.wpm;
  if (accuracy >= 95) return motivationalMessages.accuracy;
  
  const randomIndex = Math.floor(Math.random() * motivationalMessages.general.length);
  return motivationalMessages.general[randomIndex];
}

