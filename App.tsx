
import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ImageStudio } from './components/ImageStudio';
import { VideoFoundry } from './components/VideoFoundry';
import { ChatAgent } from './components/ChatAgent';
import { LiveAssistant } from './components/LiveAssistant';
import { WebExplorer } from './components/WebExplorer';
import { TaskSolver } from './components/TaskSolver';
import { Console } from './components/Console';
import { RealUnrealGenerator } from './components/RealUnrealGenerator';
import { GameForge } from './components/GameForge';
import { EncryptionBreaker } from './components/EncryptionBreaker';
import type { View } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('DASHBOARD');

  const renderView = () => {
    switch (currentView) {
      case 'DASHBOARD':
        return <Dashboard />;
      case 'IMAGE_STUDIO':
        return <ImageStudio />;
      case 'VIDEO_FOUNDRY':
        return <VideoFoundry />;
      case 'CHAT_AGENT':
        return <ChatAgent />;
      case 'LIVE_ASSISTANT':
        return <LiveAssistant />;
      case 'WEB_EXPLORER':
        return <WebExplorer />;
      case 'TASK_SOLVER':
        return <TaskSolver />;
      case 'CONSOLE':
        return <Console />;
      case 'REAL_UNREAL_GENERATOR':
        return <RealUnrealGenerator />;
      case 'GAME_FORGE':
        return <GameForge />;
      case 'ENCRYPTION_BREAKER':
        return <EncryptionBreaker />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900/50 font-sans">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="fade-in" key={currentView}>
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;