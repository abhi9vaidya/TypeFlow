import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useMultiplayerStore, Participant } from "@/store/useMultiplayerStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useTypingStore } from "@/store/useTypingStore";
import { useSettingsStore } from "@/store/useSettingsStore";
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
import { calculateWPM, calculateAccuracy } from "@/utils/metrics";
import { soundPlayer } from "@/utils/sounds";

import { ResultsCard } from "@/components/ResultsCard";

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
    finishRace,
    updateRoomStatus
  } = useMultiplayerStore();
  
  const {
    words,
    isRunning,
    isFinished,
    startTime,
    currentResult,
    setMode,
    setDuration,
    setWords,
    startTest,
    resetTest,
    finishTest,
    currentWordIndex,
    currentCharIndex,
    correctChars,
    incorrectChars,
    extraChars,
    typedChars,
    typeChar,
    deleteChar,
    nextWord,
  } = useTypingStore();

  const {
    keySoundEnabled,
    errorSoundEnabled,
  } = useSettingsStore();

  const [countdown, setCountdown] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [localWpm, setLocalWpm] = useState(0);
  const [inputValue, setInputValue] = useState("");

  // Auto-focus input for mobile accessibility and handle tab visibility
  useEffect(() => {
    const focusInput = () => {
      const isRacing = room?.status === 'racing' || (room?.status === 'countdown' && countdown === 0);
      if (!isFinished && isRacing) {
        document.getElementById("race-mobile-input")?.focus();
      }
    };
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        focusInput();
      }
    };

    focusInput();
    window.addEventListener("click", focusInput);
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("click", focusInput);
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [isFinished, room?.status, countdown]);

  // Reusable typing logic
  const handleTyping = useCallback((char: string) => {
    const isReadyToRace = room?.status === 'racing' || (room?.status === 'countdown' && countdown === 0);
    if (isFinished || !isReadyToRace) return;

    const expectedChar = words[currentWordIndex]?.[currentCharIndex];
    const isCorrect = char === expectedChar;
    
    // Safety check: if test hasn't started locally but status is racing, start it
    if (!isRunning && !isFinished) {
      startTest();
    }

    typeChar(char);
    
    // Play sounds
    if (keySoundEnabled) {
      soundPlayer.playKeyClick();
    }
    if (!isCorrect && errorSoundEnabled) {
      soundPlayer.playErrorSound();
    }
  }, [isFinished, room?.status, countdown, words, currentWordIndex, currentCharIndex, typeChar, isRunning, startTest, keySoundEnabled, errorSoundEnabled]);

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
      unsubscribeFromRoom();
    };
  }, [code, user, navigate, joinRoom, unsubscribeFromRoom]);

  // Handle room ID change to subscribe
  useEffect(() => {
    if (room?.id) {
      subscribeToRoom(room.id);
      
      // Initialize typing store with room text and reset previous state
      if (room.target_text) {
        setMode('words');
        setDuration(0); // Ensure timer counts up for races
        setWords(room.target_text.split(" "));
        resetTest();
      }
    }
  }, [room?.id, room?.target_text, setWords, resetTest, subscribeToRoom, setMode]);

  // Handle countdown
  useEffect(() => {
    if (room?.status === 'countdown' && room.starts_at) {
      const startTime = new Date(room.starts_at).getTime();
      
      const updateCountdown = () => {
        const now = Date.now();
        const diff = startTime - now;
        const remaining = Math.max(0, Math.ceil(diff / 1000));
        
        setCountdown(remaining);
        
        if (remaining === 0) {
          // Start test exactly when countdown reaches 0
          if (!isRunning && !isFinished) {
            startTest();
          }
          
          if (room.host_id === user?.id && room.status === 'countdown') {
            // Host ensures the room status is racing
            updateRoomStatus('racing');
          }
        }
      };

      // Initial check
      updateCountdown();
      
      const interval = setInterval(updateCountdown, 250);
      return () => clearInterval(interval);
    } else {
      setCountdown(null);
    }
  }, [room?.status, room?.starts_at, room?.host_id, user?.id, isRunning, isFinished, startTest, updateRoomStatus]);

  // Sync progress to DB
  useEffect(() => {
    const isRacing = room?.status === 'racing' || (room?.status === 'countdown' && countdown === 0);
    if (isRacing && isRunning && startTime) {
      const totalWords = words.length;
      if (totalWords === 0) return;
      
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds <= 0) return;

      const currentWpm = calculateWPM(correctChars, elapsedSeconds);
      setLocalWpm(currentWpm);

      // Check for finish: Last word and all characters in that word are correct
      const isOnLastWord = currentWordIndex === totalWords - 1;
      const lastWord = words[currentWordIndex];
      const typedLastWord = typedChars[currentWordIndex]?.join('') || '';
      const isLastWordFinished = typedLastWord === lastWord;

      const progress = (isOnLastWord && isLastWordFinished) 
        ? 100 
        : Math.min(99, Math.round((currentWordIndex / totalWords) * 100));
      
      updateProgress(progress, Math.round(currentWpm));

      if (progress === 100 && !isFinished) {
          // Finish the race locally and globally
          finishRace();
          
          const accuracy = calculateAccuracy(correctChars, incorrectChars, extraChars);
          
          finishTest({
            id: Math.random().toString(36).substring(2, 9),
            wpm: Math.round(currentWpm),
            accuracy,
            mode: 'words',
            duration: 0,
            timestamp: new Date().toISOString(),
            rawWpm: Math.round(currentWpm),
            consistency: 100,
            chars: {
              correct: correctChars,
              incorrect: incorrectChars,
              extra: extraChars,
              fixed: 0
            },
            samples: [], // Multi-player doesn't track live samples yet
            isPB: false
          });

          // If host finishes, eventually we could auto-finish the room
          if (room.host_id === user?.id) {
            // updateRoomStatus('finished'); // Maybe wait for others
          }
      }
    }
  }, [currentWordIndex, room?.status, countdown, isRunning, isFinished, startTime, words, correctChars, incorrectChars, typedChars, updateProgress, finishRace, finishTest]);

  // Keyboard handler for the race
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isRacing = room?.status === 'racing' || (room?.status === 'countdown' && countdown === 0);
      if (!isRacing || isFinished) return;

      // Backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        deleteChar();
        return;
      }

      // Space for next word
      if (e.key === " ") {
        e.preventDefault();
        if (currentWordIndex < words.length - 1) {
          nextWord();
        }
        return;
      }

      // Type character
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleTyping(e.key);
      }
    },
    [isFinished, room?.status, countdown, currentWordIndex, words, deleteChar, nextWord, handleTyping]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

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
                  className="gap-2 shadow-[0_0_15px_rgba(var(--primary),0.3)] min-w-[140px]"
                >
                  <Play className="w-4 h-4" />
                  {participants.length < 2 ? "Waiting for players" : "Start Race"}
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

              {(room.status === 'racing' || room.status === 'finished' || isFinished) && (
                <div className="space-y-12">
                   {isFinished && currentResult ? (
                     <div className="animate-fade-in-up">
                       <ResultsCard result={currentResult} />
                       <div className="flex justify-center mt-8">
                          <Button 
                            variant="outline" 
                            onClick={() => navigate("/multiplayer")}
                            className="gap-2"
                          >
                            <LogOut className="w-4 h-4" />
                            Back to Lobby
                          </Button>
                       </div>
                     </div>
                   ) : (
                     <div className="space-y-12">
                        <RaceProgress participants={participants} />
                        
                        <div 
                          className="relative cursor-text focus-within:ring-2 focus-within:ring-primary/20 rounded-xl transition-all"
                          onClick={() => document.getElementById("race-mobile-input")?.focus()}
                        >
                          {/* Hidden input for mobile keyboard support */}
                          <input
                            id="race-mobile-input"
                            type="text"
                            autoComplete="off"
                            autoCapitalize="off"
                            autoCorrect="off"
                            spellCheck="false"
                            className="absolute opacity-0 pointer-events-none left-0 top-0 h-full w-full"
                            value={inputValue}
                            onChange={(e) => {
                              const val = e.target.value;
                              
                              // Handle space for next word
                              if (val.endsWith(" ")) {
                                if (currentWordIndex < words.length - 1) {
                                  nextWord();
                                  setInputValue("");
                                }
                                return;
                              }

                              // Detect backspace
                              if (val.length < inputValue.length) {
                                deleteChar();
                              } else {
                                const lastChar = val.slice(-1);
                                if (lastChar) {
                                  handleTyping(lastChar);
                                }
                              }
                              
                              setInputValue(val);
                            }}
                          />
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
