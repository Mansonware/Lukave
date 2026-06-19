const header = document.querySelector('.header');
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
const mobileQuery = window.matchMedia('(max-width: 700px)');

addEventListener('scroll', () => {
  header?.classList.toggle('scrolled', scrollY > 12);
}, { passive: true });

menu?.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!isOpen));
  menu.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  menu.classList.toggle('open', !isOpen);
  nav?.classList.toggle('open', !isOpen);
});

nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu?.setAttribute('aria-expanded', 'false');
  menu?.classList.remove('open');
  nav.classList.remove('open');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .06 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const dockTabs = [...document.querySelectorAll('.dock-link[data-tab]')];
const tabPanels = [...document.querySelectorAll('.tab-content')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionAllowed = matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)');

function activateTab(targetId, shouldScroll = true, updateHash = true) {
  const targetPanel = document.getElementById(targetId);
  if (!targetPanel) return;

  dockTabs.forEach(tab => {
    const isActive = tab.dataset.tab === targetId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  const activeDock = dockTabs.find(tab => tab.dataset.tab === targetId);
  if (activeDock && !reducedMotion.matches) {
    activeDock.classList.remove('nav-pop');
    requestAnimationFrame(() => activeDock.classList.add('nav-pop'));
  }

  tabPanels.forEach(panel => {
    const isActive = panel === targetPanel;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', String(mobileQuery.matches && !isActive));
  });

  if (mobileQuery.matches && !reducedMotion.matches) {
    targetPanel.classList.remove('tab-enter');
    requestAnimationFrame(() => targetPanel.classList.add('tab-enter'));
  }

  if (mobileQuery.matches && updateHash && location.hash !== `#${targetId}`) {
    history.replaceState(null, '', `#${targetId}`);
  }

  if (shouldScroll && mobileQuery.matches) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

dockTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab.dataset.tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    const direction = event.key === 'ArrowRight' ? 1 : -1;
    const nextIndex = (index + direction + dockTabs.length) % dockTabs.length;
    dockTabs[nextIndex].focus();
    activateTab(dockTabs[nextIndex].dataset.tab);
  });
});

document.querySelectorAll('[data-open-tab]').forEach(control => {
  control.addEventListener('click', event => {
    if (!mobileQuery.matches) return;
    event.preventDefault();
    activateTab(control.dataset.openTab);
  });
});

function syncTabMode() {
  if (mobileQuery.matches) {
    const hashTarget = location.hash.slice(1);
    const hashTab = dockTabs.find(tab => tab.dataset.tab === hashTarget);
    const activeTab = hashTab ?? dockTabs.find(tab => tab.classList.contains('active')) ?? dockTabs[0];
    activateTab(activeTab.dataset.tab, false, false);
  } else {
    tabPanels.forEach(panel => panel.setAttribute('aria-hidden', 'false'));
  }
}

mobileQuery.addEventListener('change', syncTabMode);
addEventListener('hashchange', () => {
  if (!mobileQuery.matches) return;
  const targetId = location.hash.slice(1);
  if (tabPanels.some(panel => panel.id === targetId)) activateTab(targetId, false, false);
});
syncTabMode();

// Lightweight liquid-glass reflection for precise pointer devices only.
const liquidCards = document.querySelectorAll([
  '.app-window', '.creator-row article', '.mini-cta', '.community-feature',
  '.community-card', '.moderation-card', '.market-card', '.seller-card',
  '.phase', '.profile-shell', '.earnings-card', '.membership-card', '.profile-products'
].join(','));

if (motionAllowed.matches) {
  liquidCards.forEach(card => {
    let frameId;
    card.classList.add('liquid-interactive');

    card.addEventListener('pointermove', event => {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const bounds = card.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const y = event.clientY - bounds.top;
        const rotateY = ((x / bounds.width) - .5) * 3.8;
        const rotateX = (.5 - (y / bounds.height)) * 3.8;

        card.style.setProperty('--mx', `${x}px`);
        card.style.setProperty('--my', `${y}px`);
        card.style.setProperty('--rx', `${rotateX}deg`);
        card.style.setProperty('--ry', `${rotateY}deg`);
      });
    }, { passive: true });

    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frameId);
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
      card.style.removeProperty('--rx');
      card.style.removeProperty('--ry');
    });
  });
}

// PWA Service Worker Registration
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js').catch(err => console.log('SW reg failed', err));
  });
}
