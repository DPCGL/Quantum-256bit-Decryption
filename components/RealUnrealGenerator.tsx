
import React, { useState, useEffect } from 'react';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Spinner } from './shared/Spinner';
import { RealUnrealGeneratorIcon } from './shared/Icons';
import * as geminiService from '../services/geminiService';

const defaultPrompt = 'A hyper-realistic photograph of a glass jellyfish floating through a city made of crystallized light, impossible geometry, volumetric god-rays.';

export const RealUnrealGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState<string>(defaultPrompt);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadingMessages = [
    "Entangling Qubits...",
    "Collapsing Probability Wave...",
    "Observing Manifold Realities...",
    "Rendering from the Quantum Foam...",
  ];
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

  useEffect(() => {
    let interval: number;
    if (isGenerating) {
        interval = window.setInterval(() => {
            setLoadingMessage(prev => {
                const currentIndex = loadingMessages.indexOf(prev);
                return loadingMessages[(currentIndex + 1) % loadingMessages.length];
            });
        }, 3000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);


  const handleGenerate = async () => {
    if (!prompt) return;
    setIsGenerating(true);
    setError(null);
    setGeneratedImage(null);
    setLoadingMessage(loadingMessages[0]);
    try {
      const imageBytes = await geminiService.generateImage(prompt);
      setGeneratedImage(`data:image/png;base64,${imageBytes}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Real/Unreal Generator</h1>
      <Card title="The Quantum Engine" icon={<RealUnrealGeneratorIcon />}>
        <div className="p-4 space-y-4">
          <p className="text-gray-400">Harness the Quantum Engine to collapse probability waveforms into tangible visuals. Describe a scene from the edge of imagination, and observe as it materializes from the quantum foam.</p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe an impossible scene..."
            className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-red-500 focus:border-red-500"
          />
          <Button onClick={handleGenerate} disabled={isGenerating || !prompt} className="w-full bg-red-600 hover:bg-red-500 focus:ring-red-500 disabled:bg-gray-600">
            {isGenerating ? <><Spinner /> <span className="ml-2">{loadingMessage}</span></> : 'Render from Quantum Foam'}
          </button>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          {generatedImage && (
            <div className="mt-4 rounded-lg p-1 bg-gradient-to-br from-red-500 to-purple-600">
              <img src={generatedImage} alt="Generated" className="w-full h-auto rounded-md" />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};