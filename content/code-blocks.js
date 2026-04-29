// GitGlam — Code Block Enhancements
// Adds language labels and copy-to-clipboard buttons to code blocks.

const GitGlamCodeBlocks = (() => {
  const COPY_ICON = `<svg viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
  const CHECK_ICON = `<svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>`;

  function enhance(markdownBody) {
    const pres = markdownBody.querySelectorAll('pre');
    pres.forEach((pre) => {
      // Skip if already enhanced
      if (pre.dataset.gitglamEnhanced) return;
      pre.dataset.gitglamEnhanced = 'true';
      pre.style.position = 'relative';

      const code = pre.querySelector('code');

      // Detect language from class name
      if (code) {
        const langClass = Array.from(code.classList).find(
          (c) => c.startsWith('language-') || c.startsWith('highlight-source-')
        );
        if (langClass) {
          const lang = langClass
            .replace('language-', '')
            .replace('highlight-source-', '');
          const label = document.createElement('span');
          label.className = 'gitglam-code-lang';
          label.textContent = lang;
          pre.appendChild(label);
        }
      }

      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.className = 'gitglam-copy-btn';
      copyBtn.setAttribute('aria-label', 'Copy code');
      copyBtn.innerHTML = COPY_ICON + '<span>Copy</span>';

      copyBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const text = code ? code.textContent : pre.textContent;
        try {
          await navigator.clipboard.writeText(text);
          copyBtn.innerHTML = CHECK_ICON + '<span>Copied!</span>';
          copyBtn.classList.add('gitglam-copied');
          setTimeout(() => {
            copyBtn.innerHTML = COPY_ICON + '<span>Copy</span>';
            copyBtn.classList.remove('gitglam-copied');
          }, 2000);
        } catch {
          // Fallback: select text
          const range = document.createRange();
          range.selectNodeContents(code || pre);
          const sel = window.getSelection();
          sel.removeAllRanges();
          sel.addRange(range);
        }
      });

      pre.appendChild(copyBtn);
    });
  }

  function cleanup(markdownBody) {
    if (!markdownBody) return;
    markdownBody.querySelectorAll('.gitglam-code-lang, .gitglam-copy-btn').forEach((el) => el.remove());
    markdownBody.querySelectorAll('pre[data-gitglam-enhanced]').forEach((pre) => {
      delete pre.dataset.gitglamEnhanced;
    });
  }

  return { enhance, cleanup };
})();
