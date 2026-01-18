// Build: 20251114
import { useTypingStore } from "@/store/useTypingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { 
  Trophy, 
  Calendar, 
  Clock, 
  Target, 
  Keyboard, 
  Trash2, 
  ChevronLeft, 
  Activity, 
  Zap,
  BarChart3,
  History as HistoryIcon,
  Flame
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function History() {
  const { history, clearHistory, loadHistory } = useTypingStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (history.length === 0) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-12 rounded-3xl bg-panel/10 backdrop-blur-xl border border-white/5 space-y-8"
        >
          <div className="relative mx-auto w-32 h-32">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative bg-background/50 rounded-full w-full h-full flex items-center justify-center border border-primary/20">
              <HistoryIcon className="w-16 h-16 text-primary" />
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">NO HISTORY DATA</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your mechanical prowess hasn't been recorded yet. Launch a session to begin your journey.
            </p>
          </div>
          <Button 
            onClick={() => navigate("/")} 
            className="w-full bg-primary hover:bg-primary/90 h-14 rounded-2xl font-black italic tracking-widest text-lg shadow-xl shadow-primary/20 gap-3"
          >
            <Keyboard className="w-6 h-6" />
            INITIALIZE TEST
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 pt-12">
      <main className="container mx-auto px-4">
        <motion.div 
          className="max-w-5xl mx-auto space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/statistics")}
                  className="rounded-full h-8 w-8 p-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
                  <Flame className="w-3 h-3 mr-1" /> Archive Overview
                </Badge>
              </div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-foreground to-foreground/50 bg-clip-text text-transparent italic tracking-tight">
                TEST HISTORY
              </h1>
              <p className="text-muted-foreground font-medium">
                Detailed breakdown of your session chronology.
              </p>
            </div>

            <Button
              variant="destructive"
              size="lg"
              onClick={clearHistory}
              className="rounded-2xl font-bold gap-2 bg-destructive/10 hover:bg-destructive text-destructive hover:text-destructive-foreground border border-destructive/20 transition-all duration-300 shadow-lg shadow-destructive/5"
            >
              <Trash2 className="w-5 h-5" />
              CLEAR ARCHIVE
            </Button>
          </div>

          <Separator className="opacity-10" />

          {/* History List */}
          <div className="grid gap-6">
            <AnimatePresence>
              {[...history].reverse().map((result, idx) => (
                <motion.div
                  key={result.id}
                  variants={itemVariants}
                  layout
                >
                  <Card className="group relative overflow-hidden border-white/5 bg-panel/10 backdrop-blur-xl hover:bg-panel/20 hover:border-primary/30 transition-all duration-500">
                    <CardContent className="p-0">
                      <div className="flex flex-col md:flex-row md:items-stretch">
                        {/* Speed Tag */}
                        <div className="p-8 md:w-48 bg-primary/5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5 group-hover:bg-primary/10 transition-colors">
                          <span className="text-5xl font-black italic tracking-tighter text-primary">
                            {result.wpm}
                          </span>
                          <span className="text-[10px] font-black uppercase tracking-widest text-primary/60 mt-1">
                            WPM
                          </span>
                        </div>

                        {/* Details */}
                        <div className="flex-1 p-8 space-y-6">
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-6">
                              <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <Calendar className="h-3.5 w-3.5" />
                                <span className="text-xs font-bold uppercase tracking-wider">
                                  {new Date(result.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                                <Clock className="h-3.5 w-3.5" />
                                <span className="text-xs font-bold uppercase tracking-wider opacity-80">
                                  {result.mode} {result.wordCount || result.duration} {result.mode === 'words' ? 'words' : 's'}
                                </span>
                              </div>
                            </div>

                            {result.isPB && (
                              <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-4 py-1.5 rounded-xl font-black italic uppercase tracking-tighter animate-pulse shadow-lg shadow-amber-500/10">
                                <Trophy className="h-3.5 w-3.5 mr-1.5" /> New Record
                              </Badge>
                            )}
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Target className="w-3.5 h-3.5 text-emerald-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Accuracy</span>
                              </div>
                              <div className="text-2xl font-black italic tabular-nums text-foreground">
                                {result.accuracy}%
                              </div>
                              <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-emerald-500 rounded-full" 
                                  style={{ width: `${result.accuracy}%` }}
                                />
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Zap className="w-3.5 h-3.5 text-amber-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Raw Speed</span>
                              </div>
                              <div className="text-2xl font-black italic tabular-nums text-foreground">
                                {result.rawWpm}
                              </div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 italic">Speed before errors</p>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                                <Activity className="w-3.5 h-3.5 text-indigo-500" />
                                <span className="text-[10px] font-bold uppercase tracking-widest">Consistency</span>
                              </div>
                              <div className="text-2xl font-black italic tabular-nums text-foreground">
                                {result.consistency || 0}%
                              </div>
                              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40 italic">Rhythm stability</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

