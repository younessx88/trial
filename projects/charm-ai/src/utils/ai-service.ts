import OpenAI from 'openai';
import { AIResponse, MessageContext, UserStyle, ResponseOption, Settings } from '../types';
import { Storage } from './storage';

export class AIService {
  private static openai: OpenAI | null = null;

  static async initialize(): Promise<void> {
    const settings = await Storage.getSettings();
    if (settings.apiKey) {
      this.openai = new OpenAI({
        apiKey: settings.apiKey,
        dangerouslyAllowBrowser: true, // Note: In production, use a backend proxy
      });
    }
  }

  static async generateResponses(
    incomingMessage: string,
    context: MessageContext,
    userStyle: UserStyle
  ): Promise<AIResponse> {
    // Check usage limits
    const usage = await Storage.checkUsageLimit();
    if (!usage.allowed) {
      throw new Error('Usage limit reached. Please upgrade to Pro for unlimited suggestions.');
    }

    // Initialize OpenAI if not already done
    if (!this.openai) {
      await this.initialize();
    }

    if (!this.openai) {
      throw new Error('OpenAI API key not configured. Please add it in settings.');
    }

    const settings = await Storage.getSettings();
    const prompt = this.buildPrompt(incomingMessage, context, userStyle, settings);

    try {
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: this.getSystemPrompt(userStyle, settings),
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 500,
        n: settings.suggestionsCount,
      });

      const options: ResponseOption[] = completion.choices.map((choice, index) => {
        const text = choice.message.content?.trim() || '';
        return {
          text,
          tone: this.detectTone(text, userStyle),
          confidence: 0.85 - index * 0.1, // Decrease confidence for lower-ranked options
        };
      });

      // Increment usage
      await Storage.incrementUsage('suggestions');

