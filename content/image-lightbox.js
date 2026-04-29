// GitGlam — Image Lightbox Module
// Click-to-expand images with overlay, navigation, and keyboard support.

const GitGlamLightbox = (() => {
  let overlay = null;
  let images = [];
  let currentIndex = 0;

  const MIN_IMAGE_SIZE = 50; // skip tiny badge/icon images

  function init(markdownBody) {
    destroy();
    images = Array.from(markdownBody.querySelectorAll('img')).filter((img) => {
      // Skip tiny images (badges, status icons)
      return img.naturalWidth > MIN_IMAGE_SIZE || img.width > MIN_IMAGE_SIZE;
    });

    images.forEach((img, i) => {
      if (img.dataset.gitglamLightbox) return;
      img.dataset.gitglamLightbox = i;
      img.addEventListener('click', onImageClick);
    });
  }

  function onImageClick(e) {
    e.preventDefault();
    e.stopPropagation();
    const index = parseInt(e.currentTarget.dataset.gitglamLightbox, 10);
    open(index);
  }

  function open(index) {
    currentIndex = index;
    const src = images[currentIndex]?.src;
    if (!src) return;

    overlay = document.createElement('div');
    overlay.className = 'gitglam-lightbox-overlay';
    overlay.addEventListener('click', onOverlayClick);

    const img = document.createElement('img');
    img.className = 'gitglam-lightbox-img';
    img.src = src;
    img.alt = images[currentIndex]?.alt || '';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'gitglam-lightbox-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close lightbox');
    closeBtn.addEventListener('click', close);

    overlay.appendChild(img);
    overlay.appendChild(closeBtn);

    // Navigation arrows if more than one image
    if (images.length > 1) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'gitglam-lightbox-nav gitglam-lightbox-prev';
      prevBtn.innerHTML = '&#8249;';
      prevBtn.setAttribute('aria-label', 'Previous image');
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(-1);
      });

      const nextBtn = document.createElement('button');
      nextBtn.className = 'gitglam-lightbox-nav gitglam-lightbox-next';
      nextBtn.innerHTML = '&#8250;';
      nextBtn.setAttribute('aria-label', 'Next image');
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigate(1);
      });

      overlay.appendChild(prevBtn);
      overlay.appendChild(nextBtn);
    }

    document.body.appendChild(overlay);
    document.addEventListener('keydown', onKeydown);

    // Trigger animation
    requestAnimationFrame(() => {
      overlay.classList.add('gitglam-lightbox-visible');
    });
  }

  function navigate(delta) {
    currentIndex = (currentIndex + delta + images.length) % images.length;
    const img = overlay?.querySelector('.gitglam-lightbox-img');
    if (img && images[currentIndex]) {
      img.src = images[currentIndex].src;
      img.alt = images[currentIndex].alt || '';
    }
  }

  function onOverlayClick(e) {
    if (e.target === overlay) {
      close();
    }
  }

  function onKeydown(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') navigate(-1);
    if (e.key === 'ArrowRight') navigate(1);
  }

  function close() {
    if (!overlay) return;
    overlay.classList.remove('gitglam-lightbox-visible');
    document.removeEventListener('keydown', onKeydown);
    setTimeout(() => {
      overlay?.remove();
      overlay = null;
    }, 250);
  }

  function destroy() {
    close();
    images.forEach((img) => {
      img.removeEventListener('click', onImageClick);
      delete img.dataset.gitglamLightbox;
    });
    images = [];
  }

  return { init, destroy };
})();
