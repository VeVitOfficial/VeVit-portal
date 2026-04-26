/* ===========================================
   VeVit — vevit.fun
   Vanilla JS interactions
   =========================================== */

(() => {
  'use strict';

  /* ---------- Lucide icons ---------- */
  const initIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };

  /* ---------- Sticky nav backdrop on scroll ---------- */
  const initNavScroll = () => {
    const nav = document.querySelector('[data-nav]');
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add('nav-scrolled');
      else nav.classList.remove('nav-scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  };

  /* ---------- "Aplikace ▾" dropdown ---------- */
  const initDropdown = () => {
    const trigger = document.querySelector('[data-dropdown-trigger]');
    const menu    = document.querySelector('[data-dropdown-menu]');
    if (!trigger || !menu) return;

    let open = false;

    const setOpen = (next) => {
      open = next;
      menu.dataset.open = String(next);
      trigger.setAttribute('aria-expanded', String(next));
    };

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      setOpen(!open);
    });

    document.addEventListener('click', (e) => {
      if (!open) return;
      if (menu.contains(e.target) || trigger.contains(e.target)) return;
      setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && open) {
        setOpen(false);
        trigger.focus();
      }
    });
  };

  /* ---------- Mobile menu (hamburger) ---------- */
  const initMobileMenu = () => {
    const open    = document.querySelector('[data-mobile-open]');
    const close   = document.querySelector('[data-mobile-close]');
    const panel   = document.querySelector('[data-mobile-panel]');
    const overlay = document.querySelector('[data-mobile-overlay]');
    if (!open || !panel || !overlay) return;

    let lastFocused = null;

    const setOpen = (next) => {
      panel.dataset.open   = String(next);
      overlay.dataset.open = String(next);
      open.setAttribute('aria-expanded', String(next));
      document.body.style.overflow = next ? 'hidden' : '';

      if (next) {
        lastFocused = document.activeElement;
        const first = panel.querySelector('a, button');
        if (first) first.focus();
      } else if (lastFocused) {
        lastFocused.focus();
      }
    };

    open.addEventListener('click', () => setOpen(true));
    if (close) close.addEventListener('click', () => setOpen(false));
    overlay.addEventListener('click', () => setOpen(false));

    // Close on ESC + simple focus trap
    document.addEventListener('keydown', (e) => {
      if (panel.dataset.open !== 'true') return;

      if (e.key === 'Escape') { setOpen(false); return; }

      if (e.key === 'Tab') {
        const focusables = panel.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last  = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    // Close panel when a link inside is clicked
    panel.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });
  };

  /* ---------- CTA tracking placeholders ---------- */
  const initTracking = () => {
    document.querySelectorAll('[data-track]').forEach((el) => {
      el.addEventListener('click', () => {
        // Placeholder — real analytics integration goes here.
        // eslint-disable-next-line no-console
        console.log('[vevit:track]', el.dataset.track);
      });
    });
  };

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initIcons();
    initNavScroll();
    initDropdown();
    initMobileMenu();
    initTracking();
  });
})();
