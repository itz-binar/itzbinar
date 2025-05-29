/**
 * Central type definitions for the application
 */

// Theme types
export type Theme = 'dark' | 'light';

export interface ThemeContextType {
  isDarkTheme: boolean;
  setDarkTheme: (value: boolean) => void;
  toggleTheme: () => void;
}

export interface UseThemeReturn {
  theme: Theme;
  isDarkTheme: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// Component props
export interface ThemeToggleProps {
  className?: string;
}

export interface TypewriterTextProps {
  text: string;
  delay?: number;
  className?: string;
  onComplete?: () => void;
  startDelay?: number;
}

export interface MatrixBackgroundProps {
  density?: number;  // Higher means more characters
  speed?: number;    // Speed multiplier (1 is default)
  fadeOpacity?: number; // Trail fade opacity (0.05 is default)
  characters?: string; // Custom character set
  glowEffect?: boolean; // Whether to add glow effect
  depthEffect?: boolean; // Whether to add depth variation
}

export interface ParticleEffectProps {
  count?: number;
  connectDistance?: number;
  opacity?: number;
  pulseEffect?: boolean;
  size?: number;
  depthEffect?: boolean;
  trailEffect?: boolean;
}

// Terminal types
export interface SystemStats {
  cpu: number;
  memory: number;
  network: number;
  threats: number;
  connections: number;
  uptime: number;
  browser?: string;
  os?: string;
  device?: string;
}

export interface SecurityEvent {
  id: string;
  type: 'breach' | 'scan' | 'connection' | 'firewall';
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface TerminalSettings {
  fontSize: number;
  opacity: number;
  theme: 'auto' | 'matrix' | 'dark' | 'light';
  alwaysOnTop: boolean;
  fullscreen: boolean;
}

export interface TerminalPosition {
  x: number;
  y: number;
}

export interface CommandHistory {
  command: string;
  output: string;
  isError?: boolean;
}

// Advanced types for matrix effect
export interface MatrixDrop {
  y: number;
  speed: number;
  depth: number; // 0-1 value for depth effect
  lastChar: string;
  lastSpecial: boolean;
  changeInterval: number;
  lastChange: number;
}

// Particle types
export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  depth: number;
  pulse: number;
  pulseDirection: number;
  color: string;
  pulseSpeed: number;
}

// Monitor positions
export interface MonitorPosition {
  x: number;
  y: number;
}

export interface HUDState {
  systemMonitor: {
    visible: boolean;
    position: MonitorPosition;
    isDragging: boolean;
  };
  securityMonitor: {
    visible: boolean;
    position: MonitorPosition;
    isDragging: boolean;
  };
} 