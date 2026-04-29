// GitGlam — Reading Stats Module
// Progress bar + estimated reading time.

const GitGlamReadingStats = (() => {
  let progressBar = null;
  let readingTimeBadge = null;
  let scrollHandler = null;
  let markdownBodyRef = null;

  const CLOCK_ICON = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
  const WPM = 230;

  function init(markdownBody, options = {}) {
    destroy();
    markdownBodyRef = markdownBody;

    if (options.progressBar !== false) {
      createProgressBar();
    }

    if (options.readingTime !== false) {
      createReadingTimeBadge(markdownBody);
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

  function createReadingTimeBadge(markdownBody) {
    // Count words: exclude code blocks
    const clone = markdownBody.cloneNode(true);
    clone.querySelectorAll('pre, code, script, style').forEach((el) => el.remove());
    const text = clone.textContent || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / WPM));

    readingTimeBadge = document.createElement('div');
    readingTimeBadge.className = 'gitglam-reading-time';
    readingTimeBadge.innerHTML = `${CLOCK_ICON} <span>${minutes} min read &middot; ${words.toLocaleString()} words</span>`;

    // Insert at top of markdown body
    const firstChild = markdownBody.firstChild;
    if (firstChild) {
      markdownBody.insertBefore(readingTimeBadge, firstChild);
    } else {
      markdownBody.appendChild(readingTimeBadge);
    }
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
    if (readingTimeBadge) {
      readingTimeBadge.remove();
      readingTimeBadge = null;
    }
    markdownBodyRef = null;
  }

  return { init, destroy };
})();
