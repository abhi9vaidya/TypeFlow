// Build: 20251114
import { useHeatmapStore, KeyboardLayout } from "@/store/useHeatmapStore";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { RotateCcw, Zap, Info } from "lucide-react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

const KEYBOARD_LAYOUTS = {
  QWERTY: [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'"],
    ["z", "x", "c", "v", "b", "n", "m", ",", ".", "/"],
  ],
  Dvorak: [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "[", "]"],
    ["'", ",", ".", "p", "y", "f", "g", "c", "r", "l", "/", "="],
    ["a", "o", "e", "u", "i", "d", "h", "t", "n", "s", "-"],
    [";", "q", "j", "k", "x", "b", "m", "w", "v", "z"],
  ],
  Colemak: [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "="],
    ["q", "w", "f", "p", "g", "j", "l", "u", "y", ";", "[", "]"],
    ["a", "r", "s", "t", "d", "h", "n", "e", "i", "o", "'"],
    ["z", "x", "c", "v", "b", "k", "m", ",", ".", "/"],
  ],
} as const;

function getHeatColor(frequency: number, maxFrequency: number, isRecentPress: boolean): string {
  if (isRecentPress) {
    return "bg-gradient-to-br from-cyan-400 to-blue-400 border-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.8)] animate-pulse";
  }
  
  if (maxFrequency === 0 || frequency === 0) return "bg-panel/50 border-border/30";
  
  const intensity = frequency / maxFrequency;
  
  if (intensity >= 0.8) return "bg-gradient-to-br from-red-500 to-orange-500 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.5)]";
  if (intensity >= 0.6) return "bg-gradient-to-br from-orange-500 to-yellow-500 border-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.4)]";
  if (intensity >= 0.4) return "bg-gradient-to-br from-yellow-500 to-lime-500 border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.3)]";
  if (intensity >= 0.2) return "bg-gradient-to-br from-lime-500 to-green-500 border-lime-400 shadow-[0_0_8px_rgba(132,204,22,0.3)]";
  if (intensity > 0) return "bg-gradient-to-br from-green-500/50 to-emerald-500/50 border-green-400/50 shadow-[0_0_6px_rgba(34,197,94,0.2)]";
  
  return "bg-panel/50 border-border/30";
}

