# Loiva — Implementation Plan

> AI-powered emotional self-help guide. iOS + Android. RU + EN. Adults 18+.
> NOT therapy. NOT medical. Self-help companion.

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Implementation Phases](#2-implementation-phases)
3. [Multi-Provider API Key System](#3-multi-provider-api-key-system)
4. [Safety Classifier Architecture](#4-safety-classifier-architecture)
5. [Database Schema](#5-database-schema)
6. [i18n Strategy](#6-i18n-strategy)
7. [Testing Strategy](#7-testing-strategy)
8. [Parallelization Map](#8-parallelization-map)

---

## 1. Architecture Overview

### High-Level Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                    MOBILE APP                            │
│  Expo Router → Screens → Components → Hooks/Stores      │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │ TanStack │  │ Zustand  │  │ SQLite   │             │
│  │ Query    │  │ (UI)     │  │ (cache)  │             │
│  └────┬─────┘  └──────────┘  └──────────┘             │
│       │                                                  │
└───────┼──────────────────────────────────────────────────┘
        │ HTTPS
        ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                               │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐ │
│  │ PostgreSQL   │  │ Auth         │  │ Edge Functions │ │
│  │ + RLS        │  │ (JWT)        │  │ (AI Proxy,    │ │
│  │              │  │              │  │  Safety)       │ │
│  └─────────────┘  └──────────────┘  └───────┬───────┘ │
│                                              │          │
└──────────────────────────────────────────────┼──────────┘
                                               │ HTTPS
                                               ▼
                                     ┌──────────────────┐
                                     │  AI Providers     │
                                     │  OpenAI / Anthro  │
                                     │  Google / etc.    │
                                     └──────────────────┘
```

### Monorepo Structure (Turborepo)

```
loiva/
├── apps/
│   ├── mobile/                    # React Native Expo
│   └── admin/                     # Next.js admin (scaffold)
├── packages/
│   ├── ui/                        # Shared UI components
│   ├── shared/                    # Utils, types, constants
│   ├── i18n/                      # Localization
│   ├── schemas/                   # Zod schemas
│   └── ai-contracts/              # AI request/response types
├── supabase/
│   ├── migrations/                # SQL migrations
│   ├── functions/                 # Edge Functions
│   └── seed/                      # Seed data
├── docs/
├── turbo.json
├── package.json
└── tsconfig.base.json
```

---

## 2. Implementation Phases

### Phase 0: Foundation (Week 1-2)

**Goal:** Empty but buildable monorepo with all tooling configured.

#### Files to Create

```
loiva/
├── package.json                    # Root workspace config
├── turbo.json                      # Turborepo pipeline
├── tsconfig.base.json              # Shared TS config (strict)
├── .gitignore
├── .env.example                    # Template for env vars
├── apps/
│   └── mobile/
│       ├── app.json                # Expo config
│       ├── babel.config.js
│       ├── metro.config.js
│       ├── tsconfig.json
│       ├── package.json
│       ├── app/                    # Expo Router pages
│       │   ├── _layout.tsx         # Root layout
│       │   ├── index.tsx           # Entry redirect
│       │   └── +not-found.tsx
│       ├── src/
│       │   ├── app/                # Route groups
│       │   │   ├── (onboarding)/
│       │   │   ├── (auth)/
│       │   │   ├── (main)/
│       │   │   └── (modal)/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── stores/
│       │   ├── services/
│       │   ├── lib/
│       │   └── theme/
│       └── assets/
├── packages/
│   ├── ui/
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── tokens/            # Design tokens
│   │       │   ├── colors.ts
│   │       │   ├── spacing.ts
│   │       │   ├── typography.ts
│   │       │   └── index.ts
│   │       └── components/        # Shared components (empty scaffold)
│   ├── shared/
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── types/
│   │       └── utils/
│   ├── i18n/
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts           # i18next setup
│   │       ├── en.json
│   │       └── ru.json
│   ├── schemas/
│   │   ├── package.json
│   │   └── src/
│   │       ├── index.ts
│   │       ├── auth.ts
│   │       ├── chat.ts
│   │       └── profile.ts
│   └── ai-contracts/
│       ├── package.json
│       └── src/
│           ├── index.ts
│           ├── providers.ts       # Provider enum + config
│           ├── requests.ts        # Unified request types
│           └── responses.ts       # Unified response types
└── supabase/
    ├── config.toml
    └── migrations/
        └── 00001_initial.sql
```

#### Key Decisions

1. **Turborepo over Nx** — simpler config, good enough for this scale
2. **Expo SDK 52+** — latest stable, Expo Router v4
3. **TypeScript strict mode everywhere** — `tsconfig.base.json` with `"strict": true`
4. **Package manager: npm** — simplest with Expo (yarn/pnpm can cause issues)
5. **Node version: 20 LTS** — `.nvmrc` at root

#### Setup Commands

```bash
# Initialize monorepo
npx create-turbo@latest loiva
cd loiva

# Initialize Expo app
npx create-expo-app@latest apps/mobile --template tabs
cd apps/mobile
npx expo install expo-router expo-secure-store expo-localization
npx expo install @tanstack/react-query zustand i18next react-i18next
npx expo install react-native-reanimated react-native-gesture-handler
npx expo install @supabase/supabase-js
npx expo install expo-sqlite

# Initialize packages
cd ../../packages/ui && npm init -y
cd ../shared && npm init -y
cd ../i18n && npm init -y
cd ../schemas && npm init -y
cd ../ai-contracts && npm init -y
```

---

### Phase 1: Core Infrastructure (Week 2-4)

**Goal:** Auth, navigation, theme, database — app boots and user can sign up.

#### 1.1 Design System (packages/ui)

```typescript
// packages/ui/src/tokens/colors.ts
export const colors = {
  light: {
    bg: {
      primary: '#0D0D0D',      // Main background (dark even in light mode)
      secondary: '#1A1A1A',
      elevated: '#242424',
      card: '#1E1E1E',
    },
    text: {
      primary: '#F5F5F5',
      secondary: '#A0A0A0',
      muted: '#6B6B6B',
      accent: '#7C5CFC',       // Primary accent
    },
    border: {
      default: '#2A2A2A',
      focus: '#7C5CFC',
    },
    status: {
      calm: '#4ECDC4',
      alert: '#FF6B6B',
      warning: '#FFD93D',
      success: '#6BCB77',
    },
    safety: {
      normal: '#4ECDC4',
      elevated: '#FFD93D',
      urgent: '#FF8C42',
      imminent: '#FF6B6B',
    },
  },
  dark: {
    // Same as light (app is always dark-themed)
    // ...identical tokens
  },
} as const;
```

**Components to build first:**
- `Button` (primary, secondary, ghost, danger)
- `Input` (text, password, search)
- `Card`
- `Badge`
- `Avatar` (abstract, not human)
- `IconButton`
- `SafeAreaView` wrapper
- `ScrollView` with pull-to-refresh
- `BottomSheet`
- `Toast` / `Snackbar`

#### 1.2 Theme System (apps/mobile/src/theme)

```typescript
// apps/mobile/src/theme/provider.tsx
import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { colors } from '@loiva/ui';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeStore {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  resolved: 'light' | 'dark';
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
  get resolved() {
    const state = get();
    if (state.mode === 'system') {
      return useColorScheme() ?? 'dark';
    }
    return state.mode;
  },
}));
```

#### 1.3 Navigation Structure (Expo Router)

```
apps/mobile/app/
├── _layout.tsx                    # Root: ThemeProvider + QueryClient
├── index.tsx                      # Redirect to onboarding or main
├── +not-found.tsx
├── (onboarding)/
│   ├── _layout.tsx                # Stack (no back button)
│   ├── age-gate.tsx               # Step 1: 18+ verification
│   ├── language.tsx               # Step 2: RU/EN selection
│   ├── country.tsx                # Step 3: Country (for crisis resources)
│   ├── disclosure.tsx             # Step 4: AI disclosure
│   ├── privacy.tsx                # Step 5: Privacy choices
│   ├── communication.tsx          # Step 6: Communication prefs
│   └── safety-notice.tsx          # Step 7: Safety notice
├── (auth)/
│   ├── _layout.tsx                # Stack
│   ├── login.tsx
│   ├── signup.tsx
│   └── forgot-password.tsx
├── (main)/
│   ├── _layout.tsx                # Bottom tabs
│   ├── index.tsx                  # Home (quick actions)
│   ├── chat/
│   │   ├── _layout.tsx            # Stack
│   │   ├── index.tsx              # Chat list
│   │   └── [id].tsx               # Active conversation
│   ├── techniques/
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Technique categories
│   │   └── [id].tsx               # Single technique
│   ├── check-in/
│   │   ├── _layout.tsx
│   │   └── index.tsx              # Mood/tension/energy
│   ├── progress/
│   │   ├── _layout.tsx
│   │   └── index.tsx              # Progress visualization
│   ├── calm-room/
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Calm room hub
│   │   ├── breathing.tsx          # Breathing exercise
│   │   ├── grounding.tsx          # 5-4-3-2-1 grounding
│   │   └── timer.tsx              # Meditation timer
│   ├── habits/
│   │   ├── _layout.tsx
│   │   └── index.tsx              # Habit tracker
│   ├── memory/
│   │   ├── _layout.tsx
│   │   ├── index.tsx              # Memory Center
│   │   └── settings.tsx           # Memory settings
│   └── settings/
│       ├── _layout.tsx
│       ├── index.tsx              # Settings hub
│       ├── api-keys.tsx           # API key management
│       ├── privacy.tsx            # Privacy settings
│       ├── notifications.tsx
│       ├── theme.tsx
│       ├── language.tsx
│       ├── data.tsx               # Export/delete data
│       └── about.tsx
└── (modal)/
    ├── _layout.tsx                # Modal presentation
    ├── crisis.tsx                 # Crisis resources
    └── favorites.tsx              # Favorites list
```

#### 1.4 Authentication (Supabase)

```typescript
// apps/mobile/src/services/auth.ts
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Expo SecureStore adapter for Supabase
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

#### 1.5 Database Schema (Initial Migration)

See [Section 5: Database Schema](#5-database-schema) for full schema.

#### Key Decisions

1. **Expo SecureStore for tokens** — encrypted, available on device
2. **Supabase RLS everywhere** — row-level security from day one
3. **No global state for auth** — Zustand store mirrors Supabase session
4. **Onboarding stored locally** — completed before auth, persisted in SecureStore
5. **Expo Router groups** — `(onboarding)`, `(auth)`, `(main)`, `(modal)` for clean layout separation

---

### Phase 2: Chat Core (Week 4-6)

**Goal:** User can chat with AI using their own API key, 4 conversation modes.

#### 2.1 AI Provider Abstraction

```typescript
// packages/ai-contracts/src/providers.ts
export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  GOOGLE = 'google',
  MISTRAL = 'mistral',
  DEEPSEEK = 'deepseek',
  CUSTOM = 'custom',
}

export interface ProviderConfig {
  id: AIProvider;
  name: string;
  models: string[];
  defaultModel: string;
  maxTokens: number;
  supportsStreaming: boolean;
  supportsSystemPrompt: boolean;
}

export const PROVIDERS: Record<AIProvider, ProviderConfig> = {
  [AIProvider.OPENAI]: {
    id: AIProvider.OPENAI,
    name: 'OpenAI',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo'],
    defaultModel: 'gpt-4o-mini',
    maxTokens: 128000,
    supportsStreaming: true,
    supportsSystemPrompt: true,
  },
  [AIProvider.ANTHROPIC]: {
    id: AIProvider.ANTHROPIC,
    name: 'Anthropic',
    models: ['claude-sonnet-4-20250514', 'claude-3-haiku-20240307'],
    defaultModel: 'claude-3-haiku-20240307',
    maxTokens: 200000,
    supportsStreaming: true,
    supportsSystemPrompt: true,
  },
  // ... etc
};
```

#### 2.2 Chat Modes

```typescript
// packages/ai-contracts/src/modes.ts
export enum ChatMode {
  LISTEN = 'listen',        // Empathetic listening, no advice
  CALM = 'calm',            // Grounding, relaxation techniques
  SORT = 'sort',            // Help organize thoughts
  NEXT_STEP = 'next_step',  // Action-oriented, small steps
}

export const MODE_SYSTEM_PROMPTS: Record<ChatMode, string> = {
  [ChatMode.LISTEN]: `You are a compassionate listener. Your role is to:
- Reflect feelings back with validation
- Ask open-ended questions
- Never give advice unless asked
- Never diagnose or medicalize
- Use warm, calm language
- Keep responses concise (2-4 sentences)`,
  
  [ChatMode.CALM]: `You are a calming presence. Your role is to:
- Guide breathing exercises
- Use grounding techniques (5-4-3-2-1)
- Speak in short, soothing sentences
- Help the user feel safe
- Never rush or pressure
- Offer one technique at a time`,
  
  [ChatMode.SORT]: `You are a thinking partner. Your role is to:
- Help organize scattered thoughts
- Use reflective questions
- Offer frameworks (pros/cons, priorities)
- Never decide for the user
- Help identify patterns
- Keep structure simple`,
  
  [ChatMode.NEXT_STEP]: `You are a gentle motivator. Your role is to:
- Help identify one small, doable action
- Break overwhelming tasks into tiny steps
- Celebrate small wins
- Never push too hard
- Respect the user's pace
- Focus on progress, not perfection`,
};
```

#### 2.3 Server-Side AI Proxy (Edge Function)

```typescript
// supabase/functions/ai-proxy/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Verify JWT
    const authHeader = req.headers.get('Authorization');
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    // 2. Parse request
    const { messages, mode, provider, model } = await req.json();

    // 3. Safety check (pre-flight)
    const safetyResult = await checkSafety(messages, supabase);
    if (safetyResult.tier === 'imminent') {
      return new Response(JSON.stringify({
        blocked: true,
        safetyTier: 'imminent',
        crisisResources: safetyResult.resources,
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    // 4. Decrypt user's API key
    const apiKey = await decryptApiKey(user.id, provider, supabase);

    // 5. Route to provider
    const response = await routeToProvider(provider, model, messages, mode, apiKey);

    // 6. Stream response
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
```

#### 2.4 Provider Router

```typescript
// supabase/functions/ai-proxy/providers.ts
import { AIProvider } from '../_shared/types.ts';

export async function routeToProvider(
  provider: AIProvider,
  model: string,
  messages: Array<{ role: string; content: string }>,
  mode: string,
  apiKey: string,
): Promise<Response> {
  switch (provider) {
    case AIProvider.OPENAI:
      return fetchOpenAI(model, messages, mode, apiKey);
    case AIProvider.ANTHROPIC:
      return fetchAnthropic(model, messages, mode, apiKey);
    case AIProvider.GOOGLE:
      return fetchGoogle(model, messages, mode, apiKey);
    // ... etc
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

async function fetchOpenAI(
  model: string,
  messages: Array<{ role: string; content: string }>,
  mode: string,
  apiKey: string,
): Promise<Response> {
  const systemPrompt = getSystemPrompt(mode);
  const body = {
    model,
    messages: [{ role: 'system', content: systemPrompt }, ...messages],
    stream: true,
    max_tokens: 1024,
  };

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  return response; // Stream passthrough
}
```

#### 2.5 Chat UI Components

```
apps/mobile/src/components/chat/
├── ChatBubble.tsx              # Message bubble (user/AI)
├── ChatInput.tsx               # Text input + send button
├── ChatHeader.tsx              # Mode selector + conversation title
├── MessageList.tsx             # FlatList with inverted scroll
├── ModeSelector.tsx            # Listen/Calm/Sort/Next Step picker
├── TypingIndicator.tsx         # AI is typing animation
├── StreamedMessage.tsx         # Renders streaming chunks
└── SafetyBanner.tsx            # Shows when safety tier elevates
```

#### 2.6 Chat Hook

```typescript
// apps/mobile/src/hooks/useChat.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback } from 'react';
import { supabase } from '../services/auth';
import { ChatMode } from '@loiva/ai-contracts';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  safetyTier?: string;
}

export function useChat(conversationId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const sendMessage = useCallback(async (content: string, mode: ChatMode) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsStreaming(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-proxy`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            messages: [...messages, userMessage].map(m => ({
              role: m.role,
              content: m.content,
            })),
            mode,
            provider: 'openai', // From user settings
            model: 'gpt-4o-mini',
          }),
        }
      );

      // Handle safety block
      const data = await response.json();
      if (data.blocked) {
        // Show crisis resources
        return;
      }

      // Stream response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = '';

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        // Parse SSE chunks
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const json = JSON.parse(line.slice(6));
            if (json.choices?.[0]?.delta?.content) {
              assistantContent += json.choices[0].delta.content;
              // Update message in real-time
            }
          }
        }
      }

      setMessages(prev => [...prev, {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      }]);
    } finally {
      setIsStreaming(false);
    }
  }, [conversationId, messages]);

  return { messages, sendMessage, isStreaming };
}
```

#### Key Decisions

1. **Server-side proxy** — API keys never leave server, prevents abuse
2. **Streaming via SSE** — real-time response rendering
3. **Mode system prompts** — injected server-side, not client-configurable
4. **Safety pre-flight** — check before AI call, not after
5. **Optimistic UI** — user message appears instantly, AI streams in

---

### Phase 3: Self-Help Features (Week 6-8)

**Goal:** Techniques, check-ins, progress, calm room — core value features.

#### 3.1 Techniques Library

```typescript
// supabase/seed/techniques.ts
export const techniques = [
  {
    id: 'breathing-478',
    category: 'breathing',
    title_en: '4-7-8 Breathing',
    title_ru: 'Дыхание 4-7-8',
    description_en: 'A natural tranquilizer for the nervous system',
    description_ru: 'Естественный транквилизатор для нервной системы',
    steps_en: [
      'Breathe in through your nose for 4 seconds',
      'Hold your breath for 7 seconds',
      'Exhale completely through your mouth for 8 seconds',
      'Repeat 3-4 times',
    ],
    steps_ru: [
      'Вдохните через нос на 4 секунды',
      'Задержите дыхание на 7 секунд',
      'Выдохните через рот на 8 секунд',
      'Повторите 3-4 раза',
    ],
    duration_seconds: 120,
    difficulty: 'easy',
  },
  // ... 6-8 techniques total
];
```

#### 3.2 Check-In System

```typescript
// apps/mobile/src/components/checkin/CheckInSlider.tsx
interface CheckInProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  icons: [string, string, string, string, string]; // 1-5 emojis/icons
}

