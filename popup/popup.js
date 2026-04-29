// GitGlam — Popup Script
// Manages theme picker, feature toggles, communicates with content script.

document.addEventListener('DOMContentLoaded', async () => {
  const enableToggle = document.getElementById('enableToggle');
  const themeGrid = document.getElementById('themeGrid');
  const focusModeToggle = document.getElementById('focusModeToggle');
  const progressBarToggle = document.getElementById('progressBarToggle');
  const readingTimeToggle = document.getElementById('readingTimeToggle');
  const animationsToggle = document.getElementById('animationsToggle');
  const noMarkdownNotice = document.getElementById('noMarkdownNotice');
  const settingsSection = document.getElementById('settingsSection');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if we're on a GitHub page
  if (!tab?.url?.startsWith('https://github.com/')) {
    noMarkdownNotice.style.display = 'block';
    noMarkdownNotice.querySelector('p').textContent = 'GitGlam works on GitHub pages.';
    settingsSection.style.opacity = '0.5';
    settingsSection.style.pointerEvents = 'none';
    return;
  }

  // Get state from content script
  let state;
  try {
    state = await chrome.tabs.sendMessage(tab.id, { type: 'gitglam:getState' });
  } catch {
    // Content script not loaded yet
    noMarkdownNotice.style.display = 'block';
    settingsSection.style.opacity = '0.5';
    settingsSection.style.pointerEvents = 'none';
    return;
  }

  if (!state.hasMarkdown) {
    noMarkdownNotice.style.display = 'block';
  }

  // Populate UI from state
  enableToggle.checked = state.enabled;
  focusModeToggle.checked = state.focusMode;
  progressBarToggle.checked = state.progressBar;
  readingTimeToggle.checked = state.readingTime;
  animationsToggle.checked = state.animations;
  setActiveTheme(state.theme);

  // ---- Event listeners ----

  // Master toggle
  enableToggle.addEventListener('change', () => {
    sendUpdate('enabled', enableToggle.checked);
  });

  // Theme cards
  themeGrid.querySelectorAll('.theme-card').forEach((card) => {
    card.addEventListener('click', () => {
      const theme = card.dataset.theme;
      setActiveTheme(theme);
      sendUpdate('theme', theme);
    });
  });

  // Feature toggles
  focusModeToggle.addEventListener('change', () => {
    sendUpdate('focusMode', focusModeToggle.checked);
  });

  progressBarToggle.addEventListener('change', () => {
    sendUpdate('progressBar', progressBarToggle.checked);
  });

  readingTimeToggle.addEventListener('change', () => {
    sendUpdate('readingTime', readingTimeToggle.checked);
  });

  animationsToggle.addEventListener('change', () => {
    sendUpdate('animations', animationsToggle.checked);
  });

  // ---- Helpers ----

  function setActiveTheme(theme) {
    themeGrid.querySelectorAll('.theme-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.theme === theme);
    });
  }

  async function sendUpdate(key, value) {
    try {
      await chrome.tabs.sendMessage(tab.id, {
        type: 'gitglam:update',
        key,
        value,
      });
    } catch {
      // Content script may not be available
    }
  }
});
