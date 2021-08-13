import store from '../lib/store';

const loadMoreRef = document.querySelector('.js-load-more');

loadMoreRef.addEventListener('click', () => {
  store.setQuery({ page: store.query && store.query.page ? store.query.page + 1 : 2 });
});
