const balanceStyles = document.createElement('link');
balanceStyles.rel = 'stylesheet';
balanceStyles.href = 'assets/layout-balance.css?v=20260917-5';
document.head.appendChild(balanceStyles);

const toggle = document.querySelector('[data-nav-toggle]');
const menu = document.querySelector('[data-nav-menu]');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    menu.classList.toggle('is-open', !open);
  });
}

for (const link of document.querySelectorAll('[data-nav-menu] a')) {
  link.addEventListener('click', () => {
    if (toggle && menu) {
      toggle.setAttribute('aria-expanded', 'false');
      menu.classList.remove('is-open');
    }
  });
}

for (const carousel of document.querySelectorAll('[data-spotlight]')) {
  const slides = [...carousel.querySelectorAll('[data-spotlight-slide]')];
  const dots = [...carousel.querySelectorAll('[data-spotlight-dot]')];
  const previous = carousel.querySelector('[data-spotlight-prev]');
  const next = carousel.querySelector('[data-spotlight-next]');
  if (slides.length < 2) continue;

  let active = 0;
  let timer = null;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const show = (index) => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
      slide.tabIndex = selected ? 0 : -1;
    });
    dots.forEach((dot, i) => {
      const selected = i === active;
      dot.classList.toggle('is-active', selected);
      dot.setAttribute('aria-current', selected ? 'true' : 'false');
    });
  };

  const stop = () => {
    if (timer) window.clearInterval(timer);
    timer = null;
  };

  const start = () => {
    if (reduceMotion || timer) return;
    timer = window.setInterval(() => show(active + 1), 7000);
  };

  previous?.addEventListener('click', () => {
    show(active - 1);
    stop();
    start();
  });
  next?.addEventListener('click', () => {
    show(active + 1);
    stop();
    start();
  });
  dots.forEach((dot, i) => dot.addEventListener('click', () => {
    show(i);
    stop();
    start();
  }));

  carousel.addEventListener('mouseenter', stop);
  carousel.addEventListener('mouseleave', start);
  carousel.addEventListener('focusin', stop);
  carousel.addEventListener('focusout', (event) => {
    if (!carousel.contains(event.relatedTarget)) start();
  });
  carousel.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      show(active - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      show(active + 1);
    }
  });

  show(0);
  start();
}

// A quiet site-level research-updates prompt. It reuses the same Beehiiv form as
// the inline signup, appears after substantial reading, and remembers dismissal.
(() => {
  if (window.location.pathname.endsWith('/check-your-inbox.html')) return;

  const suppressionKey = 'sa-research-updates-popup-suppress-until';
  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  let suppressUntil = 0;
  try {
    suppressUntil = Number(window.localStorage.getItem(suppressionKey) || 0);
  } catch (_) {}
  if (suppressUntil > Date.now()) return;

  const overlay = document.createElement('div');
  overlay.className = 'research-popup-overlay';
  overlay.hidden = true;
  overlay.setAttribute('data-research-popup', '');
  overlay.innerHTML = `
    <section class="research-popup" role="dialog" aria-modal="true" aria-labelledby="research-popup-title">
      <button class="research-popup-close" type="button" aria-label="Close research updates signup">×</button>
      <div class="section-kicker">Research updates</div>
      <h2 id="research-popup-title">Occasional updates when there is something worth sharing.</h2>
      <p>New papers, datasets, research software and occasional technical notes. No fixed schedule.</p>
      <div class="research-popup-form" data-research-popup-form></div>
      <div class="research-popup-note">Double opt-in is enabled. You can unsubscribe at any time.</div>
    </section>`;
  document.body.appendChild(overlay);

  const dialog = overlay.querySelector('.research-popup');
  const closeButton = overlay.querySelector('.research-popup-close');
  const formMount = overlay.querySelector('[data-research-popup-form]');
  let formLoaded = false;
  let shown = false;
  let previousFocus = null;

  const loadForm = () => {
    if (formLoaded || !formMount) return;
    formLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://subscribe-forms.beehiiv.com/v3/loader.js';
    script.dataset.beehiivForm = '150eba12-66e8-4e0a-9c39-d4f7b43f9f45';
    formMount.appendChild(script);
  };

  const showPopup = () => {
    if (shown) return;
    shown = true;
    previousFocus = document.activeElement;
    overlay.hidden = false;
    loadForm();
    window.requestAnimationFrame(() => {
      overlay.classList.add('is-open');
      document.body.classList.add('research-popup-open');
      closeButton?.focus();
    });
    window.removeEventListener('scroll', checkScroll);
  };

  const closePopup = (remember = true) => {
    overlay.classList.remove('is-open');
    document.body.classList.remove('research-popup-open');
    if (remember) {
      try {
        window.localStorage.setItem(suppressionKey, String(Date.now() + thirtyDays));
      } catch (_) {}
    }
    window.setTimeout(() => {
      overlay.hidden = true;
      previousFocus?.focus?.();
    }, 180);
  };

  const checkScroll = () => {
    const root = document.documentElement;
    const scrollable = root.scrollHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const progress = window.scrollY / scrollable;
    if (progress >= 0.6) showPopup();
  };

  closeButton?.addEventListener('click', () => closePopup(true));
  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closePopup(true);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && overlay.classList.contains('is-open')) closePopup(true);
  });
  dialog?.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter((element) => !element.hasAttribute('disabled'));
    if (focusable.length < 2) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
})();
