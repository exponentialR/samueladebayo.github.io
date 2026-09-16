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
