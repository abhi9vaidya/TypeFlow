import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useSettingsStore, FontFamily, CaretStyle } from "@/store/useSettingsStore";
import {
  Keyboard,
  Volume2,
  Palette,
  Type,
  Eye,
  MousePointer2,
  Zap,
  Check,
  ChevronLeft,
  Flame,
  Settings as SettingsIcon,
  Activity,
  ShieldCheck,
  Target,
  Hash
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const FONTS: { label: string; value: FontFamily }[] = [
  { label: "Modern Mono", value: "jetbrains" },
  { label: "Classic Mono", value: "roboto-mono" },
  { label: "Coding Mono", value: "fira-code" },
  { label: "Geometric", value: "space-mono" },
  { label: "8-bit Retro", value: "vt323" },
  { label: "Speed Reader", value: "lexend" },
];

const FONT_CLASSES: Record<FontFamily, string> = {
  "jetbrains": "font-jetbrains",
  "roboto-mono": "font-roboto-mono",
  "fira-code": "font-fira-code",
  "space-mono": "font-space-mono",
  "vt323": "font-vt323",
  "lexend": "font-lexend",
};

const CARET_STYLES: { label: string; value: CaretStyle }[] = [
  { label: "Line", value: "line" },
  { label: "Block", value: "block" },
  { label: "Underline", value: "underline" },
];

export default function Settings() {
  const navigate = useNavigate();
  const settings = useSettingsStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        navigate("/");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigate]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <div className="min-h-screen pb-20 pt-12 overflow-hidden">
      <main className="container mx-auto px-4 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        <motion.div 
          className="max-w-5xl mx-auto space-y-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate("/")}
                  className="rounded-full h-8 w-8 p-0 border border-white/5 bg-white/5 hover:bg-white/10 transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 py-1 px-3">
                  <SettingsIcon className="w-3 h-3 mr-1" /> Core Configuration
                </Badge>
              </div>
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent italic tracking-tight uppercase">
                SETTINGS
              </h1>
              <p className="text-muted-foreground font-medium">
                Calibrate your mechanical interface for peak performance.
              </p>
            </div>

            <Button
              onClick={() => navigate("/")}
              className="h-16 px-10 rounded-[1.5rem] bg-primary hover:bg-primary/90 text-primary-foreground font-black italic tracking-widest shadow-xl shadow-primary/20 transition-all"
            >
              SAVE & EXIT [ESC]
            </Button>
          </div>

          <Tabs defaultValue="typing" className="w-full space-y-10">
            <div className="flex justify-center md:justify-start overflow-x-auto pb-4 px-4 scrollbar-hide">
              <TabsList className="bg-panel/10 backdrop-blur-md border border-white/5 p-1.5 rounded-3xl h-16 inline-flex">
                <TabsTrigger value="typing" className="px-10 rounded-2xl font-black italic uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 gap-3">
                  <Keyboard className="w-4 h-4" /> TYPING
                </TabsTrigger>
                <TabsTrigger value="visuals" className="px-10 rounded-2xl font-black italic uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 gap-3">
                  <Palette className="w-4 h-4" /> VISUALS
                </TabsTrigger>
                <TabsTrigger value="typography" className="px-10 rounded-2xl font-black italic uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 gap-3">
                  <Type className="w-4 h-4" /> TYPE
                </TabsTrigger>
                <TabsTrigger value="sound" className="px-10 rounded-2xl font-black italic uppercase tracking-widest text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300 gap-3">
                  <Volume2 className="w-4 h-4" /> SOUND
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="px-4">
              <AnimatePresence mode="wait">
                <TabsContent value="typing" className="mt-0 space-y-8 outline-none">
                  <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input Config */}
                    <Card className="border-white/5 bg-panel/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                      <CardHeader className="p-10 pb-6">
                        <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                           <Activity className="w-6 h-6 text-primary" /> ENGINE CONFIG
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-50">Behavioral mechanics and session logic</CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 pt-0 space-y-6 flex-1">
                        {[
                          { label: "SMOOTH CARET", desc: "Interpolated cursor movement", value: settings.smoothCaret, setter: settings.setSmoothCaret },
                          { label: "QUICK RESTART", desc: "Tab to reset session instantly", value: settings.quickRestart, setter: settings.setQuickRestart },
                          { label: "INDICATE TYPOS", desc: "Visual feedback on error", value: settings.indicateTypos, setter: settings.setIndicateTypos },
                          { label: "PUNCTUATION", desc: "Include dots and symbols", value: settings.includePunctuation, setter: settings.setIncludePunctuation },
                          { label: "NUMBERS", desc: "Include digits row", value: settings.includeNumbers, setter: settings.setIncludeNumbers },
                        ].map((s) => (
                          <div key={s.label} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all group">
                            <div className="space-y-1">
                              <Label className="text-sm font-black italic group-hover:text-primary transition-colors">{s.label}</Label>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 italic">{s.desc}</p>
                            </div>
                            <Switch checked={s.value} onCheckedChange={s.setter} />
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    {/* Caret Style Selector */}
                    <Card className="border-white/5 bg-panel/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                      <CardHeader className="p-10 pb-6">
                        <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                           <Target className="w-6 h-6 text-secondary" /> OPTICAL BEACON
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-50">Choose your focus indicator</CardDescription>
                      </CardHeader>
                      <CardContent className="p-10 pt-0">
                        <div className="grid grid-cols-1 gap-4">
                           {CARET_STYLES.map((style) => (
                              <button
                                key={style.value}
                                onClick={() => settings.setCaretStyle(style.value)}
                                className={cn(
                                  "relative p-6 rounded-2xl border text-left transition-all duration-300 overflow-hidden group",
                                  settings.caretStyle === style.value 
                                    ? "bg-secondary/10 border-secondary ring-1 ring-secondary/30" 
                                    : "bg-white/[0.02] border-white/5 hover:border-secondary/30"
                                )}
                              >
                                <div className="flex items-center justify-between relative z-10">
                                  <div className="space-y-1">
                                    <span className="text-sm font-black italic uppercase tracking-wider">{style.label}</span>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-40">System preset {style.value}</p>
                                  </div>
                                  <div className="h-4 w-4 rounded-full border-2 border-secondary/20 flex items-center justify-center p-0.5">
                                     {settings.caretStyle === style.value && <div className="w-full h-full bg-secondary rounded-full" />}
                                  </div>
                                </div>
                                <div className="absolute top-1/2 right-12 -translate-y-1/2 font-mono text-2xl opacity-20 select-none">
                                   {style.value === 'line' && '|'}
                                   {style.value === 'block' && '█'}
                                   {style.value === 'underline' && '_'}
                                </div>
                              </button>
                           ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="visuals" className="mt-0 space-y-8 outline-none px-1">
                   <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <Card className="border-white/5 bg-panel/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardHeader className="p-10 pb-6">
                          <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                             <Eye className="w-6 h-6 text-indigo-500" /> OPTICAL PRESETS
                          </CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-50">Interface and background aesthetics</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-8">
                           <div className="space-y-6 bg-white/[0.02] p-8 rounded-2xl border border-white/5">
                              <div className="flex items-center justify-between">
                                 <div className="space-y-1">
                                    <Label className="text-sm font-black italic">INTERFACE OPACITY</Label>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">Transparency levels</p>
                                 </div>
                                 <Badge variant="outline" className="font-mono text-xs font-bold bg-background/50 border-white/5">{Math.round(settings.pageOpacity * 100)}%</Badge>
                              </div>
                              <Slider 
                                value={[settings.pageOpacity]} 
                                max={1} 
                                step={0.05} 
                                onValueChange={([val]) => settings.setPageOpacity(val)}
                              />
                           </div>

                           <div className="grid grid-cols-1 gap-4">
                              {[
                                { label: "AMBIENT AURA", desc: "Responsive background glow", value: settings.backgroundGlow, setter: settings.setBackgroundGlow },
                                { label: "DYNAMIC HEADER", desc: "Hide navbar during focus", value: settings.hideNavbarWhileTyping, setter: settings.setHideNavbarWhileTyping },
                                { label: "STREAK COUNTER", desc: "Precision combo meter", value: settings.showStreakCounter, setter: settings.setShowStreakCounter },
                                { label: "SPEED ZONE", desc: "Dynamic color mapping", value: settings.showSpeedZone, setter: settings.setShowSpeedZone },
                              ].map((v) => (
                                <div key={v.label} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all group">
                                  <div className="space-y-1">
                                    <Label className="text-sm font-black italic group-hover:text-indigo-500 transition-colors uppercase">{v.label}</Label>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 italic">{v.desc}</p>
                                  </div>
                                  <Switch checked={v.value} onCheckedChange={v.setter} />
                                </div>
                              ))}
                           </div>
                        </CardContent>
                     </Card>

                     <Card className="border-white/5 bg-panel/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col">
                        <CardHeader className="p-10 pb-6">
                           <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                              <Flame className="w-6 h-6 text-rose-500" /> FX PROTOCOLS
                           </CardTitle>
                           <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-50">Deep immersion toggles</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-0 space-y-6 flex-1">
                           {[
                              { label: "PARTICLES", desc: "Kinetic typing debris", value: settings.showParticleEffects, setter: settings.setShowParticleEffects },
                              { label: "HEATMAP", desc: "Keyboard usage overlay", value: settings.showKeyboardHeatmap, setter: settings.setShowKeyboardHeatmap },
                              { label: "WORD BLUR", desc: "Focus non-active text", value: settings.blurUnusedWords, setter: settings.setBlurUnusedWords },
                              { label: "GLOW KEYS", desc: "Per-char illumination", value: settings.showCharacterGlow, setter: settings.setShowCharacterGlow },
                              { label: "GHOSTING", desc: "Race against PB replay", value: settings.showGhost, setter: settings.setShowGhost },
                           ].map((v) => (
                            <div key={v.label} className="flex items-center justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-rose-500/20 transition-all group">
                              <div className="space-y-1">
                                <Label className="text-sm font-black italic group-hover:text-rose-500 transition-colors uppercase">{v.label}</Label>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 italic">{v.desc}</p>
                              </div>
                              <Switch checked={v.value} onCheckedChange={v.setter} />
                            </div>
                           ))}
                        </CardContent>
                     </Card>
                   </motion.div>
                </TabsContent>

                <TabsContent value="typography" className="mt-0 space-y-8 outline-none">
                  <motion.div variants={itemVariants}>
                    <Card className="border-white/5 bg-panel/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                       <CardHeader className="p-10 pb-6">
                          <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                             <Type className="w-6 h-6 text-emerald-500" /> TYPOGRAPHY ENGINE
                          </CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-50">Glyph geometry and readability</CardDescription>
                       </CardHeader>
                       <CardContent className="p-10 pt-0 space-y-12">
                          <div className="space-y-6">
                            <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Font Family Ecosystem</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {FONTS.map((font) => (
                                <button
                                  key={font.value}
                                  onClick={() => settings.setFontFamily(font.value)}
                                  className={cn(
                                    "p-6 rounded-2xl border text-left transition-all duration-300 group relative overflow-hidden",
                                    settings.fontFamily === font.value
                                      ? "bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/30 shadow-lg shadow-emerald-500/5"
                                      : "bg-white/[0.02] border-white/5 hover:border-emerald-500/30"
                                  )}
                                >
                                  <div className="flex items-center justify-between mb-4 relative z-10">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">
                                      {font.label}
                                    </span>
                                    {settings.fontFamily === font.value && (
                                      <div className="bg-emerald-500 p-1 rounded-full"><Check className="h-2.5 w-2.5 text-white" /></div>
                                    )}
                                  </div>
                                  <p className={cn("text-2xl tracking-tight leading-none truncate relative z-10", FONT_CLASSES[font.value])}>
                                    {font.value === 'vt323' ? 'INSERT COIN' : 'Typeflow Pro'}
                                  </p>
                                  <div className="absolute -bottom-4 -right-1 opacity-5 transition-transform group-hover:scale-125 duration-700">
                                     <Type className="w-24 h-24" />
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="space-y-8 bg-white/[0.02] p-8 rounded-[2rem] border border-white/5">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="text-sm font-black italic">GLYPH SCALE ({settings.fontSize}px)</Label>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest opacity-40 italic">Global text dimensions</p>
                              </div>
                              <Badge variant="outline" className="font-mono text-xs font-bold bg-background/50 border-white/5 px-4">{settings.fontSize}px</Badge>
                            </div>
                            <Slider
                              value={[settings.fontSize]}
                              min={16}
                              max={48}
                              step={1}
                              onValueChange={([val]) => settings.setFontSize(val)}
                              className="py-2"
                            />
                            <div className="flex justify-between items-center px-1">
                               <span className="text-[10px] font-black text-muted-foreground/40">16PX</span>
                               <span className="text-[10px] font-black text-muted-foreground/40 text-center italic">DYNAMIC SCALING ACTIVE</span>
                               <span className="text-[10px] font-black text-muted-foreground/40">48PX</span>
                            </div>
                          </div>
                       </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="sound" className="mt-0 space-y-8 outline-none">
                  <motion.div variants={itemVariants}>
                    <Card className="border-white/5 bg-panel/5 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                       <CardHeader className="p-10 pb-6">
                          <CardTitle className="text-2xl font-black italic flex items-center gap-3">
                             <Volume2 className="w-6 h-6 text-amber-500" /> AUDIO FEEDBACK
                          </CardTitle>
                          <CardDescription className="text-[10px] font-bold uppercase tracking-widest opacity-50">Haptic and auditory response systems</CardDescription>
                       </CardHeader>
                       <CardContent className="p-10 pt-0 space-y-6">
                          {[
                            { label: "KEY CLICK SOUNDS", desc: "Mechanical audio replication", value: settings.keySoundEnabled, setter: settings.setKeySound, icon: Zap },
                            { label: "ERROR NOTIFIER", desc: "Auditory alert on missed strikes", value: settings.errorSoundEnabled, setter: settings.setErrorSound, icon: Activity },
                          ].map((a) => (
                             <div key={a.label} className="flex items-center justify-between p-6 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all group">
                                <div className="flex items-center gap-6">
                                   <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
                                      <a.icon className="w-6 h-6 text-amber-500" />
                                   </div>
                                   <div className="space-y-1">
                                      <Label className="text-base font-black italic group-hover:text-amber-500 transition-colors">{a.label}</Label>
                                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60 italic">{a.desc}</p>
                                   </div>
                                </div>
                                <Switch checked={a.value} onCheckedChange={a.setter} />
                             </div>
                          ))}
                       </CardContent>
                       <CardFooter className="p-10 bg-white/[0.02] border-t border-white/5">
                          <div className="flex items-center gap-4 w-full">
                             <div className="bg-amber-500/20 p-3 rounded-xl border border-amber-500/30">
                                <ShieldCheck className="w-5 h-5 text-amber-500" />
                             </div>
                             <p className="text-[10px] font-bold text-muted-foreground/60 leading-relaxed max-w-lg italic">
                               Audio output is processed locally. For optimal experience, use headphones to monitor the mechanical resonance and timing intervals.
                             </p>
                          </div>
                       </CardFooter>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>

          {/* Shortcuts Overlay */}
          <motion.div variants={itemVariants} className="px-4">
             <div className="p-10 rounded-[2.5rem] bg-panel/20 backdrop-blur-3xl border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Zap className="w-32 h-32" />
                </div>
                <h3 className="text-xl font-black italic mb-8 flex items-center gap-3 uppercase tracking-tighter">
                  <Zap className="h-6 w-6 text-primary animate-pulse" />
                  KEYBOARD SHORTCUTS
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/5 group-hover:border-primary/20 transition-all">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">Rapid Restart</span>
                    <kbd className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-black text-xs shadow-lg shadow-primary/30">TAB</kbd>
                  </div>
                  <div className="flex items-center justify-between p-5 rounded-2xl bg-black/40 border border-white/5 group-hover:border-primary/20 transition-all">
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground italic">Main Navigation</span>
                    <kbd className="px-4 py-1.5 rounded-xl bg-white/10 text-foreground font-black text-xs">ESC</kbd>
                  </div>
                </div>
             </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}

