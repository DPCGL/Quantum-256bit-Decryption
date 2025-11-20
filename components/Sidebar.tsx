
import React from 'react';
import type { View } from '../types';
import { SiriusIcon, QuantumCoreIcon, ImageIcon, VideoIcon, ChatIcon, MicIcon, SearchIcon, BrainIcon, ConsoleIcon, RealUnrealGeneratorIcon, GamepadIcon, LockIcon } from './shared/Icons';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
}

interface NavItemProps {
  view: View;
  label: string;
  icon: React.ReactNode;
  currentView: View;
  setCurrentView: (view: View) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, currentView, setCurrentView }) => (
  <button
    onClick={() => setCurrentView(view)}
    className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 relative ${
      currentView === view
        ? 'bg-cyan-500/20 text-cyan-300'
        : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'
    }`}
  >
    {currentView === view && (
      <div className="absolute left-0 top-2 bottom-2 w-1 bg-cyan-400 rounded-r-full" />
    )}
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'DASHBOARD', label: 'Quantum Core', icon: <QuantumCoreIcon /> },
    { view: 'IMAGE_STUDIO', label: 'Image Studio', icon: <ImageIcon /> },
    { view: 'VIDEO_FOUNDRY', label: 'Video Studio', icon: <VideoIcon /> },
    { view: 'CHAT_AGENT', label: 'Chat Agent', icon: <ChatIcon /> },
    { view: 'LIVE_ASSISTANT', label: 'Live Assistant', icon: <MicIcon /> },
    { view: 'WEB_EXPLORER', label: 'Web Explorer', icon: <SearchIcon /> },
    { view: 'TASK_SOLVER', label: 'Task Solver', icon: <BrainIcon /> },
    { view: 'CONSOLE', label: 'Console', icon: <ConsoleIcon /> },
    { view: 'REAL_UNREAL_GENERATOR', label: 'Real/Unreal', icon: <RealUnrealGeneratorIcon /> },
    { view: 'GAME_FORGE', label: 'Game Forge', icon: <GamepadIcon /> },
    { view: 'ENCRYPTION_BREAKER', label: 'Encryption Breaker', icon: <LockIcon /> },
  ];

  return (
    <div className="w-64 bg-gray-900/80 backdrop-blur-sm border-r border-cyan-400/20 p-4 flex flex-col space-y-8">
      <div className="flex items-center space-x-3 px-2">
        <SiriusIcon />
        <span className="text-xl font-bold text-white">Quantum Engine</span>
      </div>
      <nav className="flex-1 space-y-2">
        {navItems.map(item => (
          <NavItem key={item.view} {...item} currentView={currentView} setCurrentView={setCurrentView} />
        ))}
      </nav>
      <div className="px-3 text-xs text-gray-500">
        <p>SiriusAI OS v7.0 QE</p>
        <p>&copy; 2025-28 DiscretePC</p>
      </div>
    </div>
  );
};