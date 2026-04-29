// GitGlam — Background Service Worker
// Manages badge state and relays messages.

chrome.runtime.onInstalled.addListener(() => {
  // Set default state on install
  chrome.storage.sync.get('gitglam', (data) => {
    if (!data.gitglam) {
      chrome.storage.sync.set({
        gitglam: {
          enabled: false,
          theme: 'medium',
          focusMode: false,
          progressBar: true,
          readingTime: true,
        },
      });
    }
  });
});

// Update badge when reading mode state changes
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.type === 'gitglam:state') {
    updateBadge(msg.enabled);
  }
});

function updateBadge(enabled) {
  if (enabled) {
    chrome.action.setBadgeText({ text: 'ON' });
    chrome.action.setBadgeBackgroundColor({ color: '#6366f1' });
  } else {
    chrome.action.setBadgeText({ text: '' });
  }
}
