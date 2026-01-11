// Build: 20251114
import { Header } from "@/components/Header";
import { useTypingStore } from "@/store/useTypingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useHeatmapStore } from "@/store/useHeatmapStore";
import { GoalsPanel } from "@/components/GoalsPanel";
import { AchievementsPanel } from "@/components/AchievementsPanel";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, TrendingDown, Target, Zap, Activity, Keyboard, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

export default function Statistics() {
  const { history, loadHistory } = useTypingStore();
  const { user } = useAuthStore();
  const { getMostUsedKeys, getLeastAccurateKeys, totalPresses, getKeyAccuracy } = useHeatmapStore();

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  // Calculate overall stats
  const totalTests = history.length;
  const avgWpm = totalTests > 0 ? history.reduce((sum, test) => sum + test.wpm, 0) / totalTests : 0;
  const avgAccuracy = totalTests > 0 ? history.reduce((sum, test) => sum + test.accuracy, 0) / totalTests : 0;
  const bestWpm = totalTests > 0 ? Math.max(...history.map(test => test.wpm)) : 0;
  const bestAccuracy = totalTests > 0 ? Math.max(...history.map(test => test.accuracy)) : 0;

  // Get key statistics
  const mostUsedKeys = getMostUsedKeys(10);
  const leastAccurateKeys = getLeastAccurateKeys(10);

  // Prepare chart data - last 20 tests
  const recentTests = [...history].reverse().slice(0, 20).reverse();
  const wpmChartData = recentTests.map((test, idx) => ({
    test: `#${idx + 1}`,
    wpm: Math.round(test.wpm),
    rawWpm: Math.round(test.rawWpm),
    accuracy: Math.round(test.accuracy),
  }));

  // WPM progression over time
  const wpmTrend = recentTests.length > 1 
    ? recentTests[recentTests.length - 1].wpm - recentTests[0].wpm 
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-primary to-secondary bg-clip-text text-transparent">
              Statistics Dashboard
            </h1>
            <p className="text-muted-foreground">
              Detailed insights into your typing performance and patterns
            </p>
          </div>

          {/* Goals and Achievements Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GoalsPanel />
            <AchievementsPanel />
          </div>

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-panel/50 to-panel/30 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Total Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalTests}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-panel/50 to-panel/30 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Average WPM
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{Math.round(avgWpm)}</div>
                <p className="text-xs text-muted-foreground mt-1">Best: {Math.round(bestWpm)}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-panel/50 to-panel/30 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  Average Accuracy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-500">{Math.round(avgAccuracy)}%</div>
                <p className="text-xs text-muted-foreground mt-1">Best: {Math.round(bestAccuracy)}%</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-panel/50 to-panel/30 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Keyboard className="w-4 h-4" />
                  Total Key Presses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-500">{totalPresses.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          {/* WPM Over Time Chart */}
          {recentTests.length > 0 && (
            <Card className="bg-panel/30 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Typing Speed Progress
                </CardTitle>
                <CardDescription>
                  Last {recentTests.length} tests · 
                  <span className={cn(
                    "ml-2 font-medium",
                    wpmTrend > 0 ? "text-green-500" : wpmTrend < 0 ? "text-red-500" : "text-muted-foreground"
                  )}>
                    {wpmTrend > 0 ? "+" : ""}{Math.round(wpmTrend)} WPM
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={wpmChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="test" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--panel))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="wpm" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                      dot={{ fill: "hsl(var(--primary))", r: 4 }}
                      name="WPM"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="rawWpm" 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ fill: "hsl(var(--muted-foreground))", r: 3 }}
                      name="Raw WPM"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Most Used Keys */}
          {mostUsedKeys.length > 0 && (
            <Card className="bg-panel/30 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-primary" />
                  Most Used Keys
                </CardTitle>
                <CardDescription>Your top 10 most frequently pressed keys</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {mostUsedKeys.map((key, idx) => (
                    <div
                      key={key.key}
                      className="p-4 rounded-lg bg-gradient-to-br from-panel to-panel/50 border border-border/50 text-center space-y-2"
                    >
                      <Badge variant="secondary" className="mb-2">
                        #{idx + 1}
                      </Badge>
                      <div className="text-2xl font-bold uppercase text-primary">{key.key}</div>
                      <div className="text-sm text-muted-foreground">{key.count} times</div>
                      <div className="text-xs">
                        <span className={cn(
                          "font-medium",
                          key.accuracy >= 95 ? "text-green-500" :
                          key.accuracy >= 85 ? "text-yellow-500" :
                          "text-red-500"
                        )}>
                          {Math.round(key.accuracy)}% accuracy
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Least Accurate Keys */}
          {leastAccurateKeys.length > 0 && (
            <Card className="bg-panel/30 border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                  Keys Needing Practice
                </CardTitle>
                <CardDescription>Keys with lowest accuracy (minimum 5 presses)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={leastAccurateKeys}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                    <XAxis 
                      dataKey="key" 
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={12}
                    />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: "hsl(var(--panel))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                      formatter={(value: number) => [`${Math.round(value)}%`, "Accuracy"]}
                    />
                    <Bar 
                      dataKey="accuracy" 
                      fill="hsl(var(--destructive))"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Mode Breakdown */}
          {totalTests > 0 && (
            <Card className="bg-panel/30 border-border/50">
              <CardHeader>
                <CardTitle>Test Mode Distribution</CardTitle>
                <CardDescription>Performance breakdown by test mode</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {["time", "words", "quote", "zen"].map((mode) => {
                    const modeTests = history.filter(t => t.mode.includes(mode));
                    if (modeTests.length === 0) return null;
                    
                    const avgModeWpm = modeTests.reduce((sum, test) => sum + test.wpm, 0) / modeTests.length;
                    const avgModeAccuracy = modeTests.reduce((sum, test) => sum + test.accuracy, 0) / modeTests.length;

                    return (
                      <div key={mode} className="p-4 rounded-lg bg-panel/50 border border-border/50 space-y-2">
                        <div className="text-sm font-medium uppercase text-muted-foreground">{mode}</div>
                        <div className="text-2xl font-bold text-primary">{modeTests.length}</div>
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Avg: {Math.round(avgModeWpm)} WPM</div>
                          <div>Accuracy: {Math.round(avgModeAccuracy)}%</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

