import store from '../lib/store';
import * as API from '../lib/api';
import * as Link from '../lib/link';

store.register('query', query => {
  const url = new URL(location.href);

  if (store.query.search) {
    url.pathname = '/';
    url.searchParams.set('search', store.query.search);
  }

  if (store.query.categories.length) {
    url.searchParams.set('categories', store.query.categories.join(','));
  } else {
    url.searchParams.delete('categories');
  }

  Link.goTo(url.toString());
  return;
  const loadMoreRef = document.querySelector('.js-load-more');
  loadMoreRef.style.opacity = `1`;
  debugger;
  if (query && query.search && query.search.length) {
    loadMoreRef.style.opacity = `0`;
    //Добавляет параметр в URL
    const queryParams = new URLSearchParams();
    queryParams.set('search', query.search);
    window.history.pushState(null, null, '?' + queryParams.toString());

    API.request(`/call/find?search=${query.search}`).then(data => store.setProducts(data));

    return;
  }

  if (query && query.categories && query.categories.length) {
    loadMoreRef.style.opacity = `0`;
    const currentCategoriesUrl = query.categories;
    const allPromise = [];
    currentCategoriesUrl.forEach(currentCategoryUrl => {
      allPromise.push(API.request(`/call/specific/${currentCategoryUrl}`));
    });

    const queryParams = new URLSearchParams();
    queryParams.set('categories', currentCategoriesUrl);
    window.history.pushState(null, null, '?' + queryParams.toString());

    Promise.all(allPromise).then(data => {
      const res = {};
      if (data && data.length) {
        data.forEach(row => {
          if (row && row.length) {
            const cat = row[0].category;
            res[cat] = row;
          }
        });
      }
      store.setProducts(res);
    });

    return;
  }
  // запрос для поиска "смотреть все"
  if (query && query.chosenCategory) {
    loadMoreRef.style.opacity = `0`;
    const queryParams = new URLSearchParams();
    queryParams.set('chosenCategory', query.chosenCategory);
    window.history.pushState(null, null, '?' + queryParams.toString());

    API.request(`/call/specific/${query.chosenCategory}`).then(data => {
      store.setProducts(data);
      console.log(data);
    });

    return;
  }

  if (query && query.page) {
    if (store.query.page >= 3) {
      loadMoreRef.style.opacity = `0`;
    }

    API.request(`/call?page=${query.page}`).then(data => {
      if (!data.error) {
        store.setProducts({ ...store.products, ...data });
      }
    });
    return;
  }

  window.history.pushState(null, null, '/');

  API.request(`/call?page=1`).then(data => store.setProducts(data));
});