export function CheckInSlider({ label, value, onChange, icons }: CheckInProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.slider}>
        {icons.map((icon, index) => (
          <IconButton
            key={index}
            icon={icon}
            selected={value === index + 1}
            onPress={() => onChange(index + 1)}
            accessibilityLabel={`${label} ${index + 1} of 5`}
          />
        ))}
      </View>
    </View>
  );
}
```

#### 3.3 Progress Visualization

```typescript
// apps/mobile/src/components/progress/MoodChart.tsx
// Simple SVG chart showing mood over time
// No complex libraries — use react-native-svg

// apps/mobile/src/components/progress/WeeklySummary.tsx
// Cards showing: avg mood, check-ins completed, chat sessions, techniques tried

// apps/mobile/src/components/progress/Streak-freeIndicator.tsx
// Shows consistency WITHOUT punishing gaps
// "You checked in 12 of the last 30 days" (not "12 day streak!")
```

#### 3.4 Calm Room

```
apps/mobile/src/components/calm-room/
├── BreathingCircle.tsx         # Animated expanding/contracting circle
├── GroundingExercise.tsx       # 5-4-3-2-1 guided exercise
├── MeditationTimer.tsx         # Countdown with ambient sounds
├── AmbientPlayer.tsx           # Background sounds (rain, ocean, etc.)
└── CalmRoomEntry.tsx           # Hub card on home screen
```

#### Key Decisions

1. **Techniques in DB** — seeded, updatable without app release
2. **No streak system** — progress shown as ratio, not consecutive days
3. **SVG charts** — no heavy charting libraries, keep bundle small
4. **Ambient sounds bundled** — 3-4 basic sounds in app assets (not streamed)
5. **Check-in frequency** — suggested once daily, never enforced

---

### Phase 4: Memory & Personalization (Week 8-10)

**Goal:** Transparent memory system, habit tracker, favorites.

#### 4.1 Transparent Memory

```typescript
// apps/mobile/src/services/memory.ts
interface MemoryEntry {
  id: string;
  user_id: string;
  type: 'preference' | 'pattern' | 'goal' | 'context';
  content: string;
  source: 'user_explicit' | 'inferred' | 'chat_derived';
  confidence: number; // 0-1, how sure we are
  created_at: string;
  updated_at: string;
  visible_to_user: boolean; // Always true for transparency
}

