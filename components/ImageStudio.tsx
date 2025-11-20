
import React, { useState, useRef, useEffect } from 'react';
import { Card } from './shared/Card';
import { Button } from './shared/Button';
import { Spinner } from './shared/Spinner';
import { ImageIcon, MicIcon } from './shared/Icons';
import * as geminiService from '../services/geminiService';

interface UploadedImage {
  file: File;
  base64: string;
  url: string;
}

// Add SpeechRecognition interface to avoid TypeScript errors
interface SpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

export const ImageStudio: React.FC = () => {
  // Generation state
  const [genPrompt, setGenPrompt] = useState<string>('A photorealistic image of a futuristic city skyline at dusk, with flying cars.');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [genError, setGenError] = useState<string | null>(null);

  // Editing state
  const [editPrompt, setEditPrompt] = useState<string>('Add a retro, synthwave-style filter.');
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Voice input state
  const [isRecordingGen, setIsRecordingGen] = useState<boolean>(false);
  const [isRecordingEdit, setIsRecordingEdit] = useState<boolean>(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const activePromptSetter = useRef<React.Dispatch<React.SetStateAction<string>> | null>(null);
  const activeRecordingSetter = useRef<React.Dispatch<React.SetStateAction<boolean>> | null>(null);
  
  const setupSpeechRecognition = () => {
    const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) {
      console.warn("Speech Recognition not supported by this browser.");
      return;
    }

    const recognition: SpeechRecognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      if (activePromptSetter.current) {
        activePromptSetter.current(transcript);
      }
    };
    recognition.onerror = (event) => console.error('Speech recognition error', event.error);
    recognition.onend = () => {
        if (activeRecordingSetter.current) {
            activeRecordingSetter.current(false);
        }
    };
    recognitionRef.current = recognition;
  };

  useEffect(() => {
    setupSpeechRecognition();
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  const handleMicClick = (
    promptSetter: React.Dispatch<React.SetStateAction<string>>,
    recordingSetter: React.Dispatch<React.SetStateAction<boolean>>,
    isCurrentlyRecording: boolean
  ) => {
    if (!recognitionRef.current) return;
    
    if (isCurrentlyRecording) {
      recognitionRef.current.stop();
    } else {
      activePromptSetter.current = promptSetter;
      activeRecordingSetter.current = recordingSetter;
      recordingSetter(true);
      recognitionRef.current.start();
    }
  };


  const handleGenerate = async () => {
    if (!genPrompt) return;
    setIsGenerating(true);
    setGenError(null);
    setGeneratedImage(null);
    try {
      const imageBytes = await geminiService.generateImage(genPrompt);
      setGeneratedImage(`data:image/png;base64,${imageBytes}`);
    } catch (e) {
      setGenError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsGenerating(false);
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
        setEditedImage(null);
        setEditError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEdit = async () => {
    if (!editPrompt || !uploadedImage) return;
    setIsEditing(true);
    setEditError(null);
    setEditedImage(null);
    try {
      const imageBytes = await geminiService.editImage(editPrompt, uploadedImage.base64, uploadedImage.file.type);
      setEditedImage(`data:image/png;base64,${imageBytes}`);
    } catch (e) {
      setEditError(e instanceof Error ? e.message : 'An unknown error occurred.');
    } finally {
      setIsEditing(false);
    }
  };
  
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-white">SiriusAI(TM) Image Studio</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Generation */}
        <Card title="Generate Image (SiriusAI™ SBGRE)" icon={<ImageIcon />}>
          <div className="p-4 space-y-4">
            <div className="relative">
                <textarea
                  value={genPrompt}
                  onChange={(e) => setGenPrompt(e.target.value)}
                  placeholder="Enter a prompt to generate an image..."
                  className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-2 pr-10 text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
                <button
                    onClick={() => handleMicClick(setGenPrompt, setIsRecordingGen, isRecordingGen)}
                    className={`absolute right-2 top-2 p-1 rounded-full transition-colors duration-200 ${
                        isRecordingGen ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 hover:bg-gray-500 text-white'
                    }`}
                    aria-label={isRecordingGen ? 'Stop dictating' : 'Dictate prompt'}
                >
                    <MicIcon className="w-5 h-5" />
                </button>
            </div>
            <Button onClick={handleGenerate} disabled={isGenerating || !genPrompt} className="w-full">
              {isGenerating ? <Spinner /> : 'Generate'}
            </Button>
            {genError && <p className="text-red-400 text-sm">{genError}</p>}
            {generatedImage && (
              <div className="mt-4 rounded-lg p-1 bg-gradient-to-br from-cyan-500 to-blue-600">
                <img src={generatedImage} alt="Generated" className="w-full h-auto rounded-md" />
              </div>
            )}
          </div>
        </Card>

        {/* Image Editing */}
        <Card title="Edit Image (SiriusAI™ SBGRE)" icon={<ImageIcon />}>
          <div className="p-4 space-y-4">
            <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
            <Button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-600 hover:bg-gray-500">
              {uploadedImage ? 'Change Image' : 'Upload Image'}
            </Button>
            
            {uploadedImage && (
              <>
                <div className="relative">
                    <textarea
                      value={editPrompt}
                      onChange={(e) => setEditPrompt(e.target.value)}
                      placeholder="Enter a prompt to edit the image..."
                      className="w-full h-24 bg-gray-700 border border-gray-600 rounded-md p-2 pr-10 text-white focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    <button
                        onClick={() => handleMicClick(setEditPrompt, setIsRecordingEdit, isRecordingEdit)}
                        className={`absolute right-2 top-2 p-1 rounded-full transition-colors duration-200 ${
                            isRecordingEdit ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 hover:bg-gray-500 text-white'
                        }`}
                        aria-label={isRecordingEdit ? 'Stop dictating' : 'Dictate prompt'}
                    >
                        <MicIcon className="w-5 h-5" />
                    </button>
                </div>
                <Button onClick={handleEdit} disabled={isEditing || !editPrompt} className="w-full">
                  {isEditing ? <Spinner /> : 'Apply Edit'}
                </Button>
              </>
            )}
            
            {editError && <p className="text-red-400 text-sm">{editError}</p>}

            <div className="grid grid-cols-2 gap-4 mt-4">
              {uploadedImage && (
                <div>
                  <h3 className="text-center font-semibold mb-2 text-gray-300">Original</h3>
                  <img src={uploadedImage.url} alt="Original" className="w-full h-auto rounded-md" />
                </div>
              )}
              {editedImage && (
                <div>
                  <h3 className="text-center font-semibold mb-2 text-cyan-300">Edited</h3>
                   <div className="rounded-lg p-1 bg-gradient-to-br from-cyan-500 to-blue-600">
                      <img src={editedImage} alt="Edited" className="w-full h-auto rounded-md" />
                   </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
