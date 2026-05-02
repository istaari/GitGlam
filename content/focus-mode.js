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
    // Commit history / description bar
    '.border.rounded-2:has([class*="LatestCommit"])',
    '[class*="OverviewHeader"]',
    // File listing table (but NOT the README below it)
    '[class*="DirectoryContent-module__OverviewHeaderRow"]',
    '[class*="DirectoryContent-module__Box_1"]',
    '[class*="DirectoryContent-module__Box_2"]',
    '[class*="DirectoryContent-module__Box_3"]',
    'table:has(.react-directory-row)',
    // Repo about sidebar
    '.BorderGrid',
    // File tree nav tabs (Code/Readme/etc inside OverviewRepoFiles)
    '[class*="OverviewRepoFiles-module__UnderlineNav"]',
  ];

  let active = false;
  const HIDDEN_CLASS = 'gitglam-focus-hidden';

  // Inject a style rule once for the hidden class
  let styleInjected = false;
  function injectStyle() {
    if (styleInjected) return;
    const style = document.createElement('style');
    style.textContent = `
      /* Cinematic transition: elements slide/fade out */
      .gitglam-focus-exiting {
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) !important;
        opacity: 0 !important;
      }
      .gitglam-focus-exiting.AppHeader,
      .gitglam-focus-exiting[class*="Header"],
      .gitglam-focus-exiting.pagehead,
      .gitglam-focus-exiting#StickyHeader,
      .gitglam-focus-exiting nav {
        transform: translateY(-100%) !important;
      }
      .gitglam-focus-exiting.Layout-sidebar,
      .gitglam-focus-exiting.footer {
        transform: translateX(-40px) !important;
      }
      .gitglam-focus-exiting.UnderlineNav,
      .gitglam-focus-exiting.file-navigation,
      .gitglam-focus-exiting.reponav,
      .gitglam-focus-exiting.js-repo-nav {
        transform: translateY(-20px) !important;
      }

      .${HIDDEN_CLASS} {
        display: none !important;
      }
      body.gitglam-focus-active {
        padding-top: 0 !important;
      }

      /* Cinematic entry: elements slide/fade back in */
      .gitglam-focus-entering {
        transition: transform 0.35s cubic-bezier(0, 0, 0.2, 1),
                    opacity 0.35s cubic-bezier(0, 0, 0.2, 1) !important;
        opacity: 1 !important;
        transform: translateY(0) translateX(0) !important;
      }
    `;
    document.head.appendChild(style);
    styleInjected = true;
  }

  function isBlobPage() {
    return /\/blob\//.test(window.location.pathname);
  }

  function enable() {
    if (active) return;
    if (!isBlobPage()) return;
    injectStyle();
    active = true;
    document.body.classList.add('gitglam-focus-active');

    // Cinematic exit: animate elements before hiding
    const elements = [];
    SELECTORS_TO_HIDE.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        elements.push(el);
        el.classList.add('gitglam-focus-exiting');
      });
    });

    // After animation completes, actually hide them
    setTimeout(() => {
      elements.forEach((el) => {
        el.classList.remove('gitglam-focus-exiting');
        el.classList.add(HIDDEN_CLASS);
      });
    }, 420);
  }

  function disable() {
    if (!active) return;
    active = false;
    document.body.classList.remove('gitglam-focus-active');

    // Cinematic entry: reveal elements with animation
    const elements = document.querySelectorAll('.' + HIDDEN_CLASS);
    elements.forEach((el) => {
      el.classList.remove(HIDDEN_CLASS);
      // Force reflow so transition triggers
      el.offsetHeight;
      el.classList.add('gitglam-focus-entering');
    });

    // Clean up animation class
    setTimeout(() => {
      document.querySelectorAll('.gitglam-focus-entering').forEach((el) => {
        el.classList.remove('gitglam-focus-entering');
      });
    }, 380);
  }

  function isActive() {
    return active;
  }

  return { enable, disable, isActive };
})();
