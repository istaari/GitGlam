// GitGlam — Main Content Script Orchestrator
// Detects markdown pages, manages state, coordinates all modules.

(() => {
  'use strict';

  const DEFAULTS = {
    enabled: false,
    theme: 'medium',
    focusMode: false,
    progressBar: true,
    readingTime: true,
  };

  let state = { ...DEFAULTS };
  let markdownBody = null;
  let initialized = false;

  // ---- State persistence ----

  function loadState() {
    return new Promise((resolve) => {
      chrome.storage.sync.get('gitglam', (data) => {
        if (data.gitglam) {
          state = { ...DEFAULTS, ...data.gitglam };
        }
        resolve(state);
      });
    });
  }

  function saveState() {
    chrome.storage.sync.set({ gitglam: state });
  }

  // ---- Markdown detection ----

  function findMarkdownBody() {
    return document.querySelector(
      'article.markdown-body, .markdown-body'
    );
  }

  // ---- Theme management ----

  const THEMES = ['medium', 'notion', 'sepia', 'nord'];

  function applyTheme(theme) {
    THEMES.forEach((t) => {
      document.body.classList.remove('gitglam-theme-' + t);
    });
    document.body.classList.add('gitglam-theme-' + theme);
    applyNordOverrides(theme);
  }

  // Nord theme: directly style elements with inline styles.
  let nordStyleEl = null;
  let codeFixStyleEl = null;

  function applyNordOverrides(theme) {
    if (theme === 'nord') {
      nordForceStyles();
      removeCodeFixStyles(); // Nord handles its own code styling
    } else {
      nordRemoveStyles();
      applyCodeFixStyles(theme); // Fix code visibility for light themes
    }
  }

  // ---- Light theme code block fix ----
  // GitHub dark mode applies syntax highlighting colors via late-loaded
  // stylesheets that override our extension CSS. Injecting a <style> at
  // end of <body> wins the cascade order war.

  const CODE_FIX_COLORS = {
    medium: { bg: '#f5f5f0', text: '#292929', border: '#e6e6e6' },
    notion: { bg: '#f7f6f3', text: '#37352f', border: '#e9e9e7' },
    sepia: { bg: '#ede5d0', text: '#433422', border: '#d4c5a9' },
  };

  // GitHub light-mode syntax highlighting colors (prettylights-light)
  const SYNTAX_COLORS = {
    medium: {
      comment: '#6a737d',
      constant: '#005cc5',
      string: '#032f62',
      keyword: '#d73a49',
      function: '#6f42c1',
      variable: '#e36209',
      entity: '#6f42c1',
      tag: '#22863a',
    },
    notion: {
      comment: '#6a737d',
      constant: '#0550ae',
      string: '#0a3069',
      keyword: '#cf222e',
      function: '#8250df',
      variable: '#953800',
      entity: '#8250df',
      tag: '#116329',
    },
    sepia: {
      comment: '#7d6b55',
      constant: '#6b3a1f',
      string: '#4a3520',
      keyword: '#a0522d',
      function: '#7b4f2d',
      variable: '#8b4513',
      entity: '#7b4f2d',
      tag: '#3d6b2e',
    },
  };

  function applyCodeFixStyles(theme) {
    const colors = CODE_FIX_COLORS[theme];
    if (!colors) {
      removeCodeFixStyles();
      return;
    }

    const syntax = SYNTAX_COLORS[theme];

    if (!codeFixStyleEl || !codeFixStyleEl.parentNode) {
      codeFixStyleEl = document.createElement('style');
      codeFixStyleEl.id = 'gitglam-code-fix';
    }

    codeFixStyleEl.textContent = `
      /* GitGlam code fix — injected last to override GitHub dark mode */
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .highlight,
      body.gitglam-active.gitglam-theme-${theme} .markdown-body div[class*="highlight-"],
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .snippet-clipboard-content {
        background: transparent !important;
        background-color: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body pre,
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .highlight pre {
        background-color: ${colors.bg} !important;
        color: ${colors.text} !important;
        border: 1px solid ${colors.border} !important;
        border-radius: 8px !important;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body pre code {
        color: ${colors.text} !important;
        background-color: transparent !important;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body pre code * {
        background-color: transparent !important;
      }
      /* Syntax highlighting — prettylights light colors */
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-c,
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-c span {
        color: ${syntax.comment} !important;
        font-style: italic;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-c1,
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-s .pl-v {
        color: ${syntax.constant} !important;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-s,
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-pds {
        color: ${syntax.string} !important;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-k {
        color: ${syntax.keyword} !important;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-en,
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-e {
        color: ${syntax.function} !important;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-smi,
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-v {
        color: ${syntax.variable} !important;
      }
      body.gitglam-active.gitglam-theme-${theme} .markdown-body .pl-ent {
        color: ${syntax.tag} !important;
      }
      /* Hide GitHub's native copy button */
      body.gitglam-active .markdown-body .zeroclipboard-container,
      body.gitglam-active .markdown-body .ClipboardButton,
      body.gitglam-active .markdown-body [class*="clipboard-copy"],
      body.gitglam-active .markdown-body .js-clipboard-copy,
      body.gitglam-active .markdown-body pre > button:not(.gitglam-copy-btn),
      body.gitglam-active .markdown-body .highlight > button,
      body.gitglam-active .markdown-body [class*="CopyToClipboard"],
      body.gitglam-active .markdown-body .position-absolute[aria-label="Copy"] {
        display: none !important;
      }
    `;
    document.body.appendChild(codeFixStyleEl);
  }

  function removeCodeFixStyles() {
    if (codeFixStyleEl && codeFixStyleEl.parentNode) {
      codeFixStyleEl.remove();
    }
    codeFixStyleEl = null;
    const existing = document.getElementById('gitglam-code-fix');
    if (existing) existing.remove();
  }

  function nordForceStyles() {
    // 1. Inject style at end of body (wins cascade order over everything in <head>)
    if (!nordStyleEl || !nordStyleEl.parentNode) {
      nordStyleEl = document.createElement('style');
      nordStyleEl.id = 'gitglam-nord-forced';
    }
    // Always update content and re-append to end of body to stay last
    nordStyleEl.textContent = getNordCSS();
    document.body.appendChild(nordStyleEl);

    // 2. Directly style tables inside markdown-body
    const tables = document.querySelectorAll('.markdown-body table');
    tables.forEach((table) => {
      table.style.setProperty('background-color', '#2e3440', 'important');
      table.style.setProperty('border-color', '#434c5e', 'important');
      table.querySelectorAll('th').forEach((th) => {
        th.style.setProperty('color', '#eceff4', 'important');
        th.style.setProperty('background-color', 'rgba(136, 192, 208, 0.12)', 'important');
        th.style.setProperty('border-color', '#434c5e', 'important');
      });
      table.querySelectorAll('td').forEach((td) => {
        td.style.setProperty('color', '#d8dee9', 'important');
        td.style.setProperty('border-color', '#434c5e', 'important');
      });
      table.querySelectorAll('tr').forEach((tr, i) => {
        tr.style.setProperty('background-color', i % 2 === 0 ? '#2e3440' : '#3b4252', 'important');
        tr.style.setProperty('border-color', '#434c5e', 'important');
      });
      table.querySelectorAll('a').forEach((a) => {
        a.style.setProperty('color', '#88c0d0', 'important');
      });
      table.querySelectorAll('code').forEach((code) => {
        code.style.setProperty('color', '#a3be8c', 'important');
      });
    });
  }

  function getNordCSS() {
    return `
      /* GitGlam Nord — scoped to markdown-body only */
      body.gitglam-active.gitglam-theme-nord .markdown-body {
        background-color: #2e3440 !important;
        color: #d8dee9 !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body table {
        background-color: #2e3440 !important;
        border: 1px solid #434c5e !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body table th {
        color: #eceff4 !important;
        background-color: rgba(136, 192, 208, 0.12) !important;
        border: 1px solid #434c5e !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body table td {
        color: #d8dee9 !important;
        background-color: #2e3440 !important;
        border: 1px solid #434c5e !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body table tr {
        background-color: #2e3440 !important;
        border-color: #434c5e !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body table tr:nth-child(2n) {
        background-color: #3b4252 !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body table tr:nth-child(2n) td {
        background-color: #3b4252 !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body table a {
        color: #88c0d0 !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body table code {
        color: #a3be8c !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body pre {
        background-color: #272c36 !important;
        border-color: #3b4252 !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body pre code,
      body.gitglam-active.gitglam-theme-nord .markdown-body pre code * {
        color: #d8dee9 !important;
        background-color: transparent !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body .highlight,
      body.gitglam-active.gitglam-theme-nord .markdown-body div[class*="highlight-"],
      body.gitglam-active.gitglam-theme-nord .markdown-body .snippet-clipboard-content {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      /* Nord syntax highlighting */
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-c,
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-c span {
        color: #616e88 !important;
        font-style: italic;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-c1 {
        color: #b48ead !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-s,
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-pds {
        color: #a3be8c !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-k {
        color: #81a1c1 !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-en,
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-e {
        color: #88c0d0 !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-smi,
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-v {
        color: #d8dee9 !important;
      }
      body.gitglam-active.gitglam-theme-nord .markdown-body .pl-ent {
        color: #8fbcbb !important;
      }
      /* Hide GitHub copy button in Nord too */
      body.gitglam-active.gitglam-theme-nord .markdown-body .zeroclipboard-container,
      body.gitglam-active.gitglam-theme-nord .markdown-body .ClipboardButton,
      body.gitglam-active.gitglam-theme-nord .markdown-body .js-clipboard-copy,
      body.gitglam-active.gitglam-theme-nord .markdown-body pre > button:not(.gitglam-copy-btn),
      body.gitglam-active.gitglam-theme-nord .markdown-body .highlight > button,
      body.gitglam-active.gitglam-theme-nord .markdown-body [class*="CopyToClipboard"],
      body.gitglam-active.gitglam-theme-nord .markdown-body .position-absolute[aria-label="Copy"] {
        display: none !important;
      }
    `;
  }

  function nordRemoveStyles() {
    // Remove injected style
    if (nordStyleEl && nordStyleEl.parentNode) {
      nordStyleEl.remove();
    }
    nordStyleEl = null;
    const existing = document.getElementById('gitglam-nord-forced');
    if (existing) existing.remove();

    // Remove inline styles from tables in markdown-body only
    document.querySelectorAll('.markdown-body table').forEach((table) => {
      table.style.removeProperty('background-color');
      table.style.removeProperty('border-color');
      table.querySelectorAll('th, td, tr').forEach((el) => {
        el.style.removeProperty('color');
        el.style.removeProperty('background-color');
        el.style.removeProperty('border-color');
      });
      table.querySelectorAll('a, code').forEach((el) => {
        el.style.removeProperty('color');
      });
    });
  }

  // ---- Reading mode ----

  function activateReadingMode() {
    if (!markdownBody) return;

    document.body.classList.add('gitglam-active');
    applyTheme(state.theme);

    // Code blocks
    GitGlamCodeBlocks.enhance(markdownBody);

    // Lightbox
    GitGlamLightbox.init(markdownBody);

    // Focus mode
    if (state.focusMode) {
      GitGlamFocus.enable();
    }

    // Reading stats
    GitGlamReadingStats.init(markdownBody, {
      progressBar: state.progressBar,
      readingTime: state.readingTime,
    });

    // Enhance GitHub's native outline
    GitGlamOutline.init();

    // Scroll animations
    GitGlamAnimations.init(markdownBody);

    // Toggle button state
    GitGlamToggle.setActive(true);

    // Notify service worker
    chrome.runtime.sendMessage({ type: 'gitglam:state', enabled: true });
  }

  function deactivateReadingMode() {
    document.body.classList.remove('gitglam-active');
    THEMES.forEach((t) => {
      document.body.classList.remove('gitglam-theme-' + t);
    });

    // Remove Nord CSS variable overrides from <html>
    applyNordOverrides('none');

    GitGlamAnimations.destroy(markdownBody);
    GitGlamCodeBlocks.cleanup(markdownBody);
    GitGlamLightbox.destroy();
    GitGlamFocus.disable();
    GitGlamReadingStats.destroy();
    GitGlamOutline.destroy();
    GitGlamToggle.setActive(false);

    chrome.runtime.sendMessage({ type: 'gitglam:state', enabled: false });
  }

  function toggleReadingMode() {
    state.enabled = !state.enabled;
    saveState();
    if (state.enabled) {
      activateReadingMode();
    } else {
      deactivateReadingMode();
    }
  }

  // ---- Update individual features without full toggle ----

  function updateFeature(key, value) {
    state[key] = value;
    saveState();

    if (!state.enabled) return;

    switch (key) {
      case 'theme':
        applyTheme(value);
        GitGlamOutline.updateTheme();
        break;
      case 'focusMode':
        value ? GitGlamFocus.enable() : GitGlamFocus.disable();
        break;
      case 'progressBar':
      case 'readingTime':
        GitGlamReadingStats.destroy();
        GitGlamReadingStats.init(markdownBody, {
          progressBar: state.progressBar,
          readingTime: state.readingTime,
        });
        break;
    }
  }

  // ---- Message handling from popup / service worker ----

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    switch (msg.type) {
      case 'gitglam:toggle':
        toggleReadingMode();
        sendResponse({ enabled: state.enabled });
        break;

      case 'gitglam:getState':
        sendResponse({ ...state, hasMarkdown: !!markdownBody });
        break;

      case 'gitglam:update':
        if (msg.key === 'enabled') {
          if (msg.value !== state.enabled) {
            toggleReadingMode();
          }
        } else {
          updateFeature(msg.key, msg.value);
        }
        sendResponse({ ok: true });
        break;
    }
    return true;
  });

  // ---- Keyboard shortcuts ----

  document.addEventListener('keydown', (e) => {
    // Alt+R — toggle reading mode
    if (e.altKey && e.key === 'r') {
      e.preventDefault();
      toggleReadingMode();
      return;
    }

    if (!state.enabled) return;

    // Escape — exit reading mode
    if (e.key === 'Escape') {
      if (document.querySelector('.gitglam-lightbox-overlay')) return;
      toggleReadingMode();
    }
  });

  // ---- Init / SPA navigation ----

  function setup() {
    markdownBody = findMarkdownBody();
    if (!markdownBody) {
      GitGlamToggle.destroy();
      if (state.enabled) {
        deactivateReadingMode();
      }
      return;
    }

    GitGlamToggle.create(toggleReadingMode);

    if (state.enabled) {
      activateReadingMode();
    }
  }

  async function init() {
    if (initialized) return;
    initialized = true;

    await loadState();
    setup();

    // Listen for GitHub's Turbo navigation (SPA)
    document.addEventListener('turbo:load', () => {
      setTimeout(() => {
        cleanup();
        setup();
      }, 100);
    });

    document.addEventListener('turbo:render', () => {
      setTimeout(() => {
        cleanup();
        setup();
      }, 100);
    });

    // Fallback: MutationObserver for non-Turbo navigations
    const bodyObserver = new MutationObserver(() => {
      const newMd = findMarkdownBody();
      if (newMd !== markdownBody) {
        cleanup();
        markdownBody = newMd;
        setup();
      }
    });

    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  function cleanup() {
    if (state.enabled) {
      GitGlamAnimations.destroy(markdownBody);
      GitGlamCodeBlocks.cleanup(markdownBody);
      GitGlamLightbox.destroy();
      GitGlamFocus.disable();
      GitGlamReadingStats.destroy();
      GitGlamOutline.destroy();
    }
  }

  // Start
  init();
})();
