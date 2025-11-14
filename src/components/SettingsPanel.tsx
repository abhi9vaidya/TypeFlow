// Build: 20251114
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, Palette } from "lucide-react";
import { useSettingsStore, Theme, CaretStyle } from "@/store/useSettingsStore";
import { useEffect } from "react";
import { applyTheme } from "@/utils/themes";
import { CustomThemeEditor } from "./CustomThemeEditor";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const themeOptions = [
  { id: "purple-glow" as Theme, name: "Purple Glow", gradient: "from-purple-600 via-blue-500 to-cyan-400" },
  { id: "cyber-blue" as Theme, name: "Cyber Blue", gradient: "from-blue-600 to-cyan-400" },
  { id: "matrix" as Theme, name: "Matrix", gradient: "from-green-600 to-emerald-400" },
  { id: "sunset" as Theme, name: "Sunset", gradient: "from-pink-600 to-rose-400" },
  { id: "fire" as Theme, name: "Fire", gradient: "from-orange-600 to-amber-400" },
  { id: "dark" as Theme, name: "Dark Mode", gradient: "from-slate-700 to-slate-900" },
  { id: "custom" as Theme, name: "Custom", gradient: "from-primary to-secondary", icon: Palette },
];

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const {
    theme,
    setTheme,
    customColors,
    setCustomColors,
    keySoundEnabled,
    errorSoundEnabled,
    setKeySound,
    setErrorSound,
    showKeyboardHeatmap,
    blurUnusedWords,
    setShowKeyboardHeatmap,
    setBlurUnusedWords,
    showStreakCounter,
    showSpeedZone,
    showParticleEffects,
    showCircularProgress,
    showPerfectGlow,
    showCharacterGlow,
    setShowStreakCounter,
    setShowSpeedZone,
    setShowParticleEffects,
    setShowCircularProgress,
    setShowPerfectGlow,
    setShowCharacterGlow,
    includePunctuation,
    includeNumbers,
    setIncludePunctuation,
    setIncludeNumbers,
    caretStyle,
    setCaretStyle,
  } = useSettingsStore();

  useEffect(() => {
    applyTheme(theme, customColors);
  }, [theme, customColors]);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      // When Sheet tries to close (e.g., user presses Escape or clicks overlay),
      // we call onClose which will update the parent state.
      // The parent (TypingTest) controls the actual state via setIsSettingsOpen.
      if (!open) {
        onClose();
      }
    }}>
      <SheetContent side="right" className="w-full max-w-md bg-gradient-to-b from-background via-background to-muted/30 backdrop-blur-xl border-l border-border/40 shadow-2xl p-0 overflow-hidden">
        {/* Header with gradient background */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-background via-background/95 to-background/80 border-b border-border/30 backdrop-blur-sm px-6 py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Settings
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Customize your typing experience</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-lg hover:bg-muted/80 hover:text-primary transition-all duration-200 flex-shrink-0"
              aria-label="Close settings"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto h-[calc(100vh-120px)] px-6 py-6 space-y-6">
          {/* Theme Section */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Theme</h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {themeOptions.map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTheme(t.id)}
                    className={cn(
                      "group relative h-24 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 overflow-hidden",
                      theme === t.id
                        ? "border-primary bg-gradient-to-br from-primary/15 to-primary/5 shadow-lg shadow-primary/20"
                        : "border-border/40 bg-muted/40 hover:border-primary/60 hover:bg-muted/60"
                    )}
                  >
                    {/* Background glow on hover/active */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-primary/0 transition-all duration-300" />
                    
                    {Icon ? (
                      <Icon
                        className={cn(
                          "h-8 w-8 transition-all duration-300 relative z-10",
                          theme === t.id ? "text-primary scale-110 drop-shadow-lg" : "text-muted-foreground group-hover:text-primary/70"
                        )}
                      />
                    ) : (
                      <div
                        className={cn(
                          "h-8 w-8 rounded-full shadow-md transition-all duration-300 relative z-10 bg-gradient-to-br",
                          t.gradient,
                          theme === t.id ? "shadow-lg drop-shadow-md scale-110" : "group-hover:scale-105"
                        )}
                      />
                    )}
                    <span
                      className={cn(
                        "text-xs font-medium transition-all duration-300 text-center relative z-10",
                        theme === t.id ? "text-foreground font-semibold" : "text-muted-foreground group-hover:text-foreground/70"
                      )}
                    >
                      {t.name}
                    </span>
                  </button>
                );
              })}
            </div>

            {theme === "custom" && (
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 backdrop-blur-sm animate-in fade-in duration-300">
                <CustomThemeEditor colors={customColors} onChange={setCustomColors} />
              </div>
            )}
          </section>

          <Separator className="bg-border/20" />

          {/* Sound Settings */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-gradient-to-b from-secondary to-accent rounded-full" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Audio</h3>
            </div>
            <div className="space-y-2 bg-muted/20 rounded-lg p-3 border border-border/20">
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="key-sound" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Key sounds
                </Label>
                <Switch checked={keySoundEnabled} onCheckedChange={setKeySound} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="error-sound" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Error sounds
                </Label>
                <Switch checked={errorSoundEnabled} onCheckedChange={setErrorSound} />
              </div>
            </div>
          </section>

          <Separator className="bg-border/20" />

          {/* Typing Settings */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-gradient-to-b from-success to-primary rounded-full" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Typing</h3>
            </div>
            <div className="space-y-2 bg-muted/20 rounded-lg p-3 border border-border/20">
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="punctuation" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Include punctuation
                </Label>
                <Switch checked={includePunctuation} onCheckedChange={setIncludePunctuation} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="numbers" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Include numbers
                </Label>
                <Switch checked={includeNumbers} onCheckedChange={setIncludeNumbers} />
              </div>
            </div>
          </section>

          <Separator className="bg-border/20" />

          {/* Caret Settings */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-gradient-to-b from-primary to-secondary rounded-full" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Caret</h3>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {(["line", "block", "underline"] as CaretStyle[]).map((style) => (
                <Button
                  key={style}
                  variant={caretStyle === style ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCaretStyle(style)}
                  className={cn(
                    "transition-all duration-200 text-xs font-medium",
                    caretStyle === style
                      ? "bg-gradient-to-r from-primary/90 to-primary/70 border-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                      : "border-border/40 bg-muted/30 hover:border-primary/60 hover:bg-muted/50"
                  )}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Button>
              ))}
            </div>
          </section>

          <Separator className="bg-border/20" />

          {/* Display Settings */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-gradient-to-b from-accent to-success rounded-full" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Display</h3>
            </div>
            <div className="space-y-2 bg-muted/20 rounded-lg p-3 border border-border/20">
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="blur-words" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Blur unused words
                </Label>
                <Switch checked={blurUnusedWords} onCheckedChange={setBlurUnusedWords} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="show-keyboard" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Show keyboard heatmap
                </Label>
                <Switch checked={showKeyboardHeatmap} onCheckedChange={setShowKeyboardHeatmap} />
              </div>
            </div>
          </section>

          <Separator className="bg-border/20" />

          {/* Visual Effects Settings */}
          <section className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-gradient-to-b from-gold to-destructive rounded-full" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Effects</h3>
            </div>
            <div className="space-y-2 bg-muted/20 rounded-lg p-3 border border-border/20">
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="streak-counter" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Streak counter
                </Label>
                <Switch checked={showStreakCounter} onCheckedChange={setShowStreakCounter} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="speed-zone" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Speed zone
                </Label>
                <Switch checked={showSpeedZone} onCheckedChange={setShowSpeedZone} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="particle-effects" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Particle effects
                </Label>
                <Switch checked={showParticleEffects} onCheckedChange={setShowParticleEffects} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="circular-progress" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Progress rings
                </Label>
                <Switch checked={showCircularProgress} onCheckedChange={setShowCircularProgress} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="perfect-glow" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Perfect typing glow
                </Label>
                <Switch checked={showPerfectGlow} onCheckedChange={setShowPerfectGlow} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <Label htmlFor="character-glow" className="text-sm font-medium cursor-pointer text-foreground/80">
                  Character glow
                </Label>
                <Switch checked={showCharacterGlow} onCheckedChange={setShowCharacterGlow} />
              </div>
            </div>
          </section>

          {/* Helpful hint at the bottom */}
          <div className="mt-8 p-3 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/30 backdrop-blur-sm">
            <p className="text-xs text-muted-foreground/80 leading-relaxed">
              💡 Press <kbd className="px-1.5 py-0.5 rounded bg-background border border-border/50 font-mono text-xs font-semibold text-foreground/90">Esc</kbd> anytime to toggle settings, or <kbd className="px-1.5 py-0.5 rounded bg-background border border-border/50 font-mono text-xs font-semibold text-foreground/90">Tab</kbd> to restart your test.
            </p>
          </div>

          {/* Bottom padding for scrolling */}
          <div className="h-6" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

