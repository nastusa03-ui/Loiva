import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().min(1).max(100),
  avatarUrl: z.string().url().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const OnboardingSchema = z.object({
  ageVerified: z.boolean(),
  language: z.enum(['en', 'ru']),
  country: z.string().min(2).max(3),
  disclosureAccepted: z.boolean(),
  privacySettings: z.object({
    historyEnabled: z.boolean(),
    memoryEnabled: z.boolean(),
    analyticsEnabled: z.boolean(),
    notificationsEnabled: z.boolean(),
  }),
  communicationPreferences: z.object({
    responseLength: z.enum(['concise', 'balanced', 'detailed']),
    tone: z.enum(['warm', 'neutral', 'professional']),
    askQuestions: z.boolean(),
  }),
  completedAt: z.string().datetime().optional(),
});

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  createdAt: z.string().datetime(),
  mode: z.enum(['general', 'crisis', 'technique', 'reflection']).optional(),
});

export type User = z.infer<typeof UserSchema>;
export type Onboarding = z.infer<typeof OnboardingSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
