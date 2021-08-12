import store from '../lib/store';
import * as API from '../lib/api';

let page = 1;
const loadMoreRef = document.querySelector('.js-load-more');

loadMoreRef.addEventListener('click', e => {
  store.setQuery({ page: store.query && store.query.page ? store.query.page + 1 : 2 });
  console.log('query', store.query);
  if (store.query.page >= 3) {
    loadMoreRef.style.opacity = `0.5`;
  }
});
