import { Header } from "@/components/Header";
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
  Check
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect } from "react";

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">Configure your typing experience and visual preferences.</p>
            </div>
            <Button 
              onClick={() => navigate("/")}
              className="glow-primary self-start"
            >
              Back to Test
            </Button>
          </div>

          <Tabs defaultValue="typing" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 glass-sm mb-8">
              <TabsTrigger value="typing" className="gap-2">
                <Keyboard className="h-4 w-4" />
                <span>Typing</span>
              </TabsTrigger>
              <TabsTrigger value="visuals" className="gap-2">
                <Palette className="h-4 w-4" />
                <span>Visuals</span>
              </TabsTrigger>
              <TabsTrigger value="typography" className="gap-2">
                <Type className="h-4 w-4" />
                <span>Typography</span>
              </TabsTrigger>
              <TabsTrigger value="sound" className="gap-2">
                <Volume2 className="h-4 w-4" />
                <span>Sound</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="typing" className="space-y-6">
              <Card className="glass-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Keyboard className="h-5 w-5 text-primary" />
                    Input Settings
                  </CardTitle>
                  <CardDescription>Adjust how the typing test behaves.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Include Punctuation</Label>
                      <p className="text-sm text-muted-foreground italic">Add dots, commas, and other symbols.</p>
                    </div>
                    <Switch 
                      checked={settings.includePunctuation} 
                      onCheckedChange={settings.setIncludePunctuation} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Include Numbers</Label>
                      <p className="text-sm text-muted-foreground italic">Test your number row speed.</p>
                    </div>
                    <Switch 
                      checked={settings.includeNumbers} 
                      onCheckedChange={settings.setIncludeNumbers} 
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MousePointer2 className="h-5 w-5 text-secondary" />
                    Caret Style
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {CARET_STYLES.map((style) => (
                    <Button
                      key={style.value}
                      variant={settings.caretStyle === style.value ? "default" : "outline"}
                      className={`h-20 flex-col gap-2 ${settings.caretStyle === style.value ? "glow-primary border-primary" : "border-primary/10 hover:border-primary/30"}`}
                      onClick={() => settings.setCaretStyle(style.value)}
                    >
                      <span className="font-semibold">{style.label}</span>
                      <div className="w-full flex justify-center">
                        {style.value === 'line' && <div className="h-5 w-0.5 bg-current animate-pulse" />}
                        {style.value === 'block' && <div className="h-5 w-3 bg-current/50" />}
                        {style.value === 'underline' && <div className="h-0.5 w-4 bg-current mt-4" />}
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="visuals" className="space-y-6">
              <Card className="glass-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5 text-primary" />
                    Visual Effects
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center justify-between">
                      <Label>Streak Counter</Label>
                      <Switch 
                        checked={settings.showStreakCounter} 
                        onCheckedChange={settings.setShowStreakCounter} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Speed Zone Color</Label>
                      <Switch 
                        checked={settings.showSpeedZone} 
                        onCheckedChange={settings.setShowSpeedZone} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Particle Effects</Label>
                      <Switch 
                        checked={settings.showParticleEffects} 
                        onCheckedChange={settings.setShowParticleEffects} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Keyboard Heatmap</Label>
                      <Switch 
                        checked={settings.showKeyboardHeatmap} 
                        onCheckedChange={settings.setShowKeyboardHeatmap} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Blur Unused Words</Label>
                      <Switch 
                        checked={settings.blurUnusedWords} 
                        onCheckedChange={settings.setBlurUnusedWords} 
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Character Glow</Label>
                      <Switch 
                        checked={settings.showCharacterGlow} 
                        onCheckedChange={settings.setShowCharacterGlow} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography" className="space-y-6">
              <Card className="glass-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5 text-primary" />
                    Typography settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="space-y-4">
                    <Label>Font Family</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {FONTS.map((font) => (
                        <button
                          key={font.value}
                          onClick={() => settings.setFontFamily(font.value)}
                          className={`
                            p-4 rounded-xl border text-left transition-all duration-200 group
                            ${settings.fontFamily === font.value 
                              ? "border-primary bg-primary/10 ring-1 ring-primary" 
                              : "border-primary/10 hover:border-primary/40 bg-primary/5"}
                          `}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
                              {font.label}
                            </span>
                            {settings.fontFamily === font.value && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </div>
                          <p className={`text-2xl ${FONT_CLASSES[font.value]} leading-tight`}>
                            {font.value === 'vt323' ? 'INSERT COIN TO START' : 
                             font.value === 'space-mono' ? 'hello_world.exe' :
                             font.value === 'lexend' ? 'Focus on the flow.' :
                             'The quick brown fox'}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Font Size ({settings.fontSize}px)</Label>
                    </div>
                    <Slider 
                      value={[settings.fontSize]} 
                      min={16} 
                      max={48} 
                      step={1} 
                      onValueChange={([val]) => settings.setFontSize(val)}
                      className="py-4"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sound" className="space-y-6">
              <Card className="glass-lg border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Volume2 className="h-5 w-5 text-primary" />
                    Audio Feedback
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Key Click Sounds</Label>
                      <p className="text-sm text-muted-foreground italic">Play mechanical sound on every keypress.</p>
                    </div>
                    <Switch 
                      checked={settings.keySoundEnabled} 
                      onCheckedChange={settings.setKeySound} 
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Error Sound</Label>
                      <p className="text-sm text-muted-foreground italic">Play a distinctive sound when you make a mistake.</p>
                    </div>
                    <Switch 
                      checked={settings.errorSoundEnabled} 
                      onCheckedChange={settings.setErrorSound} 
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="p-6 rounded-2xl bg-panel/40 border border-primary/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 uppercase tracking-wide text-primary/80">
              <Zap className="h-4 w-4" />
              Keyboard Shortcuts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/5">
                <span className="text-sm text-muted-foreground">Restart test</span>
                <kbd className="px-2 py-1 rounded bg-muted border border-border/50 font-mono text-xs">Tab</kbd>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-primary/5">
                <span className="text-sm text-muted-foreground">Main Menu</span>
                <kbd className="px-2 py-1 rounded bg-muted border border-border/50 font-mono text-xs">Esc</kbd>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

