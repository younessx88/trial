import { Storage } from '../utils/storage';

console.log('Charm AI: Background service worker started');

// Initialize default settings on install
chrome.runtime.onInstalled.addListener(async (details) => {
  if (details.reason === 'install') {
    console.log('Charm AI: First time installation');

    // Set default settings
    await Storage.set('settings', {
      autoReplyEnabled: false,
      autoReplyRequiresApproval: true,
      suggestionsCount: 3,
      preferredTone: 'balanced',
      enabledPlatforms: ['whatsapp', 'instagram'],
      messageHistoryLimit: 100,
      useLocalModel: false,
    });

    await Storage.set('usageStats', {
      totalSuggestions: 0,
      suggestionsUsed: 0,
      conversationsManaged: 0,
      lastResetDate: Date.now(),
      isPro: false,
    });

    await Storage.set('conversations', {});

    // Open welcome page
    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html'),
    });
  }

  if (details.reason === 'update') {
    console.log('Charm AI: Extension updated');
  }
});

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.type === 'GET_SETTINGS') {
    Storage.getSettings().then(sendResponse);
    return true; // Keep channel open for async response
  }

  if (message.type === 'UPDATE_SETTINGS') {
    Storage.updateSettings(message.data).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  if (message.type === 'GET_USAGE_STATS') {
    Storage.getUsageStats().then(sendResponse);
    return true;
  }

  if (message.type === 'INCREMENT_USAGE') {
    Storage.incrementUsage(message.usageType).then(() => {
      sendResponse({ success: true });
    });
    return true;
  }

  return false;
});

// Badge update based on usage
async function updateBadge() {
  const stats = await Storage.getUsageStats();
  const usage = await Storage.checkUsageLimit();

  if (!stats.isPro && usage.remaining <= 10) {
    chrome.action.setBadgeText({ text: usage.remaining.toString() });
    chrome.action.setBadgeBackgroundColor({ color: '#f56565' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}

// Update badge every minute
setInterval(updateBadge, 60000);
updateBadge();

export {};