// Memory is:
// 1. Always visible to user (Memory Center)
// 2. User can edit/delete any entry
// 3. Opt-in during onboarding
// 4. Stored server-side, synced to local SQLite
```

#### 4.2 Habit Tracker

```typescript
// apps/mobile/src/components/habits/HabitCard.tsx
interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'custom';
  completedDates: string[]; // ISO dates
  createdAt: string;
}

// No streaks! Show:
// - "Completed 18 of last 30 days" (ratio)
// - "Last completed: yesterday"
// - "Your best week: 6 of 7 days"
// - Calendar heatmap (subtle, not punishing)
```

#### 4.3 Favorites

```typescript
// Favoritable items: techniques, chat messages, quick actions
// Stored in Supabase + cached in SQLite
// Synced via TanStack Query
```

---

### Phase 5: Safety & Crisis (Week 10-12)

**Goal:** Full safety classifier, crisis routing, edge case handling.

See [Section 4: Safety Classifier](#4-safety-classifier-architecture) for detailed architecture.

#### Key Components

```
apps/mobile/src/components/safety/
├── CrisisBanner.tsx            # Top banner when elevated/imminent
├── CrisisModal.tsx             # Full crisis resources modal
├── SafetyNotice.tsx            # Shown during onboarding
└── SafetySettings.tsx          # In settings: crisis contacts

