// Build: 20251114
import { Settings, BarChart3, Keyboard, LineChart, LogIn, LogOut, User, Trophy, Users, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "./AuthModal";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useTypingStore } from "@/store/useTypingStore";
import { cn } from "@/lib/utils";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, isLoading } = useAuthStore();
  const { isRunning, testMode } = useTypingStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out",
      (isScrolled || !isHome) ? "bg-background/80 backdrop-blur-xl border-b border-border/40 shadow-lg shadow-black/5" : "bg-transparent border-b border-transparent",
      isRunning && "opacity-0 hover:opacity-100 focus-within:opacity-100"
    )}>
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 sm:gap-2.5 text-lg sm:text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 group"
        >
          <div className="relative group-hover:scale-105 transition-transform duration-300">
            <img
              src="/logo.png"
              alt="TypeFlow Logo"
              className="w-16 h-16 object-contain drop-shadow-lg"
            />
          </div>
          <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] bg-clip-text text-transparent group-hover:animate-gradient-shift transition-all duration-300">
            TypeFlow
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {[
            { path: "/", icon: Home, label: "Home" },
            { path: "/statistics", icon: LineChart, label: "Statistics" },
            { path: "/leaderboard", icon: Trophy, label: "Leaderboard" },
            { path: "/multiplayer", icon: Users, label: "Multiplayer" },
            { path: "/history", icon: BarChart3, label: "History" },
            { path: "/settings", icon: Settings, label: "Settings" }
          ].map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div key={item.path} className="relative group">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "relative h-10 w-10 rounded-xl transition-all duration-200 z-10",
                    isActive 
                      ? "text-primary bg-primary/10 shadow-[0_0_15px_rgba(168,85,247,0.15)] border border-primary/20" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                  title={item.label}
                >
                  <item.icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "text-primary drop-shadow-[0_0_8px_rgba(168,85,247,0.5)] scale-110",
                    !isActive && "group-hover:scale-110"
                  )} />
                  
                  {/* Active Indicator Dot (Bottom) */}
                  {isActive && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full shadow-[0_0_5px_rgba(168,85,247,0.8)]" />
                  )}
                </Button>
              </div>
            );
          })}

          <div className="w-px h-6 bg-gradient-to-b from-transparent via-border/50 to-transparent mx-0.5 sm:mx-1 md:mx-2" />

          {isLoading ? (
            <div className="h-9 w-9 rounded-full bg-primary/10 animate-pulse border border-primary/20" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9 border border-primary/20 transition-transform hover:scale-105">
                    <AvatarImage src={profile?.avatar_url || user.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-primary/10 text-primary uppercase font-bold text-xs">
                      {(profile?.nickname || user.email)?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 glass-lg border-primary/20" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none truncate">
                      {profile?.nickname || "Typist"}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Account Settings</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/statistics")}>
                  <LineChart className="mr-2 h-4 w-4" />
                  <span>Your Progress</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-3 sm:px-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-primary/20 flex items-center gap-1.5 sm:gap-2 text-sm touch-manipulation"
            >
              <LogIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">Sign In</span>
            </Button>
          )}
        </nav>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}


