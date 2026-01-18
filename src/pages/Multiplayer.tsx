import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Users, 
  Plus, 
  Play, 
  Lock, 
  Globe, 
  Sword, 
  Zap, 
  ChevronRight,
  MonitorPlay,
  Share2
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiplayerStore } from "@/store/useMultiplayerStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Multiplayer() {
  const [joinCode, setJoinCode] = useState("");
  const { createRoom, joinRoom, isLoading } = useMultiplayerStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleCreateRoom = async (isPrivate: boolean) => {
    if (!user) {
      toast.error("Authentication required to host races.");
      return;
    }
    const code = await createRoom(isPrivate);
    if (code) {
      navigate(`/race/${code}`);
    } else {
      toast.error("Failed to initialize room protocol.");
    }
  };

  const handleJoinByCode = async () => {
    if (!user) {
      toast.error("Auchtentication required to join races.");
      return;
    }
    if (!joinCode) return;
    const success = await joinRoom(joinCode);
    if (success) {
      navigate(`/race/${joinCode.toUpperCase()}`);
    } else {
      toast.error("Incompatible room code or session expired.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen pb-20 pt-16 overflow-hidden">
      <main className="container mx-auto px-4 relative">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        
        <motion.div 
          className="max-w-5xl mx-auto space-y-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <motion.div variants={containerVariants} className="flex flex-col items-center gap-4">
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1.5 px-4 rounded-full font-black italic tracking-widest uppercase">
                <Sword className="w-3.5 h-3.5 mr-2" /> Realtime Combat
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent italic tracking-tighter uppercase leading-tight">
                MULTIPLAYER <br /> ARCHITECTURE
              </h1>
              <p className="text-muted-foreground text-lg font-medium max-w-2xl mx-auto opacity-70">
                Synchronize your keystrokes. Compete in high-frequency typing battles 
                engineered for maximum velocity and zero latency.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Create Room Card */}
            <motion.div variants={cardVariants}>
              <Card className="group relative overflow-hidden h-full border-white/5 bg-panel/10 backdrop-blur-2xl hover:bg-panel/20 hover:border-primary/30 transition-all duration-500 rounded-[2.5rem] p-4">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <MonitorPlay className="w-32 h-32" />
                 </div>
                 <CardHeader className="pt-8 px-6">
                   <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Plus className="w-8 h-8 text-primary" />
                   </div>
                   <CardTitle className="text-3xl font-black italic tracking-tight">INITIALIZE SESSION</CardTitle>
                   <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Generate a new competitive environment</CardDescription>
                 </CardHeader>
                 <CardContent className="px-6 pb-8 space-y-4">
                    <Button 
                      onClick={() => handleCreateRoom(false)}
                      disabled={isLoading}
                      className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black italic tracking-widest text-lg shadow-xl shadow-primary/20 gap-3"
                    >
                      <Globe className="w-5 h-5" /> PUBLIC ARENA
                    </Button>
                    <Button 
                      onClick={() => handleCreateRoom(true)}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full h-16 rounded-2xl border-white/10 hover:bg-white/5 font-black italic tracking-widest gap-3"
                    >
                      <Lock className="w-5 h-5" /> PRIVATE DUEL
                    </Button>
                 </CardContent>
              </Card>
            </motion.div>

            {/* Join Room Card */}
            <motion.div variants={cardVariants}>
               <Card className="group relative overflow-hidden h-full border-white/5 bg-panel/10 backdrop-blur-2xl hover:bg-secondary/20 hover:border-secondary/30 transition-all duration-500 rounded-[2.5rem] p-4">
                 <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Share2 className="w-32 h-32" />
                 </div>
                 <CardHeader className="pt-8 px-6">
                   <div className="bg-secondary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
                      <Users className="w-8 h-8 text-secondary" />
                   </div>
                   <CardTitle className="text-3xl font-black italic tracking-tight">LINK PROTOCOL</CardTitle>
                   <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Synchronize with an existing session</CardDescription>
                 </CardHeader>
                 <CardContent className="px-6 pb-8 space-y-6">
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Access Token</label>
                       <div className="flex gap-3">
                          <Input 
                            placeholder="CODE-X" 
                            value={joinCode}
                            onChange={(e) => setJoinCode(e.target.value)}
                            className="h-16 rounded-2xl bg-white/5 border-white/5 focus:border-secondary/50 focus:ring-secondary/20 font-black italic tracking-[0.2em] text-center text-xl uppercase"
                          />
                          <Button 
                            onClick={handleJoinByCode}
                            disabled={isLoading || !joinCode}
                            className="h-16 px-8 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-2xl font-black italic tracking-widest shadow-xl shadow-secondary/20"
                          >
                            JOIN
                          </Button>
                       </div>
                    </div>
                    <div className="pt-4 flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">
                       <Zap className="w-3 h-3" /> Realtime data sync enabled
                    </div>
                 </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
