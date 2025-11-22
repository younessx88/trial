export interface Message {
  id: string;
  text: string;
  timestamp: number;
  isFromUser: boolean;
  platform: Platform;
  conversationId: string;
  contactName?: string;
}

export interface Conversation {
  id: string;
  platform: Platform;
  contactName: string;
  messages: Message[];
  lastMessageTime: number;
  isActive: boolean;
}

export type Platform = 'whatsapp' | 'instagram' | 'tinder' | 'bumble' | 'hinge';

export interface UserStyle {
  vocabularyFrequency: Record<string, number>;
  commonPhrases: string[];
  emojiUsage: Record<string, number>;
  averageMessageLength: number;
  messageTimePattern: number[]; // Hours of day when user typically messages
  toneIndicators: {
    casual: number;
    formal: number;
    flirty: number;
    friendly: number;
    humorous: number;
  };
}

export interface AIResponse {
  options: ResponseOption[];
  confidence: number;
  context: string;
}

export interface ResponseOption {
  text: string;
  tone: 'casual' | 'flirty' | 'friendly' | 'humorous' | 'thoughtful';
  confidence: number;
  reasoning?: string;
}

export interface Settings {
  apiKey?: string;
  autoReplyEnabled: boolean;
  autoReplyRequiresApproval: boolean;
  suggestionsCount: number;
  preferredTone: 'casual' | 'flirty' | 'friendly' | 'balanced';
  enabledPlatforms: Platform[];
  messageHistoryLimit: number;
  useLocalModel: boolean;
}

export interface UsageStats {
  totalSuggestions: number;
  suggestionsUsed: number;
  conversationsManaged: number;
  lastResetDate: number;
  isPro: boolean;
}

export interface StorageData {
  conversations: Record<string, Conversation>;
  userStyle: UserStyle;
  settings: Settings;
  usageStats: UsageStats;
}

export interface MessageContext {
  recentMessages: Message[];
  conversationStage: 'opening' | 'getting_to_know' | 'flirting' | 'planning' | 'ongoing';
  topicsDiscussed: string[];
  lastUserMessageTime: number;
  responseTimeAverage: number;
}