supabase/functions/
├── safety-classifier/
│   ├── index.ts                # Main classifier function
│   ├── tiers.ts                # Tier definitions + thresholds
│   ├── context-analyzer.ts     # Multi-step conversation analysis
│   ├── crisis-resources.ts     # Country-specific resources
│   └── handlers/
│       ├── normal.ts
│       ├── elevated.ts
│       ├── urgent.ts
│       └── imminent.ts
```

---

### Phase 6: Polish & Launch (Week 12-14)

**Goal:** Accessibility, performance, build pipeline, store submission.

#### Checklist

- [ ] WCAG 2.1 AA audit (all screens)
- [ ] Dynamic Type support (all text)
- [ ] Reduced motion support (all animations)
- [ ] VoiceOver / TalkBack testing
- [ ] Bundle size optimization
- [ ] EAS Build configuration
- [ ] App Store metadata (RU + EN)
- [ ] Google Play metadata (RU + EN)
- [ ] Privacy policy page
- [ ] Terms of service page
- [ ] Crash reporting (Sentry or Expo)
- [ ] Analytics (privacy-respecting, opt-in)
- [ ] Performance profiling (Flipper)

---

## 3. Multi-Provider API Key System

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT (Mobile)                       │
│                                                         │
│  Settings → API Keys Screen                             │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Provider: [OpenAI ▾]                            │   │
│  │ API Key:  [sk-••••••••••••••••]  [Show] [Save]  │   │
│  │ Model:    [gpt-4o-mini ▾]                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Key sent to server ONCE via HTTPS                      │
│  Never stored on client after initial save              │
│  Client only stores: provider name + model preference   │
└─────────────────────────────────────────────────────────┘
                          │
                          │ POST /functions/v1/api-keys
                          │ { provider, encrypted_key }
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Table: user_api_keys                            │   │
│  │ ─────────────────────────────────────────────── │   │
│  │ id          │ uuid PK                           │   │
│  │ user_id     │ uuid FK → auth.users              │   │
│  │ provider    │ text (openai/anthropic/etc)        │   │
│  │ model       │ text (default model for provider)  │   │
│  │ key_encrypted│ text (AES-256-GCM encrypted)     │   │
│  │ key_hint    │ text (last 4 chars: "sk-1234")     │   │
│  │ created_at  │ timestamptz                        │   │
│  │ updated_at  │ timestamptz                        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  RLS: Users can only read/write their own keys          │
│  Encryption: Server-side key (SUPABASE_API_KEY_SECRET)  │
│  Edge Function decrypts at runtime                      │
└─────────────────────────────────────────────────────────┘
```

### Encryption Flow

```
1. User enters API key on client
2. Client sends POST to Edge Function: /functions/v1/api-keys
3. Edge Function:
   a. Verifies JWT (user authenticated)
   b. Encrypts key with AES-256-GCM using server secret
   c. Stores encrypted key in user_api_keys table
   d. Returns { success: true, hint: "sk-1234" }
4. Client stores: { provider, model, keyHint } locally (Zustand)

At chat time:
1. Client sends: { messages, mode, provider }
2. Edge Function:
   a. Verifies JWT
   b. Fetches encrypted key from DB
   c. Decrypts with server secret
   d. Routes to provider API
   e. Streams response back
```

### Edge Function: API Key Management

```typescript
// supabase/functions/api-keys/index.ts
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ENCRYPTION_KEY = Deno.env.get('API_KEY_ENCRYPTION_SECRET')!;

serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  if (req.method === 'POST') {
    // Save/update API key
    const { provider, model, apiKey } = await req.json();
    
    // Validate provider
    const validProviders = ['openai', 'anthropic', 'google', 'mistral', 'deepseek'];
    if (!validProviders.includes(provider)) {
      return new Response(JSON.stringify({ error: 'Invalid provider' }), { status: 400 });
    }

    // Encrypt the key
    const encrypted = await encrypt(apiKey, ENCRYPTION_KEY);
    const hint = apiKey.slice(-4); // Last 4 chars

    // Upsert
    const { error: upsertError } = await supabase
      .from('user_api_keys')
      .upsert({
        user_id: user.id,
        provider,
        model,
        key_encrypted: encrypted,
        key_hint: `${apiKey.slice(0, 3)}...${hint}`,
      }, { onConflict: 'user_id,provider' });

    if (upsertError) throw upsertError;

    return new Response(JSON.stringify({ 
      success: true, 
      hint: `***${hint}` 
    }));
  }

  if (req.method === 'GET') {
    // List user's configured providers (NO actual keys)
    const { data, error } = await supabase
      .from('user_api_keys')
      .select('provider, model, key_hint, created_at')
      .eq('user_id', user.id);

    if (error) throw error;
    return new Response(JSON.stringify({ providers: data }));
  }

  if (req.method === 'DELETE') {
    // Remove API key
    const { provider } = await req.json();
    const { error } = await supabase
      .from('user_api_keys')
      .delete()
      .eq('user_id', user.id)
      .eq('provider', provider);

    if (error) throw error;
    return new Response(JSON.stringify({ success: true }));
  }
});
```

### Client-Side API Key Settings

```typescript
// apps/mobile/src/app/(main)/settings/api-keys.tsx
import { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../../../services/auth';
import { AIProvider, PROVIDERS } from '@loiva/ai-contracts';

export function ApiKeysScreen() {
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(AIProvider.OPENAI);
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const queryClient = useQueryClient();

  // Fetch configured providers
  const { data: configuredProviders } = useQuery({
    queryKey: ['api-keys'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/api-keys`,
        { headers: { Authorization: `Bearer ${session?.access_token}` } }
      );
      return res.json();
    },
  });

  // Save API key
  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/api-keys`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: selectedProvider,
            model: PROVIDERS[selectedProvider].defaultModel,
            apiKey,
          }),
        }
      );
      if (!res.ok) throw new Error('Failed to save');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] });
      setApiKey('');
      Alert.alert('Saved', 'API key saved securely');
    },
  });

  return (
    <View style={{ padding: 16 }}>
      <Text style={{ color: '#F5F5F5', fontSize: 24, fontWeight: 'bold' }}>
        API Keys
      </Text>
      <Text style={{ color: '#A0A0A0', marginTop: 8 }}>
        Your keys are encrypted and stored securely on our server.
        We never share them with third parties.
      </Text>
      
      {/* Provider selector */}
      {/* API key input */}
      {/* Model selector */}
      {/* Save button */}
      {/* List of configured providers */}
    </View>
  );
}
```

---

## 4. Safety Classifier Architecture

### Design Principles

1. **Multi-step context** — analyze conversation history, not just current message
2. **No keyword matching** — semantic understanding via AI + rules
3. **4 tiers with clear actions** — each tier has specific response protocol
4. **Fail-safe** — if classifier is uncertain, escalate one tier
5. **Country-aware** — crisis resources vary by user's country

### Tier System

