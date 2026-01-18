import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { Play, Copy, Check, LogOut, Loader2, Users, ChevronLeft, Zap } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { calculateWPM, calculateAccuracy } from "@/utils/metrics";
import { soundPlayer } from "@/utils/sounds";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

import { ResultsCard } from "@/components/ResultsCard";
import { triggerConfetti } from "@/utils/confetti";

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
    startTime,
    setMode,
    setWords,
    startTest,
    resetTest,
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
  const [raceFinished, setRaceFinished] = useState(false);
  const [finalWpm, setFinalWpm] = useState(0);
  const [finalAccuracy, setFinalAccuracy] = useState(0);
  const [finishTime, setFinishTime] = useState<number | null>(null);
  const [storedResult, setStoredResult] = useState<{ wpm: number; accuracy: number; finishTime: number } | null>(null);
  const [cachedStandings, setCachedStandings] = useState<Participant[]>([]);
  
  // Track which room we've initialized to prevent resets on tab switch
  const initializedRoomId = useRef<string | null>(null);

  const persistRaceResult = useCallback((roomId: string, data: { wpm: number; accuracy: number; finishTime: number }, standings?: Participant[]) => {
    try {
      sessionStorage.setItem(`race-result-${roomId}`, JSON.stringify(data));
      if (standings && standings.length > 0) {
        sessionStorage.setItem(`race-standings-${roomId}`, JSON.stringify(standings));
      }
      setStoredResult(data);
    } catch {
      // Ignore sessionStorage errors
    }
  }, []);

  const loadRaceResult = useCallback((roomId: string) => {
    try {
      const raw = sessionStorage.getItem(`race-result-${roomId}`);
      if (!raw) return null;
      return JSON.parse(raw) as { wpm: number; accuracy: number; finishTime: number };
    } catch {
      // Return null if parsing fails
      return null;
    }
  }, []);

  // When we re-mount or lose room data temporarily (e.g., tab switch), restore any stored result
  useEffect(() => {
    const id = room?.id ?? initializedRoomId.current;
    if (!id) return;

    const stored = loadRaceResult(id);
    if (stored) {
      setStoredResult(stored);
      setRaceFinished(true);
      setFinalWpm(stored.wpm);
      setFinalAccuracy(stored.accuracy);
      setFinishTime(stored.finishTime);
      
      // Also restore cached standings
      try {
        const standingsRaw = sessionStorage.getItem(`race-standings-${id}`);
        if (standingsRaw) {
          const standings = JSON.parse(standingsRaw) as Participant[];
          setCachedStandings(standings);
        }
      } catch {
        // Ignore errors
      }
    }
  }, [room?.id, loadRaceResult]);

  // Auto-focus input for mobile accessibility and handle tab visibility
  useEffect(() => {
    const focusInput = () => {
      const isRacing = room?.status === 'racing' || (room?.status === 'countdown' && countdown === 0);
      if (!raceFinished && isRacing) {
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
  }, [raceFinished, room?.status, countdown]);

  // Reusable typing logic
  const handleTyping = useCallback((char: string) => {
    const isReadyToRace = room?.status === 'racing' || (room?.status === 'countdown' && countdown === 0);
    if (raceFinished || !isReadyToRace) return;

    const expectedChar = words[currentWordIndex]?.[currentCharIndex];
    const isCorrect = char === expectedChar;
    
    // Safety check: if test hasn't started locally but status is racing, start it
    if (!isRunning && !raceFinished) {
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
  }, [raceFinished, room?.status, countdown, words, currentWordIndex, currentCharIndex, typeChar, isRunning, startTest, keySoundEnabled, errorSoundEnabled]);

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

  // If we re-focus or re-render and our participant is already finished, restore finished state
  useEffect(() => {
    if (!room?.id || !user || raceFinished) return;
    
    const me = participants.find(p => p.user_id === user.id);
    if (me?.progress === 100 && me.finished_at) {
      const stored = loadRaceResult(room.id);
      if (stored) {
        if (!raceFinished) {
          triggerConfetti();
          soundPlayer.playSuccessSound();
        }
        setRaceFinished(true);
        setFinalWpm(stored.wpm);
        setFinalAccuracy(stored.accuracy);
        setFinishTime(stored.finishTime);
      } else if (me.wpm > 0) {
        // Fallback to participant data if no stored result
        if (!raceFinished) {
          triggerConfetti();
          soundPlayer.playSuccessSound();
        }
        setRaceFinished(true);
        setFinalWpm(me.wpm);
        setFinalAccuracy(100); // Default accuracy
        setFinishTime(0);
      }
    }
  }, [participants, room?.id, user, raceFinished, loadRaceResult]);

  // Handle room ID change to subscribe
  useEffect(() => {
    if (room?.id) {
      subscribeToRoom(room.id);
      
      // Only initialize if this is a new room (prevents reset on tab switch)
      if (room.target_text && initializedRoomId.current !== room.id) {
        initializedRoomId.current = room.id;
        
        // Check for stored result FIRST before resetting
        const stored = loadRaceResult(room.id);
        
        setMode('words');
        setWords(room.target_text.split(" "));
        
        if (stored) {
          // Restore finished state
          setRaceFinished(true);
          setFinalWpm(stored.wpm);
          setFinalAccuracy(stored.accuracy);
          setFinishTime(stored.finishTime);
        } else {
          // Fresh race - reset everything
          resetTest();
          setRaceFinished(false);
        }
      }
    }
  }, [room?.id, room?.target_text, setWords, resetTest, subscribeToRoom, setMode, loadRaceResult]);

  // Handle countdown
  useEffect(() => {
    if (room?.status === 'countdown' && room.starts_at) {
      const startTime = new Date(room.starts_at).getTime();
      
      const updateCountdown = () => {
        const now = Date.now();
        const diff = startTime - now;
        const remaining = Math.max(0, Math.ceil(diff / 1000));
        
        // Play beep sound on countdown change
        if (remaining !== countdown && remaining > 0 && remaining <= 3) {
          soundPlayer.playCountdownBeep(remaining === 1);
        }
        
        setCountdown(remaining);
        
        if (remaining === 0) {
          // Start test exactly when countdown reaches 0
          if (!isRunning && !raceFinished) {
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
  }, [room?.status, room?.starts_at, room?.host_id, user?.id, isRunning, raceFinished, startTest, updateRoomStatus, countdown]);

  // Helper to finish the race
  const completeRace = useCallback(() => {
    if (raceFinished || !startTime) return;
    
    const elapsedSeconds = (Date.now() - startTime) / 1000;
    const wpm = calculateWPM(correctChars, elapsedSeconds);
    const accuracy = calculateAccuracy(correctChars, incorrectChars, extraChars);
    
    setRaceFinished(true);
    setFinalWpm(Math.round(wpm));
    setFinalAccuracy(accuracy);
    setFinishTime(elapsedSeconds);
    
    // Update progress to 100% in the database
    updateProgress(100, Math.round(wpm));
    finishRace();
    
    // Save result and standings snapshot after state updates
    if (room?.id) {
      setTimeout(() => {
        persistRaceResult(room.id!, { wpm: Math.round(wpm), accuracy, finishTime: elapsedSeconds }, participants);
        setCachedStandings([...participants]);
      }, 100);
    }
  }, [raceFinished, startTime, correctChars, incorrectChars, extraChars, updateProgress, finishRace, persistRaceResult, room?.id, participants]);

  // Sync progress to DB
  useEffect(() => {
    const isRacing = room?.status === 'racing' || (room?.status === 'countdown' && countdown === 0);
    if (isRacing && isRunning && startTime && !raceFinished) {
      const totalWords = words.length;
      if (totalWords === 0) return;
      
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      if (elapsedSeconds <= 0) return;

      const currentWpm = calculateWPM(correctChars, elapsedSeconds);
      setLocalWpm(currentWpm);

      // Progress is based on word index (not character matching)
      const progress = Math.min(99, Math.round((currentWordIndex / totalWords) * 100));
      updateProgress(progress, Math.round(currentWpm));
    }
  }, [currentWordIndex, room?.status, countdown, isRunning, raceFinished, startTime, words.length, correctChars, updateProgress]);

  // Keyboard handler for the race
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const isRacing = room?.status === 'racing' || (room?.status === 'countdown' && countdown === 0);
      if (!isRacing || raceFinished) return;

      // Backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        deleteChar();
        return;
      }

      // Space for next word or finish race
      if (e.key === " ") {
        e.preventDefault();
        if (currentWordIndex < words.length - 1) {
          nextWord();
        } else {
          // Last word - finish the race!
          completeRace();
        }
        return;
      }

      // Type character
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        handleTyping(e.key);
      }
    },
    [raceFinished, room?.status, countdown, currentWordIndex, words, deleteChar, nextWord, handleTyping, completeRace]
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

  if (!room && raceFinished && storedResult) {
    return (
      <div className="min-h-screen pt-12 pb-20 relative overflow-hidden bg-background">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <main className="container mx-auto px-4 relative">
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="space-y-6 animate-fade-in-up">
              <Card className="bg-panel/10 backdrop-blur-xl border-white/5 overflow-hidden rounded-[2.5rem] shadow-2xl">
                <div className="bg-gradient-to-r from-primary/10 via-transparent to-transparent p-10 border-b border-white/5">
                  <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 font-black italic uppercase tracking-widest py-1 px-3">RECORDED DATA</Badge>
                  <h2 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-4">
                    🏁 MISSION COMPLETE
                  </h2>
                  <p className="text-muted-foreground mt-4 italic font-medium font-mono text-sm uppercase tracking-widest opacity-50">
                    Velocity Log: {storedResult.finishTime.toFixed(1)} SECONDS
                  </p>
                </div>
                <CardContent className="p-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-black/40 p-8 rounded-[2rem] border border-white/5 text-center">
                        <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 italic">AVERAGE VELOCITY</div>
                        <div className="text-6xl font-black italic tracking-tighter text-primary">{storedResult.wpm}</div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-40 mt-1">WORDS PER MINUTE</div>
                      </div>
                    </div>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-transparent blur opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-black/40 p-8 rounded-[2rem] border border-white/5 text-center">
                        <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 italic">PRECISION RATING</div>
                        <div className="text-6xl font-black italic tracking-tighter text-emerald-500">{storedResult.accuracy}%</div>
                        <div className="text-xs font-black uppercase tracking-widest opacity-40 mt-1">PERCENT ACCURATE</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-center font-black italic uppercase tracking-widest text-[10px] opacity-40">Live server link severed. Displaying localized cache.</p>
                </CardContent>
              </Card>
              <div className="flex justify-center pt-4">
                <Button 
                    onClick={() => navigate("/multiplayer")}
                    className="h-14 px-12 rounded-2xl bg-white/5 border border-white/10 font-black italic uppercase tracking-widest text-xs hover:bg-white/10 transition-all text-muted-foreground"
                >
                  <LogOut className="w-4 h-4 mr-3" />
                  RETURN TO BASE
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
        <p className="font-black italic uppercase tracking-widest text-xs text-muted-foreground animate-pulse">Establishing Secure Uplink...</p>
      </div>
    );
  }

  const isHost = room.host_id === user?.id;
  const everyoneReady = participants.length > 0 && participants.every(p => p.is_ready);

  return (
    <div className="min-h-screen pt-12 pb-20 relative overflow-hidden bg-background">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <main className="container mx-auto px-4 relative">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/multiplayer")}
                  className="rounded-full h-8 w-8 p-0 border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3 text-[10px] font-black uppercase tracking-widest italic">
                  ARENA: {room.code}
                </Badge>
                {room && (
                  <Badge variant="secondary" className="bg-panel/50 border-white/5 shadow-inner text-[10px] font-black uppercase tracking-widest italic">
                    {room.is_private ? "PRIVATE CIRCUIT" : "PUBLIC CIRCUIT"} • {room.mode || "WORDS"}
                  </Badge>
                )}
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent italic tracking-tighter uppercase leading-none pb-2 pr-4">
                GLADIATOR<br/>ARENA
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                 variant="ghost" 
                 onClick={() => navigate("/multiplayer")} 
                 className="h-14 px-8 rounded-2xl bg-white/5 border border-white/5 font-black italic uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" />
                ABORT
              </Button>
              
              {isHost && room.status === 'lobby' && (
                <Button 
                  onClick={startRace} 
                  disabled={!everyoneReady || participants.length < 2}
                  className="h-14 px-10 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-black italic uppercase tracking-widest text-xs shadow-xl shadow-primary/20 transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {participants.length < 2 ? "WAITING FOR PILOTS" : "INITIATE RACE"}
                </Button>
              )}
              
              {!isHost && room.status === 'lobby' && (
                <Button 
                  variant={participants.find(p => p.user_id === user?.id)?.is_ready ? "outline" : "default"}
                  onClick={() => setReady(!participants.find(p => p.user_id === user?.id)?.is_ready)}
                  className={cn(
                    "h-14 px-10 rounded-2xl font-black italic uppercase tracking-widest text-xs transition-all",
                    participants.find(p => p.user_id === user?.id)?.is_ready 
                      ? "border-primary/50 text-primary hover:bg-primary/5" 
                      : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20"
                  )}
                >
                  {participants.find(p => p.user_id === user?.id)?.is_ready ? "STAND DOWN" : "READY UP"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Race Area */}
            <div className="lg:col-span-3 space-y-8">
              {room.status === 'lobby' ? (
                <Card className="bg-panel/10 backdrop-blur-xl border-white/5 h-[400px] flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                      <Users className="w-64 h-64" />
                   </div>
                   <div className="w-20 h-20 rounded-3xl bg-primary/5 flex items-center justify-center border border-primary/20 mb-8 group-hover:scale-110 transition-transform">
                      <Users className="w-10 h-10 text-primary" />
                   </div>
                   <h3 className="text-3xl font-black italic uppercase tracking-tighter mb-4 pr-2 pb-1">WAITING FOR PILOTS</h3>
                   <p className="text-muted-foreground italic font-medium max-w-md mx-auto mb-8">
                     Broadcast your coordinate to invite challengers. A minimum of two pilots is required for deployment.
                   </p>
                   
                   <div className="flex items-center gap-3">
                      <div className="bg-black/40 px-6 py-4 rounded-xl border border-white/5 font-mono text-xl tracking-widest text-primary font-black">
                         {room.code}
                      </div>
                      <Button 
                         variant="ghost" 
                         size="icon" 
                         onClick={copyRoomCode}
                         className="h-14 w-14 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                      >
                         {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
                      </Button>
                   </div>
                </Card>
              ) : room.status === 'countdown' ? (
                <div className="h-[400px] flex flex-col items-center justify-center">
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[12rem] font-black italic leading-none text-primary drop-shadow-[0_0_50px_rgba(var(--primary),0.3)] animate-pulse"
                  >
                    {countdown}
                  </motion.div>
                  <p className="text-2xl font-black italic uppercase tracking-[0.5em] text-muted-foreground/60">INITIATING FLOW</p>
                </div>
              ) : (room.status === 'racing' || room.status === 'finished' || raceFinished) ? (
                <div className="space-y-12">
                   {raceFinished ? (
                     <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                     >
                       <Card className="bg-panel/10 backdrop-blur-xl border-white/5 overflow-hidden rounded-[2.5rem] shadow-2xl">
                         <div className="bg-gradient-to-r from-primary/10 via-transparent to-transparent p-10 border-b border-white/5">
                           <Badge variant="outline" className="mb-4 bg-primary/5 text-primary border-primary/20 font-black italic uppercase tracking-widest py-1 px-3">MISSION RECAP</Badge>
                           <h2 className="text-4xl font-black italic uppercase tracking-tighter">
                             OPERATIONAL SUCCESS
                           </h2>
                         </div>
                         <CardContent className="p-10">
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                             <div className="relative group">
                               <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-transparent blur opacity-0 group-hover:opacity-100 transition-opacity" />
                               <div className="relative bg-black/40 p-8 rounded-[2rem] border border-white/5 text-center">
                                 <div className="text-[10px] font-black text-primary uppercase tracking-[0.3em] mb-2 italic">AVERAGE VELOCITY</div>
                                 <div className="text-6xl font-black italic tracking-tighter text-primary">{finalWpm}</div>
                                 <div className="text-xs font-black uppercase tracking-widest opacity-40 mt-1">WORDS PER MINUTE</div>
                               </div>
                             </div>
                             <div className="relative group">
                               <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500/20 to-transparent blur opacity-0 group-hover:opacity-100 transition-opacity" />
                               <div className="relative bg-black/40 p-8 rounded-[2rem] border border-white/5 text-center">
                                 <div className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-2 italic">PRECISION RATING</div>
                                 <div className="text-6xl font-black italic tracking-tighter text-emerald-500">{finalAccuracy}%</div>
                                 <div className="text-xs font-black uppercase tracking-widest opacity-40 mt-1">PERCENT ACCURATE</div>
                               </div>
                             </div>
                           </div>
                           
                           <div className="space-y-4">
                             <h3 className="text-xs font-black italic uppercase tracking-[0.4em] opacity-30 px-2">MISSION STANDINGS</h3>
                             <div className="space-y-3">
                               {(() => {
                                 const displayParticipants = participants.length > 0 && participants.some(p => p.wpm > 0 || p.progress > 0)
                                   ? participants
                                   : cachedStandings.length > 0 ? cachedStandings : participants;
                                 
                                 return [...displayParticipants]
                                   .sort((a, b) => (b.finished_at ? 1 : 0) - (a.finished_at ? 1 : 0) || b.progress - a.progress || b.wpm - a.wpm)
                                   .map((p, idx) => (
                                   <div 
                                     key={p.user_id} 
                                     className={cn(
                                       "flex items-center justify-between p-5 rounded-2xl transition-all border",
                                       p.user_id === user?.id 
                                         ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/5' 
                                         : 'bg-white/[0.02] border-white/5'
                                     )}
                                   >
                                     <div className="flex items-center gap-4">
                                       <div className={cn(
                                          "w-10 h-10 rounded-xl flex items-center justify-center font-black italic text-lg shadow-inner",
                                          idx === 0 ? "bg-yellow-500 text-black" : 
                                          idx === 1 ? "bg-slate-300 text-black" :
                                          idx === 2 ? "bg-amber-600 text-black" :
                                          "bg-white/5 text-muted-foreground"
                                       )}>
                                         {idx + 1}
                                       </div>
                                       <Avatar className="h-10 w-10 border-2 border-white/10">
                                         <AvatarImage src={p.profile?.avatar_url} />
                                         <AvatarFallback className="bg-panel font-black">{p.profile?.nickname?.charAt(0) || "?"}</AvatarFallback>
                                       </Avatar>
                                       <div className="flex flex-col">
                                         <span className="font-black italic uppercase tracking-tight">{p.profile?.nickname || "GUEST_PILOT"}</span>
                                         {p.user_id === user?.id && <span className="text-[8px] font-black text-primary uppercase tracking-widest">YOU</span>}
                                       </div>
                                     </div>
                                     <div className="flex items-center gap-8">
                                       <div className="text-right">
                                          <div className="text-xs font-black italic text-muted-foreground tracking-widest">VELOCITY</div>
                                          <div className="text-xl font-black italic">{p.wpm} <span className="text-[10px] opacity-40">WPM</span></div>
                                       </div>
                                       <div className="text-right min-w-[100px]">
                                          <div className="text-xs font-black italic text-muted-foreground tracking-widest">STATUS</div>
                                          <div className={cn(
                                             "text-xs font-black italic px-3 py-1 rounded-lg uppercase tracking-wider mt-1",
                                             p.progress === 100 ? "bg-emerald-500/20 text-emerald-500" : "bg-white/5 text-white/40"
                                          )}>
                                             {p.progress === 100 ? "FINISHED" : `${p.progress}%`}
                                          </div>
                                       </div>
                                     </div>
                                   </div>
                                 ));
                               })()}
                             </div>
                           </div>
                         </CardContent>
                       </Card>
                       
                       <div className="flex justify-center pt-4">
                          <Button 
                            onClick={() => navigate("/multiplayer")}
                            className="h-14 px-12 rounded-2xl bg-white/5 border border-white/10 font-black italic uppercase tracking-widest text-xs hover:bg-white/10 transition-all text-muted-foreground"
                          >
                            <LogOut className="w-4 h-4 mr-3" />
                            RETURN TO BASE
                          </Button>
                       </div>
                     </motion.div>
                   ) : (
                     <div className="space-y-16">
                        <RaceProgress participants={participants} />
                        
                        <div 
                          className="relative group cursor-text focus-within:ring-2 focus-within:ring-primary/20 rounded-[2.5rem] transition-all"
                          onClick={() => document.getElementById("race-mobile-input")?.focus()}
                        >
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
                              if (val.endsWith(" ")) {
                                if (currentWordIndex < words.length - 1) {
                                  nextWord();
                                  setInputValue("");
                                } else {
                                  completeRace();
                                  setInputValue("");
                                }
                                return;
                              }
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
                          <div className={cn(
                             "transition-all duration-500",
                             (room.status === 'finished' || raceFinished) ? "blur-md opacity-20 pointer-events-none scale-95" : ""
                          )}>
                             <WordStream />
                          </div>

                          {(room.status === 'finished' || raceFinished) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2.5rem] z-10 animate-in fade-in zoom-in-95 duration-500">
                              <Badge className="bg-primary text-primary-foreground font-black italic uppercase py-1 px-4 mb-4 tracking-widest">CIRCUIT CLOSED</Badge>
                              <h2 className="text-6xl font-black text-primary italic uppercase tracking-tighter drop-shadow-2xl pr-4 pb-2">RACE FINISHED</h2>
                            </div>
                          )}
                        </div>

                        <div className="max-w-2xl mx-auto">
                           <LiveMetrics />
                        </div>
                     </div>
                   )}
                </div>
              ) : null}
            </div>

            <div className="space-y-6">
              <Card className="bg-panel/10 backdrop-blur-xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-xs font-black italic uppercase tracking-[0.3em] flex items-center justify-between opacity-50">
                     <span>DEPLOYED PILOTS</span>
                     <span className="text-primary">[{participants.length}]</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                  {participants.map((p) => (
                    <div key={p.user_id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                           <Avatar className="h-10 w-10 border-2 border-white/10">
                              <AvatarImage src={p.profile?.avatar_url} />
                              <AvatarFallback className="bg-panel font-black">{p.profile?.nickname?.charAt(0) || "U"}</AvatarFallback>
                           </Avatar>
                           {p.user_id === room.host_id && (
                              <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 border-2 border-background">
                                 <Play className="w-2 h-2 text-black fill-current" />
                              </div>
                           )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-black italic uppercase tracking-tight">{p.profile?.nickname || "PILOT"}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest opacity-40">
                            {p.user_id === room.host_id ? "COMMANDER" : "OPERATIVE"}
                          </span>
                        </div>
                      </div>
                      {room.status === 'lobby' ? (
                        p.is_ready ? (
                          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-white/10" />
                        )
                      ) : (
                         <div className="text-[10px] font-mono font-black italic text-primary">{p.wpm} WPM</div>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="bg-panel/10 backdrop-blur-xl border-white/5 rounded-[2.5rem] overflow-hidden p-8 space-y-4">
                 <div className="flex items-center gap-3 text-primary">
                    <Zap className="w-5 h-5 fill-current" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Tactical Briefing</span>
                 </div>
                 <p className="text-xs font-medium italic text-muted-foreground leading-relaxed">
                    Focus on consistency. In multiplayer engagements, a single error can compromise your velocity flow.
                 </p>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
