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
import About from "./pages/About";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import { Footer } from "./components/Footer";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useTypingStore } from "./store/useTypingStore";
import { supabase } from "./lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { useSettingsStore } from "@/store/useSettingsStore";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex-1 w-full"
    >
      {children}
    </motion.div>
  );
}

const AppContent = () => {
  const location = useLocation();
  const { navbarLayout } = useSettingsStore();

  return (
    <div className={cn(
      "min-h-screen flex flex-col transition-all duration-300",
      navbarLayout === 'vertical' ? "pl-20" : "pt-24"
    )}>
      {navbarLayout === 'vertical' ? <Sidebar /> : <Header />}

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><TypingTest /></PageTransition>} />
            <Route path="/history" element={<PageTransition><History /></PageTransition>} />
            <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            <Route path="/statistics" element={<PageTransition><Statistics /></PageTransition>} />
            <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
            <Route path="/account" element={<PageTransition><Account /></PageTransition>} />
            <Route path="/multiplayer" element={<PageTransition><Multiplayer /></PageTransition>} />
            <Route path="/race/:code" element={<PageTransition><RaceRoom /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/privacy" element={<PageTransition><Privacy /></PageTransition>} />
            <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
            <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
};

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
          <ScrollToTop />
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