```typescript
// supabase/functions/safety-classifier/tiers.ts
export enum SafetyTier {
  NORMAL = 'normal',       // Green — proceed normally
  ELEVATED = 'elevated',   // Yellow — add supportive elements
  URGENT = 'urgent',       // Orange — activate safety protocol
  IMMINENT = 'imminent',   // Red — crisis intervention
}

export interface TierConfig {
  tier: SafetyTier;
  actions: string[];
  responseModifiers: string[];
  alerts: string[];
  escalation: boolean;
}

export const TIER_CONFIG: Record<SafetyTier, TierConfig> = {
  [SafetyTier.NORMAL]: {
    tier: SafetyTier.NORMAL,
    actions: ['proceed_normally'],
    responseModifiers: [],
    alerts: [],
    escalation: false,
  },
  [SafetyTier.ELEVATED]: {
    tier: SafetyTier.ELEVATED,
    actions: ['add_supportive_elements', 'suggest_grounding'],
    responseModifiers: [
      'include_validation',
      'offer_coping_strategies',
      'ask_about_safety',
    ],
    alerts: ['show_supportive_banner'],
    escalation: false,
  },
  [SafetyTier.URGENT]: {
    tier: SafetyTier.URGENT,
    actions: ['activate_safety_protocol', 'suggest_professional_help'],
    responseModifiers: [
      'empathetic_but_clear',
      'provide_crisis_resources',
      'avoid_minimizing',
    ],
    alerts: ['show_crisis_banner', 'offer_crisis_call'],
    escalation: true,
  },
  [SafetyTier.IMMINENT]: {
    tier: SafetyTier.IMMINENT,
    actions: ['crisis_intervention', 'provide_immediate_resources'],
    responseModifiers: [
      'direct_and_clear',
      'provide_phone_numbers',
      'do_not_end_conversation',
    ],
    alerts: ['full_screen_crisis', 'show_emergency_numbers'],
    escalation: true,
  },
};
```

### Classifier Pipeline

```typescript
// supabase/functions/safety-classifier/index.ts
import { SafetyTier, TIER_CONFIG } from './tiers.ts';
import { analyzeContext } from './context-analyzer.ts';
import { getCrisisResources } from './crisis-resources.ts';

interface ClassificationResult {
  tier: SafetyTier;
  confidence: number;
  reasoning: string;
  resources?: CrisisResource[];
  modifiers: string[];
}

export async function classifySafety(
  messages: Array<{ role: string; content: string }>,
  userCountry: string,
  userLanguage: string,
): Promise<ClassificationResult> {
  // Step 1: Extract signals from conversation
  const signals = await analyzeContext(messages);
  
  // Step 2: Determine tier based on signals
  const tier = determineTier(signals);
  
  // Step 3: Get crisis resources if needed
  let resources;
  if (tier === SafetyTier.URGENT || tier === SafetyTier.IMMINENT) {
    resources = await getCrisisResources(userCountry, userLanguage);
  }
  
  // Step 4: Apply tier-specific modifiers
  const config = TIER_CONFIG[tier];
  
  return {
    tier,
    confidence: signals.confidence,
    reasoning: signals.reasoning,
    resources,
    modifiers: config.responseModifiers,
  };
}

function determineTier(signals: ContextSignals): SafetyTier {
  // Scoring system — not binary
  let score = 0;
  
  // Direct self-harm mentions
  if (signals.selfHarmDirect) score += 40;
  
  // Hopelessness indicators
  if (signals.hopelessness) score += 20;
  if (signals.persistentHopelessness) score += 15;
  
  // Isolation indicators
  if (signals.isolation) score += 10;
  
  // Support systems
  if (signals.hasSupport) score -= 15;
  if (signals.seekingHelp) score -= 10;
  
  // Coping mechanisms
  if (signals.hasCoping) score -= 10;
  
  // Time-based escalation
  if (signals.escalatingTone) score += 20;
  if (signals.deescalatingTone) score -= 15;
  
  // Determine tier
  if (score >= 60) return SafetyTier.IMMINENT;
  if (score >= 40) return SafetyTier.URGENT;
  if (score >= 20) return SafetyTier.ELEVATED;
  return SafetyTier.NORMAL;
}
```

### Context Analyzer

```typescript
// supabase/functions/safety-classifier/context-analyzer.ts
interface ContextSignals {
  // Direct signals
  selfHarmDirect: boolean;
  selfHarmIndirect: boolean;
  suicidalIdeation: boolean;
  violenceRisk: boolean;
  
  // Emotional signals
  hopelessness: boolean;
  persistentHopelessness: boolean;
  overwhelming: boolean;
  worthlessness: boolean;
  
  // Behavioral signals
  isolation: boolean;
  sleepDisturbance: boolean;
  substanceMention: boolean;
  
  // Protective factors
  hasSupport: boolean;
  seekingHelp: boolean;
  hasCoping: boolean;
  futureOrientation: boolean;
  
  // Conversation dynamics
  escalatingTone: boolean;
  deescalatingTone: boolean;
  reassuranceLoop: boolean;
  delusionIndicators: boolean;
  maniaIndicators: boolean;
  
  // Meta
  confidence: number;
  reasoning: string;
}

export async function analyzeContext(
  messages: Array<{ role: string; content: string }>
): Promise<ContextSignals> {
  // Strategy: Use the AI itself to analyze the conversation
  // This is meta — use a separate (cheap) model call for classification
  
  const recentMessages = messages.slice(-10); // Last 10 messages
  const conversationText = recentMessages
    .map(m => `${m.role}: ${m.content}`)
    .join('\n');
  
  const analysisPrompt = `Analyze this conversation for safety signals. 
Return a JSON object with boolean fields for each signal.

Conversation:
${conversationText}

Signals to detect:
- selfHarmDirect: Direct mentions of self-harm or suicide
- selfHarmIndirect: Indirect references (e.g., "won't be a problem much longer")
- suicidalIdeation: Thoughts of ending life
- hopelessness: Expressions of hope or no way out
- persistentHopelessness: Hopelessness mentioned multiple times
- overwhelming: Feeling overwhelmed, can't cope
- worthlessness: Expressions of being worthless or a burden
- isolation: Feeling alone, no support
- hasSupport: Mentions of people who care
- seekingHelp: Actively seeking solutions
- hasCoping: Mentions healthy coping strategies
- escalatingTone: Getting more intense over messages
- deescalatingTone: Calming down
- reassuranceLoop: Repeatedly seeking same reassurance
- delusionIndicators: Fixed false beliefs
- maniaIndicators: Racing thoughts, grandiosity, reduced need for sleep

Return JSON only. No explanation.`;

  // Call a cheap model (e.g., gpt-4o-mini) for classification
  const response = await callClassifierModel(analysisPrompt);
  const signals = JSON.parse(response) as ContextSignals;
  
  // Apply additional rules
  signals.persistentHopelessness = checkPersistentHopelessness(messages);
  signals.escalatingTone = checkEscalatingTone(messages);
  signals.reassuranceLoop = checkReassuranceLoop(messages);
  
  return signals;
}
```

### Crisis Resources by Country

