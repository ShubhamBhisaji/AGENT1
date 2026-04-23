// Type definitions for Gemini AI Chat Platform

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  hidden?: boolean;
}

export interface ChatRequest {
  prompt: string;
  messages?: Message[];
}

export interface ChatResponse {
  success: boolean;
  message: string;
}

export interface ChatError {
  error: string;
  details?: string;
}

export interface GeminiContent {
  role: 'user' | 'model';
  parts: Array<{
    text: string;
  }>;
}

export interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig?: {
    maxOutputTokens?: number;
    temperature?: number;
    topP?: number;
  };
}

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}
