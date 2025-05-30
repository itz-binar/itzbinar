import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Minimize2, Maximize2 } from 'lucide-react';

const TerminalWindow: React.FC = () => {
  const [commands, setCommands] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const terminalCommands = [
    'initializing system...',
    'loading security protocols...',
    'establishing secure connection...',
    'accessing mainframe...',
    'decrypting data streams...',
    'scanning for vulnerabilities...',
    'initializing firewall...',
    'loading encryption modules...',
    'establishing secure shell...',
    'system ready.'
  ];

  const handleCommand = (cmd: string) => {
    const responses: { [key: string]: string[] } = {
      help: [
        'Available commands:',
        '  help     - Show this help message',
        '  clear    - Clear the terminal',
        '  whoami   - Display user information',
        '  date     - Show current date and time',
        '  ls       - List directory contents',
        '  status   - Show system status',
        '  reset    - Reset terminal position'
      ],
      clear: [],
      whoami: ['root@binar:~# Security Researcher & Digital Explorer'],
      date: [new Date().toLocaleString()],
      ls: [
        'Documents/',
        'Projects/',
        'Security/',
        'Research/',
        'readme.md',
        'config.json'
      ],
      status: [
        'System Status:',
        '  CPU: 32%',
        '  Memory: 2.4GB/8GB',
        '  Uptime: 23:45:12',
        '  Network: Connected',
        '  Security Level: Maximum'
      ],
      reset: ['Terminal position reset.']
    };

    const newCommands = [...commands];
    newCommands.push(`$ ${cmd}`);

    if (cmd.toLowerCase() === 'clear') {
      setCommands([]);
    } else if (cmd.toLowerCase() === 'reset') {
      newCommands.push(...responses.reset);
      setCommands(newCommands);
      setPosition({ x: 0, y: 0 });
    } else {
      const response = responses[cmd.toLowerCase()] || ['Command not found: ' + cmd];
      newCommands.push(...response);
      setCommands(newCommands);
    }

    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);
    setCurrentCommand('');
  };

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < terminalCommands.length) {
        setCommands(prev => [...prev, terminalCommands[index]]);
        index++;
      } else {
        clearInterval(interval);
        setCommands(prev => [...prev, '', '$ Type "help" for available commands']);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentCommand.trim()) {
      handleCommand(currentCommand.trim());
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCurrentCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCurrentCommand('');
      }
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (isMaximized) setIsMaximized(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
    if (isMinimized) setIsMinimized(false);
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: -500, right: 500, top: -300, bottom: 300 }}
      animate={{
        x: position.x,
        y: position.y,
        scale: isMinimized ? 0.5 : 1,
        height: isMaximized ? '100vh' : 'auto',
        width: isMaximized ? '100vw' : '100%',
        position: isMaximized ? 'fixed' : 'relative',
        top: isMaximized ? 0 : 'auto',
        left: isMaximized ? 0 : 'auto',
      }}
      className={`w-full max-w-md mx-auto bg-black/80 rounded-lg border border-green-500/30 overflow-hidden terminal-window ${isMaximized ? 'fixed inset-0 max-w-none' : ''}`}
      style={{ zIndex: 50 }}
    >
      <motion.div 
        className="flex items-center justify-between px-4 py-2 bg-green-900/20 border-b border-green-500/30 cursor-move handle"
        onDoubleClick={toggleMaximize}
      >
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <motion.button
              onClick={toggleMinimize}
              className="w-3 h-3 rounded-full bg-yellow-500/70 hover:bg-yellow-500 transition-colors"
              whileHover={{ scale: 1.2 }}
            />
            <motion.button
              onClick={toggleMaximize}
              className="w-3 h-3 rounded-full bg-green-500/70 hover:bg-green-500 transition-colors"
              whileHover={{ scale: 1.2 }}
            />
          </div>
          <span className="text-xs text-green-500 font-mono">terminal@binar:~</span>
        </div>
        <div className="flex gap-2">
          <motion.button
            onClick={toggleMinimize}
            whileHover={{ scale: 1.1 }}
            className="text-green-500/70 hover:text-green-500"
          >
            <Minimize2 size={14} />
          </motion.button>
          <motion.button
            onClick={toggleMaximize}
            whileHover={{ scale: 1.1 }}
            className="text-green-500/70 hover:text-green-500"
          >
            <Maximize2 size={14} />
          </motion.button>
        </div>
      </motion.div>
      <motion.div 
        className={`font-mono text-sm overflow-y-auto transition-all duration-300 ease-in-out ${isMinimized ? 'h-0' : isMaximized ? 'h-[calc(100vh-40px)]' : 'h-80'}`}
        animate={{ padding: isMinimized ? 0 : 16 }}
      >
        {commands.map((cmd, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="text-green-500 whitespace-pre-wrap"
          >
            {cmd}
          </motion.div>
        ))}
        <div className="text-green-500 flex">
          <span className="text-green-700">$</span>
          <input
            type="text"
            value={currentCommand}
            onChange={(e) => setCurrentCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 ml-2 bg-transparent outline-none caret-green-500"
            spellCheck="false"
            autoFocus
          />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TerminalWindow;