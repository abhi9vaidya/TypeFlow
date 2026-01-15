// Build: 20251114
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TypingTest from "./pages/TypingTest";
import History from "./pages/History";
import Settings from "./pages/Settings";
import Statistics from "./pages/Statistics";
import Leaderboard from "./pages/Leaderboard";
import Account from "./pages/Account";
import Multiplayer from "./pages/Multiplayer";
import RaceRoom from "./pages/RaceRoom";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useTypingStore } from "./store/useTypingStore";
import { supabase } from "./lib/supabase";

const queryClient = new QueryClient();

const App = () => {
  const setUser = useAuthStore((state) => state.setUser);
  const syncHistory = useTypingStore((state) => state.syncHistory);

  useEffect(() => {
    // Listen for auth changes
    // This will handle the initial session AND any changes (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUser(user);

      // If user just logged in, sync their local history
      if (user) {
        syncHistory();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setUser, syncHistory]);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<TypingTest />} />
                <Route path="/history" element={<History />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/account" element={<Account />} />
                <Route path="/multiplayer" element={<Multiplayer />} />
                <Route path="/race/:code" element={<RaceRoom />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <footer className="w-full py-4 text-center text-sm text-muted-foreground border-t border-border/20 bg-gradient-to-t from-background/80 to-transparent backdrop-blur-sm">
              <span className="opacity-70 hover:opacity-100 transition-opacity duration-300">
                Created by Abhinav Vaidya :)
              </span>
            </footer>
          </div>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

