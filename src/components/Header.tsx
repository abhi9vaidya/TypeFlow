// Build: 20251114
import { Settings, BarChart3, Keyboard, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  onSettingsClick?: () => void;
}

export function Header({ onSettingsClick }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const isTypingPage = location.pathname === "/";

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
            onClick={() => {
              if (isTypingPage && onSettingsClick) {
                onSettingsClick();
              } else {
                navigate("/settings");
              }
            }}
            className="relative h-10 w-10 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/5 transition-all duration-200 group"
            title="Settings"
          >
            <Settings className="h-5 w-5 transition-transform group-hover:rotate-90 duration-300" />
            <span className="absolute inset-0 rounded-lg bg-accent/0 group-hover:bg-accent/5 transition-colors duration-200" />
          </Button>
        </nav>
      </div>
    </header>
  );
}

