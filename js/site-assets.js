// Centraliza os assets de imagem servidos pelo Supabase Storage.
(function attachSiteAssets(windowObject, documentObject) {
  const STORAGE_BASE_URL =
    'https://huxrqluykzicckxjgchf.supabase.co/storage/v1/object/public/site-assets/site/v1';
  const IMAGE_PLACEHOLDER =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 3'%3E%3C/svg%3E";

  function buildPhotoUrl(slug, variant, format = 'jpg') {
    return `${STORAGE_BASE_URL}/images/${slug}-${variant}.${format}`;
  }

  function buildPhotoSrcSet(slug, format = 'jpg') {
    return [
      `${buildPhotoUrl(slug, 'sm', format)} 640w`,
      `${buildPhotoUrl(slug, 'md', format)} 1280w`,
      `${buildPhotoUrl(slug, 'lg', format)} 1920w`,
    ].join(', ');
  }

  function loadImage(imageElement) {
    if (!imageElement || imageElement.dataset.assetLoaded === 'true') {
      return;
    }

    const assetPhoto = imageElement.dataset.assetPhoto;
    if (!assetPhoto) {
      return;
    }

    const format = imageElement.dataset.assetFormat || 'webp';
    const fallback = imageElement.dataset.assetFallback || 'sm';

    imageElement.decoding = imageElement.decoding || 'async';
    imageElement.sizes = imageElement.sizes || imageElement.dataset.assetSizes || '100vw';
    imageElement.src = buildPhotoUrl(assetPhoto, fallback, format);
    imageElement.srcset = buildPhotoSrcSet(assetPhoto, format);
    imageElement.dataset.assetLoaded = 'true';
  }

  function prepareLazyImages() {
    const images = documentObject.querySelectorAll('img[data-asset-photo]');
    if (!images.length) {
      return;
    }

    const eagerImages = [];
    const lazyImages = [];

    images.forEach((imageElement) => {
      if (!imageElement.getAttribute('src')) {
        imageElement.setAttribute('src', IMAGE_PLACEHOLDER);
      }

      if (!imageElement.getAttribute('loading')) {
        imageElement.setAttribute('loading', 'lazy');
      }

      imageElement.setAttribute('decoding', imageElement.getAttribute('decoding') || 'async');

      if (imageElement.getAttribute('loading') === 'eager' || imageElement.dataset.assetEager === 'true') {
        eagerImages.push(imageElement);
      } else {
        lazyImages.push(imageElement);
      }
    });

    eagerImages.forEach(loadImage);

    if (!lazyImages.length || !('IntersectionObserver' in windowObject)) {
      lazyImages.forEach(loadImage);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          loadImage(entry.target);
          observer.unobserve(entry.target);
        });
      },
      {
        rootMargin: '300px 0px',
        threshold: 0.01,
      },
    );

    lazyImages.forEach((imageElement) => observer.observe(imageElement));
  }

  windowObject.IBRSiteAssets = {
    baseUrl: STORAGE_BASE_URL,
    placeholder: IMAGE_PLACEHOLDER,
    buildPhotoUrl,
    buildPhotoSrcSet,
    loadImage,
    prepareLazyImages,
  };

  documentObject.addEventListener('DOMContentLoaded', prepareLazyImages);
})(window, document);
