import { Conversation, Message } from '../types';
import { Storage } from './storage';

export interface ConversationAnalytics {
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
  messagesPerConversation: number;
  averageResponseTime: number; // in minutes
  responseRate: number; // percentage
  engagementScore: number; // 0-100
  topEmojis: { emoji: string; count: number }[];
  topWords: { word: string; count: number }[];
  conversationStages: {
    opening: number;
    ongoing: number;
    planning: number;
    ghosted: number;
  };
  successMetrics: {
    numbersExchanged: number;
    datesPlanned: number;
    videoCallsScheduled: number;
  };
}

export interface ConversationInsight {
  conversationId: string;
  contactName: string;
  messageCount: number;
  lastMessageTime: number;
  engagementLevel: 'high' | 'medium' | 'low';
  stage: 'opening' | 'getting_to_know' | 'flirting' | 'planning' | 'ongoing';
  redFlags: string[];
  positiveSignals: string[];
  nextActionSuggestion: string;
  estimatedInterestLevel: number; // 0-100
}

export class AnalyticsService {
  /**
   * Analyze all conversations and return overall analytics
   */
  static async getOverallAnalytics(): Promise<ConversationAnalytics> {
    const conversations = await Storage.getConversations();
    const convArray = Object.values(conversations);

    const totalMessages = convArray.reduce(
      (sum, conv) => sum + conv.messages.length,
      0
    );

    const activeConvs = convArray.filter(conv => {
      const daysSinceLastMessage =
        (Date.now() - conv.lastMessageTime) / (1000 * 60 * 60 * 24);
      return daysSinceLastMessage < 7; // Active in last week
    });

    // Emoji analysis
    const emojiMap: Record<string, number> = {};
    const wordMap: Record<string, number> = {};

    convArray.forEach(conv => {
      conv.messages.forEach(msg => {
        // Extract emojis
        const emojiRegex = /[\p{Emoji}]/gu;
        const emojis = msg.text.match(emojiRegex) || [];
        emojis.forEach(emoji => {
          emojiMap[emoji] = (emojiMap[emoji] || 0) + 1;
        });

        // Extract words
        const words = msg.text
          .toLowerCase()
          .split(/\s+/)
          .filter(w => w.length > 3);
        words.forEach(word => {
          wordMap[word] = (wordMap[word] || 0) + 1;
        });
      });
    });

    const topEmojis = Object.entries(emojiMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([emoji, count]) => ({ emoji, count }));

    const topWords = Object.entries(wordMap)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));

    // Calculate response rate
    const responseCounts = convArray.map(conv => {
      let responses = 0;
      for (let i = 0; i < conv.messages.length - 1; i++) {
        if (!conv.messages[i].isFromUser && conv.messages[i + 1].isFromUser) {
          responses++;
        }
      }
      return responses;
    });
    const totalResponses = responseCounts.reduce((sum, r) => sum + r, 0);
    const responseRate = totalMessages > 0 ? (totalResponses / totalMessages) * 100 : 0;

    // Engagement score (simplified)
    const engagementScore = Math.min(
      100,
      (activeConvs.length / Math.max(convArray.length, 1)) * 50 +
        responseRate * 0.5
    );

    return {
      totalConversations: convArray.length,
      activeConversations: activeConvs.length,
      totalMessages,
      messagesPerConversation: totalMessages / Math.max(convArray.length, 1),
      averageResponseTime: 15, // TODO: Calculate actual
      responseRate,
      engagementScore: Math.round(engagementScore),
      topEmojis,
      topWords,
      conversationStages: {
        opening: convArray.filter(c => c.messages.length < 5).length,
        ongoing: convArray.filter(c => c.messages.length >= 5 && c.messages.length < 20).length,
        planning: convArray.filter(c => this.hasDatePlanningSignals(c)).length,
        ghosted: convArray.filter(c => {
          const daysSince = (Date.now() - c.lastMessageTime) / (1000 * 60 * 60 * 24);
          return daysSince > 7;
        }).length,
      },
      successMetrics: {
        numbersExchanged: this.countPhoneNumberExchanges(convArray),
        datesPlanned: convArray.filter(c => this.hasDatePlanningSignals(c)).length,
        videoCallsScheduled: 0, // TODO: Detect video call keywords
      },
    };
  }

  /**
   * Get detailed insights for a specific conversation
   */
  static async getConversationInsight(conversationId: string): Promise<ConversationInsight | null> {
    const conversation = await Storage.getConversation(conversationId);
    if (!conversation) return null;

    const messageCount = conversation.messages.length;
    const engagementLevel = this.calculateEngagementLevel(conversation);
    const stage = this.detectConversationStage(conversation);
    const redFlags = this.detectRedFlags(conversation);
    const positiveSignals = this.detectPositiveSignals(conversation);
    const nextActionSuggestion = this.suggestNextAction(conversation);
    const estimatedInterestLevel = this.estimateInterestLevel(conversation);

    return {
      conversationId: conversation.id,
      contactName: conversation.contactName,
      messageCount,
      lastMessageTime: conversation.lastMessageTime,
      engagementLevel,
      stage,
      redFlags,
      positiveSignals,
      nextActionSuggestion,
      estimatedInterestLevel,
    };
  }

  /**
   * Get insights for all active conversations
   */
  static async getAllConversationInsights(): Promise<ConversationInsight[]> {
    const conversations = await Storage.getConversations();
    const insights: ConversationInsight[] = [];

    for (const conv of Object.values(conversations)) {
      const insight = await this.getConversationInsight(conv.id);
      if (insight) insights.push(insight);
    }

    return insights.sort((a, b) => b.estimatedInterestLevel - a.estimatedInterestLevel);
  }

  // Helper methods

  private static calculateEngagementLevel(conv: Conversation): 'high' | 'medium' | 'low' {
    const hoursSinceLastMessage = (Date.now() - conv.lastMessageTime) / (1000 * 60 * 60);
    const avgMessageLength =
      conv.messages.reduce((sum, m) => sum + m.text.length, 0) / conv.messages.length;

    if (hoursSinceLastMessage < 6 && avgMessageLength > 50) return 'high';
    if (hoursSinceLastMessage < 24 && avgMessageLength > 20) return 'medium';
    return 'low';
  }

  private static detectConversationStage(
    conv: Conversation
  ): 'opening' | 'getting_to_know' | 'flirting' | 'planning' | 'ongoing' {
    const messageCount = conv.messages.length;

    if (messageCount < 5) return 'opening';
    if (this.hasDatePlanningSignals(conv)) return 'planning';
    if (this.hasFlirtySignals(conv)) return 'flirting';
    if (messageCount < 20) return 'getting_to_know';
    return 'ongoing';
  }

  private static detectRedFlags(conv: Conversation): string[] {
    const flags: string[] = [];
    const recentMessages = conv.messages.slice(-10);

    // One-word responses
    const oneWordCount = recentMessages.filter(m => !m.isFromUser && m.text.split(/\s+/).length === 1).length;
    if (oneWordCount > 3) {
      flags.push('Giving one-word responses frequently');
    }

    // Long time since last response
    const hoursSince = (Date.now() - conv.lastMessageTime) / (1000 * 60 * 60);
    if (hoursSince > 48) {
      flags.push('No response in over 2 days');
    }

    // Low engagement
    const avgLength =
      recentMessages
        .filter(m => !m.isFromUser)
        .reduce((sum, m) => sum + m.text.length, 0) /
      Math.max(recentMessages.filter(m => !m.isFromUser).length, 1);
    if (avgLength < 15) {
      flags.push('Very short messages - low interest?');
    }

    return flags;
  }

  private static detectPositiveSignals(conv: Conversation): string[] {
    const signals: string[] = [];
    const recentMessages = conv.messages.slice(-10);
    const allText = conv.messages.map(m => m.text.toLowerCase()).join(' ');

    // Questions asked by them
    const theirQuestions = recentMessages.filter(
      m => !m.isFromUser && m.text.includes('?')
    ).length;
    if (theirQuestions > 2) {
      signals.push('Asking lots of questions about you');
    }

    // Emoji usage
    const emojiCount = (allText.match(/[\p{Emoji}]/gu) || []).length;
    if (emojiCount > 5) {
      signals.push('Using emojis - engaged in conversation');
    }

    // Compliments
    const complimentWords = ['cute', 'handsome', 'beautiful', 'attractive', 'like', 'love'];
    if (complimentWords.some(word => allText.includes(word))) {
      signals.push('Giving compliments - showing interest');
    }

    // Shared interests
    const interestWords = ['me too', 'same', 'also', 'i love'];
    if (interestWords.some(phrase => allText.includes(phrase))) {
      signals.push('Finding common ground');
    }

    return signals;
  }

  private static suggestNextAction(conv: Conversation): string {
    const stage = this.detectConversationStage(conv);
    const hoursSince = (Date.now() - conv.lastMessageTime) / (1000 * 60 * 60);

    if (hoursSince > 48) {
      return 'Send a re-engagement message to revive the conversation';
    }

    switch (stage) {
      case 'opening':
        return 'Ask an engaging question to learn more about them';
      case 'getting_to_know':
        return 'Share something interesting about yourself';
      case 'flirting':
        return 'Consider suggesting a casual meetup';
      case 'planning':
        return 'Confirm the date details and exchange numbers';
      case 'ongoing':
        return 'Keep the conversation flowing with open-ended questions';
    }
  }

  private static estimateInterestLevel(conv: Conversation): number {
    let score = 50; // Start at neutral

    // Response rate
    const theirMessages = conv.messages.filter(m => !m.isFromUser);
    const yourMessages = conv.messages.filter(m => m.isFromUser);
    if (theirMessages.length >= yourMessages.length) score += 15;

    // Message length
    const avgLength =
      theirMessages.reduce((sum, m) => sum + m.text.length, 0) /
      Math.max(theirMessages.length, 1);
    if (avgLength > 50) score += 10;

    // Questions
    const questions = theirMessages.filter(m => m.text.includes('?')).length;
    score += questions * 5;

    // Emojis
    const allText = theirMessages.map(m => m.text).join(' ');
    const emojiCount = (allText.match(/[\p{Emoji}]/gu) || []).length;
    score += Math.min(emojiCount * 2, 10);

    // Time since last message (negative)
    const hoursSince = (Date.now() - conv.lastMessageTime) / (1000 * 60 * 60);
    if (hoursSince > 24) score -= 10;
    if (hoursSince > 48) score -= 20;

    return Math.max(0, Math.min(100, score));
  }

  private static hasDatePlanningSignals(conv: Conversation): boolean {
    const allText = conv.messages.map(m => m.text.toLowerCase()).join(' ');
    const dateKeywords = [
      'coffee',
      'drinks',
      'dinner',
      'lunch',
      'meet',
      'hang out',
      'date',
      'this weekend',
      'tomorrow',
      'friday',
      'saturday',
    ];
    return dateKeywords.some(keyword => allText.includes(keyword));
  }

  private static hasFlirtySignals(conv: Conversation): boolean {
    const allText = conv.messages.map(m => m.text.toLowerCase()).join(' ');
    const flirtyKeywords = ['cute', 'handsome', 'beautiful', '😏', '😉', '😘', 'like you'];
    return flirtyKeywords.some(keyword => allText.includes(keyword));
  }

  private static countPhoneNumberExchanges(conversations: Conversation[]): number {
    let count = 0;
    const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/;

    conversations.forEach(conv => {
      if (conv.messages.some(m => phoneRegex.test(m.text))) {
        count++;
      }
    });

    return count;
  }
}
