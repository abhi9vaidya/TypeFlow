// Build: 20251114
import { HexColorPicker } from "react-colorful";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CustomColors } from "@/store/useSettingsStore";
import { useState } from "react";

interface CustomThemeEditorProps {
  colors: CustomColors;
  onChange: (colors: CustomColors) => void;
}

function hslToHex(hsl: string): string {
  const [h, s, l] = hsl.split(' ').map(v => parseFloat(v));
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;
  
  const c = (1 - Math.abs(2 * lDecimal - 1)) * sDecimal;
  const x = c * (1 - Math.abs((hDecimal * 6) % 2 - 1));
  const m = lDecimal - c / 2;
  
  let r = 0, g = 0, b = 0;
  if (hDecimal < 1/6) [r, g, b] = [c, x, 0];
  else if (hDecimal < 2/6) [r, g, b] = [x, c, 0];
  else if (hDecimal < 3/6) [r, g, b] = [0, c, x];
  else if (hDecimal < 4/6) [r, g, b] = [0, x, c];
  else if (hDecimal < 5/6) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  
  const toHex = (n: number) => Math.round((n + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function hexToHsl(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  
  if (max === min) return `0 0% ${Math.round(l * 100)}%`;
  
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
  let h = 0;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

export function CustomThemeEditor({ colors, onChange }: CustomThemeEditorProps) {
  const [activeColor, setActiveColor] = useState<keyof CustomColors | null>(null);

  const colorLabels: Record<keyof CustomColors, string> = {
    primary: "Primary Color",
    secondary: "Secondary Color",
    success: "Accuracy Indicator",
    background: "Background",
  };

  const handleColorChange = (key: keyof CustomColors, hex: string) => {
    onChange({ ...colors, [key]: hexToHsl(hex) });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {(Object.keys(colorLabels) as Array<keyof CustomColors>).map((key) => (
          <div key={key}>
            <Label className="text-xs mb-2 block">{colorLabels[key]}</Label>
            <Button
              variant="outline"
              className="w-full h-12 p-1 hover:scale-105 transition-transform"
              onClick={() => setActiveColor(activeColor === key ? null : key)}
            >
              <div 
                className="w-full h-full rounded-md border border-border/50"
                style={{ backgroundColor: hslToHex(colors[key]) }}
              />
            </Button>
          </div>
        ))}
      </div>

      {activeColor && (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
          <Label className="text-sm font-semibold">{colorLabels[activeColor]}</Label>
          <HexColorPicker
            color={hslToHex(colors[activeColor])}
            onChange={(hex) => handleColorChange(activeColor, hex)}
            className="!w-full"
          />
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={hslToHex(colors[activeColor])}
              onChange={(e) => {
                const hex = e.target.value;
                if (/^#[0-9A-F]{6}$/i.test(hex)) {
                  handleColorChange(activeColor, hex);
                }
              }}
              className="flex-1 px-3 py-2 text-sm rounded-md bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setActiveColor(null)}
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

