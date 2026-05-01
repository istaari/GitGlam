// GitGlam — GitHub Outline Enhancement Module
// Targets GitHub's actual outline panel (section[aria-labelledby="outline-id"])
// and styles it to match the active reading theme via injected CSS.

const GitGlamOutline = (() => {
  let styleEl = null;

  const THEME_COLORS = {
    medium: {
      bg: '#fafaf9',
      text: '#292929',
      accent: '#1a8917',
      border: '#e6e6e6',
      hoverBg: 'rgba(26, 137, 23, 0.08)',
      activeBg: 'rgba(26, 137, 23, 0.12)',
      muted: '#757575',
      inputBg: '#f5f5f4',
    },
    notion: {
      bg: '#ffffff',
      text: '#37352f',
      accent: '#2eaadc',
      border: '#e9e9e7',
      hoverBg: 'rgba(46, 170, 220, 0.08)',
      activeBg: 'rgba(46, 170, 220, 0.12)',
      muted: '#9b9a97',
      inputBg: '#f7f6f3',
    },
    sepia: {
      bg: '#f4ecd8',
      text: '#433422',
      accent: '#8b4513',
      border: '#d4c5a9',
      hoverBg: 'rgba(139, 69, 19, 0.08)',
      activeBg: 'rgba(139, 69, 19, 0.14)',
      muted: '#7a6652',
      inputBg: '#efe7d3',
    },
    nord: {
      bg: '#3b4252',
      text: '#d8dee9',
      accent: '#88c0d0',
      border: '#434c5e',
      hoverBg: 'rgba(136, 192, 208, 0.1)',
      activeBg: 'rgba(136, 192, 208, 0.18)',
      muted: '#7b88a1',
      inputBg: '#2e3440',
    },
  };

  function getActiveTheme() {
    const body = document.body;
    if (body.classList.contains('gitglam-theme-notion')) return 'notion';
    if (body.classList.contains('gitglam-theme-sepia')) return 'sepia';
    if (body.classList.contains('gitglam-theme-nord')) return 'nord';
    return 'medium';
  }

  // The outline panel selector — targets the sticky panel container that wraps the outline section
  const PANEL = '[class*="Panel-module__Box"]';
  const SECTION = 'section[aria-labelledby="outline-id"]';
  const NAV = `${SECTION} nav[class*="TableOfContentsPanel-module__NavList"]`;
  const LIST = `${SECTION} ul[data-component="ActionList"]`;
  const ITEM = `${SECTION} li[data-component="ActionList.Item"]`;
  const ITEM_ACTIVE = `${SECTION} li[data-component="ActionList.Item"][data-active="true"]`;
  const LINK = `${SECTION} a[data-component="Link"]`;
  const TITLE = `${SECTION} h3#outline-id`;
  const FILTER_INPUT = `${SECTION} input[placeholder="Filter headings"]`;
  const FILTER_WRAPPER = `${SECTION} [data-component="TextInput"]`;
  const LEVEL1 = `${SECTION} [class*="TocLevel1"]`;
  const LEVEL2 = `${SECTION} [class*="TocLevel2"]`;
  const LEVEL3 = `${SECTION} [class*="TocLevel3"]`;
  const LEVEL4 = `${SECTION} [class*="TocLevel4"]`;

  function buildStyles(theme) {
    const c = THEME_COLORS[theme] || THEME_COLORS.medium;
    return `
/* GitGlam Outline Enhancement — ${theme} */
body.gitglam-active ${PANEL}:has(${SECTION}) {
  background: ${c.bg} !important;
  border-right: 1px solid ${c.border} !important;
}

body.gitglam-active ${SECTION} {
  background: ${c.bg} !important;
}

body.gitglam-active ${TITLE} {
  color: ${c.accent} !important;
  font-size: 12px !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.08em !important;
}

body.gitglam-active ${SECTION} button[data-component="IconButton"] {
  color: ${c.muted} !important;
}
body.gitglam-active ${SECTION} button[data-component="IconButton"]:hover {
  color: ${c.text} !important;
  background: ${c.hoverBg} !important;
}

body.gitglam-active ${FILTER_WRAPPER} {
  background: ${c.inputBg} !important;
  border-color: ${c.border} !important;
  border-radius: 8px !important;
}
body.gitglam-active ${FILTER_INPUT} {
  background: ${c.inputBg} !important;
  color: ${c.text} !important;
}
body.gitglam-active ${FILTER_INPUT}::placeholder {
  color: ${c.muted} !important;
}
body.gitglam-active ${SECTION} [class*="TextInput-icon"] {
  color: ${c.muted} !important;
}

body.gitglam-active ${LIST} {
  padding: 4px 0 !important;
}

body.gitglam-active ${ITEM} {
  border-radius: 6px !important;
  margin: 1px 4px !important;
}

body.gitglam-active ${LINK} {
  color: ${c.text} !important;
  text-decoration: none !important;
  border-radius: 6px !important;
  transition: all 0.15s ease !important;
  border-left: 3px solid transparent !important;
  padding-top: 6px !important;
  padding-bottom: 6px !important;
}

body.gitglam-active ${LINK}:hover {
  background: ${c.hoverBg} !important;
  color: ${c.accent} !important;
  border-left-color: ${c.accent} !important;
}

body.gitglam-active ${ITEM_ACTIVE} ${LINK},
body.gitglam-active ${ITEM_ACTIVE} a {
  background: ${c.activeBg} !important;
  color: ${c.accent} !important;
  border-left-color: ${c.accent} !important;
  font-weight: 600 !important;
}

body.gitglam-active ${LEVEL1} {
  font-weight: 700 !important;
  color: ${c.text} !important;
}
body.gitglam-active ${LEVEL2} {
  font-weight: 600 !important;
  color: ${c.text} !important;
  padding-left: 8px !important;
}
body.gitglam-active ${LEVEL3} {
  color: ${c.muted} !important;
  padding-left: 16px !important;
}
body.gitglam-active ${LEVEL4} {
  color: ${c.muted} !important;
  padding-left: 24px !important;
}

/* Active item level overrides */
body.gitglam-active ${ITEM_ACTIVE} [class*="TocLevel"] {
  color: ${c.accent} !important;
}

/* Scrollbar styling in the outline nav */
body.gitglam-active ${NAV} {
  scrollbar-width: thin;
  scrollbar-color: ${c.border} transparent;
}
body.gitglam-active ${NAV}::-webkit-scrollbar {
  width: 4px;
}
body.gitglam-active ${NAV}::-webkit-scrollbar-thumb {
  background: ${c.border};
  border-radius: 4px;
}
`;
  }

  function injectStyles() {
    removeStyles();
    const theme = getActiveTheme();
    styleEl = document.createElement('style');
    styleEl.id = 'gitglam-outline-styles';
    styleEl.textContent = buildStyles(theme);
    document.head.appendChild(styleEl);
  }

  function removeStyles() {
    if (styleEl) {
      styleEl.remove();
      styleEl = null;
    }
    const existing = document.getElementById('gitglam-outline-styles');
    if (existing) existing.remove();
  }

  function init() {
    injectStyles();
  }

  function updateTheme() {
    if (document.body.classList.contains('gitglam-active')) {
      injectStyles();
    }
  }

  function destroy() {
    removeStyles();
  }

  return { init, destroy, updateTheme };
})();
