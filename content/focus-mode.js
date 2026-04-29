// GitGlam — Focus Mode Module
// Hides GitHub UI chrome for distraction-free reading.

const GitGlamFocus = (() => {
  const SELECTORS_TO_HIDE = [
    '.AppHeader',
    '.UnderlineNav',
    '.Layout-sidebar',
    '.file-navigation',
    '.repository-content .Box-header',
    'nav[aria-label="Repository"]',
    '.footer',
    '#StickyHeader',
    '.gh-header-actions',
    '.pagehead',
    '.reponav',
    '.js-repo-nav',
  ];

  let active = false;
  const HIDDEN_CLASS = 'gitglam-focus-hidden';

  // Inject a style rule once for the hidden class
  let styleInjected = false;
  function injectStyle() {
    if (styleInjected) return;
    const style = document.createElement('style');
    style.textContent = `
      .${HIDDEN_CLASS} {
        display: none !important;
      }
      body.gitglam-focus-active {
        padding-top: 0 !important;
      }
    `;
    document.head.appendChild(style);
    styleInjected = true;
  }

  function enable() {
    if (active) return;
    injectStyle();
    active = true;
    document.body.classList.add('gitglam-focus-active');
    SELECTORS_TO_HIDE.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        el.classList.add(HIDDEN_CLASS);
      });
    });
  }

  function disable() {
    if (!active) return;
    active = false;
    document.body.classList.remove('gitglam-focus-active');
    document.querySelectorAll('.' + HIDDEN_CLASS).forEach((el) => {
      el.classList.remove(HIDDEN_CLASS);
    });
  }

  function isActive() {
    return active;
  }

  return { enable, disable, isActive };
})();
