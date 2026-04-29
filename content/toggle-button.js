// GitGlam — Toggle Button Module
// Injects a floating reading-mode toggle on markdown pages.

const GitGlamToggle = (() => {
  let btn = null;

  const BOOK_ICON = `<svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;

  function create(onToggle) {
    if (btn) return btn;
    btn = document.createElement('button');
    btn.className = 'gitglam-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle GitGlam reading mode');
    btn.title = 'Toggle reading mode';
    btn.innerHTML = BOOK_ICON;
    btn.addEventListener('click', () => {
      onToggle();
    });
    document.body.appendChild(btn);
    return btn;
  }

  function setActive(active) {
    if (!btn) return;
    btn.classList.toggle('gitglam-toggle-active', active);
  }

  function destroy() {
    if (btn) {
      btn.remove();
      btn = null;
    }
  }

  return { create, setActive, destroy };
})();
