import React from 'react';
import MatrixBackground from './components/MatrixBackground';
import ParticleEffect from './components/ParticleEffect';
import SocialCard from './components/SocialCard';
import CustomCursor from './components/CustomCursor';
import TerminalWindow from './components/TerminalWindow';
import './styles/globals.css';

function App() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center px-4 py-16">
      {/* Background Effects */}
      <MatrixBackground />
      <ParticleEffect />
      <CustomCursor />
      
      {/* Main Content */}
      <div className="z-10 w-full max-w-4xl mx-auto">
        <SocialCard />
        <TerminalWindow />
        
        <footer className="mt-8 text-center">
          <p className="text-green-500/50 text-xs font-mono">&lt;/&gt; with 💻 by Binar | {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}

export default App;