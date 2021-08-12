import store from '../lib/store';
import * as API from '../lib/api';
import data from '../lib/api/get/request';
import Siema from 'siema';

store.register('query', query => {
  if (query && query.search && query.search.length) {
    //Добавляет параметр в URL
    const queryParams = new URLSearchParams();
    queryParams.set('search', query.search);
    window.history.pushState(null, null, '?' + queryParams.toString());

    API.request(`/call/find?search=${query.search}`).then(data => store.setProducts(data));

    return;
  }

  if (query && query.categories && query.categories.length) {
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
  // запрос для поиска "смотреть все""
  if (query && query.chosenCategory) {
    const queryParams = new URLSearchParams();
    queryParams.set('categories', query.chosenCategory);
    window.history.pushState(null, null, '?' + queryParams.toString());

    API.request(`/call/specific/${query.chosenCategory}`).then(data => {
      store.setProducts(data);
      console.log(data);
    });

    return;
  }

  if (query && query.page) {
    if (!data.error)
      API.request(`/call?page=${query.page}`).then(data =>
        store.setProducts({ ...store.products, ...data }),
      );
  }

  window.history.pushState(null, null, '/');

  API.request(`/call?page=1`).then(data => store.setProducts(data));
});
