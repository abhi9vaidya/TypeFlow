import { Participant } from "@/store/useMultiplayerStore";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RaceProgressProps {
  participants: Participant[];
}

export function RaceProgress({ participants }: RaceProgressProps) {
  return (
    <div className="space-y-4 w-full max-w-2xl mx-auto">
      {participants.map((p) => (
        <div key={p.user_id} className="relative space-y-1">
          <div className="flex justify-between items-end text-sm">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border border-primary/20">
                <AvatarImage src={p.profile?.avatar_url} />
                <AvatarFallback className="text-[10px]">
                  {p.profile?.nickname?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium">{p.profile?.nickname || "Guest"}</span>
            </div>
            <div className="flex gap-4 text-xs text-muted-foreground">
              <span>{p.wpm} WPM</span>
              <span className="font-mono">{p.progress}%</span>
            </div>
          </div>
          <div className="relative h-2 w-full bg-panel/30 rounded-full overflow-hidden">
             <div 
               className="h-full bg-primary transition-all duration-300 ease-out shadow-[0_0_8px_rgba(var(--primary),0.5)]"
               style={{ width: `${p.progress}%` }}
             />
          </div>
        </div>
      ))}
    </div>
  );
}
