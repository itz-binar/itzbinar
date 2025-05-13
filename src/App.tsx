import React from 'react';
import { Terminal, Shield, Cpu, MonitorCheck, Download, ChevronRight, Github, Code2, Laptop2, Terminal as Terminal2 } from 'lucide-react';

function App() {
  const features = [
    { icon: Shield, title: 'Rootless Installation', description: 'No root access needed — works entirely via Termux and PRoot' },
    { icon: Cpu, title: 'Dual OS Options', description: 'Choose between Kali Linux and Arch Linux distributions' },
    { icon: Terminal2, title: 'One-Line Setup', description: 'Single command installs everything automatically' },
    { icon: MonitorCheck, title: 'Optional GUI Mode', description: 'XFCE Desktop + VNC server with resolution auto-detection' },
  ];

  const tools = [
    'Metasploit', 'Nmap', 'Sqlmap', 'Hydra', 'Python3',
    'Git', 'Curl', 'Wget', 'Nano', 'Neofetch'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-blue-500 inline-block text-transparent bg-clip-text">
            itzbinar
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Install Kali Linux or Arch Linux on Android without root
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
              <Download size={20} />
              Install Now
            </button>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" 
               className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all">
              <Github size={20} />
              View on GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-gray-700 p-6 rounded-lg hover:bg-gray-600 transition-all">
                <feature.icon className="w-12 h-12 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Installation Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Quick Installation</h2>
        <div className="max-w-3xl mx-auto bg-gray-700 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="text-blue-400" />
            <span className="text-gray-300">Run this command in Termux:</span>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg font-mono text-sm mb-4">
            bash &lt;(curl -s https://itzbinar.com/install.sh)
          </div>
          <button className="text-sm text-gray-300 hover:text-white flex items-center gap-1">
            Copy command <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Tools Section */}
      <div className="bg-gray-800 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Pre-installed Tools</h2>
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
            {tools.map((tool, index) => (
              <div key={index} className="bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-600 transition-all">
                <Laptop2 className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <span className="text-sm">{tool}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 py-8">
        <div className="container mx-auto px-4 text-center text-gray-400">
          <p>© 2025 itzbinar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;