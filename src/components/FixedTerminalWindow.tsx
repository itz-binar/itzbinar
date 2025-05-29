import React, { useState, useEffect, useRef, useCallback, useMemo, useContext } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { 
  Terminal as TerminalIcon, 
  Wifi, 
  Cpu, 
  HardDrive, 
  Battery, 
  Clock,
  Shield,
  Eye,
  Zap,
  Globe,
  Lock,
  Unlock,
  Activity,
  AlertTriangle,
  CheckCircle,
  X,
  Minimize2,
  Maximize2,
  Move,
  Power,
  GripHorizontal
} from 'lucide-react';
import TypewriterText from './TypewriterText';
import { ThemeContext } from '../App';
import { getSystemInfo, formatUptime } from '../utils/systemInfo';
import { 
  SystemStats, 
  SecurityEvent, 
  TerminalSettings, 
  TerminalPosition, 
  CommandHistory,
  HUDState,
  MonitorPosition
} from '../types';

interface TerminalWindowProps {
  isMobile?: boolean;
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ isMobile = false }) => {
  // Window state
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState<TerminalPosition>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [size, setSize] = useState({ 
    width: isMobile ? window.innerWidth : 800,
    height: isMobile ? 400 : 500 
  });
  const [isResizing, setIsResizing] = useState(false);
  const [initialSize, setInitialSize] = useState({ 
    width: isMobile ? window.innerWidth : 800,
    height: isMobile ? 400 : 500 
  });
  const [savedPosition, setSavedPosition] = useState<TerminalPosition>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Terminal state
  const [commands, setCommands] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<CommandHistory[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [time, setTime] = useState(new Date());
  const [isMatrixMode, setIsMatrixMode] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [isPoweringDown, setIsPoweringDown] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState<TerminalSettings>({
    fontSize: 14,
    opacity: 0.95,
    theme: 'auto',
    alwaysOnTop: false,
    fullscreen: false
  });
  
  // System stats
  const [stats, setStats] = useState<SystemStats>({
    cpu: 0,
    memory: 0,
    network: 0,
    threats: 0,
    connections: 0,
    uptime: 0
  });
  
  // Security events
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [showHUD, setShowHUD] = useState(true);
  
  // HUD state for movable monitors
  const [hudState, setHudState] = useState<HUDState>({
    systemMonitor: {
      visible: true,
      position: { x: window.innerWidth > 768 ? 20 : 10, y: 20 },
      isDragging: false
    },
    securityMonitor: {
      visible: true,
      position: { x: window.innerWidth > 768 ? 20 : 10, y: window.innerWidth > 768 ? 180 : 220 },
      isDragging: false
    }
  });
  
  const { isDarkTheme } = useContext(ThemeContext);
  
  // Refs
  const terminalRef = useRef<HTMLDivElement>(null);
  const matrixRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();
  const historyRef = useRef<HTMLDivElement>(null);

  // Boot sequence text
  const bootSequence = useMemo(() => [
    '[BOOT] Initializing NEXUS OS v3.7.2...',
    '[BOOT] Loading quantum encryption modules...',
    '[BOOT] Establishing dark web connections...',
    '[BOOT] Initializing stealth protocols...',
    '[BOOT] Loading exploit database...',
    '[BOOT] Activating neural firewall...',
    '[BOOT] Scanning for vulnerabilities...',
    '[BOOT] Establishing secure tunnels...',
    '[BOOT] Loading penetration testing suite...',
    '[BOOT] System compromise detection: ACTIVE',
    '[BOOT] Anonymous routing: ENABLED',
    '[BOOT] Trace resistance: MAXIMUM',
    '[SUCCESS] All systems operational. Welcome, Agent.',
    ''
  ], []);

  // Theme checker function
  const checkTheme = useCallback(() => {
    // We're now using context, so we don't need to set theme ourselves
    // Just for compatibility with existing code
  }, []);

  // Check theme from document
  useEffect(() => {
    // Initial check
    checkTheme();
    
    // Set up observer to detect class changes on html element
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
    
    return () => observer.disconnect();
  }, [checkTheme]);

  // Define the matrix drawing function
  const drawMatrix = useCallback((
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement,
    fontSize: number,
    drops: number[],
    charArray: string[],
    isDarkTheme: boolean
  ) => {
    // Use different background based on theme
    ctx.fillStyle = isDarkTheme ? 'rgba(0, 0, 0, 0.05)' : 'rgba(240, 240, 240, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Use different text color based on theme
    ctx.fillStyle = isDarkTheme ? '#00ff00' : '#007733';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      // Random character
      const text = charArray[Math.floor(Math.random() * charArray.length)];
      
      // Only draw if within canvas
      if (drops[i] * fontSize > 0) {
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
      }
      
      // Add randomness to the speed
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      
      drops[i] += 0.5 + Math.random() * 0.5;
    }
  }, []);

  // Handle resize for matrix effect
  const handleMatrixResize = useCallback((
    canvas: HTMLCanvasElement,
    fontSize: number,
    drops: number[]
  ) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Adjust columns for new width
    const newColumns = Math.ceil(canvas.width / fontSize);
    
    // Adjust drops array
    if (newColumns > drops.length) {
      for (let i = drops.length; i < newColumns; i++) {
        drops[i] = Math.floor(Math.random() * -10);
      }
    }
  }, []);

  // Stats updater function
  const updateStats = useCallback(() => {
    // Get real system information
    const systemInfo = getSystemInfo();
    
    setStats(systemInfo);
  }, []);

  // Security event generator
  const generateSecurityEvent = useCallback(() => {
    // More varied and realistic event types
    const eventTypes = [
      { 
        type: 'scan' as const, 
        messages: [
          'Port scan detected from 192.168.1.42', 
          'Stealth scan blocked from 45.33.21.87',
          'Vulnerability probe intercepted from 10.0.0.138',
          'Nmap scan detected from external network'
        ], 
        severity: 'medium' as const 
      },
      { 
        type: 'connection' as const, 
        messages: [
          'Encrypted tunnel established to tor-node-458.onion', 
          'VPN handshake complete with 10.11.12.13',
          'Secure shell connection from 192.168.1.54',
          'Anonymous proxy activated'
        ], 
        severity: 'low' as const 
      },
      { 
        type: 'firewall' as const, 
        messages: [
          'Firewall rule updated - blocking subnet 45.67.89.0/24', 
          'Intrusion attempt blocked from 23.94.122.35',
          'Packet filter activated for suspicious traffic',
          'Firewall enforcing geo-blocking for region'
        ], 
        severity: 'high' as const 
      },
      { 
        type: 'breach' as const, 
        messages: [
          'Unauthorized access attempt from 78.91.23.45', 
          'SQL injection attempt blocked on /admin endpoint',
          'XSS attack prevented on login form',
          'Buffer overflow exploit attempt detected'
        ], 
        severity: 'critical' as const 
      }
    ];

    const randomEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    const randomMessage = randomEvent.messages[Math.floor(Math.random() * randomEvent.messages.length)];

    const newEvent: SecurityEvent = {
      id: Math.random().toString(36).substr(2, 9),
      type: randomEvent.type,
      message: randomMessage,
      timestamp: new Date(),
      severity: randomEvent.severity
    };

    setSecurityEvents(prev => [newEvent, ...prev.slice(0, 6)]); // Keep more events in history
  }, []);

  // Focus the input when clicking terminal
  const handleTerminalClick = useCallback(() => {
    if (!isMinimized && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isMinimized]);

  // Handle keyboard shortcuts for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // F11 key for toggling fullscreen
      if (e.key === 'F11') {
        e.preventDefault();
        setSettings(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
        
        // Focus input after fullscreen toggle
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 100);
      }
      
      // Escape key to exit fullscreen
      if (e.key === 'Escape' && settings.fullscreen) {
        setSettings(prev => ({ ...prev, fullscreen: false }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.fullscreen]);
  
  // Auto-focus input when entering fullscreen mode
  useEffect(() => {
    if (settings.fullscreen && inputRef.current) {
      // Short delay to ensure DOM has updated
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [settings.fullscreen]);

  // Matrix effect with theme awareness
  useEffect(() => {
    if (!isMatrixMode || !matrixRef.current) return;

    const canvas = matrixRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Use more characters for a richer effect
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンφχψωΔΘΛΞΠΣΦΨΩ';
    const charArray = chars.split('');
    const fontSize = settings.fontSize;
    const columns = Math.ceil(canvas.width / fontSize);
    const drops: number[] = [];

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -10); // Start some drops above the canvas
    }

    const draw = () => {
      drawMatrix(ctx, canvas, fontSize, drops, charArray, isDarkTheme);
    };

    const interval = setInterval(draw, 35);
    
    const handleResize = () => {
      handleMatrixResize(canvas, fontSize, drops);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', handleResize);
    };
  }, [isMatrixMode, settings.fontSize, isDarkTheme, drawMatrix, handleMatrixResize]);

  // System stats updater with uptime tracking
  useEffect(() => {
    // Initial stats
    updateStats();
    const interval = setInterval(() => updateStats(), 2000);
    
    return () => clearInterval(interval);
  }, [updateStats]);

  // Time updater
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Enhanced security events generator
  useEffect(() => {
    const interval = setInterval(generateSecurityEvent, 3000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, [generateSecurityEvent]);

  // Focus the input when clicking terminal
  useEffect(() => {
    const terminal = terminalRef.current;
    if (terminal) {
      terminal.addEventListener('click', handleTerminalClick);
    }

    return () => {
      if (terminal) {
        terminal.removeEventListener('click', handleTerminalClick);
      }
    };
  }, [handleTerminalClick]);

  // Boot sequence with initialization
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootSequence.length) {
        setCommands(prev => [...prev, bootSequence[index]]);
        index++;
      } else {
        clearInterval(interval);
        setCommands(prev => [...prev, 'Type "help" for command suite']);
      }
    }, 800);

    return () => clearInterval(interval);
  }, [bootSequence]);

  // Enhanced command handler with more features
  const handleCommand = useCallback((cmd: string) => {
    // Process command and arguments
    const args = cmd.trim().split(' ');
    const command = args[0].toLowerCase();
    const commandArgs = args.slice(1);

    // Add command to display
    const newCommands = [...commands];
    newCommands.push(`┌──(root@nexus)-[~]`);
    newCommands.push(`└─$ ${cmd}`);

    // Define command responses
    const responses: { [key: string]: (args?: string[]) => string[] | Promise<string[]> } = {
      help: () => [
        '╭─────────────────── NEXUS COMMAND SUITE ───────────────────╮',
        '│ RECONNAISSANCE                │ EXPLOITATION              │',
        '│   nmap <target>    - Port scan│   exploit <vuln>  - Run   │',
        '│   whois <domain>   - Domain   │   payload <type>  - Gen   │',
        '│   trace <ip>       - Tracert  │   crack <hash>    - Crack │',
        '│   enum <service>   - Enum     │   shell <target>  - Rev   │',
        '│                               │                           │',
        '│ STEALTH & SECURITY           │ SYSTEM CONTROL            │',
        '│   stealth          - Toggle   │   status          - Stats │',
        '│   proxy <type>     - Proxy    │   monitor         - Watch │',
        '│   encrypt <data>   - Encrypt  │   matrix          - Mode  │',
        '│   tunnel <target>  - SSH      │   hud             - HUD   │',
        '│                               │                           │',
        '│ UTILITIES                    │ MONITORS                  │',
        '│   clear, cls       - Clear    │   system_monitor  - Show  │',
        '│   exit, poweroff   - Exit     │   security_monitor- Show  │',
        '│   settings         - Config   │   move_monitors   - Reset │',
        '│                               │                           │',
        '│ DISPLAY OPTIONS              │ KEYBOARD SHORTCUTS        │',
        '│   toggle_fullscreen - Full    │   F11             - Full  │',
        '│   toggle_ontop     - Top      │   ESC             - Exit  │',
        '│   set_font <size>  - Font     │   Ctrl+L          - Clear │',
        '│                               │   ↑/↓             - History│',
        '╰───────────────────────────────────────────────────────────╯'
      ],
      
      nmap: (args) => {
        const target = args?.[0] || '192.168.1.1';
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 3000);
        return [
          `[NMAP] Scanning ${target}...`,
          `[NMAP] Host discovery: ${target} is UP`,
          `[NMAP] PORT     STATE    SERVICE    VERSION`,
          `[NMAP] 22/tcp   open     ssh        OpenSSH 8.9`,
          `[NMAP] 80/tcp   open     http       Apache 2.4.52`,
          `[NMAP] 443/tcp  open     https      Apache 2.4.52`,
          `[NMAP] 3306/tcp closed   mysql`,
          `[NMAP] 8080/tcp filtered http-proxy`,
          `[SUCCESS] Scan complete. 3 open ports detected.`
        ];
      },

      exploit: (args) => {
        const vuln = args?.[0] || 'CVE-2023-1337';
        return [
          `[EXPLOIT] Loading exploit for ${vuln}...`,
          `[EXPLOIT] Checking target compatibility...`,
          `[EXPLOIT] Payload generation: SUCCESS`,
          `[EXPLOIT] Buffer overflow detected`,
          `[EXPLOIT] Executing shellcode...`,
          `[SUCCESS] Exploit successful. Access granted.`
        ];
      },

      stealth: () => {
        const modes = ['ghost', 'shadow', 'phantom', 'wraith'];
        const mode = modes[Math.floor(Math.random() * modes.length)];
        return [
          `[STEALTH] Activating ${mode} mode...`,
          `[STEALTH] MAC address randomization: ENABLED`,
          `[STEALTH] Traffic obfuscation: ACTIVE`,
          `[STEALTH] Footprint elimination: COMPLETE`,
          `[SUCCESS] Stealth mode activated. You are invisible.`
        ];
      },

      crack: (args) => {
        const hash = args?.[0] || 'a1b2c3d4e5f6';
        return [
          `[CRACK] Analyzing hash: ${hash}`,
          `[CRACK] Hash type detected: MD5`,
          `[CRACK] Loading rainbow tables...`,
          `[CRACK] Dictionary attack: 15% complete`,
          `[CRACK] Dictionary attack: 67% complete`,
          `[CRACK] Dictionary attack: 100% complete`,
          `[SUCCESS] Hash cracked: password123`
        ];
      },

      payload: (args) => {
        const type = args?.[0] || 'reverse_shell';
        return [
          `[PAYLOAD] Generating ${type} payload...`,
          `[PAYLOAD] Architecture: x64`,
          `[PAYLOAD] Encoding: shikata_ga_nai`,
          `[PAYLOAD] Size: 847 bytes`,
          `[PAYLOAD] Bad characters: None`,
          `[SUCCESS] Payload ready for deployment.`
        ];
      },

      monitor: () => {
        const uptimeHours = Math.floor(stats.uptime / 3600);
        const uptimeMinutes = Math.floor((stats.uptime % 3600) / 60);
        const uptimeSeconds = stats.uptime % 60;
        
        return [
          '╭─────────── REAL-TIME SYSTEM MONITOR ───────────╮',
          `│ CPU Usage:        ${stats.cpu.toFixed(1)}%                    │`,
          `│ Memory:          ${stats.memory.toFixed(1)}%                    │`,
          `│ Network I/O:     ${stats.network.toFixed(1)} MB/s              │`,
          `│ Active Conn:     ${stats.connections}                       │`,
          `│ Threats Blocked: ${stats.threats}                       │`,
          `│ Uptime:          ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s        │`,
          '╰─────────────────────────────────────────────────╯'
        ];
      },

      neural: (args) => {
        const cmd = args?.join(' ') || 'analyze';
        return [
          `[NEURAL] Processing: "${cmd}"`,
          `[NEURAL] Quantum neural network: ACTIVE`,
          `[NEURAL] Deep learning analysis...`,
          `[NEURAL] Pattern recognition: 94.7% confidence`,
          `[NEURAL] Predictive modeling complete`,
          `[SUCCESS] Neural analysis suggests high probability of success.`
        ];
      },

      quantum: (args) => {
        const op = args?.[0] || 'decrypt';
        return [
          `[QUANTUM] Initializing quantum ${op} protocol...`,
          `[QUANTUM] Entanglement established`,
          `[QUANTUM] Superposition calibrated`,
          `[QUANTUM] Quantum tunneling active`,
          `[QUANTUM] Coherence maintained at 99.8%`,
          `[SUCCESS] Quantum operation completed in 0.001ms.`
        ];
      },

      tunnel: (args) => {
        const target = args?.[0] || 'target.darkweb.onion';
        return [
          `[TUNNEL] Establishing secure tunnel to ${target}...`,
          `[TUNNEL] Routing through 7 proxy layers...`,
          `[TUNNEL] Encryption: AES-256-GCM`,
          `[TUNNEL] Authentication: RSA-4096`,
          `[TUNNEL] Connection established`,
          `[SUCCESS] Secure tunnel active. Traffic encrypted.`
        ];
      },

      matrix: () => {
        setIsMatrixMode(!isMatrixMode);
        return [`[MATRIX] Matrix mode ${!isMatrixMode ? 'ACTIVATED' : 'DEACTIVATED'}`];
      },

      hud: () => {
        setShowHUD(!showHUD);
        return [`[HUD] Heads-up display ${!showHUD ? 'ENABLED' : 'DISABLED'}`];
      },

      system_monitor: () => {
        toggleMonitor('systemMonitor');
        return [`[MONITOR] System monitor ${!hudState.systemMonitor.visible ? 'ENABLED' : 'DISABLED'}`];
      },

      security_monitor: () => {
        toggleMonitor('securityMonitor');
        return [`[MONITOR] Security monitor ${!hudState.securityMonitor.visible ? 'ENABLED' : 'DISABLED'}`];
      },

      move_monitors: () => {
        setHudState(prev => ({
          systemMonitor: {
            ...prev.systemMonitor,
            position: { x: 20, y: 20 }
          },
          securityMonitor: {
            ...prev.securityMonitor,
            position: { x: 20, y: 180 }
          }
        }));
        return [`[MONITOR] Monitor positions reset to default`];
      },

      status: () => [
        '╭─────────── SYSTEM STATUS REPORT ───────────╮',
        '│ Security Level:    MAXIMUM                 │',
        '│ Firewall:         ACTIVE & ADAPTIVE       │',
        '│ Encryption:       QUANTUM-RESISTANT       │',
        '│ Anonymity:        MAXIMUM (Tor/VPN)       │',
        '│ IDS/IPS:          NEURAL-ENHANCED         │',
        '│ Threat Level:     DEFCON 2                │',
        '│ Last Breach:      NEVER                   │',
        '╰─────────────────────────────────────────────╯'
      ],

      clear: () => {
        setCommands([]);
        return [];
      },
      
      cls: () => {
        setCommands([]);
        return [];
      },
      
      exit: () => {
        setIsPoweringDown(true);
        setTimeout(() => {
          setIsMinimized(true);
          setIsPoweringDown(false);
        }, 3000);
        return [
          '[SYSTEM] Initiating shutdown sequence...',
          '[SYSTEM] Closing secure connections...',
          '[SYSTEM] Erasing temporary files...',
          '[SYSTEM] Powering down...'
        ];
      },
      
      poweroff: () => responses.exit(),
      
      settings: () => {
        return [
          '╭─────────── TERMINAL SETTINGS ───────────╮',
          `│ Font Size:      ${settings.fontSize}px (set_font <size>)     │`,
          `│ Opacity:        ${settings.opacity * 100}% (set_opacity <0-100>) │`,
          `│ Theme:          ${settings.theme} (set_theme <theme>)   │`,
          `│ Always On Top:  ${settings.alwaysOnTop ? 'YES' : 'NO'} (toggle_ontop)     │`,
          `│ Fullscreen:     ${settings.fullscreen ? 'YES' : 'NO'} (toggle_fullscreen) │`,
          '╰─────────────────────────────────────────────╯'
        ];
      },
      
      set_font: (args) => {
        const size = parseInt(args?.[0] || '14', 10);
        if (isNaN(size) || size < 8 || size > 24) {
          return ['[ERROR] Font size must be between 8 and 24'];
        }
        setSettings(prev => ({ ...prev, fontSize: size }));
        return [`[SETTINGS] Font size set to ${size}px`];
      },
      
      set_opacity: (args) => {
        const opacity = parseInt(args?.[0] || '95', 10) / 100;
        if (isNaN(opacity) || opacity < 0.5 || opacity > 1) {
          return ['[ERROR] Opacity must be between 50 and 100'];
        }
        setSettings(prev => ({ ...prev, opacity }));
        return [`[SETTINGS] Opacity set to ${Math.round(opacity * 100)}%`];
      },
      
      set_theme: (args) => {
        const theme = args?.[0]?.toLowerCase() || 'auto';
        if (!['auto', 'matrix', 'dark', 'light'].includes(theme)) {
          return ['[ERROR] Theme must be auto, matrix, dark, or light'];
        }
        setSettings(prev => ({ ...prev, theme: theme as 'auto' | 'matrix' | 'dark' | 'light' }));
        return [`[SETTINGS] Theme set to ${theme}`];
      },
      
      toggle_ontop: () => {
        setSettings(prev => ({ ...prev, alwaysOnTop: !prev.alwaysOnTop }));
        return [`[SETTINGS] Always on top: ${!settings.alwaysOnTop ? 'ENABLED' : 'DISABLED'}`];
      },
      
      toggle_fullscreen: () => {
        setSettings(prev => ({ ...prev, fullscreen: !prev.fullscreen }));
        return [`[SETTINGS] Fullscreen mode: ${!settings.fullscreen ? 'ENABLED' : 'DISABLED'}`];
      },
      
      reset: () => {
        setTimeout(() => {
          setCommands([]);
          let index = 0;
          const interval = setInterval(() => {
            if (index < bootSequence.length) {
              setCommands(prev => [...prev, bootSequence[index]]);
              index++;
            } else {
              clearInterval(interval);
              setCommands(prev => [...prev, 'Type "help" for command suite']);
            }
          }, 200);
        }, 1500);
        
        return [
          '[SYSTEM] Initiating system reset...',
          '[SYSTEM] Restarting all services...',
          '[SYSTEM] Rebooting...',
          ''
        ];
      },
      
      whoami: () => ['root@nexus:~# CLASSIFIED - SECURITY CLEARANCE REQUIRED'],
      
      date: () => [`Current Date: ${time.toLocaleDateString()} ${time.toLocaleTimeString()}`],

      echo: (args) => args ? [args.join(' ')] : ['Usage: echo <message>'],
      
      history: () => commandHistory.map((cmd, i) => `  ${String(i + 1).padStart(3, ' ')}  ${cmd.command}`)
    };

    let result: string[] = [];

    if (command === 'clear') {
      setCommands([]);
    } else {
      const handler = responses[command];
      if (handler) {
        const handlerResult = handler(commandArgs);
        if (Array.isArray(handlerResult)) {
          result = handlerResult;
          newCommands.push(...handlerResult);
        }
      } else {
        result = [`[ERROR] Command not found: ${command}`, `[HINT] Type 'help' for available commands`];
        newCommands.push(...result);
      }
      setCommands(newCommands);
    }

    // Update command history
    if (result && Array.isArray(result)) {
      setCommandHistory(prev => [...prev, { 
        command: cmd, 
        output: result.join('\n'), 
        isError: !responses[command] 
      }]);
    }
    
    setHistoryIndex(-1);
    setCurrentCommand('');

    // Auto-scroll to bottom
    setTimeout(() => {
      if (historyRef.current) {
        historyRef.current.scrollTop = historyRef.current.scrollHeight;
      }
    }, 100);
  }, [commands, commandHistory, isMatrixMode, showHUD, stats, settings, terminalRef, hudState]);

  // Add an effect to scroll to bottom whenever commands change
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [commands]);

  // Enhanced key handler for terminal commands
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      handleCommand(currentCommand.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Basic tab completion
      if (currentCommand) {
        const commands = [
          'help', 'nmap', 'whois', 'trace', 'enum', 
          'exploit', 'payload', 'crack', 'shell',
          'stealth', 'proxy', 'encrypt', 'tunnel',
          'status', 'monitor', 'hud', 'matrix',
          'clear', 'exit', 'poweroff', 'whoami',
          'echo', 'history', 'settings', 'set_font',
          'set_opacity', 'set_theme', 'toggle_ontop',
          'reset', 'date', 'neural', 'quantum'
        ];
        
        // Find matches
        const matches = commands.filter(cmd => 
          cmd.startsWith(currentCommand.split(' ')[0].toLowerCase())
        );
        
        if (matches.length === 1) {
          // Single match - complete the command
          setCurrentCommand(matches[0]);
        } else if (matches.length > 1) {
          // Multiple matches - show suggestions
          const suggestionLines = [
            `┌──(root@nexus)-[~]`,
            `└─$ ${currentCommand}`,
            'Possible commands:',
            matches.join('  ')
          ];
          setCommands([...commands, ...suggestionLines]);
        }
      }
    } else if (e.ctrlKey && e.key === 'c') {
      // Ctrl+C to clear current command
      setCurrentCommand('');
    } else if (e.ctrlKey && e.key === 'l') {
      // Ctrl+L to clear screen
      setCommands([]);
    }
  }, [currentCommand, commandHistory, historyIndex, commands, handleCommand]);

  // Helper for command color coding
  const getSeverityColor = useCallback((severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-green-400';
    }
  }, []);

  // Drag start handler with position saving
  const handleDragStart = useCallback((event: React.PointerEvent) => {
    if (!isMaximized) {
      setIsDragging(true);
      
      // Calculate drag offset from the pointer position relative to the element
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setDragOffset({
          x: event.clientX - rect.left,
          y: event.clientY - rect.top
        });
      }
      
      dragControls.start(event);
    }
  }, [isMaximized, dragControls]);

  // Modified drag start handler for motion component
  const handleMotionDragStart = useCallback(
    (event: MouseEvent | TouchEvent | PointerEvent) => {
      setIsDragging(true);
    },
    []
  );

  // Component for resize handles
  const ResizeHandle = ({ position }: { position: string }) => {
    const getCursor = () => {
      switch (position) {
        case 'n': return 'ns-resize';
        case 's': return 'ns-resize';
        case 'e': return 'ew-resize';
        case 'w': return 'ew-resize';
        case 'ne': return 'nesw-resize';
        case 'nw': return 'nwse-resize';
        case 'se': return 'nwse-resize';
        case 'sw': return 'nesw-resize';
        default: return 'move';
      }
    };

    const getPositionStyle = () => {
      const baseStyle: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        zIndex: 1000,
        cursor: getCursor(),
      };

      switch (position) {
        case 'n':
          return { ...baseStyle, top: 0, left: '10px', right: '10px', height: '5px' };
        case 's':
          return { ...baseStyle, bottom: 0, left: '10px', right: '10px', height: '5px' };
        case 'e':
          return { ...baseStyle, top: '10px', bottom: '10px', right: 0, width: '5px' };
        case 'w':
          return { ...baseStyle, top: '10px', bottom: '10px', left: 0, width: '5px' };
        case 'ne':
          return { ...baseStyle, top: 0, right: 0, width: '10px', height: '10px' };
        case 'nw':
          return { ...baseStyle, top: 0, left: 0, width: '10px', height: '10px' };
        case 'se':
          return { ...baseStyle, bottom: 0, right: 0, width: '10px', height: '10px' };
        case 'sw':
          return { ...baseStyle, bottom: 0, left: 0, width: '10px', height: '10px' };
        default:
          return baseStyle;
      }
    };

    return (
      <div
        style={getPositionStyle()}
        onMouseDown={(e) => handleResizeStart(e, position)}
        className="hover:bg-green-500/30 transition-colors"
      />
    );
  };

  // Drag end handler
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setPosition({ x: rect.left, y: rect.top });
      setSavedPosition({ x: rect.left, y: rect.top });
    }
  }, []);
  
  // Toggle maximize with position saving
  const toggleMaximize = useCallback(() => {
    if (isMaximized) {
      // Restore previous position and size
      setPosition(savedPosition);
      setIsMaximized(false);
    } else {
      // Save current position before maximizing
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSavedPosition({ x: rect.left, y: rect.top });
      }
      setIsMaximized(true);
    }
  }, [isMaximized, savedPosition]);
  
  // Resize handlers
  const handleResizeStart = useCallback((e: React.MouseEvent, direction: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (isMaximized) return;
    
    setIsResizing(true);
    setInitialSize({ width: size.width, height: size.height });
    
    const initialMouseX = e.clientX;
    const initialMouseY = e.clientY;
    const initialPositionX = position.x;
    const initialPositionY = position.y;
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      
      let newWidth = initialSize.width;
      let newHeight = initialSize.height;
      let newX = initialPositionX;
      let newY = initialPositionY;
      
      // Handle horizontal resizing
      if (direction.includes('e')) { // east (right)
        const deltaX = moveEvent.clientX - initialMouseX;
        newWidth = Math.max(400, initialSize.width + deltaX);
      } else if (direction.includes('w')) { // west (left)
        const deltaX = initialMouseX - moveEvent.clientX;
        newWidth = Math.max(400, initialSize.width + deltaX);
        newX = initialPositionX - (newWidth - initialSize.width);
      }
      
      // Handle vertical resizing
      if (direction.includes('s')) { // south (bottom)
        const deltaY = moveEvent.clientY - initialMouseY;
        newHeight = Math.max(200, initialSize.height + deltaY);
      } else if (direction.includes('n')) { // north (top)
        const deltaY = initialMouseY - moveEvent.clientY;
        newHeight = Math.max(200, initialSize.height + deltaY);
        newY = initialPositionY - (newHeight - initialSize.height);
      }
      
      // Update size and position
      setSize({ width: newWidth, height: newHeight });
      
      // Only update position if we're resizing from left or top edges
      if (direction.includes('w') || direction.includes('n')) {
        setPosition({ x: newX, y: newY });
      }
    };
    
    const handleMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // Save the position when resize ends
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setSavedPosition({ x: rect.left, y: rect.top });
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [isMaximized, size.width, size.height, initialSize, position.x, position.y]);

  // Handle monitor dragging
  const handleMonitorDragStart = useCallback((monitorType: 'systemMonitor' | 'securityMonitor') => {
    setHudState(prev => ({
      ...prev,
      [monitorType]: {
        ...prev[monitorType],
        isDragging: true
      }
    }));
  }, []);

  const handleMonitorDrag = useCallback((monitorType: 'systemMonitor' | 'securityMonitor', e: MouseEvent, info: any) => {
    setHudState(prev => ({
      ...prev,
      [monitorType]: {
        ...prev[monitorType],
        position: {
          x: prev[monitorType].position.x + info.delta.x,
          y: prev[monitorType].position.y + info.delta.y
        }
      }
    }));
  }, []);

  const handleMonitorDragEnd = useCallback((monitorType: 'systemMonitor' | 'securityMonitor') => {
    setHudState(prev => ({
      ...prev,
      [monitorType]: {
        ...prev[monitorType],
        isDragging: false
      }
    }));
  }, []);

  // Toggle monitor visibility
  const toggleMonitor = useCallback((monitorType: 'systemMonitor' | 'securityMonitor') => {
    setHudState(prev => ({
      ...prev,
      [monitorType]: {
        ...prev[monitorType],
        visible: !prev[monitorType].visible
      }
    }));
  }, []);

  // Use mobile-optimized settings and sizes
  useEffect(() => {
    if (isMobile) {
      // Set optimal defaults for mobile
      setSize({ width: window.innerWidth, height: 400 });
      setSettings(prev => ({
        ...prev,
        fontSize: 14,
        opacity: 1, // Full opacity on mobile for better readability
        theme: 'auto',
        alwaysOnTop: false,
        fullscreen: false
      }));
      
      // Adjust HUD positions for mobile
      setHudState(prev => ({
        systemMonitor: {
          ...prev.systemMonitor,
          position: { x: 10, y: 10 }
        },
        securityMonitor: {
          ...prev.securityMonitor,
          position: { x: 10, y: 200 }
        }
      }));
    }
  }, [isMobile]);
  
  // Handle window resize for mobile adaptation
  useEffect(() => {
    const handleResize = () => {
      if (isMobile) {
        setSize({ width: window.innerWidth, height: size.height });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, size.height]);
  
  // Adjust matrixRef for mobile performance
  useEffect(() => {
    if (isMatrixMode && matrixRef.current) {
      const canvas = matrixRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Use fewer characters on mobile for better performance
      const chars = isMobile 
        ? '01アイウカキクサシスタチツハヒフφχψωΔΘΛΞΠΣ' 
        : '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンφχψωΔΘΛΞΠΣΦΨΩ';
      const charArray = chars.split('');
      const fontSize = settings.fontSize;
      const columns = Math.ceil(canvas.width / fontSize);
      const drops: number[] = [];

      for (let i = 0; i < columns; i++) {
        drops[i] = Math.floor(Math.random() * -10); // Start some drops above the canvas
      }

      const draw = () => {
        drawMatrix(ctx, canvas, fontSize, drops, charArray, isDarkTheme);
      };

      // Lower the frame rate on mobile for better performance
      const interval = setInterval(draw, isMobile ? 50 : 35);
      
      const handleResize = () => {
        handleMatrixResize(canvas, fontSize, drops);
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isMatrixMode, settings.fontSize, isDarkTheme, drawMatrix, handleMatrixResize, isMobile]);

  return (
    <motion.div 
      ref={containerRef}
      drag={!isMaximized && !settings.fullscreen && !isMobile}
      dragControls={dragControls}
      dragMomentum={false}
      dragElastic={0}
      onDragStart={handleMotionDragStart}
      onDragEnd={handleDragEnd}
      dragConstraints={{
        top: 0,
        left: 0,
        right: window.innerWidth - (isMaximized ? 0 : size.width),
        bottom: window.innerHeight - (isMaximized ? 0 : 40)
      }}
      initial={{ y: 100, opacity: 0 }}
      animate={{ 
        y: 0, 
        opacity: 1,
        width: isMaximized || settings.fullscreen || isMobile ? '100%' : undefined,
        height: isMaximized || settings.fullscreen ? '100vh' : undefined,
        top: isMaximized || settings.fullscreen ? 0 : undefined,
        left: isMaximized || settings.fullscreen || isMobile ? 0 : undefined,
        right: isMaximized || settings.fullscreen || isMobile ? 0 : undefined,
        bottom: isMaximized || settings.fullscreen ? 0 : undefined,
      }}
      transition={{ duration: 0.3 }}
      style={{
        width: isMaximized || settings.fullscreen || isMobile ? '100%' : size.width,
        height: isMaximized || settings.fullscreen ? '100vh' : isMinimized ? '48px' : size.height,
        maxHeight: isMinimized ? '48px' : isMaximized || settings.fullscreen ? '100vh' : size.height,
        zIndex: settings.alwaysOnTop ? 999 : settings.fullscreen ? 990 : 50,
        backgroundColor: `rgba(0, 0, 0, ${settings.fullscreen ? 1 : settings.opacity})`,
        position: 'fixed',
        bottom: isMaximized || settings.fullscreen ? 0 : undefined,
        right: isMaximized || settings.fullscreen ? 0 : undefined,
        borderTopLeftRadius: isMaximized || settings.fullscreen || isMobile ? 0 : '8px',
        borderTopRightRadius: isMaximized || settings.fullscreen || isMobile ? 0 : '8px',
        border: settings.fullscreen || isMobile ? 'none' : undefined
      }}
      className={`fixed bottom-0 right-0 ${!settings.fullscreen && !isMobile ? `border-t border-l ${isDarkTheme ? 'border-green-500/30' : 'border-green-700/30'}` : ''} shadow-lg shadow-black/50 terminal-window transition-all duration-300 ease-in-out ${
        isMinimized ? 'h-12' : ''
      }`}
    >
      {/* Matrix Background */}
      <AnimatePresence>
        {isMatrixMode && (
          <motion.canvas
            ref={matrixRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Terminal Header - Now Draggable */}
      <div 
        className={`flex items-center justify-between px-4 py-2 ${settings.fullscreen ? 'bg-black/80 border-b border-green-500/30' : 'bg-green-900/20 border-b border-green-500/30'} ${!settings.fullscreen && !isMobile ? 'cursor-move' : ''}`}
        onPointerDown={!settings.fullscreen && !isMobile ? handleDragStart : undefined}
      >
        <div className="flex items-center gap-4">
          {!settings.fullscreen && !isMobile && (
            <div className="flex gap-2">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(!isMinimized);
                }}
                className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors"
              ></button>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleMaximize();
                }}
                className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors"
              ></button>
              <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-green-500" />
            <span className={`${settings.fullscreen ? 'text-sm' : 'text-xs'} text-green-500 font-mono`}>
              {settings.fullscreen ? 'NEXUS TERMINAL :: ROOT ACCESS' : isMobile ? 'NEXUS TERM' : 'NEXUS://root@classified'}
            </span>
          </div>
          {settings.fullscreen ? (
            <span className="text-green-500/70 text-xs font-mono ml-4 flex items-center gap-2">
              FULLSCREEN MODE
              <span className="text-green-400/60 ml-2 border border-green-500/30 px-1 rounded text-[10px]">
                ESC to exit
              </span>
            </span>
          ) : (
            <Move className="w-4 h-4 text-green-500/50" />
          )}
        </div>
        <div className="flex items-center gap-4 text-xs text-green-500/70">
          <div className="hidden sm:flex items-center gap-1">
            <Lock className="w-3 h-3" />
            <span>ENCRYPTED</span>
          </div>
          <div className="hidden sm:flex items-center gap-1">
            <Shield className="w-3 h-3" />
            <span>SECURE</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{time.toLocaleTimeString()}</span>
            {settings.fullscreen ? (
              <button
                onClick={() => setSettings(prev => ({ ...prev, fullscreen: false }))}
                className="ml-2 px-2 py-1 bg-green-900/30 hover:bg-green-900/50 text-green-400 rounded border border-green-500/30 transition-colors flex items-center gap-1"
              >
                <Minimize2 className="w-3 h-3" />
                <span>Exit Fullscreen</span>
              </button>
            ) : isMinimized ? (
              <Maximize2 
                className="w-4 h-4 cursor-pointer hover:text-green-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(false);
                }}
              />
            ) : (
              <Minimize2 
                className="w-4 h-4 cursor-pointer hover:text-green-400 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Resize Handles - only visible when not maximized or minimized */}
      {!isMaximized && !isMinimized && (
        <>
          <ResizeHandle position="n" />
          <ResizeHandle position="s" />
          <ResizeHandle position="e" />
          <ResizeHandle position="w" />
          <ResizeHandle position="ne" />
          <ResizeHandle position="nw" />
          <ResizeHandle position="se" />
          <ResizeHandle position="sw" />
        </>
      )}

      {/* Terminal Content */}
      {!isMinimized && (
        <>
          {/* HUD Overlay */}
          <AnimatePresence>
            {showHUD && (
              <>
                {/* System Stats Monitor */}
                {hudState.systemMonitor.visible && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      x: hudState.systemMonitor.position.x,
                      y: hudState.systemMonitor.position.y,
                      zIndex: hudState.systemMonitor.isDragging ? 60 : 50
                    }}
                    exit={{ opacity: 0 }}
                    drag
                    dragMomentum={false}
                    onDragStart={() => handleMonitorDragStart('systemMonitor')}
                    onDrag={(e, info) => handleMonitorDrag('systemMonitor', e as MouseEvent, info)}
                    onDragEnd={() => handleMonitorDragEnd('systemMonitor')}
                    className="absolute top-0 left-0"
                  >
                    <div className="bg-black/80 border border-green-500/30 rounded-md shadow-lg overflow-hidden w-64">
                      {/* Monitor Header with Drag Handle */}
                      <div className="flex items-center justify-between bg-green-900/30 px-2 py-1 border-b border-green-500/30 cursor-move group">
                        <div className="flex items-center gap-1">
                          <Cpu className="w-3 h-3 text-green-500" />
                          <span className="text-green-400 font-bold text-xs">SYSTEM MONITOR</span>
                          <span className="hidden group-hover:inline-block text-[8px] text-green-400/60 ml-1">(drag to move)</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-400/70 text-[10px] mr-2">{time.toLocaleTimeString()}</span>
                          <X 
                            className="w-3 h-3 text-green-500/70 hover:text-green-500 transition-colors cursor-pointer" 
                            onClick={() => toggleMonitor('systemMonitor')}
                          />
                        </div>
                      </div>
                      
                      {/* Monitor Content */}
                      <div className="p-3 text-xs font-mono">
                        <div className="grid grid-cols-2 gap-3 text-green-400">
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Cpu className="w-3 h-3" />
                                <span>CPU</span>
                              </div>
                              <span>{stats.cpu.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-green-900/30 h-1.5 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="bg-green-500 h-full rounded-full" 
                                style={{ width: `${stats.cpu}%`, transition: 'width 0.5s ease-in-out' }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Activity className="w-3 h-3" />
                                <span>MEMORY</span>
                              </div>
                              <span>{stats.memory.toFixed(0)}%</span>
                            </div>
                            <div className="w-full bg-green-900/30 h-1.5 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="bg-green-500 h-full rounded-full" 
                                style={{ width: `${stats.memory}%`, transition: 'width 0.5s ease-in-out' }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Globe className="w-3 h-3" />
                                <span>NETWORK</span>
                              </div>
                              <span>{stats.network.toFixed(1)}MB/s</span>
                            </div>
                            <div className="w-full bg-green-900/30 h-1.5 rounded-full mt-1 overflow-hidden">
                              <div 
                                className="bg-green-500 h-full rounded-full" 
                                style={{ width: `${Math.min(stats.network * 10, 100)}%`, transition: 'width 0.5s ease-in-out' }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Shield className="w-3 h-3" />
                                <span>THREATS</span>
                              </div>
                              <span className="flex items-center">
                                {stats.threats}
                                <span className={`ml-1 w-2 h-2 rounded-full ${stats.threats > 5 ? 'bg-red-500' : stats.threats > 0 ? 'bg-yellow-500' : 'bg-green-500'}`}></span>
                              </span>
                            </div>
                            <div className="w-full bg-green-900/30 h-1.5 rounded-full mt-1 overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${stats.threats > 5 ? 'bg-red-500' : stats.threats > 0 ? 'bg-yellow-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(stats.threats * 10, 100)}%`, transition: 'width 0.5s ease-in-out' }}
                              />
                            </div>
                          </div>
                          <div className="flex flex-col col-span-2 mt-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>UPTIME</span>
                              </div>
                              <span>{formatUptime(stats.uptime)}</span>
                            </div>
                          </div>
                          
                          {/* System Environment Information */}
                          <div className="col-span-2 mt-2 border-t border-green-500/20 pt-2">
                            <div className="text-[10px] text-green-400/80 mb-1">SYSTEM ENVIRONMENT</div>
                            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                              <div className="flex items-center justify-between">
                                <span className="text-green-400/70">BROWSER:</span>
                                <span className="text-green-300">{stats.browser || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-green-400/70">OS:</span>
                                <span className="text-green-300">{stats.os || 'Unknown'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-green-400/70">DEVICE:</span>
                                <span className="text-green-300">{stats.device || 'Desktop'}</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-green-400/70">CONN:</span>
                                <span className="text-green-300">{stats.connections} active</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
                
                {/* Security Events Monitor */}
                {hudState.securityMonitor.visible && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: 1,
                      x: hudState.securityMonitor.position.x,
                      y: hudState.securityMonitor.position.y,
                      zIndex: hudState.securityMonitor.isDragging ? 60 : 50
                    }}
                    exit={{ opacity: 0 }}
                    drag
                    dragMomentum={false}
                    onDragStart={() => handleMonitorDragStart('securityMonitor')}
                    onDrag={(e, info) => handleMonitorDrag('securityMonitor', e as MouseEvent, info)}
                    onDragEnd={() => handleMonitorDragEnd('securityMonitor')}
                    className="absolute top-0 left-0"
                  >
                    <div className="bg-black/80 border border-green-500/30 rounded-md shadow-lg overflow-hidden w-64">
                      {/* Monitor Header with Drag Handle */}
                      <div className="flex items-center justify-between bg-green-900/30 px-2 py-1 border-b border-green-500/30 cursor-move group">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-green-500" />
                          <span className="text-green-400 font-bold text-xs">SECURITY MONITOR</span>
                          <span className="hidden group-hover:inline-block text-[8px] text-green-400/60 ml-1">(drag to move)</span>
                        </div>
                        <div className="flex items-center">
                          <span className="text-green-400/70 text-[10px] mr-2">
                            {stats.threats > 5 ? 'ALERT' : stats.threats > 0 ? 'CAUTION' : 'SECURE'}
                          </span>
                          <X 
                            className="w-3 h-3 text-green-500/70 hover:text-green-500 transition-colors cursor-pointer" 
                            onClick={() => toggleMonitor('securityMonitor')}
                          />
                        </div>
                      </div>
                      
                      {/* Monitor Content */}
                      <div className="p-3 text-xs font-mono">
                        <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1 custom-scrollbar">
                          {securityEvents.length === 0 ? (
                            <div className="text-green-400/60 italic text-center py-2">No security events detected</div>
                          ) : (
                            securityEvents.map((event) => (
                              <div key={event.id} className={`p-1.5 rounded ${
                                event.severity === 'high' ? 'bg-red-950/30 border-l-2 border-red-500' : 
                                event.severity === 'medium' ? 'bg-yellow-950/30 border-l-2 border-yellow-500' : 
                                'bg-green-950/30 border-l-2 border-green-500'
                              }`}>
                                <div className="flex items-center justify-between text-[10px] mb-0.5">
                                  <span className={`${
                                    event.severity === 'high' ? 'text-red-400' : 
                                    event.severity === 'medium' ? 'text-yellow-400' : 
                                    'text-green-400'
                                  } font-bold`}>
                                    {event.type.toUpperCase()}
                                  </span>
                                  <span className="text-green-600">{event.timestamp.toLocaleTimeString()}</span>
                                </div>
                                <div className="text-green-300">
                                  {event.message}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </AnimatePresence>

          {/* Scanning Indicator */}
          <AnimatePresence>
            {isScanning && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/90 border border-green-500 rounded-lg p-6 z-20"
              >
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  <span className="text-green-400 font-mono">SCANNING TARGET...</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Terminal Content */}
          <div 
            ref={terminalRef}
            className={`flex-1 p-4 font-mono text-sm overflow-hidden ${settings.fullscreen ? 'flex flex-col' : ''}`}
            style={{
              height: isMaximized || settings.fullscreen ? 'calc(100vh - 40px)' : '35vh',
              fontSize: settings.fullscreen ? `${settings.fontSize + 2}px` : `${settings.fontSize}px`
            }}
          >
            {settings.fullscreen && (
              <div className="mb-8 text-center">
                <h1 className="text-green-500 text-4xl font-bold mb-2 animate-pulse">
                  NEXUS TERMINAL SYSTEM
                </h1>
                <p className="text-green-400/70">Advanced Command Line Interface</p>
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
                  <div className="bg-green-900/20 border border-green-500/30 rounded p-3 text-center">
                    <Cpu className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <div className="text-green-400">CPU</div>
                    <div className="text-xl font-bold text-green-500">{stats.cpu.toFixed(0)}%</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded p-3 text-center">
                    <Activity className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <div className="text-green-400">MEMORY</div>
                    <div className="text-xl font-bold text-green-500">{stats.memory.toFixed(0)}%</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded p-3 text-center">
                    <Globe className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <div className="text-green-400">NETWORK</div>
                    <div className="text-xl font-bold text-green-500">{stats.network.toFixed(0)} MB/s</div>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded p-3 text-center">
                    <Shield className="w-5 h-5 text-green-500 mx-auto mb-2" />
                    <div className="text-green-400">THREATS</div>
                    <div className="text-xl font-bold text-green-500">{stats.threats}</div>
                  </div>
                </div>
              </div>
            )}
            
            <div 
              ref={historyRef}
              className={`${settings.fullscreen ? "flex-1 overflow-y-auto custom-scrollbar px-4" : "overflow-y-auto custom-scrollbar"}`} 
              style={{ maxHeight: settings.fullscreen ? 'calc(100vh - 300px)' : '28vh' }}
            >
              {commands.filter(cmd => typeof cmd === 'string').map((cmd, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.05, 1) }}
                  className={`text-green-400 whitespace-pre-wrap mb-1 ${
                    cmd.startsWith('[SUCCESS]') ? 'text-green-300 font-bold' :
                    cmd.startsWith('[ERROR]') ? 'text-red-400' :
                    cmd.startsWith('[BOOT]') ? 'text-blue-400' :
                    cmd.startsWith('└─$') ? 'text-green-600 font-bold' :
                    cmd.startsWith('┌──') ? 'text-green-600' : ''
                  }`}
                >
                  {cmd}
                </motion.div>
              ))}
            </div>
            
            {/* Input Line */}
            <div className={`mt-2 ${settings.fullscreen ? 'border-t border-green-500/30 pt-4 px-4 mt-auto' : ''}`}>
              <div className="text-green-400 flex items-center">
                <span className="text-green-600 mr-2">┌──(root@nexus)-[~]</span>
              </div>
              <div className="text-green-400 flex items-center">
                <span className="text-green-600 mr-2">└─$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={currentCommand}
                  onChange={(e) => setCurrentCommand(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`flex-1 bg-transparent outline-none caret-green-500 text-green-400 ${settings.fullscreen ? 'text-lg' : ''}`}
                  spellCheck="false"
                  autoFocus
                />
                <span className="animate-pulse text-green-500">█</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* CSS styles for scrollbar */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #00ff00;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00cc00;
        }
      `}</style>
    </motion.div>
  );
};

export default TerminalWindow;