# 🎨 TypeFlow Style System - Quick Start Guide

## Using the New Component Styles Utility

The new `componentStyles.ts` file provides centralized styling utilities for consistent component design across your application.

## Quick Examples

### 1. Creating Styled Panels

```tsx
import { createPanelClass } from "@/lib/componentStyles";

// Basic panel
<div className={createPanelClass()}>Content</div>

// Elevated panel with glow
<div className={createPanelClass({ elevated: true, glow: "primary" })}>
  Important Content
</div>

// Interactive panel
<div className={createPanelClass({ interactive: true, glow: "secondary" })}>
  Click Me
</div>

// Custom additions
<div className={createPanelClass({ custom: "max-w-2xl mx-auto" })}>
  Centered Content
</div>
```

### 2. Creating Styled Buttons

```tsx
import { createButtonClass } from "@/lib/componentStyles";

// Primary large button
<button className={createButtonClass("primary", "lg")}>
  Click Me
</button>

// Secondary small button
<button className={createButtonClass("secondary", "sm")}>
  Small Action
</button>

// Ghost button with custom classes
<button className={createButtonClass("ghost", "base", "w-full")}>
  Full Width
</button>

// Outline button with icon size
<button className={createButtonClass("outline", "icon")}>
  <Icon />
</button>
```

### 3. Using Predefined Style Sets

```tsx
import { 
  panelStyles, 
  buttonStyles, 
  textStyles,
  badgeStyles,
  glowEffects 
} from "@/lib/componentStyles";

// Panel with base styles
<div className={`${panelStyles.base} ${panelStyles.elevated}`}>
  Elevated Panel
</div>

// Button with text styling
<button className={`${buttonStyles.primary} px-4 py-2`}>
  Action Button
</button>

// Typography hierarchy
<h1 className={textStyles.heading.h1}>Main Heading</h1>
<h3 className={textStyles.heading.h3}>Sub Heading</h3>
<p className={textStyles.body.base}>Body text</p>
<p className={textStyles.body.muted}>Muted text</p>

// Badge styling
<span className={badgeStyles.primary}>Primary Badge</span>
<span className={badgeStyles.success}>Success Badge</span>

// Glow effects
<div className={glowEffects.primary}>Glowing Box</div>
```

## Style Categories

### Panel Styles
- `panelStyles.base` - Base panel styling
- `panelStyles.elevated` - Added shadow and depth
- `panelStyles.interactive` - Hover effects
- `panelStyles.glow.primary` - Primary glow
- `panelStyles.glow.secondary` - Secondary glow

### Button Styles
- `buttonStyles.base` - Base button structure
- `buttonStyles.primary` - Primary variant
- `buttonStyles.secondary` - Secondary variant
- `buttonStyles.ghost` - Ghost variant
- `buttonStyles.outline` - Outline variant

### Text Styles
- `textStyles.heading` - h1, h2, h3, h4
- `textStyles.body` - base, sm, xs, muted
- `textStyles.gradient` - Gradient text effect

### Badge/Tag Styles
- `badgeStyles.primary` - Primary badge
- `badgeStyles.secondary` - Secondary badge
- `badgeStyles.success` - Success badge
- `badgeStyles.destructive` - Destructive badge
- `badgeStyles.warning` - Warning badge

### Form Styles
- `formStyles.input` - Input element styling
- `formStyles.label` - Label styling
- `formStyles.helpText` - Help text styling

### Grid Styles
- `gridStyles.auto` - Auto columns (1, 2, 3)
- `gridStyles.two` - 2 column grid
- `gridStyles.three` - 3 column grid
- `gridStyles.four` - 4 column grid

### Glow Effects
- `glowEffects.primary` - Primary glow shadow
- `glowEffects.secondary` - Secondary glow
- `glowEffects.accent` - Accent glow
- `glowEffects.gold` - Gold glow

## Animation Classes

