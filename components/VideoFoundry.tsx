
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Spinner } from './shared/Spinner';
import { VideoIcon } from './shared/Icons';
import * as geminiService from '../services/geminiService';

interface UploadedImage {
  file: File;
  base64: string;
  url: string;
}

export const VideoFoundry: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('A neon hologram of a cat driving at top speed');
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [apiKeySelected, setApiKeySelected] = useState<boolean>(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadingMessages = [
        "Initializing Veo render farm...",
        "Compositing initial frames...",
        "Applying temporal coherence models...",
        "Rendering high-fidelity motion vectors...",
        "This can take a few minutes. Please wait...",
        "Finalizing video stream..."
    ];
    const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);

    useEffect(() => {
        let interval: number;
        if (isLoading) {
            interval = window.setInterval(() => {
                setLoadingMessage(prev => {
                    const currentIndex = loadingMessages.indexOf(prev);
                    return loadingMessages[(currentIndex + 1) % loadingMessages.length];
                });
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isLoading, loadingMessages]);

    const checkApiKey = async () => {
        if (window.aistudio && typeof window.aistudio.hasSelectedApiKey === 'function') {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            setApiKeySelected(hasKey);
            return hasKey;
        }
        // Fallback for environments without aistudio
        setApiKeySelected(true);
        return true;
    };

    useEffect(() => {
        checkApiKey();
    }, []);

    const handleSelectKey = async () => {
        if (window.aistudio && typeof window.aistudio.openSelectKey === 'function') {
            await window.aistudio.openSelectKey();
            // Assume success and optimistically update UI
            setApiKeySelected(true);
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                setUploadedImage({
                    file,
                    base64: base64String,
                    url: URL.createObjectURL(file),
                });
                setGeneratedVideo(null);
                setError(null);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGenerate = async () => {
        if (!prompt || !uploadedImage) return;
        
        const hasKey = await checkApiKey();
        if (!hasKey) {
            setError("Please select an API key to proceed.");
            return;
        }
        
        setIsLoading(true);
        setError(null);
        setGeneratedVideo(null);
        setLoadingMessage(loadingMessages[0]);

        try {
            const videoUrl = await geminiService.generateVideo(prompt, uploadedImage.base64, uploadedImage.file.type, aspectRatio);
            setGeneratedVideo(videoUrl);
        } catch (e) {
            let errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            if (errorMessage.includes("Requested entity was not found")) {
                errorMessage = "API Key not found or invalid. Please select a valid key.";
                setApiKeySelected(false);
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    if (!apiKeySelected) {
        return (
             <div className="space-y-8">
                <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Video Studio</h1>
                <Card title="API Key Required" icon={<VideoIcon />}>
                    <div className="p-4 text-center space-y-4">
                        <p>The Veo model requires you to select an API key to generate videos.</p>
                        <p className="text-sm text-gray-400">
                           For more information, please see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">billing documentation</a>.
                        </p>
                        <Button onClick={handleSelectKey}>Select API Key</Button>
                        {error && <p className="text-red-400 mt-2">{error}</p>}
                    </div>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Video Studio</h1>
            <Card title="Generate Video (SiriusAI™ SBGRE Motion)" icon={<VideoIcon />}>
                <div className="p-4 space-y-4">
                     <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Enter a prompt to generate a video..."
                        className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                     <div className="flex items-center space-x-4">
                        <label htmlFor="videoAspectRatio" className="font-medium text-gray-300">Aspect Ratio:</label>
                        <select id="videoAspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value as '16:9' | '9:16')} className="bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-cyan-500 focus:border-cyan-500">
                           <option value="16:9">16:9 (Landscape)</option>
                           <option value="9:16">9:16 (Portrait)</option>
                        </select>
                     </div>

                    <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
                    <Button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-600 hover:bg-gray-500" disabled={isLoading}>
                       {uploadedImage ? 'Change Start Image' : 'Upload Start Image'}
                    </Button>

                    {uploadedImage && (
                        <div className="flex justify-center">
                            <img src={uploadedImage.url} alt="Start frame" className="max-h-48 rounded-md" />
                        </div>
                    )}
                    
                    <Button onClick={handleGenerate} disabled={isLoading || !prompt || !uploadedImage} className="w-full">
                      {isLoading ? <><Spinner /> <span className="ml-2">{loadingMessage}</span></> : 'Generate Video'}
                    </Button>

                    {error && <p className="text-red-400 text-sm">{error}</p>}

                    {generatedVideo && (
                        <div className="mt-4 border-2 border-cyan-500/50 rounded-lg p-2">
                             <video src={generatedVideo} controls autoPlay loop className="w-full h-auto rounded-md" />
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};
