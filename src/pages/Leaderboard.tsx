import { supabase } from "@/lib/supabase";
import { useEffect, useState, useCallback } from "react";
import { Trophy, Medal, Crown, Timer, Target, User, UserPlus, UserMinus, Sword, ChevronRight, Activity, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useFriendsStore } from "@/store/useFriendsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LeaderboardEntry {
  id: string;
  wpm: number;
  accuracy: number;
  mode: string;
  duration: number;
  timestamp: string;
  profiles?: {
    id: string;
    nickname: string;
    avatar_url: string | null;
  };
}

export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  const { user } = useAuthStore();
  const { following, fetchFollowing, followUser, unfollowUser, isFollowing } = useFriendsStore();
  const { createRoom } = useMultiplayerStore();
  const navigate = useNavigate();

  const fetchLeaderboard = useCallback(async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from('test_results')
        .select(`
          id, wpm, accuracy, mode, duration, timestamp,
          profiles (id, nickname, avatar_url)
        `)
        .order('wpm', { ascending: false })
        .limit(50);

      if (activeTab !== "all") {
        query = query.eq('mode', activeTab);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Database join error:', error);
        const { data: simpleData, error: simpleError } = await supabase
          .from('test_results')
          .select('id, wpm, accuracy, mode, duration, timestamp')
          .order('wpm', { ascending: false })
          .limit(50);

        if (simpleError) throw simpleError;
        setEntries(simpleData as unknown as LeaderboardEntry[]);
      } else {
        setEntries(data as unknown as LeaderboardEntry[]);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchLeaderboard();
    if (user) fetchFollowing();
  }, [activeTab, user, fetchFollowing, fetchLeaderboard]);

  const handleChallenge = async (profileId: string) => {
    if (!user) {
      toast.error("Sign in to challenge others!");
      return;
    }
    const code = await createRoom(true); 
    if (code) {
      toast.success("Room created! Send the link to your friend.");
      navigate(`/race/${code}`);
    }
  };

  const getRankStyle = (index: number) => {
    switch (index) {
      case 0: return { icon: Crown, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20", shadow: "shadow-amber-400/20" };
      case 1: return { icon: Medal, color: "text-slate-300", bg: "bg-slate-300/10", border: "border-slate-300/20", shadow: "shadow-slate-300/20" };
      case 2: return { icon: Medal, color: "text-amber-600", bg: "bg-amber-600/10", border: "border-amber-600/20", shadow: "shadow-amber-600/20" };
      default: return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pb-20 pt-12">
      <main className="container mx-auto px-4">
        <motion.div 
          className="max-w-6xl mx-auto space-y-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Header Section */}
          <div className="relative group text-center space-y-4">
             <div className="inline-flex items-center gap-2">
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
                  <Trophy className="w-3 h-3 mr-1" /> Global Rankings
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent italic tracking-tight uppercase">
                Hall of Speed
              </h1>
              <p className="text-muted-foreground font-medium max-w-xl mx-auto">
                Witness the upper echelons of mechanical proficiency. 
                Where every millisecond dictates the hierarchy.
              </p>
          </div>

          <Tabs defaultValue="all" className="w-full space-y-8" onValueChange={setActiveTab}>
            <div className="flex justify-center">
              <TabsList className="bg-panel/10 backdrop-blur-md border border-white/5 p-1 rounded-2xl h-14">
                {['all', 'time', 'words', 'quote'].map((tab) => (
                  <TabsTrigger 
                    key={tab} 
                    value={tab} 
                    className="px-8 rounded-xl font-black italic uppercase tracking-widest text-xs transition-all data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    {tab}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <Card className="border-white/5 bg-panel/5 backdrop-blur-xl overflow-hidden rounded-3xl shadow-2xl">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white/5">
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">Rank</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5">Typist</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 text-right">Speed</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 text-right">Accuracy</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 text-right">Mode</th>
                        <th className="px-8 py-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground border-b border-white/5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <AnimatePresence mode="wait">
                      {isLoading ? (
                        <tbody>
                          {Array.from({ length: 10 }).map((_, i) => (
                            <tr key={i} className="border-b border-white/5">
                              <td className="px-8 py-6"><Skeleton className="h-8 w-8 rounded-lg bg-white/5" /></td>
                              <td className="px-8 py-6">
                                <div className="flex items-center gap-3">
                                  <Skeleton className="h-10 w-10 rounded-full bg-white/5" />
                                  <Skeleton className="h-4 w-32 bg-white/5" />
                                </div>
                              </td>
                              <td className="px-8 py-6"><Skeleton className="h-6 w-16 ml-auto bg-white/5" /></td>
                              <td className="px-8 py-6"><Skeleton className="h-6 w-12 ml-auto bg-white/5" /></td>
                              <td className="px-8 py-6"><Skeleton className="h-6 w-20 ml-auto bg-white/5" /></td>
                              <td className="px-8 py-6"><Skeleton className="h-8 w-8 ml-auto bg-white/5 rounded-full" /></td>
                            </tr>
                          ))}
                        </tbody>
                      ) : (
                        <motion.tbody
                          key={activeTab}
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                          className="divide-y divide-white/5"
                        >
                          {entries.map((entry, index) => {
                            const rankStyle = getRankStyle(index);
                            const RankIcon = rankStyle?.icon;
                            
                            return (
                              <motion.tr
                                key={entry.id}
                                variants={itemVariants}
                                className={cn(
                                  "group hover:bg-white/[0.02] transition-colors relative",
                                  user?.id === entry.profiles?.id && "bg-primary/[0.03]"
                                )}
                              >
                                <td className="px-8 py-6">
                                  <div className="flex items-center justify-center w-10 h-10">
                                    {RankIcon ? (
                                      <div className={cn("p-2 rounded-xl border relative group-hover:scale-110 transition-transform duration-500", rankStyle.bg, rankStyle.border, rankStyle.shadow)}>
                                        <RankIcon className={cn("w-5 h-5", rankStyle.color)} />
                                      </div>
                                    ) : (
                                      <span className="font-mono text-sm font-black text-muted-foreground/40">{index + 1}</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                    <div className="relative">
                                      <Avatar className="h-11 w-11 border-2 border-white/10 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                                        <AvatarImage src={entry.profiles?.avatar_url || ""} />
                                        <AvatarFallback className="bg-white/5 text-[10px] font-black">
                                          {entry.profiles?.nickname?.substring(0, 2).toUpperCase() || "TY"}
                                        </AvatarFallback>
                                      </Avatar>
                                      {index < 3 && (
                                        <div className={cn("absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-background", rankStyle?.bg.replace('/10', ''))} />
                                      )}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="font-black italic tracking-tight text-foreground">
                                        {entry.profiles?.nickname || `TYPIST_${entry.id.slice(0, 4)}`}
                                      </span>
                                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">
                                        Joined {new Date(entry.timestamp).toLocaleDateString()}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex flex-col items-end">
                                    <span className="text-2xl font-black italic tracking-tighter text-primary">
                                      {entry.wpm}
                                    </span>
                                    <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest">WPM</span>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex flex-col items-end">
                                    <span className="text-xl font-black italic tracking-tighter text-foreground">
                                      {entry.accuracy}%
                                    </span>
                                    <div className="w-16 h-1 bg-white/5 rounded-full mt-1 overflow-hidden">
                                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${entry.accuracy}%` }} />
                                    </div>
                                  </div>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <Badge variant="outline" className="bg-white/5 border-white/10 rounded-lg px-3 py-1 font-black italic text-[10px] uppercase tracking-widest text-muted-foreground">
                                    {entry.mode} {entry.duration}
                                  </Badge>
                                </td>
                                <td className="px-8 py-6 text-right">
                                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                                    {entry.profiles?.id !== user?.id && entry.profiles?.id && (
                                       <>
                                       <Button
                                         variant="ghost"
                                         size="icon"
                                         className="h-9 w-9 rounded-xl hover:bg-primary/20 hover:text-primary border border-transparent hover:border-primary/20"
                                         onClick={() => isFollowing(entry.profiles!.id)
                                           ? unfollowUser(entry.profiles!.id)
                                           : followUser(entry.profiles!.id)}
                                       >
                                         {isFollowing(entry.profiles!.id) ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                       </Button>
                                       <Button
                                         variant="ghost"
                                         size="icon"
                                         className="h-9 w-9 rounded-xl hover:bg-secondary/20 hover:text-secondary border border-transparent hover:border-secondary/20"
                                         onClick={() => handleChallenge(entry.profiles!.id)}
                                       >
                                         <Sword className="h-4 w-4" />
                                       </Button>
                                     </>
                                    )}
                                  </div>
                                </td>
                              </motion.tr>
                            );
                          })}
                        </motion.tbody>
                      )}
                    </AnimatePresence>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
}