export function KeyboardHeatmap() {
  const {
    getKeyFrequency,
    getMaxFrequency,
    resetHeatmap,
    totalPresses,
    totalSessionPresses,
    resetSession,
    currentLayout,
    setLayout,
    getMostUsedKeys,
    getLeastAccurateKeys,
    getHandDistribution,
    getKeyImbalance,
    getLastKeyPressed,
  } = useHeatmapStore();

  const [useSession, setUseSession] = useState(false);
  const [animationTrigger, setAnimationTrigger] = useState(0);

  const layout = KEYBOARD_LAYOUTS[currentLayout];
  const maxFreq = getMaxFrequency(useSession);
  const displayTotal = useSession ? totalSessionPresses : totalPresses;
  const mostUsed = getMostUsedKeys(5, useSession);
  const leastAccurate = getLeastAccurateKeys(3);
  const handDist = getHandDistribution();
  const keyImbalance = getKeyImbalance();
  const lastKeyPressed = getLastKeyPressed();

  useEffect(() => {
    if (lastKeyPressed) {
      setAnimationTrigger(prev => prev + 1);
      const timer = setTimeout(() => {
        setAnimationTrigger(prev => prev - 1);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [lastKeyPressed?.key]);

  return (
    <TooltipProvider>
      <div className="w-full max-w-6xl mx-auto p-6 bg-panel/30 backdrop-blur-sm rounded-2xl border border-border/50 shadow-xl space-y-6">
        {/* Header with Controls */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1 flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="cursor-help">Keyboard Heatmap</span>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs">
                  <p>Visual representation of which keys you use most frequently during typing tests.</p>
                  <p className="mt-1 text-xs opacity-75">Darker red = more frequently used. Brighter colors = less used.</p>
                </TooltipContent>
              </Tooltip>
            </h3>
            <p className="text-sm text-muted-foreground">
              {useSession ? "Session" : "Total"} key presses:{" "}
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="text-primary font-medium cursor-help">
                    {displayTotal.toLocaleString()}
                    <Info className="w-3 h-3 inline-block ml-1" />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{useSession ? "Presses in current session only" : "Total presses across all sessions"}</p>
                </TooltipContent>
              </Tooltip>
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Layout Selector */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="relative">
                  <select
                    value={currentLayout}
                    onChange={(e) => setLayout(e.target.value as KeyboardLayout)}
                    className="px-3 py-2 text-sm rounded-lg bg-secondary border border-border/50 text-foreground hover:bg-secondary/80 transition-colors cursor-help"
                  >
                    <option value="QWERTY">QWERTY</option>
                    <option value="Dvorak">Dvorak</option>
                    <option value="Colemak">Colemak</option>
                  </select>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Select your keyboard layout. Hand distribution stats update accordingly.</p>
              </TooltipContent>
            </Tooltip>

            {/* Session Toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant={useSession ? "default" : "outline"}
                    size="sm"
                    onClick={() => setUseSession(!useSession)}
                    className="text-xs cursor-help"
                  >
                    {useSession ? "Session" : "All Time"}
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle between current session data and lifetime statistics.</p>
              </TooltipContent>
            </Tooltip>

            {/* Reset Buttons */}
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetSession}
                    className="gap-2 cursor-help"
                    disabled={totalSessionPresses === 0}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Session
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Clear current session heatmap data only.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetHeatmap}
                    className="gap-2 cursor-help"
                  >
                    <RotateCcw className="w-4 h-4" />
                    All
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Clear all heatmap data (session and lifetime). This cannot be undone.</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* Tabs for Heatmap and Insights */}
        <Tabs defaultValue="heatmap" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <TabsTrigger value="heatmap">Heatmap</TabsTrigger>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Visual keyboard showing key press frequency with color gradients.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Your top keys and keys that need practice based on accuracy.</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div className="cursor-help">
                  <TabsTrigger value="stats">Stats</TabsTrigger>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Hand distribution, key balance, and overall statistics.</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>

          {/* Heatmap Tab */}
          <TabsContent value="heatmap" className="space-y-4">
            <div className="space-y-2">
              {layout.map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  className="flex justify-center gap-1"
                  style={{ paddingLeft: `${rowIdx * 0.75}rem` }}
                >
                  {row.map((key) => {
                    const frequency = getKeyFrequency(key, useSession);
                    const isRecent = lastKeyPressed?.key === key;
                    const heatColor = getHeatColor(frequency, maxFreq, isRecent && animationTrigger > 0);
                    const percentage = displayTotal > 0 ? ((frequency / displayTotal) * 100).toFixed(1) : "0";

                    return (
                      <Tooltip key={key}>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "relative w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300 cursor-help",
                              "text-xs font-semibold uppercase",
                              heatColor,
                              frequency > 0 ? "text-white" : "text-muted-foreground/70"
                            )}
                          >
                            <span className="relative z-10">{key}</span>
                            {frequency > 0 && (
                              <span className="text-[7px] font-bold opacity-70 leading-none">
                                {percentage}%
                              </span>
                            )}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top">
                          <div>
                            <p className="font-semibold">{key.toUpperCase()}</p>
                            <p className="text-xs mt-1">Presses: {frequency}</p>
                            <p className="text-xs">Percentage: {percentage}%</p>
                            {frequency === 0 && <p className="text-xs text-muted-foreground mt-1">Not used yet</p>}
                            {isRecent && <p className="text-xs text-cyan-300 mt-1">Just pressed!</p>}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-6 flex items-center justify-center gap-4 text-xs text-muted-foreground flex-wrap">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className="w-4 h-4 rounded bg-panel/50 border border-border/30" />
                    <span>Not used</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Key has not been pressed in any test.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-green-500/50 to-emerald-500/50" />
                    <span>Low</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>0-20% of your max key frequency.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-yellow-500 to-lime-500" />
                    <span>Medium</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>40-60% of your max key frequency.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-orange-500 to-yellow-500" />
                    <span>High</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>60-80% of your max key frequency.</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-red-500 to-orange-500" />
                    <span>Very High</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>80%+ of your max key frequency (most used key).</p>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 cursor-help">
                    <div className="w-4 h-4 rounded bg-gradient-to-br from-cyan-400 to-blue-400 animate-pulse" />
                    <span>Just pressed</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Key pressed within the last 500ms (real-time feedback).</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsContent>

          {/* Insights Tab */}
          <TabsContent value="insights" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Most Used Keys */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border/30 cursor-help">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      Most Used Keys
                      <Info className="w-4 h-4" />
                    </h4>
                    {mostUsed.length > 0 ? (
                      <div className="space-y-2">
                        {mostUsed.map((item, idx) => (
                          <Tooltip key={item.key}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-between cursor-help">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-primary/30 px-2 py-1 rounded text-primary font-semibold">
                                    #{idx + 1}
                                  </span>
                                  <span className="font-semibold uppercase">{item.key}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">{item.count}</div>
                                  <div className="text-xs text-muted-foreground">{item.accuracy.toFixed(0)}% acc</div>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Ranked #{idx + 1} most frequently used</p>
                              <p className="text-xs mt-1">Accuracy: {item.accuracy.toFixed(1)}%</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No data yet</p>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Your top 5 most frequently used keys across all tests.</p>
                </TooltipContent>
              </Tooltip>

              {/* Least Accurate Keys */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border/30 cursor-help">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      Keys to Practice
                      <Info className="w-4 h-4" />
                    </h4>
                    {leastAccurate.length > 0 ? (
                      <div className="space-y-2">
                        {leastAccurate.map((item) => (
                          <Tooltip key={item.key}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-between cursor-help">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-400 font-semibold">
                                    ⚠
                                  </span>
                                  <span className="font-semibold uppercase">{item.key}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-medium">{item.accuracy.toFixed(0)}%</div>
                                  <div className="text-xs text-muted-foreground">{item.count} presses</div>
                                </div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                              <p>Low accuracy on this key!</p>
                              <p className="text-xs mt-1">{item.accuracy.toFixed(1)}% correct out of {item.count} presses</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No data yet</p>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Keys where you have the lowest accuracy (requires 5+ presses to show).</p>
                  <p className="text-xs mt-1">Focus on these keys to improve your typing!</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Hand Distribution */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border/30 cursor-help">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      Hand Distribution
                      <Info className="w-4 h-4" />
                    </h4>
                    <div className="space-y-3">
                      <div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex justify-between items-center mb-2 cursor-help">
                              <span className="text-sm">Left Hand</span>
                              <span className="font-semibold text-primary">{handDist.leftPercent.toFixed(1)}%</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>{handDist.left} presses with left hand</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="w-full bg-panel/50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-300"
                            style={{ width: `${handDist.leftPercent}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex justify-between items-center mb-2 cursor-help">
                              <span className="text-sm">Right Hand</span>
                              <span className="font-semibold text-primary">{handDist.rightPercent.toFixed(1)}%</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top">
                            <p>{handDist.right} presses with right hand</p>
                          </TooltipContent>
                        </Tooltip>
                        <div className="w-full bg-panel/50 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-purple-400 transition-all duration-300"
                            style={{ width: `${handDist.rightPercent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-3">
                      {Math.abs(handDist.leftPercent - handDist.rightPercent) > 15
                        ? "⚠ Imbalanced hand usage"
                        : "✓ Balanced hand usage"}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Percentage of key presses from each hand based on your layout.</p>
                  <p className="text-xs mt-1">Balanced usage helps prevent fatigue.</p>
                </TooltipContent>
              </Tooltip>

              {/* Key Imbalance */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border/30 cursor-help">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      Key Usage Balance
                      <Info className="w-4 h-4" />
                    </h4>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary mb-2">{keyImbalance.toFixed(1)}</div>
                      <p className="text-xs text-muted-foreground mb-3">Variance</p>
                      <div className="w-full bg-panel/50 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-green-500 to-green-400"
                          style={{ width: `${Math.min(keyImbalance / 20 * 100, 100)}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        {keyImbalance < 5 ? "✓ Very consistent" : keyImbalance < 10 ? "✓ Consistent" : "⚠ Variable usage"}
                      </p>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Statistical variance of your key press distribution.</p>
                  <p className="text-xs mt-1">Lower = more consistent key usage across all keys.</p>
                </TooltipContent>
              </Tooltip>

              {/* Overall Stats */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-secondary/50 rounded-lg p-4 border border-border/30 cursor-help">
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      Overall Stats
                      <Info className="w-4 h-4" />
                    </h4>
                    <div className="space-y-2 text-sm">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between cursor-help">
                            <span className="text-muted-foreground">Max Frequency:</span>
                            <span className="font-semibold">{maxFreq}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Most frequently pressed key count.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between cursor-help">
                            <span className="text-muted-foreground">Unique Keys:</span>
                            <span className="font-semibold">{mostUsed.length}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Number of different keys you've used.</p>
                        </TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex justify-between cursor-help">
                            <span className="text-muted-foreground">Layout:</span>
                            <span className="font-semibold">{currentLayout}</span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Current keyboard layout for hand distribution calculations.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Quick overview of your heatmap statistics.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
}

