
export type View = 'DASHBOARD' | 'IMAGE_STUDIO' | 'VIDEO_FOUNDRY' | 'CHAT_AGENT' | 'LIVE_ASSISTANT' | 'WEB_EXPLORER' | 'TASK_SOLVER' | 'CONSOLE' | 'REAL_UNREAL_GENERATOR' | 'GAME_FORGE' | 'ENCRYPTION_BREAKER';

export interface HardwareInfo {
  cores: number;
  gpu: {
    name: string;
    vram_mb: number;
  };
}

export interface VramInfo {
  use_mb: number;
  source: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export type GroundingService = 'googleSearch' | 'googleMaps';

export interface GroundingChunk {
  // FIX: Made `uri` and `title` optional to match the type from `@google/genai` SDK.
  web?: {
    uri?: string;
    title?: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
        reviewSnippets: {
            uri: string;
            text: string;
        }[];
    }[];
  };
}

export type TTSVoice = 'Puck' | 'Kore' | 'Charon' | 'Fenrir' | 'Zephyr';