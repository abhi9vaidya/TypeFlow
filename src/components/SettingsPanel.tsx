// Build: 20251114
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { X, Palette, Type, Check, Settings as SettingsIcon, Zap } from "lucide-react";
import { useSettingsStore, Theme, CaretStyle, FontFamily } from "@/store/useSettingsStore";
import { useEffect } from "react";
import { applyTheme } from "@/utils/themes";
import { CustomThemeEditor } from "./CustomThemeEditor";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
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
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
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
        <div className="sticky top-0 z-10 bg-gradient-to-b from-background via-background/95 to-background/80 border-b border-border/30 backdrop-blur-sm px-6 py-6 transition-all duration-300">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-primary/80 to-secondary bg-clip-text text-transparent">
                Quick Settings
              </h2>
              <p className="text-xs text-muted-foreground mt-1">Configure your experience on the fly</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  onClose();
                  navigate("/settings");
                }}
                className="h-9 gap-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold transition-all duration-200"
              >
                <SettingsIcon className="h-3.5 w-3.5" />
                Full Settings
              </Button>
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
                    "transition-all duration-200 text-[10px] font-semibold flex flex-col gap-1.5 h-14 rounded-xl",
                    caretStyle === style
                      ? "bg-gradient-to-r from-primary/90 to-primary/70 border-primary shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                      : "border-border/40 bg-muted/30 hover:border-primary/60 hover:bg-muted/50"
                  )}
                >
                  <div className="flex justify-center items-end h-4">
                    {style === 'line' && <div className="h-4 w-0.5 bg-current animate-caret-pulse" />}
                    {style === 'block' && <div className="h-4 w-2.5 bg-current/40 border border-current/60" />}
                    {style === 'underline' && <div className="h-0.5 w-3 bg-current" />}
                  </div>
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </Button>
              ))}
            </div>
          </section>

          <Separator className="bg-border/20" />

          {/* Typography Settings */}
          <section className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-6 w-1 bg-gradient-to-b from-primary to-accent rounded-full" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Typography</h3>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground ml-1">Font Family</Label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "font-mono", name: "Default Mono" },
                    { id: "jetbrains", name: "JetBrains" },
                    { id: "roboto-mono", name: "Roboto" },
                    { id: "fira-code", name: "Fira Code" },
                  ].map((font) => (
                    <button
                      key={font.id}
                      onClick={() => setFontFamily(font.id as FontFamily)}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-left transition-all text-xs font-medium flex items-center justify-between",
                        fontFamily === font.id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border/40 bg-muted/20 hover:border-primary/40 text-muted-foreground"
                      )}
                    >
                      <span className={font.id}>{font.name}</span>
                      {fontFamily === font.id && <Check className="h-3 w-3" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Font Size</Label>
                  <span className="text-xs font-mono text-primary font-bold">{fontSize}px</span>
                </div>
                <Slider 
                  value={[fontSize]} 
                  min={16} 
                  max={48} 
                  step={1} 
                  onValueChange={([val]) => setFontSize(val)}
                  className="py-2"
                />
              </div>
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
              <div className="h-6 w-1 bg-gradient-to-b from-amber-400 to-rose-500 rounded-full shadow-[0_0_8px_rgba(251,191,36,0.4)]" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Effects</h3>
            </div>
            <div className="space-y-2 bg-muted/20 rounded-lg p-3 border border-border/20">
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <div className="space-y-0.5">
                  <Label htmlFor="streak-counter" className="text-sm font-medium cursor-pointer text-foreground/80">
                    Streak counter
                  </Label>
                  <p className="text-[10px] text-muted-foreground/60">Show your combo multiplier</p>
                </div>
                <Switch checked={showStreakCounter} onCheckedChange={setShowStreakCounter} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <div className="space-y-0.5">
                  <Label htmlFor="speed-zone" className="text-sm font-medium cursor-pointer text-foreground/80">
                    Speed zone
                  </Label>
                  <p className="text-[10px] text-muted-foreground/60">Dynamic background glow</p>
                </div>
                <Switch checked={showSpeedZone} onCheckedChange={setShowSpeedZone} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <div className="space-y-0.5">
                  <Label htmlFor="particle-effects" className="text-sm font-medium cursor-pointer text-foreground/80">
                    Particle effects
                  </Label>
                  <p className="text-[10px] text-muted-foreground/60">Burst on every keypress</p>
                </div>
                <Switch checked={showParticleEffects} onCheckedChange={setShowParticleEffects} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <div className="space-y-0.5">
                  <Label htmlFor="circular-progress" className="text-sm font-medium cursor-pointer text-foreground/80">
                    Progress rings
                  </Label>
                  <p className="text-[10px] text-muted-foreground/60">Circular accuracy indicator</p>
                </div>
                <Switch checked={showCircularProgress} onCheckedChange={setShowCircularProgress} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <div className="space-y-0.5">
                  <Label htmlFor="perfect-glow" className="text-sm font-medium cursor-pointer text-foreground/80">
                    Perfect typing glow
                  </Label>
                  <p className="text-[10px] text-muted-foreground/60">Glow when accuracy is 100%</p>
                </div>
                <Switch checked={showPerfectGlow} onCheckedChange={setShowPerfectGlow} />
              </div>
              <div className="flex items-center justify-between rounded-lg px-3 py-2.5 hover:bg-muted/30 transition-colors duration-200">
                <div className="space-y-0.5">
                  <Label htmlFor="character-glow" className="text-sm font-medium cursor-pointer text-foreground/80">
                    Character glow
                  </Label>
                  <p className="text-[10px] text-muted-foreground/60">Highlight typed characters</p>
                </div>
                <Switch checked={showCharacterGlow} onCheckedChange={setShowCharacterGlow} />
              </div>
            </div>
          </section>

          <Separator className="bg-border/20" />

          {/* Shortcuts Section */}
          <section className="space-y-3 pb-4">
            <div className="flex items-center gap-3">
              <Zap className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground/90">Shortcuts</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/20 border border-border/20">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Restart Test</span>
                <kbd className="self-start px-2 py-1 rounded bg-background border border-border/50 font-mono text-xs font-semibold">Tab</kbd>
              </div>
              <div className="flex flex-col gap-1 p-3 rounded-lg bg-muted/20 border border-border/20">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Toggle Quick Settings</span>
                <kbd className="self-start px-2 py-1 rounded bg-background border border-border/50 font-mono text-xs font-semibold">Esc</kbd>
              </div>
            </div>
          </section>

          {/* Helpful hint at the bottom */}
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/20 backdrop-blur-sm">
            <p className="text-xs text-muted-foreground/90 leading-relaxed italic text-center">
              "Type your way to the top. Every character counts."
            </p>
          </div>

          {/* Bottom padding for scrolling */}
          <div className="h-8" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

