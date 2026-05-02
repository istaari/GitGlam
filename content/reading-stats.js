// GitGlam — Reading Stats Module
// Progress bar.

const GitGlamReadingStats = (() => {
  let progressBar = null;
  let scrollHandler = null;
  let markdownBodyRef = null;

  function init(markdownBody, options = {}) {
    destroy();
    markdownBodyRef = markdownBody;

    if (options.progressBar !== false) {
      createProgressBar();
    }
  }

  function createProgressBar() {
    progressBar = document.createElement('div');
    progressBar.className = 'gitglam-progress-bar';
    document.body.appendChild(progressBar);

    scrollHandler = () => {
      if (!markdownBodyRef) return;
      const rect = markdownBodyRef.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) {
        progressBar.style.width = '100%';
        return;
      }
      const scrolled = -rect.top;
      const pct = Math.min(Math.max((scrolled / total) * 100, 0), 100);
      progressBar.style.width = pct + '%';
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    scrollHandler(); // initial
  }

  function destroy() {
    if (scrollHandler) {
      window.removeEventListener('scroll', scrollHandler);
      scrollHandler = null;
    }
    if (progressBar) {
      progressBar.remove();
      progressBar = null;
    }
    markdownBodyRef = null;
  }

  return { init, destroy };
})();
