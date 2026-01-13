// Build: 20251114
import { Settings, BarChart3, Keyboard, LineChart, LogIn, LogOut, User, Trophy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";
import { AuthModal } from "./AuthModal";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut, isLoading } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/30 bg-background/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2.5 text-xl md:text-2xl font-bold tracking-tight transition-all duration-300 group"
        >
          <div className="relative p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:from-primary/30 group-hover:to-secondary/30 transition-all duration-300">
            <Keyboard className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-primary via-primary/0 to-secondary opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
          </div>
          <span className="bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent group-hover:via-primary transition-all duration-300">
            TypeFlow
          </span>
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/statistics")}
            className="relative h-10 w-10 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all duration-200 group"
            title="Statistics"
          >
            <LineChart className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
            <span className="absolute inset-0 rounded-lg bg-primary/0 group-hover:bg-primary/5 transition-colors duration-200" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/leaderboard")}
            className="relative h-10 w-10 rounded-lg text-muted-foreground hover:text-yellow-500 hover:bg-yellow-500/5 transition-all duration-200 group"
            title="Leaderboard"
          >
            <Trophy className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
            <span className="absolute inset-0 rounded-lg bg-yellow-500/0 group-hover:bg-yellow-500/5 transition-colors duration-200" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/multiplayer")}
            className="relative h-10 w-10 rounded-lg text-muted-foreground hover:text-cyan-500 hover:bg-cyan-500/5 transition-all duration-200 group"
            title="Multiplayer"
          >
            <Users className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
            <span className="absolute inset-0 rounded-lg bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-200" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/history")}
            className="relative h-10 w-10 rounded-lg text-muted-foreground hover:text-secondary hover:bg-secondary/5 transition-all duration-200 group"
            title="History"
          >
            <BarChart3 className="h-5 w-5 transition-transform group-hover:scale-110 duration-200" />
            <span className="absolute inset-0 rounded-lg bg-secondary/0 group-hover:bg-secondary/5 transition-colors duration-200" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/settings")}
            className="relative h-10 w-10 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all duration-200 group"
            title="Settings"
          >
            <Settings className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
            <span className="absolute inset-0 rounded-lg bg-accent/0 group-hover:bg-accent/5 transition-colors duration-200" />
          </Button>

          <div className="w-px h-6 bg-border/50 mx-1 md:mx-2" />

          {isLoading ? (
            <div className="h-9 w-9 rounded-full bg-primary/10 animate-pulse border border-primary/20" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <Avatar className="h-9 w-9 border border-primary/20 transition-transform hover:scale-105">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
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
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-9 px-4 rounded-lg font-medium transition-all duration-200 shadow-sm hover:shadow-primary/20 flex items-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Sign In</span>
            </Button>
          )}
        </nav>
      </div>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </header>
  );
}


