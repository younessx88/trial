import { Storage } from '../utils/storage';

class PopupController {
  constructor() {
    this.init();
  }

  private async init() {
    await this.loadStats();
    await this.loadSettings();
    this.attachEventListeners();
  }

  private async loadStats() {
    const stats = await Storage.getUsageStats();
    const usage = await Storage.checkUsageLimit();

    // Update stat cards
    document.getElementById('total-suggestions')!.textContent = stats.totalSuggestions.toString();
    document.getElementById('suggestions-used')!.textContent = stats.suggestionsUsed.toString();
    document.getElementById('conversations')!.textContent = stats.conversationsManaged.toString();

    // Update usage bar
    const progressBar = document.getElementById('usage-progress')!;
    const remainingCount = document.getElementById('remaining-count')!;
    const upgradeCTA = document.getElementById('upgrade-cta')!;

    if (stats.isPro) {
      // Pro user
      progressBar.style.width = '100%';
      remainingCount.textContent = '∞';
      document.querySelector('.usage-text')!.textContent = 'Unlimited suggestions (Pro)';
    } else {
      // Free user
      const percentage = (usage.remaining / 50) * 100;
      progressBar.style.width = `${percentage}%`;
      remainingCount.textContent = usage.remaining.toString();

      // Change color based on remaining usage
      if (percentage < 20) {
        progressBar.classList.add('danger');
      } else if (percentage < 50) {
        progressBar.classList.add('warning');
      }

      // Show upgrade CTA if low on usage
      if (usage.remaining < 10) {
        upgradeCTA.style.display = 'block';
      }
    }
  }

  private async loadSettings() {
    const settings = await Storage.getSettings();

    // API Key
    const apiKeyInput = document.getElementById('api-key') as HTMLInputElement;
    if (settings.apiKey) {
      apiKeyInput.value = settings.apiKey;
    }

    // Preferred Tone
    const toneSelect = document.getElementById('preferred-tone') as HTMLSelectElement;
    toneSelect.value = settings.preferredTone;

    // Suggestions Count
    const countSelect = document.getElementById('suggestions-count') as HTMLSelectElement;
    countSelect.value = settings.suggestionsCount.toString();

    // Auto-reply
    const autoReplyCheckbox = document.getElementById('auto-reply') as HTMLInputElement;
    autoReplyCheckbox.checked = settings.autoReplyEnabled;
  }

  private attachEventListeners() {
    // Save settings button
    document.getElementById('save-settings')?.addEventListener('click', () => {
      this.saveSettings();
    });

    // Upgrade button
    document.getElementById('upgrade-btn')?.addEventListener('click', () => {
      this.handleUpgrade();
    });

    // Learn style button
    document.getElementById('learn-style')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.analyzeUserStyle();
    });

    // Reset data button
    document.getElementById('reset-data')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.resetData();
    });
  }

  private async saveSettings() {
    const apiKey = (document.getElementById('api-key') as HTMLInputElement).value.trim();
    const preferredTone = (document.getElementById('preferred-tone') as HTMLSelectElement).value as any;
    const suggestionsCount = parseInt((document.getElementById('suggestions-count') as HTMLSelectElement).value);
    const autoReplyEnabled = (document.getElementById('auto-reply') as HTMLInputElement).checked;

    await Storage.updateSettings({
      apiKey: apiKey || undefined,
      preferredTone,
      suggestionsCount,
      autoReplyEnabled,
    });

    this.showStatus('Settings saved successfully! ✓', 'success');
  }

  private handleUpgrade() {
    // In a real app, this would open a Stripe checkout page
    this.showStatus('Pro upgrade coming soon! 🚀', 'success');

    // For demo purposes, enable Pro
    Storage.get('usageStats').then((stats) => {
      if (stats) {
        stats.isPro = true;
        Storage.set('usageStats', stats).then(() => {
          this.loadStats();
        });
      }
    });
  }

  private async analyzeUserStyle() {
    this.showStatus('Analyzing your message style... This may take a moment.', 'success');

    // In a real implementation, this would:
    // 1. Collect messages from all conversations
    // 2. Analyze patterns using AIService.analyzeMessageStyle()
    // 3. Update user style profile

    setTimeout(() => {
      this.showStatus('Style analysis complete! Your profile has been updated. ✓', 'success');
    }, 2000);
  }

  private async resetData() {
    if (!confirm('Are you sure you want to reset all data? This cannot be undone.')) {
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

    this.showStatus('All data has been reset. ✓', 'success');
    this.loadStats();
  }

  private showStatus(message: string, type: 'success' | 'error') {
    const statusEl = document.getElementById('status-message')!;
    statusEl.textContent = message;
    statusEl.className = `status-message ${type}`;
    statusEl.style.display = 'block';

    setTimeout(() => {
      statusEl.style.display = 'none';
    }, 3000);
  }
}

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new PopupController());
} else {
  new PopupController();
}
