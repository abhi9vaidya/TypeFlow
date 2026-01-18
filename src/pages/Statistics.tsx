// Build: 20251114
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { useTypingStore } from "@/store/useTypingStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useHeatmapStore } from "@/store/useHeatmapStore";
import { GoalsPanel } from "@/components/GoalsPanel";
import { AchievementsPanel } from "@/components/AchievementsPanel";
import { PersonalBests } from "@/components/PersonalBests";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend,
  Cell
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Zap, 
  Activity, 
  Keyboard, 
  Award, 
  Clock, 
  Calendar,
  ChevronRight,
  Sparkles,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import { motion } from "framer-motion";

export default function Statistics() {
  const navigate = useNavigate();
  const { history, loadHistory } = useTypingStore();
  const { user } = useAuthStore();
  const { getMostUsedKeys, getLeastAccurateKeys, totalPresses, getKeyAccuracy } = useHeatmapStore();

  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user, loadHistory]);

  // Calculate overall stats
  const stats = useMemo(() => {
    const totalTests = history.length;
    if (totalTests === 0) return null;

    const avgWpm = history.reduce((sum, test) => sum + test.wpm, 0) / totalTests;
    const avgAccuracy = history.reduce((sum, test) => sum + test.accuracy, 0) / totalTests;
    const avgConsistency = history.reduce((sum, test) => sum + (test.consistency || 0), 0) / totalTests;
    const bestWpm = Math.max(...history.map(test => test.wpm));
    const totalTimeSeconds = history.reduce((sum, test) => sum + test.duration, 0);
    
    // Recent trend
    const recentTests = [...history].reverse().slice(0, 10);
    const prevTests = [...history].reverse().slice(10, 20);
    
    const recentAvg = recentTests.length > 0 ? recentTests.reduce((sum, t) => sum + t.wpm, 0) / recentTests.length : 0;
    const prevAvg = prevTests.length > 0 ? prevTests.reduce((sum, t) => sum + t.wpm, 0) / prevTests.length : 0;
    const wpmTrend = prevAvg > 0 ? ((recentAvg - prevAvg) / prevAvg) * 100 : 0;

    return {
      totalTests,
      avgWpm,
      avgAccuracy,
      avgConsistency,
      bestWpm,
      totalTimeSeconds,
      wpmTrend
    };
  }, [history]);

  // Prepare chart data - last 50 tests for better visualization
  const chartData = useMemo(() => {
    return [...history]
      .filter(t => t && t.timestamp)
      .reverse()
      .slice(0, 50)
      .reverse()
      .map((test, idx) => ({
        index: idx + 1,
        wpm: Math.round(test.wpm || 0),
        raw: Math.round(test.rawWpm || 0),
        acc: Math.round(test.accuracy || 0),
        date: new Date(test.timestamp).toLocaleDateString()
      }));
  }, [history]);

  const mostUsedKeys = getMostUsedKeys(8) || [];
  const leastAccurateKeys = getLeastAccurateKeys(8) || [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center space-y-4">
        <BarChart3 className="w-16 h-16 mx-auto text-muted-foreground opacity-20" />
        <h2 className="text-2xl font-bold">No statistics yet</h2>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Complete your first typing test to start seeing detailed insights and progress tracking.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 pb-20 pt-8">
        <motion.div 
          className="max-w-7xl mx-auto space-y-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header Section */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
                    <Sparkles className="w-3 h-3 mr-1" /> Performance Dashboard
                  </Badge>
                </div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent italic tracking-tight">
                  STATISTICS
                </h1>
                <p className="text-muted-foreground text-sm md:text-base font-medium">
                  Deep dive into your typing progression and muscle memory.
                </p>
              </div>
              
              <div className="flex items-center gap-4 bg-muted/30 p-4 rounded-2xl border border-border/50 backdrop-blur-sm">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none mb-1">Total Time</span>
                  <span className="text-xl font-mono font-bold text-foreground">
                    {stats ? `${Math.floor(stats.totalTimeSeconds / 3600)}h ${Math.floor((stats.totalTimeSeconds % 3600) / 60)}m` : '0h 0m'}
                  </span>
                </div>
                <Separator orientation="vertical" className="h-8 opacity-20" />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold leading-none mb-1">Joined</span>
                  <span className="text-xl font-mono font-bold text-foreground">
                    {user?.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { month: 'short', year: 'numeric' }) : '---'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Primary Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                label: "Average Speed", 
                value: Math.round(stats?.avgWpm || 0), 
                unit: "WPM", 
                icon: Zap, 
                color: "text-amber-500",
                bg: "from-amber-500/10 to-transparent",
                footer: `Best: ${Math.round(stats?.bestWpm || 0)} WPM`
              },
              { 
                label: "Accuracy", 
                value: Math.round(stats?.avgAccuracy || 0), 
                unit: "%", 
                icon: Target, 
                color: "text-emerald-500",
                bg: "from-emerald-500/10 to-transparent",
                footer: "Mean precision across all tests"
              },
              { 
                label: "Consistency", 
                value: Math.round(stats?.avgConsistency || 0), 
                unit: "%", 
                icon: Activity, 
                color: "text-indigo-500",
                bg: "from-indigo-500/10 to-transparent",
                footer: "Rhythm stability"
              },
              { 
                label: "Total Tests", 
                value: stats?.totalTests || 0, 
                unit: "", 
                icon: BarChart3, 
                color: "text-rose-500",
                bg: "from-rose-500/10 to-transparent",
                footer: (stats?.wpmTrend || 0) > 0 
                  ? `↑ ${(stats?.wpmTrend || 0).toFixed(1)}% vs previous`
                  : (stats?.wpmTrend || 0) < 0 
                  ? `↓ ${Math.abs(stats?.wpmTrend || 0).toFixed(1)}% vs previous`
                  : "Stable momentum"
              },
            ].map((metric, i) => (
              <motion.div key={i} variants={itemVariants}>
                <Card className="relative overflow-hidden group hover:border-primary/30 transition-all duration-500 border-border/50 bg-panel/20 backdrop-blur-md">
                  <div className={cn("absolute inset-0 bg-gradient-to-br opacity-50", metric.bg)} />
                  <CardContent className="pt-6 relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <div className={cn("p-2 rounded-xl bg-background shadow-sm border border-border/50 flex-shrink-0 transition-transform group-hover:scale-110 duration-500", metric.color)}>
                        <metric.icon className="w-5 h-5" />
                      </div>
                      <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-tighter opacity-70">
                        Lifetime
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black tracking-tighter italic">{metric.value}</span>
                        <span className="text-sm font-bold text-muted-foreground">{metric.unit}</span>
                      </div>
                      <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{metric.label}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-border/5 opacity-80">
                      <p className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                        {metric.footer}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Speed Progression Chart */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <Card className="border-border/50 bg-panel/10 backdrop-blur-sm h-full overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-8">
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-bold flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      WPM Progression
                    </CardTitle>
                    <CardDescription className="text-xs font-medium">Over your last 50 typing sessions</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Net WPM</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground/30" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">Raw</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="h-[350px] w-full pr-6 pl-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                      <XAxis 
                        dataKey="index" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10, fontWeight: 600 }}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--panel))', 
                          border: '1px solid hsl(var(--border)/0.5)', 
                          borderRadius: '12px',
                          boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                          backdropFilter: 'blur(8px)'
                        }}
                        cursor={{ stroke: 'hsl(var(--primary))', strokeWidth: 1, strokeDasharray: '4 4' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="wpm" 
                        stroke="hsl(var(--primary))" 
                        strokeWidth={4}
                        fillOpacity={1} 
                        fill="url(#colorWpm)" 
                        animationDuration={2000}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="raw" 
                        stroke="hsl(var(--muted-foreground))" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        fill="transparent"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Achievements/Goals Sidebar */}
            <motion.div variants={itemVariants} className="space-y-6">
              <GoalsPanel />
              <AchievementsPanel />
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Key Proficiency */}
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-panel/10 backdrop-blur-sm h-full">
                <CardHeader>
                  <CardTitle className="text-xl font-black italic flex items-center gap-2">
                    <Keyboard className="w-5 h-5 text-primary" />
                    KEY PROFICIENCY
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold uppercase tracking-wider">Top 8 most active keys</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {mostUsedKeys.map((keyData, idx) => (
                      <div key={keyData.key} className="group relative overflow-hidden p-4 rounded-2xl bg-muted/20 border border-border/50 hover:bg-muted/40 transition-colors">
                        <div className="absolute top-0 right-0 p-1.5 opacity-10 group-hover:opacity-20 transition-opacity">
                          <span className="text-4xl font-black">{idx + 1}</span>
                        </div>
                        <div className="relative">
                          <div className="text-3xl font-black italic text-primary uppercase mb-1">{keyData.key}</div>
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">Accuracy</span>
                              <span className={cn(
                                "text-xs font-mono font-bold",
                                keyData.accuracy >= 95 ? "text-emerald-500" :
                                keyData.accuracy >= 85 ? "text-amber-500" : "text-rose-500"
                              )}>
                                {Math.round(keyData.accuracy)}%
                              </span>
                            </div>
                            <div className="h-1 w-full bg-muted/50 rounded-full overflow-hidden">
                              <motion.div 
                                className={cn(
                                  "h-full rounded-full",
                                  keyData.accuracy >= 95 ? "bg-emerald-500" :
                                  keyData.accuracy >= 85 ? "bg-amber-500" : "bg-rose-500"
                                )}
                                initial={{ width: 0 }}
                                animate={{ width: `${keyData.accuracy}%` }}
                                transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                              />
                            </div>
                            <div className="text-[10px] font-bold text-muted-foreground/60">{keyData.count} presses</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Practice Recommendations */}
            <motion.div variants={itemVariants}>
              <Card className="border-border/50 bg-panel/10 backdrop-blur-sm h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-xl font-black italic flex items-center gap-2">
                    <Award className="w-5 h-5 text-rose-500" />
                    WEAKEST LINKS
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold uppercase tracking-wider">Analyze keys needing practice</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col min-h-[400px]">
                  <div className="flex-1 min-h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={leastAccurateKeys} margin={{ top: 20, right: 10, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis 
                          dataKey="key" 
                          axisLine={false} 
                          tickLine={false}
                          tick={{ fill: 'hsl(var(--primary))', fontSize: 14, fontWeight: '900', fontStyle: 'italic' }}
                        />
                        <YAxis hide domain={[0, 100]} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '8px', border: 'none', background: 'hsl(var(--panel))' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="accuracy" radius={[6, 6, 0, 0]} barSize={40}>
                          {leastAccurateKeys.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.accuracy < 70 ? 'hsl(var(--destructive))' : 'hsl(var(--warning))'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-auto p-4 rounded-xl bg-destructive/10 border border-destructive/20 flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-destructive/20 text-destructive">
                      <TrendingDown className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-destructive">Insight Found</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        Your accuracy drops significantly when hitting the 
                        <span className="font-bold text-foreground mx-1 italic underline">
                          "{leastAccurateKeys[0]?.key}"
                        </span> 
                        key. Focus on slow, deliberate practice for this finger position.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <PersonalBests history={history} />
          </motion.div>

          {/* Recent Results Table */}
          <motion.div variants={itemVariants}>
            <Card className="border-border/50 bg-panel/5 overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-black italic">RECENT ACTIVITY</CardTitle>
                  <CardDescription className="text-xs font-semibold opacity-60">Log of your last 10 sessions</CardDescription>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs font-bold gap-1 hover:text-primary transition-colors"
                  onClick={() => navigate("/history")}
                >
                  View Full History <ChevronRight className="w-4 h-4" />
                </Button>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Timestamp</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Mode</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">WPM</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Raw</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50">Accuracy</th>
                        <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-border/50 text-right">Progress</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      {[...history].reverse().slice(0, 5).map((test, i) => (
                        <tr key={test.id} className="group hover:bg-primary/[0.02] transition-colors">
                          <td className="px-6 py-4 text-xs font-medium text-muted-foreground">
                            {new Date(test.timestamp).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="text-[10px] font-bold uppercase bg-background border-border/50">
                              {test.mode} {test.wordCount || test.duration}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 font-mono font-bold text-foreground">
                            {test.wpm} <span className="text-[10px] text-muted-foreground font-normal">wpm</span>
                          </td>
                          <td className="px-6 py-4 font-mono text-muted-foreground text-xs">
                            {test.rawWpm}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "text-xs font-bold",
                                test.accuracy >= 95 ? "text-emerald-500" : "text-amber-500"
                              )}>
                                {Math.round(test.accuracy)}%
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                           {test.isPB && (
                             <Badge className="bg-emerald-500 hover:bg-emerald-600 text-[10px] font-black italic tracking-tighter shadow-lg shadow-emerald-500/20">
                               NEW PB
                             </Badge>
                           )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}


