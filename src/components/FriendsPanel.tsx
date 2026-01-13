import { useEffect, useState } from "react";
import { useFriendsStore } from "@/store/useFriendsStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserMinus, Sword, Activity, Clock, Zap } from "lucide-react";
import { toast } from "sonner";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { useNavigate } from "react-router-dom";

export function FriendsPanel() {
  const { following, fetchFollowing, unfollowUser, activityFeed, fetchActivityFeed } = useFriendsStore();
  const { createRoom } = useMultiplayerStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'following' | 'activity'>('activity');

  useEffect(() => {
    fetchFollowing();
    fetchActivityFeed();
  }, [fetchFollowing, fetchActivityFeed]);

  const handleChallenge = async (userId: string) => {
    const code = await createRoom(true);
    if (code) {
      toast.success("Race room created!");
      navigate(`/race/${code}`);
    }
  };

  return (
    <Card className="bg-panel/40 border-border/50 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Friends & Activity</CardTitle>
            <CardDescription>Stay connected with your typing circle.</CardDescription>
          </div>
          <div className="flex gap-1 p-1 bg-muted/30 rounded-lg">
             <Button 
               variant={activeTab === 'activity' ? "secondary" : "ghost"} 
               size="sm" 
               onClick={() => setActiveTab('activity')}
               className="h-8 px-3"
             >
               Activity
             </Button>
             <Button 
               variant={activeTab === 'following' ? "secondary" : "ghost"} 
               size="sm" 
               onClick={() => setActiveTab('following')}
               className="h-8 px-3"
             >
               Following
             </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {activeTab === 'activity' ? (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {activityFeed.length > 0 ? (
              activityFeed.map((activity) => {
                const activityData = activity.data as { mode?: string; wpm?: number; accuracy?: number };
                return (
                <div key={activity.id} className="flex gap-4 p-3 rounded-lg bg-muted/10 border border-border/20">
                  <Avatar className="h-10 w-10 border border-primary/20">
                    <AvatarImage src={activity.profile?.avatar_url} />
                    <AvatarFallback>{activity.profile?.nickname?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                       <span className="font-medium text-sm">
                         {activity.profile?.nickname || "Typist"}
                       </span>
                       <span className="text-[10px] text-muted-foreground">
                         {new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                       <Activity className="w-3 h-3" />
                       Completed a {activityData.mode || 'typing'} test
                    </p>
                    <div className="flex gap-2 mt-2">
                       <Badge variant="outline" className="text-[10px] font-mono h-5 gap-1 bg-primary/5">
                         <Zap className="w-3 h-3 text-primary" />
                         {activityData.wpm || 0} WPM
                       </Badge>
                       <Badge variant="outline" className="text-[10px] font-mono h-5 gap-1 bg-secondary/5">
                         <Clock className="w-3 h-3 text-secondary" />
                         {activityData.accuracy || 0}%
                       </Badge>
                    </div>
                  </div>
                </div>
              );
              })
            ) : (
              <p className="text-center text-muted-foreground py-8">No recent activity from people you follow.</p>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            {following.length > 0 ? (
              following.map((friend) => (
                <div key={friend.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 border border-border/20">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-primary/30">
                       <AvatarImage src={friend.avatar_url} />
                       <AvatarFallback>{friend.nickname?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                       <div className="font-medium">{friend.nickname || "Typist"}</div>
                       <div className="text-[10px] text-muted-foreground flex items-center gap-1">
                         Best: <span className="text-primary font-mono">{(friend as { wpm_best?: number }).wpm_best || 0} WPM</span>
                       </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-primary" 
                      onClick={() => handleChallenge(friend.id)}
                      title="Challenge"
                    >
                      <Sword className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-destructive"
                      onClick={() => unfollowUser(friend.id)}
                      title="Unfollow"
                    >
                      <UserMinus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">You haven't followed anyone yet.</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
