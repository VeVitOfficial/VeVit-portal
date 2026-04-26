/* ============================================
   VeVit — Premium dropdown, billing toggle, tier state, stats counter
   ============================================ */
(function () {
  'use strict';

  /* ---------- Premium dropdown in nav ---------- */
  const initPremiumDropdown = () => {
    const trigger = document.querySelector('[data-premium-trigger]');
    const menu    = document.querySelector('[data-premium-menu]');
    if (!trigger || !menu) return;

    const open = () => {
      menu.dataset.open = 'true';
      trigger.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      menu.dataset.open = 'false';
      trigger.setAttribute('aria-expanded', 'false');
    };
    const toggle = () => (menu.dataset.open === 'true' ? close() : open());

    trigger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
    menu.addEventListener('click', (e) => e.stopPropagation());
    document.addEventListener('click', close);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });

    // hover open on desktop
    const wrap = trigger.closest('.dropdown-wrap');
    if (wrap && window.matchMedia('(hover: hover)').matches) {
      let timer;
      wrap.addEventListener('mouseenter', () => { clearTimeout(timer); open(); });
      wrap.addEventListener('mouseleave', () => { timer = setTimeout(close, 180); });
    }
  };

  /* ---------- Billing toggle ---------- */
  const initBillingToggle = () => {
    const buttons = document.querySelectorAll('.billing-btn[data-billing]');
    if (!buttons.length) return;

    const setBilling = (mode) => {
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.billing === mode)));

      // toggle price spans
      document.querySelectorAll('[data-price-monthly]').forEach((el) => { el.hidden = mode !== 'monthly'; });
      document.querySelectorAll('[data-price-yearly]').forEach((el)  => { el.hidden = mode !== 'yearly'; });
      document.querySelectorAll('[data-period-monthly]').forEach((el) => { el.hidden = mode !== 'monthly'; });
      document.querySelectorAll('[data-period-yearly]').forEach((el)  => { el.hidden = mode !== 'yearly'; });
      document.querySelectorAll('[data-alt-monthly]').forEach((el)   => { el.hidden = mode !== 'monthly'; });
      document.querySelectorAll('[data-alt-yearly]').forEach((el)    => { el.hidden = mode !== 'yearly'; });

      document.documentElement.dataset.billing = mode;
    };

    buttons.forEach((b) => b.addEventListener('click', () => setBilling(b.dataset.billing)));
  };

  /* ---------- Tier state (anon / free / bronze / silver / gold / platinum) ---------- */
  const TIER_NAMES = { bronze: 'Bronze', silver: 'Silver', gold: 'Gold', platinum: 'Platinum' };
  const TIER_EXP   = {
    bronze:   '15. ledna 2026',
    silver:   '02. března 2026',
    gold:     '21. dubna 2026',
    platinum: '08. června 2026',
  };

  const applyTierState = (state) => {
    const section = document.querySelector('[data-tier-state]');
    if (!section) return;
    section.dataset.tierState = state;

    const gate  = document.querySelector('[data-premium-gate]');
    const plans = document.querySelector('[data-premium-plans]');
    if (gate && plans) {
      gate.hidden  = state !== 'anon';
      plans.hidden = state === 'anon';
    }

    // free user CTA pill in nav
    document.querySelectorAll('[data-tier-show]').forEach((el) => {
      el.style.display = el.dataset.tierShow === state ? 'inline-flex' : 'none';
    });

    // reset all cards
    document.querySelectorAll('.tier-card[data-tier]').forEach((card) => {
      const tier = card.dataset.tier;
      card.removeAttribute('data-current');

      // restore CTA if previously replaced
      const existingCurrent = card.querySelector('.tier-current-state');
      if (existingCurrent) existingCurrent.remove();
      const cta = card.querySelector('.tier-cta');
      if (cta) {
        cta.hidden = false;
        cta.disabled = false;
        cta.textContent = `Vybrat ${TIER_NAMES[tier] || tier}`;
      }
    });

    // mark current tier
    if (TIER_NAMES[state]) {
      const card = document.querySelector(`.tier-card[data-tier="${state}"]`);
      if (card) {
        card.setAttribute('data-current', 'true');
        // Replace pin if not already a structural pin (popular/business stays)
        const cta = card.querySelector('.tier-cta');
        if (cta) cta.hidden = true;
        const stateEl = document.createElement('div');
        stateEl.className = 'tier-current-state';
        stateEl.innerHTML = `Tvůj aktuální plán<span class="exp">aktivní do ${TIER_EXP[state]}</span>`;
        cta.parentNode.insertBefore(stateEl, cta.nextSibling);
      }
    }

    // sync tweak buttons
    document.querySelectorAll('[data-tier-set]').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.tierSet === state));
    });
  };

  const initTierTweak = () => {
    document.querySelectorAll('[data-tier-set]').forEach((b) => {
      b.addEventListener('click', () => applyTierState(b.dataset.tierSet));
    });
    // default: free
    applyTierState('free');
  };

  /* ---------- Stripe checkout stub ---------- */
  const initCheckoutStubs = () => {
    document.querySelectorAll('[data-tier-cta]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tier = btn.dataset.tierCta;
        const billing = document.documentElement.dataset.billing || 'monthly';
        btn.disabled = true;
        const original = btn.textContent;
        btn.textContent = 'Přesměrovávám…';
        // mock — real prod calls /api/stripe-checkout.php
        console.log('[vevit:checkout]', { tier, billing });
        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = original;
        }, 1500);
      });
    });
  };

  /* ---------- Animated stat counter ---------- */
  const initStatsCounter = () => {
    const els = document.querySelectorAll('[data-stat-target]');
    if (!els.length) return;

    const animate = (el) => {
      const target = parseInt(el.dataset.statTarget, 10);
      if (isNaN(target)) return;
      const dur = 1400;
      const start = performance.now();
      const fmt = new Intl.NumberFormat('cs-CZ');
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        // easeOutCubic
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = fmt.format(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      els.forEach(animate);
      return;
    }

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.statDone) {
          entry.target.dataset.statDone = '1';
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    els.forEach((el) => io.observe(el));
  };

  /* ---------- Boot ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    initPremiumDropdown();
    initBillingToggle();
    initTierTweak();
    initCheckoutStubs();
    initStatsCounter();
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  });
})();
