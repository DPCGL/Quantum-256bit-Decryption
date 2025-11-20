
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './shared/Card';
import { ConsoleIcon } from './shared/Icons';
import * as geminiService from '../services/geminiService';
import { Spinner } from './shared/Spinner';

interface HistoryItem {
  type: 'command' | 'response' | 'error' | 'system';
  content: string;
}

const welcomeMessage: HistoryItem = {
  type: 'system',
  content: 'SiriusAI System Console v1.0.0\nType "help" for a list of available commands.',
};

export const Console: React.FC = () => {
  const [history, setHistory] = useState<HistoryItem[]>([welcomeMessage]);
  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      processCommand();
    }
  };

  const addHistory = (item: HistoryItem) => {
    setHistory(prev => [...prev, item]);
  };

  const processCommand = async () => {
    const command = input.trim();
    if (command === '') return;

    addHistory({ type: 'command', content: command });
    setInput('');
    
    const [cmd, ...args] = command.split(' ');

    switch (cmd.toLowerCase()) {
      case 'help':
        addHistory({ type: 'response', content: 'Available commands:\n  help          - Shows this help message\n  clear         - Clears the console history\n  status        - Displays system status\n  gemini.test   - Sends a test prompt to Gemini\n  echo [message] - Prints a message' });
        break;
      case 'clear':
        setHistory([welcomeMessage]);
        break;
      case 'status':
        addHistory({ type: 'response', content: `System Status: OK\nAPI Connection: Healthy\nAgent Pool: Active` });
        break;
      case 'echo':
        addHistory({ type: 'response', content: args.join(' ') || ' ' });
        break;
      case 'gemini.test':
        setIsLoading(true);
        try {
          const prompt = args.join(' ').length > 0 ? args.join(' ') : 'Tell me a short, futuristic joke.';
          addHistory({ type: 'system', content: `Sending prompt to Gemini: "${prompt}"` });
          const response = await geminiService.generateWithGemini(prompt);
          addHistory({ type: 'response', content: response });
        } catch (e) {
          addHistory({ type: 'error', content: e instanceof Error ? e.message : 'An unknown error occurred.' });
        } finally {
          setIsLoading(false);
        }
        break;
      default:
        addHistory({ type: 'error', content: `Command not found: ${command}` });
    }
  };

  const renderHistoryItem = (item: HistoryItem, index: number) => {
    switch (item.type) {
      case 'command':
        return <p key={index}><span className="text-cyan-400 mr-2">{'>'}</span>{item.content}</p>;
      case 'response':
        return <p key={index} className="whitespace-pre-wrap">{item.content}</p>;
      case 'error':
        return <p key={index} className="text-red-400 whitespace-pre-wrap">Error: {item.content}</p>;
      case 'system':
         return <p key={index} className="text-gray-400 whitespace-pre-wrap">{item.content}</p>;
      default:
        return null;
    }
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Console</h1>
      <Card title="Live Terminal" icon={<ConsoleIcon />} className="flex-1 flex flex-col">
        <div 
            className="flex-1 p-4 font-mono text-sm text-gray-300 bg-gray-900 overflow-y-auto"
            onClick={() => inputRef.current?.focus()}
        >
          {history.map(renderHistoryItem)}
          {isLoading && <div className="flex items-center space-x-2"><Spinner /><span className="text-gray-400">Gemini is thinking...</span></div>}
          <div ref={historyEndRef} />
        </div>
        <div className="border-t border-gray-700 p-2 flex items-center bg-gray-900">
          <span className="text-cyan-400 mr-2 font-mono text-sm">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            placeholder="Enter command..."
            className="flex-1 bg-transparent border-none text-gray-300 font-mono text-sm focus:ring-0"
            disabled={isLoading}
            autoComplete="off"
          />
        </div>
      </Card>
    </div>
  );
};