      return {
        options,
        confidence: 0.85,
        context: context.conversationStage,
      };
    } catch (error) {
      console.error('OpenAI API error:', error);
      throw new Error('Failed to generate responses. Please check your API key.');
    }
  }

  private static getSystemPrompt(userStyle: UserStyle, settings: Settings): string {
    const toneDescription = this.describeTone(userStyle);
    const emojiUsage = Object.keys(userStyle.emojiUsage).slice(0, 5).join(', ') || 'minimal emojis';

    return `You are a dating conversation assistant that mimics the user's messaging style.

User's Communication Style:
- Average message length: ${userStyle.averageMessageLength} characters
- Tone: ${toneDescription}
- Common emojis: ${emojiUsage}
- Personality: ${this.describePersonality(userStyle)}

Guidelines:
1. Match the user's writing style, tone, and message length
2. Use similar vocabulary and phrases as the user typically does
3. Include emojis in the same frequency and style as the user
4. Be authentic and genuine - this is for real human connection
5. Avoid being overly formal or robotic
6. Preferred tone: ${settings.preferredTone}

Generate ${settings.suggestionsCount} response options that sound like the user wrote them.
Each response should feel natural and maintain the conversation flow.`;
  }

  private static buildPrompt(
    incomingMessage: string,
    context: MessageContext,
    userStyle: UserStyle,
    settings: Settings
  ): string {
    const recentHistory = context.recentMessages
      .slice(-3)
      .map((m) => `${m.isFromUser ? 'You' : 'Them'}: ${m.text}`)
      .join('\n');

    return `Conversation context:
${recentHistory}

They just sent: "${incomingMessage}"

Conversation stage: ${context.conversationStage}
Topics discussed: ${context.topicsDiscussed.join(', ') || 'Just getting started'}

Generate ${settings.suggestionsCount} different responses in the user's style. Each response should:
1. Match their tone (${settings.preferredTone})
2. Be appropriate for the ${context.conversationStage} stage
3. Keep the conversation engaging and flowing naturally
4. Be around ${userStyle.averageMessageLength} characters

Format: Provide only the response text, one per line.`;
  }

  private static describeTone(style: UserStyle): string {
    const { toneIndicators } = style;
    const tones = Object.entries(toneIndicators)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([tone]) => tone);
    return tones.join(', ');
  }

  private static describePersonality(style: UserStyle): string {
    const { toneIndicators } = style;

    if (toneIndicators.flirty > 0.6) return 'Flirty and playful';
    if (toneIndicators.humorous > 0.6) return 'Funny and witty';
    if (toneIndicators.friendly > 0.7) return 'Warm and friendly';
    if (toneIndicators.casual > 0.7) return 'Relaxed and casual';
    return 'Balanced and authentic';
  }

  private static detectTone(
    text: string,
    userStyle: UserStyle
  ): 'casual' | 'flirty' | 'friendly' | 'humorous' | 'thoughtful' {
    const lowerText = text.toLowerCase();

    // Simple heuristics for tone detection
    if (lowerText.includes('😏') || lowerText.includes('😉')) return 'flirty';
    if (lowerText.includes('haha') || lowerText.includes('😂')) return 'humorous';
    if (lowerText.includes('?') && !lowerText.includes('😏')) return 'thoughtful';
    if (userStyle.toneIndicators.friendly > 0.7) return 'friendly';

    return 'casual';
  }

  static async analyzeMessageStyle(messages: string[]): Promise<Partial<UserStyle>> {
    if (messages.length === 0) return {};

    const totalLength = messages.reduce((sum, msg) => sum + msg.length, 0);
    const averageMessageLength = Math.round(totalLength / messages.length);

    // Emoji analysis
    const emojiUsage: Record<string, number> = {};
    const emojiRegex = /[\p{Emoji}]/gu;
    messages.forEach((msg) => {
      const emojis = msg.match(emojiRegex) || [];
      emojis.forEach((emoji) => {
        emojiUsage[emoji] = (emojiUsage[emoji] || 0) + 1;
      });
    });

    // Vocabulary frequency
    const vocabularyFrequency: Record<string, number> = {};
    messages.forEach((msg) => {
      const words = msg.toLowerCase().split(/\s+/);
      words.forEach((word) => {
        if (word.length > 3) {
          vocabularyFrequency[word] = (vocabularyFrequency[word] || 0) + 1;
        }
      });
    });

    // Simple tone analysis
    const toneIndicators = {
      casual: this.calculateCasualScore(messages),
      formal: this.calculateFormalScore(messages),
      flirty: this.calculateFlirtyScore(messages),
      friendly: this.calculateFriendlyScore(messages),
      humorous: this.calculateHumorousScore(messages),
    };

    return {
      vocabularyFrequency,
      emojiUsage,
      averageMessageLength,
      toneIndicators,
    };
  }

  private static calculateCasualScore(messages: string[]): number {
    const casualIndicators = ['lol', 'yeah', 'cool', 'nice', 'nah', 'gonna', 'wanna'];
    let score = 0;
    messages.forEach((msg) => {
      const lower = msg.toLowerCase();
      casualIndicators.forEach((indicator) => {
        if (lower.includes(indicator)) score += 0.1;
      });
    });
    return Math.min(1, score / messages.length);
  }

  private static calculateFormalScore(messages: string[]): number {
    const formalIndicators = ['however', 'therefore', 'additionally', 'furthermore'];
    let score = 0;
    messages.forEach((msg) => {
      const lower = msg.toLowerCase();
      formalIndicators.forEach((indicator) => {
        if (lower.includes(indicator)) score += 0.2;
      });
    });
    return Math.min(1, score / messages.length);
  }

  private static calculateFlirtyScore(messages: string[]): number {
    const flirtyIndicators = ['😏', '😉', '😘', 'cute', 'handsome', 'beautiful', 'hot'];
    let score = 0;
    messages.forEach((msg) => {
      const lower = msg.toLowerCase();
      flirtyIndicators.forEach((indicator) => {
        if (lower.includes(indicator)) score += 0.15;
      });
    });
    return Math.min(1, score / messages.length);
  }

  private static calculateFriendlyScore(messages: string[]): number {
    const friendlyIndicators = ['😊', '😄', '!', 'thanks', 'appreciate', 'hope'];
    let score = 0.5; // Base friendly score
    messages.forEach((msg) => {
      const lower = msg.toLowerCase();
      friendlyIndicators.forEach((indicator) => {
        if (lower.includes(indicator)) score += 0.05;
      });
    });
    return Math.min(1, score / messages.length);
  }

  private static calculateHumorousScore(messages: string[]): number {
    const humorIndicators = ['haha', 'lmao', 'lol', '😂', '🤣', '😆'];
    let score = 0;
    messages.forEach((msg) => {
      const lower = msg.toLowerCase();
      humorIndicators.forEach((indicator) => {
        if (lower.includes(indicator)) score += 0.1;
      });
    });
    return Math.min(1, score / messages.length);
  }
}
