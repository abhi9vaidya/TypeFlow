// Build: 20251114
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Home, ShieldAlert, WifiOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: Sector not found:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center relative overflow-hidden bg-background">
      {/* Glitch Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary rounded-full blur-[160px] animate-pulse" />
      </div>

      <motion.div 
        className="text-center space-y-8 relative z-10 px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-center mb-12">
           <div className="relative">
              <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl animate-ping" />
              <div className="w-24 h-24 rounded-[2rem] bg-panel/20 backdrop-blur-xl border border-rose-500/20 flex items-center justify-center relative z-10">
                 <ShieldAlert className="w-12 h-12 text-rose-500" />
              </div>
           </div>
        </div>

        <div className="space-y-4">
          <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 py-1 px-4 font-black italic uppercase tracking-[0.3em]">
             CRITICAL ERROR 404
          </Badge>
          <h1 className="text-7xl md:text-9xl font-black italic tracking-tighter uppercase leading-none bg-gradient-to-b from-foreground to-foreground/20 bg-clip-text text-transparent">
             SECTOR<br/>UNKNOWN
          </h1>
          <p className="text-xl text-muted-foreground font-medium italic max-w-md mx-auto">
            System was unable to resolve the coordinate: <span className="text-rose-400 opacity-60 font-mono tracking-tight underline underline-offset-4">{location.pathname}</span>
          </p>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-center gap-6">
          <Button 
            onClick={() => navigate("/")}
            className="h-16 px-12 rounded-2xl bg-foreground text-background font-black italic uppercase tracking-widest hover:scale-105 transition-all shadow-2xl border border-white/10 group"
          >
            <Home className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform" />
            EVAC TO HOME
          </Button>
          <Button 
            variant="ghost"
            onClick={() => navigate(-1)}
            className="h-16 px-12 rounded-2xl bg-white/5 border border-white/5 font-black italic uppercase tracking-widest hover:bg-white/10 transition-all text-muted-foreground"
          >
            REVERSE STEP
          </Button>
        </div>

        <div className="pt-20 opacity-20">
           <div className="flex items-center justify-center gap-3 font-mono text-[10px] uppercase font-black tracking-[0.4em]">
              <WifiOff className="h-3 w-3" />
              LOST IN THE FLOW
           </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;

