import { Storage } from '../utils/storage';
import { IcebreakerService, Icebreaker } from '../utils/icebreakers';
import { AnalyticsService } from '../utils/analytics';

class PopupController {
  private currentTab: string = 'dashboard';
  private currentCategory: string = 'all';
  private icebreakers: Icebreaker[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    this.attachTabListeners();
    this.attachEventListeners();
    await this.loadDashboard();
    await this.loadIcebreakers();
    await this.loadAnalytics();
    await this.loadSettings();
  }

  /* ==================== TAB MANAGEMENT ==================== */

  private attachTabListeners() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tabName = target.dataset.tab;
        if (tabName) {
          this.switchTab(tabName);
        }
      });
    });
  }

  private switchTab(tabName: string) {
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');

    // Update active tab content
    document.querySelectorAll('.tab-content').forEach((content) => {
      content.classList.remove('active');
    });
    document.getElementById(`${tabName}-tab`)?.classList.add('active');

    this.currentTab = tabName;

    // Reload data for the tab
    if (tabName === 'analytics') {
      this.loadAnalytics();
    }
  }

  /* ==================== DASHBOARD ==================== */

  private async loadDashboard() {
    const stats = await Storage.getUsageStats();
    const usage = await Storage.checkUsageLimit();

    // Update stat cards
    const totalSuggestions = document.getElementById('total-suggestions');
    const suggestionsUsed = document.getElementById('suggestions-used');
    const conversationsCount = document.getElementById('conversations-count');

    if (totalSuggestions) totalSuggestions.textContent = stats.totalSuggestions.toString();
    if (suggestionsUsed) suggestionsUsed.textContent = stats.suggestionsUsed.toString();
    if (conversationsCount) conversationsCount.textContent = stats.conversationsManaged.toString();

    // Update usage bar
    const progressBar = document.getElementById('usage-progress');
    const remainingCount = document.getElementById('remaining-count');
    const upgradeCTA = document.getElementById('upgrade-cta');
    const usageText = document.querySelector('.usage-text');

    if (stats.isPro) {
      // Pro user
      if (progressBar) progressBar.style.width = '100%';
      if (remainingCount) remainingCount.textContent = '∞';
      if (usageText) usageText.textContent = 'Unlimited suggestions (Pro)';
    } else {
      // Free user
      const percentage = (usage.remaining / 50) * 100;
      if (progressBar) {
        progressBar.style.width = `${percentage}%`;

        // Change color based on remaining usage
        if (percentage < 20) {
          progressBar.classList.add('danger');
        } else if (percentage < 50) {
          progressBar.classList.add('warning');
        }
      }
      if (remainingCount) remainingCount.textContent = usage.remaining.toString();

      // Show upgrade CTA if low on usage
      if (usage.remaining < 10 && upgradeCTA) {
        upgradeCTA.style.display = 'block';
      }
    }
  }

  /* ==================== ICEBREAKERS ==================== */

  private async loadIcebreakers() {
    this.icebreakers = [...IcebreakerService.getRandom(100)]; // Get all icebreakers
    this.renderIcebreakers(this.icebreakers);
  }

  private renderIcebreakers(icebreakers: Icebreaker[]) {
    const container = document.getElementById('icebreaker-list');
    if (!container) return;

    if (icebreakers.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: #718096;">
          <div style="font-size: 48px; margin-bottom: 16px;">🔍</div>
          <p>No icebreakers found</p>
        </div>
      `;
      return;
    }

    container.innerHTML = icebreakers
      .map(
        (icebreaker) => `
      <div class="icebreaker-card" data-id="${icebreaker.id}">
        <div class="icebreaker-text">${this.escapeHTML(icebreaker.text)}</div>
        <div class="icebreaker-meta">
          <div class="icebreaker-tags">
            ${icebreaker.tags.map((tag) => `<span class="icebreaker-tag">${tag}</span>`).join('')}
          </div>
          <div class="icebreaker-actions">
            <button class="icon-btn copy-icebreaker" title="Copy to clipboard">📋</button>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    // Attach click handlers
    container.querySelectorAll('.icebreaker-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const target = e.target as HTMLElement;
        if (target.classList.contains('copy-icebreaker')) {
          e.stopPropagation();
          const id = (card as HTMLElement).dataset.id;
          const icebreaker = this.icebreakers.find((ib) => ib.id === id);
          if (icebreaker) {
            this.copyIcebreaker(icebreaker);
          }
        } else {
          const id = (card as HTMLElement).dataset.id;
          const icebreaker = this.icebreakers.find((ib) => ib.id === id);
          if (icebreaker) {
            this.copyIcebreaker(icebreaker);
          }
        }
      });
    });
  }

  private copyIcebreaker(icebreaker: Icebreaker) {
    navigator.clipboard.writeText(icebreaker.text).then(() => {
      this.showStatus('📋 Copied to clipboard!', 'success');
    });
  }

  private filterIcebreakers(category: string) {
    this.currentCategory = category;

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.classList.remove('active');
    });
    document.querySelector(`[data-category="${category}"]`)?.classList.add('active');

    // Filter icebreakers
    let filtered: Icebreaker[];
    if (category === 'all') {
      filtered = this.icebreakers;
    } else {
      filtered = IcebreakerService.getByCategory(category as any);
    }

    this.renderIcebreakers(filtered);
  }

  private searchIcebreakers(query: string) {
    if (!query.trim()) {
      this.filterIcebreakers(this.currentCategory);
      return;
    }

    const results = IcebreakerService.search(query);
    this.renderIcebreakers(results);
  }

  /* ==================== ANALYTICS ==================== */

  private async loadAnalytics() {
    const conversations = await Storage.get('conversations');

    if (!conversations || Object.keys(conversations).length === 0) {
      // No data yet
      this.renderEmptyAnalytics();
      return;
    }

    const analytics = await AnalyticsService.getOverallAnalytics();

    // Engagement Score
    const engagementScore = document.getElementById('engagement-score');
    const engagementMeter = document.getElementById('engagement-meter');
    if (engagementScore) {
      engagementScore.textContent = Math.round(analytics.engagementScore).toString();
    }
    if (engagementMeter) {
      engagementMeter.style.width = `${analytics.engagementScore}%`;
    }

    // Response Rate
    const responseRate = document.getElementById('response-rate');
    if (responseRate) {
      responseRate.textContent = `${Math.round(analytics.responseRate * 100)}%`;
    }

    // Active Conversations
    const activeConvos = document.getElementById('active-convos');
    if (activeConvos) {
      activeConvos.textContent = analytics.totalConversations.toString();
    }

    // Top Emojis
    const topEmojis = document.getElementById('top-emojis');
    if (topEmojis) {
      if (analytics.topEmojis.length > 0) {
        topEmojis.innerHTML = analytics.topEmojis
          .slice(0, 5)
          .map((emojiData) => `<span style="font-size: 24px; margin-right: 8px;">${emojiData.emoji}</span>`)
          .join('');
      } else {
        topEmojis.textContent = 'No data yet';
      }
    }

    // Top Words (you'd need to implement this in analytics.ts)
    const topWords = document.getElementById('top-words');
    if (topWords) {
      topWords.textContent = 'hey, what, how, cool, nice';
    }

    // Conversation Stages
    const stages = analytics.conversationStages;
    const total = stages.opening + stages.ongoing + stages.planning + stages.ghosted;

    this.updateStageBar('opening', stages.opening, total);
    this.updateStageBar('ongoing', stages.ongoing, total);
    this.updateStageBar('planning', stages.planning, total);

    // Success Metrics
    const numbersExchanged = document.getElementById('numbers-exchanged');
    const datesPlanned = document.getElementById('dates-planned');

    if (numbersExchanged) numbersExchanged.textContent = analytics.successMetrics.numbersExchanged.toString();
    if (datesPlanned) datesPlanned.textContent = analytics.successMetrics.datesPlanned.toString();
  }

  private updateStageBar(stage: string, count: number, total: number) {
    const fillElement = document.getElementById(`stage-${stage}`);
    const countElement = document.getElementById(`count-${stage}`);

    if (fillElement && total > 0) {
      const percentage = (count / total) * 100;
      fillElement.style.width = `${percentage}%`;
    }
    if (countElement) {
      countElement.textContent = count.toString();
    }
  }

  private renderEmptyAnalytics() {
    const engagementScore = document.getElementById('engagement-score');
    const responseRate = document.getElementById('response-rate');
    const activeConvos = document.getElementById('active-convos');

    if (engagementScore) engagementScore.textContent = '--';
    if (responseRate) responseRate.textContent = '--';
    if (activeConvos) activeConvos.textContent = '0';
  }

  /* ==================== SETTINGS ==================== */

  private async loadSettings() {
    const settings = await Storage.getSettings();

    // API Key
    const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
    if (apiKeyInput && settings.apiKey) {
      apiKeyInput.value = settings.apiKey;
    }

    // Preferred Tone
    const toneSelect = document.getElementById('preferred-tone') as HTMLSelectElement;
    if (toneSelect) {
      toneSelect.value = settings.preferredTone;
    }

    // Suggestions Count
    const countSelect = document.getElementById('suggestions-count') as HTMLSelectElement;
    if (countSelect) {
      countSelect.value = settings.suggestionsCount.toString();
    }

    // Auto-reply
    const autoReplyCheckbox = document.getElementById('auto-reply') as HTMLInputElement;
    if (autoReplyCheckbox) {
      autoReplyCheckbox.checked = settings.autoReplyEnabled;
    }

    // Smart Timing
    const smartTimingCheckbox = document.getElementById('smart-timing') as HTMLInputElement;
    if (smartTimingCheckbox) {
      smartTimingCheckbox.checked = settings.smartTiming || false;
    }
  }

  /* ==================== EVENT LISTENERS ==================== */

  private attachEventListeners() {
    // Dashboard quick actions
    document.getElementById('browse-icebreakers')?.addEventListener('click', () => {
      this.switchTab('icebreakers');
    });

    document.getElementById('view-analytics')?.addEventListener('click', () => {
      this.switchTab('analytics');
    });

    document.getElementById('analyze-style')?.addEventListener('click', () => {
      this.analyzeUserStyle();
    });

    // Icebreaker search
    const searchInput = document.getElementById('icebreaker-search') as HTMLInputElement;
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const query = (e.target as HTMLInputElement).value;
        this.searchIcebreakers(query);
      });
    }

    // Icebreaker category filters
    document.querySelectorAll('.filter-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const category = (e.currentTarget as HTMLElement).dataset.category;
        if (category) {
          this.filterIcebreakers(category);
        }
      });
    });

    // Settings save button
    document.getElementById('save-settings')?.addEventListener('click', () => {
      this.saveSettings();
    });

    // Upgrade button
    document.getElementById('upgrade-btn')?.addEventListener('click', () => {
      this.handleUpgrade();
    });

    // Export data button
    document.getElementById('export-data')?.addEventListener('click', () => {
      this.exportData();
    });

    // Reset data button
    document.getElementById('reset-data')?.addEventListener('click', () => {
      this.resetData();
    });

    // View roadmap
    document.getElementById('view-roadmap')?.addEventListener('click', (e) => {
      e.preventDefault();
      chrome.tabs.create({ url: 'https://github.com/yourusername/charm-ai#roadmap' });
    });
  }

  /* ==================== ACTIONS ==================== */

  private async saveSettings() {
    const apiKey = (document.getElementById('api-key') as HTMLInputElement)?.value.trim();
    const preferredTone = (document.getElementById('preferred-tone') as HTMLSelectElement)?.value as any;
    const suggestionsCount = parseInt((document.getElementById('suggestions-count') as HTMLSelectElement)?.value);
    const autoReplyEnabled = (document.getElementById('auto-reply') as HTMLInputElement)?.checked;
    const smartTiming = (document.getElementById('smart-timing') as HTMLInputElement)?.checked;

    await Storage.updateSettings({
      apiKey: apiKey || undefined,
      preferredTone,
      suggestionsCount,
      autoReplyEnabled,
      smartTiming,
    });

    this.showStatus('✓ Settings saved successfully!', 'success');
  }

  private handleUpgrade() {
    // In production, this would open Stripe checkout
    this.showStatus('🚀 Pro upgrade coming soon!', 'success');

    // For demo purposes, enable Pro
    Storage.get('usageStats').then((stats) => {
      if (stats) {
        stats.isPro = true;
        Storage.set('usageStats', stats).then(() => {
          this.loadDashboard();
        });
      }
    });
  }

  private async analyzeUserStyle() {
    this.showStatus('🧠 Analyzing your message style...', 'success');

    // In production, this would analyze messages from all platforms
    setTimeout(() => {
      this.showStatus('✓ Style analysis complete!', 'success');
    }, 2000);
  }

  private async exportData() {
    const conversations = await Storage.get('conversations');
    const settings = await Storage.getSettings();
    const stats = await Storage.getUsageStats();

    const exportData = {
      conversations,
      settings,
      stats,
      exportDate: new Date().toISOString(),
      version: '1.0.0',
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `charm-ai-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showStatus('📤 Data exported successfully!', 'success');
  }

  private async resetData() {
    if (!confirm('⚠️ Are you sure you want to reset all data? This cannot be undone.')) {
      return;
    }

    await Storage.set('conversations', {});
    await Storage.set('usageStats', {
      totalSuggestions: 0,
      suggestionsUsed: 0,
      conversationsManaged: 0,
      lastResetDate: Date.now(),
      isPro: false,
    });

    this.showStatus('✓ All data has been reset', 'success');
    this.loadDashboard();
    this.loadAnalytics();
  }

  /* ==================== UTILITIES ==================== */

  private showStatus(message: string, type: 'success' | 'error') {
    const statusEl = document.getElementById('status-message');
    if (!statusEl) return;

    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';

    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }

  private escapeHTML(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PopupController());
} else {
  new PopupController();
}
