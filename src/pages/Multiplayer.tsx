import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus, Play, Lock, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";

export default function Multiplayer() {
  const [joinCode, setJoinCode] = useState("");
  const { createRoom, joinRoom, isLoading } = useMultiplayerStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleCreateRoom = async (isPrivate: boolean) => {
    if (!user) {
      toast.error("You must be logged in to create a room");
      return;
    }
    const code = await createRoom(isPrivate);
    if (code) {
      navigate(`/race/${code}`);
    } else {
      toast.error("Failed to create room");
    }
  };

  const handleJoinByCode = async () => {
    if (!user) {
      toast.error("You must be logged in to join a room");
      return;
    }
    if (!joinCode) return;
    const success = await joinRoom(joinCode);
    if (success) {
      navigate(`/race/${joinCode.toUpperCase()}`);
    } else {
      toast.error("Room not found or race already started");
    }
  };

  return (
    <div>
      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
              Typing Races
            </h1>
            <p className="text-muted-foreground text-lg">
              Challenge your friends or compete with the community in real-time.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-panel/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-primary" />
                  Create a Race
                </CardTitle>
                <CardDescription>
                  Start a new race and invite others to join.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={() => handleCreateRoom(false)} 
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  <Globe className="w-4 h-4" />
                  Create Public Room
                </Button>
                <Button 
                  onClick={() => handleCreateRoom(true)} 
                  variant="outline" 
                  className="w-full gap-2"
                  disabled={isLoading}
                >
                  <Lock className="w-4 h-4" />
                  Create Private Room
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-panel/50 border-border/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-secondary" />
                  Join a Race
                </CardTitle>
                <CardDescription>
                  Enter a room code to join a private or public match.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter Room Code (e.g. AB12XY)" 
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    className="uppercase"
                  />
                  <Button onClick={handleJoinByCode} disabled={isLoading || !joinCode}>
                    Join
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