```typescript
// supabase/functions/safety-classifier/crisis-resources.ts
interface CrisisResource {
  name: string;
  phone?: string;
  text?: string;
  website?: string;
  available: string; // "24/7", "Mon-Fri 9-5", etc.
  language: string[];
}

const CRISIS_RESOURCES: Record<string, CrisisResource[]> = {
  RU: [
    {
      name: 'Телефон доверия',
      phone: '8-800-2000-122',
      available: '24/7',
      language: ['ru'],
    },
    {
      name: 'Психологическая помощь',
      phone: '051',
      available: '24/7',
      language: ['ru'],
    },
  ],
  US: [
    {
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      available: '24/7',
      language: ['en', 'es'],
    },
    {
      name: 'Crisis Text Line',
      text: 'HOME to 741741',
      available: '24/7',
      language: ['en'],
    },
  ],
  GB: [
    {
      name: 'Samaritans',
      phone: '116 123',
      available: '24/7',
      language: ['en'],
    },
  ],
  // ... more countries
};

export async function getCrisisResources(
  countryCode: string,
  language: string
): Promise<CrisisResource[]> {
  const resources = CRISIS_RESOURCES[countryCode] ?? [];
  return resources.filter(r => r.language.includes(language));
}
```

### Edge Cases Handled

1. **Reassurance loop** — user keeps asking same question → gently redirect
2. **Delusion-safe** — don't argue with delusions, don't reinforce them
3. **Mania indicators** — don't encourage risky behavior, suggest grounding
4. **Gradual escalation** — track tone across conversation, not just one message
5. **False positives** — if uncertain, escalate one tier (fail-safe)

---

## 5. Database Schema

### Core Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  country_code TEXT NOT NULL DEFAULT 'US',
  language TEXT NOT NULL DEFAULT 'en',
  onboarding_completed BOOLEAN NOT NULL DEFAULT false,
  theme TEXT NOT NULL DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  memory_enabled BOOLEAN NOT NULL DEFAULT false,
  communication_prefs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- ============================================
-- USER API KEYS
-- ============================================
CREATE TABLE user_api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google', 'mistral', 'deepseek', 'custom')),
  model TEXT NOT NULL,
  key_encrypted TEXT NOT NULL,
  key_hint TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, provider)
);

ALTER TABLE user_api_keys ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own API keys" ON user_api_keys
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- CONVERSATIONS
-- ============================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  mode TEXT NOT NULL CHECK (mode IN ('listen', 'calm', 'sort', 'next_step')),
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  safety_tier TEXT NOT NULL DEFAULT 'normal',
  is_archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own conversations" ON conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);

-- ============================================
-- MESSAGES
-- ============================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  safety_tier TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own messages" ON messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert own messages" ON messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- ============================================
-- CHECK-INS
-- ============================================
CREATE TABLE check_ins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mood INTEGER NOT NULL CHECK (mood BETWEEN 1 AND 5),
  tension INTEGER NOT NULL CHECK (tension BETWEEN 1 AND 5),
  energy INTEGER NOT NULL CHECK (energy BETWEEN 1 AND 5),
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own check-ins" ON check_ins
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_check_ins_user_date ON check_ins(user_id, created_at DESC);

-- ============================================
-- TECHNIQUES (read-only, seeded)
-- ============================================
CREATE TABLE techniques (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category TEXT NOT NULL CHECK (category IN ('breathing', 'grounding', 'cognitive', 'behavioral', 'mindfulness')),
  title_en TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  description_en TEXT NOT NULL,
  description_ru TEXT NOT NULL,
  steps_en JSONB NOT NULL,
  steps_ru JSONB NOT NULL,
  duration_seconds INTEGER,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- No RLS needed — public read-only table

-- ============================================
-- FAVORITES
-- ============================================
CREATE TABLE favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('technique', 'message', 'quick_action')),
  item_id UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, item_type, item_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- HABITS
-- ============================================
CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL CHECK (frequency IN ('daily', 'weekly', 'custom')),
  custom_days INTEGER[], -- For custom: [1,3,5] = Mon,Wed,Fri
  completed_dates DATE[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own habits" ON habits
  FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- MEMORY ENTRIES (transparent memory)
-- ============================================
CREATE TABLE memory_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('preference', 'pattern', 'goal', 'context')),
  content TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('user_explicit', 'inferred', 'chat_derived')),
  confidence NUMERIC(3,2) CHECK (confidence BETWEEN 0 AND 1),
  visible_to_user BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE memory_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own memory" ON memory_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE INDEX idx_memory_user_type ON memory_entries(user_id, type);

-- ============================================
-- CRISIS RESOURCES (public, seeded)
-- ============================================
CREATE TABLE crisis_resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  country_code TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  text_number TEXT,
  website TEXT,
  available_hours TEXT NOT NULL DEFAULT '24/7',
  languages TEXT[] NOT NULL DEFAULT ARRAY['en'],
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- No RLS needed — public table
CREATE INDEX idx_crisis_country ON crisis_resources(country_code);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_api_keys_updated_at
  BEFORE UPDATE ON user_api_keys
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memory_entries_updated_at
  BEFORE UPDATE ON memory_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### SQLite Local Cache (Offline)

