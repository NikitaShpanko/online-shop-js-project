import goTo from './goTo';
import store from '../store';
import QueryString from 'qs';

export default function init() {
  document.addEventListener('click', e => {
    if (!e.target.closest('a')) return;
    const href = e.target.closest('a').getAttribute('href');
    if (href[0] !== '/') return;
    e.preventDefault();
    store.query.categories = [];
    goTo(href);
  });

  window.addEventListener('popstate', () => goTo(location.href, true, false));
}
