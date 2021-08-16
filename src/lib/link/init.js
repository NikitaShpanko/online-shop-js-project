import goTo from './goTo';
import store from '../store';
import config from '../../config.json';

let prePath = '';

export default function init() {
  const projNameIndex = location.pathname.indexOf(config.projectName);
  if (projNameIndex < 0) return;
  prePath = location.pathname.slice(0, projNameIndex + config.projectName.length);

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

export { prePath };
