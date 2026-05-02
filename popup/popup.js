// GitGlam — Popup Script
// Manages theme picker, feature toggles, communicates with content script.

document.addEventListener('DOMContentLoaded', async () => {
  const enableToggle = document.getElementById('enableToggle');
  const themeGrid = document.getElementById('themeGrid');
  const focusModeToggle = document.getElementById('focusModeToggle');
  const progressBarToggle = document.getElementById('progressBarToggle');
  const readingTimeToggle = document.getElementById('readingTimeToggle');
  const animationsToggle = document.getElementById('animationsToggle');
  const nightShiftToggle = document.getElementById('nightShiftToggle');
  const fontSizeRange = document.getElementById('fontSizeRange');
  const fontSizeValue = document.getElementById('fontSizeValue');
  const columnWidthRange = document.getElementById('columnWidthRange');
  const columnWidthValue = document.getElementById('columnWidthValue');
  const noMarkdownNotice = document.getElementById('noMarkdownNotice');
  const settingsSection = document.getElementById('settingsSection');

  // Get current tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  // Check if we're on a GitHub page
  if (!tab?.url?.startsWith('https://github.com/')) {
    noMarkdownNotice.style.display = 'block';
    noMarkdownNotice.querySelector('p').textContent = 'GitGlam works on GitHub markdown pages.';
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
  nightShiftToggle.checked = state.nightShift;
  fontSizeRange.value = state.fontSize || 16;
  fontSizeValue.textContent = (state.fontSize || 16) + 'px';
  columnWidthRange.value = state.columnWidth || 1000;
  columnWidthValue.textContent = (state.columnWidth || 1000) + 'px';
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

  nightShiftToggle.addEventListener('change', () => {
    sendUpdate('nightShift', nightShiftToggle.checked);
  });

  // Font size slider
  fontSizeRange.addEventListener('input', () => {
    const size = parseInt(fontSizeRange.value);
    fontSizeValue.textContent = size + 'px';
    sendUpdate('fontSize', size);
  });

  // Column width slider
  columnWidthRange.addEventListener('input', () => {
    const width = parseInt(columnWidthRange.value);
    columnWidthValue.textContent = width + 'px';
    sendUpdate('columnWidth', width);
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
