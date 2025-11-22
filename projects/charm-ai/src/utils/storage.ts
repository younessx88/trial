import { StorageData, Conversation, Message, UserStyle, Settings, UsageStats } from '../types';

const DEFAULT_SETTINGS: Settings = {
  autoReplyEnabled: false,
  autoReplyRequiresApproval: true,
  suggestionsCount: 3,
  preferredTone: 'balanced',
  enabledPlatforms: ['whatsapp', 'instagram'],
  messageHistoryLimit: 100,
  useLocalModel: false,
};

const DEFAULT_USAGE_STATS: UsageStats = {
  totalSuggestions: 0,
  suggestionsUsed: 0,
  conversationsManaged: 0,
  lastResetDate: Date.now(),
  isPro: false,
};

const DEFAULT_USER_STYLE: UserStyle = {
  vocabularyFrequency: {},
  commonPhrases: [],
  emojiUsage: {},
  averageMessageLength: 50,
  messageTimePattern: [],
  toneIndicators: {
    casual: 0.5,
    formal: 0.1,
    flirty: 0.3,
    friendly: 0.7,
    humorous: 0.4,
  },
};

export class Storage {
  static async get<K extends keyof StorageData>(key: K): Promise<StorageData[K] | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([key], (result) => {
        if (chrome.runtime.lastError) {
          console.error('Storage get error:', chrome.runtime.lastError);
          resolve(null);
          return;
        }
        resolve((result[key] as StorageData[K]) || null);
      });
    });
  }

  static async set<K extends keyof StorageData>(key: K, value: StorageData[K]): Promise<void> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.set({ [key]: value }, () => {
        if (chrome.runtime.lastError) {
          console.error('Storage set error:', chrome.runtime.lastError);
          reject(chrome.runtime.lastError);
          return;
        }
        resolve();
      });
    });
  }

  static async getSettings(): Promise<Settings> {
    const settings = await this.get('settings');
    return settings || DEFAULT_SETTINGS;
  }

  static async updateSettings(updates: Partial<Settings>): Promise<void> {
    const current = await this.getSettings();
    await this.set('settings', { ...current, ...updates });
  }

  static async getUserStyle(): Promise<UserStyle> {
    const style = await this.get('userStyle');
    return style || DEFAULT_USER_STYLE;
  }

  static async updateUserStyle(updates: Partial<UserStyle>): Promise<void> {
    const current = await this.getUserStyle();
    await this.set('userStyle', { ...current, ...updates });
  }

  static async getConversations(): Promise<Record<string, Conversation>> {
    const conversations = await this.get('conversations');
    return conversations || {};
  }

  static async getConversation(id: string): Promise<Conversation | null> {
    const conversations = await this.getConversations();
    return conversations[id] || null;
  }

  static async saveConversation(conversation: Conversation): Promise<void> {
    const conversations = await this.getConversations();
    conversations[conversation.id] = conversation;
    await this.set('conversations', conversations);
  }

  static async addMessage(conversationId: string, message: Message): Promise<void> {
    const conversation = await this.getConversation(conversationId);
    if (!conversation) {
      console.error('Conversation not found:', conversationId);
      return;
    }

    conversation.messages.push(message);
    conversation.lastMessageTime = message.timestamp;

    // Limit message history
    const settings = await this.getSettings();
    if (conversation.messages.length > settings.messageHistoryLimit) {
      conversation.messages = conversation.messages.slice(-settings.messageHistoryLimit);
    }

    await this.saveConversation(conversation);
  }

  static async getUsageStats(): Promise<UsageStats> {
    const stats = await this.get('usageStats');
    return stats || DEFAULT_USAGE_STATS;
  }

  static async incrementUsage(type: 'suggestions' | 'used' | 'conversations'): Promise<void> {
    const stats = await this.getUsageStats();

    switch (type) {
      case 'suggestions':
        stats.totalSuggestions++;
        break;
      case 'used':
        stats.suggestionsUsed++;
        break;
      case 'conversations':
        stats.conversationsManaged++;
        break;
    }

    await this.set('usageStats', stats);
  }

  static async checkUsageLimit(): Promise<{ allowed: boolean; remaining: number }> {
    const stats = await this.getUsageStats();
    const FREE_TIER_LIMIT = 50;

    if (stats.isPro) {
      return { allowed: true, remaining: Infinity };
    }

    const remaining = FREE_TIER_LIMIT - stats.totalSuggestions;
    return {
      allowed: remaining > 0,
      remaining: Math.max(0, remaining),
    };
  }
}
