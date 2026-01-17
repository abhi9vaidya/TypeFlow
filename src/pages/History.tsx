// Build: 20251114
import { useTypingStore } from "@/store/useTypingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Trophy, Calendar, Clock, Target, Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function History() {
  const { history, clearHistory, loadHistory } = useTypingStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  if (history.length === 0) {
    return (
      <div>
        <main className="container mx-auto px-4 pb-12">
          <div className="text-center max-w-md mx-auto animate-fade-in-up space-y-6">
            <div className="relative mx-auto w-24 h-24 mb-4">
              <div className="absolute inset-0 bg-primary/10 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-primary/20 rounded-full" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Trophy className="w-12 h-12 text-primary/40" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">No History Yet</h1>
              <p className="text-muted-foreground">
                Start typing to track your progress and see your improvement over time!
              </p>
            </div>
            <Button 
              onClick={() => navigate("/")} 
              className="bg-primary hover:bg-primary/90 gap-2 shadow-lg"
            >
              <Keyboard className="w-4 h-4" />
              Start Your First Test
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <main className="container mx-auto px-4 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold">Test History</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={clearHistory}
            >
              Clear History
            </Button>
          </div>

          <div className="space-y-4">
            {history.map((result, idx) => (
              <div
                key={result.id}
                className="p-6 rounded-lg bg-panel border border-border/50 hover:border-primary/50 transition-all animate-fade-in-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {result.isPB && (
                        <div className="flex items-center gap-1 text-gold">
                          <Trophy className="h-4 w-4" />
                          <span className="text-xs font-semibold">PB</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(result.timestamp).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        {result.mode} {result.duration}s
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <div className="text-3xl font-bold text-primary tabular-nums">
                          {result.wpm}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          WPM
                        </div>
                      </div>

                      <div>
                        <div className="text-3xl font-bold text-secondary tabular-nums">
                          {result.accuracy}%
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          Accuracy
                        </div>
                      </div>

                      <div>
                        <div className="text-2xl font-bold tabular-nums">
                          {result.rawWpm}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          Raw WPM
                        </div>
                      </div>

                      <div>
                        <div className="text-2xl font-bold tabular-nums">
                          {result.consistency}%
                        </div>
                        <div className="text-xs text-muted-foreground uppercase">
                          Consistency
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

