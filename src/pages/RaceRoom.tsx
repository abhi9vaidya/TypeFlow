import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useMultiplayerStore, Participant } from "@/store/useMultiplayerStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useTypingStore } from "@/store/useTypingStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { RaceProgress } from "@/components/RaceProgress";
import { WordStream } from "@/components/WordStream";
import { LiveMetrics } from "@/components/LiveMetrics";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Play, Copy, Check, LogOut, Loader2, Users } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateWPM } from "@/utils/metrics";

export default function RaceRoom() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { 
    room, 
    participants, 
    joinRoom, 
    leaveRoom, 
    subscribeToRoom, 
    unsubscribeFromRoom,
    setReady,
    startRace,
    updateProgress,
    finishRace
  } = useMultiplayerStore();
  
  const {
    words,
    isRunning,
    isFinished,
    startTime,
    setWords,
    startTest,
    resetTest,
    currentWordIndex,
    currentCharIndex,
    correctChars,
  } = useTypingStore();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [localWpm, setLocalWpm] = useState(0);

  // Join and subscribe
  useEffect(() => {
    if (!code || !user) return;

    const init = async () => {
      const success = await joinRoom(code);
      if (!success) {
        toast.error("Could not join room");
        navigate("/multiplayer");
      }
    };

    init();

    return () => {
      leaveRoom();
      unsubscribeFromRoom();
    };
  }, [code, user, navigate, joinRoom, leaveRoom, unsubscribeFromRoom]);

  // Handle room ID change to subscribe
  useEffect(() => {
    if (room?.id) {
      subscribeToRoom(room.id);
      
      // Initialize typing store with room text
      if (room.target_text) {
        setWords(room.target_text.split(" "));
      }
    }
  }, [room?.id, room?.target_text, setWords, subscribeToRoom]);

  // Handle countdown
  useEffect(() => {
    if (room?.status === 'countdown' && room.starts_at) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((new Date(room.starts_at!).getTime() - Date.now()) / 1000));
        setCountdown(remaining);
        
        if (remaining === 0) {
          clearInterval(interval);
          startTest(); // Start local typing test
        }
      }, 100);
      return () => clearInterval(interval);
    } else {
      setCountdown(null);
    }
  }, [room?.status, room?.starts_at, startTest]);

  // Sync progress to DB
  useEffect(() => {
    if (room?.status === 'racing' && isRunning && startTime) {
      const totalWords = words.length;
      if (totalWords === 0) return;
      
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const currentWpm = calculateWPM(correctChars, elapsedSeconds);
      setLocalWpm(currentWpm);

      const progress = Math.round((currentWordIndex / totalWords) * 100);
      updateProgress(progress, Math.round(currentWpm));

      if (currentWordIndex >= totalWords) {
          finishRace();
      }
    }
  }, [currentWordIndex, room?.status, isRunning, startTime, words.length, correctChars, updateProgress, finishRace]);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Room link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isHost = room.host_id === user?.id;
  const everyoneReady = participants.length > 0 && participants.every(p => p.is_ready);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-5xl mx-auto space-y-8">
          
          {/* Room Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">Race Room</h1>
                <Badge variant="outline" className="font-mono text-lg py-1 px-3">
                  {room.code}
                </Badge>
                <Button variant="ghost" size="icon" onClick={copyRoomCode}>
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-muted-foreground">
                {room.is_private ? "Private Room" : "Public Room"} • {room.mode} mode
              </p>
            </div>

            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => navigate("/multiplayer")} className="gap-2">
                <LogOut className="w-4 h-4" />
                Leave
              </Button>
              {isHost && room.status === 'lobby' && (
                <Button 
                  onClick={startRace} 
                  disabled={!everyoneReady || participants.length < 2}
                  className="gap-2 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                >
                  <Play className="w-4 h-4" />
                  Start Race
                </Button>
              )}
              {!isHost && room.status === 'lobby' && (
                <Button 
                  variant={participants.find(p => p.user_id === user?.id)?.is_ready ? "outline" : "default"}
                  onClick={() => setReady(!participants.find(p => p.user_id === user?.id)?.is_ready)}
                >
                  {participants.find(p => p.user_id === user?.id)?.is_ready ? "Not Ready" : "Ready"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Race Area */}
            <div className="lg:col-span-2 space-y-8">
              {room.status === 'lobby' && (
                <Card className="bg-panel/40 border-border/50 backdrop-blur-sm min-h-[300px] flex flex-col items-center justify-center text-center p-8">
                   <Users className="w-12 h-12 text-primary/40 mb-4" />
                   <h3 className="text-xl font-medium mb-2">Waiting for participants...</h3>
                   <p className="text-muted-foreground mb-6">Invite friends using the room code or link.</p>
                   {participants.length < 2 && (
                     <p className="text-sm text-yellow-500/80">At least 2 players are required to start.</p>
                   )}
                </Card>
              )}

              {room.status === 'countdown' && (
                <div className="min-h-[300px] flex flex-col items-center justify-center">
                  <div className="text-9xl font-bold animate-pulse text-primary drop-shadow-[0_0_20px_rgba(var(--primary),0.5)]">
                    {countdown}
                  </div>
                  <p className="text-xl text-muted-foreground mt-4 uppercase tracking-widest">Get Ready!</p>
                </div>
              )}

              {(room.status === 'racing' || room.status === 'finished') && (
                <div className="space-y-12">
                   <RaceProgress participants={participants} />
                   
                   <div className="relative">
                     <WordStream />
                     {room.status === 'finished' && (
                       <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px] flex items-center justify-center rounded-xl z-10">
                          <h2 className="text-4xl font-bold text-primary">Race Finished!</h2>
                       </div>
                     )}
                   </div>

                   <LiveMetrics />
                </div>
              )}
            </div>

            {/* Sidebar / Participants */}
            <Card className="bg-panel/40 border-border/50 backdrop-blur-sm h-fit">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                   Players ({participants.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {participants.map((p) => (
                  <div key={p.user_id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-primary/20">
                        <AvatarImage src={p.profile?.avatar_url} />
                        <AvatarFallback>{p.profile?.nickname?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{p.profile?.nickname || "Guest"}</span>
                        <span className="text-[10px] uppercase text-muted-foreground">
                          {p.user_id === room.host_id ? "Host" : "Player"}
                        </span>
                      </div>
                    </div>
                    {p.is_ready ? (
                      <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Ready</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Waiting</Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}
