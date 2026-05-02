/**
 * gallery.js — single-image viewer for larypsed.com
 *
 * Navigation:
 *   - Click right half of image → next
 *   - Click left half of image  → previous
 *   - Keyboard ArrowRight / ArrowLeft
 *   - Touch swipe left  → next
 *   - Touch swipe right → previous
 *   - URL hash deep-linking (history.pushState / popstate)
 *
 * Zero dependencies.
 */

(function () {
  'use strict';

  const dataList   = document.getElementById('gallery-data');
  const mainImage  = document.getElementById('main-image');
  const captionEl  = document.getElementById('caption-title');
  const prevZone   = document.getElementById('gallery-prev-zone');
  const nextZone   = document.getElementById('gallery-next-zone');

  if (!dataList || !mainImage) return;

  /* -------------------------------------------------------------------------
     Build items array from hidden <li> elements
     ---------------------------------------------------------------------- */
  const items = Array.from(dataList.querySelectorAll('li[data-slug]'));
  let current = 0;

  /* -------------------------------------------------------------------------
     Navigate to an item by index
     ---------------------------------------------------------------------- */
  function goTo(index, pushState) {
    if (items.length === 0) return;
    // Wrap around
    index = ((index % items.length) + items.length) % items.length;
    current = index;

    const item    = items[current];
    const src     = item.dataset.src;
    const alt     = item.dataset.title || '';
    const caption = item.dataset.caption || '';
    const slug    = item.dataset.slug;

    // Fade out
    mainImage.classList.add('is-loading');

    const img = new Image();
    img.onload = function () {
      mainImage.src = src;
      mainImage.alt = alt;
      captionEl.innerHTML = (alt ? alt + '<br/>' : '') + caption;
      mainImage.classList.remove('is-loading');
    };
    img.onerror = function () {
      mainImage.src = src;
      mainImage.alt = alt;
      mainImage.classList.remove('is-loading');
    };
    img.src = src;

    // Update URL hash
    if (pushState !== false) {
      history.pushState({ index: current }, '', location.pathname + (slug ? '#' + slug : ''));
    }
  }

  function prev() { goTo(current - 1); }
  function next() { goTo(current + 1); }

  /* -------------------------------------------------------------------------
     Find item index by slug
     ---------------------------------------------------------------------- */
  function indexBySlug(slug) {
    for (let i = 0; i < items.length; i++) {
      if (items[i].dataset.slug === slug) return i;
    }
    return -1;
  }

  /* -------------------------------------------------------------------------
     Click zones
     ---------------------------------------------------------------------- */
  if (prevZone) prevZone.addEventListener('click', prev);
  if (nextZone) nextZone.addEventListener('click', next);

  /* -------------------------------------------------------------------------
     Keyboard navigation
     ---------------------------------------------------------------------- */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft')  { e.preventDefault(); prev(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
  });

  /* -------------------------------------------------------------------------
     Touch swipe
     ---------------------------------------------------------------------- */
  const SWIPE_THRESHOLD = 50;
  let touchStartX = null;
  let touchStartY = null;

  document.addEventListener('touchstart', function (e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    if (touchStartX === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= SWIPE_THRESHOLD) {
      if (dx < 0) next();
      else        prev();
    }
    touchStartX = null;
    touchStartY = null;
  }, { passive: true });

  /* -------------------------------------------------------------------------
     Browser back / forward
     ---------------------------------------------------------------------- */
  window.addEventListener('popstate', function () {
    const slug = location.hash.replace(/^#/, '');
    const idx  = slug ? indexBySlug(slug) : 0;
    goTo(idx !== -1 ? idx : 0, false);
  });

  /* -------------------------------------------------------------------------
     Initial load
     ---------------------------------------------------------------------- */
  const initSlug = location.hash.replace(/^#/, '');
  const initIdx  = initSlug ? indexBySlug(initSlug) : -1;
  goTo(initIdx !== -1 ? initIdx : 0, false);

})();
