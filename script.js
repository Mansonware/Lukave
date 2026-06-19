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

function activateTab(targetId, shouldScroll = true, updateHash = true) {
  const targetPanel = document.getElementById(targetId);
  if (!targetPanel) return;

  dockTabs.forEach(tab => {
    const isActive = tab.dataset.tab === targetId;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', String(isActive));
    tab.setAttribute('tabindex', isActive ? '0' : '-1');
  });

  tabPanels.forEach(panel => {
    const isActive = panel === targetPanel;
    panel.classList.toggle('active', isActive);
    panel.setAttribute('aria-hidden', String(mobileQuery.matches && !isActive));
  });

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
