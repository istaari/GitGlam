// GitGlam — Toggle Button Module
// Injects a floating reading-mode toggle on markdown pages.

const GitGlamToggle = (() => {
  let btn = null;
  let hideTimer = null;
  let mouseMoveHandler = null;

  const BOOK_ICON = `<svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`;

  const AUTO_HIDE_DELAY = 3000; // ms

  function resetHideTimer() {
    if (!btn) return;
    btn.style.opacity = '1';
    btn.style.transform = 'scale(1)';
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (btn && btn.classList.contains('gitglam-toggle-active')) {
        btn.style.opacity = '0.15';
        btn.style.transform = 'scale(0.85)';
      }
    }, AUTO_HIDE_DELAY);
  }

  function create(onToggle) {
    if (btn) return btn;
    btn = document.createElement('button');
    btn.className = 'gitglam-toggle-btn';
    btn.setAttribute('aria-label', 'Toggle GitGlam reading mode');
    btn.title = 'Toggle reading mode';
    btn.innerHTML = BOOK_ICON;
    btn.style.transition = 'opacity 0.4s ease, transform 0.3s ease, background 0.2s ease, color 0.2s ease';
    btn.addEventListener('click', () => {
      onToggle();
    });
    btn.addEventListener('mouseenter', () => {
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1)';
      clearTimeout(hideTimer);
    });
    btn.addEventListener('mouseleave', () => {
      resetHideTimer();
    });
    document.body.appendChild(btn);

    // Auto-hide on mouse inactivity
    mouseMoveHandler = resetHideTimer;
    document.addEventListener('mousemove', mouseMoveHandler);
    resetHideTimer();

    return btn;
  }

  function setActive(active) {
    if (!btn) return;
    btn.classList.toggle('gitglam-toggle-active', active);
    if (active) {
      resetHideTimer();
    } else {
      clearTimeout(hideTimer);
      btn.style.opacity = '1';
      btn.style.transform = 'scale(1)';
    }
  }

  function destroy() {
    clearTimeout(hideTimer);
    if (mouseMoveHandler) {
      document.removeEventListener('mousemove', mouseMoveHandler);
      mouseMoveHandler = null;
    }
    if (btn) {
      btn.remove();
      btn = null;
    }
  }

  return { create, setActive, destroy };
})();
