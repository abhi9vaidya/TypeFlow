// Build: 20251114
/**
 * Centralized component styling utilities for consistent design across the app
 * This ensures a cohesive, modern aesthetic with proper spacing, effects, and animations
 */

import { cn } from "./utils";

// Panel/Container styles
export const panelStyles = {
  base: "rounded-xl border border-border/40 bg-panel/50 backdrop-blur-sm transition-all duration-300",
  elevated: "shadow-lg hover:shadow-xl",
  interactive: "hover:bg-panel/60 hover:border-border/60 cursor-pointer",
  glow: {
    primary: "shadow-glow-primary",
    secondary: "shadow-glow-secondary",
  },
};

// Card styles with glass morphism
export const cardStyles = {
  base: "rounded-xl border border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-300",
  hover: "hover:shadow-md hover:border-border/60",
  interactive: "hover:bg-card/70 cursor-pointer",
};

// Button base styles
export const buttonStyles = {
  base: "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200",
  focus: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  disabled: "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none",
  
  primary: "bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground hover:shadow-glow-primary active:scale-95",
  secondary: "bg-gradient-to-r from-secondary/90 to-secondary/70 text-secondary-foreground hover:shadow-glow-secondary active:scale-95",
  ghost: "text-foreground/70 hover:bg-primary/5 hover:text-primary hover:shadow-sm",
  outline: "border border-border/50 bg-background/50 hover:bg-primary/5 hover:border-primary/50",
};

// Text styles
export const textStyles = {
  heading: {
    h1: "text-4xl md:text-5xl font-bold tracking-tight",
    h2: "text-3xl md:text-4xl font-bold tracking-tight",
    h3: "text-2xl md:text-3xl font-bold tracking-tight",
    h4: "text-xl md:text-2xl font-bold tracking-tight",
  },
  body: {
    base: "text-base text-foreground/90",
    sm: "text-sm text-foreground/80",
    xs: "text-xs text-foreground/70",
    muted: "text-muted-foreground",
    mutedSm: "text-sm text-muted-foreground",
  },
  gradient: "bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent",
};

// Input/Form styles
export const formStyles = {
  input: "rounded-lg border border-border/50 bg-input/50 backdrop-blur-sm px-4 py-2 transition-all duration-200 focus:ring-2 focus:ring-primary focus:border-primary hover:border-border/70",
  label: "text-sm font-medium text-foreground/90 transition-colors",
  helpText: "text-xs text-muted-foreground mt-1.5",
};

// Badge/Tag styles
export const badgeStyles = {
  primary: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-medium",
  secondary: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30 text-xs font-medium",
  success: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-success/20 text-success border border-success/30 text-xs font-medium",
  destructive: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-destructive/20 text-destructive border border-destructive/30 text-xs font-medium",
  warning: "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-warning/20 text-warning border border-warning/30 text-xs font-medium",
};

// Animation utilities
export const animationStyles = {
  fadeIn: "animate-fade-in",
  fadeInUp: "animate-fade-in-up",
  fadeInDown: "animate-fade-in-down",
  scaleIn: "animate-scale-in",
  slideInRight: "animate-slide-in-right",
  pulseGlow: "animate-pulse-glow",
  shimmer: "animate-shimmer",
  float: "animate-float",
};

// Spacing utilities
export const spacingStyles = {
  section: "space-y-12",
  content: "space-y-6",
  tight: "space-y-3",
  relaxed: "space-y-8",
};

// Utility function to combine panel styles
export function createPanelClass(options: {
  base?: boolean;
  elevated?: boolean;
  interactive?: boolean;
  glow?: "primary" | "secondary" | false;
  custom?: string;
} = {}): string {
  const {
    base = true,
    elevated = false,
    interactive = false,
    glow = false,
    custom = "",
  } = options;

  return cn(
    base && panelStyles.base,
    elevated && panelStyles.elevated,
    interactive && panelStyles.interactive,
    glow === "primary" && panelStyles.glow.primary,
    glow === "secondary" && panelStyles.glow.secondary,
    custom
  );
}

// Utility function to combine button styles
export function createButtonClass(
  variant: "primary" | "secondary" | "ghost" | "outline" = "primary",
  size: "sm" | "base" | "lg" | "icon" = "base",
  custom: string = ""
): string {
  const sizeMap = {
    sm: "h-9 px-3 rounded-lg text-xs",
    base: "h-10 px-4 py-2 rounded-lg text-sm",
    lg: "h-12 px-6 rounded-lg text-base",
    icon: "h-10 w-10 rounded-lg",
  };

  const variantMap = {
    primary: buttonStyles.primary,
    secondary: buttonStyles.secondary,
    ghost: buttonStyles.ghost,
    outline: buttonStyles.outline,
  };

  return cn(
    buttonStyles.base,
    buttonStyles.focus,
    buttonStyles.disabled,
    variantMap[variant],
    sizeMap[size],
    custom
  );
}

// Responsive grid utilities
export const gridStyles = {
  auto: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4",
  two: "grid grid-cols-1 md:grid-cols-2 gap-6",
  three: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
  four: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4",
};

// Glow effect utilities
export const glowEffects = {
  primary: "shadow-[0_0_20px_hsl(var(--primary)_/_0.4),0_0_40px_hsl(var(--primary)_/_0.2)]",
  secondary: "shadow-[0_0_20px_hsl(var(--secondary)_/_0.3),0_0_40px_hsl(var(--secondary)_/_0.15)]",
  accent: "shadow-[0_0_20px_hsl(var(--accent)_/_0.3),0_0_40px_hsl(var(--accent)_/_0.15)]",
  gold: "shadow-[0_0_20px_hsl(var(--gold)_/_0.4),0_0_40px_hsl(var(--gold)_/_0.2)]",
};

// Focus ring utilities
export const focusStyles = {
  ring: "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  ringSmall: "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary",
};

// Transition utilities
export const transitionStyles = {
  smooth: "transition-all duration-200 ease-out",
  smoothLong: "transition-all duration-300 ease-out",
  instant: "transition-none",
};

export default {
  panelStyles,
  cardStyles,
  buttonStyles,
  textStyles,
  formStyles,
  badgeStyles,
  animationStyles,
  spacingStyles,
  gridStyles,
  glowEffects,
  focusStyles,
  transitionStyles,
  createPanelClass,
  createButtonClass,
};

