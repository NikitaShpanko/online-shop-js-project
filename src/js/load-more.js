//import store from '../lib/store';
import * as Link from '../lib/link';

const loadMoreRef = document.querySelector('.js-load-more');

loadMoreRef.addEventListener('click', () => {
  Link.loadNextPage();
  //store.setQuery({ page: store.query && store.query.page ? store.query.page + 1 : 2 });
});
