// Build: 20251114
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Keyboard, Volume2, Palette, Type } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-2xl mx-auto animate-fade-in-up">
          <h1 className="text-3xl font-bold mb-8">Settings</h1>

          <div className="space-y-6">
            {/* About Section */}
            <div className="p-6 rounded-2xl bg-panel/60 backdrop-blur-sm border border-border/40">
              <h2 className="text-2xl font-bold mb-3 flex items-center gap-2">
                <Type className="h-6 w-6 text-primary" />
                About TypeFlow
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A beautiful, futuristic typing test app with smooth animations and neon aesthetics. 
                Track your progress, unlock achievements, and master your typing speed.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 rounded-xl bg-panel/60 border border-border/40">
                <div className="flex items-center gap-3 mb-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Multiple Modes</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Time, Words, Quote, and Zen modes for different practice styles
                </p>
              </div>

              <div className="p-5 rounded-xl bg-panel/60 border border-border/40">
                <div className="flex items-center gap-3 mb-2">
                  <Palette className="h-5 w-5 text-secondary" />
                  <h3 className="font-semibold">Beautiful UI</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Neon gradients, smooth animations, and futuristic design
                </p>
              </div>

              <div className="p-5 rounded-xl bg-panel/60 border border-border/40">
                <div className="flex items-center gap-3 mb-2">
                  <Volume2 className="h-5 w-5 text-success" />
                  <h3 className="font-semibold">Live Stats</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Real-time WPM, accuracy, and consistency tracking
                </p>
              </div>

              <div className="p-5 rounded-xl bg-panel/60 border border-border/40">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">🏆</span>
                  <h3 className="font-semibold">Achievements</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Unlock badges and track your personal bests
                </p>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="p-6 rounded-2xl bg-panel/60 border border-border/40">
              <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/40">
                  <span className="text-sm text-muted-foreground">Start / Restart test</span>
                  <kbd className="px-3 py-1.5 rounded-lg bg-muted border border-border/50 font-mono text-xs">Tab</kbd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/40">
                  <span className="text-sm text-muted-foreground">Open settings</span>
                  <kbd className="px-3 py-1.5 rounded-lg bg-muted border border-border/50 font-mono text-xs">Esc</kbd>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/40">
                  <span className="text-sm text-muted-foreground">Next word</span>
                  <kbd className="px-3 py-1.5 rounded-lg bg-muted border border-border/50 font-mono text-xs">Space</kbd>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="flex justify-center pt-4">
              <Button 
                onClick={() => navigate("/")}
                size="lg"
                className="glow-primary"
              >
                Back to Test
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

