import { Message, MessageContext, Conversation } from '../types';
import { Storage } from '../utils/storage';
import { AIService } from '../utils/ai-service';

class WhatsAppAssistant {
  private assistantButton: HTMLElement | null = null;
  private suggestionPanel: HTMLElement | null = null;
  private currentConversationId: string | null = null;
  private observer: MutationObserver | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    console.log('Charm AI: Initializing WhatsApp Assistant');

    // Wait for WhatsApp Web to load
    await this.waitForWhatsAppLoad();

    // Create and inject the assistant button
    this.injectAssistantButton();

    // Start observing for conversation changes
    this.observeConversationChanges();

    // Capture messages
    this.observeMessages();

    console.log('Charm AI: WhatsApp Assistant ready');
  }

  private async waitForWhatsAppLoad(): Promise<void> {
    return new Promise((resolve) => {
      const checkLoad = setInterval(() => {
        const chatArea = document.querySelector('[data-tab="2"]') ||
                         document.querySelector('[data-testid="conversation-panel-wrapper"]');
        if (chatArea) {
          clearInterval(checkLoad);
          setTimeout(resolve, 1000); // Wait a bit more for stability
        }
      }, 500);
    });
  }

  private injectAssistantButton() {
    // Find the message input area
    const footerSelector = 'footer[data-testid="conversation-compose-box-wrapper"]';
    const footer = document.querySelector(footerSelector);

    if (!footer) {
      console.log('Charm AI: Footer not found, retrying...');
      setTimeout(() => this.injectAssistantButton(), 1000);
      return;
    }

    // Create floating button
    this.assistantButton = document.createElement('div');
    this.assistantButton.id = 'charm-ai-button';
    this.assistantButton.innerHTML = `
      <div class="charm-ai-floating-btn">
        ✨ Charm AI
      </div>
    `;
    this.assistantButton.style.cssText = `
      position: fixed;
      bottom: 80px;
      right: 30px;
      z-index: 10000;
      cursor: pointer;
    `;

    // Style the button
    const style = document.createElement('style');
    style.textContent = `
      .charm-ai-floating-btn {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 25px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        font-weight: 600;
        font-size: 14px;
        transition: all 0.3s ease;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .charm-ai-floating-btn:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
      }

      .charm-ai-panel {
        position: fixed;
        bottom: 140px;
        right: 30px;
        width: 400px;
        max-height: 500px;
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
        z-index: 10001;
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      }

      .charm-ai-header {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 16px 20px;
        font-weight: 600;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .charm-ai-close {
        cursor: pointer;
        font-size: 20px;
        line-height: 1;
      }

      .charm-ai-content {
        padding: 16px;
        max-height: 420px;
        overflow-y: auto;
      }

      .charm-ai-loading {
        text-align: center;
        padding: 32px;
        color: #888;
      }

      .charm-ai-response-option {
        background: #f5f7fa;
        border: 2px solid #e2e8f0;
        border-radius: 12px;
        padding: 12px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s ease;
      }

      .charm-ai-response-option:hover {
        border-color: #667eea;
        background: #eef2ff;
      }

      .charm-ai-response-text {
        font-size: 14px;
        line-height: 1.5;
        color: #1a202c;
        margin-bottom: 8px;
      }

      .charm-ai-response-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 12px;
        color: #718096;
      }

      .charm-ai-tone {
        background: #667eea;
        color: white;
        padding: 2px 8px;
        border-radius: 4px;
        font-weight: 500;
      }

      .charm-ai-actions {
        display: flex;
        gap: 8px;
        margin-top: 16px;
        padding-top: 16px;
        border-top: 1px solid #e2e8f0;
      }

      .charm-ai-btn {
        flex: 1;
        padding: 10px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s ease;
      }

      .charm-ai-btn-primary {
        background: #667eea;
        color: white;
      }

      .charm-ai-btn-primary:hover {
        background: #5568d3;
      }

      .charm-ai-btn-secondary {
        background: #e2e8f0;
        color: #4a5568;
      }

      .charm-ai-btn-secondary:hover {
        background: #cbd5e0;
      }

      .charm-ai-error {
        background: #fee;
        color: #c53030;
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 12px;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);

    this.assistantButton.addEventListener('click', () => this.toggleSuggestionPanel());
    document.body.appendChild(this.assistantButton);

    console.log('Charm AI: Assistant button injected');
  }

  private async toggleSuggestionPanel() {
    if (this.suggestionPanel) {
      this.suggestionPanel.remove();
      this.suggestionPanel = null;
      return;
    }

    await this.showSuggestionPanel();
  }

  private async showSuggestionPanel() {
    // Get the last received message
    const lastMessage = await this.getLastReceivedMessage();

    if (!lastMessage) {
      this.showError('No incoming message found. Wait for a message first!');
      return;
    }

    // Create suggestion panel
    this.suggestionPanel = document.createElement('div');
    this.suggestionPanel.className = 'charm-ai-panel';
    this.suggestionPanel.innerHTML = `
      <div class="charm-ai-header">
        <span>💬 AI Suggestions</span>
        <span class="charm-ai-close">×</span>
      </div>
      <div class="charm-ai-content">
        <div class="charm-ai-loading">
          <div>✨ Generating responses...</div>
          <div style="margin-top: 8px; font-size: 12px;">This may take a few seconds</div>
        </div>
      </div>
    `;

    document.body.appendChild(this.suggestionPanel);

    // Close button
    this.suggestionPanel.querySelector('.charm-ai-close')?.addEventListener('click', () => {
      this.suggestionPanel?.remove();
      this.suggestionPanel = null;
    });

    // Generate responses
    try {
      const responses = await this.generateResponses(lastMessage);
      this.renderSuggestions(responses.options);
    } catch (error) {
      this.showError(error instanceof Error ? error.message : 'Failed to generate responses');
    }
  }

  private async getLastReceivedMessage(): Promise<string | null> {
    // Get all message bubbles in the current conversation
    const messageBubbles = Array.from(
      document.querySelectorAll('div[data-testid="msg-container"]')
    );

    // Find the last incoming message (not sent by user)
    for (let i = messageBubbles.length - 1; i >= 0; i--) {
      const bubble = messageBubbles[i];
      const isOutgoing = bubble.querySelector('[data-testid="msg-container"] > div.message-out');

      if (!isOutgoing) {
        const textElement = bubble.querySelector('span.selectable-text');
        if (textElement) {
          return textElement.textContent || null;
        }
      }
    }

    return null;
  }

  private async generateResponses(incomingMessage: string) {
    const userStyle = await Storage.getUserStyle();

    // Get conversation context
    const context: MessageContext = {
      recentMessages: [],
      conversationStage: 'ongoing',
      topicsDiscussed: [],
      lastUserMessageTime: Date.now(),
      responseTimeAverage: 300000, // 5 minutes
    };

    return await AIService.generateResponses(incomingMessage, context, userStyle);
  }

  private renderSuggestions(options: Array<{ text: string; tone: string; confidence: number }>) {
    if (!this.suggestionPanel) return;

    const content = this.suggestionPanel.querySelector('.charm-ai-content');
    if (!content) return;

    const optionsHTML = options
      .map(
        (option, index) => `
      <div class="charm-ai-response-option" data-index="${index}">
        <div class="charm-ai-response-text">${this.escapeHTML(option.text)}</div>
        <div class="charm-ai-response-meta">
          <span class="charm-ai-tone">${option.tone}</span>
          <span>${Math.round(option.confidence * 100)}% match</span>
        </div>
      </div>
    `
      )
      .join('');

    content.innerHTML = `
      ${optionsHTML}
      <div class="charm-ai-actions">
        <button class="charm-ai-btn charm-ai-btn-secondary" id="charm-ai-regenerate">
          🔄 Generate More
        </button>
        <button class="charm-ai-btn charm-ai-btn-secondary" id="charm-ai-close-panel">
          Close
        </button>
      </div>
    `;

    // Add click handlers for options
    content.querySelectorAll('.charm-ai-response-option').forEach((option, index) => {
      option.addEventListener('click', () => {
        this.useResponse(options[index].text);
      });
    });

    // Regenerate button
    content.querySelector('#charm-ai-regenerate')?.addEventListener('click', async () => {
      const lastMessage = await this.getLastReceivedMessage();
      if (lastMessage) {
        content.innerHTML = '<div class="charm-ai-loading">✨ Generating new responses...</div>';
        const responses = await this.generateResponses(lastMessage);
        this.renderSuggestions(responses.options);
      }
    });

    // Close button
    content.querySelector('#charm-ai-close-panel')?.addEventListener('click', () => {
      this.suggestionPanel?.remove();
      this.suggestionPanel = null;
    });
  }

  private useResponse(text: string) {
    // Find the message input
    const inputSelector = 'div[contenteditable="true"][data-tab="10"]';
    const input = document.querySelector(inputSelector) as HTMLElement;

    if (input) {
      // Set the text
      input.focus();
      document.execCommand('selectAll', false);
      document.execCommand('insertText', false, text);

      // Track usage
      Storage.incrementUsage('used');

      // Close panel
      this.suggestionPanel?.remove();
      this.suggestionPanel = null;

      console.log('Charm AI: Response inserted');
    } else {
      this.showError('Could not find message input');
    }
  }

  private showError(message: string) {
    if (!this.suggestionPanel) {
      this.suggestionPanel = document.createElement('div');
      this.suggestionPanel.className = 'charm-ai-panel';
      this.suggestionPanel.innerHTML = `
        <div class="charm-ai-header">
          <span>💬 Charm AI</span>
          <span class="charm-ai-close">×</span>
        </div>
        <div class="charm-ai-content"></div>
      `;
      document.body.appendChild(this.suggestionPanel);

      this.suggestionPanel.querySelector('.charm-ai-close')?.addEventListener('click', () => {
        this.suggestionPanel?.remove();
        this.suggestionPanel = null;
      });
    }

    const content = this.suggestionPanel.querySelector('.charm-ai-content');
    if (content) {
      content.innerHTML = `
        <div class="charm-ai-error">⚠️ ${message}</div>
        <button class="charm-ai-btn charm-ai-btn-secondary" style="width: 100%" id="close-error">
          Close
        </button>
      `;

      content.querySelector('#close-error')?.addEventListener('click', () => {
        this.suggestionPanel?.remove();
        this.suggestionPanel = null;
      });
    }
  }

  private observeConversationChanges() {
    // Observe when user switches conversations
    const targetNode = document.querySelector('[data-testid="conversation-panel-wrapper"]');

    if (!targetNode) return;

    this.observer = new MutationObserver(() => {
      // Conversation changed, update current conversation ID
      this.currentConversationId = this.getCurrentConversationId();
    });

    this.observer.observe(targetNode, {
      childList: true,
      subtree: true,
    });
  }

  private getCurrentConversationId(): string {
    // Extract conversation ID from URL or contact name
    const contactName = document.querySelector('[data-testid="conversation-info-header-chat-title"]')?.textContent;
    return contactName || 'unknown';
  }

  private observeMessages() {
    // This would capture messages in real-time
    // For MVP, we'll rely on manual triggering via the button
    console.log('Charm AI: Message observation active');
  }

  private escapeHTML(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize the assistant when the page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new WhatsAppAssistant());
} else {
  new WhatsAppAssistant();
}
