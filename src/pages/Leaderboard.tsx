import { Header } from "@/components/Header";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Trophy, Medal, Crown, Timer, Target, User, UserPlus, UserMinus, Sword } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useFriendsStore } from "@/store/useFriendsStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface LeaderboardEntry {
  id: string;
  wpm: number;
  accuracy: number;
  mode: string;
  duration: number;
  timestamp: string;
  profiles?: {
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

  useEffect(() => {
    fetchLeaderboard();
    if (user) fetchFollowing();
  }, [activeTab, user]);

  const handleChallenge = async (profileId: string) => {
    if (!user) {
      toast.error("Sign in to challenge others!");
      return;
    }
    const code = await createRoom(true); // Private room
    if (code) {
      toast.success("Room created! Send the link to your friend.");
      navigate(`/race/${code}`);
    }
  };

  const fetchLeaderboard = async () => {
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
        console.error('Database join error, falling back to basic query:', error);
        // Fallback: Fetch results without profiles if join fails
        const { data: simpleData, error: simpleError } = await supabase
          .from('test_results')
          .select('id, wpm, accuracy, mode, duration, timestamp')
          .order('wpm', { ascending: false })
          .limit(50);
        
        if (simpleError) throw simpleError;
        setEntries((simpleData as any) || []);
      } else {
        setEntries((data as any) || []);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Crown className="h-6 w-6 text-yellow-400" />;
      case 1: return <Medal className="h-6 w-6 text-slate-300" />;
      case 2: return <Medal className="h-6 w-6 text-amber-600" />;
      default: return <span className="font-mono text-muted-foreground w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Global Leaderboard
            </h1>
            <p className="text-muted-foreground">
              See how you stack up against the fastest typists in the world.
            </p>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
            <div className="flex justify-center mb-6">
              <TabsList className="grid w-full max-w-md grid-cols-4 bg-primary/5 border-primary/10">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="time">Time</TabsTrigger>
                <TabsTrigger value="words">Words</TabsTrigger>
                <TabsTrigger value="quote">Quote</TabsTrigger>
              </TabsList>
            </div>

            <Card className="glass-lg border-primary/20">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-primary/10 bg-primary/5">
                        <th className="px-6 py-4 text-left text-sm font-semibold">Rank</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold">Typist</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">WPM</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Accuracy</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Mode</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Date</th>
                        <th className="px-6 py-4 text-right text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {isLoading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                          <tr key={i} className="border-b border-primary/5">
                            <td className="px-6 py-4"><Skeleton className="h-6 w-8" /></td>
                            <td className="px-6 py-4"><Skeleton className="h-6 w-32" /></td>
                            <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-12 ml-auto" /></td>
                            <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-12 ml-auto" /></td>
                            <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-16 ml-auto" /></td>
                            <td className="px-6 py-4 text-right"><Skeleton className="h-6 w-20 ml-auto" /></td>
                          </tr>
                        ))
                      ) : entries.length > 0 ? (
                        entries.map((entry, index) => (
                          <tr 
                            key={entry.id} 
                            className="border-b border-primary/5 hover:bg-primary/5 transition-colors group"
                          >
                            <td className="px-6 py-4">{getRankIcon(index)}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                  <User className="h-4 w-4 text-primary" />
                                </div>
                                <span className="font-medium">
                                  {entry.profiles?.nickname || `Typist_${entry.id.slice(0, 4)}`}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-primary italic">
                              {entry.wpm}
                            </td>
                            <td className="px-6 py-4 text-right text-muted-foreground">
                              {entry.accuracy}%
                            </td>
                            <td className="px-6 py-4 text-right">
                              <Badge variant="outline" className="capitalize text-[10px] h-5">
                                {entry.mode} {entry.duration}s
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right text-xs text-muted-foreground font-mono">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                {entry.profiles?.id !== user?.id && entry.profiles?.id && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => isFollowing(entry.profiles!.id) 
                                        ? unfollowUser(entry.profiles!.id) 
                                        : followUser(entry.profiles!.id)}
                                      title={isFollowing(entry.profiles!.id) ? "Unfollow" : "Follow"}
                                    >
                                      {isFollowing(entry.profiles!.id) ? <UserMinus className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-primary"
                                      onClick={() => handleChallenge(entry.profiles!.id)}
                                      title="Challenge"
                                    >
                                      <Sword className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                            No records found yet. Be the first to top the leaderboard!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