```tsx
import { animationStyles } from "@/lib/componentStyles";

// Using animation classes
<div className={animationStyles.fadeIn}>Fading In</div>
<div className={animationStyles.fadeInUp}>Sliding Up</div>
<div className={animationStyles.scaleIn}>Scaling In</div>
<div className={animationStyles.pulseGlow}>Pulsing Glow</div>
<div className={animationStyles.shimmer}>Shimmering</div>
<div className={animationStyles.float}>Floating</div>
```

## Common Patterns

### Responsive Grid with Panels

```tsx
<div className={gridStyles.three}>
  {items.map(item => (
    <div key={item.id} className={createPanelClass({ elevated: true })}>
      {item.content}
    </div>
  ))}
</div>
```

### Form Input with Label and Help Text

```tsx
<div className="space-y-2">
  <label className={formStyles.label}>Email Address</label>
  <input className={formStyles.input} type="email" />
  <p className={formStyles.helpText}>We'll never share your email</p>
</div>
```

### Action Button Section

```tsx
<div className="flex gap-3">
  <button className={createButtonClass("primary", "lg")}>
    Save Changes
  </button>
  <button className={createButtonClass("ghost", "lg")}>
    Cancel
  </button>
</div>
```

### Badge Group

```tsx
<div className="flex flex-wrap gap-2">
  <span className={badgeStyles.primary}>Active</span>
  <span className={badgeStyles.success}>Verified</span>
  <span className={badgeStyles.warning}>Pending</span>
</div>
```

### Card with Title and Actions

```tsx
<div className={createPanelClass({ base: true, elevated: true })}>
  <h3 className={textStyles.heading.h3}>Card Title</h3>
  <p className={textStyles.body.base}>Card content goes here</p>
  <div className="flex gap-2 mt-4">
    <button className={createButtonClass("primary", "sm")}>Save</button>
    <button className={createButtonClass("ghost", "sm")}>Cancel</button>
  </div>
</div>
```

## Color Reference

### Semantic Colors
- `primary` - Main action color (262 85% 60%)
- `secondary` - Secondary color (196 87% 60%)
- `success` - Success state (142 75% 55%)
- `destructive` - Destructive action (0 86% 66%)
- `warning` - Warning state (38 92% 60%)
- `gold` - Achievement/premium (42 96% 68%)

### Neutral Colors
- `background` - Main background (240 13% 5%)
- `foreground` - Main text (210 40% 96%)
- `muted` - Muted elements (240 8% 18%)
- `border` - Borders (240 7% 22%)

## Tips for Consistency

1. **Always use semantic colors** - Don't hardcode hex/rgb values
2. **Use helper functions** - `createPanelClass()` and `createButtonClass()` ensure consistency
3. **Extend, don't override** - Add custom classes after utility classes
4. **Follow the grid system** - Use predefined grid layouts
5. **Respect spacing** - Use `spacingStyles` for consistent gaps
6. **Use animations sparingly** - Only where they enhance UX

## Troubleshooting

### Styles not applying?
- Ensure the component is using Tailwind classes
- Check that `@tailwind` directives are in index.css
- Verify the Tailwind config includes your file paths

### Glow effects not visible?
- Make sure the element has enough contrast
- Check if `backdrop-filter` is supported in your browser
- Glow works best on dark backgrounds

### Animations not smooth?
- Check `prefers-reduced-motion` settings
- Ensure GPU acceleration with `will-change` on animated elements
- Use `transform` instead of `left/top` for position changes

## Performance Considerations

- ✅ Utilities use CSS Custom Properties (fast)
- ✅ Glow effects use `box-shadow` (GPU accelerated)
- ✅ Animations use `transform` and `opacity` (performant)
- ✅ Backdrop filters are hardware accelerated
- ✅ Classes are purged by Tailwind in production

## Browser Support

- ✅ Chrome/Edge 76+
- ✅ Firefox 103+
- ✅ Safari 9+
- ✅ Mobile browsers (iOS 14+, Android 5+)

---

**More Information**: See DESIGN_IMPROVEMENTS.md for detailed documentation.

**Need Help?** Check the component examples in the codebase for real-world usage patterns.
