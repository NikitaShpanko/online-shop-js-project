import goTo from './goTo';

export default function init() {
  document.addEventListener('click', e => {
    if (!e.target.closest('a')) return;
    const href = e.target.closest('a').getAttribute('href');
    if (href[0] !== '/') return;
    e.preventDefault();
    goTo(href);
  });

  window.addEventListener('popstate', () => goTo(location.href));
}
