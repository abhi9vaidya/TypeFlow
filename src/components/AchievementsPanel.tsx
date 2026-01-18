// Build: 20251114
import { useGoalsStore } from "@/store/useGoalsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Zap } from "lucide-react";

export function AchievementsPanel() {
  const { achievements } = useGoalsStore();

  const sortedAchievements = [...achievements].sort(
    (a, b) => new Date(b.unlockedAt).getTime() - new Date(a.unlockedAt).getTime()
  );

  return (
    <Card className="bg-panel/30 border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Achievements
        </CardTitle>
        <CardDescription>
          {achievements.length} achievement{achievements.length !== 1 ? 's' : ''} unlocked
        </CardDescription>
      </CardHeader>
      <CardContent>
        {achievements.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No achievements yet. Keep practicing!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="p-4 rounded-lg bg-gradient-to-br from-panel to-panel/50 border border-border/50 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{achievement.title}</h4>
                      <Badge variant="secondary" className="gap-1">
                        <Zap className="w-3 h-3" />
                        New
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                    <p className="text-xs text-muted-foreground/70">
                      Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

