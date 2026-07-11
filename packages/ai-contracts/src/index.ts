export type AIProvider = 'openai' | 'anthropic' | 'google' | 'mistral' | 'local';

export interface AIProviderConfig {
  id: AIProvider;
  name: string;
  models: string[];
  apiKeyRequired: boolean;
  baseUrl?: string;
}

export const PROVIDERS: AIProviderConfig[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    apiKeyRequired: true,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'],
    apiKeyRequired: true,
  },
  {
    id: 'google',
    name: 'Google',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro'],
    apiKeyRequired: true,
  },
  {
    id: 'mistral',
    name: 'Mistral',
    models: ['mistral-large-latest', 'mistral-small-latest'],
    apiKeyRequired: true,
  },
  {
    id: 'local',
    name: 'Local (Ollama)',
    models: ['llama3', 'mistral', 'gemma'],
    apiKeyRequired: false,
    baseUrl: 'http://localhost:11434',
  },
];

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  provider: AIProvider;
  model: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

export interface ChatResponse {
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}
