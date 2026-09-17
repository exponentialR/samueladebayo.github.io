const balanceStyles = document.createElement('link');
balanceStyles.rel = 'stylesheet';
balanceStyles.href = 'assets/layout-balance.css?v=20260917-4';
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
