// Build: 20251114
import { useState } from "react";
import { useGoalsStore, GoalType, GoalPeriod } from "@/store/useGoalsStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Target, Trash2, Trophy, Flame, Calendar, CalendarDays, CalendarRange } from "lucide-react";
import { cn } from "@/lib/utils";

const GOAL_TYPE_LABELS: Record<GoalType, string> = {
  wpm: "WPM Target",
  accuracy: "Accuracy %",
  tests: "Tests Completed",
};

const PERIOD_ICONS: Record<GoalPeriod, any> = {
  daily: Calendar,
  weekly: CalendarDays,
  monthly: CalendarRange,
};

export function GoalsPanel() {
  const { goals, addGoal, removeGoal, streak } = useGoalsStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newGoalType, setNewGoalType] = useState<GoalType>("wpm");
  const [newGoalPeriod, setNewGoalPeriod] = useState<GoalPeriod>("daily");
  const [newGoalTarget, setNewGoalTarget] = useState("100");

  const handleAddGoal = () => {
    const target = parseInt(newGoalTarget);
    if (target > 0) {
      addGoal(newGoalType, newGoalPeriod, target);
      setIsDialogOpen(false);
      setNewGoalTarget("100");
    }
  };

  const dailyGoals = goals.filter(g => g.period === "daily");
  const weeklyGoals = goals.filter(g => g.period === "weekly");
  const monthlyGoals = goals.filter(g => g.period === "monthly");

  return (
    <div className="space-y-6">
      {/* Streak Card */}
      <Card className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" />
            Practice Streak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-orange-500">{streak.current}</div>
              <div className="text-sm text-muted-foreground">day{streak.current !== 1 ? 's' : ''} in a row</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Longest Streak</div>
              <div className="text-2xl font-bold text-orange-500/70">{streak.longest}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goals Section */}
      <Card className="bg-panel/30 border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Your Goals
              </CardTitle>
              <CardDescription>Set and track your typing goals</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Goal</DialogTitle>
                  <DialogDescription>
                    Set a new typing goal to track your progress
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Goal Type</Label>
                    <Select value={newGoalType} onValueChange={(v) => setNewGoalType(v as GoalType)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="wpm">WPM Target</SelectItem>
                        <SelectItem value="accuracy">Accuracy %</SelectItem>
                        <SelectItem value="tests">Tests Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Period</Label>
                    <Select value={newGoalPeriod} onValueChange={(v) => setNewGoalPeriod(v as GoalPeriod)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Value</Label>
                    <Input
                      type="number"
                      value={newGoalTarget}
                      onChange={(e) => setNewGoalTarget(e.target.value)}
                      placeholder={newGoalType === "tests" ? "10" : "100"}
                    />
                  </div>
                </div>
                <Button onClick={handleAddGoal} className="w-full">
                  Create Goal
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No goals yet. Create your first goal to get started!</p>
            </div>
          ) : (
            <>
              {/* Daily Goals */}
              {dailyGoals.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Daily Goals
                  </h3>
                  <div className="space-y-3">
                    {dailyGoals.map((goal) => (
                      <GoalItem key={goal.id} goal={goal} onRemove={removeGoal} />
                    ))}
                  </div>
                </div>
              )}

              {/* Weekly Goals */}
              {weeklyGoals.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CalendarDays className="w-4 h-4" />
                    Weekly Goals
                  </h3>
                  <div className="space-y-3">
                    {weeklyGoals.map((goal) => (
                      <GoalItem key={goal.id} goal={goal} onRemove={removeGoal} />
                    ))}
                  </div>
                </div>
              )}

              {/* Monthly Goals */}
              {monthlyGoals.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                    <CalendarRange className="w-4 h-4" />
                    Monthly Goals
                  </h3>
                  <div className="space-y-3">
                    {monthlyGoals.map((goal) => (
                      <GoalItem key={goal.id} goal={goal} onRemove={removeGoal} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function GoalItem({ goal, onRemove }: { goal: any; onRemove: (id: string) => void }) {
  const progress = Math.min((goal.current / goal.target) * 100, 100);
  const isComplete = goal.completed;

  return (
    <div className="p-4 rounded-lg bg-panel/50 border border-border/50 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-medium">{GOAL_TYPE_LABELS[goal.type]}</span>
          {isComplete && (
            <Badge variant="default" className="gap-1">
              <Trophy className="w-3 h-3" />
              Complete
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(goal.id)}
          className="h-8 w-8 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {goal.current} / {goal.target}
          </span>
          <span className={cn(
            "font-medium",
            isComplete ? "text-green-500" : "text-muted-foreground"
          )}>
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
}

