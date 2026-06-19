const header = document.querySelector('.header');
const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');

addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 12), { passive: true });

menu.addEventListener('click', () => {
  const isOpen = menu.getAttribute('aria-expanded') === 'true';
  menu.setAttribute('aria-expanded', String(!isOpen));
  menu.setAttribute('aria-label', isOpen ? 'Abrir menu' : 'Fechar menu');
  menu.classList.toggle('open', !isOpen);
  nav.classList.toggle('open', !isOpen);
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.setAttribute('aria-expanded', 'false');
  menu.classList.remove('open');
  nav.classList.remove('open');
}));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) {
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  }
}), { threshold: .08 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
