// GitGlam — Scroll Animations Module
// Paragraph fade-in on scroll + active paragraph highlight

const GitGlamAnimations = (() => {
  'use strict';

  let observer = null;
  let focusObserver = null;
  let styleEl = null;
  let active = false;

  const ANIMATED_SELECTORS = [
    'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'ul', 'ol', 'blockquote', 'table',
    '.highlight', 'pre', 'img', '.task-list-item',
  ];

  function injectStyles() {
    if (styleEl) return;
    styleEl = document.createElement('style');
    styleEl.id = 'gitglam-animations';
    styleEl.textContent = `
      /* Fade-in on scroll */
      .gitglam-active .markdown-body .gitglam-animate {
        opacity: 0;
        transform: translateY(16px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      .gitglam-active .markdown-body .gitglam-animate.gitglam-visible {
        opacity: 1;
        transform: translateY(0);
      }

      /* Active paragraph highlight */
      .gitglam-active .markdown-body .gitglam-animate {
        transition: opacity 0.5s ease, transform 0.5s ease, filter 0.3s ease;
      }
      .gitglam-active .markdown-body.gitglam-focus-reading .gitglam-animate.gitglam-visible {
        opacity: 0.4;
        filter: blur(0px);
      }
      .gitglam-active .markdown-body.gitglam-focus-reading .gitglam-animate.gitglam-visible.gitglam-focused {
        opacity: 1;
        filter: blur(0px);
      }
    `;
    document.head.appendChild(styleEl);
  }

  function init(markdownBody) {
    if (active || !markdownBody) return;
    active = true;
    injectStyles();

    // Mark animatable children
    ANIMATED_SELECTORS.forEach((sel) => {
      markdownBody.querySelectorAll(`:scope > ${sel}`).forEach((el) => {
        el.classList.add('gitglam-animate');
      });
    });

    // IntersectionObserver for fade-in
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gitglam-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    markdownBody.querySelectorAll('.gitglam-animate').forEach((el) => {
      observer.observe(el);
    });

    // Active paragraph highlight — track which element is nearest viewport center
    markdownBody.classList.add('gitglam-focus-reading');

    focusObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('gitglam-focused');
          } else {
            entry.target.classList.remove('gitglam-focused');
          }
        });
      },
      {
        // Only the center 40% of viewport triggers "focused"
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0,
      }
    );

    markdownBody.querySelectorAll('.gitglam-animate').forEach((el) => {
      focusObserver.observe(el);
    });

    // Immediately reveal elements already in viewport
    requestAnimationFrame(() => {
      markdownBody.querySelectorAll('.gitglam-animate').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add('gitglam-visible');
        }
      });
    });
  }

  function destroy(markdownBody) {
    if (!active) return;
    active = false;

    if (observer) {
      observer.disconnect();
      observer = null;
    }
    if (focusObserver) {
      focusObserver.disconnect();
      focusObserver = null;
    }

    if (markdownBody) {
      markdownBody.classList.remove('gitglam-focus-reading');
      markdownBody.querySelectorAll('.gitglam-animate').forEach((el) => {
        el.classList.remove('gitglam-animate', 'gitglam-visible', 'gitglam-focused');
      });
    }

    if (styleEl && styleEl.parentNode) {
      styleEl.remove();
    }
    styleEl = null;
  }

  return { init, destroy };
})();