```typescript
// apps/mobile/src/services/database.ts
import * as SQLite from 'expo-sqlite';

export async function initDatabase() {
  const db = await SQLite.openDatabaseAsync('loiva.db');
  
  await db.execAsync(`
    -- Cached techniques (for offline access)
    CREATE TABLE IF NOT EXISTS cached_techniques (
      id TEXT PRIMARY KEY,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    
    -- Cached crisis resources
    CREATE TABLE IF NOT EXISTS cached_crisis_resources (
      id TEXT PRIMARY KEY,
      country_code TEXT NOT NULL,
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
    
    -- Local check-ins (sync when online)
    CREATE TABLE IF NOT EXISTS local_check_ins (
      id TEXT PRIMARY KEY,
      mood INTEGER NOT NULL,
      tension INTEGER NOT NULL,
      energy INTEGER NOT NULL,
      note TEXT,
      created_at INTEGER NOT NULL,
      synced INTEGER DEFAULT 0
    );
    
    -- Conversation drafts (offline support)
    CREATE TABLE IF NOT EXISTS conversation_drafts (
      id TEXT PRIMARY KEY,
      conversation_id TEXT,
      messages TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    );
  `);
  
  return db;
}
```

---

## 6. i18n Strategy

### Setup

```typescript
// packages/i18n/src/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import ru from './ru.json';

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ru: { translation: ru },
  },
  lng: Localization.getLocales()[0]?.languageCode ?? 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already escapes
  },
  // Pluralization rules for Russian
  pluralSeparator: '_',
  plural: (n: number) => {
    const mod10 = n % 10;
    const mod100 = n % 100;
    if (mod100 >= 11 && mod100 <= 19) return 2;
    if (mod10 === 1) return 0;
    if (mod10 >= 2 && mod10 <= 4) return 1;
    return 2;
  },
});

export default i18n;
```

### Translation File Structure

```json
// packages/i18n/src/en.json
{
  "common": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "confirm": "Confirm",
    "loading": "Loading...",
    "error": "Something went wrong",
    "retry": "Try again",
    "back": "Back",
    "next": "Next",
    "done": "Done"
  },
  "onboarding": {
    "ageGate": {
      "title": "Age Verification",
      "description": "Loiva is designed for adults aged 18 and older.",
      "confirm": "I am 18 or older",
      "exit": "Exit"
    },
    "language": {
      "title": "Choose Your Language",
      "description": "This will be your default language. You can change it later.",
      "english": "English",
      "russian": "Русский"
    },
    "disclosure": {
      "title": "Important Notice",
      "description": "Loiva is a self-help tool, not a replacement for professional mental health care. If you're in crisis, please contact emergency services.",
      "understood": "I understand"
    }
  },
  "chat": {
    "modes": {
      "listen": "Listen",
      "calm": "Calm",
      "sort": "Sort",
      "nextStep": "Next Step"
    },
    "input": {
      "placeholder": "Type your message...",
      "send": "Send"
    },
    "empty": {
      "title": "Start a conversation",
      "description": "Choose a mode and share what's on your mind."
    }
  },
  "home": {
    "greeting": "Hello",
    "quickActions": {
      "chat": "Chat",
      "checkIn": "Check In",
      "calmRoom": "Calm Room",
      "techniques": "Techniques"
    }
  },
  "safety": {
    "crisis": {
      "title": "You're not alone",
      "description": "If you're in crisis, help is available right now.",
      "call": "Call",
      "text": "Text",
      "website": "Visit Website"
    },
    "banner": {
      "elevated": "It seems like you're going through a difficult time. Remember, support is available.",
      "urgent": "I'm concerned about you. Please consider reaching out to a crisis line.",
      "imminent": "Your safety matters. Please reach out for immediate help."
    }
  },
  "settings": {
    "apiKeys": {
      "title": "API Keys",
      "description": "Your keys are encrypted and stored securely.",
      "addProvider": "Add Provider",
      "removeKey": "Remove Key"
    }
  }
}
```

```json
// packages/i18n/src/ru.json
{
  "common": {
    "save": "Сохранить",
    "cancel": "Отмена",
    "delete": "Удалить",
    "confirm": "Подтвердить",
    "loading": "Загрузка...",
    "error": "Что-то пошло не так",
    "retry": "Попробовать снова",
    "back": "Назад",
    "next": "Далее",
    "done": "Готово"
  },
  "onboarding": {
    "ageGate": {
      "title": "Подтверждение возраста",
      "description": "Loiva предназначена для людей от 18 лет.",
      "confirm": "Мне есть 18 лет",
      "exit": "Выйти"
    },
    "language": {
      "title": "Выберите язык",
      "description": "Это будет язык по умолчанию. Вы можете изменить его позже.",
      "english": "English",
      "russian": "Русский"
    },
    "disclosure": {
      "title": "Важное уведомление",
      "description": "Loiva — это инструмент для самопомощи, а не замена профессиональной помощи. Если вы в кризисе, обратитесь в экстренные службы.",
      "understood": "Понятно"
    }
  },
  "chat": {
    "modes": {
      "listen": "Слушать",
      "calm": "Успокоиться",
      "sort": "Разобраться",
      "nextStep": "Следующий шаг"
    },
    "input": {
      "placeholder": "Напишите сообщение...",
      "send": "Отправить"
    },
    "empty": {
      "title": "Начните разговор",
      "description": "Выберите режим и расскажите, что у вас на уме."
    }
  },
  "home": {
    "greeting": "Привет",
    "quickActions": {
      "chat": "Чат",
      "checkIn": "Чек-ин",
      "calmRoom": "Комната покоя",
      "techniques": "Техники"
    }
  },
  "safety": {
    "crisis": {
      "title": "Вы не одиноки",
      "description": "Если вы в кризисе, помощь доступна прямо сейчас.",
      "call": "Позвонить",
      "text": "Написать",
      "website": "Перейти на сайт"
    },
    "banner": {
      "elevated": "Похоже, вы переживаете трудное время. Помните, поддержка доступна.",
      "urgent": "Я забочусь о вас. Пожалуйста, обратитесь на линию помощи.",
      "imminent": "Ваша безопасность важна. Пожалуйста, обратитесь за немедленной помощью."
    }
  },
  "settings": {
    "apiKeys": {
      "title": "Ключи API",
      "description": "Ваши ключи зашифрованы и надежно хранятся.",
      "addProvider": "Добавить провайдера",
      "removeKey": "Удалить ключ"
    }
  }
}
```

### Key i18n Decisions

1. **Namespace by feature** — `chat.modes.listen`, not `listenMode`
2. **Pluralization** — Russian has 3 forms (1, 2-4, 5+)
3. **No dynamic keys** — all keys known at compile time
4. **Fallback chain** — user choice → system locale → English
5. **Crisis resources in user's language** — always available
6. **RTL support** — not needed for RU/EN, but architecture supports it

---

## 7. Testing Strategy

### Unit Tests (Jest)

```typescript
// apps/mobile/src/__tests__/hooks/useChat.test.ts
// apps/mobile/src/__tests__/services/safety.test.ts
// apps/mobile/src/__tests__/stores/theme.test.ts

// packages/schemas/src/__tests__/auth.test.ts
// packages/schemas/src/__tests__/chat.test.ts
// packages/shared/src/__tests__/utils.test.ts
```

### Component Tests (React Testing Library)

```typescript
// apps/mobile/src/components/__tests__/ChatBubble.test.tsx
// apps/mobile/src/components/__tests__/CheckInSlider.test.tsx
// apps/mobile/src/components/__tests__/ModeSelector.test.tsx
```

### Integration Tests

```typescript
// apps/mobile/src/__tests__/integration/chat-flow.test.ts
// apps/mobile/src/__tests__/integration/auth-flow.test.ts
// apps/mobile/src/__tests__/integration/onboarding.test.ts
```

### E2E Tests (Detox)

```typescript
// e2e/
//   ├── onboarding.test.ts
//   ├── auth.test.ts
//   ├── chat.test.ts
//   ├── techniques.test.ts
//   ├── checkin.test.ts
//   └── settings.test.ts
```

### Safety Classifier Tests (CRITICAL)

```typescript
// supabase/functions/safety-classifier/__tests__/classifier.test.ts

describe('Safety Classifier', () => {
  describe('Normal tier', () => {
    it('classifies casual conversation as normal', async () => {
      const messages = [
        { role: 'user', content: 'I had a good day today' },
        { role: 'assistant', content: "That's wonderful! What made it good?" },
      ];
      const result = await classifySafety(messages, 'US', 'en');
      expect(result.tier).toBe(SafetyTier.NORMAL);
    });
  });

  describe('Elevated tier', () => {
    it('detects hopelessness patterns', async () => {
      const messages = [
        { role: 'user', content: "Nothing ever gets better" },
        { role: 'user', content: "I've been feeling this way for weeks" },
        { role: 'user', content: "I don't see the point anymore" },
      ];
      const result = await classifySafety(messages, 'US', 'en');
      expect(result.tier).toBe(SafetyTier.ELEVATED);
    });
  });

  describe('Urgent tier', () => {
    it('detects indirect self-harm mentions', async () => {
      const messages = [
        { role: 'user', content: "Everyone would be better off without me" },
        { role: 'user', content: "I don't want to be here anymore" },
      ];
      const result = await classifySafety(messages, 'US', 'en');
      expect(result.tier).toBe(SafetyTier.URGENT);
      expect(result.resources).toBeDefined();
    });
  });

  describe('Imminent tier', () => {
    it('detects direct self-harm intent', async () => {
      const messages = [
        { role: 'user', content: "I'm going to hurt myself tonight" },
      ];
      const result = await classifySafety(messages, 'US', 'en');
      expect(result.tier).toBe(SafetyTier.IMMINENT);
      expect(result.resources).toBeDefined();
      expect(result.modifiers).toContain('provide_phone_numbers');
    });
  });

  describe('Edge cases', () => {
    it('handles reassurance loops', async () => {
      const messages = [
        { role: 'user', content: "Am I going to be okay?" },
        { role: 'assistant', content: "It sounds like you're worried..." },
        { role: 'user', content: "But am I going to be okay?" },
        { role: 'assistant', content: "I hear your concern..." },
        { role: 'user', content: "Just tell me I'll be okay" },
        { role: 'user', content: "Will I be okay?" },
      ];
      const result = await classifySafety(messages, 'US', 'en');
      expect(result.signals.reassuranceLoop).toBe(true);
    });

    it('handles delusion indicators', async () => {
      const messages = [
        { role: 'user', content: "The government is tracking my thoughts" },
        { role: 'user', content: "They installed chips in my brain" },
      ];
      const result = await classifySafety(messages, 'US', 'en');
      expect(result.signals.delusionIndicators).toBe(true);
    });

    it('handles mania indicators', async () => {
      const messages = [
        { role: 'user', content: "I haven't slept in 3 days and I feel amazing" },
        { role: 'user', content: "I'm going to quit my job and start a company" },
      ];
      const result = await classifySafety(messages, 'US', 'en');
      expect(result.signals.maniaIndicators).toBe(true);
    });
  });

  describe('Protective factors', () => {
    it('lowers tier when support systems present', async () => {
      const messages = [
        { role: 'user', content: "I'm struggling but my family supports me" },
        { role: 'user', content: "I'm seeing my therapist next week" },
      ];
      const result = await classifySafety(messages, 'US', 'en');
      expect(result.tier).toBe(SafetyTier.NORMAL);
    });
  });

  describe('Country-specific resources', () => {
    it('returns Russian crisis line for RU users', async () => {
      const resources = await getCrisisResources('RU', 'ru');
      expect(resources.some(r => r.phone === '8-800-2000-122')).toBe(true);
    });

    it('returns 988 for US users', async () => {
      const resources = await getCrisisResources('US', 'en');
      expect(resources.some(r => r.phone === '988')).toBe(true);
    });
  });
});
```

### Test Coverage Targets

| Area | Target | Rationale |
|------|--------|-----------|
| Safety classifier | 95%+ | Critical for user safety |
| Auth flow | 90%+ | Security-sensitive |
| Chat flow | 85%+ | Core feature |
| UI components | 80%+ | Regression prevention |
| i18n | 90%+ | Key coverage |
| Overall | 80%+ | Minimum viable |

---

## 8. Parallelization Map

### Independent Workstreams (Can Run in Parallel)

```
┌─────────────────────────────────────────────────────────────────┐
│                    PARALLEL WORKSTREAMS                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  STREAM A: UI Package          STREAM B: Backend Schema         │
│  ─────────────────────         ────────────────────────         │
│  • Design tokens               • Database migrations            │
│  • Shared components           • Seed data                      │
│  • Theme system                • RLS policies                   │
│                                • Edge Function stubs            │
│                                                                 │
│  STREAM C: i18n                STREAM D: Schemas                │
│  ─────────────                 ───────────────                  │
│  • EN translations             • Zod validation schemas         │
│  • RU translations             • TypeScript types                │
│  • i18next setup               • AI contract types              │
│                                                                 │
│  STREAM E: App Shell           STREAM F: Admin Scaffold         │
│  ───────────────────           ──────────────────               │
│  • Expo Router setup           • Next.js init                   │
│  • Navigation structure        • Basic layout                   │
│  • Theme provider              • Auth integration               │
│  • QueryClient setup                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Phase Dependencies

```
Phase 0 (Foundation)
    │
    ├──► Phase 1 (Infrastructure)
    │       │
    │       ├──► Phase 2 (Chat Core)        ◄── depends on Phase 1
    │       │       │
    │       │       └──► Phase 5 (Safety)   ◄── depends on Phase 2
    │       │
    │       └──► Phase 3 (Self-Help)        ◄── depends on Phase 1
    │               │
    │               └──► Phase 4 (Memory)   ◄── depends on Phase 3
    │
    └──► Phase 6 (Polish)                   ◄── depends on all above
```

### Sub-Agent Assignment

| Agent | Scope | Estimated Time |
|-------|-------|----------------|
| Agent-1 | packages/ui: tokens + shared components | 3-4 days |
| Agent-2 | supabase: migrations + seed data + Edge Functions | 3-4 days |
| Agent-3 | packages/i18n: EN + RU translations | 2-3 days |
| Agent-4 | packages/schemas + packages/ai-contracts | 2 days |
| Agent-5 | apps/mobile: navigation + theme + auth | 4-5 days |
| Agent-6 | apps/mobile: chat UI + hooks | 4-5 days |
| Agent-7 | apps/mobile: techniques + check-in + progress | 4-5 days |
| Agent-8 | supabase/functions: safety classifier | 3-4 days |
| Agent-9 | apps/mobile: settings + API key management | 2-3 days |
| Agent-10 | apps/mobile: calm room + habits | 3-4 days |
| Agent-11 | Testing: unit + integration | 3-4 days |
| Agent-12 | E2E tests + accessibility audit | 3-4 days |

### What Can Be Parallelized Right Now

**Immediate parallel tasks (no dependencies):**

1. **packages/ui/src/tokens/** — Design tokens (colors, spacing, typography)
2. **packages/i18n/** — Translation files (EN + RU)
3. **packages/schemas/** — Zod schemas for all entities
4. **packages/ai-contracts/** — AI request/response types
5. **supabase/migrations/00001_initial.sql** — Database schema
6. **supabase/seed/** — Techniques + crisis resources
7. **apps/mobile/app.json** — Expo config
8. **apps/mobile/src/theme/** — Theme system

---

## Appendix: File Count Estimate

| Directory | Files | Purpose |
|-----------|-------|---------|
| apps/mobile/app/ | ~30 | Expo Router pages |
| apps/mobile/src/components/ | ~50 | UI components |
| apps/mobile/src/hooks/ | ~15 | Custom hooks |
| apps/mobile/src/stores/ | ~8 | Zustand stores |
| apps/mobile/src/services/ | ~10 | API clients |
| packages/ui/src/ | ~25 | Shared components + tokens |
| packages/i18n/src/ | 3 | i18n setup + 2 translation files |
| packages/schemas/src/ | ~8 | Zod schemas |
| packages/ai-contracts/src/ | 4 | AI types |
| supabase/migrations/ | ~5 | SQL migrations |
| supabase/functions/ | ~8 | Edge Functions |
| supabase/seed/ | ~3 | Seed data |
| **Total** | **~170** | |

---

## Appendix: Environment Variables

```env
# .env.example
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Server-side only (in Supabase Edge Function secrets)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
API_KEY_ENCRYPTION_SECRET=your-256-bit-secret

# Optional: Sentry for crash reporting
SENTRY_DSN=https://your-sentry-dsn
```

---

## Appendix: Package Dependencies

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-localization": "~16.0.0",
    "expo-sqlite": "~14.0.0",
    "expo-haptics": "~14.0.0",
    "expo-av": "~15.0.0",
    "@react-navigation/native": "^7.0.0",
    "@supabase/supabase-js": "^2.45.0",
    "@tanstack/react-query": "^5.50.0",
    "zustand": "^4.5.0",
    "i18next": "^23.12.0",
    "react-i18next": "^15.0.0",
    "react-native-reanimated": "~3.10.0",
    "react-native-gesture-handler": "~2.18.0",
    "react-native-svg": "^15.0.0",
    "zod": "^3.23.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/react": "^18.3.0",
    "jest": "^29.7.0",
    "@testing-library/react-native": "^12.4.0",
    "detox": "^20.25.0"
  }
}
```
